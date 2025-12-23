import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    publicDir: false, // Don't copy public dir

    resolve: {
        alias: {
            '@': resolve(__dirname, './ypay_ui')
        }
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,

        lib: {
            entry: resolve(__dirname, './src/ypay_ui/js/main.js'),
            name: 'YPAY',
            fileName: (format) => `ypay-ui.${format}.js`,
            formats: ['umd', 'es']
        },

        rollupOptions: {
            external: [],

            output: {
                globals: {},
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'ypay-ui.css';
                    }
                    if (/\.(png|jpe?g|svg|gif|webp)$/i.test(assetInfo.name)) {
                        return 'assets/images/[name][extname]';
                    }
                    if (/\.html$/i.test(assetInfo.name)) {
                        return 'assets/templates/[name][extname]';
                    }
                    return 'assets/[name][extname]';
                }
            }
        },

        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true
            }
        },

        sourcemap: true
    },

    css: {
        devSourcemap: true
    },

    assetsInclude: ['**/*.html', '**/*.svg', '**/*.png', '**/*.jpg'],

    server: {
        port: 3000,
        open: true
    }
});