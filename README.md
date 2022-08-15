# React Texture Atlas

![Logo](https://react-texture-atlas.quazchick.com/logo-small.png)

Display specific portions of an image, and animate between sprites.

[Desktop Atlas and Animation Editor](https://react-texture-atlas.quazchick.com)
[![Editor Preview Image](https://react-texture-atlas.quazchick.com/preview-1.1.0.png)](https://react-texture-atlas.quazchick.com)

## Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)

## Features

- Supports custom frame patterns/orders for animations
- 3 animation modes (`loop`, `keep-on-last`, `destroy-after-last`)
- Animation events (`onStart`, `onEnd`, `onFrameChanged`)
- No dependencies

## Installation

```console
npm i react-texture-atlas
```

This library functions on major browsers such as Chrome, Edge, Firefox and Opera.

## Usage

```tsx
import TextureAtlas from 'react-texture-atlas';
```

This component contains an `img` element. Do not style this element (size etc.) as it may stop the component from functioning.

## Example

```tsx
import TextureAtlas from 'react-texture-atlas';

export function Demo({ src }) {
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
        // Place UV 10px from the left and 5px from the top of the source image.
        originX: 10,
        originY: 5,
      }}
      base={{
        width: 120,
        height: 16,
      }}
      animation={{
        frames: 10,
        // Move UV across 12px for each frame.
        frameStep: 12,
        // 'frameDuration' may be used instead of 'fps'.
        fps: 30,
        mode: 'loop',
        orientation: 'horizontal',
        // Display the frame on every frame change
        onChange: f => console.log(`Yay! Frame ${f} has arrived.`),
      }}
    />
  );
}
```

## Props

| Prop      | Type                                                                                 | Default Value | Description                                                                                                                                                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src       | `string \| string[]`                                                                 |               | URL source of the image - can be an array of sources, creating multiple atlases with the same settings.                                                                                                                                                                                                             |
| alt       | `string`                                                                             | `""`          | Alternate text for image.                                                                                                                                                                                                                                                                                           |
| rendering | [`ImageRendering`](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering) | `"auto"`      | CSS `image-rendering`.                                                                                                                                                                                                                                                                                              |
| loading   | `"eager" \| "lazy"`                                                                  | `"eager"`     | Image Loading.                                                                                                                                                                                                                                                                                                      |
| draggable | `"true" \| "false"`                                                                  | `"true"`      | Image Draggability.                                                                                                                                                                                                                                                                                                 |
| width     | `number`                                                                             |               | Pixel width of the atlas' output (output size ratio should be the same as UV size ratio).                                                                                                                                                                                                                           |
| height    | `number`                                                                             |               | Pixel height of the atlas' output (output size ratio should be the same as UV size ratio).                                                                                                                                                                                                                          |
| uv        | `object`                                                                             |               | Portion of the source image visible. <hr> _@param_ `width: number` - Pixel width of the UV. <br> _@param_ `height: number` - Pixel height of the UV. <br> _@param_ `originX: number` - Initial X position of the UV (from the left). <br> _@param_ `originY: number` - Initial Y position of the UV (from the top). |
| base      | `object`                                                                             |               | Dimensions of the source image. <hr> _@param_ `width: number` - Pixel width of the source. <br> _@param_ `height: number` - Pixel height of the source.                                                                                                                                                             |
| animation | [`TextureAtlasAnimation \| false`](#textureatlasanimation)                           | `false`       | Settings for the atlas' animation - set to `false` for no animation.                                                                                                                                                                                                                                                |

---

### TextureAtlasAnimation

An `object` containing animation settings.

| Param                | Type                                               | Default Value | Description                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| frames               | `number \| number[]`                               |               | Number of frames for the animation or array of frames as a pattern. <br><br> A value of the number `3` would have the same result as an array of `[0, 1, 2]`.                                                                       |
| frameStep            | `string`                                           |               | Number of pixels the UV moves across the source image.                                                                                                                                                                              |
| frameDuration        | `number`                                           |               | Seconds per frame - cannot be active at the same times as `fps`.                                                                                                                                                                    |
| fps                  | `number`                                           |               | Frames per second - cannot be active at the same times as `frameDuration`.                                                                                                                                                          |
| mode                 | `"loop" \| "keep-on-last" \| "destroy-after-last"` | `"loop"`      | How the animation behaves. <hr> `"loop"` - repeats frames infinitely. <br> `"keep-on-last"` - once the last frame is reached, it will stay on that frame. <br> `"destroy-after-last"` - removes element when animation is complete. |
| orientation          | `"horizontal" \| "vertical"`                       |               | X/Y direction the UV moves in for each frame.                                                                                                                                                                                       |
| onStart              | `() => void`                                       |               | Function to run on first frame.                                                                                                                                                                                                     |
| onEnd                | `() => void`                                       |               | Function to run on last frame.                                                                                                                                                                                                      |
| onDestroy            | `() => void`                                       |               | Function to run when atlas is destroyed by the `"destroy-after-last"` mode.                                                                                                                                                         |
| onChange             | `(frame: number) => void`                          |               | Function to run every frame change. <hr> _@param_ `frame: number` - Current frame of the atlas                                                                                                                                      |
| _~~onFrameChanged~~_ | `(frame: number) => void`                          |               | Function to run every frame change. <hr> _@deprecated_ - Use `onChange` instead. <br> _@param_ `frame: number` - Current frame of the atlas                                                                                         |
| _~~onFrame~~_        | `object`                                           |               | Function to run on a specific frame. <hr> _@deprecated_ - Functionality replaced by `onChange`. <br> _@param_ `frame: number` - Frame function runs on. <br> _@param_ `action: () => void` - Function to run.                       |
