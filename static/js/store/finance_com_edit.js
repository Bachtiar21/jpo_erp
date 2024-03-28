import {
  BaseUrl,
  UrlGetCommissionById,
  UrlGetByIdContact,
  requestOptionsGet,
} from "../controller/template.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const CommisionById = BaseUrl + UrlGetCommissionById + `/${id}`;
const GetContactById = BaseUrl + UrlGetByIdContact;

// Fetch Data Convection
fetch(CommisionById, requestOptionsGet)
  .then((response) => response.json())
  .then((data) => {
    const contactId = data.data.broker;

    // Fetch data kontak
    fetch(GetContactById + `/${contactId}`, requestOptionsGet)
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
    // document.getElementById("paymentInput").value = data.data.payment;
    document.getElementById("brokerFeeInput").value = data.data.broker_fee;
  })
  .catch((error) => console.error("Error:", error));
