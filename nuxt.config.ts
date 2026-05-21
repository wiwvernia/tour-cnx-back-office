import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  ssr: false,

  nitro: {
    preset: 'static',
    output: {
      publicDir: 'dist',
    },
  },

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080/api/v1',
    },
  },

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.x/css/materialdesignicons.min.css' }
      ]
    }
  },

  css: ['vuetify/dist/vuetify.min.css'],

  build: {
    transpile: ['vuetify'],
  },

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true, styles: 'none' }))
      })
    },
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
