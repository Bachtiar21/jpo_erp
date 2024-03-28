import { BaseUrl, UrlGetBillById, UrlGetByIdContact, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const BillById = BaseUrl + UrlGetBillById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;

// Fetch Data Convection
fetch(BillById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("vendorInput").value = contactName;
            }
    });

    // Slicing Waktu Transaksi
    const createdAt = new Date(data.data.created_at);
    const formattedDate = createdAt.toISOString().split('T')[0];
	document.getElementById("dateInput").value = formattedDate;
    document.getElementById("jumlahInput").value = data.data.bill_price;
})
.catch(error => console.error('Error:', error));