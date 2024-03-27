import { BaseUrl, UrlGetSalesOrderById, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

// Pengkondisian ketika klik button Received
document.getElementById("receivedButton").addEventListener("click", function() {
    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
        title: 'Received Sales Order?',
        text: "Apakah kamu yakin akan received sales order?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, yakin!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
            window.location.href = `../transfer/inventory_tf_out_sent.html?id=${id}`;
        }
    });
});

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetSalesOrderById = BaseUrl + UrlGetSalesOrderById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch data from API endpoint
fetch(GetSalesOrderById, requestOptionsGet)
.then(response => response.json())
.then(data => {
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
    document.getElementById('nomorSoInput').value = data.data.no_so;
    document.getElementById('namaBarangInput').value = data.data.nama_barang;
    document.getElementById('spesifikasiInput').value = `Ketebalan: ${data.data.ketebalan}, Setting: ${data.data.setting}, Gramasi: ${data.data.gramasi}`;
    document.getElementById('stokInput').value = `Stok Roll : ${data.data.stock_roll}, Stok Kg : ${data.data.stock_kg}, Stok Rib : ${data.data.stock_rib}`;
    document.getElementById('gradeInput').value = data.data.grade;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('tanggalInput').value = data.data.date;
    document.getElementById('deskripsiInput').value = data.data.description;
    document.getElementById('inputHrefPO').value = data.data.no_po;
    document.getElementById('listStatus').value = data.data.status;
    document.getElementById('brokerFeeInput').value = data.data.broker_fee;
})
.catch(error => console.error('Error:', error));