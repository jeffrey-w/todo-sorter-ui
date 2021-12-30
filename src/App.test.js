import App from './App';
import { Provider } from 'react-redux';
import { store } from './store'
import { render, screen } from '@testing-library/react';

test('renders app bar title', () => {
  render(<Provider store={store} ><App /></Provider>);
  const linkElement = screen.getByText(/TODOsorter/i);
  expect(linkElement).toBeInTheDocument();
});
