import { BaseUrl, UrlGetBillById, UrlGetByIdContact, UrlGetBankById, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const BillById = BaseUrl + UrlGetBillById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetBankById = BaseUrl + UrlGetBankById;

// Fetch Data Convection
fetch(BillById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
    const bankId = data.data.bank_id;
    const sellPrice = data.data.bill_price;
    const payment = data.data.payment;
    const remainingPayment = sellPrice - payment;

    // Menentukan teks yang akan ditampilkan pada elemen h5
    const ketPayment = `Informasi : Sell Price yang harus dibayar (${sellPrice}), Payment yang sudah dibayar (${payment}), dan Sisa yang harus dibayar (${remainingPayment})`;
            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("vendorInput").value = contactName;
            }
    });

    // Fetch data Rekening
    fetch(GetBankById + `/${bankId}`, requestOptionsGet)
        .then((response) => response.json())
        .then((bankData) => {
            if (bankData && bankData.data) {
            const bankName = bankData.data.bank + "(" + bankData.data.no_rek + ")" + "-" + bankData.data.name_rek;
            document.getElementById("rekeningInput").value = bankName;
            }
    });

    // Mendapatkan tanggal dari created_at
    const createdDate = new Date(data.data.created_at);
    const today = new Date();
    const timeDifference = Math.abs(today - createdDate);
    const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // Menentukan nilai Aging berdasarkan status Paid atau tidak
    let aging;
    if (data.data.paid_status === 'paid') {
        aging = 0;
    } else {
        aging = differenceInDays;
    }

    // Populate form fields with data
    document.getElementById("dateInput").value = aging + " Hari";
    document.getElementById("jumlahInput").value = data.data.bill_price;
    document.getElementById("paymentInput").value = data.data.payment;
    document.getElementById("ketPayment").innerText = ketPayment;
})
.catch(error => console.error('Error:', error));

// Menambahkan event listener untuk button "Update Data"
const updateButton = document.querySelectorAll('#updateButton');
	updateButton.forEach(button => {
		button.addEventListener('click', () => {
		window.location.href = `finance_bill_edit.html?id=${id}`;
	});
});