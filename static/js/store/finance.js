import { CihuyId } from "https://c-craftjs.github.io/element/element.js";
import { CihuyDomReady, CihuyQuerySelector } from "https://c-craftjs.github.io/table/table.js";
import { BaseUrl, UrlGetAllInvoice, UrlGetByIdContact, UrlGetAllBill, requestOptionsGet } from "../controller/template.js";

document.addEventListener('DOMContentLoaded', function() {
    const selectMenuFinance = document.getElementById('selectMenuFinance');
    const invoiceMenu = document.getElementById('invoiceMenu');
    const billMenu = document.getElementById('billMenu');
    const comMenu = document.getElementById('comMenu');

    selectMenuFinance.addEventListener('change', function() {
        if (selectMenuFinance.value === 'invoice') {
            invoiceMenu.removeAttribute('hidden');
            billMenu.setAttribute('hidden', true);
            comMenu.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Bill
            document.getElementById('createButton').href = 'finance/finance_inv_create.html';
        } else if (selectMenuFinance.value === 'bill') {
            billMenu.removeAttribute('hidden');
            invoiceMenu.setAttribute('hidden', true);
            comMenu.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Invoice
            document.getElementById('createButton').href = 'finance/finance_bill_create.html';
        } else if (selectMenuFinance.value === 'commision') {
            comMenu.removeAttribute('hidden');
            invoiceMenu.setAttribute('hidden', true);
            billMenu.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Commision
            document.getElementById('createButton').href = 'finance/finance_com_create.html';
        } else {
            invoiceMenu.setAttribute('hidden', true);
            billMenu.setAttribute('hidden', true);
            comMenu.setAttribute('hidden', true);
        }
    });
});

// Fetch Data Invoices
// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyInvoice");
	const buttonsebelumnya = CihuyId("prevPageBtnInv");
	const buttonselanjutnya = CihuyId("nextPageBtnInv");
	const halamansaatini = CihuyId("currentPageInv");
	const itemperpage = 5;
	let halamannow = 1;

    const AllInvoice = BaseUrl + UrlGetAllInvoice;
    const ContactById = BaseUrl + UrlGetByIdContact;

fetch(AllInvoice, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		let tableData = "";
		data.data.map((values) => {
            let dataContact = "";
            // Untuk Fetch Data Contact
            fetch(ContactById + `/${values.contact_id}`, requestOptionsGet)
                .then(response => response.json())
                .then(contactData => {
                    dataContact = contactData.data.name;
                    document.getElementById(`contactCell${values.id}`).textContent = dataContact;
            });
            
            // Mendapatkan tanggal dari created_at
            const createdDate = new Date(values.created_at);
            const formattedDate = `${createdDate.getDate()}-${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;

				tableData += `
                        <tr>
                        <td hidden></td>
                        <td id="contactCell${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>
						<td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.no_invoice}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${formattedDate}</p>
                        </td>
						<td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1"></p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.paid_status}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
							<button type="button" class="btn btn-info" data-inv-id="${values.id}">Detail</button>	
                            <button type="button" class="btn btn-warning" data-inv-id="${values.id}">Update</button>	
                            <button type="button" class="btn btn-danger" data-inv-id="${values.id}">Delete</button>
                        </td>
                    </tr>`;
		});
		document.getElementById("tablebodyInvoice").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Update Data"
		const updateInvoice = document.querySelectorAll('.btn-warning');
		updateInvoice.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-inv-id');
				window.location.href = `finance/finance_inv_edit.html?id=${id}`;
			});
		});
		
		// Menambahkan event listener untuk button "detail"
		const detailInvoice = document.querySelectorAll('.btn-info');
		detailInvoice.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-inv-id');
				window.location.href = `finance/finance_inv_detail.html?id=${id}`
			})
		})
		
	})
	.catch(error => {
		console.log('error', error);
	});

    function displayData(page) {
        const baris = CihuyQuerySelector("#tablebodyInvoice tr");
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
            tablebody.querySelectorAll("#tablebodyInvoice tr").length / itemperpage
        );
        if (halamannow < totalPages) {
            halamannow++;
            displayData(halamannow);
            updatePagination();
        }
    });
});

// Fetch Data Bill
// Untuk Membuat Pagination
CihuyDomReady(() => {
	const tablebody = CihuyId("tablebodyBill");
	const buttonsebelumnya = CihuyId("prevPageBtnBill");
	const buttonselanjutnya = CihuyId("nextPageBtnBill");
	const halamansaatini = CihuyId("currentPageBill");
	const itemperpage = 5;
	let halamannow = 1;

    const AllBill = BaseUrl + UrlGetAllBill;
    const ContactById = BaseUrl + UrlGetByIdContact;

fetch(AllBill, requestOptionsGet)
	.then((result) => {
		return result.json();
	})
	.then((data) => {
		let tableData = "";
		data.data.map((values) => {
            let dataContact = "";
            // Untuk Fetch Data Contact
            fetch(ContactById + `/${values.contact_id}`, requestOptionsGet)
                .then(response => response.json())
                .then(contactData => {
                    dataContact = contactData.data.name;
                    document.getElementById(`contactCell${values.id}`).textContent = dataContact;
            });
            
            // Mendapatkan tanggal dari created_at
            const createdDate = new Date(values.created_at);
            const formattedDate = `${createdDate.getDate()}-${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;

				tableData += `
                        <tr>
                        <td hidden></td>
                        <td id="contactCell${values.id}" style="text-align: center; vertical-align: middle">
							<!-- Nama contact akan ditampilkan di sini -->
						</td>
						<td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.no_bill}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${formattedDate}</p>
                        </td>
						<td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1"></p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
                            <p class="fw-normal mb-1">${values.paid_status}</p>
                        </td>
                        <td style="text-align: center; vertical-align: middle">
							<button type="button" class="btn btn-info" data-bill-id="${values.id}">Detail</button>	
                            <button type="button" class="btn btn-warning" data-bill-id="${values.id}">Update</button>	
                            <button type="button" class="btn btn-danger" data-bill-id="${values.id}">Delete</button>
                        </td>
                    </tr>`;
		});
		document.getElementById("tablebodyBill").innerHTML = tableData;

		displayData(halamannow);
		updatePagination();

		// Menambahkan event listener untuk button "Update Data"
		const updateBill = document.querySelectorAll('.btn-warning');
		updateBill.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-bill-id');
				window.location.href = `finance/finance_bill_edit.html?id=${id}`;
			});
		});
		
		// Menambahkan event listener untuk button "detail"
		const detailBill = document.querySelectorAll('.btn-info');
		detailBill.forEach(button => {
			button.addEventListener('click', (event) => {
				const id = event.target.getAttribute('data-bill-id');
				window.location.href = `finance/finance_bill_detail.html?id=${id}`
			})
		})
		
	})
	.catch(error => {
		console.log('error', error);
	});

    function displayData(page) {
        const baris = CihuyQuerySelector("#tablebodyBill tr");
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
            tablebody.querySelectorAll("#tablebodyBill tr").length / itemperpage
        );
        if (halamannow < totalPages) {
            halamannow++;
            displayData(halamannow);
            updatePagination();
        }
    });
});