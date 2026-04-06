import type { Config } from 'tailwindcss'

export default <Partial<Config>> {
  content: [
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
      }
    }
  }
}
