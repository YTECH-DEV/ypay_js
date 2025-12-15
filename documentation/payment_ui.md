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
│   ├── styles/
│   │   ├── buttons.css                 # styles for ypay buttons
│   │   ├── custom_alert.css            # styles for custom alerts for notifications
│   │   ├── form.css                    # styles for the form
│   │   ├── modal.css                   # styles for the main overlay of the form
│   │   ├── root.css                    # global style variables
│   │   └── style.css                   # main file gathering all css files
│   ├── js/
│   │   ├── paymentUI.js                # UI controller
│   │   ├── localization.js             # Language management
│   │   ├── init_form_controller.js     # Form validation & interactions
│   │   ├── alert_controller.js         # Alert management
│   │   ├── paymentTriggerButtons.js    # Button event handlers
│   │   └── main.js                     # Entry point
```

---

## API Reference

### 3. PaymentUI Class
Manages the payment interface with modal or new tab display options.

#### Constructor
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

const paymentUI = new PaymentUI(
    token,
    currency,
    language,
    handlers,
    showDialogs,
    verbose,
    shopName,
    logo
);
```
> **The instance of PaymentUI should be created only once.**

**Parameters:**
- `token` (string, required): API token
- `currency` (string): Currency code. Default: `"XOF"`
- `language` (string): Interface language ("en" or "fr"). Default: `"en"`
- `handlers` (object): Success/failure callbacks. Default: `{}`
- `showDialogs` (boolean | object): Control UI alert dialogs. See [Show Dialogs Configuration](#show-dialogs-showdialogs) below. Default: `true`
- `verbose` (boolean): Enable console logging for debugging. Default: `true`
- `shopName` (string): Display name. Default: `"Unknown"`
- `logo` (string): Logo image URL. Default: `""`

#### Properties
```js
paymentUI.amount = 5000;        // Set transaction amount
paymentUI.modal = true;         // true = modal, false = new tab
paymentUI.showDialogs = { onSuccess: true, onFailure: false };  // Control UI alerts
paymentUI.verbose = true;       // Control console logging
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

**formatAmount()**
Formats amount according to language setting.
```js
const formatted = paymentUI.formatAmount();
// French: "5000 XOF"
// English: "XOF 5000"
```

**toString()**
Returns string representation for debugging.
```js
console.log(paymentUI.toString());
// Output: PaymentUI { shopName: "...", currency: "...", ... }
```

#### Configuration Options

**Verbose Mode (`verbose`)**
- `true`: Logs all operations to console (initialization, form opening, payment processing, success/failure)
- `false`: Silent mode, no console output

```js
// Enable detailed logging
const payment = new PaymentUI(token, "XOF", "en", {}, true, true);

// Silent mode
const payment = new PaymentUI(token, "XOF", "en", {}, true, false);
```

**Show Dialogs (`showDialogs`)**

The `showDialogs` parameter provides granular control over when UI alert dialogs are displayed. It accepts either a boolean (for backward compatibility) or an object for fine-grained control.

**Format 1: Boolean (Legacy)**
- `true`: Displays alert dialogs for both success and failure
- `false`: No UI alerts, only callbacks (messages logged to console if verbose is enabled)

```js
// Show all dialogs
const payment = new PaymentUI(token, "XOF", "en", {}, true, true);

// No dialogs at all
const payment = new PaymentUI(token, "XOF", "en", {}, false, true);
```

**Format 2: Object (Recommended)**

For granular control, pass an object with `onSuccess` and `onFailure` properties:

```js
{
    onSuccess: boolean,  // Show dialog on successful payment
    onFailure: boolean   // Show dialog on payment failure
}
```

**Examples:**

```js
// Show only success dialogs (hide error dialogs)
const payment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    {}, 
    { onSuccess: true, onFailure: false }, 
    true
);

// Show only failure dialogs (hide success dialogs)
const payment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    {}, 
    { onSuccess: false, onFailure: true }, 
    true
);

// Show both (equivalent to showDialogs: true)
const payment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    {}, 
    { onSuccess: true, onFailure: true }, 
    true
);

// Show neither (equivalent to showDialogs: false)
const payment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    {}, 
    { onSuccess: false, onFailure: false }, 
    true
);
```

**Note:** When dialogs are disabled, the corresponding callbacks in `handlers` are still triggered. Messages are logged to console if `verbose` is enabled.

**Singleton Pattern**
PaymentUI uses a singleton pattern. Multiple instantiations return the same instance:
```js
const payment1 = new PaymentUI(token, "XOF", "en");
const payment2 = new PaymentUI(token, "XOF", "en");
console.log(payment1 === payment2); // true

// Access existing instance
const existingInstance = PaymentUI.instance;
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
    { onSuccess: true, onFailure: true },  // showDialogs
    true,  // verbose
    "My Shop",
    "./logo.png"
);

