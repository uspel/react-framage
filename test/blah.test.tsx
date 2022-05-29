import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TextureAtlas from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <TextureAtlas
        src=""
        width={10}
        height={10}
        uv={{ width: 1, height: 1 }}
        base={{ width: 1, height: 1 }}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
