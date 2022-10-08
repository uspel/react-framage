import { FramageElement } from "./elements";

export {};
declare global {
  interface FramageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     Portion of the source image visible.
    @param width Pixel width of the UV.
    @param height Pixel height of the UV.
    @param originX Initial X position of the UV (from the left).
    @param originY Initial Y position of the UV (from the top).
    */
    view: {
      width: number;
      height: number;
      /** @default 0 */
      originX?: number;
      /** @default 0 */
      originY?: number;
    };
    style?: React.CSSProperties & {
      img?: React.CSSProperties;
    };
    /**
    Settings for the atlas' animation - set to `false` for no animation.
    @default false (no animation)
    */
    animation?: FramageAnimation;
  }
  type FramageEvent = Event & {
    target: FramageElement;
    frame: number;
    steps: number;
  };
  type FramageEventHandler = (e: FramageEvent) => void;
  type FramageAnimation =
    | false
    | ({
        /**
      Number of frames for the animation or array of frames as a pattern.
     
      A value of the number `3` would have the same result as an array of `[0,1,2]`.
    */
        frames: number | number[];
        /** Initial frame index. */
        initial?: number;
        /** Number of pixels the UV moves across the source image. */
        step: number;
        /**
      How the animation behaves.

      `"loop"` - repeats frames infinitely.

      `"keep-on-last"` - once the last frame is reached, it will stay on that frame.
      
      `"destroy-after-last"` - removes element when animation is complete.
      @default "loop"
     */
        mode?: "loop" | "keep-on-last" | "destroy-after-last";
        /** X/Y direction the UV moves in for each frame. */
        orientation?: "horizontal" | "vertical";
        /** Function to run on first frame. */
        onStart?: FramageEventHandler;
        /** Function to run on last frame. */
        onEnd?: FramageEventHandler;
        /** Function to run when atlas is destroyed by the `"destroy-after-last"` mode. */
        onDestroy?: FramageEventHandler;
        /**
          Function to run every frame change.
        */
        onChange?: FramageEventHandler;
      } & (
        | {
            /** Seconds per frame - cannot be active at the same times as `fps`. */
            frameDuration?: never;
            /** Frames per second - cannot be active at the same times as `frameDuration`. */
            fps: number;
          }
        | {
            /** Seconds per frame - cannot be active at the same times as `fps`. */
            frameDuration: number;
            /** Frames per second - cannot be active at the same times as `frameDuration`. */
            fps?: never;
          }
      ));

  namespace JSX {
    interface IntrinsicElements {
      "react-framage": React.DetailedHTMLProps<
        React.HTMLAttributes<FramageElement>,
        HTMLElement
      > & { frame: number; steps: number };
    }
  }
}
