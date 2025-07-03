import json
import torch
import faiss
import numpy as np
import yaml
import cv2
import os
from PIL import Image
from ultralytics import YOLO
from sklearn.cluster import KMeans
from mediapipe.python.solutions.pose import Pose
from transformers import CLIPProcessor, CLIPModel
import re
import insightface
from insightface.app import FaceAnalysis

def load_insightface_model():
    """
    Loads the InsightFace gender (and age) model using 'buffalo_l'.
    Returns the model ready for inference.
    """
    model = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
    model.prepare(ctx_id=0)
    print("InsightFace model loaded successfully.")
    return model

# Setup
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip").to(device)
processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")
gender_model=load_insightface_model()

clothing_model = YOLO("best.pt")
face_model = YOLO("yolov8n-face.pt")
pose_model = Pose(static_image_mode=True)

with open("data.yaml", "r") as f:
    class_names = yaml.safe_load(f)["names"]

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
IMAGE_DIR = os.path.join(BASE_DIR, "images")

# Category importance weights for outfit completion
CATEGORY_WEIGHTS = {
    "tops": 0.9,
    "bottoms": 0.9,
    "dresses": 0.95,
    "shoes": 0.7,
    "bags": 0.4,
    "accessories": 0.3,
    "outerwear": 0.6
}

# Utility functions

def detect_gender(img_bgr, model):
    """
    Performs gender detection using the given InsightFace model.

    Args:
        img_bgr (np.ndarray): BGR image as a numpy array.
        model: Loaded InsightFace model.

    Returns:
        List of dicts with gender, age, and bounding box.
    """
    if img_bgr is None or not hasattr(img_bgr, 'shape'):
        raise ValueError("Invalid image input.")

    faces = model.get(img_bgr)
    results = []

    for face in faces:
        gender = 'Female' if face.gender == 0 else 'Male'
        results.append({
            "bbox": [int(v) for v in face.bbox],
            "gender": gender,
            "age": int(face.age)
        })

    return results



def extract_first_price(price_str):
    if not isinstance(price_str, str):
        return None
    numbers = re.findall(r'\d[\d,]*', price_str)
    if numbers:
        return int(numbers[0].replace(',', ''))
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
    # Add in process_user_image()
    
    image = Image.open(image_file).convert("RGB")
    image_bgr = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    user_gender = None
    
    gender_results = detect_gender(image_bgr, gender_model)
    if gender_results:
        user_gender = gender_results[0]['gender'].lower()

    results = clothing_model.predict(image_bgr, verbose=False)[0]

    boxes = results.boxes.xyxy.cpu().numpy()
    labels = results.boxes.cls.cpu().numpy()

    embeddings = {cls: None for cls in class_names}
    for box, cls_id in zip(boxes, labels):
        x1, y1, x2, y2 = map(int, box)
        crop = image_bgr[y1:y2, x1:x2]
        crop_pil = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
        inputs = processor(images=crop_pil, return_tensors="pt").to(device)
        with torch.no_grad():
            emb = clip_model.get_image_features(**inputs)
        emb_norm = emb / emb.norm(dim=-1, keepdim=True)
        embeddings[class_names[int(cls_id)]] = emb_norm.cpu().numpy().flatten().tolist()

    # Text embedding
    desc = prompt.split()[:30]
    inputs = processor(text=[" ".join(desc)], return_tensors="pt").to(device)
    with torch.no_grad():
        text_emb = clip_model.get_text_features(**inputs)
    text_emb = text_emb / text_emb.norm(dim=-1, keepdim=True)

    skin_tone = detect_skin_tone_from_yolo(image_bgr)
    body_type = estimate_body_type(image_bgr)

    return embeddings, text_emb.cpu().numpy().flatten(), body_type, skin_tone, user_gender


def load_embeddings(path):
    with open(path) as f:
        db = json.load(f)

    vecs, metadata = [], []
    for i, entry in enumerate(db):
        vec = []

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

def compute_complementarity_score(user_embeddings, candidate_entry):
    """Compute how well candidate items complement user's existing items"""
    available_classes = [cls for cls, emb in user_embeddings.items() if emb is not None]
    
    # Look for style consistency across the complete outfit
    all_items = []
    
    # Add user's items
    for cls in available_classes:
        if user_embeddings[cls]:
            all_items.append(user_embeddings[cls])
    
    # Add candidate's missing items
    for cls in class_names:
        if cls not in available_classes:
            candidate_item = candidate_entry["items"].get(cls)
            if candidate_item and "embedding" in candidate_item:
                all_items.append(candidate_item["embedding"])
    
    if len(all_items) < 2:
        return 0.5
    
    # Compute pairwise similarities and look for moderate consistency
    similarities = []
    for i in range(len(all_items)):
        for j in range(i+1, len(all_items)):
            sim = cosine_similarity(all_items[i], all_items[j])
            similarities.append(sim)
    
    avg_sim = np.mean(similarities)
    # Sweet spot: moderate similarity indicates good style coherence
    if 0.3 <= avg_sim <= 0.7:
        return 1.0
    elif avg_sim < 0.3:
        return 0.6  # Too different
    else:
        return 0.4  # Too similar

