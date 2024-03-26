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

// Pengkondisian Radiobutton untuk Broker
const radioButtons = document.querySelectorAll('input[name="radios-example"]');
const brokerDiv = document.querySelector('.broker');
const manualFee = document.querySelector('.manualFeeInput');
const percenFee = document.querySelector('.percenFeeInput');
const feeRadioButtons = document.querySelectorAll('input[name="inline-radios-example"]');

feeRadioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        if (this.value === "manualFee") {
            manualFee.style.display = 'block';
            percenFee.style.display = 'none';
        } else if (this.value === "percenFee") {
            manualFee.style.display = 'none';
            percenFee.style.display = 'block';
        }
    });
});

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
        if (this.value === "true") {
            brokerDiv.style.display = 'block';
        } else {
            brokerDiv.style.display = 'none';
        }
    });
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
    let listBroker = document.querySelector('#listBroker').value; // Gunakan let karena nilai listBroker akan diubah

    // Check if any of the fields is empty
    if (!listContact || !listWarehouse || !listSKU || !dateInput || !stokRoll || !stokKg || !stokRib || !hargaJualInput) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Field harus diisi!',
        });
        return;
    }

    // Pengkondisian Jika Broker tidak dipilih
    if (listBroker === "Pilih Broker") {
        listBroker = "";
    }

    // Get broker fee value based on the selected type
    let brokerFeeValue;
    const manualFeeInput = document.querySelector('#manualFeeInput');
    const percenFeeInput = document.querySelector('#percenFeeInput');
    if (document.querySelector('input[name="inline-radios-example"]:checked').value === 'manualFee') {
        brokerFeeValue = manualFeeInput.value;
    } else {
        const percentageFee = parseFloat(percenFeeInput.value) / 100; 
        brokerFeeValue = hargaJualInput * percentageFee;
    }

    const postData = {
        sku: listSKU,
        broker_fee: brokerFeeValue,
        broker: listBroker,
        contact_id: listContact,
        warehouse_id: listWarehouse,
        date: dateInput,
        stock_roll: stokRoll,
        stock_kg: stokKg,
        stock_rib: stokRib,
        price: hargaJualInput,
    };

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
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses!',
                            text: 'Sales Order Berhasil Ditambahkan!',
                            timer: 1500,
                            showConfirmButton: false
                        })
                        // .then(() => {
                        //     window.location.href = 'sales_so_list_view.html';
                        // });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message,
                        });
                    }
                })
                .catch(error => {
                    console.error("Error while adding SO data:", error);
                });
        }
    });
});
