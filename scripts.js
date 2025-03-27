// select card field
var input = document.getElementById("card_number");

// Regex pattern for credit card number validation
const cardPattern = /^[A-Za-z]{4}-[0-9]{4}$/;

// listener on key typed
input.addEventListener("input", function(e)
{
    var value = input.value.toString().replace(/-/g, ''); // Remove hyphens

    // Add hyphen after the first 4 characters
    if (value.length > 4) 
    {
        value = value.slice(0, 4) + '-' + value.slice(4);
    }
    input.value = value;

    // regex validation
    if (cardPattern.test(value))
    {
        input.style.outlineColor = "#6047FF"; //valid input
    } 
    else
    {
        input.style.outlineColor = "red"; // invalid input
    }
});

// pinput fields
const inputs = [...document.querySelectorAll(".pinput_item")]
const submit = document.getElementsByClassName("primary_btn")[0]

const handleKeyDown = (e) => 
{
    console.log(e)
    if (!/^[0-9]{1}$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey && !e.ctrlKey)
    {
        e.preventDefault()
    }

    if (e.key === 'Delete' || e.key === 'Backspace') 
    {
        const index = inputs.indexOf(e.target);
        if (index > 0) 
        {
            inputs[index].value = '';
            inputs[index - 1].focus();
        }
    }
}

const handleInput = (e) => 
{
    const { target } = e
    const index = inputs.indexOf(target)
    if (target.value)
    {
        if (index < inputs.length - 1) 
        {
            inputs[index + 1].focus()
        } 
        else 
        {
            submit.focus()
        }
    }
}

const handleFocus = (e) => 
{
    e.target.select()
}

const handlePaste = (e) => 
{
    console.log("this party")
    e.preventDefault()
    const text = e.clipboardData.getData('text')

    if(!new RegExp(`^[0-9]{${inputs.length}}$`).test(text))
    {
        return;
    }
    const digits = text.split('')
    inputs.forEach((input, index) => input.value = digits[index])
    submit.focus()
}


inputs.forEach((input) => 
{
    input.addEventListener('paste', handlePaste)
    input.addEventListener('input', handleInput)
    input.addEventListener('keydown', handleKeyDown)
    input.addEventListener('focus', handleFocus)
})