/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Deep Navy untuk base
        surface: '#1e293b',    // Slate gray untuk card/sidebar
        primary: '#22d3ee',    // Vibrant Cyan untuk aksi utama
        secondary: '#34d399',  // Emerald green untuk status sukses/online
        slate50: '#f8fafc',    // Teks utama kontras tinggi
        slate400: '#94a3b8',   // Teks sekunder/metadata
        slate700: '#334155',   // Border
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font teknis & presisi
      },
      boxShadow: {
        'glow-primary': '0px 0px 8px rgba(34, 211, 238, 0.5)', // Efek pendaran cyan ala mesin industrial
        'level-2': '0px 4px 20px rgba(0, 0, 0, 0.5)', // Bayangan untuk modal/jendela
      }
    },
  },
  plugins: [],
}