import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllSalesOrder, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";
// import { getBadgeBank } from "../style/badge.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllSalesOrder = BaseUrl + UrlGetAllSalesOrder;
	const ContactById = BaseUrl + UrlGetByIdContact;
	const WarehouseByToken = BaseUrl + UrlGetWarehouseByIdByToken;

fetch(AllSalesOrder, requestOptionsGet)
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
                            <p class="fw-normal mb-1">${values.no_so}</p>
                        </td>
						<td id="warehouseCellOut${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>
                        <td id="contactCellOut${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>	
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.status}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
							<button type="button" class="btn btn-info" data-so-id="${values.id}">Detail</button>
                            <button type="button" class="btn btn-warning" data-so-id="${values.id}">Update</button>	
                        </td>
                    </tr>`;
		});
		document.getElementById("tablebody").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Update Data"
		const detailSoButtons = document.querySelectorAll('.btn-info');
		detailSoButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-so-id');
				window.location.href = `sales_so_list_detail.html?id=${id}`;
			});
		});

		// Menambahkan event listener untuk button "Update Data"
		const updateSoButtons = document.querySelectorAll('.btn-warning');
		updateSoButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-so-id');
				window.location.href = `sales_create_so_edit.html?id=${id}`;
			});
		});
		
	})
	.catch(error => {
		console.log('error', error);
	});

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