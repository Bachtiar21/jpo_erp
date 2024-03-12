import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllUser, UrlGetStoreById, UrlGetConvectionById, requestOptionsGet, UrlDeleteUser, requestOptionsDelete } from "../controller/template.js";
import { getBadgeStatus, getBadgeRoles } from "../style/badge.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllUser = BaseUrl + UrlGetAllUser;
	const GetStoreById = BaseUrl + UrlGetStoreById;
	const GetConvectionById = BaseUrl + UrlGetConvectionById;
	const DeleteUserById = BaseUrl + UrlDeleteUser;

	fetch(AllUser, requestOptionsGet)
    .then((result) => {
        return result.json();
    })
    .then((data) => {
        let tableData = "";
        data.users.map((values) => {
            let additionalInfo = "";
            if (values.roles === "store") {
                fetch(GetStoreById + `/${values.store_id}`, requestOptionsGet)
                    .then((response) => response.json())
                    .then((storeData) => {
                        additionalInfo = `<p class="fw-normal mb-1">${storeData.data.name}</p>`;
                        renderTableRow(values, additionalInfo);
                    })
                    .catch(error => console.log('error', error));
            } else if (values.roles === "convection") {
                fetch(GetConvectionById + `/${values.convection_id}`, requestOptionsGet)
                    .then((response) => response.json())
                    .then((convectionData) => {
                        additionalInfo = `<p class="fw-normal mb-1">${convectionData.data.name}</p>`;
                        renderTableRow(values, additionalInfo);
                    })
                    .catch(error => console.log('error', error));
            } else {
                renderTableRow(values, additionalInfo);
            }
        });

        function renderTableRow(values, additionalInfo) {
            tableData += `
                <tr>
                    <td hidden></td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${values.name}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${values.username}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${values.phone_number}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${getBadgeRoles(values.roles)}</p>
                        ${additionalInfo}
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <p class="fw-normal mb-1">${getBadgeStatus(values.status)}</p>
                    </td>
                    <td style="text-align: center; vertical-align: middle">
                        <button type="button" class="btn btn-warning" data-user-id="${values.id}">Update</button>    
                        <button type="button" class="btn btn-danger" data-user-id="${values.id}">Delete</button>
                    </td>
                </tr>`;
            document.getElementById("tablebody").innerHTML = tableData;
        	
			displayData(halamannow);
			updatePagination();

			// Menambahkan event listener untuk button "Update Data"
			const updateUserButtons = document.querySelectorAll('.btn-warning');
			updateUserButtons.forEach(button => {
				button.addEventListener('click', (event) => {
					const id = event.target.getAttribute('data-user-id');
					window.location.href = `user_update.html?id=${id}`;
				});
			});
		}
	})
	.catch(error => {
		console.log('error', error);
	});
  
// Function Delete Data User
// Add event listener for "Hapus" button
document.getElementById("tablebody").addEventListener("click", (event) => {
	const target = event.target;
	if (target.classList.contains("btn-danger")) {
	  const id = target.getAttribute("data-user-id");
	  if (id) {
		// Display SweetAlert confirmation dialog
		Swal.fire({
		  title: 'Hapus Data User?',
		  text: "Data tidak akan dapat mengembalikan ini!",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes'
		}).then((result) => {
		  if (result.isConfirmed) {
			// User confirmed, call the function to handle deletion
			deleteUser(id);
		  }
		});
	  }
	}
  });
  
  // Function to delete data
  function deleteUser(id) {
	fetch(DeleteUserById + `/${id}`, requestOptionsDelete)
	  .then((response) => response.json())
	  .then((data) => {
		// Handle successful deletion
		console.log("Data deleted:", data);
		// You might want to update the table or handle other UI updates here
		
		// Display success SweetAlert
		Swal.fire({
			title: 'Deleted!',
			text: 'Data User Berhasil Dihapus.',
			icon: 'success'
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
			'Data User Gagal Dihapus',
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