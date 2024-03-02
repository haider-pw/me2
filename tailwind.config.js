module.exports = {
    theme: {
        screens: {
            'xs': '400px',
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
        },
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        'code::before': {
                            content: 'none', // don’t generate the pseudo-element
                        },
                        'code::after': {
                            content: 'none'
                        },
                        'code': {
                            backgroundColor: theme('colors.gray.100'), // Light gray background
                            color: theme('colors.gray.800'), // Darker text color for contrast
                            fontWeight: '400',
                            padding: '0.2em 0.4em', // Padding inside the code blocks
                            borderRadius: '0.375rem', // Rounded corners, adjust as needed
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', // Monospace font for code
                        }
                    }
                }
            })
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
