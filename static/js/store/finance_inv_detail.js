import { BaseUrl, UrlGetInvoiceById, UrlGetByIdContact, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const InvoiceById = BaseUrl + UrlGetInvoiceById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;

// Fetch Data Convection
fetch(InvoiceById, requestOptionsGet)
.then(response => response.json())
.then(data => {
    const contactId = data.data.contact_id;
            
    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
        .then(response => response.json())
        .then(contactData => {
            if (contactData && contactData.data) {
                const contactName = contactData.data.name;
                document.getElementById("customerInput").value = contactName;
            }
    });

    // Populate form fields with data
    const createdAt = new Date(data.data.created_at);
    const formattedDate = createdAt.toISOString().split('T')[0];
	document.getElementById("dateInput").value = formattedDate;
    // Pengkondisia untuk Broker
    if (data.data.broker === null) {
        document.getElementById("brokerInput").value = "Tidak Memilih Broker";
    } else {
        document.getElementById("brokerInput").value = data.data.broker;
    }
    document.getElementById("amountInput").value = data.data.paid_price;
})
.catch(error => console.error('Error:', error));