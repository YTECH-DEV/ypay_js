const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: minifyHTML } = require('html-minifier');

// Paths
const srcDir = path.join(__dirname, '../src');
const distDir = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Helper: Copy directory recursively
function copyDirectorySync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectorySync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// JavaScript minification function
async function minifyJS(inputPath, outputPath) {
    try {
        const code = fs.readFileSync(inputPath, 'utf8');
        const result = await minify(code, {
            compress: {
                dead_code: true,
                drop_console: false,
                drop_debugger: true,
                keep_classnames: true,
                keep_fnames: true,
                passes: 2
            },
            mangle: {
                keep_classnames: true,
                keep_fnames: true
            },
            format: {
                comments: false
            }
        });

        if (result.code) {
            fs.writeFileSync(outputPath, result.code);
            console.log(`✓ Minified: ${path.basename(outputPath)}`);
            return result.code;
        }
    } catch (error) {
        console.error(`✗ Error minifying ${inputPath}:`, error.message);
        throw error;
    }
}

// CSS minification function
function minifyCSS(inputPath, outputPath) {
    try {
        const css = fs.readFileSync(inputPath, 'utf8');
        const result = new CleanCSS({
            level: 2,
            returnPromise: false
        }).minify(css);

        if (result.styles) {
            fs.writeFileSync(outputPath, result.styles);
            console.log(`Minified: ${path.basename(outputPath)}`);
            return result.styles;
        }
    } catch (error) {
        console.error(`Error minifying ${inputPath}:`, error.message);
        throw error;
    }
}

// Read file safely
function readFileSafe(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8');
        }
        console.warn(`File not found: ${filePath}`);
        return '';
    } catch (error) {
        console.error(`✗ Error reading ${filePath}:`, error.message);
        return '';
    }
}

// Bundle and minify SDK files
async function bundleSDK() {
    console.log('\n📦 Bundling SDK...');

    const sdkFiles = [
        'sdk/enums.js',
        'sdk/patterns.js',
        'sdk/transaction.js',
        'sdk/ypay.js'
    ];

    let bundledCode = '// YPAY SDK v' + require('../package.json').version + '\n';
    bundledCode += '// Copyright © 2024 YTECH. All rights reserved.\n\n';
    bundledCode += '(function(global) {\n';
    bundledCode += '"use strict";\n\n';

    for (const file of sdkFiles) {
        const filePath = path.join(srcDir, file);
        let code = readFileSafe(filePath);

        if (!code) continue;

        // Remove import/export statements for bundling
        code = code.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
        code = code.replace(/export\s+{[^}]*};?\s*/g, '');
        code = code.replace(/export\s+default\s+/g, '');
        code = code.replace(/export\s+/g, '');

        bundledCode += '// --- ' + file + ' ---\n';
        bundledCode += code + '\n\n';
    }

    // Add exports at the end
    bundledCode += `
// Exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YPAY, Transaction, Currency, cardPattern, paymentCodePattern, tokenPattern };
}
global.YPAY = YPAY;
global.YPAYTransaction = Transaction;
global.YPAYCurrency = Currency;

})(typeof window !== 'undefined' ? window : this);
`;

    // Save unminified bundle
    const bundlePath = path.join(distDir, 'ypay-sdk.js');
    fs.writeFileSync(bundlePath, bundledCode);
    console.log('✓ Created: ypay-sdk.js');

    // Minify bundle
    await minifyJS(bundlePath, path.join(distDir, 'ypay-sdk.min.js'));
}

