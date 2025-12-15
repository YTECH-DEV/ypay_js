// YPAY SDK v1.0.0
// Copyright © 2024 YTECH. All rights reserved.

(function(global) {
"use strict";

// --- sdk/enums.js ---
class Currency
{
    static USD = "USD"
    static NGN = "NGN"
    static XOF = "F CFA"

    static isValid(currency)
    {
        return Object.values(this).includes(currency.toUpperCase());
    }
}



// --- sdk/patterns.js ---
const cardPattern = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
const paymentCodePattern = /^[0-9]{6}$/;
const tokenPattern = /^[0-9]{1,}\|[A-Za-z0-9]{48}$/;



// --- sdk/transaction.js ---
class Transaction
{
    constructor(token = "", sender = "", otp = "", amount = 0, language = "en", handlers = {})
    {
        this.sender = this.sanitizeData(sender);
        this.token = this.sanitizeData(token);
        this.otp = otp;
        this.amount = parseFloat(amount.toString());
        this.language = language;

        this.paymentHandlers =
        {
            onSuccess: handlers.onSuccess || (() => {}),
            onFailure: handlers.onFailure || (() => {})
        };

        // Validate during construction
        const validationError = this._validate();
        if (validationError)
        {
            this.validationError = validationError;
        }
    }

    _validate()
    {
        const errors = [];

        if (!this.sender)
        {
            errors.push("Sender card is required.");
        }
        else if (!cardPattern.test(this.sender))
        {
            errors.push("Sender card format is invalid.");
        }

        if (!this.token)
        {
            errors.push("token is required.");
        }
        else if (!tokenPattern.test(this.token))
        {
            errors.push("token card format is invalid.");
        }

        if (!this.otp)
        {
            errors.push("Payment code is required.");
        }
        else if (!paymentCodePattern.test(this.otp))
        {
            errors.push("Payment code format is invalid.");
        }

        if (isNaN(this.amount) || this.amount <= 0)
        {
            errors.push("Amount must be a positive number.");
        }

        if (!["en", "fr"].includes(this.language.toString().toLowerCase()))
        {
            errors.push("Language is invalid.");
        }

        return errors.length > 0 ? new Error(errors.join("\n")) : null;
    }

    async exec()
    {
        // Check for validation errors first
        if (this.validationError)
        {
            this.paymentHandlers.onFailure(this.validationError);
            throw this.validationError;
        }

        try
        {
            const paymentResponse = await fetch(
                "https://ypay.ytech-bf.com/api/v1/project/make-payment",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.token}`,
                        "accept-language" : this.language,
                    },
                    body: JSON.stringify({
                        card_code: this.sender,
                        amount: this.amount,
                        payment_code: this.otp
                    })
                }
            );

            // Check for successful status codes (200-299)
            if (paymentResponse.ok)
            {
                const data = await paymentResponse.json();
                this.paymentHandlers.onSuccess(data);
                return data;
            }

            // Handle HTTP errors
            const errorData = await paymentResponse.json().catch(() => ({}));
            const errorMessage = errorData.message || paymentResponse.statusText || "Payment failed";
            throw new Error(`${paymentResponse.status}\n${errorMessage}`);
        }
        catch (error)
        {
            this.paymentHandlers.onFailure(error);
            throw error;
        }
    }


    // Validation checker
    isValid()
    {
        return !this.validationError;
    }

    // Get validation errors without throwing
    getValidationErrors()
    {
        return this.validationError ? this.validationError.message : null;
    }

    // Sanitizes data passed to the constructor
    sanitizeData(data = "")
    {
        if (data === "" || data === null || data === undefined)
        {
            return "";
        }

        data = String(data);

        // Remove null bytes
        data = data.replace(/\\0/g, '');

        // Trim whitespace
        data = data.trim();

        // Strip HTML tags
        data = data.replace(/<[^>]*>/g, '');

        return data;
    }
}

Transaction;

// --- sdk/ypay.js ---
// ----- ONE TIME CONFIGURATIONS FOR YPAY PAYMENTS
class YPAY
{
    // one-time initialization
    constructor(token, currency, shopName)
    {
        this.token = token;
        this.currency = currency || Currency.XOF;
        this.shopName = shopName || "Undefined";


        // Validate during construction
        const validationError = this._validate();
        if (validationError)
        {
            this.validationError = validationError;
        }

        // singleton instance-like
        if(YPAY.instance)
        {
            return YPAY.instance;
        }

        YPAY.instance = this;
    }

    // create a transaction and execute it
    createTransaction(card_code, otp, amount, language, handlers = {})
    {
        return new Transaction(
            this.token,
            card_code,
            otp,
            amount,
            language,
            handlers
        ).exec();
    }

    static resetInstance()
    {
        YPAY.instance = null;
    }

    _validate()
    {
        const errors = []

        // checks currency
        if(!Currency.isValid(this.currency))
        {
            errors.push(this.currency + " is not supported yet");
        }

        return errors.length > 0 ? new Error(errors.join("\n")) : null;
    }
}

YPAY;


// Exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YPAY, Transaction, Currency, cardPattern, paymentCodePattern, tokenPattern };
}
global.YPAY = YPAY;
global.YPAYTransaction = Transaction;
global.YPAYCurrency = Currency;

})(typeof window !== 'undefined' ? window : this);
