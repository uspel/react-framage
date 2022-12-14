/// <reference path="../types.ts"/>
import React, { forwardRef, useRef, MutableRefObject, useEffect } from "react";
import { FramageElement } from "../elements";
import { useFramage } from "../hooks";

/**
  Easily animate between different segments of an image.
  
  @version 1.0.0
  @see https://npmjs.com/package/react-framage#usage

  ---
  DOM structure:
  ```html
    <react-framage>
      <img />
    </react-framage>
  ```
  ---
  Default styling:
  ```css
    react-framage {
      display: inline-block;
      position: relative;
      overflow: hidden;
    }
    react-framage img {
      position: absolute;
      top: 0;
      left: 0;
    }
  ```
 */
export const Framage = forwardRef(function Framage(
  props: FramageProps,
  ref: MutableRefObject<FramageElement>
): JSX.Element {
  const { view, animation = false, style, ...imgProps } = props;
  const localRef = useRef<FramageElement>();
  const img = useRef<HTMLImageElement>();
  const wrapper = ref ?? localRef;
  // Handles frame changing and image x, y positions
  const [frame, isDestroyed] = useFramage(animation, wrapper.current);

  const origins = {
    x: view.left ?? 0,
    y: view.top ?? 0
  };
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
  const steps = pattern[frame];

  function getPosition(orientation: "vertical" | "horizontal") {
    const axis = orientation === "vertical" ? "y" : "x";

    return (
      ((((animation && animation.orientation === orientation
        ? animation.step * steps
        : 0) +
        origins[axis]) /
        img.current[
          orientation === "horizontal" ? "naturalWidth" : "naturalHeight"
        ]) *
        -100 || 0) + "%"
    );
  }

  function getDimension(orientation: "vertical" | "horizontal") {
    return (
      (wrapper.current[
        orientation === "horizontal" ? "clientWidth" : "clientHeight"
      ] /
        view[orientation === "horizontal" ? "width" : "height"]) *
        img.current[
          orientation === "horizontal" ? "naturalWidth" : "naturalHeight"
        ] +
      "px"
    );
  }

  useEffect(() => {
    if (!document.querySelector("[data-react-framage-style]")) {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = `react-framage {
  display: inline-block;
  position: relative;
  overflow: hidden;
}
react-framage img {
  position: absolute;
  top: 0;
  left: 0;
}`;
      styleElement.setAttribute("data-react-framage-style", "");
      document.head.prepend(styleElement);
    }
  }, []);
  useEffect(() => {
    if (img.current) {
      img.current.style.translate =
        getPosition("horizontal") + " " + getPosition("vertical");
    }
  }, [frame]);

  const resizeObserver = new ResizeObserver(() => {
    if (img.current) {
      img.current.style.width = getDimension("horizontal");
      img.current.style.height = getDimension("vertical");
    }
  });
  useEffect(() => {
    resizeObserver.observe(wrapper.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return !isDestroyed ? (
    <react-framage
      ref={wrapper}
      frame={!frame ? undefined : frame}
      steps={steps}
      style={{ img, ...style }}
    >
      <img
        ref={img}
        {...imgProps}
        style={style?.img}
        onLoad={e => {
          img.current.style.width = getDimension("horizontal");
          img.current.style.height = getDimension("vertical");
          imgProps.onLoad && imgProps.onLoad(e);
        }}
      />
    </react-framage>
  ) : null;
});
