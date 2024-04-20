/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx,jsx}"],
  theme: {
    extend: {
      width :{
        'card': '500px',
        'thumbnail': '600px'
      },
      height :{
        
        'thumbnail': '600px'
      },
      colors :{
        'gris1' : '#202020',
        'gris2' : '#323232',
        'gris3' : '#4B4B4B',
        'gris4' : '#646464',
        'input' : 'rgba(255, 255, 255, .3)'
      },
    },
  },
  plugins: [],
}

