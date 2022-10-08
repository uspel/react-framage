import "react-app-polyfill/ie11";
import React from "react";
import { createRoot } from "react-dom/client";
import Framage from ".././";
import "./styles.scss";

const App = () => {
  return (
    <main>
      <div>
        <Framage
          src="https://github.com/Uspel/react-framage/blob/main/images/demo.png"
          alt=""
          view={{ width: 15, height: 15 }}
          animation={{
            frames: {
              amount: 10,
              pattern: f => [...f, ...[...f].reverse()]
            },
            step: 15,
            fps: 1,
            mode: "loop",
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
            }
          }}
        />
      </div>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
