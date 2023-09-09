import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

if (!document.querySelector("style[data-framage-style]")) {
  const style = document.createElement("style");
  style.innerHTML = `react-framage {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: var(--framage-view-width);
  height: var(--framage-view-height);
}

react-framage[ninesliced] {
  display: inline-grid;
}

react-framage-slice {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

react-framage img {
  position: absolute;
  left: 0;
  top: 0;
}`;
  style.setAttribute("data-framage-style", "");
  document.head.prepend(style);
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /** Wrapper element for the `<Framage>` component. */
      "react-framage": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { frame: number; steps: number; ninesliced?: "" };
      "react-framage-slice": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export type FramageNineslice =
  | number
  | {
      /** Width of top border in pixels, relative to source. */
      top?: number;
      /** Width of left border in pixels, relative to source. */
      left?: number;
      /** Width of bottom border in pixels, relative to source. */
      bottom?: number;
      /** Width of right border in pixels, relative to source. */
      right?: number;
    };

export interface FramageAnimation {
  /** Animation's frame configuration.
   * - Set to an array of numbers to configure timeline of steps. Each item represents the amount of `step`s taken across the source image.
   * - Set to a number to move one `step` at a time for the specified amount of frames. */
  frames: number | number[];
  /** Frame index to start animation at. */
  initial?: number;
  /** Number of pixels until next frame, relative to source image (usually same as view width/height). */
  step: number;
  /** Direction the view portion moves in for each `step`. */
  orientation: "horizontal" | "vertical";
  /** Amount of frames to cycle through per second (frames per second). */
  fps: number;
  /** Whether animation should repeat. */
  loop?: boolean;
  /** Whether component should remove itself when animation ends. */
  destroy?: boolean;
  /** Restarts animation when value is updated. */
  key?: any;
  // Handlers
  /** Function to run on the first frame. */
  onStart?(): void;
  /** Function to run at the end of the last frame. */
  onEnd?(): void;
  /** Function to run every frame change. */
  onChange?(frame: number): void;
}

export type FramageView = {
  /** Width of portion in pixels, relative to source. */
  width: number;
  /** Height of portion in pixels, relative to source. */
  height: number;
  /** Offset of portion from the left in pixels, relative to source. */
  left?: number;
  /** Offset of portion from the top in pixels, relative to source. */
  top?: number;
};

export type FramageProps = JSX.IntrinsicElements["img"] & {
  /** Visible portion of source image. */
  view: FramageView;
  /** Enable 9-slice scaling for this Framage. Configures the width of the border area with limited scaling. */
  nineslice?: FramageNineslice;
  /**
    Framage animation configuration.
    
    @version 2.1.0
    @see https://npmjs.com/package/react-framage#framageanimation
   */
  animation?: FramageAnimation;
};

export type RegularFramageProps = Omit<FramageProps, "nineslice">;

export interface NineslicedFramageProps extends FramageProps {
  nineslice: FramageNineslice;
}

/**
  A custom hook used by `<Framage>`.

  Returns an array containing the current frame index and a boolean representing whether the Framage is destroyed.
  
  @version 2.1.0
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
      return () => clearInterval(interval);
    }
    return undefined;
  }, [animation?.key]);

  return [frame, isDestroyed];
}

/** 
 Display portions of an image, flipbook animate between them and apply nineslice scaling!

 @version 2.1.0
 @see https://npmjs.com/package/react-framage#usage
 */
export function Framage({ nineslice, ...rest }: FramageProps) {
  return nineslice === undefined ? <RegularFramage {...rest} /> : <NineslicedFramage nineslice={nineslice} {...rest} />;
}

function RegularFramage({ view, animation, ...imgAttributes }: RegularFramageProps) {
  const img = useRef<HTMLImageElement>(null);
  const wrapper = useRef<HTMLElement>(null);

  const [frame, isDestroyed] = useFramage(animation);

  const steps = animation ? (typeof animation.frames === "number" ? frame : animation.frames[frame]) : 0;

  // --------------------
  //   Handle Position
  // --------------------

  function getImagePosition(inset: "top" | "left") {
    const isAnimationOrientation = animation && animation.orientation === (inset === "left" ? "horizontal" : "vertical");
    const stepSize = isAnimationOrientation ? animation.step * steps : 0;

    return ((stepSize + (view[inset] ?? 0)) / (img.current?.[inset === "left" ? "naturalWidth" : "naturalHeight"] || 0)) * -100 + "%";
  }

  function setImagePosition() {
    if (!img.current) return;
    img.current.style.transform = `translate(${getImagePosition("left")}, ${getImagePosition("top")})`;
  }

  useEffect(setImagePosition, [frame]);

  // --------------------
  //    Handle Resize
  // --------------------

  function getImageSize(dimension: "width" | "height") {
    const viewSize = view[dimension];
    return wrapper.current && img.current && viewSize
      ? (wrapper.current[dimension === "width" ? "clientWidth" : "clientHeight"] / viewSize) *
          img.current[dimension === "width" ? "naturalWidth" : "naturalHeight"] +
          "px"
      : "0";
  }

  const setImageSize = () => {
    if (!img.current) return;
    img.current.style.width = getImageSize("width");
    img.current.style.height = getImageSize("height");
  };
  const resizeObserver = new ResizeObserver(setImageSize);

  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.style.setProperty("--framage-view-width", view.width + "px");
      wrapper.current.style.setProperty("--framage-view-height", view.height + "px");
      resizeObserver.observe(wrapper.current);
    }
    return () => resizeObserver.disconnect();
  }, [view, isDestroyed]);

  // --------------------
  //   Render Framage
  // --------------------
  return !isDestroyed ? (
    <react-framage steps={steps} frame={frame} ref={wrapper}>
      <img
        {...imgAttributes}
        ref={img}
        onLoad={(e) => {
          setImageSize();
          setImagePosition();
          imgAttributes.onLoad && imgAttributes.onLoad(e);
        }}
      />
    </react-framage>
  ) : null;
}

