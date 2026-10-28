// Test hook for AYON's error boundaries around slot contributions: list contributions as
// <slot area>.<id> (or "*") in localStorage and those components throw when they render.
//   localStorage.setItem("addon-full-template:throw", "project.comments")
// AYON should show an error in the contribution's own area and keep the rest working.
const THROW_KEY = "addon-full-template:throw";

export const throwIfRequested = (id: string) => {
  const ids = (localStorage.getItem(THROW_KEY) || "").split(",");
  if (ids.includes(id) || ids.includes("*")) {
    throw new Error(`"${id}" threw on purpose (${THROW_KEY})`);
  }
};
