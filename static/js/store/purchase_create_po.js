import { BaseUrl, tokenGithub, UrlPostPurchaseOrder, UrlGetAllContact, UrlGetWarehouseByToken, requestOptionsGet } from "../controller/template.js";
import { CihuyFileUploadGithub } from "https://c-craftjs.github.io/uploader/github.js";
import { token } from "../controller/cookies.js";

const PostPurchaseOrder = BaseUrl + UrlPostPurchaseOrder;
const AllContact = BaseUrl + UrlGetAllContact;
const AllWarehouseByToken = BaseUrl + UrlGetWarehouseByToken;

// Function to add purchase order data
async function addPreOrder(formData) {
    const fotoInput = document.getElementById('fotoInput').files[0];
    const fileName = fotoInput.name;
    const githubToken = tokenGithub;
    const githubRepoOwner = "Bachtiar21";
    const githubRepoName = "img_jpo";
    if (!fotoInput) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please select an image!',
        });
        return;
    }

    try {
        const response = await CihuyFileUploadGithub(fotoInput, fileName, githubToken, githubRepoOwner, githubRepoName)
        formData.attachment_image = response.content.download_url; // Assigning GitHub image URL to attachment_image field

        // Menggunakan postData untuk mengirimkan data formulir
        fetch(PostPurchaseOrder, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Pastikan menentukan Content-Type
            },
            body: JSON.stringify(formData) // Mengirim postData yang berisi data formulir yang benar
        })
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                // Display success SweetAlert
                Swal.fire({
                    title: 'Success!',
                    text: 'Purchase Order Data Successfully Added!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Refresh the page after successful addition
                    window.location.href = 'purchase_po_view.html';
                });
            } else {
                // Display error SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to Add Purchase Order Data!',
                });
            }
        })
        .catch(error => {
            console.error("Error while adding purchase order data:", error);
        });
    } catch (error) {
        console.error("Error uploading image and adding purchase order data:", error);
    }
}

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

// Event listener for submit button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
    // Get input values
    const tanggalInput = document.querySelector('#tanggalInput').value;
    const namaBarangInput = document.querySelector('#namaBarangInput').value;
    const gradeInput = document.querySelector('#gradeInput').value;
    const skuInput = document.getElementById('skuInput').value;
    const deskripsiInput = document.getElementById('deskripsiInput').value;
    const stokInput = document.getElementById('stokInput').value;
    const hargaBeliInput = document.getElementById('hargaBeliInput').value;
    const listVendor = document.getElementById('listVendor').value;
    const listWarehouse = document.getElementById('listWarehouse').value;
    const ketebalanInput = document.getElementById('ketebalanInput').value;
    const settingInput = document.getElementById('settingInput').value;
    const gramasiInput = document.getElementById('gramasiInput').value;
    
    // Check if any of the fields is empty
    if (!tanggalInput || !namaBarangInput || !gradeInput || !skuInput || !deskripsiInput || !stokInput 
        || !hargaBeliInput || !listVendor || !listWarehouse || !ketebalanInput || !settingInput) {
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
        stock: stokInput,
        stock_rib: stokInput,
        price: hargaBeliInput,
        contact_id: listVendor,
        warehouse_id: listWarehouse,
        ketebalan: ketebalanInput,
        setting: settingInput,
        gramasi: gramasiInput
    };
    
    // Display SweetAlert for confirmation
    Swal.fire({
        title: 'Add PO',
        text: 'Are you sure you want to add Purchase Order data?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            addPreOrder(postData);
        }
    });
});
