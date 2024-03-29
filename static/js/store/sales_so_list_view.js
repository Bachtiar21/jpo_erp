import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllSalesOrder, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";
import { getBadgePO } from "../style/badge.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllSalesOrder = BaseUrl + UrlGetAllSalesOrder;
	

	fetch(AllSalesOrder, requestOptionsGet)
	.then(result => result.json())
	.then(data => {
		let tableData = "";
		data.data.forEach(values => {
			const warehouseName = values.warehouse.name;
			const contactName = values.contact.name;

			tableData += `
				<tr>
					<td hidden></td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${values.no_so}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${warehouseName}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${contactName}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<p class="fw-normal mb-1">${getBadgePO(values.status)}</p>
					</td>
					<td style="text-align: center; vertical-align: middle">
						<button type="button" class="btn btn-info" data-po-id="${values.id}">Detail</button>
						<button type="button" class="btn btn-warning" data-po-id="${values.id}">Edit</button>	
					</td>
				</tr>`;
		});
		document.getElementById("tablebody").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Detail Data"
		const detailPOButtons = document.querySelectorAll('.btn-info');
		detailPOButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-po-id');
				window.location.href = `purchase_po_detail.html?id=${id}`;
			});
		});

		// Menambahkan event listener untuk button "Update Data"
		const updatePOButtons = document.querySelectorAll('.btn-warning');
		updatePOButtons.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-po-id');
				window.location.href = `purchase_create_po_edit.html?id=${id}`;
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