// Bundle and minify UI files
async function bundleUI() {
    console.log('\nBundling UI...');

    const uiFiles = [
        'ypay_ui/js/localization.js',
        'ypay_ui/js/alert_controller.js',
        'ypay_ui/js/init_form_controller.js',
        'ypay_ui/js/paymentUI.js',
        'ypay_ui/js/paymentTriggerButtons.js',
        'ypay_ui/js/main.js'
    ];

    let bundledCode = '// YPAY UI v' + require('../package.json').version + '\n';
    bundledCode += '// Copyright © 2024 YTECH. All rights reserved.\n\n';
    bundledCode += '(function(global) {\n';
    bundledCode += '"use strict";\n\n';

    for (const file of uiFiles) {
        const filePath = path.join(srcDir, file);
        let code = readFileSafe(filePath);

        if (!code) continue;

        // Handle imports for UI bundle
        code = code.replace(/import\s+.*?from\s+['"].*?\/sdk\/.*?['"];?\s*/g, '');
        code = code.replace(/import\s+.*?from\s+['"]\.\/.*?['"];?\s*/g, '');
        code = code.replace(/import\s+.*?from\s+['"]\.\.\/.*?['"];?\s*/g, '');
        code = code.replace(/export\s+{[^}]*};?\s*/g, '');
        code = code.replace(/export\s+default\s+/g, '');
        code = code.replace(/export\s+/g, '');

        bundledCode += '// --- ' + file + ' ---\n';
        bundledCode += code + '\n\n';
    }

    // Add exports
    bundledCode += `
// Exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PaymentUI, Localization };
}
global.PaymentUI = PaymentUI;
global.YPAYLocalization = Localization;

})(typeof window !== 'undefined' ? window : this);
`;

    // Save unminified bundle
    const bundlePath = path.join(distDir, 'ypay-ui.js');
    fs.writeFileSync(bundlePath, bundledCode);
    console.log('✓ Created: ypay-ui.js');

    // Minify bundle
    await minifyJS(bundlePath, path.join(distDir, 'ypay-ui.min.js'));
}

// Bundle CSS
function bundleCSS() {
    console.log('\nBundling CSS...');

    const cssFiles = [
        'ypay_ui/styles/root.css',
        'ypay_ui/styles/buttons.css',
        'ypay_ui/styles/form.css',
        'ypay_ui/styles/modal.css',
        'ypay_ui/styles/custom_alert.css'
    ];

    let bundledCSS = '/* YPAY UI Styles v' + require('../package.json').version + ' */\n';
    bundledCSS += '/* Copyright © 2024 YTECH. All rights reserved. */\n\n';

    for (const file of cssFiles) {
        const filePath = path.join(srcDir, file);
        let css = readFileSafe(filePath);

        if (!css) continue;

        // Remove @import statements
        css = css.replace(/@import\s+url\(['"].*?['"]\);?\s*/g, '');

        bundledCSS += '/* --- ' + file + ' --- */\n';
        bundledCSS += css + '\n\n';
    }

    // Save unminified bundle
    const bundlePath = path.join(distDir, 'ypay-ui.css');
    fs.writeFileSync(bundlePath, bundledCSS);
    console.log('✓ Created: ypay-ui.css');

    // Minify bundle
    minifyCSS(bundlePath, path.join(distDir, 'ypay-ui.min.css'));
}

// Create full bundle (SDK + UI)
async function bundleFull() {
    console.log('\n📦 Creating full bundle...');

    const sdkCode = readFileSafe(path.join(distDir, 'ypay-sdk.js'));
    const uiCode = readFileSafe(path.join(distDir, 'ypay-ui.js'));

    if (!sdkCode || !uiCode) {
        console.error('✗ Cannot create full bundle: SDK or UI bundle missing');
        return;
    }

    let fullBundle = '// YPAY Full Bundle v' + require('../package.json').version + '\n';
    fullBundle += '// Copyright © 2024 YTECH. All rights reserved.\n\n';
    fullBundle += '(function() {\n\n';
    fullBundle += sdkCode.replace(/\(function\(global\) \{[\s\S]*?\}\)\(typeof window[^)]+\);/g, (match) => {
        return match.replace(/^\(function\(global\) \{/, '').replace(/\}\)\(typeof window[^)]+\);$/, '');
    });
    fullBundle += '\n\n';
    fullBundle += uiCode.replace(/\(function\(global\) \{[\s\S]*?\}\)\(typeof window[^)]+\);/g, (match) => {
        return match.replace(/^\(function\(global\) \{/, '').replace(/\}\)\(typeof window[^)]+\);$/, '');
    });
    fullBundle += '\n\n})();\n';

    // Save unminified
    const bundlePath = path.join(distDir, 'ypay-full.js');
    fs.writeFileSync(bundlePath, fullBundle);
    console.log('✓ Created: ypay-full.js');

    // Minify
    await minifyJS(bundlePath, path.join(distDir, 'ypay-full.min.js'));
}

// Minify HTML templates
function minifyHTMLTemplates() {
    console.log('\nProcessing HTML templates...');

    const templates = [
        'ypay_ui/templates/payment_form.html',
        'ypay_ui/templates/custom_alert.html'
    ];

    const distTemplatesDir = path.join(distDir, 'templates');
    if (!fs.existsSync(distTemplatesDir)) {
        fs.mkdirSync(distTemplatesDir, { recursive: true });
    }

    for (const template of templates) {
        const inputPath = path.join(srcDir, template);
        if (fs.existsSync(inputPath)) {
            const html = fs.readFileSync(inputPath, 'utf8');
            const minified = minifyHTML(html, {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                minifyCSS: true,
                minifyJS: true
            });

            const outputPath = path.join(distTemplatesDir, path.basename(template));
            fs.writeFileSync(outputPath, minified);
            console.log(`✓ Minified: ${path.basename(template)}`);
        }
    }
}

// Copy assets to dist
function copyAssets() {
    console.log('\nCopying assets...');

    const srcAssetsDir = path.join(srcDir, 'ypay_ui/assets');
    const distAssetsDir = path.join(distDir, 'assets');

    if (fs.existsSync(srcAssetsDir)) {
        copyDirectorySync(srcAssetsDir, distAssetsDir);
        console.log('✓ Assets copied to dist/assets/');
    } else {
        console.warn('⚠ No assets directory found at:', srcAssetsDir);
    }
}

// Main execution
async function main() {
    console.log('Starting YPAY SDK build process...\n');
    console.log('Version:', require('../package.json').version);

    try {
        await bundleSDK();
        await bundleUI();
        bundleCSS();
        await bundleFull();
        minifyHTMLTemplates();
        copyAssets();

        console.log('\nBuild completed successfully!');
        console.log('\nGenerated files:');
        console.log('  - dist/ypay-sdk.js & ypay-sdk.min.js');
        console.log('  - dist/ypay-ui.js & ypay-ui.min.js');
        console.log('  - dist/ypay-ui.css & ypay-ui.min.css');
        console.log('  - dist/ypay-full.js & ypay-full.min.js');
        console.log('  - dist/templates/*.html (minified)');
        console.log('  - dist/assets/ (copied)');

    } catch (error) {
        console.error('\nBuild failed:', error);
        process.exit(1);
    }
}

main();