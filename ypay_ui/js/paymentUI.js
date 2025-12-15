import YPAY from "../../sdk/ypay.js";
import Localization from "./localization.js";

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

export default PaymentUI;