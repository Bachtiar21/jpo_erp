import { BaseUrl, UrlPostToken } from "../controller/template.js";
import { token } from "../controller/cookies.js";

// Create Url Post Token
const postToken = BaseUrl + UrlPostToken;

// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const jumlahTokenInput = document.querySelector('#jumlahTokenInput').value;
  
  // Check if any of the fields is empty
  if (!jumlahTokenInput) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    token: "token",
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Token',
    text: 'Anda Yakin Menambah Token?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(postToken + `/${jumlahTokenInput}`, {
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
          text: 'Token Berhasil Ditambahkan!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'token_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Token Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding token data:", error);
    });
    }
  });
});