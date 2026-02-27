import type { InstantRules } from "@instantdb/react";

const rules = {
  documents: {
    allow: {
      view: "true",
      create: "true",
      update: "true",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
