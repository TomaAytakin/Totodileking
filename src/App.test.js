import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import App from './App';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

test('renders Totodex header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Totodex/i);
  expect(linkElement).toBeInTheDocument();
});
