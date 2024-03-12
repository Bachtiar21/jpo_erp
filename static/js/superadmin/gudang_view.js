import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllWarehouse, UrlGetConvectionById, UrlGetStoreById, UrlDeleteWarehouse, requestOptionsGet, requestOptionsDelete } from "../controller/template.js";
import { getBadgeStatus } from "../style/badge.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllWarehouse = BaseUrl + UrlGetAllWarehouse;
	const StoreById = BaseUrl + UrlGetStoreById;
	const ConvectionById = BaseUrl + UrlGetConvectionById;
    const DeleteWarehouseById = BaseUrl + UrlDeleteWarehouse;

	fetch(AllWarehouse, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((data) => {
        let tableData = "";
        data.data.map((values) => {
            let tokoPabrikData = '';
            if (values.store_id) {
                // Jika store_id tersedia, ambil nama dari endpoint toko
                fetch(StoreById + `/${values.store_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(storeData => {
                        tokoPabrikData = storeData.data.name;
                        // Set nama toko pada kolom "Toko/Pabrik"
                        document.getElementById(`tokoPabrikCell${values.id}`).textContent = tokoPabrikData;
                    })
                    .catch(error => console.error('Error fetching store data:', error));
            } else if (values.convection_id) {
                // Jika convection_id tersedia, ambil nama dari endpoint pabrik
                fetch(ConvectionById + `/${values.convection_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(convectionData => {
                        tokoPabrikData = convectionData.data.name;
                        // Set nama pabrik pada kolom "Toko/Pabrik"
                        document.getElementById(`tokoPabrikCell${values.id}`).textContent = tokoPabrikData;
                    })
                    .catch(error => console.error('Error fetching convection data:', error));
            }
            tableData += `
                <tr>
                    <td hidden></td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${values.name}</p>
                    </td>
                    <td id="tokoPabrikCell${values.id}" style="text-align: center; vertical-align: middle">
                        <!-- Nama toko/pabrik akan ditampilkan di sini -->
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${values.address}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${values.phone_number}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${getBadgeStatus(values.status)}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <button type="button" class="btn btn-warning" data-warehouse-id="${values.id}">Update</button>    
                        <button type="button" class="btn btn-danger" data-warehouse-id="${values.id}">Delete</button>
                    </td>
                </tr>`;
        });
        document.getElementById("tablebody").innerHTML = tableData;

        displayData(halamannow);
        updatePagination();

        // Menambahkan event listener untuk button "Update Data"
        const updateWarehouseButtons = document.querySelectorAll('.btn-warning');
        updateWarehouseButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-warehouse-id');
                window.location.href = `gudang_update.html?id=${id}`;
            });
        });
        
    })
    .catch(error => {
        console.log('error', error);
});

// Function Delete Data Gudang
// Add event listener for "Hapus" button
document.getElementById("tablebody").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const id = target.getAttribute("data-warehouse-id");
	  if (id) {
		// Display SweetAlert confirmation dialog
		Swal.fire({
		  title: 'Hapus Data Gudang?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			// Gudang confirmed, call the function to handle deletion
			deleteWarehouse(id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteWarehouse(id) {
	fetch(DeleteWarehouseById   + `/${id}`, requestOptionsDelete)
	  .then((response) => response.json())
	  .then((data) => {
		// Handle successful deletion
		console.log("Data deleted:", data);
		// You might want to update the table or handle other UI updates here
		
		// Display success SweetAlert
		Swal.fire({
			title: 'Deleted!',
			text: 'Data Gudang Berhasil Dihapus.',
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
			'Data Gudang Gagal Dihapus',
			'error'
			);
	});
}


function displayData(page) {
	const baris = CihuyQuerySelector("#tablebody tr");
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
		tablebody.querySelectorAll("#tablebody tr").length / itemperpage
	);
	if (halamannow < totalPages) {
		halamannow++;
		displayData(halamannow);
		updatePagination();
	}
  });
});