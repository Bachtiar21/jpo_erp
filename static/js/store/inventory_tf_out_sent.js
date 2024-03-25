import { BaseUrl, UrlSentTransferOut } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const sentTransferOut = BaseUrl + UrlSentTransferOut + `/${id}/sent`;

// Default Tanggal Receive
document.getElementById('tanggalInput').value = new Date().toISOString().split('T')[0];

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
      if (data.message === "Transfer out received successfully") {
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
  const sentDate = document.querySelector('#tanggalInput').value;
  
  // Check if any of the fields is empty
  if (!stokRib || !stokRoll || !stokKg || !sentDate) {
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
    stock_rib_rev : stokRib,
    sent_date : sentDate
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