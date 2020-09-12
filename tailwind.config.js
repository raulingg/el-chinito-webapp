module.exports = {
  theme: {
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1.25rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
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
    tableLayout: ['responsive', 'hover', 'focus'],
    flexDirection: ['responsive', 'hover', 'focus', 'active'],
    backgroundColor: ['responsive', 'hover', 'focus', 'active', 'disabled'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  }
}
