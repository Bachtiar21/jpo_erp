import { BaseUrl, BaseUrlFe, BaseUrlFeDeploy, UrlLogoutUser, requestOptionsPost } from "./template.js";

// Url Logout User
const LogoutUser = BaseUrlFeDeploy + UrlLogoutUser;

// Tambahkan event listener untuk tombol logout
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
    // Tampilkan alert konfirmasi menggunakan SweetAlert
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin keluar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
    }).then((result) => {
        // Jika pengguna menekan tombol Ya
        if (result.isConfirmed) {
            // Lakukan permintaan HTTP POST ke endpoint logout
            fetch(LogoutUser, requestOptionsPost)
            .then(response => {
                // Periksa status respons
                if (response.ok) {
                    // Tampilkan alert sukses menggunakan SweetAlert
                    Swal.fire({
                        title: 'Sukses!',
                        text: 'Anda telah berhasil logout.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton : false
                    }).then(() => {
                        // Redirect ke halaman login setelah menutup alert sukses
                        window.location.href = BaseUrlFe + 'index.html';
                    });
                } else {
                    // Tampilkan alert kesalahan menggunakan SweetAlert
                    Swal.fire({
                        title: 'Error!',
                        text: 'Terjadi kesalahan saat logout.',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Tampilkan alert kesalahan menggunakan SweetAlert
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat logout.',
                    icon: 'error'
                });
            });
        }
    });
});