# React Framage

![React Framage Logo](https://github.com/Uspel/react-framage/blob/main/logo.png)

Move between portions of an image to create flipbook-like animations!

## Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Styling](#styling)
- [useFramage Hook](#useframage)

## Features

- Responsive
- Supports custom frame patterns/orders for animations
- Toggle looping animations
- Toggle the removal of Framage when its animation ends
- Animation event handlers (`onStart`, `onEnd`, `onChange`)
- No dependencies

## Installation

```shell
npm i react-framage
```

This library functions on major browsers such as Chrome, Edge, Firefox and Opera.

## Usage

### Demo.tsx:

```tsx
import { Framage } from "react-framage";

export function Demo({ src }) {
  return (
    <Framage
      src={src}
      alt="Demo Image"
      view={{ width: 15, height: 15 }}
      animation={{
        // Create an alternate/wave pattern
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        fps: 24,
        step: 15,
        orientation: "horizontal", // Step horizontally across source image
        loop: true,
        onChange: (frame) => console.log(`Frame ${frame} has arrived!`),
      }}
    />
  );
}
```

### style.css:

```css
react-framage {
  width: 100px;
  height: 100px;
  image-rendering: pixelated;
}
react-framage img {
  /* Avoid applying styles to the <img> child element as conflicts may emerge. */
}
```

## Props

The `<Framage>` component supports all `<img>` props (e.g. `src`, `alt`, `srcset`) as well as:

- **`view?:`** `object` - Visible portion of source image.
  - **`width?:`** `number` - Width of portion in pixels, relative to source.
  - **`height?:`** `number` - Height of portion in pixels, relative to source.
  - **`left?:`** `number` - Offset of portion from the left in pixels, relative to source.
  - **`top?:`** `number` - Offset of portion from the top in pixels, relative to source.
- **`animation?:`** [`FramageAnimation`](#framageanimation) - Framage animation configuration - if `undefined`, no animation is applied.

---

### FramageAnimation

An `object` containing animation settings.

- **`frames:`** `number | number[]` - Animation's frame configuration.
  - Set to an array of numbers to configure timeline of `step`s. Each item represents the amount of `step`s taken across the source image.
  - Set to a number to move one step at a time for the specified amount of frames
- **`step:`** `number` - Number of pixels until next frame, relative to source image (usually same as view width/height).
- **`orientation:`** `"horizontal" | "vertical"` - Direction the view portion moves in for each `step`.
- **`fps:`** `number` - Amount of frames to cycle through per second (frames per second).
- **`loop?:`** `boolean` - Whether animation should repeat.
- **`destroy?:`** `boolean` - Whether component should remove itself when animation ends.
- **`onStart?:`** `() => void` - Function to run on the first frame.
- **`onEnd?:`** `() => void` - Function to run at the end of the last frame.
- **`onChange?:`** `(frame: number) => void` - Function to run every frame change.

## Styling

Below is the default styling prepended to the `<head>` tag by Framage:

```css
react-framage {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: var(--framage-view-width);
  height: var(--framage-view-height);
}
react-framage img {
  position: absolute;
  left: 0;
  top: 0;
}
```

The custom properties `--framage-view-width` and `--framage-view-height` are automatically set on the `<Framage>` component, representing the values passed through props.

## useFramage

A custom hook used by `<Framage>`.

Returns an array containing the current frame index and a boolean representing whether the Framage is destroyed.

- **`animation?:`** [`FramageAnimation`](#framageanimation) - Animation settings, the same options as the `<Framage>` prop.

```tsx
import { useFramage } from "react-framage";

function Demo({ animation }) {
  const [frame, isDestroyed] = useFramage(animation);

  return !isDestroyed ? <p>Current frame: {frame}</p> : <p>Animation go bye bye 😢</p>;
}
```
