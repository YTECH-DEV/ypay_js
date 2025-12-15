// YPAY UI v1.0.0
// Copyright © 2024 YTECH. All rights reserved.

(function(global) {
"use strict";

// --- ypay_ui/js/localization.js ---
class Localization
{
    constructor()
    {
        this.current = "en";

        this.languages = {
            en: "en",
            fr: "fr",
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
                failure_transaction: "Your transaction has not been processed!",
            },
            fr: {
                card_label: "Numéro de carte",
                card_placeholder: "Entrez votre numéro de carte",
                otp_label: "Entrez le code OTP",
                message: 'Pour continuer le processus de paiement, vous devez d\'abord vous connecter depuis l\'application <a href="#">YPAY</a>, puis generer un OTP de paiement d\'une valeur de ',
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

    isValid(lang)
    {
        return Object.values(this.languages).includes(lang.toLowerCase());
    }

    setLang(lang)
    {
        switch (lang)
        {
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

    tag(key)
    {
        return this.translations[this.current][key] || key;
    }

}


Localization;

// --- ypay_ui/js/alert_controller.js ---
const alertController = (target= document, type = "success", message = "") =>
{
    const alertBox = target.querySelector(".alert")
    const title = alertBox.getElementsByTagName("h2")[0]
    const messageTag = alertBox.getElementsByTagName("p")[0]

    title.innerHTML = type[0].toUpperCase() + type.substring(1, type.length)
    messageTag.innerHTML = message

    if (type === "failure")
    {
        alertBox.classList.add("alert-failure")
        alertBox.classList.remove("alert-success")
    }
}

alertController;

// --- ypay_ui/js/init_form_controller.js ---
const primary_color = "#6047FF";
const error_color = "#FF0000";
const disabled = "#E5E7EB";


// Main initialization function
const initFormController = (targetDocument = document) =>
{
    // ============ DOM ELEMENT SELECTION ==========
    const form = targetDocument.querySelector("form");
    const app_button = targetDocument.querySelector("#app_button");
    const card_code = targetDocument.querySelector("#card_code");
    const card_number_icon = targetDocument.querySelector(".card_icon");
    const error_message_card_number = targetDocument.querySelector('.error_message');
    const otp_inputs = [...targetDocument.querySelectorAll(".otp_input_item")];
    const submit = targetDocument.querySelector(".submit_button")

    // hides the error message by default
    error_message_card_number.style.display = 'none';

    // Check if elements exist
    if (!form || !card_code || !submit || otp_inputs.length === 0)
    {
        console.error("Form elements not found");
        return;
    }

    // ======== METHODS =======
    // Submit button state
    const submitState = (isFormValid) =>
    {
        if (isFormValid)
        {
            submit.disabled = false;
            submit.style.backgroundColor = primary_color;
            submit.style.cursor = "pointer";
        }
        else
        {
            submit.disabled = true;
            submit.style.backgroundColor = disabled;
            submit.style.cursor = "not-allowed";
        }
    };

    // Card number validations
    const cardNumberValidation = () =>
    {

        // Regex validation
        if (cardPattern.test(card_code.value.toString()))
        {
            card_code.style.outlineColor = primary_color;
            if (card_number_icon)
            {
                card_number_icon.style.color = primary_color;
            }
            card_code.style.border = `1px solid ${primary_color}`;

            if (error_message_card_number)
            {
                error_message_card_number.style.display = 'none';
            }

            validateOTP();

            if (card_number_icon)
            {
                card_number_icon.style.top = "50%";
            }
        }
        else
        {
            card_code.style.outlineColor = error_color;
            if (card_number_icon)
            {
                card_number_icon.style.color = error_color;
            }
            card_code.style.border = `1px solid ${error_color}`;

            if (!targetDocument.querySelector('.error_message'))
            {
                const error_message_card_number = targetDocument.createElement("span");
                error_message_card_number.className = "error_message";
            }

            error_message_card_number.style.color = error_color;
            error_message_card_number.style.fontSize = "11px";
            error_message_card_number.style.fontStyle = "italic";
            error_message_card_number.style.marginTop = "4px";
            error_message_card_number.style.display = "block";

            if (card_number_icon)
            {
                card_number_icon.style.top = "35%";
            }

            card_code.parentNode.appendChild(error_message_card_number);

            submitState(false);
        }
    };

    // OTP validation
    const validateOTP = () =>
    {
        const allFilled = otp_inputs.every(input => input.value.length === 1);

        otp_inputs.forEach(input =>
        {
            if (allFilled)
            {
                input.style.borderColor = primary_color;
                input.style.outlineColor = primary_color;
            }
            else if (input.value === '')
            {
                input.style.borderColor = '';
            }
        });

        const isCardValid = cardPattern.test(card_code.value);
        submitState(isCardValid && allFilled);
    };

    // ======== OTP INPUT HANDLERS =======
    const handleKeyDown = (e) =>
    {
        if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey && !e.ctrlKey)
        {
            e.preventDefault();
        }

        if (e.key === 'Delete' || e.key === 'Backspace')
        {
            const index = otp_inputs.indexOf(e.target);
            if (index >= 0)
            {
                otp_inputs[index].value = '';
                if (index > 0)
                {
                    otp_inputs[index - 1].focus();
                }
            }
            validateOTP();
            e.preventDefault();
        }
    };

    const handleInput = (e) =>
    {
        const { target } = e;
        const index = otp_inputs.indexOf(target);
        if (target.value)
        {
            if (index < otp_inputs.length - 1)
            {
                otp_inputs[index + 1].focus();
            }
            else
            {
                submit.focus();
            }
        }
        validateOTP();
    };

    const handleFocus = (e) =>
    {
        e.target.select();
    };

    const handlePaste = (e) =>
    {
        e.preventDefault();
        const text = e.clipboardData.getData('text');

        if (!new RegExp(`^[0-9]{${otp_inputs.length}}$`).test(text))
        {
            return;
        }
        const digits = text.split('');
        otp_inputs.forEach((input, index) => input.value = digits[index]);
        validateOTP();
        submit.focus();
    };

    // ======== LISTENERS =======
    // Card number listener
    card_code.addEventListener("input", function(e)
    {
        let value = card_code.value.toString().replace(/-/g, '');

        // Add hyphen after the first 4 characters
        if (value.length > 4)
        {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }

        // Limit to 9 characters (XXXX-XXXX)
        card_code.value = value.slice(0, 9);
        cardNumberValidation();
    });

    // OTP input listeners
    otp_inputs.forEach((input) =>
    {
        input.addEventListener('paste', handlePaste);
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('focus', handleFocus);
    });

    app_button.addEventListener("click", (e)=>
    {
        e.preventDefault();
        window.open("https://ypay.ytech-bf.com/")
    });


    // Initialize
    submit.disabled = true;
    submitState(false);

};

// Export for module usage
initFormController;

// --- ypay_ui/js/paymentUI.js ---
class PaymentUI
{
    static instance;
    constructor(token, currency, language, handlers = {}, showDialogs = true, verbose = true, shopName, logo)
    {
        if (PaymentUI.instance)
        {
            return PaymentUI.instance;
        }
        this.logo = logo || '';
        this.language = language || 'en';
        this.shopName = shopName || 'Unknown';
        this.currency = currency || 'XOF';
        this.token = token;
        this.modal = false;
        this.verbose = verbose;

        // Transform showDialogs to object format
        this.showDialogs = this._normalizeShowDialogs(showDialogs);

        this.handlers = handlers || {
            onSuccess: (data)=>{},
            onFailure: (data)=>{},
        };
        this.overlayElement = null;
        this.newWindowRef = null;
        this.alert = null;
        this.amount = 0;

        // Set language
        this.localization = new Localization();
        this.localization.setLang(this.language);

        // Validate
        this._validate();

        this.ypay = new YPAY(token, currency, shopName);

        PaymentUI.instance = this;
        return this;
    }

    _normalizeShowDialogs(showDialogs)
    {
        // Support both boolean (legacy) and object formats
        if (typeof showDialogs === 'boolean')
        {
            return {
                onSuccess: showDialogs,
                onFailure: showDialogs
            };
        }
        else if (typeof showDialogs === 'object' && showDialogs !== null)
        {
            return {
                onSuccess: showDialogs.onSuccess !== undefined ? showDialogs.onSuccess : true,
                onFailure: showDialogs.onFailure !== undefined ? showDialogs.onFailure : true
            };
        }
        else
        {
            // Default to showing both
            return {
                onSuccess: true,
                onFailure: true
            };
        }
    }

    toString()
    {
        return `PaymentUI 
        {
          shopName: "${this.shopName}",
          currency: "${this.currency}",
          language: "${this.language}",
          token: "${this.token ? this.token.substring(0, 8) + '...' : 'none'}",
          amount: ${this.amount},
          modal: ${this.modal},
          showDialogs: { onSuccess: ${this.showDialogs.onSuccess}, onFailure: ${this.showDialogs.onFailure} },
          verbose: ${this.verbose},
          hasLogo: ${!!this.logo},
          handlers: ${Object.keys(this.handlers).join(', ')}
        }`;
    }

    _validate()
    {
        let errors = [];

        if (this.language && !this.localization.isValid(this.language))
        {
            errors.push('Language is not available');
        }

        if (this.token==="")
        {
            errors.push('Token is required');
        }

        if (errors.length > 0)
        {
            this.showLogs('Validation errors:', errors.join('\n'));
            throw new Error(errors.join('\n'));
        }
    }

    _getTargetDocument()
    {
        if (this.overlayElement)
        {
            return document;
        }
        if (this.newWindowRef && !this.newWindowRef.closed)
        {
            try
            {
                if (this.newWindowRef.document)
                {
                    return this.newWindowRef.document;
                }
            }
            catch (error)
            {
                this.showLogs('Cannot access popup window document:', error.message);
            }
        }
        return document;
    }

    closePaymentUI()
    {
        this.showLogs('Closing payment UI');

        if (this.overlayElement)
        {
            this.overlayElement.remove();
            this.overlayElement = null;
        }

        if (this.newWindowRef && !this.newWindowRef.closed)
        {
            this.newWindowRef.close();
            this.newWindowRef = null;
        }
    }

    customAlertController(targetDocument, type, message)
    {
        import('./alert_controller.js')
            .then(module =>
            {
                if (module.default && typeof module.default === 'function')
                {
                    module.default(targetDocument, type, message);
                }
            })
            .catch(err =>
            {
                this.showLogs('Alert controller not available:', err);
            });
    }

    customAlert(type, message)
    {
        // Check if we should show dialog based on type
        const shouldShow = type === 'success' ? this.showDialogs.onSuccess : this.showDialogs.onFailure;

        if (!shouldShow)
        {
            this.showLogs(`Alert (${type}):`, message);
            return;
        }

        fetch("./ypay_ui/templates/custom_alert.html")
            .then(response => response.text())
            .then(template =>
            {
                const overlay = document.createElement('div');
                overlay.className = 'alert-overlay';
                overlay.innerHTML = this.renderTemplate(template);
                this.alert = overlay;

                document.body.appendChild(this.alert);

                this.customAlertController(document, type, message);

                const alertBox = this.alert.querySelector(".alert");
                const closingButton = alertBox.querySelector(".close");
                const okButton = alertBox.getElementsByTagName("button")[0];

                const close = () =>
                {
                    if (this.alert && this.alert.parentNode)
                    {
                        this.alert.parentNode.removeChild(this.alert);
                        this.alert = null;
                    }

                    let submit_btn = this._getTargetDocument().getElementsByClassName("submit_button")[0]
                    if (submit_btn)
                    {
                        submit_btn.innerHTML = this.localization.tag("submit_button");
                        submit_btn.disabled = false;
                    }
                }

                closingButton.addEventListener("click", close);
                okButton.addEventListener("click", close);
            })
            .catch(err =>
            {
                this.showLogs('Failed to load alert template:', err);
            });
    }

    formatAmount()
    {
        return this.language === 'fr'
            ? `${this.amount} ${this.currency}`
            : `${this.currency} ${this.amount}`;
    }

    showModal()
    {
        this.showLogs('Opening payment modal');

        fetch('./ypay_ui/templates/payment_form.html')
            .then(response => response.text())
            .then(template =>
            {
                const overlay = document.createElement('div');
                overlay.className = 'modal_overlay';
                overlay.innerHTML = this.renderTemplate(template);

                this.overlayElement = overlay;
                document.body.appendChild(overlay);

                setTimeout(() =>
                {
                    const closeBtn = document.querySelector('.close_modal');
                    if (closeBtn)
                    {
                        closeBtn.addEventListener('click', () => {
                            this.closePaymentUI();
                        });
                    }

                    const overlay = document.querySelector('.modal_overlay');
                    if (overlay)
                    {
                        document.addEventListener('keydown', (e) =>
                        {
                            if (e.key === 'Escape')
                            {
                                this.closePaymentUI();
                            }
                        })
                    }

                    this.initializeFormController(document);
                }, 0);
            })
            .catch(err =>
            {
                this.showLogs('Failed to load template:', err);
            });
    }

    openNewTab()
    {
        this.showLogs('Opening payment in new tab');

        fetch('./ypay_ui/templates/payment_form.html')
            .then(response => response.text())
            .then(template =>
            {
                const newTab = window.open("", '_blank');

                if (!newTab)
                {
                    const errorMsg = 'Popup blocked - please allow popups for this site';
                    this.showLogs(errorMsg);
                    throw new Error(errorMsg);
                }

                this.newWindowRef = newTab;
                newTab.document.write(this.renderTemplate(template));
                newTab.document.close();

                newTab.addEventListener('load', () =>
                {
                    this.initializeFormController(newTab.document);
                });

                newTab.focus();
            })
            .catch(err =>
            {
                this.showLogs('Failed to open payment tab:', err);
            });
    }

    getTemplateData()
    {
        return {
            language: this.language,
            logoImg: this.logo ? `<img src="${this.logo}" alt="Shop Logo"/>` : '',
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

    renderTemplate(template)
    {
        const data = this.getTemplateData();

        return template
            .replace(/\{\{language\}\}/g, data.language)
            .replace(/\{\{logoImg\}\}/g, data.logoImg)
            .replace(/\{\{closeBtn\}\}/g, this.modal ? '<button class="close_modal" type="button">×</button>' : '')
            .replace(/\{\{shopName\}\}/g, data.shopName)
            .replace(/\{\{amount\}\}/g, data.amount)
            .replace(/\{\{texts\.message\}\}/g, data.texts.message)
            .replace(/\{\{texts\.no_app\}\}/g, data.texts.no_app)
            .replace(/\{\{texts\.download\}\}/g, data.texts.download)
            .replace(/\{\{texts\.card_label\}\}/g, data.texts.card_label)
            .replace(/\{\{texts\.card_placeholder\}\}/g, data.texts.card_placeholder)
            .replace(/\{\{texts\.card_error\}\}/g, data.texts.card_error)
            .replace(/\{\{texts\.otp_label\}\}/g, data.texts.otp_label)
            .replace(/\{\{texts\.submit_button\}\}/g, data.texts.submit_button)
            .replace(/\{\{texts\.secured_payment\}\}/g, data.texts.secured_payment);
    }

    initializeFormController(targetDocument)
    {
        this.showLogs('Initializing form controller');

        import('./init_form_controller.js')
            .then(module =>
            {
                if (module.default && typeof module.default === 'function')
                {
                    module.default(targetDocument);
                }
            })
            .catch(err =>
            {
                this.showLogs('Form controller not available:', err);
            });

        const form = targetDocument.getElementById('payment_form');
        if (form)
        {
            form.addEventListener('submit', (e) =>
            {
                e.preventDefault();
                this.triggerPayment();
            });
        }
    }

    async triggerPayment()
    {
        this.showLogs('Payment triggered', {
            amount: this.amount,
            currency: this.currency
        });

        const doc = this.newWindowRef ? this.newWindowRef.document : document;
        const submit_button = doc.querySelector(".submit_button");

        try
        {
            const cardInput = doc.getElementById("card_code");
            const card_code = cardInput.value.trim();

            const otpInputs = doc.getElementsByClassName("otp_input_item");
            const otp = parseInt([...otpInputs].map(elem => elem.value).join(""));

            this.showLogs('Processing payment with card:', card_code.substring(0, 4) + '****');


            if (submit_button)
            {
                submit_button.innerHTML = this.localization.tag("submit_button_processing");
                //submit_button.style.disabled = true;
            }

            const data = await this.ypay.createTransaction(card_code, otp, this.amount, this.localization.current);

            this.showLogs('Payment successful:', data);

            this.customAlert('success', data);
            this.closePaymentUI();

            if (this.handlers.onSuccess)
            {
                this.handlers.onSuccess(data);
            }
        }
        catch (err)
        {
            this.showLogs('Payment error:', err);
            this.customAlert('failure', err);

            if (submit_button)
            {
                submit_button.innerHTML = this.localization.tag("submit_button");
                submit_button.style.disabled = false;
            }

            if (this.handlers.onFailure)
            {
                this.handlers.onFailure(err);
            }
        }
    }

    renderForm()
    {
        this.showLogs('Rendering payment form', {
            modal: this.modal,
            amount: this.amount,
            currency: this.currency
        });

        if (this.modal)
        {
            this.showModal();
        }
        else
        {
            this.openNewTab();
        }
    }

    showLogs(...args)
    {
        if (this.verbose)
        {
            console.log('[PaymentUI]', ...args);
        }
    }
}

PaymentUI;

// --- ypay_ui/js/paymentTriggerButtons.js ---
const paymentTriggerButtons = () =>
{
    // get all matching buttons
    const paymentUIButtons = document.querySelectorAll(".payment_btn, .custom_payment_btn");

    paymentUIButtons.forEach(btn =>
    {
        btn.addEventListener("click", () =>
        {
            const amount = btn.dataset.amount || 0; // gets the amount attached to the button
            const modal = btn.dataset.modal || false; // get the type of form to display

            // retrieves the payment ypay_ui singleton
            let paymentUIInstance = PaymentUI.instance;
            // affects the buttons parameters to the payment instance
            paymentUIInstance.amount = parseFloat(amount);
            paymentUIInstance.modal = modal;
            paymentUIInstance.renderForm();
        });
    });
};

paymentTriggerButtons;

// --- ypay_ui/js/main.js ---
buttonController();

PaymentUI;


// Exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PaymentUI, Localization };
}
global.PaymentUI = PaymentUI;
global.YPAYLocalization = Localization;

})(typeof window !== 'undefined' ? window : this);
