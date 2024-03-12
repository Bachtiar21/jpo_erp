import { BaseUrl, UrlPostStore } from "../controller/template.js";
import { token } from "../controller/cookies.js";

// Create Url Post Store
const postStore = BaseUrl + UrlPostStore;

// Function to add store data
function addStore(postData) {
    fetch(postStore, {
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
          text: 'Data Toko Berhasil Ditambahkan!',
          timer: 1500,
          showConfirmButton : false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'toko_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data Toko Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding store data:", error);
    });
  }
  
// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const namaTokoInput = document.querySelector('#namaTokoInput').value;
  const alamatInput = document.querySelector('#alamatInput').value;
  const noHpInput = document.querySelector('#noHpInput').value;
  
  // Check if any of the fields is empty
  if (!namaTokoInput || !alamatInput || !noHpInput) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    name: namaTokoInput,
    address: alamatInput,
    phone_number: noHpInput
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Toko',
    text: 'Anda Yakin Menambah Data Toko?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      addStore(postData);
    }
  });
});