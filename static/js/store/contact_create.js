import { BaseUrl, UrlPostContact } from "../controller/template.js";
import { token } from "../controller/cookies.js";

// Create Url Post Token
const postContact = BaseUrl + UrlPostContact;

// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const namaInput = document.querySelector('#namaInput').value;
  const noHpInput = document.querySelector('#noHpInput').value;
  const alamatInput = document.querySelector('#alamatInput').value;
  
  // Check if any of the fields is empty
  if (!namaInput || !noHpInput || !alamatInput) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    name: namaInput,
    phone_number: noHpInput,
    address: alamatInput
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Kontak',
    text: 'Anda Yakin Menambah Kontak?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(postContact, {
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
          text: 'Kontak Berhasil Ditambahkan!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'contact_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Kontak Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding contact data:", error);
    });
    }
  });
});