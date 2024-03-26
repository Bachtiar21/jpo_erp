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
const dropdownVendor = document.getElementById("listVendor");
fetch(AllContact, requestOptionsGet)
    .then((response) => response.json())
    .then((data) => {
        data.data.forEach((vendor) => {
            const option = document.createElement("option");
            option.value = vendor.id;
            option.textContent = vendor.name;
            dropdownVendor.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('Error fetching contacts:', error);
});