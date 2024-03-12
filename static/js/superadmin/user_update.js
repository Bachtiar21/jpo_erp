import { BaseUrl, UrlGetAllStore, UrlGetAllConvection, UrlGetUserById, UrlBanUser, UrlUnbanUser, requestOptionsGet, requestOptionsPost, UrlPutUser } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const UserById = BaseUrl + UrlGetUserById + `/${id}`;
const BanUser = BaseUrl + UrlBanUser + `/${id}`;
const UnbanUser = BaseUrl + UrlUnbanUser + `/${id}`;
const PutUserById = BaseUrl + UrlPutUser + `/${id}`

// Fetch Data User
fetch(UserById, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((values) => {
		if (values && values.user) { // Memastikan values dan values.user tidak undefined
			document.getElementById("fullNameInput").value = values.user.name;
			document.getElementById("noHpInput").value = values.user.phone_number;
			document.getElementById("usernameInput").value = values.user.username;
            document.getElementById("selectRoles").value = values.user.roles;

            // Periksa status pengguna dan tandai checkbox sesuai
            if (values.user.status === 'active') {
                document.getElementById("suspend").checked = false;
            } else if (values.user.status === 'suspend') {
                document.getElementById("suspend").checked = true;
            }
		} else {
			console.log("Data tidak ditemukan");
		}
	})
	.catch(error => {
		console.log('error', error);
});

// Ban & Unban User
const suspendCheckbox = document.getElementById("suspend");

suspendCheckbox.addEventListener("change", function() {
    // Menampilkan pesan konfirmasi menggunakan SweetAlert
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin melakukan ' + (suspendCheckbox.checked ? 'ban' : 'unban') + ' user ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "Ya", lanjutkan dengan ban atau unban user
            if (suspendCheckbox.checked) {
                fetch(BanUser, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title : 'Sukses!', 
                                text : 'User berhasil dibanned.', 
                                icon : 'success',
                                timer : 1500,
                                showConfirmButton : false
                            })
							.then(() => {
								window.location.href = 'user_view.html';
							});
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan ban user.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
                        console.error("Error:", error);
                    });
            } else {
                fetch(UnbanUser, requestOptionsPost)
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                title : 'Sukses!', 
                                text : 'User berhasil diunbanned.', 
                                icon : 'success',
                                timer : 1500,
                                showConfirmButton : false
                            })
							.then(() => {
								window.location.href = 'user_view.html';
							})
                        } else {
                            Swal.fire('Error!', 'Gagal melakukan unban user.', 'error');
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

// Menambahkan event listener ke selectRoles
const selectRoles = document.getElementById("selectRoles");
selectRoles.addEventListener("change", function() {
    const selectedRole = selectRoles.value;

    // Menampilkan atau menyembunyikan form sesuai dengan peran yang dipilih
    if (selectedRole === "store") {
        document.getElementById("storeDropdown").removeAttribute("hidden");
        document.getElementById("convectionDropdown").setAttribute("hidden", "");
        // Fetch Data Store
        fetch(BaseUrl + UrlGetAllStore, requestOptionsGet)
        .then((result) => result.json())
        .then((storeData) => {
            const listStoreSelect = document.getElementById("listStoreSelect");
            // Kosongkan pilihan dropdown store sebelum mengisi data baru
            listStoreSelect.innerHTML = "";

            // Loop melalui data store dan tambahkan setiap opsi ke dropdown
            storeData.data.forEach(store => {
                let option = document.createElement("option");
                option.value = store.id; // Atur nilai opsi ke ID store
                option.text = store.name; // Atur teks opsi ke nama store
                listStoreSelect.appendChild(option);
            });
        })
        .catch(error => console.log('error', error));
    } else if (selectedRole === "convection") {
        document.getElementById("convectionDropdown").removeAttribute("hidden");
        document.getElementById("storeDropdown").setAttribute("hidden", "");
        // Fetch Data Convection
        fetch(BaseUrl + UrlGetAllConvection, requestOptionsGet)
            .then((result) => result.json())
            .then((convectionData) => {
                const listConvectionSelect = document.getElementById("listConvectionSelect");
                // Kosongkan pilihan dropdown convection sebelum mengisi data baru
                listConvectionSelect.innerHTML = "";

                // Loop melalui data convection dan tambahkan setiap opsi ke dropdown
                convectionData.data.forEach(convection => {
                    let option = document.createElement("option");
                    option.value = convection.id; // Atur nilai opsi ke ID convection
                    option.text = convection.name; // Atur teks opsi ke nama convection
                    listConvectionSelect.appendChild(option);
                });
        })
        .catch(error => console.log('error', error));
    } else {
        document.getElementById("storeDropdown").setAttribute("hidden", "");
        document.getElementById("convectionDropdown").setAttribute("hidden", "");
    }
});

// Untuk update data user
// Mendapatkan tombol "Simpan" dan menambahkan event listener
const updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", function () {
    // Menampilkan pesan konfirmasi menggunakan SweetAlert
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin menyimpan perubahan?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "Ya", lanjutkan dengan menyimpan perubahan
            updateUser();
        }
    });
});

// Fungsi untuk memperbarui data pengguna
function updateUser() {
    // Mendapatkan nilai dari inputan
    const fullName = document.getElementById("fullNameInput").value;
    const noHp = document.getElementById("noHpInput").value;
    const username = document.getElementById("usernameInput").value;
    const selectedRole = document.getElementById("selectRoles").value;
    let convectionId = null;
    let storeId = null;

    // Jika peran yang dipilih adalah "store" atau "convection", tetapkan nilai convectionId atau storeId sesuai dengan dropdown yang dipilih
    if (selectedRole === "store") {
        storeId = document.getElementById("listStoreSelect").value;
    } else if (selectedRole === "convection") {
        convectionId = document.getElementById("listConvectionSelect").value;
    }

    // Data pengguna yang akan diperbarui
    const userData = {
        name: fullName,
        phone_number: noHp,
        username: username,
        roles: selectedRole,
        convection_id: convectionId,
        store_id: storeId
    };

    // Permintaan untuk memperbarui data pengguna
    fetch(PutUserById, {
		method: "PUT",
		headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
		body: JSON.stringify(userData)
	})
        .then(response => {
            if (response.ok) {
                // Data pengguna berhasil diperbarui
                Swal.fire({
                    title: 'Sukses!',
                    text: 'Data pengguna berhasil diperbarui.',
                    icon: 'success'
                })
                .then(() => {
                    window.location.href = 'user_view.html';
                });
            } else {
                // Terjadi kesalahan saat memperbarui data pengguna
                Swal.fire('Error!', 'Gagal memperbarui data pengguna.', 'error');
            }
        })
        .catch(error => {
            // Terjadi kesalahan saat menghubungi server
            Swal.fire('Error!', 'Terjadi kesalahan saat menghubungi server.', 'error');
            console.error("Error:", error);
        });
}