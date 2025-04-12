# Storybook Addon Inspector

Storybook addon for inspecting computed styles and css variables applied to an element.

1. Press the <kbd>i</kbd> key to enable the addon:

2. Hover over a DOM node

3. Storybook will display the computed styles and associated css variables of the selected element.

![](https://user-images.githubusercontent.com/42671/119589961-dff9b380-bda1-11eb-9550-7ae28bc70bf4.gif)

## Usage

This addon requires Storybook 6.3 or later. If you need to add it to your Storybook, you can run:

```sh
npm i -D @storybook/addon-inspector
```

Add `"@storybook/addon-inspector"` to the addons array in your `.storybook/main.js`:

```js
export default {
  addons: ["@storybook/addon-inspector"],
};
```

### Inspiration

- [Inspx](https://github.com/raunofreiberg/inspx) by Rauno Freiberg
- [Aaron Westbrook's script](https://gist.github.com/awestbro/e668c12662ad354f02a413205b65fce7)
- [Visbug](https://visbug.web.app/) from the Chrome team
