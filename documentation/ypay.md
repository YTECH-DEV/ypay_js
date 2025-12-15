# YPAY SDK - Core API Documentation

## Installation

### Via CDN

```html
<!-- SDK Only (for direct API usage) -->
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-sdk.min.js"></script>
```

### Via NPM

```bash
npm install ypay-sdk
```

```javascript
// ES6 Modules
import YPAY from 'ypay-sdk';
import { Currency } from 'ypay-sdk/src/sdk/enums.js';
import Transaction from 'ypay-sdk/src/sdk/transaction.js';

// CommonJS
const { YPAY, Transaction, Currency } = require('ypay-sdk');
```

### Manual Import (HTML/CSS/JS)

```html
<script type="module">
    import YPAY from "./src/sdk/ypay.js";
    import { Currency } from "./src/sdk/enums.js";
    
    // Your code here
</script>
```

---

## Project Structure

```
ypay-sdk/
├── src/
│   └── sdk/
│       ├── transaction.js              # Core transaction logic
│       ├── ypay.js                     # Main YPAY configuration class
│       ├── patterns.js                 # Validation patterns
│       └── enums.js                    # Currency enumerations
└── dist/
    └── ypay-sdk.min.js                 # Minified bundle (CDN)
```

---

## Core Classes

### 1. YPAY Class
The main configuration class for initializing payment settings.

#### Constructor

**Via CDN:**
```javascript
const ypay = new YPAY(token, currency, shopName);
```

**Via Module Import:**
```javascript
import YPAY from "ypay-sdk";
import { Currency } from "ypay-sdk/src/sdk/enums.js";

const ypay = new YPAY(token, Currency.XOF, shopName);
```

**Parameters:**
- `token` (string): Your API authentication token (format: `number|48-char-alphanumeric`)
- `currency` (string): Currency code (USD, NGN, or XOF). Default: `Currency.XOF` or `"F CFA"`
- `shopName` (string): Your shop name. Default: `"Undefined"`

**Example:**
```javascript
const ypay = new YPAY(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "Tech Store"
);
```

#### Methods

**createTransaction(card_code, otp, amount, language, handlers)**

Creates and executes a transaction.

```javascript
await ypay.createTransaction(
    "ABCD-1234",     // card_code (format: XXXX-XXXX)
    "123456",        // otp (6-digit code)
    1000,            // amount (positive number)
    "en",            // language ("en" or "fr")
    {
        onSuccess: (data) => console.log("Success:", data),
        onFailure: (error) => console.error("Error:", error)
    }
);
```

**Parameters:**
- `card_code` (string): Sender's card code (format: `XXXX-XXXX`)
- `otp` (string): 6-digit OTP code
- `amount` (number): Transaction amount (must be positive)
- `language` (string): "en" or "fr"
- `handlers` (object): Optional callbacks
    - `onSuccess(data)`: Called on successful transaction
    - `onFailure(error)`: Called on failed transaction

**Returns:** Promise that resolves with transaction data

**Complete Example:**
```javascript
const ypay = new YPAY(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "XOF",
    "My Shop"
);

try {
    const result = await ypay.createTransaction(
        "SDSP-NDOR",
        "123456",
        5000,
        "fr",
        {
            onSuccess: (data) => {
                console.log("Transaction réussie:", data);
                // Update UI, redirect, etc.
            },
            onFailure: (error) => {
                console.error("Échec de la transaction:", error);
                // Show error message to user
            }
        }
    );
    
    console.log("Transaction completed:", result);
} catch (error) {
    console.error("Transaction error:", error.message);
}
```

---

### 2. Transaction Class
Low-level transaction handling class for more control.

#### Constructor

**Via CDN:**
```javascript
const transaction = new YPAYTransaction(token, sender, otp, amount, language, handlers);
```

**Via Module Import:**
```javascript
import Transaction from "ypay-sdk/src/sdk/transaction.js";

const transaction = new Transaction(token, sender, otp, amount, language, handlers);
```

**Parameters:**
- `token` (string): Receiver's API token
- `sender` (string): Sender's card code (format: `XXXX-XXXX`)
- `otp` (string): 6-digit payment code
- `amount` (number): Transaction amount
- `language` (string): "en" or "fr". Default: "en"
- `handlers` (object): Optional callbacks
    - `onSuccess(data)`: Success callback
    - `onFailure(error)`: Failure callback

