import { JSX } from "react";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        /** Wrapper element for the `<Framage>` component. */
        "react-framage": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          frame?: number;
          steps?: number;
          ninesliced?: "";
        };
        "react-framage-slice": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
    }
  }
}

export interface FramageProps extends Omit<JSX.IntrinsicElements["img"], "ref"> {
  /**
    Visible portion of source image.
    
    
    @version 3.0.0
    @see https://npmjs.com/package/react-framage#framagenineslice
  */
  view: FramageView;
  /**
    Enable 9-slice scaling for this Framage. Configures the width of the outer area with limited scaling.
    
    @version 3.0.0
    @see https://npmjs.com/package/react-framage#framagenineslice
  */
  nineslice?: FramageNineslice;
  /**
    Framage animation configuration.
    
    @version 3.0.0
    @see https://npmjs.com/package/react-framage#framageanimation
  */
  animation?: FramageAnimation;
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
