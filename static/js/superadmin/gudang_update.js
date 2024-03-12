import { BaseUrl, UrlGetAllConvection, UrlGetAllStore, UrlGetWarehouseById, UrlBanWarehouse, UrlUnbanWarehouse, UrlPutWarehouse, requestOptionsGet, requestOptionsPost } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const WarehouseById = BaseUrl + UrlGetWarehouseById + `/${id}`;
const BanWarehouse = BaseUrl + UrlBanWarehouse + `/${id}`;
const UnbanWarehouse = BaseUrl + UrlUnbanWarehouse + `/${id}`;
const PutWarehouse = BaseUrl + UrlPutWarehouse + `/${id}`;

let gudangData;

// Fetch Data Convection
fetch(WarehouseById, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((values) => {
        if (values && values.data) {
            gudangData = values.data;

            document.getElementById("namaGudangInput").value = values.data.name;
            document.getElementById("alamatInput").value = values.data.address;
            document.getElementById("noHpInput").value = values.data.phone_number;
            // Periksa status pengguna dan tandai checkbox sesuai
            if (values.data.status === 'active') {
                document.getElementById("suspend").checked = false;
            } else if (values.data.status === 'suspend') {
                document.getElementById("suspend").checked = true;
            }

            // Set nilai select sesuai dengan kondisi convection_id dan store_id
            if (values.data.convection_id && !values.data.store_id) {
                document.getElementById("selectTokoPabrik").value = "convection";
                document.getElementById("convectionDropdown").removeAttribute("hidden");

                // Panggil API untuk mendapatkan data convection
                fetch(BaseUrl + UrlGetAllConvection, requestOptionsGet)
                    .then((result) => result.json())
                    .then((convectionData) => {
                        // Kosongkan pilihan dropdown convection sebelum mengisi data baru
                        document.getElementById("listConvection").innerHTML = "";

                        // Loop melalui data convection dan tambahkan setiap opsi ke dropdown
                        convectionData.data.forEach(convection => {
                            let option = document.createElement("option");
                            option.value = convection.id; // Atur nilai opsi ke ID convection
                            option.text = convection.name; // Atur teks opsi ke nama convection
                            document.getElementById("listConvection").appendChild(option);
                        });

                        // Set nilai default pada dropdown "Toko/Pabrik"
                        document.getElementById("listConvection").value = values.data.convection_id;
                    })
                    .catch(error => console.log('error', error));
            } else if (!values.data.convection_id && values.data.store_id) {
                document.getElementById("selectTokoPabrik").value = "store";
                document.getElementById("storeDropdown").removeAttribute("hidden");

                // Panggil API untuk mendapatkan data store
                fetch(BaseUrl + UrlGetAllStore, requestOptionsGet)
                    .then((result) => result.json())
                    .then((storeData) => {
                        // Kosongkan pilihan dropdown store sebelum mengisi data baru
                        document.getElementById("listStore").innerHTML = "";

                        // Loop melalui data store dan tambahkan setiap opsi ke dropdown
                        storeData.data.forEach(store => {
                            let option = document.createElement("option");
                            option.value = store.id; // Atur nilai opsi ke ID store
                            option.text = store.name; // Atur teks opsi ke nama store
                            document.getElementById("listStore").appendChild(option);
                        });

                        // Set nilai default pada dropdown "Toko/Pabrik"
                        document.getElementById("listStore").value = values.data.store_id;
                    })
                    .catch(error => console.log('error', error));
            }
        } else {
            console.log("Data tidak ditemukan");
        }
    })
    .catch(error => {
        console.log('error', error);
});

// Update Data Toko
// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	const namaGudangInput = document.getElementById('namaGudangInput').value;
	const alamatInput = document.getElementById('alamatInput').value;
	const noHpInput = document.getElementById('noHpInput').value;
	const updatedData = {
		name: namaGudangInput,
		address: alamatInput,
		phone_number: noHpInput
	};
    
	if (isDataChanged(gudangData, updatedData)) {
		showConfirmationAlert(updatedData);
	} else {
		showNoChangeAlert();
	}
});
// Fungsi untuk membandingkan apakah ada perubahan pada data
function isDataChanged(existingData, newData) {
	return (
		existingData.name !== newData.name ||
		existingData.address !== newData.address ||
		existingData.phone_number !== newData.phone_number
	);
}
// Fungsi untuk menampilkan alert konfirmasi perubahan data
function showConfirmationAlert(data) {
	Swal.fire({
		title: 'Perubahan Data Gudang',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updateGudang(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Data Gudang Berhasil Diperbarui',
				showConfirmButton: false,
				timer: 1500
			})
			.then(() => {
				window.location.href = 'gudang_view.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Data Gudang Gagal Diperbarui!',
			});
		}
	});
}
// Function untuk Alert Error
function showNoChangeAlert() {
	Swal.fire({
		icon: 'warning',
		title: 'Oops...',
		text : 'Tidak Ada Perubahan Data'
	});
}
// Function Fetch Endpoint Put
function updateGudang(data) {
	fetch(PutWarehouse, {
		method: "PUT",
		headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
		body: JSON.stringify(data)
	})
		.catch(error => {
			console.error("Error saat melakukan PUT data:", error);
	});
}

// Ban & Unban Warehouse
const suspendCheckbox = document.getElementById("suspend");
suspendCheckbox.addEventListener("change", function() {
    // Menampilkan pesan konfirmasi menggunakan SweetAlert
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin melakukan ' + (suspendCheckbox.checked ? 'ban' : 'unban') + ' gudang ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "Ya", lanjutkan dengan ban atau unban gudang
            if (suspendCheckbox.checked) {
                fetch(BanWarehouse, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title: 'Sukses!',
                                text: 'Gudang berhasil dibanned.',
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false
                            })
							.then(() => {
								window.location.href = 'gudang_view.html';
							});
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan ban gudang.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
                        console.error("Error:", error);
                    });
            } else {
                fetch(UnbanWarehouse, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title :'Sukses!', 
                                text : 'Gudang berhasil diunbanned.', 
                                icon : 'success',
                                timer : 1500,
                                showConfirmButton : false
                            })
							.then(() => {
								window.location.href = 'gudang_view.html';
							})
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan unban gudang.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
                        console.error("Error:", error);
                    });
            }
        }
    });
});