import { useEffect, useState } from 'react';
import { TextureAtlasAnimation } from '../types';

export default function useTextureAtlas(
  width: number,
  height: number,
  uv: { width: number; height: number; originX?: number; originY?: number },
  animation: TextureAtlasAnimation
): [
  // frame
  number,
  // left
  number,
  // top
  number,
  // isDestroyed
  boolean
] {
  const originX = uv.originX ? uv.originX : 0;
  const originY = uv.originY ? uv.originY : 0;
  const [frame, setFrame] = useState(0);
  const [l, setL] = useState(originX * (width / uv.width));
  const [t, setT] = useState(originY * (height / uv.height));
  const [isDestroyed, setIsDestroyed] = useState(false);

  function changeFrame() {
    // Final frame index
    const finalFrame =
      animation &&
      (animation.frames instanceof Array
        ? animation.frames.length
        : animation.frames) - 1;

    // Frame being changed to
    const nextFrame =
      animation &&
      (animation.mode === 'loop' && frame >= finalFrame
        ? 0
        : animation.mode === 'keep-on-last' && frame === finalFrame
        ? finalFrame
        : frame + 1);

    // Get position of UV
    function uvPosition(orientation: 'horizontal' | 'vertical') {
      const outputType = orientation === 'horizontal' ? width : height;
      const uvType = orientation === 'horizontal' ? uv.width : uv.height;
      return (
        animation &&
        animation.frameStep *
        (outputType / uvType) * // Convert framestep into px
          (animation.frames instanceof Array
            ? animation.frames[nextFrame]
            : nextFrame) + // Apply current frame
          originY * (outputType / uvType)
      );
    }
    if (animation && animation.fps !== 0) {
      if (animation.mode !== 'destroy-after-last') {
        setIsDestroyed(false);
      }
      if (animation.mode === 'destroy-after-last' && nextFrame > finalFrame) {
        setIsDestroyed(true);
        animation.onDestroy && animation.onDestroy();
        return null;
      }

      // Changing frame to next frame
      setFrame(nextFrame);

      // Setting uv position
      switch (animation.orientation) {
        case 'vertical':
          setT(uvPosition('vertical'));
          setL(originX * (width / uv.width));
          break;
        case 'horizontal':
          setL(uvPosition('horizontal'));
          setT(originY * (height / uv.height));
          break;
        default:
          console.error(
            "'animation.orientation' must be one of 'horizontal' or 'vertical'."
          );
      }

      // ---------------
      //    Handlers
      // ---------------

      // onStart
      nextFrame === 0 && animation.onStart && animation.onStart();
      // onEnd
      nextFrame === finalFrame && animation.onEnd && animation.onEnd();
      // onChange
      animation.onChange && animation.onChange(nextFrame);

      // Depricated
      animation.onFrameChanged && animation.onFrameChanged(nextFrame);
      animation.onFrame &&
        animation.onFrame.action &&
        animation.onFrame.frame === nextFrame &&
        animation.onFrame.action();
    }
  }

  useEffect(() => {
    if (animation) {
      // onStart after component mount
      animation.onStart && animation.onStart();
      // Errors
      animation.frameDuration !== undefined &&
        animation.fps !== undefined &&
        console.error(
          "'animation.fps' and 'animation.frameDuration' should not both be defined."
        );
      animation.frameDuration === undefined &&
        animation.fps === undefined &&
        console.error(
          "One of 'animation.fps' or 'animation.frameDuration' should be defined."
        );
    }
  }, [animation]);
  function setDefaults() {
    setT(originY * (height / uv.height));
    setL(originX * (width / uv.width));
    setFrame(0);
  }
  useEffect(() => {
    // Trigger frame change
    if (animation) {
      const s = setInterval(
        () => changeFrame(),
        animation.frameDuration !== undefined
          ? animation.frameDuration * 1000 // Seconds per frame
          : animation.fps !== undefined
          ? 1000 / animation.fps // Frames per second
          : 1
      );
      isDestroyed && clearInterval(s);
      return () => clearInterval(s);
    } else {
      setDefaults();
      return undefined;
    }
  });

  return [frame, l * -1, t * -1, isDestroyed];
}
