import numpy as np

def compute_pseudoinverse(tempLapDense):
    return np.linalg.pinv(tempLapDense)