/// <reference path="../types.ts"/>
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
