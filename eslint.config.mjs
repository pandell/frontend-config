// @ts-check

import { createPandellEsLintConfig } from "@pandell/eslint-config";

// eslint-disable-next-line import-x/no-default-export -- default export is required/expected by ESLint
export default createPandellEsLintConfig({
  extraConfigs: [
    {
      name: "frontend-config/local",
      rules: {
        "import-x/no-unresolved": "off",
        "no-undef": "off",
        "no-console": "off",
      },
    },
  ],
});
