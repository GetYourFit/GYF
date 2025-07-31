import os
import subprocess
import shutil
from PIL import Image
import uuid
import numpy as np

os.makedirs("output/tryon", exist_ok=True)

def crop_cloth(cloth_path, bbox, save_path):
    img = Image.open(cloth_path).convert("RGB")
    W, H = img.size
    x_c, y_c, w, h = bbox

    # Convert normalized YOLO bbox to absolute
    x1 = int((x_c - w / 2) * W)
    y1 = int((y_c - h / 2) * H)
    x2 = int((x_c + w / 2) * W)
    y2 = int((y_c + h / 2) * H)

    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(W, x2), min(H, y2)

    cropped = img.crop((x1, y1, x2, y2)).resize((192, 256))
    cropped.save(save_path)


def generate_cloth_mask(image_path, mask_path):
    img = Image.open(image_path).convert("L")
    mask = img.point(lambda p: 255 if p < 250 else 0)
    mask.save(mask_path)

def find_generated_image(results_dir):
    for file in os.listdir(results_dir):
        if file.endswith(".jpg") or file.endswith(".png"):
            return os.path.join(results_dir, file)
    raise FileNotFoundError("Try-on image not generated.")


def run_tryon(user_image_file, catalog_image_path, bbox):
    # Save user image temporarily
    import os
    from PIL import Image
    import uuid

    temp_dir = "temp_inputs"
    os.makedirs(temp_dir, exist_ok=True)
    user_img_path = os.path.join(temp_dir, f"user_{uuid.uuid4().hex}.jpg")
    user_image_file.save(user_img_path)

    # Call DCI-VTON pipeline (assumes it outputs to some known output path)
    output_path = run_dci_vton(user_img_path, catalog_image_path, bbox)

    return output_path


def run_dci_vton(user_img_path, cloth_img_path, bbox):
    base_dir = "DCI-VTON-Virtual-Try-On"
    viton_test_dir = os.path.join(base_dir, "VITON-HD", "test")
    image_dir = os.path.join(viton_test_dir, "image")
    cloth_dir = os.path.join(viton_test_dir, "cloth")
    cloth_mask_dir = os.path.join(viton_test_dir, "cloth-mask")
    test_pair_path = os.path.join(viton_test_dir, "test_pairs.txt")

    # Unique filenames
    user_filename = f"user_{uuid.uuid4().hex}.jpg"
    cloth_filename = f"cloth_{uuid.uuid4().hex}.jpg"

    # Prepare paths
    user_dst = os.path.join(image_dir, user_filename)
    cloth_dst = os.path.join(cloth_dir, cloth_filename)
    mask_dst = os.path.join(cloth_mask_dir, cloth_filename)

    # 1. Clean test folder (optional but safe)
    for d in [image_dir, cloth_dir, cloth_mask_dir]:
        shutil.rmtree(d, ignore_errors=True)
        os.makedirs(d, exist_ok=True)

    # 2. Copy user image to test/image/
    shutil.copy(user_img_path, user_dst)

    # 3. Crop cloth using bbox and save to test/cloth/
    crop_cloth(cloth_img_path, bbox, cloth_dst)

    # 4. Generate cloth mask using simple threshold (white background works)
    generate_cloth_mask(cloth_dst, mask_dst)

    # 5. Create test_pairs.txt
    with open(test_pair_path, "w") as f:
        f.write(f"{user_filename} {cloth_filename}\n")

    # 6. Run PF-AFN warp module
    subprocess.run(["sh", "test_VITON.sh"], cwd=os.path.join(base_dir, "PF-AFN", "PF-AFN_test"), check=True)

    # 7. Run diffusion model
    subprocess.run([
        "python", "test.py", "--plms", "--gpu_id", "0",
        "--ddim_steps", "50",
        "--outdir", "results/tryon",
        "--config", "configs/viton512.yaml",
        "--ckpt", "checkpoints/viton512.ckpt",
        "--dataroot", "VITON-HD",
        "--n_samples", "1",
        "--scale", "1",
        "--H", "512", "--W", "512",
        "--unpaired"
    ], cwd=base_dir, check=True)

    # 8. Find and move output image to /output/tryon/
    generated_image = find_generated_image(os.path.join(base_dir, "results", "tryon"))
    final_output_path = os.path.join("output/tryon", os.path.basename(generated_image))
    shutil.copy(generated_image, final_output_path)

    return final_output_path
