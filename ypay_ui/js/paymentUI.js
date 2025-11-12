import YPAY from "../../sdk/ypay.js";
import Localization from "./localization.js";

class PaymentUI
{
    static instance;
    constructor(token, currency, language, handlers = {}, shopName, logo)
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
        this.handlers = handlers || {
            onSuccess: (data)=>{},
            onFailure: (data)=>{},
        };
        this.overlayElement = null; // overlayered form
        this.newWindowRef = null; // opened tab
        this.alert = null; // alert for success or error message
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
                console.warn('Cannot access popup window document:', error.message);
            }
        }
        return document;
    }

    // close the payment form
    closePaymentUI()
    {
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
        // gets the default form listeners
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
                console.warn('Alert controller not available:', err);
            });
    }

    customAlert(type, message)
    {
        fetch("./ui/templates/custom_alert.html")
            .then(response => response.text())
            .then(template =>
            {
                const overlay = document.createElement('div');
                overlay.className = 'alert-overlay';
                overlay.innerHTML = this.renderTemplate(template);
                this.alert = overlay;

                document.body.appendChild(this.alert);

                // Initialize alert controller
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
                    submit_btn.innerHTML = this.localization.tag("submit_button")
                }

                closingButton.addEventListener("click", close);
                okButton.addEventListener("click", close);
            })
            .catch(err =>
            {
                console.error('Failed to load alert template:', err);
            });
    }

    // format the amount according to the language set
    formatAmount()
    {
        return this.language === 'fr'
            ? `${this.amount} ${this.currency}`
            : `${this.currency} ${this.amount}`;
    }

    // shows the modal form
    showModal()
    {
        // Load and render template
        fetch('./ui/templates/payment_form.html')
            .then(response => response.text())
            .then(template =>
            {
                // add the overlay to the form
                const overlay = document.createElement('div');
                overlay.className = 'modal_overlay';
                overlay.innerHTML = this.renderTemplate(template);

                this.overlayElement = overlay;
                document.body.appendChild(overlay);

                // add external listeners for the form
                setTimeout(() =>
                {
                    const closeBtn = document.querySelector('.close_modal');
                    if (closeBtn)
                    {
                        // closing form event
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

                    // add the form controller
                    this.initializeFormController(document);
                }, 0);
            })
            .catch(err =>
            {
                console.error('Failed to load template:', err);
            });
    }

    // opens a new tab for the form
    openNewTab()
    {
        fetch('./ui/templates/payment_form.html')
            .then(response => response.text())
            .then(template =>
            {
                // Open in new tab by removing window features (3rd parameter)
                const newTab = window.open("", '_blank');

                if (!newTab)
                {
                    throw new Error('Popup blocked');
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
                console.error('Failed to open payment tab:', err);
            });
    }

    // fetches language data and parameters for the form
    getTemplateData()
    {
        return {
            language: this.language, // language
            logoImg: this.logo ? `<img src="${this.logo}" alt="Shop Logo"/>` : '', // logo
            shopName: this.shopName, // shop name
            amount: this.formatAmount(), // amount formatting
            texts: {
                message: this.localization.tag("message"), // long message for ytech app
                no_app: this.localization.tag("no_app"), // text message for ytech app
                download: this.localization.tag("download"), // download button text
                card_label: this.localization.tag("card_label"), // card label text
                card_placeholder: this.localization.tag("card_placeholder"), // card field text
                otp_label: this.localization.tag("otp_label"), // opt fields label
                submit_button: this.localization.tag("submit_button"), // submission button text
                secured_payment: this.localization.tag("secured_payment") // secured payment message
            }
        };
    }

    // renders form template
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
            .replace(/\{\{texts\.otp_label\}\}/g, data.texts.otp_label)
            .replace(/\{\{texts\.submit_button\}\}/g, data.texts.submit_button)
            .replace(/\{\{texts\.secured_payment\}\}/g, data.texts.secured_payment);
    }

    // add listeners to form
    initializeFormController(targetDocument)
    {
        // gets the default form listeners
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
            console.warn('Form controller not available:', err);
        });

        const form = targetDocument.getElementById('payment_form');
        if (form) {
            form.addEventListener('submit', (e) =>
            {
                e.preventDefault();
                this.triggerPayment();
            });
        }

    }

    // special listener for triggering a payment event
    async triggerPayment()
    {
        try
        {
            const doc = this.newWindowRef ? this.newWindowRef.document : document;

            const cardInput = doc.getElementById("card_code");
            const card_code = cardInput.value.trim();

            const otpInputs = doc.getElementsByClassName("otp_input_item");
            const otp = parseInt([...otpInputs].map(elem => elem.value).join(""));

            const submit_button = doc.querySelector(".submit_button");
            if (submit_button)
            {
                submit_button.innerHTML = this.localization.tag("submit_button_processing");
                submit_button.disabled = true;
            }

            const data = await this.ypay.createTransaction(card_code, this.amount, otp, this.localization.current);

            this.customAlert('success', data);
            this.closePaymentUI();

            if (this.handlers.onSuccess)
            {
                this.handlers.onSuccess(data);
            }

        }
        catch (err)
        {
            console.error('Payment error:', err);
            this.customAlert('failure', err);
            if (this.handlers.onFailure)
            {
                this.handlers.onFailure(err);
            }
        }
    }

    // renders the form according to the type of display
    renderForm()
    {
        if (this.modal)
        {
            this.showModal();
        }
        else
        {
            this.openNewTab();
        }
    }
}

export default PaymentUI;