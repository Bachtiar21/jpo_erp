import { BaseUrl, UrlGetAllSKU, UrlGetAllContact,requestOptionsGet } from "../controller/template.js";

const GetAllSKU = BaseUrl + UrlGetAllSKU;
const GetAllContact = BaseUrl + UrlGetAllContact;
const GetAllBroker = BaseUrl + UrlGetAllContact;

// Fetch Data Kontak di Dropdown
const dropdownVendor = document.getElementById("listSKU");
// Fetch data dari API
fetch(GetAllSKU, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((sku) => {
            const option = document.createElement("option");
            option.value = sku;
            option.textContent = sku;
            dropdownVendor.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching SKU:', error);
});

const dropdownContact = document.getElementById("listContact");

fetch(GetAllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((contact) => {
            const option = document.createElement("option");
            option.value = contact;
            option.textContent = broker;
            dropdownContact.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching SKU:', error);
});

// Fetch Data Broker di Dropdown
const dropdownBroker = document.getElementById('listBroker')
fetch(GetAllBroker, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((contact) => {
            const option = document.createElement("option");
            option.value = contact.id;
            option.textContent = contact.name;
            dropdownBroker.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching Contact:', error);
});

const dropdownWarehouse = document.getElementById("listWarehouse");
// Fetch data dari API
fetch(AllWarehouseByToken, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((warehouse) => {
            const option = document.createElement("option");
            option.value = warehouse.id;
            option.textContent = warehouse.name;
            dropdownWarehouse.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching warehouse:', error);
});

// Fetch Data SKU di Dropdown
const dropdownSKU = document.getElementById("listSKU");

dropdownSKU.addEventListener("change", function() {
    const selectedSKU = this.value;
    
    // Fetch data dari API sesuai SKU yang dipilih
    fetch(`http://localhost:8000/api/auth/sales-order/${selectedSKU}/sku`, requestOptionsGet)
        .then((response) => response.json())
        .then((data) => {
            // Mengisi formulir dengan data yang diterima
            const skuData = data.data[0]; // Ambil data pertama dari respons
            document.getElementById("nomorDoInput").value = skuData.no_do;
            document.getElementById("listWarehouse").value = skuData.to;
            document.getElementById("listVendor").value = skuData.from;
            document.getElementById("stokInput").value = skuData.stock_rev;
            document.getElementById("hargaJualInput").value = skuData.price;
        })
        .catch((error) => {
            console.error('Error fetching SKU:', error);
    });
});
