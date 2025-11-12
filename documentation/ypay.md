## Project Structure

```
project/
├── ypay/
│   ├── transaction.js                  # Core transaction logic
│   ├── ypay.js                         # Main YPAY configuration class
│   ├── patterns.js                     # Validation patterns
│   └── enums.js                        # Currency enumerations
```

---

## Importation
- **HTML/CSS/JS structure**

### Step 1: Include the main module
```html
<script type="module" src="path/to/ui/main.js"></script>
```

### Step 2: Add CSS styles
```html
<link rel="stylesheet" href="path/to/ui/styles/style.css">
```

- **Node.js style**

Coming soon

---

## Core Classes

### 1. YPAY Class
The main configuration class for initializing payment settings.

#### Constructor
```js
import YPAY from "path/to/sdk/sdk.js";
import { Currency } from "path/to/sdk/enums.js";

const ypay = new YPAY(token, currency, shopName);
```

**Parameters:**
- `token` (string): Your API authentication token (format: `number|48-char-alphanumeric`)
- `currency` (string): Currency code (USD, NGN, or XOF). Default: `Currency.XOF`
- `shopName` (string): Your shop name. Default: `"Undefined"`

#### Methods

**createTransaction(card_code, otp, amount, language, handlers)**:
Creates and executes a transaction.

```js
await ypay.createTransaction(
    "ABCD-1234",     // card_code
    "5678",          // otp
    1000,            // amount
    "en",            // language
    {
        onSuccess: (data) => console.log("Success:", data),
        onFailure: (error) => console.error("Error:", error)
    }
);
```

**Parameters:**
- `card_code` (string): Sender's card code (format: `XXXX-XXXX`)
- `otp` (string): 4-digit OTP code
- `amount` (number): Transaction amount (must be positive)
- `language` (string): "en" or "fr"
- `handlers` (object): Success and failure callbacks

---

### 2. Transaction Class
Low-level transaction handling class.

#### Constructor
```js
import Transaction from "./sdk/transaction.js";

const transaction = new Transaction(token, sender, otp, amount, language, handlers);
```

**Parameters:**
- `token` (string): Receiver's token
- `sender` (string): Sender's card code
- `otp` (string): Payment code
- `amount` (number): Transaction amount
- `language` (string): "en" or "fr". Default: "en"
- `handlers` (object): Optional callbacks

#### Methods

**isValid()**:
Checks if the transaction parameters are valid.
```js
if (!transaction.isValid()) 
{
    console.error(transaction.getValidationErrors());
}
```

**getValidationErrors()**:
Returns validation error messages or null.

**exec()**:
Executes the transaction. Returns a Promise.
```js
try 
{
    const data = await transaction.exec();
    console.log("Success:", data);
}
catch (error)
{
    console.error("Error:", error.message);
}
```