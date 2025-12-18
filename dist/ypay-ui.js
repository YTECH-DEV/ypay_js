(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PaymentUI = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Currency = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Currency = exports.Currency = /*#__PURE__*/function () {
  function Currency() {
    _classCallCheck(this, Currency);
  }
  return _createClass(Currency, null, [{
    key: "isValid",
    value: function isValid(currency) {
      return Object.values(this).includes(currency.toUpperCase());
    }
  }]);
}();
_defineProperty(Currency, "USD", "USD");
_defineProperty(Currency, "NGN", "NGN");
_defineProperty(Currency, "XOF", "F CFA");

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenPattern = exports.paymentCodePattern = exports.cardPattern = void 0;
var cardPattern = exports.cardPattern = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
var paymentCodePattern = exports.paymentCodePattern = /^[0-9]{6}$/;
var tokenPattern = exports.tokenPattern = /^[0-9]{1,}\|[A-Za-z0-9]{48}$/;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _patterns = require("./patterns.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Transaction = /*#__PURE__*/function () {
  function Transaction() {
    var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var sender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var otp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var amount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var language = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "en";
    var handlers = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    _classCallCheck(this, Transaction);
    this.sender = this.sanitizeData(sender);
    this.token = this.sanitizeData(token);
    this.otp = otp;
    this.amount = parseFloat(amount.toString());
    this.language = language;
    this.paymentHandlers = {
      onSuccess: handlers.onSuccess || function () {},
      onFailure: handlers.onFailure || function () {}
    };

    // Validate during construction
    var validationError = this._validate();
    if (validationError) {
      this.validationError = validationError;
    }
  }
  return _createClass(Transaction, [{
    key: "_validate",
    value: function _validate() {
      var errors = [];
      if (!this.sender) {
        errors.push("Sender card is required.");
      } else if (!_patterns.cardPattern.test(this.sender)) {
        errors.push("Sender card format is invalid.");
      }
      if (!this.token) {
        errors.push("token is required.");
      } else if (!_patterns.tokenPattern.test(this.token)) {
        errors.push("token card format is invalid.");
      }
      if (!this.otp) {
        errors.push("Payment code is required.");
      } else if (!_patterns.paymentCodePattern.test(this.otp)) {
        errors.push("Payment code format is invalid.");
      }
      if (isNaN(this.amount) || this.amount <= 0) {
        errors.push("Amount must be a positive number.");
      }
      if (!["en", "fr"].includes(this.language.toString().toLowerCase())) {
        errors.push("Language is invalid.");
      }
      return errors.length > 0 ? new Error(errors.join("\n")) : null;
    }
  }, {
    key: "exec",
    value: function () {
      var _exec = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var paymentResponse, data, errorData, errorMessage, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.validationError) {
                _context.n = 1;
                break;
              }
              this.paymentHandlers.onFailure(this.validationError);
              throw this.validationError;
            case 1:
              _context.p = 1;
              _context.n = 2;
              return fetch("https://ypay.ytech-bf.com/api/v1/project/make-payment", {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer ".concat(this.token),
                  "accept-language": this.language
                },
                body: JSON.stringify({
                  card_code: this.sender,
                  amount: this.amount,
                  payment_code: this.otp
                })
              });
            case 2:
              paymentResponse = _context.v;
              if (!paymentResponse.ok) {
                _context.n = 4;
                break;
              }
              _context.n = 3;
              return paymentResponse.json();
            case 3:
              data = _context.v;
              this.paymentHandlers.onSuccess(data);
              return _context.a(2, data);
            case 4:
              _context.n = 5;
              return paymentResponse.json()["catch"](function () {
                return {};
              });
            case 5:
              errorData = _context.v;
              errorMessage = errorData.message || paymentResponse.statusText || "Payment failed";
              throw new Error("".concat(paymentResponse.status, "\n").concat(errorMessage));
            case 6:
              _context.p = 6;
              _t = _context.v;
              this.paymentHandlers.onFailure(_t);
              throw _t;
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[1, 6]]);
      }));
      function exec() {
        return _exec.apply(this, arguments);
      }
      return exec;
    }() // Validation checker
  }, {
    key: "isValid",
    value: function isValid() {
      return !this.validationError;
    }

    // Get validation errors without throwing
  }, {
    key: "getValidationErrors",
    value: function getValidationErrors() {
      return this.validationError ? this.validationError.message : null;
    }

    // Sanitizes data passed to the constructor
  }, {
    key: "sanitizeData",
    value: function sanitizeData() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      if (data === "" || data === null || data === undefined) {
        return "";
      }
      data = String(data);

      // Remove null bytes
      data = data.replace(/\\0/g, '');

      // Trim whitespace
      data = data.trim();

      // Strip HTML tags
      data = data.replace(/<[^>]*>/g, '');
      return data;
    }
  }]);
}();
var _default = exports["default"] = Transaction;

},{"./patterns.js":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _transaction = _interopRequireDefault(require("./transaction.js"));
var _enums = require("./enums.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ----- ONE TIME CONFIGURATIONS FOR YPAY PAYMENTS
var YPAY = /*#__PURE__*/function () {
  // one-time initialization
  function YPAY(token, currency, shopName) {
    _classCallCheck(this, YPAY);
    this.token = token;
    this.currency = currency || _enums.Currency.XOF;
    this.shopName = shopName || "Undefined";

    // Validate during construction
    var validationError = this._validate();
    if (validationError) {
      this.validationError = validationError;
    }

    // singleton instance-like
    if (YPAY.instance) {
      return YPAY.instance;
    }
    YPAY.instance = this;
  }

  // create a transaction and execute it
  return _createClass(YPAY, [{
    key: "createTransaction",
    value: function createTransaction(card_code, otp, amount, language) {
      var handlers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return new _transaction["default"](this.token, card_code, otp, amount, language, handlers).exec();
    }
  }, {
    key: "_validate",
    value: function _validate() {
      var errors = [];

      // checks currency
      if (!_enums.Currency.isValid(this.currency)) {
        errors.push(this.currency + " is not supported yet");
      }
      return errors.length > 0 ? new Error(errors.join("\n")) : null;
    }
  }], [{
    key: "resetInstance",
    value: function resetInstance() {
      YPAY.instance = null;
    }
  }]);
}();
var _default = exports["default"] = YPAY;

},{"./enums.js":1,"./transaction.js":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var alertController = function alertController() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "success";
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var alertBox = target.querySelector(".alert");
  var title = alertBox.getElementsByTagName("h2")[0];
  var messageTag = alertBox.getElementsByTagName("p")[0];
  title.innerHTML = type[0].toUpperCase() + type.substring(1, type.length);
  messageTag.innerHTML = message;
  if (type === "failure") {
    alertBox.classList.add("alert-failure");
    alertBox.classList.remove("alert-success");
  }
};
var _default = exports["default"] = alertController;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _patterns = require("../../sdk/patterns.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var primary_color = "#6047FF";
var error_color = "#FF0000";
var disabled = "#E5E7EB";

// Main initialization function
var initFormController = function initFormController() {
  var targetDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  // ============ DOM ELEMENT SELECTION ==========
  var form = targetDocument.querySelector("form");
  var app_button = targetDocument.querySelector("#app_button");
  var card_code = targetDocument.querySelector("#card_code");
  var card_number_icon = targetDocument.querySelector(".card_icon");
  var error_message_card_number = targetDocument.querySelector('.error_message');
  var otp_inputs = _toConsumableArray(targetDocument.querySelectorAll(".otp_input_item"));
  var submit = targetDocument.querySelector(".submit_button");

  // hides the error message by default
  error_message_card_number.style.display = 'none';

  // Check if elements exist
  if (!form || !card_code || !submit || otp_inputs.length === 0) {
    console.error("Form elements not found");
    return;
  }

  // ======== METHODS =======
  // Submit button state
  var submitState = function submitState(isFormValid) {
    if (isFormValid) {
      submit.disabled = false;
      submit.style.backgroundColor = primary_color;
      submit.style.cursor = "pointer";
    } else {
      submit.disabled = true;
      submit.style.backgroundColor = disabled;
      submit.style.cursor = "not-allowed";
    }
  };

  // Card number validations
  var cardNumberValidation = function cardNumberValidation() {
    // Regex validation
    if (_patterns.cardPattern.test(card_code.value.toString())) {
      card_code.style.outlineColor = primary_color;
      if (card_number_icon) {
        card_number_icon.style.color = primary_color;
      }
      card_code.style.border = "1px solid ".concat(primary_color);
      if (error_message_card_number) {
        error_message_card_number.style.display = 'none';
      }
      validateOTP();
      if (card_number_icon) {
        card_number_icon.style.top = "50%";
      }
    } else {
      card_code.style.outlineColor = error_color;
      if (card_number_icon) {
        card_number_icon.style.color = error_color;
      }
      card_code.style.border = "1px solid ".concat(error_color);
      if (!targetDocument.querySelector('.error_message')) {
        var _error_message_card_number = targetDocument.createElement("span");
        _error_message_card_number.className = "error_message";
      }
      error_message_card_number.style.color = error_color;
      error_message_card_number.style.fontSize = "11px";
      error_message_card_number.style.fontStyle = "italic";
      error_message_card_number.style.marginTop = "4px";
      error_message_card_number.style.display = "block";
      if (card_number_icon) {
        card_number_icon.style.top = "35%";
      }
      card_code.parentNode.appendChild(error_message_card_number);
      submitState(false);
    }
  };

  // OTP validation
  var validateOTP = function validateOTP() {
    var allFilled = otp_inputs.every(function (input) {
      return input.value.length === 1;
    });
    otp_inputs.forEach(function (input) {
      if (allFilled) {
        input.style.borderColor = primary_color;
        input.style.outlineColor = primary_color;
      } else if (input.value === '') {
        input.style.borderColor = '';
      }
    });
    var isCardValid = _patterns.cardPattern.test(card_code.value);
    submitState(isCardValid && allFilled);
  };

  // ======== OTP INPUT HANDLERS =======
  var handleKeyDown = function handleKeyDown(e) {
    if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      var index = otp_inputs.indexOf(e.target);
      if (index >= 0) {
        otp_inputs[index].value = '';
        if (index > 0) {
          otp_inputs[index - 1].focus();
        }
      }
      validateOTP();
      e.preventDefault();
    }
  };
  var handleInput = function handleInput(e) {
    var target = e.target;
    var index = otp_inputs.indexOf(target);
    if (target.value) {
      if (index < otp_inputs.length - 1) {
        otp_inputs[index + 1].focus();
      } else {
        submit.focus();
      }
    }
    validateOTP();
  };
  var handleFocus = function handleFocus(e) {
    e.target.select();
  };
  var handlePaste = function handlePaste(e) {
    e.preventDefault();
    var text = e.clipboardData.getData('text');
    if (!new RegExp("^[0-9]{".concat(otp_inputs.length, "}$")).test(text)) {
      return;
    }
    var digits = text.split('');
    otp_inputs.forEach(function (input, index) {
      return input.value = digits[index];
    });
    validateOTP();
    submit.focus();
  };

  // ======== LISTENERS =======
  // Card number listener
  card_code.addEventListener("input", function (e) {
    var value = card_code.value.toString().replace(/-/g, '');

    // Add hyphen after the first 4 characters
    if (value.length > 4) {
      value = value.slice(0, 4) + '-' + value.slice(4);
    }

    // Limit to 9 characters (XXXX-XXXX)
    card_code.value = value.slice(0, 9);
    cardNumberValidation();
  });

  // OTP input listeners
  otp_inputs.forEach(function (input) {
    input.addEventListener('paste', handlePaste);
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeyDown);
    input.addEventListener('focus', handleFocus);
  });
  app_button.addEventListener("click", function (e) {
    e.preventDefault();
    window.open("https://ypay.ytech-bf.com/");
  });

  // Initialize
  submit.disabled = true;
  submitState(false);
};

