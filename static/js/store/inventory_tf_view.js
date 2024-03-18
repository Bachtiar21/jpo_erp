import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllTransferIn, UrlGetByIdContact, UrlGetAllTransferOut, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";
import { getBadgePO } from "../style/badge.js";


document.addEventListener('DOMContentLoaded', function() {
    const selectMenuTransfer = document.getElementById('selectMenuTransfer');
    const transferMenuIn = document.getElementById('transferMenuIn');
    const transferMenuOut = document.getElementById('transferMenuOut');

    selectMenuTransfer.addEventListener('change', function() {
        if (selectMenuTransfer.value === 'in') {
            transferMenuIn.removeAttribute('hidden');
            transferMenuOut.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Transfer In
            document.getElementById('createButton').href = 'inventory_tf_in_create.html';
        } else if (selectMenuTransfer.value === 'out') {
            transferMenuOut.removeAttribute('hidden');
            transferMenuIn.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Transfer Out
            document.getElementById('createButton').href = 'inventory_tf_out_create.html';
        } else {
            transferMenuIn.setAttribute('hidden', true);
            transferMenuOut.setAttribute('hidden', true);
        }
    });
});

// Fetch Data Transfer In
// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyIn");
	const buttonsebelumnya = CihuyId("prevPageBtnTfIn");
	const buttonselanjutnya = CihuyId("nextPageBtnTfIn");
	const halamansaatini = CihuyId("currentPageTfIn");
	const itemperpage = 5;
	let halamannow = 1;

    const AllTransferIn = BaseUrl + UrlGetAllTransferIn;
	const ContactById = BaseUrl + UrlGetByIdContact;
	const WarehouseByToken = BaseUrl + UrlGetWarehouseByIdByToken;

fetch(AllTransferIn, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		let tableData = "";
		data.data.map((values) => {
			let dataContact = "";
			let dataWarehouse = "";
                // Untuk Fetch Data Contact
                fetch(ContactById + `/${values.contact_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(contactData => {
                        dataContact = contactData.data.name;
                        document.getElementById(`contactCell${values.id}`).textContent = dataContact;
                });
				// Untuk Fetch Data Warehouse
                fetch(WarehouseByToken + `/${values.warehouse_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(warehouseData => {
                        dataWarehouse = warehouseData.data.name;
                        document.getElementById(`warehouseCell${values.id}`).textContent = dataWarehouse;
                });
				tableData += `
                        <tr>
                        <td hidden></td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.no_do}</p>
                        </td>
						<td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.no_po}</p>
                        </td>
						<td id="contactCell${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>
						<td id="warehouseCell${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama warehouse akan ditampilkan di sini -->
						</td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${getBadgePO(values.status)}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
							<button type="button" class="btn btn-info" data-tfin-id="${values.id}">Detail</button>	
                            <button type="button" class="btn btn-warning" data-tfin-id="${values.id}">Update</button>	
                            <button type="button" class="btn btn-danger" data-tfin-id="${values.id}">Delete</button>
                        </td>
                    </tr>`;
		});
		document.getElementById("tablebodyIn").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Update Data"
		const updateTfIn = document.querySelectorAll('.btn-warning');
		updateTfIn.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-tfin-id');
				window.location.href = `inventory_tf_in_edit.html?id=${id}`;
			});
		});
		
		// Menambahkan event listener untuk button "detail"
		const  detailTfIn = document.querySelectorAll('.btn-info');
		detailTfIn.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-tfin-id');
				window.location.href = `inventory_tf_in_detail.html?id=${id}`
			})
		})
		
	})
	.catch(error => {
		console.log('error', error);
	});

