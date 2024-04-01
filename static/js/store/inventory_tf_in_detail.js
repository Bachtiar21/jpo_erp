import { BaseUrl, UrlGetTransferInById, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetTransferInById = BaseUrl + UrlGetTransferInById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch data from API endpoint
fetch(GetTransferInById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    // Pengkondisian Button Received
    if (data.data.status === "done") {
        document.getElementById("receivedButton").setAttribute("hidden", "hidden");
    } else {
        // Pengkondisian ketika klik button Received
        document.getElementById("receivedButton").addEventListener("click", function() {
            // Menampilkan SweetAlert konfirmasi
            Swal.fire({
                title: 'Received Transfer In?',
                text: "Apakah kamu yakin akan received transfer in?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, yakin!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
                    window.location.href = `inventory_tf_in_received.html?id=${id}`;
                }
            });
        });
    }

    const contactId = data.data.contact_id;
    const  warehouseId = data.data.warehouse_id;
            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("listVendor").value = contactName;
            }
    });
    // Fetch data Warehouse
    fetch(GetWarehouseByIdByToken + `/${warehouseId}`, requestOptionsGet)
    .then(response => response.json())
    .then(warehouseData => {
        if (warehouseData && warehouseData.data) {
            const warehouseName = warehouseData.data.name;
            document.getElementById("listWarehouse").value = warehouseName;
        }
    });
    // Populate form fields with data
    document.getElementById('nomorDoInput').value = data.data.no_do;
    document.getElementById('namaBarangInput').value = data.data.nama_barang;
    document.getElementById('spesifikasiInput').value = `Ketebalan: ${data.data.ketebalan} Cm, Setting: ${data.data.setting} Inch, Gramasi: ${data.data.gramasi}`;
    document.getElementById('stokInput').value = `Stok Roll : ${data.data.stock_roll}, Stok Kg : ${data.data.stock_kg}, Stok Rib : ${data.data.stock_rib}`;
    document.getElementById('gradeInput').value = data.data.grade;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('tanggalInput').value = data.data.date;
    document.getElementById('deskripsiInput').value = data.data.description;
})
.catch(error => console.error('Error:', error));

// Menambahkan event listener untuk button "Print"
const printButton = document.querySelectorAll('#printButton');
printButton.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = `inventory_tf_in_print.html?id=${id}`;
    });
});