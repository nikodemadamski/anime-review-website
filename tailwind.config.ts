import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: {
            main: '#FAF8F4',
            text: '#F2EDE6',
            card: '#F7F3EC',
          },
          text: {
            primary: '#2E2A25',
            secondary: '#5A564E',
            muted: '#8A867E',
          },
          link: {
            DEFAULT: '#6D8A78',
            hover: '#4F6E62',
          },
          header: {
            bg: '#EDE6DB',
            text: '#2B2824',
            divider: '#D3C8BA',
          },
          footer: {
            bg: '#DDD4C6',
            text: '#3A3530',
            link: '#6D8A78',
          },
          rating: {
            overall: '#C8A34E',
            story: '#C26A4A',
            art: '#708B4B',
            music: '#4E6B5E',
            characters: '#B77A50',
          },
          border: '#E0D8CC',
          btn: {
            primary: {
              bg: '#8B6F47',
              text: '#FFFFFF',
            },
            secondary: {
              bg: '#EDE6DB',
              text: '#2E2A25',
            },
          },
          tag: '#E5D9C9',
        },
        // Dark mode colors
        dark: {
          bg: {
            main: '#12110F',
            text: '#1A1815',
            card: '#1E1C19',
          },
          text: {
            primary: '#E6E0D7',
            secondary: '#B3ABA1',
            muted: '#898278',
          },
          link: {
            DEFAULT: '#9BC5AC',
            hover: '#B8D8C5',
          },
          header: {
            bg: '#1A1815',
            text: '#EEE7DC',
            divider: '#3A372F',
          },
          footer: {
            bg: '#181714',
            text: '#CFC7BD',
            link: '#9BC5AC',
          },
          rating: {
            overall: '#D9B960',
            story: '#D98161',
            art: '#89A65A',
            music: '#6D8F80',
            characters: '#CF8C61',
          },
          border: '#2C2A26',
          btn: {
            primary: {
              bg: '#8B6F47',
              text: '#F5EFE7',
            },
            secondary: {
              bg: '#2A2824',
              text: '#E6E0D7',
            },
          },
          tag: '#463F36',
        },
        // Brand colors
        brand: {
          earth: '#8B6F47',
          olive: '#556B2F',
          sand: '#D9CBB6',
          terracotta: '#C26A4A',
          moss: '#A8B098',
        },
      },
    },
  },
}
export default config
