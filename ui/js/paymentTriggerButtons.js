import PaymentUI from "./paymentUI.js";

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

            // retrieves the payment ui singleton
            let paymentUIInstance = PaymentUI.instance;
            console.log(paymentUIInstance.toString());
            // affects the buttons parameters to the payment instance
            paymentUIInstance.amount = parseFloat(amount);
            paymentUIInstance.modal = modal;
            paymentUIInstance.renderForm();
        });
    });
};

export default paymentTriggerButtons;