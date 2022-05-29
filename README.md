# React Texture Atlas

Display specific portions of an image, and animate between sprites.

[Desktop Atlas Editor/Demo](https://react-texture-atlas.quazchick.com)
[![Desktop Atlas Editor/Demo](https://assets.quazchick.com/react-texture-atlas/editor.png)](https://react-texture-atlas.quazchick.com)

## Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

## Features

- Supports custom frame patterns/orders for animations
- 3 animation modes (`loop`, `keep-on-last`, `destroy-after-last`)
- Animation events (`onStart`, `onEnd`, `onFrameChanged`, `onFrame`)
- No dependencies

## Installation

```
npm i react-texture-atlas
```

This library should function on major browsers such as Chrome, Edge and Firefox, but has not been tested on Internet Explorer.

## Usage

```js
import TextureAtlas from 'react-texture-atlas';
```

This component contains an `img` element. Do not style this element (size etc.) as it may stop the component from functioning.

## Example

```tsx
import TextureAtlas from 'react-texture-atlas';

function Demo({ src }) {
  return (
    <TextureAtlas
      src={src}
      alt="Demo animation"
      rendering="pixelated"
      loading="lazy"
      draggable="false"
      width={200}
      height={200}
      uv={{
        width: 12,
        height: 16,
        originX: 0,
        originY: 0,
      }}
      base={{
        width: 120,
        height: 16,
      }}
      animation={{
        frames: 10,
        frameStep: 12,
        //  frameDuration | Only one of "fps" or "frameDuration" allowed
        fps: 30,
        mode: 'loop',
        orientation: 'horizontal',
        onStart: () => handleFirstFrame(),
        onEnd: () => handleLastFrame(),
        onFrameChanged: () => handleFrameChanged(),
        onFrame: {
          frame: 5,
          action: () => handleFrame5(),
        },
      }}
    />
  );
}
```

## Props

**`src: string | string[]`**

URL source of the image - can be an array of sources creating tiled atlases with the same settings.

---

**`alt?: string`**

Alternate text for image (defaults to `""`)

---

**`rendering?: '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | '-moz-crisp-edges' | '-webkit-optimize-contrast' | 'auto' | 'crisp-edges' | 'pixelated'`**

Image rendering (defaults to `auto`)

---

**`loading?: 'eager' | 'lazy'`**

Image loading (defaults to `eager`)

---

**`draggable?: 'true' | 'false'`**

Image draggability (defaults to `true`)

---

**`width: number`**

Pixel width of the atlas' output (output size ratio should be the same as UV size ratio)

---

**`height: number`**

Pixel height of the atlas' output

---

**`uv: { ... }`**

Portion of the source image visible:

- `width: number`

Pixel width of the UV

- `height: number`

Pixel height of the UV

- `originX?: number`

X position of the UV (from the left) - (default to `0`)

- `originY?: number`

Y position of the UV (from the top) - (defaults to `0`)

---

**`base: { ... }`**

Dimensions of the source image

- `width: number`

Pixel width of the source

- `height: number`

Pixel height of the source

---

**`animation?: { ... } | false`**

Settings for the atlas' animation (defaults to `false` (no animation))

- `frames: number | number[]`

  Number of frames for the animation or array of frames as a pattern.<br>
  E.g. `10` = `[0,1,2,3,4,5,6,7,8,9]`

- `frameStep: number`

  Number of pixels the UV moves across the source image

- `frameDuration?: number`

  Seconds per frame - cannot be active at the same time as `fps`

- `fps?: number`

  Frames per second - cannot be active at the same times as `frameDuration`

- `mode?: 'loop' | 'keep-on-last' | 'destroy-after-last'`

  How the animation behaves (defaults to `loop`)

  - `loop` - repeats frames infinitely
  - `keep-on-last` - once the last frame is reached, it will stay on that frame
  - `destroy-after-last` - removes element when animation is complete

- `orientation?: 'horizontal' | 'vertical'`

  X/Y direction the UV moves in `frameStep`s for each frame

- `onStart?: () => void`

  Function to run on first frame

- `onEnd?: () => void`

  Function to run on last frame

- `onFrameChanged?: () => void`

  Function to run every frame change

- `onFrame?: { ... }`

  Function to run on a specific frame

  - `frame: number`

  Frame function runs on

  - `action: () => void`

  Function to run
