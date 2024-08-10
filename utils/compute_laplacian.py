import copy
import numpy as np

def compute_laplacian(tempAdjDense):
    try:
        tempLapDense = -copy.deepcopy(tempAdjDense)
        for ii, irow in enumerate(tempLapDense): 
            tempLapDense[ii, ii] = -np.sum(irow)
        return tempLapDense
    
    except Exception as e:
        raise ValueError(f"Error computing LaplacianL: {str(e)}")