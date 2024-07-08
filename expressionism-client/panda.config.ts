import { defineConfig } from "@pandacss/dev";
import {createPreset} from "@park-ui/panda-preset";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: ['@park-ui/panda-preset', createPreset({
    accentColor: 'blue',
    grayColor: 'slate',
    borderRadius: 'md',
    additionalColors: ['*']
  }),],

  // Where to look for your css declarations
  include: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      slotRecipes: {
        tabs: {
          base: {
            trigger: {
              fontWeight: "medium",
              _hover: {
                color: "accent.emphasized",
              },
              _selected: {
                color: "accent.text",
                _hover: {
                  color: "accent.emphasized",
                },
              },
            }
          }
        },
        treeView: {
          base: {
            branchControl: {
              borderRadius: 'md',
              gap: '3',
              ps: 'calc(4px + (var(--depth) - 1) * 28px + (var(--depth) - 1) * 1px)',
              "&[data-depth='1']": {
                ps: '4px',
              },
              "&[data-depth='1'] > [data-part='branch-text'] ": {
                fontWeight: 'normal',
              },

              "& .showOnParentHover": {
                transition: 'opacity 0.1s ease-in-out',
                opacity: 0,
              },
              _hover: {
                "& .showOnParentHover": {
                  opacity: 1,
                },
              },
            },
            item: {
              ps: 'calc(4px + var(--depth) * 28px)',
              "&[data-depth='1']": {
                ps: '32px',
              }
            },
            tree: {
              gap: '1',
            },
            
          }
        }
      }
    },
  },

  jsxFramework: "react",

  // The output directory for your css system
  outdir: "styled-system",
});
