import { defineConfig } from "@pandacss/dev";

import { createPreset } from "@park-ui/panda-preset";

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    presets: [
        "@park-ui/panda-preset",
        createPreset({
            accentColor: "blue",
            grayColor: "slate",
            borderRadius: "md",
            additionalColors: ["*"],
        }),
    ],

    // Where to look for your css declarations
    include: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],

    // Files to exclude
    exclude: [],

    // Useful for theme customization
    theme: {
        extend: {
            slotRecipes: {},
        },
    },

    jsxFramework: "react",

    // The output directory for your css system
    outdir: "styled-system",
});
