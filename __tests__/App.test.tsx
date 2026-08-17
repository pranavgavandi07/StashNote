import React from 'react';
import renderer, { act } from 'react-test-renderer';

import App from '../App';

jest.mock('@react-native-async-storage/async-storage');

it('renders correctly', async () => {
  let tree;

  await act(async () => {
    tree = renderer.create(<App />);
  });

  expect(tree).toBeTruthy();
});