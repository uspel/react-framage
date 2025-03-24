if (!document.querySelector("style[data-react-framage-style]")) {
  const style = document.createElement("style");
  style.setAttribute("data-react-framage-style", "");

  style.innerHTML = `react-framage,
react-framage-slice {
  position: relative;
  overflow: hidden;
}

react-framage {
  display: inline-block;
  width: var(--fallback-width);
  height: var(--fallback-height);
}

react-framage:where([ninesliced]) {
  display: inline-grid;
  grid-template-rows: var(--nineslice-top, var(--nineslice, var(--fallback-nineslice-top))) 1fr var(--nineslice-bottom, var(--nineslice, var(--fallback-nineslice-bottom)));
  grid-template-columns: var(--nineslice-left, var(--nineslice, var(--fallback-nineslice-left))) 1fr var(--nineslice-right, var(--nineslice, var(--fallback-nineslice-right)));
}

react-framage-slice {
  width: 100%;
  height: 100%;
}

react-framage img {
  position: absolute;
  left: 0;
  top: 0;
}`;

  document.head.prepend(style);
}

export {};
