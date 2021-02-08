module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        "node": true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'indent': [
            'off',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'off',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
