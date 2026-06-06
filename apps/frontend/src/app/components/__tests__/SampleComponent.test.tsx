import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// A simple sample component to demonstrate testing architecture
const SampleComponent = ({ message }: { message: string }) => (
  <div>
    <h1>{message}</h1>
  </div>
);

describe('SampleComponent', () => {
  it('renders the message correctly', () => {
    render(<SampleComponent message="Hello Frontend" />);
    
    // Check if the heading with the text exists
    const heading = screen.getByRole('heading', { name: /hello frontend/i });
    expect(heading).toBeInTheDocument();
  });
});
