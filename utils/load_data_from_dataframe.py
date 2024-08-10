import scipy.sparse as sp

def load_data_from_dataframe(df):
    try:
        df.columns = df.columns.str.strip()
        if 'residA' not in df.columns or 'residB' not in df.columns or 'weight' not in df.columns:
            raise ValueError('Missing required columns in CSV file')

        rows = df['residA'].astype(int).values
        cols = df['residB'].astype(int).values
        weights = df['weight'].astype(float).values
        num_nodes = max(max(rows), max(cols)) + 1

        tempAdj = sp.coo_matrix((weights, (rows, cols)), shape=(num_nodes, num_nodes))
        tempAdjDense = tempAdj.todense()

        return tempAdj, tempAdjDense, num_nodes

    except Exception as e:
        raise ValueError(f"Error loading data from DataFrame: {str(e)}")
