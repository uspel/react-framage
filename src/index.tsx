/// <reference path="./types.ts"/>
import { FramageElement } from "./elements";
import { useFramage } from "./hooks";
import { Framage } from "./components";

customElements.define("react-framage", FramageElement);

export { Framage as default, useFramage, FramageElement };
