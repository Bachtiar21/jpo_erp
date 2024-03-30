import { BaseUrl, UrlGetByIdPurchaseOrder, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const GetByIdPurchaseOrder = BaseUrl + UrlGetByIdPurchaseOrder + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetWarehouseByIdByToken = BaseUrl + UrlGetWarehouseByIdByToken;

// Fetch Data User
fetch(GetByIdPurchaseOrder, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((values) => {
        if (values && values.data) {
            // Pengkondisian Button Received & Paid
            if (values.data.status === "done") {
                document.getElementById("receivedButton").setAttribute("hidden", "hidden");
                document.getElementById("paidButton").setAttribute("hidden", "hidden");
            } else {
                document.getElementById("paidButton").addEventListener("click", function() {
                    // Menampilkan SweetAlert konfirmasi
                    Swal.fire({
                        title: 'Paid Purchase Order?',
                        text: "Apakah kamu yakin akan Paid Purchase Order?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, yakin!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
                            window.location.href = `../finance/finance_bill_paid.html?id=${id}`;
                        }
                    });
                });

                document.getElementById("receivedButton").addEventListener("click", function() {
                    // Menampilkan SweetAlert konfirmasi
                    Swal.fire({
                        title: 'Received Purchase Order?',
                        text: "Apakah kamu yakin akan Received Purchase Order?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, yakin!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
                            window.location.href = `../transfer/inventory_tf_in_received.html?id=${id}`;
                        }
                    });
                });
            }
            // Ambil data PO
            const purchaseOrderData = values.data;
            const contactId = purchaseOrderData.contact_id;
            const warehouseId = purchaseOrderData.warehouse_id;
            
            // Fetch data kontak
            fetch(GetContactById + `/${contactId}`, requestOptionsGet)
                .then(response => response.json())
                .then(contactData => {
                    if (contactData && contactData.data) {
                        const contactName = contactData.data.name;
                        document.getElementById("contactInput").value = contactName;
                    }
            });

            // Fetch data kontak
            fetch(GetWarehouseByIdByToken + `/${warehouseId}`, requestOptionsGet)
                .then(response => response.json())
                .then(warehouseData => {
                    if (warehouseData && warehouseData.data) {
                        const warehouseName = warehouseData.data.name;
                        document.getElementById("warehouseInput").value = warehouseName;
                    }
            });

            // Set nilai-nilai PO ke dalam elemen HTML yang sesuai
            document.getElementById("nomorDoInput").value = purchaseOrderData.no_po;
            document.getElementById("namaBarangInput").value = purchaseOrderData.nama_barang;
            document.getElementById('spesifikasiInput').value = `Ketebalan: ${purchaseOrderData.ketebalan}, Setting: ${purchaseOrderData.setting}, Gramasi: ${purchaseOrderData.gramasi}`;
            document.getElementById("gradeInput").value = purchaseOrderData.grade;
            document.getElementById("skuInput").value = purchaseOrderData.sku;
            document.getElementById("tanggalInput").value = purchaseOrderData.date;
            document.getElementById('deskripsiInput').value = purchaseOrderData.description;
            document.getElementById('stokInput').value = `Stock Rev : ${purchaseOrderData.stock_roll_rev} Roll, ${purchaseOrderData.stock_kg_rev} Kg, Stock Rib Rev : ${purchaseOrderData.stock_rib_rev}`;
            document.getElementById('hargaInput').value = purchaseOrderData.price;
            const imageElement = document.getElementById("fotoInput");
            imageElement.src = purchaseOrderData.attachment_image;
            document.getElementById("listStatus").value = purchaseOrderData.status;
        } else {
            console.log("Data tidak ditemukan");
        }
    })
    .catch(error => {
        console.log('error', error);
});

// Menambahkan event listener untuk button "Edit PO"
const editPOButtons = document.querySelectorAll('.btn-primary');
editPOButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = `purchase_po_edit.html?id=${id}`;
    });
});