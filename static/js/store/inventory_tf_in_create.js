import { BaseUrl, UrlPostTransferIn, UrlGetAllContact, UrlGetWarehouseByToken, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const AllContact = BaseUrl + UrlGetAllContact;
const AllWarehouseByToken = BaseUrl + UrlGetWarehouseByToken;
const PostTransferIn = BaseUrl + UrlPostTransferIn;

// Fetch Data Kontak di Dropdown
const dropdownVendor = document.getElementById("listVendor");
// Fetch data dari API
fetch(AllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((contact) => {
            const option = document.createElement("option");
            option.value = contact.id;
            option.textContent = contact.name;
            dropdownVendor.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching contacts:', error);
});

// Fetch Data Gudang di Dropdown
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

// Function to add purchase order data
async function addTransferIn(formData) {
    const fotoInput = document.getElementById('fotoInput').files[0];
    const fileName = fotoInput.name;
    if (!fotoInput) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please select an image!',
        });
        return;
    }

    try {
        const formDataObj = new FormData();
        formDataObj.append('contact_id', formData.contact_id);
        formDataObj.append('warehouse_id', formData.warehouse_id);
        formDataObj.append('date', formData.date);
        formDataObj.append('nama_barang', formData.nama_barang);
        formDataObj.append('grade', formData.grade);
        formDataObj.append('sku', formData.sku);
        formDataObj.append('description', formData.description);
        formDataObj.append('ketebalan', formData.ketebalan);
        formDataObj.append('setting', formData.setting);
        formDataObj.append('gramasi', formData.gramasi);
        formDataObj.append('stock_roll', formData.stock_roll);
        formDataObj.append('price', formData.price);
        formDataObj.append('stock_rib', formData.stock_rib);
        formDataObj.append('stock_kg', formData.stock_kg);
        formDataObj.append('attachment_image', fotoInput);

        console.log('Data formData sebelum dikirim:', formDataObj);

        const response = await fetch(PostTransferIn, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formDataObj,
        });
        const responseData = await response.json();
        if (responseData && responseData.data) {
                // Display success SweetAlert
                Swal.fire({
                    title: 'Success!',
                    text: 'Tansfer In Data Successfully Added!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'inventory_tf_view.html';
                });
            } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to Add Tansfer In Data!',
            });
        }
    } catch (error) {
        console.error("Error uploading image and adding purchase order data:", error);
    }
}

// Event listener for submit button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
    // Get input values
    const tanggalInput = document.querySelector('#tanggalInput').value;
    const namaBarangInput = document.querySelector('#namaBarangInput').value;
    const gradeInput = document.querySelector('#gradeInput').value;
    const skuInput = document.getElementById('skuInput').value;
    const deskripsiInput = document.getElementById('deskripsiInput').value;
    const stokRoll = document.getElementById('stokRoll').value;
    const stokKg = document.getElementById('stokKg').value;
    const stokRib = document.getElementById('stokRib').value;
    const hargaBeliInput = document.getElementById('hargaBeliInput').value;
    const listVendor = document.getElementById('listVendor').value;
    const listWarehouse = document.getElementById('listWarehouse').value;
    const ketebalanInput = document.getElementById('ketebalanInput').value;
    const settingInput = document.getElementById('settingInput').value;
    const gramasiInput = document.getElementById('gramasiInput').value;
    
    // Check if any of the fields is empty
    if (!tanggalInput || !namaBarangInput || !gradeInput || !skuInput || !deskripsiInput || !stokRoll || !stokKg || !stokRib
        || !hargaBeliInput || !listVendor || !listWarehouse || !ketebalanInput || !settingInput){
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'All fields must be filled!',
        });
        return; // Stop further processing
    }

    // Create a data object to be sent
    const postData = {
        date: tanggalInput,
        nama_barang: namaBarangInput,
        grade: gradeInput,
        sku: skuInput,
        description: deskripsiInput,
        stock_roll: stokRoll,
        stock_kg: stokKg,
        stock_rib: stokRib,
        price: hargaBeliInput,
        contact_id: listVendor,
        warehouse_id: listWarehouse,
        ketebalan: ketebalanInput,
        setting: settingInput,
        gramasi: gramasiInput
    };
    
    // Display SweetAlert for confirmation
    Swal.fire({
        title: 'Add Transfer In',
        text: 'Are you sure you want to add Transfer In data?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            addTransferIn(postData);
        }
    });
});
