import scipy.sparse as sp
import pandas as pd

def load_data(file):
    try:
        df = pd.read_csv(file)
        df.columns = df.columns.str.strip()
        if 'residA' not in df.columns or 'residB' not in df.columns or 'weight' not in df.columns:
            raise ValueError('Missing required columns in CSV file')
        
        rows = df['residA'].values
        cols = df['residB'].values
        weights = df['weight'].values
        num_nodes = max(max(rows), max(cols)) + 1
        
        tempAdj = sp.coo_matrix((weights, (rows, cols)), shape=(num_nodes, num_nodes))
        tempAdjDense = tempAdj.todense()
        
        csv_data_html = df.to_html()
        return tempAdj, tempAdjDense, num_nodes, csv_data_html

    except Exception as e:
        raise ValueError(f"Error loading data {str(e)}")