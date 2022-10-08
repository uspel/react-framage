/// <reference path="../types.ts"/>

/**
  `<react-framage>` element created by `<Framage>` component.
  
  @version 1.0.0
  @see https://npmjs.com/package/react-framage#framageelement
 */
export class FramageElement extends HTMLElement {
  readonly frame: number;
  readonly steps: number;
  constructor() {
    super();
    // @ts-ignore
    this._internals = this.attachInternals();
    // @ts-ignore
    this._internals.role = "container";
    (this.frame as number) = 0;
    (this.steps as number) = 0;
  }
  static get observedAttributes() {
    return ["frame", "steps"];
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    (this[name] as number) = parseInt(newValue);
  }
}