// Function Delete Data Rekening
// Add event listener for "Hapus" button
document.getElementById("tablebodyIn").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const id = target.getAttribute("data-bank-id");
	  if (id) {
		// Display SweetAlert confirmation dialog
		Swal.fire({
		  title: 'Hapus Data Rekening?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			// Rekening confirmed, call the function to handle deletion
			deleteBank(id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteBank(id) {
	fetch(DeleteBankById + `/${id}`, requestOptionsDelete)
	  .then((response) => response.json())
	  .then((data) => {
		// Handle successful deletion
		console.log("Data deleted:", data);
		// You might want to update the table or handle other UI updates here
		
		// Display success SweetAlert
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Rekening Berhasil Dihapus.',
			icon: 'success',
			timer: 1500,
			showConfirmButton: false
		  }).then(() => {
			// Reload the page after successful deletion
			location.reload();
		  });
		})
	  	.catch((error) => {
			console.error("Error deleting data:", error);
			
			// Display error SweetAlert
			Swal.fire(
			'Error!',
			'Data Rekening Gagal Dihapus',
			'error'
			);
	});
}

function displayData(page) {
	const baris = CihuyQuerySelector("#tablebodyIn tr");
	const mulaiindex = (page - 1) * itemperpage;
	const akhirindex = mulaiindex + itemperpage;

	for (let i = 0; i < baris.length; i++) {
		if (i >= mulaiindex && i < akhirindex) {
			baris[i].style.display = "table-row";
		} else {
			baris[i].style.display = "none";
		}
	}
}
function updatePagination() {
	halamansaatini.textContent = `Halaman ${halamannow}`;
}

buttonsebelumnya.addEventListener("click", () => {
	if (halamannow > 1) {
		halamannow--;
		displayData(halamannow);
		updatePagination();
	}
});

buttonselanjutnya.addEventListener("click", () => {
	const totalPages = Math.ceil(
		tablebody.querySelectorAll("#tablebodyIn tr").length / itemperpage
	);
	if (halamannow < totalPages) {
		halamannow++;
		displayData(halamannow);
		updatePagination();
	}
  });
});

// Fetch Data Transfer Out
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyOut");
	const buttonsebelumnya = CihuyId("prevPageBtnTfOut");
	const buttonselanjutnya = CihuyId("nextPageBtnTfOut");
	const halamansaatini = CihuyId("currentPageTfOut");
	const itemperpage = 5;
	let halamannow = 1;

	const AllTransferOut = BaseUrl + UrlGetAllTransferOut;
	const ContactById = BaseUrl + UrlGetByIdContact;
	const WarehouseByToken = BaseUrl + UrlGetWarehouseByIdByToken;

fetch(AllTransferOut, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		let tableData = "";
		data.data.map((values) => {
			let dataContactOut = "";
			let dataWarehouseOut = "";
                // Untuk Fetch Data Contact
                fetch(ContactById + `/${values.contact_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(contactData => {
                        dataContactOut = contactData.data.name;
                        document.getElementById(`contactCellOut${values.id}`).textContent = dataContactOut;
                });
				// Untuk Fetch Data Warehouse
                fetch(WarehouseByToken + `/${values.warehouse_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(warehouseData => {
                        dataWarehouseOut = warehouseData.data.name;
                        document.getElementById(`warehouseCellOut${values.id}`).textContent = dataWarehouseOut;
                });
				tableData += `
                        <tr>
                        <td hidden></td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.no_do}</p>
                        </td>
						<td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.no_so}</p>
                        </td>
						<td id="contactCellOut${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>	
						<td id="warehouseCellOut${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${getBadgePO(values.status)}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
							<button type="button" class="btn btn-info" data-tfin-id="${values.id}">Detail</button>	
                            <button type="button" class="btn btn-warning" data-tfin-id="${values.id}">Update</button>	
                        </td>
                    </tr>`;
		});
		document.getElementById("tablebodyOut").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Detail Data"
		const detailTfIn = document.querySelectorAll('.btn-info');
		detailTfIn.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-tfin-id');
				window.location.href = `inventory_tf_out_detail.html?id=${id}`;
			});
		});

		// Menambahkan event listener untuk button "Update Data"
		const updateTfIn = document.querySelectorAll('.btn-warning');
		updateTfIn.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-tfin-id');
				window.location.href = `inventory_tf_out_edit.html?id=${id}`;
			});
		});
		
	})
	.catch(error => {
		console.log('error', error);
	});

function displayData(page) {
	const baris = CihuyQuerySelector("#tablebodyOut tr");
	const mulaiindex = (page - 1) * itemperpage;
	const akhirindex = mulaiindex + itemperpage;

	for (let i = 0; i < baris.length; i++) {
		if (i >= mulaiindex && i < akhirindex) {
			baris[i].style.display = "table-row";
		} else {
			baris[i].style.display = "none";
		}
	}
}
function updatePagination() {
	halamansaatini.textContent = `Halaman ${halamannow}`;
}

buttonsebelumnya.addEventListener("click", () => {
	if (halamannow > 1) {
		halamannow--;
		displayData(halamannow);
		updatePagination();
	}
});

buttonselanjutnya.addEventListener("click", () => {
	const totalPages = Math.ceil(
		tablebody.querySelectorAll("#tablebodyOut tr").length / itemperpage
	);
	if (halamannow < totalPages) {
		halamannow++;
		displayData(halamannow);
		updatePagination();
	}
  });
});