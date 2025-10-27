const buttonController = (paymentUIInstance) => {
    // Use querySelectorAll to get all matching buttons
    const ypay_btns = document.querySelectorAll(".payment_btn, .custom_payment_btn");

    ypay_btns.forEach(btn =>
    {
        btn.addEventListener("click", () =>
        {
            const amount = btn.dataset.amount || 0;

            paymentUIInstance.triggerPayment(!true, parseFloat(amount));

            paymentUIInstance.renderForm();
        });
    });
};

export default buttonController;