paymentUI.amount = 3000;
paymentUI.modal = true;
paymentUI.renderForm();
```

### Method 3: Custom Button Integration
```html
<button id="custom">Custom button</button>
```
```js
let customButton = document.getElementById("custom");
customButton.addEventListener("click", function (event)
{
    event.preventDefault();
    // Retrieves the payment ypay_ui singleton from previous instance
    let paymentUIInstance = PaymentUI.instance;
    // Affects the button's parameters to the payment instance
    paymentUIInstance.amount = 50000; // Amount example for the payment
    paymentUIInstance.modal = true;
    paymentUIInstance.renderForm();
});
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

### Example 3: Complete UI Integration with Full Configuration
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

// Initialize payment UI with all options
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
    { onSuccess: true, onFailure: true },  // Show all dialogs
    true,  // verbose - enable console logging
    "Mon Magasin",
    "path/to/assets/logo.png"
);
```

### Example 4: Silent Mode (No Dialogs, No Logs)
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

// Silent payment processing with callbacks only
const paymentUI = new PaymentUI(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "en",
    {
        onSuccess: (data) => {
            // Custom success handling without dialogs
            redirectToThankYouPage(data);
        },
        onFailure: (error) => {
            // Custom error handling without dialogs
            showCustomErrorMessage(error);
        }
    },
    false,  // No UI dialogs (equivalent to { onSuccess: false, onFailure: false })
    false,  // No console logs
    "My Shop"
);

paymentUI.amount = 10000;
paymentUI.modal = true;
paymentUI.renderForm();
```

### Example 5: Development Mode (Verbose Logging, No Dialogs)
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

// For debugging: logs enabled, but no UI interruptions
const paymentUI = new PaymentUI(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "en",
    {
        onSuccess: (data) => console.log("Success:", data),
        onFailure: (error) => console.error("Failure:", error)
    },
    { onSuccess: false, onFailure: false },  // No UI dialogs
    true,   // Verbose logs - see everything in console
    "Test Shop"
);

paymentUI.amount = 500;
paymentUI.modal = true;
paymentUI.renderForm();
```

### Example 6: Success Dialog Only (Hide Errors)
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

// Show success dialog but handle errors programmatically
const paymentUI = new PaymentUI(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "en",
    {
        onSuccess: (data) => {
            // Success dialog will show automatically
            console.log("Payment completed:", data);
        },
        onFailure: (error) => {
            // No dialog shown, handle error programmatically
            displayCustomErrorUI(error);
            logErrorToAnalytics(error);
        }
    },
    { onSuccess: true, onFailure: false },  // Only show success dialog
    true,
    "My Shop"
);
```

### Example 7: Error Dialog Only (Silent Success)
```js
import PaymentUI from "path/to/ypay_ui/paymentUI.js";

// Show error dialog but handle success silently (e.g., for background payments)
const paymentUI = new PaymentUI(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "en",
    {
        onSuccess: (data) => {
            // No dialog, just redirect
            window.location.href = "/dashboard?payment=success";
        },
        onFailure: (error) => {
            // Error dialog will show automatically
            console.error("Payment failed:", error);
        }
    },
    { onSuccess: false, onFailure: true },  // Only show error dialog
    true,
    "My Shop"
);
```

---

## Validation Patterns

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

### 5. Configuration for Different Environments

```js
// Production: Show dialogs, no verbose logs
const prodPayment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    handlers, 
    { onSuccess: true, onFailure: true }, 
    false
);

// Development: Show logs, show only error dialogs
const devPayment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    handlers, 
    { onSuccess: false, onFailure: true }, 
    true
);

// Testing: Silent mode
const testPayment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    handlers, 
    false,  // or { onSuccess: false, onFailure: false }
    false
);

// E-commerce checkout: Silent success, show errors
const checkoutPayment = new PaymentUI(
    token, 
    "XOF", 
    "en", 
    {
        onSuccess: (data) => window.location.href = "/order-complete",
        onFailure: (error) => {} // Dialog will show
    }, 
    { onSuccess: false, onFailure: true }, 
    false
);
```

### 6. Dialog Control Best Practices

**When to show success dialogs:**
- One-time donations or tips
- Manual admin payments
- Guest checkout scenarios
- When users need explicit confirmation

**When to hide success dialogs:**
- Subscription renewals (silent success, redirect to dashboard)
- Background top-ups or recharges
- Multi-step checkout flows (success handled by next step)
- When custom success UI is more appropriate

**When to show error dialogs:**
- User-initiated payments that need immediate retry
- When the user should be aware of the failure
- In development/testing for debugging

**When to hide error dialogs:**
- When implementing custom error handling UI
- Automated payment retries
- When logging errors for support team review
- Background payment processes

---

## Support

For API documentation and developer resources, visit:
- API Docs: `https://ypay.ytech-bf.com/api/docs`
- Support: `infos@ytech-bf.com`

---

## License

Copyright © 2024 YTECH. All rights reserved.