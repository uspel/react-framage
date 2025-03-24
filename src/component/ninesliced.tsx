import { createContext, useContext, useEffect, useRef, JSX } from "react";

import { FramageAnimation, FramageProps, FramageNineslice } from "../types";
import { ReactFramageElement, ReactFramageSliceElement } from "../elements";
import { useFramageAnimation, useFramageImage } from "../hooks";

export interface NineslicedFramageProps extends FramageProps {
  nineslice: FramageNineslice;
}

const NineslicedFramageContext = createContext<{
  frame: number;
  steps: number;
  animation?: FramageAnimation;
  imageProps: Omit<JSX.IntrinsicElements["img"], "ref">;
}>({
  frame: 0,
  steps: 0,
  imageProps: {},
});

function parseNinesliceProp(n: FramageNineslice) {
  if (typeof n === "number") {
    return {
      top: n,
      left: n,
      bottom: n,
      right: n,
    };
  }

  return {
    top: n.top ?? 0,
    left: n.left ?? 0,
    bottom: n.bottom ?? 0,
    right: n.right ?? 0,
  };
}

export default function NineslicedFramage({ view, animation, nineslice: ninesliceProp, ...imageProps }: NineslicedFramageProps) {
  const wrapper = useRef<ReactFramageElement>(null);

  const nineslice = parseNinesliceProp(ninesliceProp);
  const [frame, steps, isDestroyed] = useFramageAnimation(animation);

  useEffect(() => {
    wrapper.current?.setFallbackSize(view.width, view.height, nineslice);
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
    <react-framage ninesliced ref={wrapper}>
      <NineslicedFramageContext.Provider value={{ frame, steps, animation, imageProps }}>
        {Object.entries(slices).map(([area, sliceView]) => (
          <FramageSlice key={area} main={area === "middle"} view={{ ...view, ...sliceView }} />
        ))}
      </NineslicedFramageContext.Provider>
    </react-framage>
  ) : null;
}

function FramageSlice({ view, main }: FramageProps & { main: boolean }) {
  const { frame, steps, animation, imageProps } = useContext(NineslicedFramageContext);

  const wrapper = useRef<ReactFramageSliceElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useFramageImage(wrapper, image, {
    view,
    animation,
    frame,
    steps,
  });

  // --------------------
  //    Render Slice
  // --------------------
  return (
    <react-framage-slice aria-hidden={!main || undefined} ref={wrapper}>
      <img ref={image} {...imageProps} />
    </react-framage-slice>
  );
}
