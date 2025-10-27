import PaymentData from "./payment_data.js";
import cardPattern from "./patterns.js";

// ----- WILL TAKE CARE OF CREATING A YPAY MONEY TRANSFER EVENT
class Transaction
{
    constructor(sender = "", receiver = "", paymentData = {}, options = {})
    {
        try
        {
            this.sender = sender;
            this.receiver = receiver;

            this._validate();

            this.paymentData = new PaymentData(paymentData);

            this.paymentHandlers = {
                onSuccess: options.onSuccess || (() => {}),
                onFailure: options.onFailure || (() => {})
            };
        }
        catch (e)
        {
            console.error(e);
            throw new Error(e);
        }
    }

    _validate()
    {
        let errorStack = [];

        // Validate sender card format
        if (!cardPattern.test(this.sender))
        {
            errorStack.push("The sender card is not valid.");
        }

        // Validate receiver card format
        if (!cardPattern.test(this.receiver))
        {
            errorStack.push("The receiver card is not valid.");
        }

        if (errorStack.length > 0) {
            throw new Error(errorStack.join("\n"));
        }
    }

    async exec()
    {
        try
        {

            // {
            //     "amount": 500,
            //     "card_code": "AAAA-0000",
            //     "payment_code": 1234
            // }
            const paymentResponse = await fetch("https://ypay.ytech-bf.com/api/v1/project/make-payment",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 293|y9BPlmt7uHOIcdRDg0Qd920cpa94KHdFNIOHx9GQ9c59895f"
                },
                body: JSON.stringify({
                    sender: this.sender,
                    receiver: this.receiver,
                    amount: this.paymentData.amount,
                    currency: this.paymentData.currency,
                    shopName: this.paymentData.shopName
                })
            });

            if (paymentResponse.status!==200)
            {
                throw new Error(`Payment failed: ${paymentResponse.statusText}`);
            }

            const data = await paymentResponse.json();
            this.paymentHandlers.onSuccess(data);

            return data;
        }
        catch (error)
        {
            this.paymentHandlers.onFailure(error);
            throw error;
        }
    }
}

export default Transaction;