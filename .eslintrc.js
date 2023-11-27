module.exports = {
  extends: ["react-app"],
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      rules: {
        "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_", varsIgnorePattern: "^_"}]
      },
    },
  ],
};
