import { RefObject, useEffect } from "react";
import { FramageAnimation, FramageView } from "../types";

/**
  A custom hook used by `<Framage>`.

  Controls the scaling and positioning on the `<img>` element.
  
  @version 3.0.0
  @see https://npmjs.com/package/react-framage#useframageimage
 */
export default function useFramageImage(
  wrapper: RefObject<HTMLElement | null>,
  image: RefObject<HTMLImageElement | null>,
  data: {
    animation?: FramageAnimation;
    frame: number;
    steps: number;
    view: FramageView;
  },
) {
  // --------------------
  //  Handle Reposition
  // --------------------
  function getImagePosition(inset: "top" | "left") {
    let stepSize = 0;

    const orientation = inset === "left" ? "horizontal" : "vertical";

    if (data.animation && data.animation.orientation === orientation) stepSize = data.animation.step * data.steps;

    const totalStep = stepSize + (data.view[inset] ?? 0);
    const sourceSize = image.current![inset === "left" ? "naturalWidth" : "naturalHeight"];

    return (totalStep / sourceSize) * -100 + "%";
  }

  function setImagePosition() {
    if (image.current) image.current.style.transform = `translate(${getImagePosition("left")}, ${getImagePosition("top")})`;
  }

  useEffect(setImagePosition, [data.frame]);

  // --------------------
  //    Handle Resize
  // --------------------
  function getImageSize(dimension: "width" | "height") {
    const viewSize = data.view[dimension];
    if (!wrapper.current || !image.current || viewSize === 0) return "0";

    const wrapperSize = wrapper.current[dimension === "width" ? "clientWidth" : "clientHeight"];
    const sourceSize = image.current[dimension === "width" ? "naturalWidth" : "naturalHeight"];

    return (wrapperSize / viewSize) * sourceSize + "px";
  }

  function setImageSize() {
    if (!image.current) return;
    image.current.style.width = getImageSize("width");
    image.current.style.height = getImageSize("height");
  }

  const resizeObserver = new ResizeObserver(setImageSize);

  function handleImageLoad() {
    setImageSize();
    setImagePosition();
  }

  useEffect(() => {
    image.current?.addEventListener("load", handleImageLoad);
    if (wrapper.current) resizeObserver.observe(wrapper.current);
    return () => {
      image.current?.removeEventListener("load", handleImageLoad);
      resizeObserver.disconnect();
    };
  }, []);
}
