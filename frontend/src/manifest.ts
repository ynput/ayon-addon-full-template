// What this addon contributes to AYON's slots. AYON loads this module at startup (it is exposed
// as ./manifest and listed in frontend_modules), so keep it to descriptions: every component is
// a dynamic import that AYON loads when its slot needs it.
import { defineAddon } from "@ynput/ayon-addon/manifest";

export default defineAddon({
  contributes: [],
});
