export default class ReactFramageElement extends HTMLElement {
  /** A boolean value representing whether the Framage has nine slice scaling applied. */
  get ninesliced() {
    return this.hasAttribute("ninesliced");
  }
  set ninesliced(value: boolean) {
    if (value) this.setAttribute("ninesliced", "");
    else this.removeAttribute("ninesliced");
  }

  /** A method to set the `--fallback-` CSS properties of the Framage. */
  setFallbackSize(
    width: number,
    height: number,
    nineslice?: {
      top: number;
      left: number;
      bottom: number;
      right: number;
    },
  ) {
    this.style.setProperty("--fallback-width", width + "px");
    this.style.setProperty("--fallback-height", height + "px");

    if (!nineslice) return;

    for (const side in nineslice) {
      const size = nineslice[side as keyof typeof nineslice];
      this.style.setProperty(`--fallback-nineslice-${side}`, size + "px");
    }
  }
}
