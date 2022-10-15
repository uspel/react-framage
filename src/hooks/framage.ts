/// <reference path="../types.ts"/>
import { useEffect, useRef, useState } from "react";
/** A custom hook used by `<Framage>`.

  Returns an array containing the current frame index and a boolean representing whether or not the animation is destroyed.
  @param animation Animation settings, the same options as the `<Framage>` prop.
  @param element `HTMLElement` to trigger events on. Prop event handlers do not require this.
  @version 1.0.0
  @see https://npmjs.com/package/react-framage#useframage
 */
export function useFramage(
  animation: FramageAnimation,
  element?: HTMLElement
): [number, boolean] {
  const [frame, setFrame] = useState(
    (animation && animation.frames.initial) ?? 0
  );
  const [isDestroyed, setIsDestroyed] = useState(false);
  const interval = useRef<NodeJS.Timer | undefined>();

  const frames = Array.from(
    { length: animation && animation.frames.amount },
    (_, i) => i
  );
  const pattern =
    animation &&
    (animation.frames.pattern
      ? typeof animation.frames.pattern === "function"
        ? animation.frames.pattern(frames)
        : animation.frames.pattern
      : frames);

  // Final frame index
  const finalFrame = pattern.length - 1;

  function triggerEvent(
    type: "start" | "end" | "destroy" | "change",
    nextFrame: number
  ) {
    // Event running
    const e = new Event("framageanimation" + type) as FramageEvent;
    // Amount of steps taken after frame change
    const nextSteps = pattern[nextFrame];
    e.frame = nextFrame;
    e.steps = nextSteps;
    element?.dispatchEvent(e);
    const eventProp = "on" + type.charAt(0).toUpperCase() + type.slice(1);
    animation && animation[eventProp] && animation[eventProp](e);
  }

  function changeFrame() {
    // Frame being changed to
    const nextFrame =
      animation &&
      (animation.mode === "loop" && frame >= finalFrame
        ? 0
        : animation.mode === "keep-on-last" && frame === finalFrame
        ? finalFrame
        : frame + 1);
    if (animation && animation.fps !== 0) {
      // ---------------
      //   Destruction
      // ---------------

      if (animation.mode !== "destroy-after-last") {
        isDestroyed && setIsDestroyed(false);
      }
      if (animation.mode === "destroy-after-last" && nextFrame > finalFrame) {
        if (!isDestroyed) {
          setIsDestroyed(true);
          clearInterval(interval.current);
          triggerEvent("destroy", nextFrame);
        }
        return;
      }

      if (
        !isDestroyed &&
        !(animation.mode === "keep-on-last" && frame === finalFrame)
      ) {
        // ---------------
        //  Change Frame
        // ---------------

        setFrame(nextFrame);

        // ---------------
        //    Handlers
        // ---------------

        // onStart
        nextFrame === 0 && triggerEvent("start", nextFrame);
        // onChange
        triggerEvent("change", nextFrame);
        // onEnd
        nextFrame >= finalFrame && triggerEvent("end", nextFrame);
      }
    }
  }
  const firstMount = useRef(true);
  useEffect(() => {
    if (animation) {
      if (firstMount.current) {
        // ---------------
        // Mount Handlers
        // ---------------

        // onStart
        triggerEvent("start", frame);
        // onEnd
        frame === finalFrame && triggerEvent("end", frame);

        // Future mounts will not be the first
        firstMount.current = false;
      }
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
    setFrame((animation && animation.frames.initial) ?? 0);
  }
  useEffect(() => {
    // Trigger frame change
    if (animation && !isDestroyed) {
      interval.current = setInterval(
        changeFrame,
        animation.frameDuration !== undefined
          ? animation.frameDuration * 1000 // Seconds per frame
          : animation.fps !== undefined
          ? 1000 / animation.fps // Frames per second
          : 1
      );
      return () => clearInterval(interval.current);
    } else {
      setDefaults();
      return undefined;
    }
  });

  return [frame, isDestroyed];
}
