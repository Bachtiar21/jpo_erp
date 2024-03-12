import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllPurchaseOrder, UrlGetByIdContact, UrlGetWarehouseByIdByToken, requestOptionsGet } from "../controller/template.js";
import { getBadgePO } from "../style/badge.js";

// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebody");
	const buttonsebelumnya = CihuyId("prevPageBtn");
	const buttonselanjutnya = CihuyId("nextPageBtn");
	const halamansaatini = CihuyId("currentPage");
	const itemperpage = 5;
	let halamannow = 1;

    const AllPurchaseOrder = BaseUrl + UrlGetAllPurchaseOrder;
    const WarehouseById = BaseUrl + UrlGetWarehouseByIdByToken;
    const ContactById = BaseUrl + UrlGetByIdContact;

    fetch(AllPurchaseOrder, requestOptionsGet)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            let tableData = "";
            data.data.map((values) => {
                let dataWarehouse = "";
                let dataContact = "";
                // Untuk Fetch Data Contact
                fetch(ContactById + `/${values.contact_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(contactData => {
                        dataContact = contactData.data.name;
                        document.getElementById(`contactCell${values.id}`).textContent = dataContact;
                })
                // Untuk Fetch Data Warehouse
                fetch(WarehouseById + `/${values.warehouse_id}`, requestOptionsGet)
                    .then(response => response.json())
                    .then(warehouseData => {
                        dataWarehouse = warehouseData.data.name;
                        document.getElementById(`warehouseCell${values.id}`).textContent = dataWarehouse;
                });
                tableData += `
                            <tr>
                            <td hidden></td>
                            <td style="text-align: center; vertical-align: middle">
                                <p class="fw-normal mb-1">${values.no_po}</p>
                            </td>
                            <td id="contactCell${values.id}" style="text-align: center; vertical-align: middle">
                                <!-- Nama contact akan ditampilkan di sini -->
                            </td>
                            <td id="warehouseCell${values.id}" style="text-align: center; vertical-align: middle">
                                <!-- Nama contact akan ditampilkan di sini -->
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                                <p class="fw-normal mb-1">${getBadgePO(values.status)}</p>
                            </td>
                            <td style="text-align: center; vertical-align: middle">
                                <button type="button" class="btn btn-info" data-po-id="${values.id}">Detail</button>	
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