def create_weighted_embedding(user_embeddings, text_emb):
    """Create a style-aware embedding for better matching"""
    # Combine available item embeddings
    item_embeddings = [emb for emb in user_embeddings.values() if emb is not None]
    
    if not item_embeddings:
        return text_emb
    
    # Average item embeddings and combine with text
    avg_item_emb = np.mean(item_embeddings, axis=0)
    combined = 0.6 * text_emb + 0.4 * avg_item_emb
    return combined / np.linalg.norm(combined)

def retrieve_similar_outfits(user_embeddings, text_emb, body_type, skin_tone, budget, outfit_data, user_gender=None, top_k=5):
    """
    Improved outfit completion that focuses on complementarity and gender match.
    """
    available_classes = [cls for cls, emb in user_embeddings.items() if emb is not None]
    missing_classes = [cls for cls in class_names if cls not in available_classes]

    if not missing_classes:
        return []  # User already has complete outfit

    scored_entries = []

    for entry in outfit_data:
        # ✅ Gender compatibility check
        gender_info = entry.get("gender", [])
        if isinstance(gender_info, list) and gender_info:
            candidate_gender = gender_info[0].get("gender", "").lower()
        else:
            candidate_gender = "unknown"

        if user_gender and candidate_gender and user_gender != candidate_gender:
            continue  # Skip incompatible gender

        # Body type score
        body_score = 1.0
        if body_type != "unknown" and entry.get("body_type") != "unknown":
            body_score = 1.0 if entry["body_type"] == body_type else 0.7

        # Skin tone score
        skin_score = 1.0
        if skin_tone != "unknown" and entry.get("skin_tone") != "unknown":
            skin_score = 1.0 if entry["skin_tone"] == skin_tone else 0.8

        # Budget filter (hard filter)
        price = extract_first_price(entry.get("price", ""))
        if price and price > budget:
            continue

        # Check for missing item overlap
        available_missing_items = [cls for cls in missing_classes if cls in entry["items"] and entry["items"][cls]]
        if not available_missing_items:
            continue

        # Complementarity
        complementarity_score = compute_complementarity_score(user_embeddings, entry)

        # Style compatibility
        style_compatibility = 0
        valid_comparisons = 0
        for cls in available_classes:
            user_vec = user_embeddings.get(cls)
            candidate_item = entry["items"].get(cls)
            if user_vec and candidate_item and "embedding" in candidate_item:
                sim = cosine_similarity(user_vec, candidate_item["embedding"])
                if 0.2 <= sim <= 0.8:
                    style_compatibility += min(sim * 1.2, 1.0)
                else:
                    style_compatibility += sim * 0.7
                valid_comparisons += 1
        clothing_score = style_compatibility / valid_comparisons if valid_comparisons else 0.5

        # Text embedding match
        text_score = cosine_similarity(text_emb, entry["text_embedding"])

        # Weight missing items
        missing_item_score = np.mean([CATEGORY_WEIGHTS.get(cls, 0.5) for cls in available_missing_items])

        final_score = (
            0.3 * clothing_score +
            0.4 * text_score +
            0.2 * complementarity_score +
            0.1 * missing_item_score
        )

        final_score *= body_score * skin_score

        if final_score < 0.4:
            continue

        scored_entries.append((final_score, entry, available_missing_items))

    scored_entries.sort(key=lambda x: -x[0])

    recommendations = []
    for score, entry, available_missing_items in scored_entries[:top_k]:
        items_to_return = {}
        for cls in available_missing_items:
            item = entry["items"][cls]
            if item:
                items_to_return[cls] = {
                    "class": cls,
                    "bbox": item.get("bbox", []),
                    "confidence": score
                }

        recommendations.append({
            "set_id": entry.get("imageFile", ""),
            "title": entry.get("title", ""),
            "product_url": entry.get("product_url", ""),
            "image_url": entry.get('image_url', ""),
            "gender": entry.get("gender", "unknown"), 
            "confidence_score": round(score, 3),
            "items": items_to_return,
            "missing_categories": available_missing_items
        })

    return recommendations
