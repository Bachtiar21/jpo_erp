import { BaseUrl, UrlGetStoreById, UrlBanStore, UrlUnbanStore, UrlPutStore, requestOptionsGet, requestOptionsPost } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const StoreById = BaseUrl + UrlGetStoreById + `/${id}`;
const BanStore = BaseUrl + UrlBanStore + `/${id}`;
const UnbanStore = BaseUrl + UrlUnbanStore + `/${id}`;
const PutStore = BaseUrl + UrlPutStore + `/${id}`;

let tokoData;

// Fetch Data Convection
fetch(StoreById, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values && values.data) { // Memastikan values dan values.data tidak undefined
            tokoData = values.data;

			document.getElementById("namaTokoInput").value = values.data.name;
			document.getElementById("alamatInput").value = values.data.address;
			document.getElementById("noHpInput").value = values.data.phone_number;

			// Periksa status pengguna dan tandai checkbox sesuai
            if (values.data.status === 'active') {
                document.getElementById("suspend").checked = false;
            } else if (values.data.status === 'suspend') {
                document.getElementById("suspend").checked = true;
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
	const namaTokoInput = document.getElementById('namaTokoInput').value;
	const alamatInput = document.getElementById('alamatInput').value;
	const noHpInput = document.getElementById('noHpInput').value;

	const updatedData = {
		name: namaTokoInput,
		address: alamatInput,
		phone_number: noHpInput
	};
    
	if (isDataChanged(tokoData, updatedData)) {
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
		title: 'Perubahan Data Toko',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updateToko(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Data Toko Berhasil Diperbarui',
				showConfirmButton: false,
				timer: 1500
			})
			.then(() => {
				window.location.href = 'toko_view.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Data Toko Gagal Diperbarui!',
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
function updateToko(data) {
	fetch(PutStore, {
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

// Ban & Unban Toko
const suspendCheckbox = document.getElementById("suspend");
suspendCheckbox.addEventListener("change", function() {
    // Menampilkan pesan konfirmasi menggunakan SweetAlert
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin melakukan ' + (suspendCheckbox.checked ? 'ban' : 'unban') + ' toko ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "Ya", lanjutkan dengan ban atau unban toko
            if (suspendCheckbox.checked) {
                fetch(BanStore, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title : 'Sukses!', 
                                text : 'Toko berhasil dibanned.', 
                                icon : 'success',
                                timer : 1500,
                                showConfirmButton : false
                            })
							.then(() => {
								window.location.href = 'toko_view.html';
							});
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan ban toko.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
                        console.error("Error:", error);
                    });
            } else {
                fetch(UnbanStore, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title : 'Sukses!', 
                                text : 'Toko berhasil diunbanned.', 
                                icon : 'success',
                                timer : 1500,
                                showConfirmButton : false
                            })
							.then(() => {
								window.location.href = 'toko_view.html';
							})
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan unban toko.', 'error');
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
