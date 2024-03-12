import { BaseUrl, UrlCekUser, requestOptionsPost } from "./controller/template.js";
import { setInnerText } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.5/croot.js";

// Fungsi untuk menampilkan navbarIndex dan menyembunyikan navbarHome
function tampilkanNavbarIndex() {
    document.getElementById('navbarHome').style.display = 'none';
    document.getElementById('navbarIndex').removeAttribute('hidden');
}

// Fungsi untuk menampilkan navbarHome dan menyembunyikan navbarIndex
function tampilkanNavbarHome() {
    document.getElementById('navbarHome').style.display = 'block';
    document.getElementById('navbarIndex').setAttribute('hidden', 'true');
}

// Create Url Cek User
const CekUser = BaseUrl + UrlCekUser;
  
// Melakukan permintaan POST ke endpoint
fetch(CekUser, requestOptionsPost)
    .then(response => {
        if (response.ok) {
            return response.json(); // Mengonversikan respons ke JSON
        } else {
            throw new Error('Gagal memuat data pengguna');
        }
    })
    .then(data => {
        setInnerText('namaUser', data.name); // Menyetel inner text dari elemen dengan id 'namaUser' dengan nilai 'name' dari data
        tampilkanNavbarIndex(); // Menampilkan navbarIndex setelah mendapatkan data
    })
    .catch(error => {
        console.error('Terjadi kesalahan:', error);
        tampilkanNavbarHome(); // Menampilkan navbarHome jika terjadi kesalahan
    });