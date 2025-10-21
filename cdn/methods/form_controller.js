const primary_color = "#6047FF";
const error_color = "#FF0000";
const disabled = "#E5E7EB"

// ============ DOM ELEMENT SELECTION ==========
const form = document.querySelector("form"); // selects the form
const card_number = document.getElementById("card_number"); // selects the card number field
const card_number_icon = document.getElementsByClassName("card_icon")[0];
const otp_inputs = [...document.querySelectorAll(".otp_input_item")] // selects the p-otp_inputs
const submit = document.getElementsByClassName("submit_button")[0] // selects the submit button
// ===== Regex pattern for credit card number validation =====
const cardPattern = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;

// ======== METHODS =======
// submit button state
const submitState = (isFormValid)=>
{
    if(isFormValid)
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
}

// card number validations
const cardNumberValidation = function ()
{
    // regex validation
    if (cardPattern.test(card_number.value.toString()))
    {
        card_number.style.outlineColor = primary_color; //valid input
        card_number_icon.style.color = primary_color;
        card_number.style.border = `1px solid ${primary_color}`;

        const error_message_card_number = document.getElementsByClassName('error-message')[0];
        if (error_message_card_number)
        {
            error_message_card_number.remove();
        }

        submitState(true)
    }
    else
    {
        card_number.style.outlineColor = error_color; // invalid input
        card_number_icon.style.color = error_color;
        card_number.style.border = `1px solid ${error_color}`;

        const error_message_card_number = document.createElement("span");
        if(document.getElementsByClassName('error-message').length === 0)
        {
            error_message_card_number.className = "error-message";
            error_message_card_number.textContent = "Enter XXXX-XXXX with letters/digits only";
            error_message_card_number.style.color = error_color;
            error_message_card_number.style.fontSize = "11px";
            error_message_card_number.style.fontStyle = "italic";
            error_message_card_number.style.marginTop = "4px";
            error_message_card_number.style.display = "block";
        }
        card_number.parentNode.appendChild(error_message_card_number);
        submitState(false)
    }
}

// ======== LISTENERS =======
// card number listener
const cardNumberListeners = ()=> card_number.addEventListener("input", function(e)
{
    var value = card_number.value.toString().replace(/-/g, ''); // Remove hyphens

    // Add hyphen after the first 4 characters
    if (value.length > 4)
    {
        value = value.slice(0, 4) + '-' + value.slice(4);
    }
    card_number.value = value;
    cardNumberValidation();
});

// otp_inputs methods
const handleKeyDown = (e) =>
{
    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey && !e.ctrlKey)
    {
        e.preventDefault()
    }

    if (e.key === 'Delete' || e.key === 'Backspace')
    {
        const index = otp_inputs.indexOf(e.target);
        if (index > 0)
        {
            otp_inputs[index].value = '';
            otp_inputs[index + 1].focus();
        }
        validateOTP();
        // e.preventDefault();
    }
}

const handleInput = (e) =>
{
    const { target } = e
    const index = otp_inputs.indexOf(target)
    if (target.value)
    {
        if (index < otp_inputs.length - 1)
        {
            otp_inputs[index + 1].focus()
        }
        else
        {
            submit.focus()
        }
    }
    validateOTP();
}

const handleFocus = (e) =>
{
    e.target.select()
}

const handlePaste = (e) =>
{
    e.preventDefault()
    const text = e.clipboardData.getData('text')

    if(!new RegExp(`^[0-9]{${otp_inputs.length}}$`).test(text))
    {
        return;
    }
    const digits = text.split('')
    otp_inputs.forEach((input, index) => input.value = digits[index])
    validateOTP();
    submit.focus()
}


const otp_inputListeners = function ()
{

    otp_inputs.forEach((input) =>
    {
        input.addEventListener('paste', handlePaste)
        input.addEventListener('input', handleInput)
        input.addEventListener('keydown', handleKeyDown)
        input.addEventListener('focus', handleFocus)
    })
}

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
            input.style.borderColor = ''; // Reset to default
        }
    });

    const isCardValid = cardPattern.test(card_number.value);
    submitState(isCardValid && allFilled);
}

document.addEventListener('DOMContentLoaded', function()
{
    submit.disabled = true; // disables submit button
    cardNumberListeners();
    otp_inputListeners();
});
