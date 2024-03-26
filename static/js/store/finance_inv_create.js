import { BaseUrl, UrlGetAllBank, UrlGetAllContact, requestOptionsGet } from "../controller/template.js";

const AllContact = BaseUrl + UrlGetAllContact;
const AllBank = BaseUrl + UrlGetAllBank;

// Fetch Data Rekening di Dropdown
const dropdownRekening = document.getElementById("listRekening");
fetch(AllBank, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((bank) => {
            const option = document.createElement("option");
            option.value = bank.id;
            option.textContent = bank.name;
            dropdownRekening.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching banks:', error);
});

// Fetch Data Customer di Dropdown
const dropdownCustomer = document.getElementById("listCustomer");
fetch(AllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((contact) => {
            const option = document.createElement("option");
            option.value = contact.id;
            option.textContent = contact.name;
            dropdownCustomer.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching contacts:', error);
});

// Fetch Data Customer di Dropdown
const dropdownBroker = document.getElementById("listBroker");
fetch(AllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((broker) => {
            const option = document.createElement("option");
            option.value = broker.id;
            option.textContent = broker.name;
            dropdownBroker.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching contacts:', error);
});