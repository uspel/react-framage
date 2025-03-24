# React Framage

![React Framage Logo](https://raw.githubusercontent.com/uspel/react-framage/main/logo.png)

Display portions of an image, flipbook animate between them and apply nineslice scaling!

## Contents

- [Features](#features)
- [Installation](#installation)
- [Animation](#animation)
- [Nineslice Scaling](#nineslice-scaling)
- [Props](#props)
- [Styling](#styling)
- [Hooks](#hooks)
  - [useFramageAnimation](#useframageanimation)
  - [useFramageImage](#useframageimage)

## Features

- Responsive
- 9-slice scaling
- Custom frame orders for animations
- Looping animations
- Removal of Framage when its animation ends
- Animation event handlers (`onStart`, `onEnd`, `onChange`)
- No dependencies

## Installation

```shell
npm i react-framage
```

This library functions on all major browsers such as Chrome, Edge, Firefox and Opera.

## Animation

### Demo.tsx

```tsx
import Framage from "react-framage";

export function Demo({ src }) {
  return (
    <Framage
      src={src}
      alt="Demo Image"
      view={{ width: 15, height: 15 }}
      animation={{
        frames: [0, 1, 2, 3, 2, 1], // Create an alternate/wave pattern
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

## Nineslice Scaling

### Demo.tsx

```tsx
import Framage from "react-framage";

export function Demo({ src }) {
  return (
    <Framage
      src={src}
      alt="Demo Image"
      view={{ width: 15, height: 15 }}
      nineslice={{
        top: 8,
        right: 16,
        bottom: 8,
        left: 8,
      }}
    />
  );
}
```

<br>

The displayed width of the outer slices can be controlled through the `--nineslice` and `--nineslice-*` CSS properties.

### style.css

```css
react-framage {
  --nineslice: 30px;
  --nineslice-right: 60px;
}
```

## Props

The `<Framage>` component supports all `<img>` props (e.g. `src`, `alt`, `srcset`) as well as:

- **view:** [`FramageView`](#framageview)

  Visible portion of source image.

- **animation?:** [`FramageAnimation`](#framageanimation)

  Framage animation configuration - if `undefined`, no animation is applied.

- **nineslice?:** [`FramageNineslice`](#framagenineslice)

  Enable 9-slice scaling for this Framage. Configures the width of the outer area with limited scaling.

### FramageView

An `object` defining the visible portion of the source image.

- **height:** `number`

  Height of portion in pixels, relative to source.

- **width:** `number`

  Width of portion in pixels, relative to source.

- **top?:** `number`

  Offset of portion from the top in pixels, relative to source.

- **left?:** `number`

  Offset of portion from the left in pixels, relative to source.

### FramageAnimation

An `object` containing animation settings.

- **frames:** `number | number[]`

  Animation's frame configuration.

  - Set to an array of numbers to configure timeline of `step`s. Each item represents the amount of `step`s taken across the source image.
  - Set to a number to move one step at a time for the specified amount of frames.

- **initial?:** `number`

  Frame index to start animation at.

- **step:** `number`

  Number of pixels until next frame, relative to source image (usually same as view width/height).

- **orientation:** `"horizontal" | "vertical"`

  Direction the view portion moves in for each `step`.

- **fps:** `number`

  Amount of frames to cycle through per second (frames per second).

- **loop?:** `boolean`

  Whether animation should repeat.

- **destroy?:** `boolean`

  Whether component should remove itself when animation ends.

- **key?:** `any`

  Restarts animation when value is updated.

- **onStart?:** `() => void`

  Function to run on the first frame.

- **onEnd?:** `() => void`

  Function to run at the end of the last frame.

- **onChange?:** `(frame: number) => void`

  Function to run every frame change.

### FramageNineslice

A `number` or `object` containing settings for 9-slice scaling. These values define how wide the outer slices are. A single `number` value will apply the same width to all sides.

- **top?:** `number`

  Height of the top row in pixels, relative to the source image.

- **right?:** `number`

  Width of the right column in pixels, relative to the source image.

- **bottom?:** `number`

  Height of the bottom row in pixels, relative to the source image.

- **left?:** `number`

  Width of the left row in pixels, relative to the source image.

## Styling

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

### Default Styling

To appear properly, this library adds some default styling to the custom `<react-framage>` and `<react-framage-slice>` elements. This is applied automatically and shouldn't be included within your own stylesheets.

Below is the default styling prepended to the `<head>` tag by Framage:

```css
react-framage,
react-framage-slice {
  position: relative;
  overflow: hidden;
}

react-framage {
  display: inline-block;
  width: var(--fallback-width);
  height: var(--fallback-height);
}

react-framage:where([ninesliced]) {
  display: inline-grid;
  grid-template-rows: var(--nineslice-top, var(--nineslice, var(--fallback-nineslice-top))) 1fr var(--nineslice-bottom, var(--nineslice, var(--fallback-nineslice-bottom)));
  grid-template-columns: var(--nineslice-left, var(--nineslice, var(--fallback-nineslice-left))) 1fr var(--nineslice-right, var(--nineslice, var(--fallback-nineslice-right)));
}

react-framage-slice {
  width: 100%;
  height: 100%;
}

react-framage img {
  position: absolute;
  left: 0;
  top: 0;
}
```

Custom `--fallback-*` properties are applied to the image wrapper element (`<react-framage>` or `<react-framage-slice>`) to ensure that the default styling appears correctly.

## Hooks

### useFramageAnimation

A custom hook used by `<Framage>`.

Returns an array containing the current frame index, steps taken and a boolean representing whether the Framage is destroyed.

- **animation?:** [`FramageAnimation`](#framageanimation)

<br>

```tsx
import { useFramageAnimation } from "react-framage";

function Demo({ animation }) {
  const [frame, steps, isDestroyed] = useFramageAnimation(animation);

  return <p>{!isDestroyed ? `Current frame index: ${frame}. ${steps} steps have been taken.` : "Animation go bye bye 😢"}</p>;
}
```

### useFramageImage

A custom hook used by `<Framage>`.

Controls the scaling and positioning on the `<img>` element.

- **wrapper:** `RefObject<HTMLElement>`
- **image:** `RefObject<HTMLImageElement>`
- **data:** `object`
  - **animation?:** [`FramageAnimation`](#framageanimation)
  - **frame:** `number`
  - **steps:** `number`
  - **view:** [`FramageView`](#framageview)

<br>

```tsx
import { useFramageAnimation, useFramageImage } from "react-framage";

function Demo({ src, animation, view }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  const [frame, steps] = useFramageAnimation(animation);

  useFramageImage(wrapper, image, {
    animation,
    frame,
    steps,
    view,
  });

  return (
    <div ref={wrapper}>
      <img ref={image} src={src} alt="Demo Image" />
    </div>
  );
}
```
