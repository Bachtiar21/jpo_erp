import { BaseUrl, UrlGetConvectionById, UrlPutConvection, UrlBanConvection, UrlUnbanConvection, requestOptionsPost, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ConvectionById = BaseUrl + UrlGetConvectionById + `/${id}`;
const PutConvectionById = BaseUrl + UrlPutConvection + `/${id}`;
const BanConvection = BaseUrl + UrlBanConvection + `/${id}`;
const UnbanConvection = BaseUrl + UrlUnbanConvection + `/${id}`;

let pabrikData;

// Fetch Data Convection
fetch(ConvectionById, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values && values.data) { // Memastikan values dan values.data tidak undefined
			document.getElementById("namaPabrikInput").value = values.data.name;
			document.getElementById("alamatInput").value = values.data.address;
			document.getElementById("noHpInput").value = values.data.phone_number;
			pabrikData = values.data; // Menyimpan data pabrik untuk digunakan nanti

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

// Ban & Unban Convection
const suspendCheckbox = document.getElementById("suspend");

suspendCheckbox.addEventListener("change", function() {
    // Menampilkan pesan konfirmasi menggunakan SweetAlert
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin melakukan ' + (suspendCheckbox.checked ? 'ban' : 'unban') + ' pabrik ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "Ya", lanjutkan dengan ban atau unban pabrik
            if (suspendCheckbox.checked) {
                fetch(BanConvection, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
								title : 'Sukses!', 
								text : 'Pabrik berhasil dibanned.', 
								icon : 'success',
								timer : 1500,
								showConfirmButton : false
							})
							.then(() => {
								window.location.href = 'pabrik_view.html';
							});
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan ban pabrik.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
                        console.error("Error:", error);
                    });
            } else {
                fetch(UnbanConvection, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
								title: 'Sukses!', 
								text : 'Pabrik berhasil diunbanned.', 
								icon : 'success',
								timer : 1500,
								showConfirmButton : false
							})
							.then(() => {
								window.location.href = 'pabrik_view.html';
							})
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan unban pabrik.', 'error');
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



// Event listener untuk tombol "Submit Perizinan"
const submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', () => {
	const namaPabrikInput = document.getElementById("namaPabrikInput").value;
	const alamatInput = document.getElementById("alamatInput").value;
	const noHpInput = document.getElementById("noHpInput").value;

	const updatedData = {
		name: namaPabrikInput,
		address: alamatInput,
		phone_number: noHpInput
	};

	// Compare updated data with existing data
	if (isDataChanged(pabrikData, updatedData)) {
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
		title: 'Perubahan Data Pabrik',
		text: "Apakah anda yakin ingin melakukan perubahan?",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes',
		cancelButtonText: 'No'
	}).then((result) => {
		if (result.isConfirmed) {
			updatePabrikData(data);
			// Menampilkan Data Alert Success
			Swal.fire({
				icon: 'success',
				title: 'Sukses!',
				text: 'Data Pabrik Berhasil Diperbarui',
				showConfirmButton: false,
				timer: 1500
			})
			.then(() => {
				window.location.href = 'pabrik_view.html';
			});
		} else {
			// Menampilkan Data Alert Error
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Data Pabrik Gagal Diperbarui!',
			});
		}
	});
}

// Fungsi untuk menampilkan alert jika tidak ada perubahan pada data
function showNoChangeAlert() {
	Swal.fire({
		icon: 'warning',
		title: 'Oops...',
		text : 'Tidak Ada Perubahan Data'
	});
}

// Untuk Update data ke data pabrik
function updatePabrikData(data) {
    fetch(PutConvectionById, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal melakukan PUT data');
            }
            // Handle response jika berhasil
            console.log('Data berhasil diperbarui');
        })
        .catch(error => {
            console.error("Error saat melakukan PUT data:", error);
        });
}