var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const cardPattern = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
const paymentCodePattern = /^[0-9]{6}$/;
const tokenPattern = /^[0-9]{1,}\|[A-Za-z0-9]{48}$/;
class Transaction {
  constructor(token = "", sender = "", otp = "", amount = 0, language = "en", handlers = {}) {
    this.sender = this.sanitizeData(sender);
    this.token = this.sanitizeData(token);
    this.otp = otp;
    this.amount = parseFloat(amount.toString());
    this.language = language;
    this.paymentHandlers = {
      onSuccess: handlers.onSuccess || (() => {
      }),
      onFailure: handlers.onFailure || (() => {
      })
    };
    const validationError = this._validate();
    if (validationError) {
      this.validationError = validationError;
    }
  }
  _validate() {
    const errors = [];
    if (!this.sender) {
      errors.push("Sender card is required.");
    } else if (!cardPattern.test(this.sender)) {
      errors.push("Sender card format is invalid.");
    }
    if (!this.token) {
      errors.push("token is required.");
    } else if (!tokenPattern.test(this.token)) {
      errors.push("token card format is invalid.");
    }
    if (!this.otp) {
      errors.push("Payment code is required.");
    } else if (!paymentCodePattern.test(this.otp)) {
      errors.push("Payment code format is invalid.");
    }
    if (isNaN(this.amount) || this.amount <= 0) {
      errors.push("Amount must be a positive number.");
    }
    if (!["en", "fr"].includes(this.language.toString().toLowerCase())) {
      errors.push("Language is invalid.");
    }
    return errors.length > 0 ? new Error(errors.join("\n")) : null;
  }
  async exec() {
    if (this.validationError) {
      this.paymentHandlers.onFailure(this.validationError);
      throw this.validationError;
    }
    try {
      const paymentResponse = await fetch(
        "https://ypay.ytech-bf.com/api/v1/project/make-payment",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.token}`,
            "accept-language": this.language
          },
          body: JSON.stringify({
            card_code: this.sender,
            amount: this.amount,
            payment_code: this.otp
          })
        }
      );
      if (paymentResponse.ok) {
        const data = await paymentResponse.json();
        this.paymentHandlers.onSuccess(data);
        return data;
      }
      const errorData = await paymentResponse.json().catch(() => ({}));
      const errorMessage = errorData.message || paymentResponse.statusText || "Payment failed";
      throw new Error(`${paymentResponse.status}
${errorMessage}`);
    } catch (error) {
      this.paymentHandlers.onFailure(error);
      throw error;
    }
  }
  // Validation checker
  isValid() {
    return !this.validationError;
  }
  // Get validation errors without throwing
  getValidationErrors() {
    return this.validationError ? this.validationError.message : null;
  }
  // Sanitizes data passed to the constructor
  sanitizeData(data = "") {
    if (data === "" || data === null || data === void 0) {
      return "";
    }
    data = String(data);
    data = data.replace(/\\0/g, "");
    data = data.trim();
    data = data.replace(/<[^>]*>/g, "");
    return data;
  }
}
class Currency {
  static isValid(currency) {
    return Object.values(this).includes(currency.toUpperCase());
  }
}
__publicField(Currency, "USD", "USD");
__publicField(Currency, "NGN", "NGN");
__publicField(Currency, "XOF", "F CFA");
class YPAY {
  // one-time initialization
  constructor(token, currency, shopName) {
    this.token = token;
    this.currency = currency || Currency.XOF;
    this.shopName = shopName || "Undefined";
    const validationError = this._validate();
    if (validationError) {
      this.validationError = validationError;
    }
    if (YPAY.instance) {
      return YPAY.instance;
    }
    YPAY.instance = this;
  }
  // create a transaction and execute it
  createTransaction(card_code, otp, amount, language, handlers = {}) {
    return new Transaction(
      this.token,
      card_code,
      otp,
      amount,
      language,
      handlers
    ).exec();
  }
  static resetInstance() {
    YPAY.instance = null;
  }
  _validate() {
    const errors = [];
    if (!Currency.isValid(this.currency)) {
      errors.push(this.currency + " is not supported yet");
    }
    return errors.length > 0 ? new Error(errors.join("\n")) : null;
  }
}
class Localization {
  constructor() {
    this.current = "en";
    this.languages = {
      en: "en",
      fr: "fr"
    };
    this.translations = {
      en: {
        card_label: "Card number",
        card_placeholder: "Enter your card number",
        otp_label: "Enter OTP",
        message: 'In order to continue the payment process, you must first log in from the <a href="#">YPAY</a> application, then generate a payment OTP with a value of ',
        no_app: "I do not have the app yet.",
        download: "Download the App",
        submit_button_processing: "Processing...",
        submit_button: "Submit",
        error_message: "Enter XXXX-XXXX with letters/digits only.",
        secured_payment: "Encrypted and Secured Payment",
        successful_transaction: "Your transaction was successfully processed!",
        failure_transaction: "Your transaction has not been processed!"
      },
      fr: {
        card_label: "Numéro de carte",
        card_placeholder: "Entrez votre numéro de carte",
        otp_label: "Entrez le code OTP",
        message: `Pour continuer le processus de paiement, vous devez d'abord vous connecter depuis l'application <a href="#">YPAY</a>, puis generer un OTP de paiement d'une valeur de `,
        download: "Télécharger l'application",
        submit_button_processing: "Traitement en cours...",
        submit_button: "Valider",
        no_app: "Je n'ai pas l'application",
        error_message: "Format XXXX-XXXX avec lettres et chiffres uniquement.",
        secured_payment: "Paiement crypté et sécurisé",
        successful_transaction: "Votre transaction a été traitée avec succès!",
        failure_transaction: "Votre transaction n'a pas pu être traitée!"
      }
    };
  }
  isValid(lang) {
    return Object.values(this.languages).includes(lang.toLowerCase());
  }
  setLang(lang) {
    switch (lang) {
      case this.languages.en:
        this.current = "en";
        break;
      case this.languages.fr:
        this.current = "fr";
        break;
      default:
        this.current = "en";
    }
  }
  tag(key) {
    return this.translations[this.current][key] || key;
  }
}
const alertController = (target = document, type = "success", message = "") => {
  const alertBox = target.querySelector(".alert");
  const title = alertBox.getElementsByTagName("h2")[0];
  const messageTag = alertBox.getElementsByTagName("p")[0];
  title.innerHTML = type[0].toUpperCase() + type.substring(1, type.length);
  messageTag.innerHTML = message;
  if (type === "failure") {
    alertBox.classList.add("alert-failure");
    alertBox.classList.remove("alert-success");
  }
};
const primary_color = "#6047FF";
const error_color = "#FF0000";
const disabled = "#E5E7EB";
const initFormController = (targetDocument = document) => {
  const form = targetDocument.querySelector("form");
  const app_button = targetDocument.querySelector("#app_button");
  const card_code = targetDocument.querySelector("#card_code");
  const card_number_icon = targetDocument.querySelector(".card_icon");
  const error_message_card_number = targetDocument.querySelector(".error_message");
  const otp_inputs = [...targetDocument.querySelectorAll(".otp_input_item")];
  const submit = targetDocument.querySelector(".submit_button");
  error_message_card_number.style.display = "none";
  if (!form || !card_code || !submit || otp_inputs.length === 0) {
    console.error("Form elements not found");
    return;
  }
  const submitState = (isFormValid) => {
    if (isFormValid) {
      submit.disabled = false;
      submit.style.backgroundColor = primary_color;
      submit.style.cursor = "pointer";
    } else {
      submit.disabled = true;
      submit.style.backgroundColor = disabled;
      submit.style.cursor = "not-allowed";
    }
  };
  const cardNumberValidation = () => {
    if (cardPattern.test(card_code.value.toString())) {
      card_code.style.outlineColor = primary_color;
      if (card_number_icon) {
        card_number_icon.style.color = primary_color;
      }
      card_code.style.border = `1px solid ${primary_color}`;
      if (error_message_card_number) {
        error_message_card_number.style.display = "none";
      }
      validateOTP();
      if (card_number_icon) {
        card_number_icon.style.top = "50%";
      }
    } else {
      card_code.style.outlineColor = error_color;
      if (card_number_icon) {
        card_number_icon.style.color = error_color;
      }
      card_code.style.border = `1px solid ${error_color}`;
      if (!targetDocument.querySelector(".error_message")) {
        const error_message_card_number2 = targetDocument.createElement("span");
        error_message_card_number2.className = "error_message";
      }
      error_message_card_number.style.color = error_color;
      error_message_card_number.style.fontSize = "11px";
      error_message_card_number.style.fontStyle = "italic";
      error_message_card_number.style.marginTop = "4px";
      error_message_card_number.style.display = "block";
      if (card_number_icon) {
        card_number_icon.style.top = "35%";
      }
      card_code.parentNode.appendChild(error_message_card_number);
      submitState(false);
    }
  };
  const validateOTP = () => {
    const allFilled = otp_inputs.every((input) => input.value.length === 1);
    otp_inputs.forEach((input) => {
      if (allFilled) {
        input.style.borderColor = primary_color;
        input.style.outlineColor = primary_color;
      } else if (input.value === "") {
        input.style.borderColor = "";
      }
    });
    const isCardValid = cardPattern.test(card_code.value);
    submitState(isCardValid && allFilled);
  };
  const handleKeyDown = (e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      const index = otp_inputs.indexOf(e.target);
      if (index >= 0) {
        otp_inputs[index].value = "";
        if (index > 0) {
          otp_inputs[index - 1].focus();
        }
      }
      validateOTP();
      e.preventDefault();
    }
  };
  const handleInput = (e) => {
    const { target } = e;
    const index = otp_inputs.indexOf(target);
    if (target.value) {
      if (index < otp_inputs.length - 1) {
        otp_inputs[index + 1].focus();
      } else {
        submit.focus();
      }
    }
    validateOTP();
  };
  const handleFocus = (e) => {
    e.target.select();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp_inputs.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    otp_inputs.forEach((input, index) => input.value = digits[index]);
    validateOTP();
    submit.focus();
  };
  card_code.addEventListener("input", function(e) {
    let value = card_code.value.toString().replace(/-/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }
    card_code.value = value.slice(0, 9);
    cardNumberValidation();
  });
  otp_inputs.forEach((input) => {
    input.addEventListener("paste", handlePaste);
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeyDown);
    input.addEventListener("focus", handleFocus);
  });
  app_button.addEventListener("click", (e) => {
    e.preventDefault();
    window.open("https://ypay.ytech-bf.com/");
  });
  submit.disabled = true;
  submitState(false);
};
const paymentFormTemplate = '<!DOCTYPE html>\n<html lang="{{language}}">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Payment Gateway</title>\n    <link rel="stylesheet" href="./ypay_ui/styles/style.css">\n</head>\n<body>\n<div class="modal_box">\n    <!--       HEADER     -->\n    <div class="modal_header">\n        <div class="first_stack">\n            <div class="shop_icon">{{logoImg}}</div>\n            <div class="ytech_icon">\n                {{closeBtn}}\n                <img src="./ypay_ui/assets/images/logo_inverted.svg" alt="ypay logo">\n            </div>\n        </div>\n        <span class="second_stack">{{shopName}}</span>\n        <span class="third_stack">{{amount}}</span>\n    </div>\n\n    <!--       YTECH MOBILE APP     -->\n    <div class="modal_info">\n        <div class="message">{{texts.message}} <a>{{amount}}</a></div>\n        <div class="separator"> <hr> {{texts.no_app}} <hr></div>\n        <div class="download_button">\n            <button type="button" id="app_button">\n                {{texts.download}}\n                <svg class="download_icon" width="20px" height="20px" stroke-width="1.5" viewBox="0 0 20 20" fill="none">\n                    <path d="M6 20L18 20" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n                    <path d="M12 4V16M12 16L15.5 12.5M12 16L8.5 12.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n                </svg>\n            </button>\n        </div>\n    </div>\n\n    <!--     FORM     -->\n    <div class="modal_form">\n        <form action="#" id="payment_form">\n            <div class="form_item">\n                <label class="card_label" for="card_code">{{texts.card_label}}</label><br>\n                <div class="card_input_container">\n                    <svg class="card_icon" width="21px" height="22px" viewBox="0 0 22 22" stroke-width="1.5" fill="none">\n                        <path d="M22 9V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V9ZM22 9H6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n                        <path d="M16.5 13.3819C16.7654 13.1444 17.1158 13 17.5 13C18.3284 13 19 13.6716 19 14.5C19 15.3284 18.3284 16 17.5 16C17.1158 16 16.7654 15.8556 16.5 15.6181" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n                        <path d="M16.5 13.3819C16.2346 13.1444 15.8842 13 15.5 13C14.6716 13 14 13.6716 14 14.5C14 15.3284 14.6716 16 15.5 16C15.8842 16 16.2346 15.8556 16.5 15.6181" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n                    </svg>\n                    <input id="card_code" class="card_code_input" type="text" autocomplete="off" placeholder="{{texts.card_placeholder}}" required>\n                    <span class="error_message">{{texts.card_error}}</span>\n                </div>\n            </div>\n\n            <div class="form_item">\n                <label for="otp_inputs" class="otp_label">{{texts.otp_label}}</label><br>\n                <div id="otp_inputs" class="otp_inputs">\n                    <label><input class="otp_input_item" type="text" maxlength="1" inputmode="numeric" autocomplete="off" required></label>\n                    <label><input class="otp_input_item" type="text" maxlength="1" inputmode="numeric"  autocomplete="off" required></label>\n                    <label><input class="otp_input_item" type="text" maxlength="1" inputmode="numeric"  autocomplete="off" required></label>\n                    <label><input class="otp_input_item" type="text" maxlength="1" inputmode="numeric"  autocomplete="off" required></label>\n                    <label><input class="otp_input_item" type="text" maxlength="1" inputmode="numeric"  autocomplete="off" required></label>\n                    <label><input class="otp_input_item" type="text" maxlength="1" inputmode="numeric"  autocomplete="off" required></label>\n                </div>\n            </div>\n\n            <div class="form_item">\n                <button class="submit_button" type="submit">{{texts.submit_button}}</button>\n            </div>\n        </form>\n\n        <!--       SECURED MESSAGE     -->\n        <div class="secured_payment">\n            <svg class="secured_payment_icon" width="18px" height="18px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" color="#000000">\n                <path d="M22 9V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H14M22 9H6M22 9V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n                <path d="M21.1667 18.5H21.4C21.7314 18.5 22 18.7686 22 19.1V21.4C22 21.7314 21.7314 22 21.4 22H17.6C17.2686 22 17 21.7314 17 21.4V19.1C17 18.7686 17.2686 18.5 17.6 18.5H17.8333M21.1667 18.5V16.75C21.1667 16.1667 20.8333 15 19.5 15C18.1667 15 17.8333 16.1667 17.8333 16.75V18.5M21.1667 18.5H17.8333" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n            </svg>\n            <span>{{texts.secured_payment}}</span>\n        </div>\n    </div>\n</div>\n</body>\n</html>';
const customAlertTemplate = '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Alert</title>\n    <link rel="stylesheet" href="./ypay_ui/styles/style.css">\n</head>\n<body>\n    <div class="alert alert-success">\n        <a href="#" class="close"  aria-label="close">×</a>\n        <div>\n            <h2>Alert</h2>\n            <p>The payment has been processed successfully</p>\n        </div>\n        <button>OK</button>\n    </div>\n</body>\n</html>';
const _PaymentUI = class _PaymentUI {
  constructor(token, currency, language, handlers = {}, showDialogs = true, verbose = true, shopName, logo) {
    if (_PaymentUI.instance) {
      return _PaymentUI.instance;
    }
    this.logo = logo || "";
    this.language = language || "en";
    this.shopName = shopName || "Unknown";
    this.currency = currency || "XOF";
    this.token = token;
    this.modal = false;
    this.verbose = verbose;
    this.showDialogs = this._normalizeShowDialogs(showDialogs);
    this.handlers = handlers || {
      onSuccess: (data) => {
      },
      onFailure: (data) => {
      }
    };
    this.overlayElement = null;
    this.newWindowRef = null;
    this.alert = null;
    this.amount = 0;
    this.localization = new Localization();
    this.localization.setLang(this.language);
    this._validate();
    this.ypay = new YPAY(token, currency, shopName);
    _PaymentUI.instance = this;
    return this;
  }
  _normalizeShowDialogs(showDialogs) {
    if (typeof showDialogs === "boolean") {
      return {
        onSuccess: showDialogs,
        onFailure: showDialogs
      };
    } else if (typeof showDialogs === "object" && shoåwDialogs å!== null) {
      return {
        onSuccess: showDialogs.onSuccess !== void 0 ? showDialogs.onSuccess : true,
        onFailure: showDialogs.onFailure !== void 0 ? showDialogs.onFailure : true
      };
    }
    return { onSuccess: true, onFailure: true };
  }
  toString() {
    return `PaymentUI {
          shopName: "${this.shopName}",
          currency: "${this.currency}",
          language: "${this.language}",
          token: "${this.token ? this.token.substring(0, 8) + "..." : "none"}",
          amount: ${this.amount},
          modal: ${this.modal},
          showDialogs: { onSuccess: ${this.showDialogs.onSuccess}, onFailure: ${this.showDialogs.onFailure} },
          verbose: ${this.verbose},
          hasLogo: ${!!this.logo},
          handlers: ${Object.keys(this.handlers).join(", ")}
        }`;
  }
  _validate() {
    let errors = [];
    if (this.language && !this.localization.isValid(this.language)) {
      errors.push("Language is not available");
    }
    if (this.token === "") {
      errors.push("Token is required");
    }
    if (errors.length > 0) {
      this.showLogs("Validation errors:", errors.join("\n"));
      throw new Error(errors.join("\n"));
    }
  }
  _getTargetDocument() {
    if (this.overlayElement) {
      return document;
    }
    if (this.newWindowRef && !this.newWindowRef.closed) {
      try {
        if (this.newWindowRef.document) {
          return this.newWindowRef.document;
        }
      } catch (error) {
        this.showLogs("Cannot access popup window document:", error.message);
      }
    }
    return document;
  }
  closePaymentUI() {
    this.showLogs("Closing payment UI");
    if (this.overlayElement) {
      this.overlayElement.remove();
      this.overlayElement = null;
    }
    if (this.newWindowRef && !this.newWindowRef.closed) {
      this.newWindowRef.close();
      this.newWindowRef = null;
    }
  }
  customAlertController(targetDocument, type, message) {
    alertController(targetDocument, type, message);
  }
  customAlert(type, message) {
    const shouldShow = type === "success" ? this.showDialogs.onSuccess : this.showDialogs.onFailure;
    if (!shouldShow) {
      this.showLogs(`Alert (${type}):`, message);
      return;
    }
    const overlay = document.createElement("div");
    overlay.className = "alert-overlay";
    overlay.innerHTML = this.renderTemplate(customAlertTemplate);
    this.alert = overlay;
    document.body.appendChild(this.alert);
    this.customAlertController(document, type, message);
    const alertBox = this.alert.querySelector(".alert");
    const closingButton = alertBox.querySelector(".close");
    const okButton = alertBox.getElementsByTagName("button")[0];
    const close = () => {
      if (this.alert && this.alert.parentNode) {
        this.alert.parentNode.removeChild(this.alert);
        this.alert = null;
      }
      let submit_btn = this._getTargetDocument().getElementsByClassName("submit_button")[0];
      if (submit_btn) {
        submit_btn.innerHTML = this.localization.tag("submit_button");
        submit_btn.disabled = false;
      }
    };
    closingButton.addEventListener("click", close);
    okButton.addEventListener("click", close);
  }
  formatAmount() {
    return this.language === "fr" ? `${this.amount} ${this.currency}` : `${this.currency} ${this.amount}`;
  }
  showModal() {
    this.showLogs("Opening payment modal");
    const overlay = document.createElement("div");
    overlay.className = "modal_overlay";
    overlay.innerHTML = this.renderTemplate(paymentFormTemplate);
    this.overlayElement = overlay;
    document.body.appendChild(overlay);
    setTimeout(() => {
      const closeBtn = document.querySelector(".close_modal");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          this.closePaymentUI();
        });
      }
      const overlay2 = document.querySelector(".modal_overlay");
      if (overlay2) {
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            this.closePaymentUI();
          }
        });
      }
      this.initializeFormController(document);
    }, 0);
  }
  openNewTab() {
    this.showLogs("Opening payment in new tab");
    const newTab = window.open("", "_blank");
    if (!newTab) {
      const errorMsg = "Popup blocked - please allow popups for this site";
      this.showLogs(errorMsg);
      throw new Error(errorMsg);
    }
    this.newWindowRef = newTab;
    newTab.document.write(this.renderTemplate(paymentFormTemplate));
    newTab.document.close();
    newTab.addEventListener("load", () => {
      this.initializeFormController(newTab.document);
    });
    newTab.focus();
  }
  getTemplateData() {
    return {
      language: this.language,
      logoImg: this.logo ? `<img src="${this.logo}" alt="Shop Logo"/>` : "",
      shopName: this.shopName,
      amount: this.formatAmount(),
      texts: {
        message: this.localization.tag("message"),
        no_app: this.localization.tag("no_app"),
        download: this.localization.tag("download"),
        card_label: this.localization.tag("card_label"),
        card_placeholder: this.localization.tag("card_placeholder"),
        card_error: this.localization.tag("error_message"),
        otp_label: this.localization.tag("otp_label"),
        submit_button: this.localization.tag("submit_button"),
        secured_payment: this.localization.tag("secured_payment")
      }
    };
  }
  _urlResolver() {
    var baseUrl = "https://cdn.jsdelivr.net/gh/YTECH-DEV/ypay_js@master";
    const script = document.currentScript;
    if (script) {
      const scriptUrl = new URL(script.src);
      const basePath = scriptUrl.pathname.split("/").slice(0, -1).join("/");
      baseUrl = `${scriptUrl.origin}${basePath}`;
    }
    return baseUrl;
  }
  renderTemplate(template) {
    console.log(this._urlResolver());
    const data = this.getTemplateData();
    return template.replace(/\{\{language\}\}/g, data.language).replace(/\{\{logoImg\}\}/g, data.logoImg).replace(/\{\{closeBtn\}\}/g, this.modal ? '<button class="close_modal" type="button">×</button>' : "").replace(/\{\{shopName\}\}/g, data.shopName).replace(/\{\{amount\}\}/g, data.amount).replace(/\{\{texts\.message\}\}/g, data.texts.message).replace(/\{\{texts\.no_app\}\}/g, data.texts.no_app).replace(/\{\{texts\.download\}\}/g, data.texts.download).replace(/\{\{texts\.card_label\}\}/g, data.texts.card_label).replace(/\{\{texts\.card_placeholder\}\}/g, data.texts.card_placeholder).replace(/\{\{texts\.card_error\}\}/g, data.texts.card_error).replace(/\{\{texts\.otp_label\}\}/g, data.texts.otp_label).replace(/\{\{texts\.submit_button\}\}/g, data.texts.submit_button).replace(/\{\{texts\.secured_payment\}\}/g, data.texts.secured_payment).replace("./ypay_ui/", this._urlResolver());
  }
  initializeFormController(targetDocument) {
    this.showLogs("Initializing form controller");
    initFormController(targetDocument);
    const form = targetDocument.getElementById("payment_form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.triggerPayment();
      });
    }
  }
  async triggerPayment() {
    this.showLogs(
      "Payment triggered",
      {
        amount: this.amount,
        currency: this.currency
      }
    );
    const doc = this.newWindowRef ? this.newWindowRef.document : document;
    const submit_button = doc.querySelector(".submit_button");
    try {
      const cardInput = doc.getElementById("card_code");
      const card_code = cardInput.value.trim();
      const otpInputs = doc.getElementsByClassName("otp_input_item");
      const otp = parseInt([...otpInputs].map((elem) => elem.value).join(""));
      this.showLogs("Processing payment with card:", card_code.substring(0, 4) + "****");
      if (submit_button) {
        submit_button.innerHTML = this.localization.tag("submit_button_processing");
      }
      const data = await this.ypay.createTransaction(card_code, otp, this.amount, this.localization.current);
      this.showLogs("Payment successful:", data);
      this.customAlert("success", data);
      this.closePaymentUI();
      if (this.handlers.onSuccess) {
        this.handlers.onSuccess(data);
      }
    } catch (err) {
      this.showLogs("Payment error:", err);
      this.customAlert("failure", err);
      if (submit_button) {
        submit_button.innerHTML = this.localization.tag("submit_button");
        submit_button.style.disabled = false;
      }
      if (this.handlers.onFailure) {
        this.handlers.onFailure(err);
      }
    }
  }
  renderForm() {
    this.showLogs("Rendering payment form", {
      modal: this.modal,
      amount: this.amount,
      currency: this.currency
    });
    if (this.modal) {
      this.showModal();
    } else {
      this.openNewTab();
    }
  }
  showLogs(...args) {
    if (this.verbose) {
      console.log("[PaymentUI]", ...args);
    }
  }
};
__publicField(_PaymentUI, "instance");
let PaymentUI = _PaymentUI;
const paymentTriggerButtons = () => {
  const paymentUIButtons = document.querySelectorAll(".payment_btn, .custom_payment_btn");
  paymentUIButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const amount = btn.dataset.amount || 0;
      const modal = btn.dataset.modal || false;
      let paymentUIInstance = PaymentUI.instance;
      paymentUIInstance.amount = parseFloat(amount);
      paymentUIInstance.modal = modal;
      paymentUIInstance.renderForm();
    });
  });
};
paymentTriggerButtons();
export {
  PaymentUI as default
};
//# sourceMappingURL=ypay-ui.es.js.map
