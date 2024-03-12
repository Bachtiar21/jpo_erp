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
                document.getElementById("listVendor").value = contactName;
            }
    });
    // Fetch data Warehouse
    fetch(GetWarehouseByIdByToken + `/${warehouseId}`, requestOptionsGet)
    .then(response => response.json())
    .then(warehouseData => {
        if (warehouseData && warehouseData.data) {
            const warehouseName = warehouseData.data.name;
            document.getElementById("listWarehouse").value = warehouseName;
        }
    });
    // Populate form fields with data
    document.getElementById('nomorDoInput').value = data.data.no_do;
    document.getElementById('namaBarangInput').value = data.data.nama_barang;
    document.getElementById('spesifikasiInput').value = `Ketebalan: ${data.data.ketebalan}, Setting: ${data.data.setting}, Gramasi: ${data.data.gramasi}`;
    document.getElementById('stokInput').value = `${data.data.stock} Roll, ${data.data.stock_rib} Kg`;
    document.getElementById('gradeInput').value = data.data.grade;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('tanggalInput').value = data.data.date;
    document.getElementById('deskripsiInput').value = data.data.description;
    document.getElementById('inputHrefPO').value = data.data.no_po;
    document.getElementById('listStatus').value = data.data.status;
})
.catch(error => console.error('Error:', error));