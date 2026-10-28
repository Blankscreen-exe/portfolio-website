module.exports = {
    darkMode: 'selector',
    content: [
      "./index.html",
      "./src/**/*.{html,jsx,js}",
      "./node_modules/tw-elements-react/dist/js/**/*.js"
    ],
    theme: {
      fontFamily:{
        // sans: ['"CourierPrime-Regular"', 'sans-serif'],
        // serif: ['"CourierPrime-Regular"', 'serif'],
        
        'display': ['"CourierPrime-Regular"'],
        'body': ['"Courier"'],
        'normal': ['"CourierPrime-Regular"'],
        'bold': ['"CourierPrime-Bold"'],
        'italic': ['"CourierPrime-Italic"'],

        // Spec-sheet redesign
        'archivo': ['Archivo', 'system-ui', 'sans-serif'],
        'jet': ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      extend: {
        colors:{
          "primary": "rgb(var(--color-primary) / <alpha-value>)",
          "secondary": "rgb(var(--color-secondary) / <alpha-value>)",
          "tertiary": "rgb(var(--color-tertiary) / <alpha-value>)",
          "contrast": "rgb(var(--color-contrast) / <alpha-value>)",
          
          "title": "rgb(var(--color-title) / <alpha-value>)",
          "content": "rgb(var(--color-content) / <alpha-value>)",
          "contentLink": "rgb(var(--color-content-link) / <alpha-value>)",
          "contentLinkHover": "rgb(var(--color-content-link-hover) / <alpha-value>)",
          
          "shadow": "rgb(var(--color-shadow) / <alpha-value>)",
          
          "bg1": "rgb(var(--color-bg1) / <alpha-value>)",
          "bg2": "rgb(var(--color-bg2) / <alpha-value>)",

          // Spec-sheet redesign (values live in src/styles/sheet.css, light + dark)
          "stock": "rgb(var(--ss-stock) / <alpha-value>)",
          "paper": "rgb(var(--ss-paper) / <alpha-value>)",
          "ink": "rgb(var(--ss-ink) / <alpha-value>)",
          "ash": "rgb(var(--ss-ash) / <alpha-value>)",
          "frame": "rgb(var(--ss-frame) / <alpha-value>)",
          "onprimary": "rgb(var(--ss-onprimary) / <alpha-value>)",

        },

        brightness: {
          10: '.10',
          15: '.15',
          20: '.20',
          25: '.25',
          175: '1.75',
        },
        blur: {
          xs: '2px',
        },
        keyframes: {
          typing: {
            "0%": {
              width: "0%",
              visibility: "hidden"
            },
            "100%": {
              width: "100%"
            }  
          },
          blink: {
            "50%": {
              borderColor: "transparent"
            },
            "100%": {
              borderColor: "white"
            }  
          },
          "pulse-ring": {
            "0%": {
              boxShadow: "0 0 0 0px rgba(120, 240, 231, 0.4)"
            },
            "100%": {
              boxShadow: "0 0 0 20px rgba(120, 240, 231, 0)"
            }
          },
        },
        animation: {
          typing: "typing 3s steps(20) , blink .7s infinite",
          "pulse-ring": "pulse-ring 2s infinite"
        }
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
    },
    darkMode: "class",
    plugins: [
      require("daisyui"),
      require('@tailwindcss/forms'),
      // require('@tailwindcss/aspect-ratio'),
      require("tw-elements-react/dist/plugin.cjs")
    ],
    // daisyui: {
    //   themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    //   darkTheme: "dark", // name of one of the included themes for dark mode
    //   base: true, // applies background color and foreground color for root element by default
    //   styled: true, // include daisyUI colors and design decisions for all components
    //   utils: true, // adds responsive and modifier utility classes
    //   prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    //   logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    //   themeRoot: ":root", // The element that receives theme color CSS variables
    // },
  }
