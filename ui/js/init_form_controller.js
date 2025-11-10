import {cardPattern} from "../../ypay/patterns.js";

const primary_color = "#6047FF";
const error_color = "#FF0000";
const disabled = "#E5E7EB";


// Main initialization function
const initFormController = (targetDocument = document) =>
{
    // ============ DOM ELEMENT SELECTION ==========
    const form = targetDocument.querySelector("form");
    const card_code = targetDocument.querySelector("#card_code");
    const card_number_icon = targetDocument.querySelector(".card_icon");
    const otp_inputs = [...targetDocument.querySelectorAll(".otp_input_item")];
    const submit = targetDocument.querySelector(".submit_button");

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

            const error_message_card_number = targetDocument.querySelector('.error-message');
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
            card_code.style.outlineColor = error_color;
            if (card_number_icon)
            {
                card_number_icon.style.color = error_color;
            }
            card_code.style.border = `1px solid ${error_color}`;

            if (!targetDocument.querySelector('.error-message'))
            {
                const error_message_card_number = targetDocument.createElement("span");
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

                card_code.parentNode.appendChild(error_message_card_number);
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


    // Initialize
    submit.disabled = true;
    submitState(false);

};

// Export for module usage
export default initFormController;