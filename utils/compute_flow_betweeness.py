def compute_flow_betweenness(tempAdjDense, tempLinv, source, sink):
    v_u = tempLinv[source-1, 0] - tempLinv[source-1, sink+1]
    v_v = tempLinv[sink-1, 0] - tempLinv[sink-1, sink+1]
    b_v_u = tempAdjDense[source-1, sink-1] * (v_u - v_v)
    return b_v_u