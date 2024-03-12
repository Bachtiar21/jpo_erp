import { BaseUrl, UrlCekUser, requestOptionsPost } from "./controller/template.js";

const CekUser = BaseUrl + UrlCekUser;

// Fetch Data Profil
fetch(CekUser, requestOptionsPost)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values) {
			// Tampilkan data karyawan ke dalam form
			document.getElementById("fullNameInput").value = values.name;
			document.getElementById("usernameInput").value = values.username;
			document.getElementById("noHpInput").value = values.phone_number;
            document.getElementById("rolesInput").value = values.roles;
		} else {
			console.log(error);
		}
	})
	.catch(error => {
		console.log('error', error);
	});