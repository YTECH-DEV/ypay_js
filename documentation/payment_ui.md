# YPAY Payment Gateway Documentation V1.0.0

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Payment UI Integration](#payment-ui-integration)
4. [Usage Examples](#usage-examples)
5. [API Reference](#api-reference)
6. [Localization](#localization)
7. [Error Handling](#error-handling)

---

## Overview

YPAY is a comprehensive payment gateway solution that provides both programmatic transaction handling and a complete UI interface for payment processing. The system supports multiple currencies (USD, XOF) and languages (English, French).

---

## Project Structure
```
├── path/to/ypay-sdk
├── ypay_ui/
│   ├── templates/
│   │   ├── payment_form.html           # Payment form template
│   │   └── custom_alert.html           # Alert template
│   │── styles/
│   │   ├── buttons.css                 # styles for ypay buttons
│   │   ├── custom_alert.css            # styles for custom alerts for notifications
│   │   ├── form.css                    # styles for the form
│   │   ├── modal.css                   # styles for the main overlay of the form
│   │   ├── root.css                    # global style variables
│   │   └── style.css                   # main file gathering all css files
│   │── js/
│   │   ├── paymentUI.js                # UI controller
│   │   ├── localization.js             # Language management
│   │   ├── init_form_controller.js     # Form validation & interactions
│   │   ├── alert_controller.js         # Alert management
│   │   ├── paymentTriggerButtons.js    # Button event handlers
│   │   └── main.js                     # Entry point
```

### 3. PaymentUI Class
Manages the payment interface with modal or new tab display options.

#### Constructor
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

const paymentUI = new PaymentUI(token, currency, language, handlers, shopName, logo);
```
> **The instance of PaymentUI should be created only once.**

**Parameters:**
- `token` (string): API token
- `currency` (string): Currency code. Default: "XOF"
- `language` (string): "en" or "fr". Default: "en"
- `handlers` (object): Success/failure callbacks
- `shopName` (string): Display name. Default: "Unknown"
- `logo` (string): Logo image URL. Default: ""

#### Properties
```js
paymentUI.amount = 5000;        // Set transaction amount
paymentUI.modal = true;         // true = modal, false = new tab
```

#### Methods

**renderForm()**
Displays the payment form.
```js
paymentUI.renderForm();
```

**closePaymentUI()**
Closes the payment form.
```js
paymentUI.closePaymentUI();
```

---

## Payment UI Integration

### Method 1: Automatic Button Integration
Add data attributes to any button:

```html
<button 
    class="payment_btn" 
    data-amount="2500" 
    data-modal="true">
    Pay Now
</button>

<button 
    class="custom_payment_btn" 
    data-amount="5000" 
    data-modal="false">
    Pay in New Tab
</button>
```

**Attributes:**
- `class`: Must be `payment_btn` or `custom_payment_btn`
- `data-amount`: Transaction amount
- `data-modal`: "true" for modal, "false" for new tab

### Method 2: Programmatic Integration
```js
import PaymentUI from "./ypay_ui/paymentUI.js";

const paymentUI = new PaymentUI(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "fr",
    {
        onSuccess: (data) => alert("Payment successful!"),
        onFailure: (error) => alert("Payment failed!")
    },
    "My Shop",
    "./logo.png"
);

paymentUI.amount = 3000;
paymentUI.modal = true;
paymentUI.renderForm();
```

---

## Usage Examples

### Example 1: Simple Transaction with Validation
```js
import Transaction from "path/to/sdk/transaction.js";

const token = "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900";
const card_code = "SDSP-NDOR";
const otp = "1234";
const amount = 3000;

const transaction = new Transaction(token, card_code, otp, amount);

if (!transaction.isValid()) 
{
    console.error("Validation failed:", transaction.getValidationErrors());
}
else
{
    transaction.exec()
        .then(data => console.log("Success:", data))
        .catch(error => console.error("Error:", error.message));
}
```

### Example 2: Using YPAY with Handlers
```js
import YPAY from "path/to/sdk/sdk.js";
import { Currency } from "path/to/sdk/enums.js";

const ypay = new YPAY(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    Currency.XOF,
    "Tech Store"
);

const showSuccess = (data) => {
    console.log("Payment processed:", data);
    // Update UI, redirect, etc.
};

const showError = (error) => {
    console.error("Payment error:", error.message);
    // Show error message to user
};

await ypay.createTransaction(
    "ABCD-1234",
    "5678",
    2500,
    "en",
    {
        onSuccess: showSuccess,
        onFailure: showError
    }
);
```

### Example 3: Complete UI Integration
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

// Initialize payment UI
const paymentUI = new PaymentUI(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "fr",
    {
        onSuccess: (data) => {
            console.log("Transaction successful:", data);
            window.location.href = "/success";
        },
        onFailure: (error) => {
            console.error("Transaction failed:", error);
            alert("Payment failed. Please try again.");
        }
    },
    "Mon Magasin",
    "path/to/assets/logo.png"
);
```

---

## API Reference

### Validation Patterns

```js
import { cardPattern, paymentCodePattern, tokenPattern } from "path/to/sdk/patterns.js";
```

- **cardPattern**: `/^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/`
- **paymentCodePattern**: `/^[0-9]{4}$/`
- **tokenPattern**: `/^[0-9]{1,}\|[A-Za-z0-9]{48}$/`

### Currency Enum

```js
import { Currency } from "./sdk/enums.js";

Currency.USD   // "USD"
Currency.NGN   // "NGN"
Currency.XOF   // "F CFA"

Currency.isValid("USD");  // true
Currency.isValid("EUR");  // false
```

---

## Localization

### Supported Languages
- English (`en`)
- French (`fr`)

### Custom Localization
```js
import Localization from "path/to/ypay_ui/localization.js";

const localization = new Localization();
localization.setLang("fr");

console.log(localization.tag("card_label"));        // "Numéro de carte"
console.log(localization.tag("submit_button"));     // "Valider"
```

---

## Error Handling

### Validation Errors
```js
const transaction = new Transaction(token, card_code, otp, amount);

if (!transaction.isValid()) 
{
    const errors = transaction.getValidationErrors();
    // Errors format: "Error 1\nError 2\nError 3"
    console.error(errors);
}
```

### Common Validation Errors
- "Sender card is required."
- "Sender card format is invalid."
- "Token is required."
- "Token format is invalid."
- "Payment code is required."
- "Payment code format is invalid."
- "Amount must be a positive number."
- "Language is invalid."

### API Errors
```js
try 
{
    await transaction.exec();
}
catch (error)
{
    // Error format: "STATUS_CODE\nError message"
    console.error(error.message);
}
```

### HTTP Status Codes
- **200-299**: Success
- **400**: Bad Request (validation failed)
- **401**: Unauthorized (invalid token)
- **404**: Not Found
- **500**: Server Error

---

## Best Practices

### 1. Token Security
```js
// Don't hardcode tokens
const token = "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900";

// Instead, use environment variables or secure storage
const token = process.env.YPAY_TOKEN;
```

### 2. Error Handling
```js
// Always validate before executing
if (transaction.isValid()) {
    await transaction.exec();
}

// Always catch errors
try 
{
    await transaction.exec();
} catch (error)
{
    // Handle error appropriately
}
```

### 3. UI Cleanup
```js
// Close UI after successful payment
paymentUI.handlers.onSuccess = (data) =>
{
    paymentUI.closePaymentUI();
    // Redirect or show success message
};
```

### 4. Amount Validation
```js
// Validate amount before creating transaction
const amount = parseFloat(userInput);
if (isNaN(amount) || amount <= 0) 
{
    alert("Invalid amount");
    return;
}
```

---

## Support

For API documentation and developer resources, visit:
- API Docs: `https://ypay.ytech-bf.com/api/docs`
- Support: `infos@ytech-bf.com`

---

## License

Copyright © 2024 YTECH. All rights reserved.