const NineslicedFramageContext = createContext<{ frame: number; steps: number; animation?: FramageAnimation }>({ frame: 0, steps: 0 });

function NineslicedFramage({ view, animation, nineslice: ninesliceProp, ...imgAttributes }: NineslicedFramageProps) {
  const nineslice: Record<"top" | "right" | "bottom" | "left", number> =
    typeof ninesliceProp === "number"
      ? {
          top: ninesliceProp,
          right: ninesliceProp,
          bottom: ninesliceProp,
          left: ninesliceProp,
        }
      : {
          top: ninesliceProp!.top ?? 0,
          left: ninesliceProp!.left ?? 0,
          bottom: ninesliceProp!.bottom ?? 0,
          right: ninesliceProp!.right ?? 0,
        };

  const wrapper = useRef<HTMLElement>(null);

  const [frame, isDestroyed] = useFramage(animation);

  const steps = animation ? (typeof animation.frames === "number" ? frame : animation.frames[frame]) : 0;

  const borderWidth = (side: keyof typeof nineslice) => `var(--nineslice-border-${side}-width, var(--nineslice-border-width, ${nineslice[side]}px))`;

  useEffect(() => {
    if (!wrapper.current) return;
    wrapper.current.style.setProperty("--framage-view-width", view.width + "px");
    wrapper.current.style.setProperty("--framage-view-height", view.height + "px");
    wrapper.current.style.gridTemplate = `${borderWidth("top")} 1fr ${borderWidth("bottom")} / ${borderWidth("left")} 1fr ${borderWidth("right")}`;
  }, [view, isDestroyed]);

  // --------------------
  //    Render Slices
  // --------------------
  const slices = {
    "top-left": {
      width: nineslice.left,
      height: nineslice.top,
    },
    "top-middle": {
      width: view.width - nineslice.left - nineslice.right,
      height: nineslice.top,
      left: (view.left ?? 0) + nineslice.left,
    },
    "top-right": {
      width: nineslice.right,
      height: nineslice.top,
      left: view.width - nineslice.right,
    },
    "middle-left": {
      width: nineslice.left,
      height: view.height - nineslice.top - nineslice.bottom,
      top: (view.top ?? 0) + nineslice.top,
    },
    middle: {
      width: view.width - nineslice.left - nineslice.right,
      height: view.height - nineslice.top - nineslice.bottom,
      left: (view.left ?? 0) + nineslice.left,
      top: (view.left ?? 0) + nineslice.top,
    },
    "middle-right": {
      width: nineslice.right,
      height: view.height - nineslice.top - nineslice.bottom,
      left: (view.left ?? 0) + view.width - nineslice.right,
      top: (view.top ?? 0) + nineslice.top,
    },
    "bottom-left": {
      width: nineslice.left,
      height: nineslice.bottom,
      top: (view.top ?? 0) + view.height - nineslice.bottom,
    },
    "bottom-middle": {
      width: view.width - nineslice.left - nineslice.right,
      height: nineslice.bottom,
      left: (view.left ?? 0) + nineslice.left,
      top: (view.top ?? 0) + view.height - nineslice.bottom,
    },
    "bottom-right": {
      width: nineslice.right,
      height: nineslice.bottom,
      left: view.width - nineslice.right,
      top: (view.top ?? 0) + view.height - nineslice.bottom,
    },
  };

  return !isDestroyed ? (
    <NineslicedFramageContext.Provider value={{ frame, steps, animation }}>
      <react-framage ninesliced="" steps={steps} frame={frame} ref={wrapper}>
        {Object.entries(slices).map(([area, sliceView]) => (
          <FramageSlice key={area} main={area === "middle"} view={{ ...view, ...sliceView }} {...imgAttributes} />
        ))}
      </react-framage>
    </NineslicedFramageContext.Provider>
  ) : null;
}

