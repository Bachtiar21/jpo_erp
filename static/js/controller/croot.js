import { token } from "./cookies.js";
import { BaseUrlFe } from "./template.js"; 

if (token === "") {
    const baseUrl = BaseUrlFe + "index.html";
	window.location.assign(baseUrl);
}