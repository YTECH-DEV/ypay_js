import PaymentUI from "./paymentUI.js";
import buttonController from "./paymentTriggerButtons.js";
import alertController from "./alert_controller";
import initFormController from "./init_form_controller";
import Localization from "./localization";

buttonController();
/*
// Auto-initialize on load
if (typeof window !== 'undefined')
{
    // Expose to global scope
    window.PaymentUI = PaymentUI;
    window.YPAY = PaymentUI;

    // Initialize button controllers when DOM is ready
    if (document.readyState === 'loading')
    {
        document.addEventListener('DOMContentLoaded', buttonController);
    }
    else
    {
        buttonController();
    }
}
*/
// ES module export
export default PaymentUI;