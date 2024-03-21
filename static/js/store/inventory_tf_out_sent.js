import { BaseUrl, UrlSentTransferOut } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// const GetTransferInById = BaseUrl + UrlGetTransferInById + `/${id}`;
const sentTransferOut = BaseUrl + UrlSentTransferOut + `/${id}/receive`;

// // Fetch data from API endpoint
// fetch(GetTransferInById, requestOptionsGet)
//   .then(response => response.json())
//     .then(data => {
//         // Populate form fields with data
//         document.getElementById('tanggalInput').value = data.data.date;
//     })
// .catch(error => console.error('Error:', error));

// Function to add bank data
function SentTransferOut(postData) {
    fetch(sentTransferOut, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Transfer in received successfully") {
        // Display success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Sukses!',
          text: 'Transfer Out Berhasil Di sent!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh the page after successful addition
          window.location.href = 'inventory_tf_view.html';
        });
      } else {
        // Display error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Transfer Out Gagal Di sent!',
        });
      }
    })
    .catch(error => {
      console.error("Error while adding sent data:", error);
    });
  }
  
// Event listener for the "Tambah Karyawan" button
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
  // Get input values
  const stokRib = document.querySelector('#stokRib').value;
  const stokRoll = document.querySelector('#stokRoll').value;
  const stokKg = document.querySelector('#stokKg').value;
  
  // Check if any of the fields is empty
  if (!stokRib || !stokRoll || !stokKg) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Semua field harus diisi!',
    });
    return; // Stop further processing
  }

  // Create a data object to be sent
  const postData = {
    stock_roll_rev : stokRoll,
    stock_kg_rev: stokKg,
    stok_rib_rev : stokRib
  };
  
  // Display SweetAlert for confirmation
  Swal.fire({
    title: 'Sent Transfer Out',
    text: 'Anda Yakin Sent Transfer Out?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call function to add employee data
      SentTransferOut(postData);
    }
  });
});