const primary_color = "#6047FF";
const error_color = "#FF0000";
const disabled = "#E5E7EB";

// ===== Regex pattern for credit card number validation =====
const cardPattern = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;

// Main initialization function
const initFormController = (container = document) =>
{
    // ============ DOM ELEMENT SELECTION ==========
    const form = container.querySelector("form");
    const card_number = container.querySelector("#card_number");
    const card_number_icon = container.querySelector(".card_icon");
    const otp_inputs = [...container.querySelectorAll(".otp_input_item")];
    const submit = container.querySelector(".submit_button");

    // Check if elements exist
    if (!form || !card_number || !submit || otp_inputs.length === 0)
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
        if (cardPattern.test(card_number.value.toString()))
        {
            card_number.style.outlineColor = primary_color;
            if (card_number_icon)
            {
                card_number_icon.style.color = primary_color;
            }
            card_number.style.border = `1px solid ${primary_color}`;

            const error_message_card_number = container.querySelector('.error-message');
            if (error_message_card_number)
            {
                error_message_card_number.remove();
            }

            validateOTP();

            if (card_number_icon)
            {
                card_number_icon.style.top = "50%";
            }
        }
        else
        {
            card_number.style.outlineColor = error_color;
            if (card_number_icon)
            {
                card_number_icon.style.color = error_color;
            }
            card_number.style.border = `1px solid ${error_color}`;

            if (!container.querySelector('.error-message'))
            {
                const error_message_card_number = document.createElement("span");
                error_message_card_number.className = "error-message";
                error_message_card_number.textContent = "Enter XXXX-XXXX with letters/digits only";
                error_message_card_number.style.color = error_color;
                error_message_card_number.style.fontSize = "11px";
                error_message_card_number.style.fontStyle = "italic";
                error_message_card_number.style.marginTop = "4px";
                error_message_card_number.style.display = "block";

                if (card_number_icon)
                {
                    card_number_icon.style.top = "35%";
                }

                card_number.parentNode.appendChild(error_message_card_number);
            }

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

        const isCardValid = cardPattern.test(card_number.value);
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
    card_number.addEventListener("input", function(e)
    {
        var value = card_number.value.toString().replace(/-/g, '');

        // Add hyphen after the first 4 characters
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }

        // Limit to 9 characters (XXXX-XXXX)
        card_number.value = value.slice(0, 9);
        cardNumberValidation();
    });

    // OTP input listeners
    otp_inputs.forEach((input) =>
    {
        console.log("--");
        input.addEventListener('paste', handlePaste);
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('focus', handleFocus);
    });

    // Form submit handler
    form.addEventListener('submit', async (e) =>
    {
        e.preventDefault();

        const cardNumber = card_number.value;
        const otp = otp_inputs.map(input => input.value).join('');

        submit.disabled = true;
        submit.textContent = "Processing...";

        try
        {
            console.log('Submitting payment:', { cardNumber, otp });

            // Example:
            // const transaction = ypay.createTransaction(cardNumber, amount);
            // await transaction.exec();

        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            submit.disabled = false;
            submit.textContent = "Submit";
        }
    });

    // Initialize
    submit.disabled = true;
    submitState(false);

    return {
        cleanup: () => {
            // Remove event listeners if needed
            otp_inputs.forEach((input) => {
                input.removeEventListener('paste', handlePaste);
                input.removeEventListener('input', handleInput);
                input.removeEventListener('keydown', handleKeyDown);
                input.removeEventListener('focus', handleFocus);
            });
        }
    };
};

// Export for module usage
export default initFormController;

// Also make it available globally for inline script usage
if (typeof window !== 'undefined')
{
    window.initFormController = initFormController;
}