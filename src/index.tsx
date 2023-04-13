import React, { useCallback, useEffect, useRef, useState } from "react";

if (!document.querySelector("style[data-framage-style]")) {
  const style = document.createElement("style");
  style.innerHTML = `react-framage {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: var(--framage-view-width);
  height: var(--framage-view-height);
}
react-framage img {
  position: absolute;
  left: 0;
  top: 0;
}
`;
  style.setAttribute("data-framage-style", "");
  document.head.prepend(style);
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /** Wrapper element for the `<Framage>` component. */
      "react-framage": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { frame: number; steps: number };
    }
  }
}

interface FramageAnimation {
  frames: number | number[];
  fps: number;
  step: number;
  orientation: "horizontal" | "vertical";
  initial?: number;
  loop?: boolean;
  destroy?: boolean;
  // Handlers
  onChange?(frame: number): void;
  onStart?(): void;
  onEnd?(): void;
}

type Framage = JSX.IntrinsicElements["img"] & {
  /** Visible portion of source image. */
  view?: {
    /** Width of portion in pixels, relative to source. */
    width?: number;
    /** Height of portion in pixels, relative to source. */
    height?: number;
    /** Offset of portion from the left in pixels, relative to source. */
    left?: number;
    /** Offset of portion from the top in pixels, relative to source. */
    top?: number;
  };
  /**
    Framage animation configuration.
    
    @version 2.0.0
    @see https://npmjs.com/package/react-framage#framageanimation
   */
  animation?: FramageAnimation;
};

/**
  A custom hook used by `<Framage>`.

  Returns an array containing the current frame index and a boolean representing whether the Framage is destroyed.
  
  @version 2.0.0
  @see https://npmjs.com/package/react-framage#useframage
 */
export function useFramage(animation?: FramageAnimation): [number, boolean] {
  const { frames, initial, loop, fps, destroy, ...handlers } = animation ?? ({} as FramageAnimation),
    // Values to return
    [frame, setFrame] = useState(initial ?? 0),
    [isDestroyed, setIsDestroyed] = useState(false),
    // Values to use in functions where state is not updated
    frameCount = typeof frames === "number" ? frames : frames?.length ?? 1,
    frameRef = useRef(initial ?? 0),
    intervalRef = useRef<NodeJS.Timer>();

  // Keep current frame up-to-date
  frameRef.current = frame;

  const toNextFrame = useCallback(() => {
    if (!animation) return;
    let nextFrame = loop && frameRef.current + 1 >= frameCount ? 0 : frameRef.current + 1;

    if (frameRef.current + 1 >= frameCount) {
      handlers.onEnd && handlers.onEnd();
    }
    if (nextFrame >= frameCount) {
      clearInterval(intervalRef.current);
      if (destroy) setIsDestroyed(true);
      return;
    }

    nextFrame === 0 && handlers.onStart && handlers.onStart();
    handlers.onChange && handlers.onChange(nextFrame);
    setFrame(nextFrame);
  }, [animation]);

  useEffect(() => {
    setFrame(initial ?? 0);
    setIsDestroyed(false);
    if (animation) {
      handlers.onStart && handlers.onStart();
      const interval = setInterval(toNextFrame, 1000 / fps);
      intervalRef.current = interval;
      return () => {
        clearInterval(interval);
      };
    }
    return undefined;
  }, [animation]);

  return [frame, isDestroyed];
}

/** 
 Move between portions of an image to create flipbook-like animations!

 @version 2.0.0
 @see https://npmjs.com/package/react-framage#usage
 */
export function Framage({ view, animation, ...imgAttributes }: Framage) {
  const img = useRef<HTMLImageElement>(null);
  const wrapper = useRef<HTMLElement>(null);

  const [frame, isDestroyed] = useFramage(animation);

  const frames = animation ? (typeof animation.frames === "number" ? Array.from({ length: animation.frames }, (_, i) => i) : animation.frames) : [0];

  const steps = frames[frame];

  function getImagePosition(inset: "top" | "left") {
    const isAnimationOrientation = animation && animation.orientation === (inset === "left" ? "horizontal" : "vertical");
    const stepSize = isAnimationOrientation ? animation.step * steps : 0;

    return ((stepSize + (view?.[inset] ?? 0)) / (img.current?.[inset === "left" ? "naturalWidth" : "naturalHeight"] || 0)) * -100 + "%";
  }

  function getImageSize(dimension: "width" | "height") {
    const viewSize = view?.[dimension];
    return wrapper.current && img.current && viewSize
      ? (wrapper.current[dimension === "width" ? "clientWidth" : "clientHeight"] / viewSize) *
          img.current[dimension === "width" ? "naturalWidth" : "naturalHeight"] +
          "px"
      : "0";
  }

  useEffect(() => {
    if (img.current) {
      img.current.style.transform = `translate(${getImagePosition("left")}, ${getImagePosition("top")})`;
    }
  }, [frame]);

  const setImageSize = () => {
    if (img.current) {
      img.current.style.width = getImageSize("width");
      img.current.style.height = getImageSize("height");
    }
  };

  const resizeObserver = new ResizeObserver(setImageSize);

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.style.setProperty("--framage-view-width", (view?.width ?? 0) + "px");
      wrapper.current.style.setProperty("--framage-view-height", (view?.height ?? 0) + "px");
      resizeObserver.observe(wrapper.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [view, isDestroyed]);

  return !isDestroyed ? (
    <react-framage steps={steps} frame={frame} ref={wrapper}>
      <img
        {...imgAttributes}
        ref={img}
        onLoad={(e) => {
          setImageSize();
          imgAttributes.onLoad && imgAttributes.onLoad(e);
        }}
      />
    </react-framage>
  ) : null;
}
