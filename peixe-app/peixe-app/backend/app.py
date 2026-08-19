import csv
import os
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATASET = []

with open('salmon_seabass.csv', newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        DATASET.append((
            float(row['lightness']),
            float(row['width']),
            int(row['species']),
        ))

random.seed(42)

def treinar(dataset, taxa=0.001, epocas=10000):
    pesos = [0.0, 0.0, 0.0]
    for _ in range(epocas):
        erros = 0
        for lightness, width, especie in dataset:
            entrada = [1.0, lightness, width]
            soma = sum(e * p for e, p in zip(entrada, pesos))
            palpite = 1 if soma > 0 else 0
            erro = especie - palpite
            if erro != 0:
                erros += 1
                pesos = [p + taxa * erro * e for p, e in zip(pesos, entrada)]
        if erros == 0:
            break
    return pesos

pesos = treinar(DATASET)


@app.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'online', 'pesos': pesos})


@app.route('/predict', methods=['POST'])
def predict():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({'error': 'Envie um JSON com lightness e width.'}), 400

    try:
        lightness = float(dados['lightness'])
        width     = float(dados['width'])
    except (KeyError, ValueError, TypeError):
        return jsonify({'error': 'lightness e width devem ser números.'}), 422

    soma = 1.0 * pesos[0] + lightness * pesos[1] + width * pesos[2]
    label = 'Robalo' if soma > 0 else 'Salmão'

    return jsonify({'label': label})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
