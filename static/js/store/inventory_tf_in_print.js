import { BaseUrl, UrlGetTransferInById, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetTransferInById = BaseUrl + UrlGetTransferInById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch data from API endpoint
fetch(GetTransferInById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
    const  warehouseId = data.data.warehouse_id;
            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("fromInput").innerText = `Diterbitkan Oleh : ${contactName}`;
            }
    });
    // Fetch data Warehouse
    fetch(GetWarehouseByIdByToken + `/${warehouseId}`, requestOptionsGet)
    .then(response => response.json())
    .then(warehouseData => {
        if (warehouseData && warehouseData.data) {
            const warehouseName = warehouseData.data.name;
            document.getElementById("toInput").innerText = `Ditujukan Kepada : ${warehouseName}`;
        }
    });
    // Populate form fields with data
    document.getElementById('noTfIn').innerText = data.data.no_do;
    document.getElementById('titleDoc').innerText = `Transfer In Doc (${data.data.no_do})`;
    // Mendapatkan tanggal dari data (misalnya dalam format YYYY-MM-DD)
    const tanggalData = data.data.date;
    const tanggal = new Date(tanggalData);
    const namaBulan = [
        "Januari", "Februari", "Maret",
        "April", "Mei", "Juni", "Juli",
        "Agustus", "September", "Oktober",
        "November", "Desember"
    ];
    const tanggalFormated = tanggal.getDate();
    const bulanFormated = namaBulan[tanggal.getMonth()];
    const tahunFormated = tanggal.getFullYear();
    const tanggalFinal = tanggalFormated + ' ' + bulanFormated + ' ' + tahunFormated;
    document.getElementById('tanggalTfIn').innerText = tanggalFinal;

    document.getElementById('namaBarang').innerText = data.data.nama_barang;
    document.getElementById('spesifikasi').innerText = `Ketebalan: ${data.data.ketebalan}, Setting: ${data.data.setting}, Gramasi: ${data.data.gramasi}`;
    document.getElementById('stock').innerText = `Stok Roll : ${data.data.stock_roll}, Stok Kg : ${data.data.stock_kg}, Stok Rib : ${data.data.stock_rib}`
    document.getElementById('grade').innerText = data.data.grade;
    document.getElementById('sku').innerText = data.data.sku;
    document.getElementById('deskripsi').innerText = data.data.description;
})
.then(() => {
    window.print();
})
.catch(error => console.error('Error:', error));

