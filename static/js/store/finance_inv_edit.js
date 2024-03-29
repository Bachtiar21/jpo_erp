import {
  BaseUrl,
  UrlGetInvoiceById,
  UrlGetByIdContact,
  UrlGetBankById,
  requestOptionsGet,
} from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const InvoiceById = BaseUrl + UrlGetInvoiceById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;
const GetBankById = BaseUrl + UrlGetBankById;

// Fetch Data Convection
fetch(InvoiceById, requestOptionsGet)
  .then((response) => response.json())
  .then((data) => {
    const contactId = data.data.contact_id;
    const brokerId = data.data.broker;
    const bankId = data.data.bank_id;

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
    // Pengkondisia untuk Broker
    // if (data.data.broker === null) {
    //   document.getElementById("brokerInput").value = "Tidak Memilih Broker";
    // } else {
    //   document.getElementById("brokerInput").value = data.data.name;
    // }
    document.getElementById("amountInput").value = data.data.sell_price;
    document.getElementById("paymentInput").value = data.data.payment;
    document.getElementById("brokerFeeInput").value = data.data.broker_fee;
  })
  .catch((error) => console.error("Error:", error));
