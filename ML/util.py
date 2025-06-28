import json
import torch
import clip
import faiss
import numpy as np
import yaml
import cv2
from PIL import Image
from ultralytics import YOLO
from sklearn.cluster import KMeans
from mediapipe.python.solutions.pose import Pose
import base64
import cv2
import os

# Load models
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)

clothing_model = YOLO("ML/best.pt")
face_model = YOLO("ML/yolov8n-face.pt")
pose_model = Pose(static_image_mode=True)

with open("ML/data.yaml", "r") as f:
    class_names = yaml.safe_load(f)["names"]

import re

def extract_first_price(price_str):
    if not isinstance(price_str, str):
        return None
    # Find all numeric values
    numbers = re.findall(r'\d[\d,]*', price_str)
    if numbers:
        price = int(numbers[0].replace(',', ''))
        return price
    return None

def detect_face_bbox_yolo(image_bgr):
    results = face_model.predict(image_bgr, verbose=False)[0]
    boxes = results.boxes.xyxy.cpu().numpy()
    if len(boxes) == 0:
        return None
    x1, y1, x2, y2 = map(int, max(boxes, key=lambda b: (b[2]-b[0]) * (b[3]-b[1])))
    return [int(x1), int(y1), int(x2), int(y2)]

def detect_skin_tone_from_yolo(image_bgr):
    face_bbox = detect_face_bbox_yolo(image_bgr)
    if not face_bbox:
        return "unknown"
    x1, y1, x2, y2 = face_bbox
    crop = image_bgr[y1:y2, x1:x2]
    if crop.size == 0:
        return "unknown"
    pixels = crop.reshape(-1, 3)
    kmeans = KMeans(n_clusters=2).fit(pixels)
    brightness = np.mean(kmeans.cluster_centers_[0])
    if brightness > 180: return "light"
    elif brightness > 100: return "medium"
    return "dark"

def estimate_body_type(image_bgr):
    results = pose_model.process(cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB))
    if not results.pose_landmarks:
        return "unknown"
    kp = results.pose_landmarks.landmark
    shoulder = abs(kp[11].x - kp[12].x)
    hip = abs(kp[23].x - kp[24].x)
    r = shoulder / (hip + 1e-6)
    if r > 1.2: return "inverted_triangle"
    elif r < 0.9: return "pear"
    return "rectangle"

def process_user_image(image_file, prompt):
    image = Image.open(image_file).convert("RGB")
    image_bgr = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    results = clothing_model.predict(image_bgr, verbose=False)[0]

    boxes = results.boxes.xyxy.cpu().numpy()
    labels = results.boxes.cls.cpu().numpy()

    embeddings = {cls: None for cls in class_names}
    for box, cls_id in zip(boxes, labels):
        x1, y1, x2, y2 = map(int, box)
        crop = image_bgr[y1:y2, x1:x2]
        crop_pil = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
        tensor = preprocess(crop_pil).unsqueeze(0).to(device)
        with torch.no_grad():
            emb = clip_model.encode_image(tensor).cpu().numpy()
        embeddings[class_names[int(cls_id)]] = emb.flatten().tolist()

    # Text embedding
    desc = prompt.split()[:30]
    text_input = clip.tokenize([" ".join(desc)]).to(device)
    with torch.no_grad():
        text_emb = clip_model.encode_text(text_input).cpu().numpy().flatten()

    skin_tone = detect_skin_tone_from_yolo(image_bgr)
    body_type = estimate_body_type(image_bgr)

    return embeddings, text_emb, body_type, skin_tone

def load_embeddings(path):
    with open(path) as f:
        db = json.load(f)

    vecs, metadata = [], []
    for i, entry in enumerate(db):
        vec = []
        valid = True

        for cls in class_names:
            item = entry["items"].get(cls)
            if item and "embedding" in item and len(item["embedding"]) == 512:
                vec.extend(item["embedding"])
            else:
                vec.extend([0]*512)

        if "text_embedding" not in entry or len(entry["text_embedding"]) != 512:
            print(f"[!] Skipping entry {i} due to invalid text embedding.")
            continue

        vec.extend(entry["text_embedding"])

        if len(vec) != 512 * (len(class_names) + 1):
            print(f"[!] Skipping entry {i} due to unexpected vector length: {len(vec)}")
            continue

        vecs.append(vec)
        metadata.append(entry)

    vecs_np = np.array(vecs).astype("float32")
    index = faiss.IndexFlatIP(vecs_np.shape[1])
    index.add(vecs_np)
    return index, metadata, class_names



def cosine_similarity(vec1, vec2):
    vec1 = np.squeeze(np.array(vec1))
    vec2 = np.squeeze(np.array(vec2))
    return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2) + 1e-8))




def retrieve_similar_outfits(user_embeddings, text_emb, body_type, skin_tone, budget, faiss_index, outfit_data, top_k=5, faiss_k=100):
    full_query = []
    for cls in class_names:
        emb = user_embeddings.get(cls)
        full_query.extend(emb if emb else [0] * 512)
    full_query.extend(text_emb)
    query_np = np.array(full_query).astype("float32").reshape(1, -1)

    _, indices = faiss_index.search(query_np, faiss_k)

    available_classes = [cls for cls, emb in user_embeddings.items() if emb is not None]
    missing_classes = [cls for cls in class_names if cls not in available_classes]

    scored_entries = []
    for idx in indices[0]:
        entry = outfit_data[idx]

        if (entry["body_type"] != body_type and entry["body_type"] != "unknown") or \
           (entry["skin_tone"] != skin_tone and entry["skin_tone"] != "unknown"):
            continue

        price = extract_first_price(entry["price"])
        if price and price > budget:
            continue

        sim = 0
        valid = 0
        for cls in available_classes:
            user_vec = user_embeddings.get(cls)
            candidate_item = entry["items"].get(cls)
            if user_vec and candidate_item:
                sim += cosine_similarity(user_vec, candidate_item["embedding"])
                valid += 1

        if valid == 0:
            continue

        clothing_score = sim / valid
        text_score = cosine_similarity(text_emb, entry["text_embedding"])
        final_score = 0.7 * clothing_score + 0.3 * text_score

        scored_entries.append((final_score, entry))

    scored_entries.sort(key=lambda x: -x[0])
    recommendations = []

    for score, entry in scored_entries[:top_k]:
        image_path = os.path.join("ML/images/images2", entry["imageFile"])   #Image path
        image = cv2.imread(image_path)

        items_to_return = {}

        for cls in missing_classes:
            item = entry["items"].get(cls)
            if item is not None and image is not None:
                x1, y1, x2, y2 = item["bbox"]
                crop = image[y1:y2, x1:x2]
                _, buffer = cv2.imencode('.jpg', crop)
                crop_base64 = base64.b64encode(buffer).decode("utf-8")

                items_to_return[cls] = {
                    "class": cls,
                    "bbox": item["bbox"],
                    "crop_base64": crop_base64
                }

        recommendations.append({
            "set_id": entry["imageFile"],
            "title": entry["title"],
            "url": entry["url"],
            "items": items_to_return
        })

    return recommendations
