const cardPattern = /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/;
const paymentCodePattern = /^[0-9]{4}$/;
const tokenPattern = /^[0-9]{1,}\|[A-Za-z0-9]{48}$/;

export {cardPattern, paymentCodePattern, tokenPattern};