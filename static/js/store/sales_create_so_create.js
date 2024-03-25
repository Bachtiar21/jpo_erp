import { BaseUrl, UrlGetAllSKU, UrlGetAllContact, UrlGetWarehouseByToken, UrlPostSalesOrder, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const GetAllSKU = BaseUrl + UrlGetAllSKU;
const GetAllContact = BaseUrl + UrlGetAllContact;
const AllWarehouseByToken = BaseUrl + UrlGetWarehouseByToken;
const GetAllBroker = BaseUrl + UrlGetAllContact;
const PostSalesOrder = BaseUrl + UrlPostSalesOrder;

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
            option.value = contact.id;
            option.textContent = contact.name;
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


// Event listener for the "Tambah SO" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const listContact = document.querySelector('#listContact').value;
  const listWarehouse = document.querySelector('#listWarehouse').value;
  const listSKU = document.querySelector('#listSKU').value;
  const dateInput = document.querySelector('#dateInput').value;
  const stokRoll = document.querySelector('#stokRoll').value;
  const stokKg = document.querySelector('#stokKg').value;
  const stokRib = document.querySelector('#stokRib').value;
  const hargaJualInput = document.querySelector('#hargaJualInput').value;
  const listBroker = document.querySelector('#listBroker').value;
  const brokerFeeInput = document.querySelector('#brokerFeeInput').value;
  
  // Check if any of the fields is empty
  if (!listContact || !listWarehouse || !listSKU || !dateInput || !stokRoll || !stokKg || !stokRib || !hargaJualInput) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    sku: listSKU,
    broker_fee: brokerFeeInput,
    broker: listBroker,
    contact_id : listContact,
    warehouse_id : listWarehouse,
    date : dateInput,
    stock_roll : stokRoll,
    stock_kg : stokKg,
    stock_rib : stokRib,
    price : hargaJualInput,
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Sales Order',
    text: 'Anda Yakin Menambah Sales Order?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(PostSalesOrder, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.data) {
        // Display success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Sukses!',
          text: 'Sales Order Berhasil Ditambahkan!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'sales_so_list_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Sales Order Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding SO data:", error);
    });
    }
  });
});