import {
  BaseUrl,
  UrlGetInvoiceById,
  UrlGetByIdContact,
  requestOptionsGet,
} from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const InvoiceById = BaseUrl + UrlGetInvoiceById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;

// Pengkondisian ketika klik button Paid
document.getElementById("paidButton").addEventListener("click", function () {
  // Menampilkan SweetAlert konfirmasi
  Swal.fire({
    title: "Paid Invoice?",
    text: "Apakah kamu yakin akan Paid Invoice?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, yakin!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
      window.location.href = `finance_inv_paid.html?id=${id}`;
    }
  });
});

// Fetch Data Convection
fetch(InvoiceById, requestOptionsGet)
  .then((response) => response.json())
  .then((data) => {
    const contactId = data.data.contact_id;
    const brokerId = data.data.broker;

    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
      .then((response) => response.json())
      .then((contactData) => {
        if (contactData && contactData.data) {
          const contactName = contactData.data.name;
          document.getElementById("customerInput").value = contactName;
        }
      });

    // Fetch data Broker
    fetch(GetContactById + `/${brokerId}`, requestOptionsGet)
      .then((response) => response.json())
      .then((contactData) => {
        if (contactData && contactData.data) {
          const contactName = contactData.data.name;
          document.getElementById("brokerInput").value = contactName;
        }
      });

    // Populate form fields with data
    const createdAt = new Date(data.data.created_at);
    const formattedDate = createdAt.toISOString().split("T")[0];
    document.getElementById("dateInput").value = formattedDate;
    document.getElementById("amountInput").value = data.data.sell_price;
    document.getElementById("paymentInput").value = data.data.payment;
    document.getElementById("brokerFeeInput").value = data.data.broker_fee;
  })
  .catch((error) => console.error("Error:", error));
