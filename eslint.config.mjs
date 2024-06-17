// @ts-check

import { createPandellEsLintConfig } from "@pandell/eslint-config";

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
