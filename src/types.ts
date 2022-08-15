export type TextureAtlasProps = {
  /** URL source of the image - can be an array of sources, creating multiple atlases with the same settings. */
  src: string | string[];
  /**
    Alternate text for image
    @default ""
  */
  alt?: string;
  /**
   CSS `image-rendering`.
   @default "auto"
  */
  rendering?: TextureAtlasRendering;
  /**
   Image loading.
   @default "eager"
  */
  loading?: "eager" | "lazy";
  /**
   Image draggability.
   @default "true"
  */
  draggable?: "true" | "false";
  /** Pixel width of the atlas' output (output size ratio should be the same as UV size ratio). */
  width: number;
  /** Pixel height of the atlas' output (output size ratio should be the same as UV size ratio). */
  height: number;
  /**
   Portion of the source image visible.
   @param width Pixel width of the UV.
   @param height Pixel height of the UV.
   @param originX Initial X position of the UV (from the left).
   @param originY Initial Y position of the UV (from the top).
  */
  uv: {
    width: number;
    height: number;
    /** @default 0 */
    originX?: number;
    /** @default 0 */
    originY?: number;
  };
  /**
   Dimensions of the source image.
   @param width Pixel width of the source.
   @param height Pixel height of the source.
  */
  base: { width: number; height: number };
  /**
    Settings for the atlas' animation - set to `false` for no animation.
    @default false (no animation)
  */
  animation?: TextureAtlasAnimation;
};

export type TextureAtlasImg = {
  frame: number;
  width: number;
  height: number;
  src: string;
  alt: string;
  loading: "eager" | "lazy";
  draggable: "true" | "false";
  base: { width: number; height: number };
  uv: { width: number; height: number };
  rendering: TextureAtlasRendering;
  t: number;
  l: number;
};

export type TextureAtlasAnimation =
  | false
  | {
      /**
        Number of frames for the animation or array of frames as a pattern.
       
        A value of the number `3` would have the same result as an array of `[0,1,2]`.
      */
      frames: number | number[];
      /** Number of pixels the UV moves across the source image. */
      frameStep: number;
      /** Seconds per frame - cannot be active at the same times as `fps`. */
      frameDuration?: number;
      /** Frames per second - cannot be active at the same times as `frameDuration`. */
      fps?: number;
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
      onStart?: () => void;
      /** Function to run on last frame. */
      onEnd?: () => void;
      /** Function to run when atlas is destroyed by the `"destroy-after-last"` mode. */
      onDestroy?: () => void;
      /**
       Function to run every frame change.
       @param frame Returns current frame of the atlas.
      */
      onChange?: (frame: number) => void;
      /**
       Function to run every frame change.
       @deprecated Use `onChange` instead.
       @param frame Returns current frame of the atlas.
      */
      onFrameChanged?: (frame: number) => void;
      /**
       Function to run on a specific frame.
       @deprecated Functionality replaced by `onChange`.
       @param frame Frame function runs on.
       @param action Function to run.
      */
      onFrame?: { frame: number; action: () => void };
    };

export type TextureAtlasRendering =
  | "-moz-initial"
  | "inherit"
  | "initial"
  | "revert"
  | "unset"
  | "-moz-crisp-edges"
  | "-webkit-optimize-contrast"
  | "auto"
  | "crisp-edges"
  | "pixelated";
