import { BaseUrl, UrlGetSalesOrderById, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetSalesOrderById = BaseUrl + UrlGetSalesOrderById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch data from API endpoint
fetch(GetSalesOrderById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    // Pengkondisian Button Received
    if (data.data.status === "done") {
        document.getElementById("sentButton").setAttribute("hidden", "hidden");
    } else {
        // Pengkondisian ketika klik button Received
        document.getElementById("sentButton").addEventListener("click", function() {
            // Menampilkan SweetAlert konfirmasi
            Swal.fire({
                title: 'Sent Sales Order?',
                text: "Apakah kamu yakin akan Sent sales order?",
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
    document.getElementById('nomorSoInput').value = data.data.no_so;
    document.getElementById('namaBarangInput').value = data.data.nama_barang;
    // document.getElementById('spesifikasiInput').value = `Ketebalan: ${data.data.ketebalan} Cm, Setting: ${data.data.setting} Inch, Gramasi: ${data.data.gramasi}`;
    document.getElementById('ketebalanInput').value = data.data.ketebalan;
    document.getElementById('settingInput').value = data.data.setting;
    document.getElementById('gramasiInput').value = data.data.gramasi;
    document.getElementById('stokInput').value = `Stok Roll : ${data.data.stock_roll}, Stok Kg : ${data.data.stock_kg}, Stok Rib : ${data.data.stock_rib}`;
    document.getElementById('gradeInput').value = data.data.grade;
    document.getElementById('skuInput').value = data.data.sku;
    document.getElementById('tanggalInput').value = data.data.date;
    document.getElementById('deskripsiInput').value = data.data.description;
    document.getElementById('brokerFeeInput').value = data.data.broker_fee;
})
.catch(error => console.error('Error:', error));