# YPAY Transaction's Documentation V1.0.0
## Definition of variables
```js
import Transaction from ".ypay/transaction.js"; // imports the correct path to the Transaction class

const token = "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900" // amount receiver's token
const card_code = "sdsp-ndor" // sender's card code
const otp = "1234" // genereated OTP for the transaction
const amount = 3000 // amount of the transaction
const language = "en" // language: `en` for `English` and `fr` for Fre`nch
```
## Usage Example 1: Check validation before executing
```js
const transaction1 = new Transaction(token, card_code, otp, amount, language);

if (!transaction1.isValid())
{
    console.error("Validation failed:", transaction1.getValidationErrors());
}
else
{
    transaction1.exec()
        .then(data => console.log("Success:", data)) // callback when the operation is done sucessfully
        .catch(error => console.error("Error:", error.message)); // callback when an error occurred
}
```
## Usage Example 2: Using constructor handlers
```js
// definition of handlers
const showSuccessMessage = (data)=>
{
    // statements
}

const showErrorMessage = (data)
{
    // statements
}
const transaction2 = new Transaction(token, card_code, otp, amount, language,
    {
    onSuccess: (data) => showSuccessMessage(data),  // callback when the operation is done sucessfully
    onFailure: (error) => showErrorMessage(error) // callback when an error occurred
});

await transaction2.exec();
```