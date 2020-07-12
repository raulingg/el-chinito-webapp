module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          lighter: '#FFEB85',
          light: '#FFE047',
          default: '#EBC300',
          dark: '#A38800',
          darker: '#665500',
        },
      },
    },
  },
  variants: {
    flexDirection: ['responsive', 'hover', 'focus', 'active'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
  },
  plugins: [],
}
