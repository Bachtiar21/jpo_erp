import {
  BaseUrl,
  UrlGetCommissionById,
  UrlGetByIdContact,
  UrlGetBankById,
  requestOptionsGet,
} from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const CommissionById = BaseUrl + UrlGetCommissionById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetBankById = BaseUrl + UrlGetBankById;

// Pengkondisian ketika klik button Paid
document.getElementById("paidButton").addEventListener("click", function () {
  // Menampilkan SweetAlert konfirmasi
  Swal.fire({
    title: "Paid Commission?",
    text: "Apakah kamu yakin akan Paid Commission?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, yakin!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
      window.location.href = `finance_com_paid.html?id=${id}`;
    }
  });
});

// Fetch Data Convection
fetch(CommissionById, requestOptionsGet)
  .then((response) => response.json())
  .then((data) => {
    const brokerId = data.data.broker;
    const bankId = data.data.bank_id;

    // Fetch data Broker
    fetch(GetContactById + `/${brokerId}`, requestOptionsGet)
      .then((response) => response.json())
      .then((contactData) => {
        if (contactData && contactData.data) {
          const contactName = contactData.data.name;
          document.getElementById("vendorInput").value = contactName;
        }
    });

    // Fetch data Rekening
    fetch(GetBankById + `/${bankId}`, requestOptionsGet)
      .then((response) => response.json())
      .then((bankData) => {
        if (bankData && bankData.data) {
          const bankName = bankData.data.bank + "(" + bankData.data.no_rek + ")" + "-" + bankData.data.name_rek;
          document.getElementById("rekeningInput").value = bankName;
        }
    });

    // Populate form fields with data
    const createdAt = new Date(data.data.created_at);
    const formattedDate = createdAt.toISOString().split("T")[0];
    document.getElementById("dateInput").value = formattedDate;
    document.getElementById("paymentInput").value = data.data.payment;
    document.getElementById("brokerFeeInput").value = data.data.broker_fee;
  })
  .catch((error) => console.error("Error:", error));
