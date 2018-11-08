import * as React from 'react';
import * as ReactDOM from 'react-dom';

it('blank', () => {
  const div = document.createElement('div');
  ReactDOM.render(<span>todo</span>, div);
  ReactDOM.unmountComponentAtNode(div);
});
