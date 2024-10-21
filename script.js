// Subida de archivos
const form = document.getElementById('uploadForm');
const fileList = document.getElementById('fileList');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const files = document.getElementById('fileInput').files;
    fileList.innerHTML = ''; // Limpiar la lista

    for (let i = 0; i < files.length; i++) {
        const listItem = document.createElement('p');
        listItem.textContent = 'Archivo subido: ' + files[i].name;
        fileList.appendChild(listItem);
    }
});
