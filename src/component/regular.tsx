import { useEffect, useRef } from "react";
import { useFramageAnimation, useFramageImage } from "../hooks";
import { FramageProps } from "../types";

export type RegularFramageProps = Omit<FramageProps, "nineslice">;

export default function RegularFramage({ view, animation, ...imageProps }: RegularFramageProps) {
  const wrapper = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);

  const [frame, steps, isDestroyed] = useFramageAnimation(animation);

  useFramageImage(wrapper, image, {
    view,
    animation,
    frame,
    steps,
  });

  useEffect(() => {
    if (!wrapper.current) return;
    wrapper.current.style.setProperty("--fallback-width", view.width + "px");
    wrapper.current.style.setProperty("--fallback-height", view.height + "px");
  }, [view, isDestroyed]);

  // --------------------
  //   Render Framage
  // --------------------
  return !isDestroyed ? (
    <react-framage ref={wrapper} frame={animation ? frame : undefined} steps={animation ? steps : undefined}>
      <img ref={image} {...imageProps} />
    </react-framage>
  ) : null;
}
