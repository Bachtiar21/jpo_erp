import { BaseUrl, UrlPostBank } from "../controller/template.js";
import { token } from "../controller/cookies.js";

// Create Url Post Bank
const postBank = BaseUrl + UrlPostBank;

// Function to add bank data
function addBank(postData) {
    fetch(postBank, {
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
          text: 'Data Rekening Berhasil Ditambahkan!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'rekening_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data Rekening Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding bank data:", error);
    });
  }
  
// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const namaRekeningInput = document.querySelector('#namaRekeningInput').value;
  const noRekeningInput = document.querySelector('#noRekeningInput').value;
  const bankInput = document.querySelector('#bankInput').value;
  const selectStatus = document.getElementById('selectStatus').value;
  
  // Check if any of the fields is empty
  if (!namaRekeningInput || !noRekeningInput || !bankInput || !selectStatus) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    name_rek: namaRekeningInput,
    no_rek: noRekeningInput,
    bank: bankInput,
    status : selectStatus
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Rekening',
    text: 'Anda Yakin Menambah Data Rekening?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      addBank(postData);
    }
  });
});