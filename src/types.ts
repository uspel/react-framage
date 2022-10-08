import { FramageElement } from "./elements";

export {};
declare global {
  interface FramageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /**
     Portion of the source image visible.
    @param width Pixel width.
    @param height Pixel height.
    @param left Initial X position of the view portion (from the left).
    @param top Initial Y position of the view prtion (from the top).
    */
    view: {
      width: number;
      height: number;
      /** @default 0 */
      left?: number;
      /** @default 0 */
      top?: number;
    };
    style?: React.CSSProperties & {
      img?: React.CSSProperties;
    };
    /**
    Settings for the component's animation - set to `false` for no animation.
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
  type FramageFramePattern = number[] | ((frames: number[]) => number[]);
  type FramageAnimation =
    | false
    | ({
        /**
      Animation's frame configuration.
    */
        frames: {
          /** Number of frames in total on source. */
          amount: number;
          /** Order to display frames in. */
          pattern?: FramageFramePattern;
          /** Frame to start on first mount. */
          initial?: number;
        };
        /** Number of pixels until next frame (usually view width). */
        step: number;
        /**
      How the animation cycles.

      `"loop"` - repeats animation infinitely.

      `"keep-on-last"` - once the last frame is reached, it will stay on that frame.
      
      `"destroy-after-last"` - removes element when animation is complete.
      @default "loop"
     */
        mode?: "loop" | "keep-on-last" | "destroy-after-last";
        /** Direction the view portion moves in for each frame. */
        orientation?: "horizontal" | "vertical";
        /** Function to run on first frame. */
        onStart?: FramageEventHandler;
        /** Function to run on last frame. */
        onEnd?: FramageEventHandler;
        /** Function to run when animation is destroyed by the `"destroy-after-last"` mode. */
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
