import 'react-app-polyfill/ie11';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import TextureAtlas from '.././';

const App = () => {
  return (
    <TextureAtlas
      src="https://react-texture-atlas.quazchick.com/demo.png"
      alt=""
      loading="eager"
      rendering="pixelated"
      draggable="false"
      width={600}
      height={600}
      base={{ width: 150, height: 15 }}
      uv={{ width: 15, height: 15, originX: 0, originY: 0 }}
      animation={{
        frames: 10,
        frameStep: 15,
        fps: 1,
        mode: 'destroy-after-last',
        orientation: 'horizontal',
        onStart: () => console.log('onStart'),
        onEnd: () => console.log('onEnd'),
        onDestroy: () => console.log('onDestroy'),
        onChange: f => console.log('onChange: ' + f),
        onFrameChanged: f => console.log('onFrameChanged: ' + f),
        onFrame: {
          frame: 1,
          action: () => console.log('onFrame: 1'),
        },
      }}
    />
  );
};

createRoot(document.getElementById('root')!).render(<App />);
