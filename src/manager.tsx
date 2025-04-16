import { addons, types } from "@storybook/manager-api";

import { Tool } from "./components";
import { ADDON_ID, TOOL_ID } from "./constants";

export default addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Inspector",
    match: ({ viewMode, tabId }) => !tabId && viewMode === "story",
    render: () => <Tool />,
  });
});
