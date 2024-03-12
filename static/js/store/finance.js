document.addEventListener('DOMContentLoaded', function() {
    const selectMenuFinance = document.getElementById('selectMenuFinance');
    const invoiceMenu = document.getElementById('invoiceMenu');
    const billMenu = document.getElementById('billMenu');

    selectMenuFinance.addEventListener('change', function() {
        if (selectMenuFinance.value === 'invoice') {
            invoiceMenu.removeAttribute('hidden');
            billMenu.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Bill
            document.getElementById('createButton').href = 'finance/finance_inv_create.html';
        } else if (selectMenuFinance.value === 'bill') {
            billMenu.removeAttribute('hidden');
            invoiceMenu.setAttribute('hidden', true);

            // Ubah href button "Tambah Data" untuk Invoice
            document.getElementById('createButton').href = 'finance/finance_bill_create.html';
        } else {
            invoiceMenu.setAttribute('hidden', true);
            billMenu.setAttribute('hidden', true);
        }
    });
});