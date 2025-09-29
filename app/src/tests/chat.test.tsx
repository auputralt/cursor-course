import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatLayout } from '@/components/chat/ChatLayout';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { ModeToggle } from '@/components/chat/ModeToggle';

// Mock data
const mockMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'Hello, how are you?',
    type: 'text' as const,
    timestamp: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: '2',
    role: 'assistant' as const,
    content: 'I am doing well, thank you for asking!',
    type: 'text' as const,
    timestamp: new Date('2024-01-01T10:00:01Z'),
  },
];

describe('ChatLayout', () => {
  it('renders chat interface correctly', () => {
    render(
      <ChatLayout
        messages={mockMessages}
        onSendMessage={jest.fn()}
        onNewChat={jest.fn()}
        mode="text"
        onModeChange={jest.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText('ChatGPT')).toBeInTheDocument();
    expect(screen.getByText('New Chat')).toBeInTheDocument();
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    expect(screen.getByText('I am doing well, thank you for asking!')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <ChatLayout
        messages={[]}
        onSendMessage={jest.fn()}
        onNewChat={jest.fn()}
        mode="text"
        onModeChange={jest.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByText('AI')).toBeInTheDocument();
  });
});

describe('MessageList', () => {
  it('renders empty state when no messages', () => {
    render(<MessageList messages={[]} isLoading={false} />);
    
    expect(screen.getByText('Try asking a question to get started!')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    render(<MessageList messages={mockMessages} isLoading={false} />);
    
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    expect(screen.getByText('I am doing well, thank you for asking!')).toBeInTheDocument();
  });
});

describe('MessageInput', () => {
  it('calls onSendMessage when form is submitted', () => {
    const mockOnSendMessage = jest.fn();
    render(
      <MessageInput
        onSendMessage={mockOnSendMessage}
        mode="text"
        disabled={false}
      />
    );

    const input = screen.getByPlaceholderText('Message ChatGPT...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('updates placeholder based on mode', () => {
    render(
      <MessageInput
        onSendMessage={jest.fn()}
        mode="image"
        disabled={false}
      />
    );

    expect(screen.getByPlaceholderText('Describe the image you want to generate...')).toBeInTheDocument();
  });
});

describe('ModeToggle', () => {
  it('calls onModeChange when mode is clicked', () => {
    const mockOnModeChange = jest.fn();
    render(
      <ModeToggle
        mode="text"
        onModeChange={mockOnModeChange}
      />
    );

    const imageButton = screen.getByText('Image');
    fireEvent.click(imageButton);

    expect(mockOnModeChange).toHaveBeenCalledWith('image');
  });
});
