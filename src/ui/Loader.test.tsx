import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

it('announces that the scene is loading', () => {
  render(<Loader />);
  expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
});
