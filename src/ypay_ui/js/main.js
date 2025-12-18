/*
import PaymentUI from "./paymentUI.js";
import buttonController from "./paymentTriggerButtons.js";
import alertController from "./alert_controller";
import initFormController from "./init_form_controller";
import Localization from "./localization";

buttonController();

export default PaymentUI;

 */

// main.js - Convert to CommonJS
const PaymentUI = require("./paymentUI.js").default;
const buttonController = require("./paymentTriggerButtons.js").default;
const alertController = require("./alert_controller").default;
const initFormController = require("./init_form_controller").default;
const Localization = require("./localization").default;

buttonController();

// Also expose to global if you want
if (typeof window !== 'undefined') {
    window.PaymentUI = PaymentUI;
    window.YPAY = PaymentUI; // Optional
}

module.exports = PaymentUI;