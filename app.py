from flask import Flask, request, render_template, jsonify
from utils.compute_flow_betweeness import compute_flow_betweenness
from utils.compute_laplacian import compute_laplacian
from utils.compute_pseudoinverse import compute_pseudoinverse
from utils.load_data import load_data

import numpy as np
import pandas as pd

app = Flask(__name__)

tempAdj = None
tempAdjDense = None
num_nodes = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    source = int(request.form.get('source', 0))
    sink = int(request.form.get('sink', 1))
    
    tempAdj, tempAdjDense, num_nodes, csv_data = load_data(file)
    tempLapDense = compute_laplacian(tempAdjDense)
    tempLinv = compute_pseudoinverse(tempLapDense)

    if source >= num_nodes or sink >= num_nodes:
        return jsonify({'error': 'Selected nodes are out of bounds'})
    
    b_v_u = compute_flow_betweenness(tempAdjDense, tempLinv, source, sink)
    
    result = {
        'tempAdj': {
            'data': tempAdj.data.tolist(),
            'row': tempAdj.row.tolist(),
            'col': tempAdj.col.tolist(),
            'shape': tempAdj.shape
        },
        'tempAdjDense': tempAdjDense.tolist(),
        'laplacian': tempLapDense.tolist(),
        'lap_inv': tempLinv.tolist(),
        'flow_betweenness': b_v_u,
        'csv_data': csv_data
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
