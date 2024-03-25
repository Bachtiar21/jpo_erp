import { BaseUrl, UrlPostLogin } from "./controller/template.js";

// Fungsi untuk melakukan login
function login() {
    var username = document.getElementById("usernameInput").value;
    var password = document.getElementById("passwordInput").value;
    var UrlLogin = BaseUrl + UrlPostLogin;

    fetch(UrlLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        // Jika login berhasil
        if (data.access_token) {
            // Tampilkan SweetAlert sukses
            Swal.fire({
                title: 'Login Berhasil!',
                text: 'Anda berhasil login.',
                icon: 'success',
                timer: 1500,
                showConfirmButton : false
            }).then(() => {
                // Simpan access token dalam cookie
                document.cookie = "login=" + data.access_token;
                console.log("Access token disimpan dalam cookie.");

                // Alihkan ke halaman index.html
                window.location.href = "index.html";
            });
        } else if (data.error === "Anda telah dilarang akses ke aplikasi ini.") {
            // Jika login gagal karena user telah dilarang akses
            Swal.fire({
                title: 'Akses Dilarang!',
                text: 'Anda telah dilarang akses ke aplikasi ini.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            // Jika login gagal karena alasan lain
            Swal.fire({
                title: 'Login Gagal!',
                text: 'Username atau password salah.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Listener untuk login ke Dashboard ketika tombol "Enter" ditekan
document.getElementById("passwordInput").addEventListener("keyup", function(event) {
    // Check jika tombol yang ditekan adalah tombol "Enter"
    if (event.key === "Enter") {
        // Lakukan login
        login();
    }
});

// Listener untuk login ke Dashboard ketika tombol login ditekan
document.getElementById("buttonLogin").addEventListener("click", login);
