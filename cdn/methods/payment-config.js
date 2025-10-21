// Payment configuration object
const paymentConfig=
    {
        initialize: function(config = {})
        {
            this.shopName = config.shopName || 'SHOP NAME';
            this.amount = config.amount || 'XXX';
            this.currency = config.currency || 'XOF';
            this.shop_logo = config.shop_logo || './assets/images/shop_logo.png';
            this.modal = config.modal || false;

            this.render();
        },

        render: function()
        {
            // Update shop information
            this.updateElement('.second_stack', this.shopName);
            this.updateElement('.third_stack', `${this.amount} ${this.currency}`);
            this.updateElement('.modal_info span', `${this.amount} ${this.currency}`);

            // Update logo
            const shopIcon = document.querySelector('.shop_icon');
            if (shopIcon) {
                shopIcon.innerHTML = `<img src="${this.shop_logo}" alt="${this.shopName}" 
                                style="width: 40px; height: 40px; object-fit: cover;">`;
            }
        },

        updateElement: function(selector, value)
        {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
            }
        },

        // Method to update config dynamically
        update: function(newConfig)
        {
            Object.assign(this, newConfig);
            this.render();
        }
    };

export default paymentConfig;

// Usage examples:

// // 1. Basic usage with default values
// // paymentConfig.initialize();
//
// // 2. Custom configuration
// paymentConfig.initialize({
//     shopName: "MY FASHION STORE",
//     amount: "50000",
//     currency: "XOF",
//     logo: "./assets/images/my-shop-logo.png",
//     downloadUrl: "https://example.com/download-app"
// });
//
// // 3. Update later if needed
// paymentConfig.update({ amount: "75000" });
