class Localization
{
    constructor()
    {
        this.current = "en";

        this.languages = {
            en: "en",
            fr: "fr",
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
                failure_transaction: "Your transaction has not been processed!",
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

    isValid(lang)
    {
        return Object.values(this.languages).includes(lang.toLowerCase());
    }

    setLang(lang)
    {
        switch (lang)
        {
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

    tag(key)
    {
        return this.translations[this.current][key] || key;
    }

}


export default Localization;