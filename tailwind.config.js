module.exports = {
  content: ['./src/pages/**/*', './src/components/**/*', './src/sections/**/*'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--color-primary-hover) / <alpha-value>)',
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        'on-primary-hover': 'rgb(var(--color-on-primary-hover) / <alpha-value>)',

        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'secondary-hover': 'rgb(var(--color-secondary-hover) / <alpha-value>)',

        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',

        muted: 'rgb(var(--color-muted) / <alpha-value>)',

        surface: 'rgb(var(--color-surface) / <alpha-value>)',

        background: 'rgb(var(--color-background) / <alpha-value>)',

        paragraph: 'rgb(var(--color-paragraph) / <alpha-value>)',
        'paragraph-variant': 'rgb(var(--color-paragraph-variant) / <alpha-value>)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
