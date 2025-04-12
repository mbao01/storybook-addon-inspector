import { global } from "@storybook/global";

export const getElementFromPoint = (x: number, y: number) => {
  const element = global.document.elementFromPoint(x, y) as HTMLElement;

  const crawlShadows = (node: HTMLElement) => {
    if (node && node.shadowRoot) {
      // elementFromPoint() doesn't exist in ShadowRoot type
      const nestedElement = node.shadowRoot.elementFromPoint(
        x,
        y,
      ) as HTMLElement;

      // Nested node is same as the root one
      if (node.isEqualNode(nestedElement)) {
        return node;
      }
      // The nested node has shadow DOM too so continue crawling
      if (nestedElement.shadowRoot) {
        return crawlShadows(nestedElement);
      }
      // No more shadow DOM
      return nestedElement;
    }

    return node;
  };

  const shadowElement = crawlShadows(element);
  const node = shadowElement || element;

  const parentNode = document.getElementById("storybook-root");

  if (parentNode !== node && parentNode.contains(node)) {
    return node;
  }

  return null;
};
