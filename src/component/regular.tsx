import { useEffect, useRef } from "react";

import { useFramageAnimation, useFramageImage } from "../hooks";
import { ReactFramageElement } from "../elements";
import { FramageProps } from "../types";

export type RegularFramageProps = Omit<FramageProps, "nineslice">;

export default function RegularFramage({ view, animation, ...imageProps }: RegularFramageProps) {
  const wrapper = useRef<ReactFramageElement>(null);
  const image = useRef<HTMLImageElement>(null);

  const [frame, steps, isDestroyed] = useFramageAnimation(animation);

  useFramageImage(wrapper, image, {
    view,
    animation,
    frame,
    steps,
  });

  useEffect(() => {
    wrapper.current?.setFallbackSize(view.width, view.height);
  }, [view, isDestroyed]);

  // --------------------
  //   Render Framage
  // --------------------
  return !isDestroyed ? (
    <react-framage steps={animation ? steps : undefined} frame={animation ? frame : undefined} ref={wrapper}>
      <img ref={image} {...imageProps} />
    </react-framage>
  ) : null;
}