**Example:**
```javascript
const transaction = new Transaction(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "ABCD-1234",
    "123456",
    10000,
    "en",
    {
        onSuccess: (data) => console.log("Success:", data),
        onFailure: (error) => console.error("Error:", error)
    }
);
```

#### Methods

**isValid()**

Checks if the transaction parameters are valid.

```javascript
if (!transaction.isValid()) {
    console.error("Validation failed:", transaction.getValidationErrors());
}
```

**Returns:** `boolean` - `true` if valid, `false` otherwise

**getValidationErrors()**

Returns validation error messages.

```javascript
const errors = transaction.getValidationErrors();
if (errors) {
    console.error("Validation errors:", errors);
    // Errors format: "Error 1\nError 2\nError 3"
}
```

**Returns:** `string | null` - Error messages separated by newlines, or `null` if valid

**exec()**

Executes the transaction.

```javascript
try {
    const data = await transaction.exec();
    console.log("Transaction successful:", data);
} catch (error) {
    console.error("Transaction failed:", error.message);
}
```

**Returns:** `Promise<object>` - Resolves with transaction data, rejects with error

**Complete Transaction Example:**
```javascript
const transaction = new Transaction(
    "367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900",
    "SDSP-NDOR",
    "123456",
    3000,
    "en"
);

// Validate before executing
if (!transaction.isValid()) {
    const errors = transaction.getValidationErrors();
    console.error("Validation failed:", errors);
    alert("Please check your payment details:\n" + errors);
} else {
    try {
        const result = await transaction.exec();
        console.log("Payment successful:", result);
        // Handle success
    } catch (error) {
        console.error("Payment failed:", error.message);
        // Handle failure
    }
}
```

---

## Validation Patterns

### Available Patterns

**Via CDN:**
```javascript
// Patterns are available as globals after loading ypay-sdk.min.js
// Access via window.cardPattern, etc. (not directly exposed)
```

**Via Module Import:**
```javascript
import { cardPattern, paymentCodePattern, tokenPattern } from "ypay-sdk/src/sdk/patterns.js";

console.log(cardPattern);        // /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/
console.log(paymentCodePattern); // /^[0-9]{6}$/
console.log(tokenPattern);       // /^[0-9]{1,}\|[A-Za-z0-9]{48}$/
```

### Pattern Details

| Pattern | Regex | Example | Description |
|---------|-------|---------|-------------|
| `cardPattern` | `/^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/` | `ABCD-1234` | Card code format |
| `paymentCodePattern` | `/^[0-9]{6}$/` | `123456` | 6-digit OTP code |
| `tokenPattern` | `/^[0-9]{1,}\|[A-Za-z0-9]{48}$/` | `367\|53Rs...` | API token format |

### Manual Validation Example

```javascript
import { cardPattern, paymentCodePattern } from "ypay-sdk/src/sdk/patterns.js";

function validatePaymentData(cardCode, otp) {
    const errors = [];
    
    if (!cardPattern.test(cardCode)) {
        errors.push("Invalid card code format. Expected: XXXX-XXXX");
    }
    
    if (!paymentCodePattern.test(otp)) {
        errors.push("Invalid OTP format. Expected: 6 digits");
    }
    
    return errors;
}

const errors = validatePaymentData("ABCD-1234", "123456");
if (errors.length > 0) {
    console.error("Validation errors:", errors.join("\n"));
}
```

---

## Currency Enum

### Usage

**Via CDN:**
```javascript
// Access via global YPAYCurrency
console.log(YPAYCurrency.XOF);  // "F CFA"
console.log(YPAYCurrency.USD);  // "USD"
console.log(YPAYCurrency.NGN);  // "NGN"
```

**Via Module Import:**
```javascript
import { Currency } from "ypay-sdk/src/sdk/enums.js";

console.log(Currency.XOF);  // "F CFA"
console.log(Currency.USD);  // "USD"
console.log(Currency.NGN);  // "NGN"

// Validate currency
Currency.isValid("USD");  // true
Currency.isValid("EUR");  // false
```

### Available Currencies

| Constant | Value | Name |
|----------|-------|------|
| `Currency.XOF` | `"F CFA"` | West African CFA franc |
| `Currency.USD` | `"USD"` | United States Dollar |
| `Currency.NGN` | `"NGN"` | Nigerian Naira |

