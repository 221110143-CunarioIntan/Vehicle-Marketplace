from flask import Flask, jsonify
from surprise import Dataset, Reader, SVD, accuracy
from surprise.model_selection import train_test_split
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Path ke dataset real (ubah jika perlu)
DATA_PATH = 'data/vehicles.csv'

# Fungsi untuk load dan preprocess data real
def load_and_preprocess_data():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset tidak ditemukan di {DATA_PATH}. Download dari Kaggle dan tempatkan di sana.")
    
    # Load dataset (contoh: craigslist cars)
    data = pd.read_csv(DATA_PATH)
    
    # Preprocess: Pilih kolom relevan dan buat vehicle_id unik
    # Asumsikan kolom: id, price, year, manufacturer, model, condition, fuel, odometer, etc.
    # Jika kolom berbeda, sesuaikan
    data = data[['id', 'price', 'year', 'manufacturer', 'model']].dropna()  # Drop null
    data['vehicle_id'] = data['manufacturer'] + '_' + data['model'] + '_' + data['year'].astype(str)  # ID unik
    
    # Simulasi user_id dan rating (karena dataset asli tidak punya interaksi)
    # Buat 100 user random, assign rating berdasarkan price (lebih mahal = rating tinggi)
    np.random.seed(42)  # Untuk reproducibility
    data['user_id'] = np.random.randint(1, 101, size=len(data))  # 100 users
    data['rating'] = pd.cut(data['price'], bins=5, labels=[1, 2, 3, 4, 5], right=False).astype(int)  # Rating 1-5 berdasarkan price
    
    # Subset untuk testing (ambil 10k baris agar cepat)
    data = data.sample(n=min(10000, len(data)), random_state=42)
    
    return data[['user_id', 'vehicle_id', 'rating']]

# Load data dan train model saat startup
data = load_and_preprocess_data()
reader = Reader(rating_scale=(1, 5))
dataset = Dataset.load_from_df(data, reader)
trainset, testset = train_test_split(dataset, test_size=0.2, random_state=42)
model = SVD()
model.fit(trainset)

# Evaluasi (opsional, print ke console)
predictions = model.test(testset)
rmse = accuracy.rmse(predictions)
print(f'Model trained with RMSE: {rmse:.2f}')

# Fungsi rekomendasi
def get_recommendations(user_id, model, data, top_n=5):
    all_vehicles = data['vehicle_id'].unique()
    seen_vehicles = data[data['user_id'] == user_id]['vehicle_id'].tolist()
    unseen_vehicles = [v for v in all_vehicles if v not in seen_vehicles]
    
    if not unseen_vehicles:
        return []  # Jika semua sudah dilihat
    
    predictions = [model.predict(user_id, v).est for v in unseen_vehicles]
    top_recommendations = sorted(zip(unseen_vehicles, predictions), key=lambda x: x[1], reverse=True)[:top_n]
    
    return [{'vehicle_id': v, 'predicted_rating': round(r, 2)} for v, r in top_recommendations]

# API Endpoint
@app.route('/recommend/<int:user_id>')
def recommend(user_id):
    if user_id not in data['user_id'].unique():
        return jsonify({'error': 'User ID tidak ditemukan. Coba user_id antara 1-100.'}), 404
    
    recommendations = get_recommendations(user_id, model, data)
    return jsonify({
        'user_id': user_id,
        'recommendations': recommendations,
        'total_recommendations': len(recommendations)
    })

# Endpoint untuk list semua vehicles (opsional, untuk debug)
@app.route('/vehicles')
def get_vehicles():
    vehicles = data['vehicle_id'].unique()[:10]  # Ambil 10 contoh
    return jsonify({'vehicles': list(vehicles)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)