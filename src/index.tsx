import React, { useEffect, useState } from 'react';

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
}: {
  src: string | string[];
  alt?: string;
  rendering?:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | '-moz-crisp-edges'
    | '-webkit-optimize-contrast'
    | 'auto'
    | 'crisp-edges'
    | 'pixelated';
  loading?: 'eager' | 'lazy';
  draggable?: 'true' | 'false';
  width: number;
  height: number;
  uv: { width: number; height: number; originX?: number; originY?: number };
  base: { width: number; height: number };
  animation?:
    | {
        frames: number | number[];
        frameStep: number;
        frameDuration?: number;
        fps?: number;
        mode?: 'loop' | 'keep-on-last' | 'destroy-after-last';
        orientation?: 'horizontal' | 'vertical';
        onStart?: () => void;
        onEnd?: () => void;
        onFrameChanged?: () => void;
        onFrame?: { frame: number; action: () => void };
      }
    | false;
}): JSX.Element {
  const originX = uv.originX ? uv.originX : 0;
  const originY = uv.originY ? uv.originY : 0;
  const [b, setB] = useState(originY * (height / uv.height));
  const [l, setL] = useState(originX * (width / uv.width));
  const [destroyed, setDestroyed] = useState(false);
  const [frame, setFrame] = useState(0);

  function changeFrame() {
    if (animation && animation.fps !== 0) {
      const lastFrame =
        (animation.frames instanceof Array
          ? animation.frames.length
          : animation.frames) - 1;
      setFrame(
        animation.mode === 'loop' && frame >= lastFrame
          ? 0
          : animation.mode === 'keep-on-last' && frame === lastFrame
          ? lastFrame
          : frame + 1
      );

      const nextFrame =
        animation.mode === 'loop' && frame >= lastFrame
          ? 0
          : animation.mode === 'keep-on-last' && frame === lastFrame
          ? lastFrame
          : frame + 1;

      if (animation.orientation === 'vertical') {
        setB(
          animation.frameStep *
          (height / uv.height) * // Convert framestep into px
            (animation.frames instanceof Array
              ? animation.frames[nextFrame]
              : nextFrame) + // Apply current frame
            originY * (height / uv.height)
        );
        setL(originX * (width / uv.width));
      } else if (animation.orientation === 'horizontal') {
        setL(
          animation.frameStep *
          (width / uv.width) * // Convert framestep into px
            (animation.frames instanceof Array
              ? animation.frames[nextFrame]
              : nextFrame) + // Apply current frame
            originX * (width / uv.width)
        );
        setB(originY * (height / uv.height));
      }

      if (animation.mode !== 'destroy-after-last' && frame > lastFrame) {
        setFrame(0);
        setDestroyed(false);
      }
      if (animation.mode === 'destroy-after-last' && frame > lastFrame) {
        setDestroyed(true);
      }

      setTimeout(() => {
        if (animation.onFrameChanged) {
          animation.onFrameChanged();
        }
        if (frame === lastFrame && animation.onEnd) {
          animation.onEnd();
        }
        if (frame === 0 && animation.onStart) {
          animation.onStart();
        }
        if (
          animation.onFrame &&
          animation.onFrame.action &&
          animation.onFrame.frame === frame
        ) {
          animation.onFrame.action();
        }
      }, 1);
    }
  }

  useEffect(() => {
    // Errors and onStart after component load
    if (animation && animation.onStart) {
      animation.onStart();
    }
    if (
      animation &&
      animation.frameDuration !== undefined &&
      animation.fps !== undefined
    ) {
      console.error(
        "'animation.fps' and 'animation.frameDuration' should not both be defined."
      );
    }
    if (
      animation &&
      animation.frameDuration === undefined &&
      animation.fps === undefined
    ) {
      console.error(
        "'animation.fps' or 'animation.frameDuration' should be defined."
      );
    }
  }, [animation]);
  function setDefaults() {
    setB(originY * (height / uv.height));
    setL(originX * (width / uv.width));
    setFrame(0);
  }
  useEffect(() => {
    // Trigger frame change
    if (animation) {
      const s = setInterval(
        () => {
          changeFrame();
        },
        animation.frameDuration !== undefined
          ? animation.frameDuration * 1000 // Seconds per frame
          : animation.fps
          ? 1000 / animation.fps // Frames per second
          : 1
      );
      return () => clearInterval(s);
    } else {
      setDefaults();
      return undefined;
    }
  });

  return !destroyed && !(src instanceof Array) ? (
    <Img
      frame={frame}
      src={src}
      alt={alt}
      loading={loading}
      draggable={draggable}
      width={width}
      height={height}
      base={base}
      uv={uv}
      b={b}
      l={l}
      rendering={rendering}
    />
  ) : !destroyed && src instanceof Array ? ( // Map images if an array is used
    <>
      {src.map((src, i) => (
        <Img
          key={i}
          frame={frame}
          src={src}
          alt={alt}
          loading={loading}
          draggable={draggable}
          width={width}
          height={height}
          base={base}
          uv={uv}
          b={b}
          l={l}
          rendering={rendering}
        />
      ))}
    </>
  ) : null; // Returns null if destroyed
}

function Img(props: {
  frame: number;
  width: number;
  height: number;
  src: string;
  alt: string;
  loading: 'eager' | 'lazy';
  draggable: 'true' | 'false';
  base: { width: number; height: number };
  uv: { width: number; height: number };
  rendering:
    | '-moz-initial'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'unset'
    | '-moz-crisp-edges'
    | '-webkit-optimize-contrast'
    | 'auto'
    | 'crisp-edges'
    | 'pixelated';
  b: number;
  l: number;
}): JSX.Element {
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
          top: '-' + props.b + 'px',
          left: '-' + props.l + 'px',
        }}
      />
    </react-texture-atlas>
  );
}
