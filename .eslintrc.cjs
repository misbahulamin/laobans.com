{
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": ["warn", { "allowConstantExport": true }],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
