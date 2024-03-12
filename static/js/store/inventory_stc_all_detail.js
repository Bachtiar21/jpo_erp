import { BaseUrl, UrlGetStockAllById, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetStockAllById = BaseUrl + UrlGetStockAllById + `/${id}`;

// Fetch data from API endpoint
fetch(GetStockAllById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    // Check if data array is not empty
    if (data.data.length > 0) {
        const stockData = data.data[0]; // Assuming there is only one item in the array
        
        // Populate form fields with data
        document.getElementById('namaBarangInput').value = stockData.nama_barang;
        document.getElementById('spesifikasiInput').value = `Ketebalan: ${stockData.ketebalan}, Setting: ${stockData.setting}, Gramasi: ${stockData.gramasi}`;
        document.getElementById('stokInput').value = `Stock Rev : ${stockData.stock_rev}, Stock Rib Rev : ${stockData.stock_rib_rev}`;
        document.getElementById('gradeInput').value = stockData.grade;
        document.getElementById('hargaJualInput').value = stockData.price;
        document.getElementById('skuInput').value = stockData.sku;
        document.getElementById('tanggalInput').value = stockData.date;
        document.getElementById('deskripsiInput').value = stockData.description;
        document.getElementById('inputHrefPO').value = stockData.no_po;
    } else {
        console.error('Data not found');
    }
})
.catch(error => console.error('Error:', error));
