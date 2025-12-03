import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Totodex header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Totodex/i);
  expect(linkElement).toBeInTheDocument();
});
