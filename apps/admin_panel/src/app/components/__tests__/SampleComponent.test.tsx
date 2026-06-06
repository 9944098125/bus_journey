import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// A simple sample component to demonstrate testing architecture
const SampleComponent = ({ message }: { message: string }) => (
  <div>
    <h2>{message}</h2>
  </div>
);

describe('SampleComponent', () => {
  it('renders the admin message correctly', () => {
    render(<SampleComponent message="Hello Admin Panel" />);
    
    // Check if the heading with the text exists
    const heading = screen.getByRole('heading', { name: /hello admin panel/i });
    expect(heading).toBeInTheDocument();
  });
});
