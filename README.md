# React Framage

![Logo](https://github.com/Uspel/react-framage/blob/main/images/logo.png)

Display specific portions of an image, and animate between frames.

## Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [useFramage](#useframage)
- [FramageElement](#framageelement)
- [Styling](#styling)

## Features

- Responsive
- Supports custom frame patterns/orders for animations
- 3 animation modes (`"loop"`, `"keep-on-last"`, `"destroy-after-last"`)
- Animation events (`onStart`, `onEnd`, `onDestroy`, `onChange`)
- No dependencies

## Installation

```shell
npm i react-framage
```

This library functions on major browsers such as Chrome, Edge, Firefox and Opera.

## Usage

### Demo.tsx:

```tsx
import Framage, { FramageElement } from "react-framage";

export function Demo({ src }) {
  const framage = useRef<FramageElement>(null);

  return (
    <Framage
      ref={framage}
      src="https://github.com/Uspel/react-framage/blob/main/images/demo.png"
      alt="Demo Image"
      view={{ width: 15, height: 15 }}
      animation={{
        frames: {
          amount: 10,
          // Creates a wave pattern
          // Would return [0,1,2,3,4,5,6,7,8,9,9,8,7,6,5,4,3,2,1,0] as there are 10 frames.
          pattern: f => [...f, ...[...f].reverse()]
        },
        step: 15,
        fps: 24, // Cannot be active at the same time as `frameDuration` - both control timing.
        mode: "loop",
        orientation: "horizontal",
        onChange(e) {
          console.log(`Frame ${e.frame} has arrived!`);
        }
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

- **`view:`** `object` - Portion of the source image visible.
  - **`width:`** `number` - Pixel width.
  - **`height:`** `number` - Pixel height.
  - **`left?:`** `number` - Initial X position of the view portion (from the left).
  - **`top?:`** `number` - Initial Y position of the view portion (from the top).
- **`animation?:`** [`FramageAnimation`](#framageanimation) or `false` _(default)_ - Settings for the component's animation - set to `false` for no animation.

---

### FramageAnimation

An `object` containing animation settings.

- **`frames:`** `object` - Animation's frame configuration.
  - **`amount:`** `number` - Number of frames in total on source.
  - **`pattern?:`** `number[]` or `(frames: number[]) => number[]` - Order to display frames in.
  - **`initial?:`** `number` - Frame to start on first mount.
- **`step:`** `number` - Number of pixels until next frame (usually view width).
- **`fps:`** `number` - Frames per second (cannot be active at the same times as `frameDuration`).
- **`frameDuration:`** `number` - Seconds per frame (cannot be active at the same times as `fps`).
- **`mode?:`** `"loop"` _(default)_, `"keep-on-last"` or `"destroy-after-last"` - How the animation cycles.
  - `"loop"` - repeats animation infinitely.
  - `"keep-on-last"` - once the last frame is reached, it will stay on that frame.
  - `"destroy-after-last"` - removes element when animation is complete.
- **`orientation?:`** `"horizontal"` _(default)_ or `"vertical"` - Direction the view portion moves in for each frame.
- **`onStart?:`** `(e: FramageEvent) => void` - Function to run on first frame.
- **`onEnd?:`** `(e: FramageEvent) => void` - Function to run on last frame.
- **`onDestroy?:`** `(e: FramageEvent) => void` - Function to run when animation is destroyed by the `"destroy-after-last"` mode.
- **`onChange?:`** `(e: FramageEvent) => void` - Function to run every frame change.

## useFramage

A custom hook used by `<Framage>`.

Returns an array containing the current frame index and a boolean representing whether or not the animation is destroyed.

- **`animation:`** [`FramageAnimation`](#framageanimation) or `false` _(default)_ - Animation settings, the same options as the `<Framage>` prop.
- **`element?:`** `HTMLElement` - An element to trigger events on. Prop event handlers do not require this.

```tsx
import { useFramage } from "react-framage";

function Demo({ animation }) {
  const [frame, isDestroyed] = useFramage(animation);

  return !isDestroyed && <p>Current frame: {frame}</p>;
}
```

## FramageElement

`<react-framage>` element created by `<Framage>` component.

Events useable in `addEventListener` etc:

- `"framageanimationstart"`
- `"framageanimationend"`
- `"framageanimationdestroy"`
- `"framageanimationchange"`

## Styling

Below is the default styling prepended to the `<head>` tag by React Framage:

```css
react-framage {
  display: inline-block;
  position: relative;
  overflow: hidden;
}
react-framage img {
  position: absolute;
  top: 0;
  left: 0;
}
```

#### Alternatively to CSS files, you can apply styling through the `style` prop:

```tsx
<Framage
  {...}
  style={{
    width: 100,
    height: 100,
    imageRendering: "pixelated",
    img: {
      /* Styles to apply to the <img> child element. */
    }
  }}
/>
```
