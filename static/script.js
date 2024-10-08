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
        // Hide previous results and matrices
        document.getElementById('csv-data').classList.add('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('matrices').classList.add('hidden');

        if (data.error) {
            // Display error message
            document.getElementById('error-message').innerText = `Error: ${data.error}`;
            document.getElementById('error-message').classList.remove('hidden');
        } else {
            // Hide error message if present
            document.getElementById('error-message').classList.add('hidden');

            // Display headers and sections
            document.getElementById('csv-header').classList.remove('hidden');
            document.getElementById('results-header').classList.remove('hidden');
            document.getElementById('matrices-header').classList.remove('hidden');

            // Display CSV Data
            if (data.csv_data) {
                document.getElementById('csv-data').innerHTML = `${data.csv_data}`;
                document.getElementById('csv-data').classList.remove('hidden');
            }

            // Display results
            document.getElementById('results').innerText = `Source Node: ${data.source}\n` + 
                `Sink Node: ${data.sink}\n` +
                `Flow Betweenness: ${data.flow_betweenness}`;
            document.getElementById('results').classList.remove('hidden');

            // Function to convert a matrix to an HTML table
            const formatMatrixToTable = (matrix) => {
                return `
                    <table class="matrix-table">
                        <tbody>
                            ${matrix.map(row => `
                                <tr>
                                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            };

            // Prepare matrix data
            const adjMatrix = formatMatrixToTable(data.tempAdjDense);
            const lapMatrix = formatMatrixToTable(data.laplacian);
            const lapInvMatrix = formatMatrixToTable(data.lap_inv);

            // Update HTML content
            document.getElementById('matrices').innerHTML = `
                <h4>Adjacency Matrix (tempAdjDense)</h4>
                ${adjMatrix}
                <h4>Laplacian Matrix (tempLapDense)</h4>
                ${lapMatrix}
                <h4>Pseudoinverse of Laplacian Matrix (lap_inv)</h4>
                ${lapInvMatrix}
            `;
            document.getElementById('matrices').classList.remove('hidden');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Hide all results and matrices
        document.getElementById('csv-data').classList.add('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('matrices').classList.add('hidden');
        
        // Display generic error message
        document.getElementById('error-message').innerText = '.csv requires 3 columns';
        document.getElementById('error-message').classList.remove('hidden');
    });
});