// Export for module usage
var _default = exports["default"] = initFormController;

},{"../../sdk/patterns.js":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Localization = /*#__PURE__*/function () {
  function Localization() {
    _classCallCheck(this, Localization);
    this.current = "en";
    this.languages = {
      en: "en",
      fr: "fr"
    };
    this.translations = {
      en: {
        card_label: "Card number",
        card_placeholder: "Enter your card number",
        otp_label: "Enter OTP",
        message: 'In order to continue the payment process, you must first log in from the <a href="#">YPAY</a> application, then generate a payment OTP with a value of ',
        no_app: "I do not have the app yet.",
        download: "Download the App",
        submit_button_processing: "Processing...",
        submit_button: "Submit",
        error_message: "Enter XXXX-XXXX with letters/digits only.",
        secured_payment: "Encrypted and Secured Payment",
        successful_transaction: "Your transaction was successfully processed!",
        failure_transaction: "Your transaction has not been processed!"
      },
      fr: {
        card_label: "Numéro de carte",
        card_placeholder: "Entrez votre numéro de carte",
        otp_label: "Entrez le code OTP",
        message: 'Pour continuer le processus de paiement, vous devez d\'abord vous connecter depuis l\'application <a href="#">YPAY</a>, puis generer un OTP de paiement d\'une valeur de ',
        download: "Télécharger l'application",
        submit_button_processing: "Traitement en cours...",
        submit_button: "Valider",
        no_app: "Je n'ai pas l'application",
        error_message: "Format XXXX-XXXX avec lettres et chiffres uniquement.",
        secured_payment: "Paiement crypté et sécurisé",
        successful_transaction: "Votre transaction a été traitée avec succès!",
        failure_transaction: "Votre transaction n'a pas pu être traitée!"
      }
    };
  }
  return _createClass(Localization, [{
    key: "isValid",
    value: function isValid(lang) {
      return Object.values(this.languages).includes(lang.toLowerCase());
    }
  }, {
    key: "setLang",
    value: function setLang(lang) {
      switch (lang) {
        case this.languages.en:
          this.current = "en";
          break;
        case this.languages.fr:
          this.current = "fr";
          break;
        default:
          this.current = "en";
      }
    }
  }, {
    key: "tag",
    value: function tag(key) {
      return this.translations[this.current][key] || key;
    }
  }]);
}();
var _default = exports["default"] = Localization;

},{}],8:[function(require,module,exports){
"use strict";

/*
import PaymentUI from "./paymentUI.js";
import buttonController from "./paymentTriggerButtons.js";
import alertController from "./alert_controller";
import initFormController from "./init_form_controller";
import Localization from "./localization";

buttonController();

export default PaymentUI;

 */

// main.js - Convert to CommonJS
var PaymentUI = require("./paymentUI.js")["default"];
var buttonController = require("./paymentTriggerButtons.js")["default"];
var alertController = require("./alert_controller")["default"];
var initFormController = require("./init_form_controller")["default"];
var Localization = require("./localization")["default"];
buttonController();

// Also expose to global if you want
if (typeof window !== 'undefined') {
  window.PaymentUI = PaymentUI;
  window.YPAY = PaymentUI; // Optional
}
module.exports = PaymentUI;

},{"./alert_controller":5,"./init_form_controller":6,"./localization":7,"./paymentTriggerButtons.js":9,"./paymentUI.js":10}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _paymentUI = _interopRequireDefault(require("./paymentUI.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var paymentTriggerButtons = function paymentTriggerButtons() {
  // get all matching buttons
  var paymentUIButtons = document.querySelectorAll(".payment_btn, .custom_payment_btn");
  paymentUIButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var amount = btn.dataset.amount || 0; // gets the amount attached to the button
      var modal = btn.dataset.modal || false; // get the type of form to display

      // retrieves the payment ypay_ui singleton
      var paymentUIInstance = _paymentUI["default"].instance;
      // affects the buttons parameters to the payment instance
      paymentUIInstance.amount = parseFloat(amount);
      paymentUIInstance.modal = modal;
      paymentUIInstance.renderForm();
    });
  });
};
var _default = exports["default"] = paymentTriggerButtons;

},{"./paymentUI.js":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ypay = _interopRequireDefault(require("../../sdk/ypay.js"));
var _localization = _interopRequireDefault(require("./localization.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PaymentUI = /*#__PURE__*/function () {
  function PaymentUI(token, currency, language) {
    var handlers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var showDialogs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var verbose = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    var shopName = arguments.length > 6 ? arguments[6] : undefined;
    var logo = arguments.length > 7 ? arguments[7] : undefined;
    _classCallCheck(this, PaymentUI);
    if (PaymentUI.instance) {
      return PaymentUI.instance;
    }
    this.logo = logo || '';
    this.language = language || 'en';
    this.shopName = shopName || 'Unknown';
    this.currency = currency || 'XOF';
    this.token = token;
    this.modal = false;
    this.verbose = verbose;

    // Transform showDialogs to object format
    this.showDialogs = this._normalizeShowDialogs(showDialogs);
    this.handlers = handlers || {
      onSuccess: function onSuccess(data) {},
      onFailure: function onFailure(data) {}
    };
    this.overlayElement = null;
    this.newWindowRef = null;
    this.alert = null;
    this.amount = 0;

    // Set language
    this.localization = new _localization["default"]();
    this.localization.setLang(this.language);

    // Validate
    this._validate();
    this.ypay = new _ypay["default"](token, currency, shopName);
    PaymentUI.instance = this;
    return this;
  }
  return _createClass(PaymentUI, [{
    key: "_normalizeShowDialogs",
    value: function _normalizeShowDialogs(showDialogs) {
      // Support both boolean (legacy) and object formats
      if (typeof showDialogs === 'boolean') {
        return {
          onSuccess: showDialogs,
          onFailure: showDialogs
        };
      } else if (_typeof(showDialogs) === 'object' && showDialogs !== null) {
        return {
          onSuccess: showDialogs.onSuccess !== undefined ? showDialogs.onSuccess : true,
          onFailure: showDialogs.onFailure !== undefined ? showDialogs.onFailure : true
        };
      } else {
        // Default to showing both
        return {
          onSuccess: true,
          onFailure: true
        };
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return "PaymentUI \n        {\n          shopName: \"".concat(this.shopName, "\",\n          currency: \"").concat(this.currency, "\",\n          language: \"").concat(this.language, "\",\n          token: \"").concat(this.token ? this.token.substring(0, 8) + '...' : 'none', "\",\n          amount: ").concat(this.amount, ",\n          modal: ").concat(this.modal, ",\n          showDialogs: { onSuccess: ").concat(this.showDialogs.onSuccess, ", onFailure: ").concat(this.showDialogs.onFailure, " },\n          verbose: ").concat(this.verbose, ",\n          hasLogo: ").concat(!!this.logo, ",\n          handlers: ").concat(Object.keys(this.handlers).join(', '), "\n        }");
    }
  }, {
    key: "_validate",
    value: function _validate() {
      var errors = [];
      if (this.language && !this.localization.isValid(this.language)) {
        errors.push('Language is not available');
      }
      if (this.token === "") {
        errors.push('Token is required');
      }
      if (errors.length > 0) {
        this.showLogs('Validation errors:', errors.join('\n'));
        throw new Error(errors.join('\n'));
      }
    }
  }, {
    key: "_getTargetDocument",
    value: function _getTargetDocument() {
      if (this.overlayElement) {
        return document;
      }
      if (this.newWindowRef && !this.newWindowRef.closed) {
        try {
          if (this.newWindowRef.document) {
            return this.newWindowRef.document;
          }
        } catch (error) {
          this.showLogs('Cannot access popup window document:', error.message);
        }
      }
      return document;
    }
  }, {
    key: "closePaymentUI",
    value: function closePaymentUI() {
      this.showLogs('Closing payment UI');
      if (this.overlayElement) {
        this.overlayElement.remove();
        this.overlayElement = null;
      }
      if (this.newWindowRef && !this.newWindowRef.closed) {
        this.newWindowRef.close();
        this.newWindowRef = null;
      }
    }
  }, {
    key: "customAlertController",
    value: function customAlertController(targetDocument, type, message) {
      var _this = this;
      Promise.resolve().then(function () {
        return _interopRequireWildcard(require('./alert_controller.js'));
      }).then(function (module) {
        if (module["default"] && typeof module["default"] === 'function') {
          module["default"](targetDocument, type, message);
        }
      })["catch"](function (err) {
        _this.showLogs('Alert controller not available:', err);
      });
    }
  }, {
    key: "customAlert",
    value: function customAlert(type, message) {
      var _this2 = this;
      // Check if we should show dialog based on type
      var shouldShow = type === 'success' ? this.showDialogs.onSuccess : this.showDialogs.onFailure;
      if (!shouldShow) {
        this.showLogs("Alert (".concat(type, "):"), message);
        return;
      }
      fetch("./ypay_ui/templates/custom_alert.html").then(function (response) {
        return response.text();
      }).then(function (template) {
        var overlay = document.createElement('div');
        overlay.className = 'alert-overlay';
        overlay.innerHTML = _this2.renderTemplate(template);
        _this2.alert = overlay;
        document.body.appendChild(_this2.alert);
        _this2.customAlertController(document, type, message);
        var alertBox = _this2.alert.querySelector(".alert");
        var closingButton = alertBox.querySelector(".close");
        var okButton = alertBox.getElementsByTagName("button")[0];
        var close = function close() {
          if (_this2.alert && _this2.alert.parentNode) {
            _this2.alert.parentNode.removeChild(_this2.alert);
            _this2.alert = null;
          }
          var submit_btn = _this2._getTargetDocument().getElementsByClassName("submit_button")[0];
          if (submit_btn) {
            submit_btn.innerHTML = _this2.localization.tag("submit_button");
            submit_btn.disabled = false;
          }
        };
        closingButton.addEventListener("click", close);
        okButton.addEventListener("click", close);
      })["catch"](function (err) {
        _this2.showLogs('Failed to load alert template:', err);
      });
    }
  }, {
    key: "formatAmount",
    value: function formatAmount() {
      return this.language === 'fr' ? "".concat(this.amount, " ").concat(this.currency) : "".concat(this.currency, " ").concat(this.amount);
    }
  }, {
    key: "showModal",
    value: function showModal() {
      var _this3 = this;
      this.showLogs('Opening payment modal');
      fetch('./ypay_ui/templates/payment_form.html').then(function (response) {
        return response.text();
      }).then(function (template) {
        var overlay = document.createElement('div');
        overlay.className = 'modal_overlay';
        overlay.innerHTML = _this3.renderTemplate(template);
        _this3.overlayElement = overlay;
        document.body.appendChild(overlay);
        setTimeout(function () {
          var closeBtn = document.querySelector('.close_modal');
          if (closeBtn) {
            closeBtn.addEventListener('click', function () {
              _this3.closePaymentUI();
            });
          }
          var overlay = document.querySelector('.modal_overlay');
          if (overlay) {
            document.addEventListener('keydown', function (e) {
              if (e.key === 'Escape') {
                _this3.closePaymentUI();
              }
            });
          }
          _this3.initializeFormController(document);
        }, 0);
      })["catch"](function (err) {
        _this3.showLogs('Failed to load template:', err);
      });
    }
  }, {
    key: "openNewTab",
    value: function openNewTab() {
      var _this4 = this;
      this.showLogs('Opening payment in new tab');
      fetch('./ypay_ui/templates/payment_form.html').then(function (response) {
        return response.text();
      }).then(function (template) {
        var newTab = window.open("", '_blank');
        if (!newTab) {
          var errorMsg = 'Popup blocked - please allow popups for this site';
          _this4.showLogs(errorMsg);
          throw new Error(errorMsg);
        }
        _this4.newWindowRef = newTab;
        newTab.document.write(_this4.renderTemplate(template));
        newTab.document.close();
        newTab.addEventListener('load', function () {
          _this4.initializeFormController(newTab.document);
        });
        newTab.focus();
      })["catch"](function (err) {
        _this4.showLogs('Failed to open payment tab:', err);
      });
    }
  }, {
    key: "getTemplateData",
    value: function getTemplateData() {
      return {
        language: this.language,
        logoImg: this.logo ? "<img src=\"".concat(this.logo, "\" alt=\"Shop Logo\"/>") : '',
        shopName: this.shopName,
        amount: this.formatAmount(),
        texts: {
          message: this.localization.tag("message"),
          no_app: this.localization.tag("no_app"),
          download: this.localization.tag("download"),
          card_label: this.localization.tag("card_label"),
          card_placeholder: this.localization.tag("card_placeholder"),
          card_error: this.localization.tag("error_message"),
          otp_label: this.localization.tag("otp_label"),
          submit_button: this.localization.tag("submit_button"),
          secured_payment: this.localization.tag("secured_payment")
        }
      };
    }
  }, {
    key: "renderTemplate",
    value: function renderTemplate(template) {
      var data = this.getTemplateData();
      return template.replace(/\{\{language\}\}/g, data.language).replace(/\{\{logoImg\}\}/g, data.logoImg).replace(/\{\{closeBtn\}\}/g, this.modal ? '<button class="close_modal" type="button">×</button>' : '').replace(/\{\{shopName\}\}/g, data.shopName).replace(/\{\{amount\}\}/g, data.amount).replace(/\{\{texts\.message\}\}/g, data.texts.message).replace(/\{\{texts\.no_app\}\}/g, data.texts.no_app).replace(/\{\{texts\.download\}\}/g, data.texts.download).replace(/\{\{texts\.card_label\}\}/g, data.texts.card_label).replace(/\{\{texts\.card_placeholder\}\}/g, data.texts.card_placeholder).replace(/\{\{texts\.card_error\}\}/g, data.texts.card_error).replace(/\{\{texts\.otp_label\}\}/g, data.texts.otp_label).replace(/\{\{texts\.submit_button\}\}/g, data.texts.submit_button).replace(/\{\{texts\.secured_payment\}\}/g, data.texts.secured_payment);
    }
  }, {
    key: "initializeFormController",
    value: function initializeFormController(targetDocument) {
      var _this5 = this;
      this.showLogs('Initializing form controller');
      Promise.resolve().then(function () {
        return _interopRequireWildcard(require('./init_form_controller.js'));
      }).then(function (module) {
        if (module["default"] && typeof module["default"] === 'function') {
          module["default"](targetDocument);
        }
      })["catch"](function (err) {
        _this5.showLogs('Form controller not available:', err);
      });
      var form = targetDocument.getElementById('payment_form');
      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          _this5.triggerPayment();
        });
      }
    }
  }, {
    key: "triggerPayment",
    value: function () {
      var _triggerPayment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var doc, submit_button, cardInput, card_code, otpInputs, otp, data, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              this.showLogs('Payment triggered', {
                amount: this.amount,
                currency: this.currency
              });
              doc = this.newWindowRef ? this.newWindowRef.document : document;
              submit_button = doc.querySelector(".submit_button");
              _context.p = 1;
              cardInput = doc.getElementById("card_code");
              card_code = cardInput.value.trim();
              otpInputs = doc.getElementsByClassName("otp_input_item");
              otp = parseInt(_toConsumableArray(otpInputs).map(function (elem) {
                return elem.value;
              }).join(""));
              this.showLogs('Processing payment with card:', card_code.substring(0, 4) + '****');
              if (submit_button) {
                submit_button.innerHTML = this.localization.tag("submit_button_processing");
                //submit_button.style.disabled = true;
              }
              _context.n = 2;
              return this.ypay.createTransaction(card_code, otp, this.amount, this.localization.current);
            case 2:
              data = _context.v;
              this.showLogs('Payment successful:', data);
              this.customAlert('success', data);
              this.closePaymentUI();
              if (this.handlers.onSuccess) {
                this.handlers.onSuccess(data);
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              this.showLogs('Payment error:', _t);
              this.customAlert('failure', _t);
              if (submit_button) {
                submit_button.innerHTML = this.localization.tag("submit_button");
                submit_button.style.disabled = false;
              }
              if (this.handlers.onFailure) {
                this.handlers.onFailure(_t);
              }
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function triggerPayment() {
        return _triggerPayment.apply(this, arguments);
      }
      return triggerPayment;
    }()
  }, {
    key: "renderForm",
    value: function renderForm() {
      this.showLogs('Rendering payment form', {
        modal: this.modal,
        amount: this.amount,
        currency: this.currency
      });
      if (this.modal) {
        this.showModal();
      } else {
        this.openNewTab();
      }
    }
  }, {
    key: "showLogs",
    value: function showLogs() {
      if (this.verbose) {
        var _console;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        (_console = console).log.apply(_console, ['[PaymentUI]'].concat(args));
      }
    }
  }]);
}();
_defineProperty(PaymentUI, "instance", void 0);
var _default = exports["default"] = PaymentUI;

},{"../../sdk/ypay.js":4,"./alert_controller.js":5,"./init_form_controller.js":6,"./localization.js":7}]},{},[8])(8)
});
