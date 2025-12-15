# YPAY Payment Gateway SDK

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/YOUR_USERNAME/ypay-sdk/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-orange.svg)](https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-full.min.js)

YPAY is a comprehensive payment gateway solution that provides both programmatic transaction handling and a complete UI interface for payment processing. The system supports multiple currencies (XOF, USD, NGN) and languages (English, French).

---

## 📦 Installation

### Via CDN (Recommended)

```html
<!-- Full Bundle (SDK + UI) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-ui.min.css">
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-full.min.js"></script>
```

#### Specific Components

```html
<!-- SDK Only -->
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-sdk.min.js"></script>

<!-- UI Only (requires SDK) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-ui.min.css">
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-sdk.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-ui.min.js"></script>
```

### Via NPM

```bash
npm install ypay_js
```

```javascript
// ES6 Modules
import YPAY from 'ypay-sdk';
import PaymentUI from 'ypay-sdk/src/ypay_ui/js/paymentUI.js';

// CommonJS
const { YPAY, Transaction } = require('ypay_js');
```

### Manual Download

Download the latest release from [GitHub Releases](https://github.com/YOUR_USERNAME/ypay-sdk/releases) and include the files in your project:

```html
<link rel="stylesheet" href="path/to/dist/ypay-ui.min.css">
<script src="path/to/dist/ypay-full.min.js"></script>
```

---

## 🚀 Quick Start

### Simple Payment Button

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-ui.min.css">
</head>
<body>
    <!-- Automatic payment button -->
    <button class="payment_btn btn_filled" data-amount="5000" data-modal="true">
        Pay 5000 XOF
    </button>

    <script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/ypay-sdk@1.0.0/dist/ypay-full.min.js"></script>
    <script>
        // Initialize PaymentUI
        const paymentUI = new PaymentUI(
            'YOUR_API_TOKEN',
            'XOF',
            'en',
            {
                onSuccess: (data) => alert('Payment successful!'),
                onFailure: (error) => alert('Payment failed!')
            },
            { onSuccess: true, onFailure: true },
            true,
            'My Shop'
        );
    </script>
</body>
</html>
```

### Programmatic Payment

```javascript
const paymentUI = new PaymentUI(
    'YOUR_API_TOKEN',
    'XOF',
    'en',
    {
        onSuccess: (data) => {
            console.log('Payment successful:', data);
            window.location.href = '/success';
        },
        onFailure: (error) => {
            console.error('Payment failed:', error);
        }
    },
    { onSuccess: true, onFailure: true },
    true,
    'My Shop',
    'https://example.com/logo.png'
);

paymentUI.amount = 10000;
paymentUI.modal = true;
paymentUI.renderForm();
```

---

## 📚 Documentation

The project documentation is divided into two main sections:

### [Payment UI Documentation](documentation/payment_ui.md)
Complete guide for integrating the payment user interface:
- UI Components
- Button Integration
- Modal & Tab Modes
- Styling & Customization
- Localization
- Configuration Options

### [YPAY SDK Documentation](documentation/ypay.md)
Core SDK for direct API integration:
- Transaction Management
- Validation
- Error Handling
- API Reference

---

## ✨ Features

- ✅ **Complete Payment UI** - Ready-to-use modal and tab interfaces
- ✅ **Multi-Currency Support** - XOF, USD, NGN
- ✅ **Multi-Language** - English and French
- ✅ **Responsive Design** - Works on all devices
- ✅ **Granular Dialog Control** - Show/hide success and error dialogs independently
- ✅ **Form Validation** - Built-in input validation
- ✅ **Singleton Pattern** - Single instance management
- ✅ **Event Callbacks** - Success and failure handlers
- ✅ **Verbose Logging** - Debug mode for development
- ✅ **CDN Ready** - Available via jsDelivr
- ✅ **Minified Bundles** - Optimized for production

---

## 🎨 Button Styles

YPAY provides multiple button styles out of the box:

```html
<!-- Default button -->
<button class="payment_btn" data-amount="5000" data-modal="true"></button>

<!-- Outlined variant -->
<button class="payment_btn btn_outlined" data-amount="5000" data-modal="true"></button>

<!-- Filled variant -->
<button class="payment_btn btn_filled" data-amount="5000" data-modal="true"></button>

<!-- Icon only -->
<button class="payment_btn btn_icon" data-amount="5000" data-modal="true"></button>

<!-- Custom text button -->
<button class="custom_payment_btn btn_filled" data-amount="5000" data-modal="true">
    Pay Now
</button>
```

---

## 🔧 Configuration

### PaymentUI Constructor

```javascript
new PaymentUI(token, currency, language, handlers, showDialogs, verbose, shopName, logo)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `token` | string | required | Your API authentication token |
| `currency` | string | `"XOF"` | Currency code (XOF, USD, NGN) |
| `language` | string | `"en"` | Interface language ("en" or "fr") |
| `handlers` | object | `{}` | Success/failure callbacks |
| `showDialogs` | boolean\|object | `true` | Control UI alert dialogs |
| `verbose` | boolean | `true` | Enable console logging |
| `shopName` | string | `"Unknown"` | Your shop name |
| `logo` | string | `""` | Logo image URL |

### Show Dialogs Configuration

**Boolean format (legacy):**
```javascript
showDialogs: true   // Show all dialogs
showDialogs: false  // Hide all dialogs
```

**Object format (recommended):**
```javascript
showDialogs: {
    onSuccess: true,   // Show success dialog
    onFailure: false   // Hide error dialog
}
```

---

## 📖 Usage Examples

### Example 1: E-commerce Checkout

```javascript
const payment = new PaymentUI(
    'YOUR_TOKEN',
    'XOF',
    'fr',
    {
        onSuccess: (data) => {
            // Redirect to order confirmation
            window.location.href = '/order-complete?id=' + data.transaction_id;
        },
        onFailure: (error) => {
            // Custom error handling
            showCustomErrorMessage(error);
        }
    },
    { onSuccess: false, onFailure: true }, // Silent success, show errors
    false, // No console logs in production
    'Mon E-Shop',
    '/assets/logo.png'
);

payment.amount = 15000;
payment.modal = true;
payment.renderForm();
```

### Example 2: Subscription Payment

```javascript
const payment = new PaymentUI(
    'YOUR_TOKEN',
    'XOF',
    'en',
    {
        onSuccess: (data) => {
            console.log('Subscription activated:', data);
            updateSubscriptionStatus('active');
        },
        onFailure: (error) => {
            console.error('Subscription failed:', error);
            showRetryOption();
        }
    },
    true, // Show all dialogs
    true, // Enable verbose logging
    'Premium Subscription'
);

payment.amount = 5000;
payment.modal = true;
payment.renderForm();
```

### Example 3: Direct SDK Usage (No UI)

```javascript
import YPAY from 'ypay-sdk';

const ypay = new YPAY('YOUR_TOKEN', 'XOF', 'My Shop');

await ypay.createTransaction(
    'ABCD-1234',  // Card code
    '123456',     // OTP
    10000,        // Amount
    'en',         // Language
    {
        onSuccess: (data) => console.log('Success:', data),
        onFailure: (error) => console.error('Error:', error)
    }
);
```

---

## 🌍 Supported Currencies

- **XOF** - West African CFA franc (F CFA)
- **USD** - United States Dollar
- **NGN** - Nigerian Naira

---

## 🗣️ Supported Languages

- **English** (`en`)
- **French** (`fr`)

---

## 🔒 Security Best Practices

1. **Never expose your API token** in client-side code for production
2. **Use environment variables** for sensitive data
3. **Implement server-side validation** for critical transactions
4. **Use HTTPS** for all payment pages
5. **Sanitize user inputs** before processing

---

## 🏗️ Project Structure

```
ypay-sdk/
├── src/                          # Source files
│   ├── sdk/                      # Core SDK
│   │   ├── enums.js
│   │   ├── patterns.js
│   │   ├── transaction.js
│   │   └── ypay.js
│   └── ypay_ui/                  # UI Components
│       ├── js/
│       ├── styles/
│       ├── templates/
│       └── assets/
├── dist/                         # Built files (CDN)
│   ├── ypay-sdk.min.js
│   ├── ypay-ui.min.js
│   ├── ypay-ui.min.css
│   └── ypay-full.min.js
└── documentation/                # Docs
    ├── payment_ui.md
    └── ypay.md
```

---

## 🛠️ Development

### Build from Source

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ypay-sdk.git
cd ypay-sdk

# Install dependencies
npm install

# Build all bundles
npm run build:all

# Version bump
npm version patch  # or minor/major
```

### Testing Locally

```bash
# Build the project
npm run build:all

# Open test file in browser
open test-local.html
```

---

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Support

- **Documentation**: [Full Documentation](documentation/)
- **API Docs**: https://ypay.ytech-bf.com/api/docs
- **Email**: infos@ytech-bf.com
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ypay-sdk/issues)

---

## 📝 License

Copyright © 2024 YTECH. All rights reserved.

See [LICENSE](LICENSE) file for details.

---

## 📦 Version History

### v1.0.0 (Current)
- Initial release
- Complete UI components
- Multi-currency support
- Multi-language support
- Granular dialog control
- CDN distribution
---