function FramageSlice({ view, main, ...imgAttributes }: FramageProps & { main?: boolean }) {
  const img = useRef<HTMLImageElement>(null);
  const wrapper = useRef<HTMLElement>(null);
  const { frame, steps, animation } = useContext(NineslicedFramageContext);

  // --------------------
  //  Handle Reposition
  // --------------------
  function getImagePosition(inset: "top" | "left") {
    const isAnimationOrientation = animation && animation.orientation === (inset === "left" ? "horizontal" : "vertical");
    const stepSize = isAnimationOrientation ? animation.step * steps : 0;

    return ((stepSize + (view[inset] ?? 0)) / (img.current?.[inset === "left" ? "naturalWidth" : "naturalHeight"] || 0)) * -100 + "%";
  }

  function setImagePosition() {
    if (!img.current) return;
    img.current.style.transform = `translate(${getImagePosition("left")}, ${getImagePosition("top")})`;
  }

  useEffect(setImagePosition, [frame]);

  // --------------------
  //    Handle Resize
  // --------------------
  function getImageSize(dimension: "width" | "height") {
    const viewSize = view[dimension];
    return wrapper.current && img.current && viewSize
      ? (wrapper.current[dimension === "width" ? "clientWidth" : "clientHeight"] / viewSize) *
          img.current[dimension === "width" ? "naturalWidth" : "naturalHeight"] +
          "px"
      : "0";
  }

  function setImageSize() {
    if (!img.current) return;
    img.current.style.width = getImageSize("width");
    img.current.style.height = getImageSize("height");
  }
  const resizeObserver = new ResizeObserver(setImageSize);

  useEffect(() => {
    if (wrapper.current) resizeObserver.observe(wrapper.current);
    return () => resizeObserver.disconnect();
  }, [view]);

  // --------------------
  //    Render Slice
  // --------------------
  return (
    <react-framage-slice aria-hidden={!main || undefined} ref={wrapper}>
      <img
        {...imgAttributes}
        ref={img}
        onLoad={(e) => {
          setImageSize();
          setImagePosition();
          imgAttributes.onLoad && imgAttributes.onLoad(e);
        }}
      />
    </react-framage-slice>
  );
}
