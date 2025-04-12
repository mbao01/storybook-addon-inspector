/**
 * to load the built addon in this test Storybook
 */
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function previewAnnotations(entry = []) {
  return [
    ...entry,
    resolve(__dirname, "../dist/preview.js"),
    resolve(__dirname, "../dist/style.css"),
  ];
}

function managerEntries(entry = []) {
  return [...entry, resolve(__dirname, "../dist/manager.js")];
}

export { managerEntries, previewAnnotations };
