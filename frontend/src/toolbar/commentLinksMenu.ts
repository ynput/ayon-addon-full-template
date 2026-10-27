import { toast, type AddonMenuItem, type SlotContext } from "@ynput/ayon-addon";
import { throwIfRequested } from "@/testing";

// The comment links button in the project tables' toolbar (projectTable.toolbarItem, see
// src/manifest.ts). It sets `menu`: AYON opens its own menu under the button with these items,
// built each time it opens.
const commentLinksMenu = ({ projectName }: SlotContext<"projectTable.toolbarItem">): AddonMenuItem[] => {
  throwIfRequested("toolbar.comment_links");
  const pageUrl = `/projects/${projectName}/comments`;
  return [
    { id: "open", label: "Open the Comments page", icon: "chat", to: pageUrl },
    {
      id: "copy",
      label: "Copy the Comments page link",
      icon: "add_link",
      onClick: async () => {
        await navigator.clipboard.writeText(`${window.location.origin}${pageUrl}`);
        toast.success("Link copied");
      },
    },
  ];
};

export default commentLinksMenu;
