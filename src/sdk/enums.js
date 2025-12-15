class Currency
{
    static USD = "USD"
    static NGN = "NGN"
    static XOF = "F CFA"

    static isValid(currency)
    {
        return Object.values(this).includes(currency.toUpperCase());
    }
}

export {Currency};