### Currency Validation

```javascript
import { Currency } from "ypay-sdk/src/sdk/enums.js";

function validateCurrency(currency) {
    if (!Currency.isValid(currency)) {
        throw new Error(`Unsupported currency: ${currency}`);
    }
    return true;
}

try {
    validateCurrency("XOF");  // OK
    validateCurrency("EUR");  // Throws error
} catch (error) {
    console.error(error.message);
}
```

---

## Error Handling

### Validation Errors

```javascript
const transaction = new Transaction(token, card_code, otp, amount);

if (!transaction.isValid()) {
    const errors = transaction.getValidationErrors();
    // Errors format: "Error 1\nError 2\nError 3"
    console.error("Validation errors:", errors);
}
```

### Common Validation Errors

- `"Sender card is required."`
- `"Sender card format is invalid."`
- `"token is required."`
- `"token card format is invalid."`
- `"Payment code is required."`
- `"Payment code format is invalid."`
- `"Amount must be a positive number."`
- `"Language is invalid."`

### API Errors

```javascript
try {
    await transaction.exec();
} catch (error) {
    // Error format: "STATUS_CODE\nError message"
    console.error("API error:", error.message);
    
    // Parse status code
    const [statusCode, errorMessage] = error.message.split('\n');
    console.log("Status:", statusCode);
    console.log("Message:", errorMessage);
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200-299 | Success | Transaction completed successfully |
| 400 | Bad Request | Validation failed or invalid parameters |
| 401 | Unauthorized | Invalid or expired API token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Complete Examples

### Example 1: Simple Payment

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Payment</title>
</head>
<body>
    <h1>Make a Payment</h1>
    <button id="payBtn">Pay 5000 XOF</button>
    
    <script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-sdk.min.js"></script>
    <script>
        const ypay = new YPAY(
            '367|53RsuHJS2A4qB693ISdUlDtfVIGsPT29tGOvB6jKf9a6b900',
            'XOF',
            'My Shop'
        );
        
        document.getElementById('payBtn').addEventListener('click', async () => {
            try {
                const result = await ypay.createTransaction(
                    'ABCD-1234',
                    '123456',
                    5000,
                    'en',
                    {
                        onSuccess: (data) => alert('Payment successful!'),
                        onFailure: (error) => alert('Payment failed!')
                    }
                );
                console.log('Transaction result:', result);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>
```

### Example 2: Form with Validation

```html
<!DOCTYPE html>
<html>
<body>
    <form id="paymentForm">
        <input type="text" id="cardCode" placeholder="XXXX-XXXX" required>
        <input type="text" id="otp" placeholder="123456" maxlength="6" required>
        <input type="number" id="amount" placeholder="Amount" required>
        <button type="submit">Pay Now</button>
    </form>
    
    <script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-sdk.min.js"></script>
    <script>
        const ypay = new YPAY('YOUR_TOKEN', 'XOF', 'My Shop');
        
        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const cardCode = document.getElementById('cardCode').value;
            const otp = document.getElementById('otp').value;
            const amount = parseFloat(document.getElementById('amount').value);
            
            // Create transaction for validation
            const transaction = new YPAYTransaction(
                'YOUR_TOKEN',
                cardCode,
                otp,
                amount,
                'en'
            );
            
            // Validate before processing
            if (!transaction.isValid()) {
                alert('Validation failed:\n' + transaction.getValidationErrors());
                return;
            }
            
            // Execute transaction
            try {
                await transaction.exec();
                alert('Payment successful!');
            } catch (error) {
                alert('Payment failed: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

---

## Best Practices

1. **Always validate** transaction data before executing
2. **Handle errors gracefully** with try-catch blocks
3. **Use environment variables** for API tokens (never hardcode in production)
4. **Implement logging** for debugging and monitoring
5. **Sanitize user inputs** before creating transactions
6. **Use HTTPS** for all payment pages
7. **Test thoroughly** in development before production deployment

---

## Support

- **Email**: infos@ytech-bf.com
- **API Docs**: https://ypay.ytech-bf.com/api/docs
- **GitHub**: https://github.com/YOUR_USERNAME/ypay-sdk

---

## License

Copyright © 2024 YTECH. All rights reserved.