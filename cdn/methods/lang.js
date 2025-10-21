const Lang = {
    current: "en",

    setLang: (lang) =>
    {
        Lang.current = lang;
    },

    tag: (key) => {
        return Lang[Lang.current][key] || key;
    },

    en: {
        card: "Card number",
        card_placeholder: "Enter your card number",
        otp: "Enter OTP",
        otp_description:
            "To get the OTP, connect you to the Ypay application and generate the OTP.",
        submit_button: "Processing...",
        create_account: "Create account",
        error_message: "Enter XXXX-XXXX with letters/digits only.",
    },
    fr: {
        card: "Numéro de carte",
        card_placeholder: "Entrez votre numéro de carte",
        otp: "Entrez l'OTP",
        otp_description: "Pour obtenir l'OTP, connectez-vous à l'application Ypay et générez l'OTP.",
        submit_button: "Traitement en cours...", // clé avec faute d'orthographe
        create_account: "Créer un compte",
        error_message: "Format XXXX-XXXX avec lettres et chiffres uniquement.",
    },
};

export default Lang;