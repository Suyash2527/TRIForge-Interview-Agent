import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock the SplashScreen since it has its own logic and delays
jest.mock('@/components/SplashScreen', () => {
  return function MockSplashScreen() {
    return <div data-testid="splash-screen">Splash Screen</div>;
  };
});

// Mock fetch globally
global.fetch = jest.fn() as jest.Mock;

describe('Home (Chat Interface)', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    
    // Setup a default mock response for chat API
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        reply: 'Mock AI Response',
        liveScore: 85,
        done: false,
      }),
    });
  });

  it('renders the initial layout correctly', () => {
    render(<Home />);
    
    // Check TopNavBar elements
    expect(screen.getByText('AI Interviewer')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    
    // Check initial agent message is rendered
    expect(screen.getByText(/Welcome to your AI engineering interview/i)).toBeInTheDocument();
    
    // Check that "Begin Interview" button is available
    expect(screen.getByRole('button', { name: /Begin Interview/i })).toBeInTheDocument();
  });

  it('starts the interview when Begin Interview is clicked', async () => {
    render(<Home />);
    
    const beginButton = screen.getByRole('button', { name: /Begin Interview/i });
    fireEvent.click(beginButton);
    
    // Check that fetch was called to the API with 'START'
    expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"message":"START"'),
    }));
    
    // Check that the input textarea appears after starting
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Type your answer/i)).toBeInTheDocument();
    });
  });

  it('displays the user message and API response', async () => {
    render(<Home />);
    
    // Start interview
    fireEvent.click(screen.getByRole('button', { name: /Begin Interview/i }));
    
    // Wait for the textarea to appear
    const input = await screen.findByPlaceholderText(/Type your answer/i);
    
    // Type a message
    fireEvent.change(input, { target: { value: 'This is my test answer.' } });
    
    // Submit the message
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);
    
    // Verify user message is added to UI
    expect(screen.getByText('This is my test answer.')).toBeInTheDocument();
    
    // Verify API mock response is added to UI
    await waitFor(() => {
      expect(screen.getByText('Mock AI Response')).toBeInTheDocument();
    });
  });
});
