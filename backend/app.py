from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Mock data generator
def generate_mock_data():
    colleges = ['Engineering', 'Business', 'Education', 'Agriculture', 'Computing']
    municipalities = ['Lingayen', 'Dagupan', 'Urdaneta', 'Alaminos', 'San Carlos', 
    'Binalonan', 'Pozorrubio', 'Manaoag', 'Bayambang', 'Malasiqui']
    
    # Generate enrollment data
    enrollment_data = []
    for year in range(2019, 2025):
        base = 12000 + (year - 2019) * 600
        enrollment_data.append({
            'year': str(year),
            'total': base + np.random.randint(-200, 200),
            'male': int((base + np.random.randint(-200, 200)) * 0.46),
            'female': int((base + np.random.randint(-200, 200)) * 0.54)
        })
    
    return {
        'enrollment': enrollment_data,
        'colleges': colleges,
        'municipalities': municipalities
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'PSU ForeSight API is running'})

@app.route('/api/enrollment', methods=['GET'])
def get_enrollment():
    data = generate_mock_data()
    return jsonify(data['enrollment'])

@app.route('/api/colleges', methods=['GET'])
def get_colleges():
    data = generate_mock_data()
    return jsonify(data['colleges'])

@app.route('/api/forecast', methods=['POST'])
def forecast_enrollment():
    # Simple linear regression forecast
    data = request.json
    years = np.array([int(d['year']) for d in data['historical']])
    values = np.array([d['total'] for d in data['historical']])
    
    # Fit linear model
    coeffs = np.polyfit(years, values, 1)
    
    # Predict next 3 years
    future_years = [2025, 2026, 2027]
    predictions = []
    for year in future_years:
        predicted = int(coeffs[0] * year + coeffs[1])
        predictions.append({
            'year': str(year),
            'predicted': predicted
        })
    
    return jsonify(predictions)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    year = request.args.get('year', '2024')
    
    stats = {
        'total_students': 15800,
        'graduation_rate': 88,
        'total_colleges': 5,
        'total_graduates': 3650
    }
    
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5000)