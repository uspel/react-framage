import "react-app-polyfill/ie11";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Framage, { FramageElement } from ".././";
import "./styles.scss";

const App = () => {
  const framage = React.useRef<FramageElement>(null);
  const [clicked, setClicked] = React.useState<boolean | undefined>();
  const [frame, setFrame] = useState(0);
  return (
    <main>
      <div>
        <Framage
          ref={framage}
          src="https://react-texture-atlas.quazchick.com/demo.png"
          alt=""
          view={{ width: 15, height: 15 }}
          animation={{
            frames: clicked
              ? [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            initial: clicked === undefined ? 9 : undefined,
            step: 15,
            fps: 1,
            mode: "keep-on-last",
            orientation: "horizontal",
            onStart(e) {
              console.log(`onStart:\n  frame ${e.frame}\n  steps ${e.steps}`);
            },
            onEnd(e) {
              console.log(`onEnd:\n  frame ${e.frame}\n  steps ${e.steps}`);
            },
            onDestroy(e) {
              console.log(`onDestroy:\n  frame ${e.frame}\n  steps ${e.steps}`);
            },
            onChange(e) {
              console.log(`onChange:\n  frame ${e.frame}\n  steps ${e.steps}`);
              e.frame === 1 && setFrame(e.frame);
            }
          }}
        />
      </div>

      <button onClick={() => setClicked(c => (!c ? true : false))}>
        Click {frame}
      </button>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
