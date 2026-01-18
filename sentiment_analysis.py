from flask import Flask, request, jsonify
from transformers import pipeline
import torch

app = Flask(__name__)

# Load model sentimen (gunakan GPU jika tersedia)
device = 0 if torch.cuda.is_available() else -1
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment",  # Mendukung multi-bahasa
    tokenizer="nlptown/bert-base-multilingual-uncased-sentiment",
    device=device
)

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        review_text = data.get('review', '')
        
        if not review_text:
            return jsonify({'error': 'Ulasan tidak boleh kosong'}), 400
        
        # Analisis sentimen
        result = sentiment_analyzer(review_text)[0]  # Output: {'label': '5 stars', 'score': 0.9}
        
        # Map label ke sentimen sederhana (opsional, tergantung model)
        label = result['label']
        score = result['score']
        if '5' in label or '4' in label:
            sentiment = 'POSITIVE'
        elif '1' in label or '2' in label:
            sentiment = 'NEGATIVE'
        else:
            sentiment = 'NEUTRAL'
        
        return jsonify({
            'sentiment': sentiment,
            'confidence': round(score,4),
            'original_label': label
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)