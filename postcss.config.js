const tailwindcss = require('tailwindcss');
module.exports = {
    plugins: [
        tailwindcss('./tailwind.config.js'),
        require('postcss-nested'),
        require('@tailwindcss/forms'),
        require('autoprefixer'),
    ],
};