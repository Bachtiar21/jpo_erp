import { BaseUrl, UrlGetSalesOrderById, UrlGetByIdContact, UrlGetAllContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetSalesOrderById = BaseUrl + UrlGetSalesOrderById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;
const GetAllContact = BaseUrl + UrlGetAllContact;

// Fetch Data Kontak di Dropdown
const dropdownVendor = document.getElementById("listBroker");
// Fetch data dari API
fetch(GetAllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((broker) => {
            const option = document.createElement("option");
            option.value = broker.id;
            option.textContent = broker.name;
            dropdownVendor.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching brokers:', error);
});

// Fetch data from API endpoint
fetch(GetSalesOrderById, requestOptionsGet)
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
    document.getElementById('nomorSoInput').value = data.data.no_so;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('tanggalInput').value = data.data.date;
})
.catch(error => console.error('Error:', error));