import { Framage } from "../../";
import "./App.css";
import exampleImg from "./assets/example.png";
import { useState } from "react";

function App() {
  const [frames, setFrames] = useState(Array.from({ length: 10 }, (_, i) => i));
  return (
    <div className="App">
      <Framage
        src={exampleImg}
        alt=""
        style={{ imageRendering: "pixelated" }}
        view={{ width: 9, height: 9 }}
        animation={{
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
    </div>
  );
}

export default App;
