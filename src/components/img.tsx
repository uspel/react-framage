import React from 'react';
import { TextureAtlasImg } from '../types';

export default function Img(props: TextureAtlasImg): JSX.Element {
  return (
    <react-texture-atlas
      frame={props.frame}
      style={{
        width: props.width,
        height: props.height,
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-flex',
        verticalAlign: 'middle',
      }}
    >
      <img
        src={props.src}
        alt={props.alt}
        loading={props.loading}
        draggable={props.draggable}
        style={{
          width: props.width * (props.base.width / props.uv.width),
          height: props.height * (props.base.height / props.uv.height),
          imageRendering: props.rendering,
          position: 'absolute',
          top: props.t,
          left: props.l,
        }}
      />
    </react-texture-atlas>
  );
}
