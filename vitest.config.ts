 import { defineConfig } from 'vitest/config';
    
export default defineConfig({
    test: {
        pool: 'threads',
        globals: true,
        environment: 'jsdom',
        css: true,
        server: {
            deps: {
                inline: true,
                fallbackCJS: true,
            }
        }
    },
});