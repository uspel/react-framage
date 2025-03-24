import exampleImg from "./assets/example.png";
import dialogueImg from "./assets/dialogue.png";
import dialogueAnimImg from "./assets/dialogue_animated.png";

import { useState } from "react";
import Framage from "../..";
import "./App.css";

function App({ frames }: { frames: number[] }) {
  return (
    <>
      <Framage
        src={dialogueImg}
        alt=""
        view={{
          width: 18,
          height: 33,
        }}
        nineslice={{
          bottom: 8,
          left: 8,
          right: 8,
          top: 23,
        }}
      />
      <Framage
        src={dialogueAnimImg}
        alt=""
        view={{ width: 18, height: 33 }}
        nineslice={{ bottom: 8, left: 8, right: 8, top: 23 }}
        animation={{
          frames: [0, 0, 1, 2, 2, 2, 1, 0],
          fps: 10,
          loop: true,
          orientation: "horizontal",
          step: 18,
        }}
      />
      <Framage
        src={exampleImg}
        alt=""
        view={{ width: 8, height: 8, top: 1, left: 1 }}
        animation={{
          key: frames,
          fps: 1,
          frames: frames,
          loop: true,
          destroy: true,
          orientation: "horizontal",
          step: 9,
          onChange: (frame) => console.log(`Changed to frame ${frame}`),
          onStart: () => console.log("START"),
          onEnd: () => console.log("END"),
        }}
      />
    </>
  );
}

function Wrapper() {
  const [frames, setFrames] = useState(Array.from({ length: 10 }, (_, i) => i));
  const [updater, setUpdater] = useState(0);
  return (
    <div className="App">
      <App frames={frames} />

      <button type="button" onClick={() => setFrames((f) => [...f.reverse()])}>
        Reverse
      </button>
      <button type="button" onClick={() => setUpdater((f) => f + 1)}>
        Rerender {updater}
      </button>
    </div>
  );
}

export default Wrapper;
