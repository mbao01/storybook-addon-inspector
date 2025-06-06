import { memo, useCallback, useEffect } from "react";

import { EyeIcon } from "@storybook/icons";
import { IconButton } from "@storybook/components";
import { useGlobals, useStorybookApi } from "@storybook/manager-api";

import { ADDON_ID, PARAM_KEY, TOOL_ID } from "../constants";

export const Tool = memo(function InspectorToolAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const isActive = globals?.[PARAM_KEY];
  const api = useStorybookApi();

  const toggleInspector = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isActive,
    });
  }, [updateGlobals, isActive]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: "Toggle Inspector [P]",
      defaultShortcut: ["P"],
      actionName: "inspector",
      showInMenu: false,
      action: toggleInspector,
    });
  }, [toggleInspector, api]);

  return (
    <IconButton
      key={TOOL_ID}
      active={isActive}
      title="Enable inspector"
      onClick={toggleInspector}
    >
      <EyeIcon />
    </IconButton>
  );
});
