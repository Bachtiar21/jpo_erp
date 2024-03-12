import { BaseUrl, UrlPostWarehouse, UrlGetAllConvection, UrlGetAllStore, requestOptionsGet } from "../controller/template.js";
import { token } from "../controller/cookies.js";

const PostWarehouse = BaseUrl + UrlPostWarehouse;
const AllStore = BaseUrl + UrlGetAllStore;
const AllConvection = BaseUrl + UrlGetAllConvection;

// Function to add warehouse data
function addWarehouse(postData) {
    fetch(PostWarehouse, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.data) {
            // Display success SweetAlert
            Swal.fire({
                title: 'Sukses!',
                text: 'Data Gudang Berhasil Ditambahkan!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Refresh the page after successful addition
                window.location.href = 'gudang_view.html';
            });
        } else {
            // Display error SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Data Gudang Gagal Ditambahkan!',
            });
        }
    })
    .catch(error => {
        console.error("Error while adding warehouse data:", error);
    });
}

// DOM Content untuk dropdown store dan convection
document.addEventListener('DOMContentLoaded', function() {
    const selectTokoPabrik = document.getElementById('selectTokoPabrik');
    const listStoreDiv = document.getElementById('classlistStore');
    const listConvectionDiv = document.getElementById('classlistConvection');
    const listStore = document.getElementById('listStore');
    const listConvection = document.getElementById('listConvection');

    selectTokoPabrik.addEventListener('change', function() {
        if (selectTokoPabrik.value === 'store') {
            fetch(AllStore, requestOptionsGet)
            .then(response => response.json())
            .then(({ data }) => {
                listStore.innerHTML = '<option selected>Pilih Store</option>';
                data.forEach(store => {
                    const optionElement = document.createElement('option');
                    optionElement.value = store.id;
                    optionElement.textContent = store.name;
                    listStore.appendChild(optionElement);
                });
                listStoreDiv.removeAttribute('hidden');
                listConvectionDiv.setAttribute('hidden', true);
            })
            .catch(error => {
                console.error('Error fetching stores:', error);
            });
        } else if (selectTokoPabrik.value === 'convection') {
            fetch(AllConvection, requestOptionsGet)
            .then(response => response.json())
            .then(({ data }) => {
                listConvection.innerHTML = '<option selected>Pilih Convection</option>';
                data.forEach(convection => {
                    const optionElement = document.createElement('option');
                    optionElement.value = convection.id;
                    optionElement.textContent = convection.name;
                    listConvection.appendChild(optionElement);
                });
                listConvectionDiv.removeAttribute('hidden');
                listStoreDiv.setAttribute('hidden', true);
            })
            .catch(error => {
                console.error('Error fetching convections:', error);
            });
        } else {
            listStoreDiv.setAttribute('hidden', true);
            listConvectionDiv.setAttribute('hidden', true);
        }
    });

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', () => {
        const namaGudang = document.getElementById('namaGudangInput').value;
        const alamatGudang = document.getElementById('alamatInput').value;
        const noHpGudang = document.getElementById('noHpInput').value;
        const selectedTokoPabrik = selectTokoPabrik.value;
        let selectedOption;

        if (selectedTokoPabrik === 'store') {
            selectedOption = listStore.value;
        } else if (selectedTokoPabrik === 'convection') {
            selectedOption = listConvection.value;
        } else {
            alert('Pilih Toko / Pabrik terlebih dahulu!');
            return;
        }

        const postData = {
            name: namaGudang,
            address: alamatGudang,
            phone_number: noHpGudang,
        };

        if (selectedTokoPabrik === 'store') {
            postData.store_id = selectedOption;
            delete postData.convection_id;
        } else if (selectedTokoPabrik === 'convection') {
            postData.convection_id = selectedOption;
            delete postData.store_id;
        }

        // Tampilkan SweetAlert konfirmasi
        Swal.fire({
            title: 'Tambah Gudang',
            text: 'Apakah Anda yakin ingin menambahkan data gudang?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                // Jika pengguna menekan "Ya", panggil fungsi addWarehouse
                addWarehouse(postData);
            }
        });
    });
});

