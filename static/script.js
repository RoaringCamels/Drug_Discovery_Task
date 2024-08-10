document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);
    formData.append('source', document.getElementById('source').value);
    formData.append('sink', document.getElementById('sink').value);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('results').innerText = `Error: ${data.error}`;
        } else {
            // Display CSV Data
            if (data.csv_data) {
                document.getElementById('csv-data').innerHTML = `<h4>CSV Data</h4>${data.csv_data}`;
            }

            // Display results
            document.getElementById('results').innerText = `Flow Betweenness: ${data.flow_betweenness}`;

            // Display matrices
            const formatMatrix = (matrix) => {
                return matrix.map(row => row.join('\t')).join('\n');
            };

            const adjMatrix = formatMatrix(data.tempAdjDense);
            const lapMatrix = formatMatrix(data.laplacian);
            const lapInvMatrix = formatMatrix(data.lap_inv);

            document.getElementById('matrices').innerHTML = `
                <h4>Adjacency Matrix (tempAdjDense)</h4>
                <pre>${adjMatrix}</pre>
                <h4>Laplacian Matrix (tempLapDense)</h4>
                <pre>${lapMatrix}</pre>
                <h4>Pseudoinverse of Laplacian Matrix (lap_inv)</h4>
                <pre>${lapInvMatrix}</pre>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
