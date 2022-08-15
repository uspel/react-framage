import React from 'react';
import useTextureAtlas from './hooks/textureAtlas';
import Img from './components/img';
import { TextureAtlasProps } from './types';

export default function TextureAtlas({
  src = '',
  alt = '',
  rendering = 'auto',
  loading = 'eager',
  draggable = 'true',
  width,
  height,
  uv = { width: 0, height: 0, originX: 0, originY: 0 },
  base = { width: 0, height: 0 },
  animation = false,
}: TextureAtlasProps): JSX.Element {
  // Handles frame changing and image x, y positions
  const [frame, l, t, isDestroyed] = useTextureAtlas(
    width,
    height,
    uv,
    animation
  );

  const imgProps = {
    frame,
    l,
    t,
    alt,
    loading,
    rendering,
    draggable,
    width,
    height,
    base,
    uv,
  };

  return !isDestroyed && !(src instanceof Array) ? (
    // Display atlas with singular src
    <Img src={src} {...imgProps} />
  ) : !isDestroyed && src instanceof Array ? (
    // Map images if an array is used as src
    <>
      {src.map((src, i) => (
        <Img key={i} src={src} {...imgProps} />
      ))}
    </>
  ) : null; // Returns null when destroyed by the "destroy-after-last" mode.
}
