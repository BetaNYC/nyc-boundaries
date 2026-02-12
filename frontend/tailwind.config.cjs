module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{svelte,js,ts}'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: []
}
