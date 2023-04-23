import { Framage } from "../../";
import "./App.css";
import exampleImg from "./assets/example.png";
import { useState } from "react";

function App() {
  const [frames, setFrames] = useState(Array.from({ length: 10 }, (_, i) => i));
  const [key, setKey] = useState(0);
  const [updater, setUpdater] = useState(0);
  return (
    <div className="App">
      <Framage
        src={exampleImg}
        alt=""
        style={{ imageRendering: "pixelated" }}
        view={{ width: 9, height: 9 }}
        animation={{
          key,
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
      <button type="button" onClick={() => setFrames((f) => [...f.reverse()])}>
        Reverse
      </button>
      <button type="button" onClick={() => setKey((f) => f + 1)}>
        Update Key
      </button>
      <button type="button" onClick={() => setUpdater((f) => f + 1)}>
        Rerender {updater}
      </button>
    </div>
  );
}

export default App;
