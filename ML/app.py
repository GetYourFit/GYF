from flask import Flask, request, jsonify
import test
import util
from flask_cors import CORS
import logging
import time
from tryon import run_tryon  # Import your DCI-VTON integration
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Serve generated try-on images
app.static_folder = "output"

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load embeddings once at startup
logger.info("Loading embeddings...")
start_time = time.time()
faiss_index, outfit_data, class_names = test.load_embeddings("output_embeddings_merged.json")
logger.info(f"Loaded {len(outfit_data)} outfits in {time.time() - start_time:.2f}s")


def handle_recommendation_request(process_user_image_func, retrieve_similar_outfits_func, top_k_cap=20):
    """Shared handler for recommendation endpoints"""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "Image file is required."}), 400

        image = request.files["image"]

        if not image.filename:
            return jsonify({"error": "No image file selected."}), 400

        if not image.mimetype.startswith("image/"):
            return jsonify({"error": "Uploaded file must be an image."}), 400

        prompt = request.form.get("prompt", "").strip()

        try:
            budget = int(request.form.get("budget", "1000000"))
            if budget <= 0:
                return jsonify({"error": "Budget must be a positive integer."}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Budget must be a valid integer."}), 400

        try:
            top_k = min(int(request.form.get("top_k", "5")), top_k_cap)
        except (ValueError, TypeError):
            top_k = 5

        start_time = time.time()

        # Process image
        user_embeddings, text_emb, body_type, skin_tone, user_gender = process_user_image_func(image, prompt)

        detected_items = [cls for cls, emb in user_embeddings.items() if emb is not None]
        if not detected_items:
            return jsonify({
                "error": "No clothing items detected in the image. Please upload an image with visible clothing.",
                "body_type": body_type,
                "skin_tone": skin_tone,
                "detected_items": detected_items
            }), 400

        # Get recommendations
        recommendations = retrieve_similar_outfits_func(
            user_embeddings,
            text_emb,
            body_type,
            skin_tone,
            budget,
            outfit_data,
            user_gender=user_gender,
            top_k=top_k
        )

        processing_time = time.time() - start_time

        response = {
            "success": True,
            "body_type": body_type,
            "skin_tone": skin_tone,
            "detected_items": detected_items,
            "recommendations": recommendations,
            "total_recommendations": len(recommendations),
            "processing_time_ms": round(processing_time * 1000, 2),
            "search_parameters": {
                "budget": budget,
                "prompt": prompt,
                "top_k": top_k
            }
        }

        logger.info(
            f"Recommendation request processed in {processing_time:.2f}s - "
            f"Detected: {detected_items}, Recommendations: {len(recommendations)}"
        )

        return jsonify(response)

    except Exception as e:
        logger.error(f"Error processing recommendation request: {str(e)}", exc_info=True)
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "success": False
        }), 500


@app.route("/recommend_without_base_64", methods=["POST"])
def recommend_without_base_64():
    return handle_recommendation_request(
        process_user_image_func=test.process_user_image,
        retrieve_similar_outfits_func=test.retrieve_similar_outfits
    )


@app.route("/recommend", methods=["POST"])
def recommend():
    return handle_recommendation_request(
        process_user_image_func=util.process_user_image,
        retrieve_similar_outfits_func=util.retrieve_similar_outfits
    )


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "total_outfits": len(outfit_data),
        "clothing_classes": class_names
    })


@app.route("/stats", methods=["GET"])
def get_stats():
    category_counts = {}
    for outfit in outfit_data:
        for cls in class_names:
            if cls in outfit["items"] and outfit["items"][cls]:
                category_counts[cls] = category_counts.get(cls, 0) + 1

    return jsonify({
        "total_outfits": len(outfit_data),
        "clothing_classes": class_names,
        "items_per_category": category_counts
    })

@app.route("/try_on", methods=["POST"])
def try_on():
    try:
        if 'user_image' not in request.files:
            return jsonify({"error": "User image file is required."}), 400
        if 'catalog_image_path' not in request.form:
            return jsonify({"error": "Catalog image path is required."}), 400
        if 'bbox' not in request.form:
            return jsonify({"error": "Bounding box (bbox) is required."}), 400

        user_image = request.files['user_image']
        catalog_image_path = request.form['catalog_image_path']
        bbox_str = request.form['bbox']

        # Validate bbox (YOLO format: x_center, y_center, width, height in normalized form)
        try:
            bbox = list(map(float, bbox_str.strip().split(',')))
            if len(bbox) != 4:
                raise ValueError()
        except ValueError:
            return jsonify({"error": "Invalid bbox format. Expected: 'x_center,y_center,width,height'"}), 400

       
        output_path = run_tryon(user_image, catalog_image_path, bbox)

        filename = Path(output_path).name

        return jsonify({
            "success": True,
            "output_path": f"/tryon_results/{filename}"
        })

    except Exception as e:
        logger.error(f"Error in /try_on endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "success": False
        }), 500

@app.route('/tryon_results/<path:filename>')
def serve_tryon_image(filename):
    from flask import send_from_directory
    return send_from_directory('output/tryon', filename)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
