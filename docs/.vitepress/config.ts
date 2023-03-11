import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Express Class Router',
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guides', link: '/what-is-this-library' }
        ],

        sidebar: [
            {
                text: 'Getting Started',
                items: [
                    {
                        text: 'What is this library?',
                        link: '/what-is-this-library'
                    },
                    {
                        text: 'Installation',
                        link: '/installation'
                    },
                    {
                        text: 'Create Endpoints',
                        link: '/create-endpoints'
                    },
                    {
                        text: 'Automatic Loader',
                        link: '/automatic-loader'
                    }
                ]
            },
            {
                text: 'Experimental',
                items: [
                    {
                        text: 'Using Metadata',
                        link: '/using-metadata'
                    }
                ]
            },
            {
                text: 'Decorators',
                items: [
                    {
                        text: 'Controller',
                        link: '/decorators/controller'
                    },
                    {
                        text: 'Route',
                        link: '/decorators/route'
                    }
                ]
            },
            {
                text: 'Examples',
                items: [
                    {
                        text: 'Simple CRUD API',
                        link: '/examples/simple-crud-api'
                    },
                    {
                        text: 'Validating Requests',
                        link: '/examples/validating-requests'
                    }
                ]
            }
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/bur4kbey/express-class-router'
            }
        ]
    }
});
