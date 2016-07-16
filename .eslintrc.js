module.exports = {
	parser: 'babel-eslint',
	root: true,
	"env": {
        "browser": true,
        "es6": true,
        "node": true,
		"mocha": true

	},
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
		'array-bracket-spacing': [ 1, 'always' ],
		'brace-style': [ 1, '1tbs' ],
		// REST API objects include underscores
		camelcase: 0,
		'comma-spacing': 1,
		curly: 1,
		'dot-notation': 1,
		'computed-property-spacing': [ 1, 'always' ],
		'eol-last': 1,
		indent: [ 1, 'tab', { SwitchCase: 1 } ],
		'jsx-quotes': [ 1, 'prefer-double' ],
		'key-spacing': 1,
		'keyword-spacing': 1,
		'max-len': [ 1, { code: 140 } ],
		'new-cap': [ 1, { capIsNew: false, newIsCap: true } ],
		'no-console': 1,
		'no-else-return': 1,
		'no-extra-semi': 1,
		'no-lonely-if': 1,
		'no-mixed-spaces-and-tabs': 1,
		'no-multiple-empty-lines': [ 1, { max: 1 } ],
		'no-multi-spaces': 1,
		'no-nested-ternary': 1,
		'no-new': 1,
		'no-process-exit': 1,
		'no-redeclare': 1,
		'no-shadow': 1,
		'no-spaced-func': 1,
		'no-trailing-spaces': 1,
		'no-unreachable': 1,
		// Allows Chai `expect` expressions
		'no-unused-expressions': 0,
		'no-unused-vars': 1,
		'no-var': 1,
		'object-curly-spacing': [ 1, 'always' ],
		'operator-linebreak': [ 1, 'after', { overrides: {
			'?': 'before',
			':': 'before'
		} } ],
		'padded-blocks': [ 1, 'never' ],
		'prefer-const': 1,
		'quote-props': [ 1, 'as-needed', { keywords: true } ],
		quotes: [ 1, 'single', 'avoid-escape' ],
		'react/jsx-uses-react': 1,
		'react/jsx-uses-vars': 1,
		'react/jsx-no-duplicate-props': 1,
		'react/no-did-mount-set-state': 1,
		'react/no-did-update-set-state': 1,
		'react/no-is-mounted': 1,
		'react/jsx-no-bind': 1,
		'react/jsx-curly-spacing': [ 1, 'always' ],
		semi: 1,
		'semi-spacing': 1,
		'space-before-blocks': [ 1, 'always' ],
		'space-before-function-paren': [ 1, 'never' ],
		'space-in-parens': [ 1, 'always' ],
		'space-infix-ops': [ 1, { int32Hint: false } ],
		'space-unary-ops': [ 1, {
			overrides: {
				'!': true
			}
		} ],
		'valid-jsdoc': [ 1, { requireReturn: false } ],
    }
};
