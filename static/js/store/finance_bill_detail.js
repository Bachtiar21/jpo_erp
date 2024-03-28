import { BaseUrl, UrlGetBillById, UrlGetByIdContact, UrlGetBankById, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const BillById = BaseUrl + UrlGetBillById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetBankById = BaseUrl + UrlGetBankById;


// Pengkondisian ketika klik button Paid
document.getElementById("paidButton").addEventListener("click", function() {
    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
        title: 'Paid Bill?',
        text: "Apakah kamu yakin akan Paid Bill?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, yakin!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
            window.location.href = `finance_bill_paid.html?id=${id}`;
        }
    });
});

// Fetch Data Convection
fetch(BillById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
    const rekeningId = data.data.bank_id;

            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("vendorInput").value = contactName;
            }
    });

    // Fetch data Bank
    fetch(GetBankById + `/${rekeningId}`, requestOptionsGet)
        .then(response => response.json())
        .then(bankData => {
            if (bankData && bankData.data) {
                const bankName = bankData.data.Bank;
                document.getElementById("rekeningInput").value = bankName;
            }
    });

    // Slicing Waktu Transaksi
    const createdAt = new Date(data.data.created_at);
    const formattedDate = createdAt.toISOString().split('T')[0];
	document.getElementById("dateInput").value = formattedDate;
    document.getElementById("jumlahInput").value = data.data.bill_price;
    document.getElementById("paymentInput").value = data.data.payment;

    
})
.catch(error => console.error('Error:', error));