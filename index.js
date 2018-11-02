// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './scenes/Root';

const rootNode = document.getElementById('root');

if (rootNode) {
  ReactDOM.render(<Root />, rootNode);
} else {
  throw new Error('Could not get root node');
}
