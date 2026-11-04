import { useEffect } from "react";
import { useAppStore } from "@/App/client/hooks";
import { selectDueWarningDays } from "@/App/client/store";
import { setDueWarningDays } from "@/App/client/productionSlice";
import { throwIfRequested } from "@/testing";

const STORAGE_KEY = "addon-full-template:dueWarningDays";

// Storage can be blocked (privacy settings). A listener runs inside whoever dispatched, here the
// Customize section: it must not throw, the setting just isn't remembered.
const readStorage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const writeStorage = (value: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // not remembered
  }
};

// Remembers the Due dates setting (Customize, src/customize/DueDatesSection.tsx) across reloads
// (app.service slot, see src/manifest.ts). A service has no UI: AYON mounts it once at startup,
// under its providers, and it renders nothing. Here it puts back the saved value, then listens
// to the store and saves the setting whenever it changes; the cleanup removes the listener.
const RememberDueWarning = () => {
  throwIfRequested("service.remember_due_warning");
  const store = useAppStore();

  useEffect(() => {
    const saved = Number(readStorage());
    if (saved > 0) store.dispatch(setDueWarningDays(saved));

    let days = selectDueWarningDays(store.getState());
    return store.subscribe(() => {
      const next = selectDueWarningDays(store.getState());
      if (next === days) return;
      days = next;
      writeStorage(String(days));
    });
  }, [store]);

  return null;
};

export default RememberDueWarning;
