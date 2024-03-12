import { BaseUrl, UrlGetByIdContact, requestOptionsGet } from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ContactById = BaseUrl + UrlGetByIdContact + `/${id}`;

// Fetch Data Convection
fetch(ContactById, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values && values.data) {
			document.getElementById("namaInput").value = values.data.name;
			document.getElementById("noHpInput").value = values.data.phone_number;
			document.getElementById("alamatInput").value = values.data.address;

		} else {
			console.log("Data tidak ditemukan");
		}
	})
	.catch(error => {
		console.log('error', error);
});