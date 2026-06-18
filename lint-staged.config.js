export default {
  '*.css': ['prettier --write'],
  '*.{js,cjs,ts,tsx,astro}': ['prettier --write', 'eslint --fix'],
  '*.astro': ['astro check'],
}
