import { BaseUrl, UrlPostConvection } from "../controller/template.js";
import { token } from "../controller/cookies.js";

// Create Url Post Store
const postConvetion = BaseUrl + UrlPostConvection;

// Function to add convection data
function addConvection(postData) {
    fetch(postConvetion, {
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
          title: 'Sukses!',
          icon: 'success',
          text: 'Data Pabrik Berhasil Ditambahkan!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'pabrik_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data Pabrik Gagal Ditambahkan!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding store data:", error);
    });
  }
  
// Event listener for the "Tambah Pabrik" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const namaPabrikInput = document.querySelector('#namaPabrikInput').value;
  const alamatInput = document.querySelector('#alamatInput').value;
  const noHpInput = document.querySelector('#noHpInput').value;
  
  // Check if any of the fields is empty
  if (!namaPabrikInput || !alamatInput || !noHpInput) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    name: namaPabrikInput,
    address: alamatInput,
    phone_number: noHpInput
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Tambah Pabrik',
    text: 'Anda Yakin Menambah Data Pabrik?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      addConvection(postData);
    }
  });
});