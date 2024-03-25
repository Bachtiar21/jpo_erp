import { BaseUrl, UrlGetStockAllById, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetStockAllById = BaseUrl + UrlGetStockAllById + `/${id}`;

// Fetch data from API endpoint
fetch(GetStockAllById, requestOptionsGet)
.then(response => response.json())
.then(responseData => {
    const data = responseData.data;
    if (data) {
        document.getElementById('namaBarangInput').value = data.nama_barang;
        document.getElementById('spesifikasiInput').value = `Ketebalan: ${data.ketebalan}, Setting: ${data.setting}, Gramasi: ${data.gramasi}`;
        document.getElementById('stokInput').value = `Stock Rev : ${data.stock_roll_rev} Roll ${data.stock_kg_rev} Kg, Stock Rib Rev : ${data.stock_rib_rev}`;
        document.getElementById('gradeInput').value = data.grade;
        document.getElementById('hargaJualInput').value = data.price;
        document.getElementById('skuInput').value = data.sku;
        document.getElementById('tanggalInput').value = data.date;
        document.getElementById('deskripsiInput').value = data.description;
        document.getElementById('inputHrefPO').value = data.no_po;
    } else {
        console.error('Data not found');
    }
})
.catch(error => console.error('Error:', error));

// Menambahkan event listener untuk button "Update Data"
const updateStockAllButtons = document.querySelectorAll('.btn-primary');
updateStockAllButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = `inventory_stc_all_edit.html?id=${id}`;
    });
});