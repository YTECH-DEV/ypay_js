import YPAY from "../../ypay/ypay.js";
import Local from "./local.js";
import initFormController from './form_controller.js';


class PaymentUI
{
    constructor(receiver, currency, shopName, logo, language)
    {
        try
        {
            this.validateConfig({ language, shopName, currency });

            this.logo = logo || '';
            this.language = language || 'en';
            this.shopName = shopName || 'Unknown';
            this.currency = currency || 'XOF';
            this.receiver = receiver;
            this.amount = 0;
            this.modal = false;

            this.ypay = new YPAY(receiver, currency, shopName);

            if (PaymentUI.instance)
            {
                return PaymentUI.instance;
            }

            PaymentUI.instance = this;

            // Set language
            Local.setLang(this.language);
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }

    triggerPayment(modal, amount)
    {
        console.log(modal, amount);
        try
        {
            this.modal = modal;
            this.amount = amount || 0.0;

            // Amount validation
            if (this.amount <= 0)
            {
                throw new Error('Amount must be greater than 0');
            }
        }
        catch (e)
        {
            console.error(e);
            throw e;
        }
    }

    // Validates the configurations
    validateConfig(config)
    {
        let errorStack = [];

        if (config.language && !Object.keys(Local.languages).includes(config.language))
        {
            errorStack.push('Language is not available');
        }

        if (errorStack.length > 0)
        {
            throw new Error(errorStack.join('\n'));
        }
        return true;
    }

    // Gets the styles for the form
    getFormStyles()
    {
        return "./ui/styles/style.css";
    }

    formatAmount()
    {
        return this.language === 'fr'
            ? `${this.amount} ${this.currency}`
            : `${this.currency} ${this.amount}`;
    }

    getFormTemplate()
    {
        const logoImg = this.logo ? `<img src="${this.logo}" alt="Shop Logo"/>` : '';
        const closeBtn = this.modal ? '<button class="close_modal">×</button>' : '<div></div>';

        return `
        <!DOCTYPE html>
        <html lang="${this.language}">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Gateway</title>
            <link rel="stylesheet" href="${this.getFormStyles()}">
        </head>
        <body>
            <div class="modal_box">
                <!--       HEADER     -->
                <div class="modal_header">
                    <div class="first_stack">
                        <div class="shop_icon">${logoImg}</div>
                        <div class="ytech_icon">
                            ${closeBtn}
                            <img src="./ui/assets/images/logo_inverted.svg" alt="ypay logo">
                        </div>
                    </div>
                    <span class="second_stack">${this.shopName}</span>
                    <span class="third_stack">${this.formatAmount()}</span>
                </div>
                
                <!--       YTECH MOBILE APP     -->
                <div class="modal_info">
                    <div class="message">${Local.tag("message") + "  <a>" + this.formatAmount()}<a/></div>
                    <div class="separator"> <hr> ${Local.tag("no_app")} <hr></div>
                    <div class="download_button">
                        <button>
                            ${Local.tag("download")}
                            <svg class="download_icon" width="20px" height="20px" stroke-width="1.5" viewBox="0 0 20 20" fill="none">
                                <path d="M6 20L18 20" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M12 4V16M12 16L15.5 12.5M12 16L8.5 12.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!--       FORM     -->
                <div class="modal_form">
                    <form action="#">
                        <div class="form_item">
                            <label class="card_label" for="card_number">${Local.tag("card_label")}</label><br>
                            <div class="card_input_container">
                                <svg class="card_icon" width="22px" height="22px" viewBox="0 0 22 22" stroke-width="1.5" fill="none">
                                    <path d="M22 9V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V9ZM22 9H6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M16.5 13.3819C16.7654 13.1444 17.1158 13 17.5 13C18.3284 13 19 13.6716 19 14.5C19 15.3284 18.3284 16 17.5 16C17.1158 16 16.7654 15.8556 16.5 15.6181" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M16.5 13.3819C16.2346 13.1444 15.8842 13 15.5 13C14.6716 13 14 13.6716 14 14.5C14 15.3284 14.6716 16 15.5 16C15.8842 16 16.2346 15.8556 16.5 15.6181" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                                <input id="card_number" class="card_number_input" type="text" autocomplete="off" placeholder="${Local.tag("card_placeholder")}" required>
                            </div>
                        </div>
        
                        <div class="form_item">
                            <label for="otp_inputs" class="otp_label">${Local.tag("otp_label")}</label><br>
                            <div id="otp_inputs" class="otp_inputs">
                                <label><input class="otp_input_item" type="text" maxlength="1" autocomplete="off" required></label>
                                <label><input class="otp_input_item" type="text" maxlength="1" autocomplete="off" required></label>
                                <label><input class="otp_input_item" type="text" maxlength="1" autocomplete="off" required></label>
                                <label><input class="otp_input_item" type="text" maxlength="1" autocomplete="off" required></label>
                            </div>
                        </div>
        
                        <div class="form_item">
                            <button class="submit_button" type="submit">${Local.tag("submit_button")}</button>
                        </div>
                    </form>
        
                    <!--       SECURED MESSAGE     -->
                    <div class="secured_payment">
                        <svg class="secured_payment_icon"  width="18px" height="18px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" color="#000000">
                            <path d="M22 9V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H14M22 9H6M22 9V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M21.1667 18.5H21.4C21.7314 18.5 22 18.7686 22 19.1V21.4C22 21.7314 21.7314 22 21.4 22H17.6C17.2686 22 17 21.7314 17 21.4V19.1C17 18.7686 17.2686 18.5 17.6 18.5H17.8333M21.1667 18.5V16.75C21.1667 16.1667 20.8333 15 19.5 15C18.1667 15 17.8333 16.1667 17.8333 16.75V18.5M21.1667 18.5H17.8333" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span>${Local.tag("secured_payment")}</span>
                    </div>
                </div>
            </div>
           
        </body>
        </html>
        
        `;
    }

    showModal()
    {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal_overlay';
        overlay.innerHTML = this.getFormTemplate();

        // Add to body
        document.body.appendChild(overlay);

        // Add close button handler if modal
        if (this.modal)
        {
            const closeBtn = overlay.querySelector('.close_modal');
            if (closeBtn)
            {
                closeBtn.addEventListener('click', () =>
                {
                    overlay.remove();
                });
            }
        }
    }

    openNewTab()
    {
        const newWindow = window.open("", '_blank');

        if (!newWindow)
        {
            console.error('Failed to open new window. Popup may be blocked.');
            return;
        }

        newWindow.document.write(this.getFormTemplate());
        newWindow.document.close();
        newWindow.focus();
    }

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

        // Initialize form controller after DOM is ready
        setTimeout(() =>
        {
            import('./form_controller.js').then(module =>
            {
                console.log(module);

                if (module.default)
                {
                    module.default();
                }
            });
        }, 100);
    }
}

export default PaymentUI;