/** Based on https://gist.github.com/awestbro/e668c12662ad354f02a413205b65fce7 */
import { draw } from "./canvas";
import { drawBoxModel } from "./helpers";



export function drawSelectedElement(element: HTMLElement) {
  draw("selected", drawBoxModel(element));
}

export function drawHoverElement(element: HTMLElement | null) {
  draw("hover", drawBoxModel(element));
}
