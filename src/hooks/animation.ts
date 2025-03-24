import { useCallback, useEffect, useRef, useState } from "react";
import { FramageAnimation } from "../types";

/**
  A custom hook used by `<Framage>`.

  Returns an array containing the current frame index, amount of steps taken and a boolean representing whether the Framage is destroyed.
  
  @version 4.0.0
  @see https://npmjs.com/package/react-framage#useframageanimation
 */
export default function useFramageAnimation(
  animation: FramageAnimation = { frames: 0, fps: 0, orientation: "horizontal", step: 0 },
): [number, number, boolean] {
  const { frames, initial, loop, fps, destroy, ...handlers } = animation ?? {},
    // Values to return
    [frame, setFrame] = useState(initial ?? 0),
    [isDestroyed, setIsDestroyed] = useState(false),
    // Values to use in functions where state is not updated
    frameCount = typeof frames === "number" ? frames : frames?.length ?? 1,
    frameRef = useRef(initial ?? 0),
    intervalRef = useRef<number>(null);

  // Keep current frame up-to-date
  frameRef.current = frame;

  const toNextFrame = useCallback(() => {
    if (!animation) return;

    let nextFrame = loop && frameRef.current + 1 >= frameCount ? 0 : frameRef.current + 1;

    if (frameRef.current + 1 >= frameCount) handlers.onEnd?.();

    if (nextFrame >= frameCount) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (destroy) return setIsDestroyed(true);
    }

    if (nextFrame === 0) handlers.onStart?.();
    handlers.onChange?.(nextFrame);

    setFrame(nextFrame);
  }, [animation]);

  useEffect(() => {
    setFrame(initial ?? 0);
    setIsDestroyed(false);

    if (!animation) return;

    handlers.onStart?.();

    if (fps <= 0) return;

    const interval = setInterval(toNextFrame, 1000 / fps);
    intervalRef.current = interval;

    return () => clearInterval(interval);
  }, [animation?.key]);

  const steps = animation ? (typeof animation.frames === "number" ? frame : animation.frames[frame]) : 0;

  return [frame, steps, isDestroyed];
}
