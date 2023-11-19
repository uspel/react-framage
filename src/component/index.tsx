import { JSX } from "react";
import { FramageProps } from "../types";
import NineslicedFramage from "./ninesliced";
import RegularFramage from "./regular";

/** 
 Display portions of an image, flipbook animate between them and apply nineslice scaling!

 @version 3.0.0
 @see https://npmjs.com/package/react-framage
 */
export default function Framage({ nineslice, ...rest }: FramageProps): JSX.Element {
  return nineslice === undefined ? <RegularFramage {...rest} /> : <NineslicedFramage nineslice={nineslice} {...rest} />;
}
