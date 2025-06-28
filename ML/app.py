# app.py
from flask import Flask, request, jsonify
from util import process_user_image, load_embeddings, retrieve_similar_outfits

app = Flask(__name__)

# Load indexed embeddings into memory (FAISS index and metadata)
faiss_index, outfit_data, class_names = load_embeddings("ML/output_embeddings.json")

@app.route("/recommend", methods=["POST"])
def recommend():
    if 'image' not in request.files:
        return jsonify({"error": "Image file is required."}), 400

    image = request.files["image"]
    prompt = request.form.get("prompt", "")
    try:
        budget = int(request.form.get("budget", "0"))
    except:
        return jsonify({"error": "Budget must be an integer."}), 400

    user_embeddings, text_emb, body_type, skin_tone = process_user_image(image, prompt)

    recommendations = retrieve_similar_outfits(
        user_embeddings, text_emb, body_type, skin_tone, budget, faiss_index, outfit_data
    )

    return jsonify({
        "body_type": body_type,
        "skin_tone": skin_tone,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(debug=True)
