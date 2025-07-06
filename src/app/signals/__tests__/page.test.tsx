import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignalsPage from '../page';

// Mock the UI components
jest.mock('@/ui/layouts/DefaultPageLayout', () => ({
  DefaultPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="default-page-layout">{children}</div>
  ),
}));

jest.mock('@/ui/components/Button', () => ({
  Button: ({ children, onClick, icon, size, ...props }: any) => (
    <button onClick={onClick} data-size={size} {...props}>
      {icon && <span data-testid="button-icon">{icon}</span>}
      {children}
    </button>
  ),
}));

jest.mock('@/ui/components/Badge', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('@/ui/components/IconWithBackground', () => ({
  IconWithBackground: ({ icon, size }: { icon: React.ReactNode; size: string }) => (
    <div data-testid="icon-with-background" data-size={size}>
      {icon}
    </div>
  ),
}));

jest.mock('@/ui/components/SignalLayoutBlend', () => ({
  __esModule: true,
  default: ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => (
    open ? (
      <div data-testid="signal-layout-blend">
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null
  ),
}));

// Mock Subframe icons
jest.mock('@subframe/core', () => ({
  FeatherPlus: () => <span data-testid="plus-icon" />,
  FeatherEdit: () => <span data-testid="edit-icon" />,
  FeatherChevronDown: () => <span data-testid="chevron-down-icon" />,
  FeatherPause: () => <span data-testid="pause-icon" />,
  FeatherPlay: () => <span data-testid="play-icon" />,
  FeatherArchive: () => <span data-testid="archive-icon" />,
  FeatherTrash2: () => <span data-testid="trash-icon" />,
  FeatherSlack: () => <span data-testid="slack-icon" />,
  FeatherCode: () => <span data-testid="code-icon" />,
  FeatherMail: () => <span data-testid="mail-icon" />,
  FeatherSignal: () => <span data-testid="signal-icon" />,
}));

// Mock console methods to suppress logs
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('SignalsPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    
    // Reset window.location.href
    window.location.href = '';
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('NoSignalPlaceholder (empty state)', () => {
    it('should render empty state when no signals exist', () => {
      render(<SignalsPage />);

      expect(screen.getByText('Create your first signal')).toBeInTheDocument();
      expect(screen.getByText('Start automating your analytics insights')).toBeInTheDocument();
      expect(screen.getByText('Choose a channel')).toBeInTheDocument();
    });

    it('should show all three channel options in empty state', () => {
      render(<SignalsPage />);

      expect(screen.getByTestId('slack-icon')).toBeInTheDocument();
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
      expect(screen.getByTestId('code-icon')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Webhook')).toBeInTheDocument();
    });

    it('should navigate to correct config pages when channel buttons are clicked', () => {
      render(<SignalsPage />);

      // Find all buttons that navigate to config pages
      const buttons = screen.getAllByRole('button');
      
      // Test Slack navigation
      const slackButton = buttons.find(button => 
        button.textContent?.includes('Slack') || 
        button.querySelector('[data-testid="slack-icon"]')
      );
      fireEvent.click(slackButton!);
      expect(window.location.href).toBe('/slack-signal-config');

      // Reset location
      window.location.href = '';

      // Test Email navigation
      const emailButton = buttons.find(button => 
        button.textContent?.includes('Email') || 
        button.querySelector('[data-testid="mail-icon"]')
      );
      fireEvent.click(emailButton!);
      expect(window.location.href).toBe('/email-signal-config');

      // Reset location
      window.location.href = '';

      // Test Webhook navigation
      const webhookButton = buttons.find(button => 
        button.textContent?.includes('Webhook') || 
        button.querySelector('[data-testid="code-icon"]')
      );
      fireEvent.click(webhookButton!);
      expect(window.location.href).toBe('/webhook-signal-config');
    });

    it('should open and close dialog when create signal buttons are clicked', () => {
      render(<SignalsPage />);

      // Click create signal button
      const createButtons = screen.getAllByText('Create signal');
      fireEvent.click(createButtons[0]);

      expect(screen.getByTestId('signal-layout-blend')).toBeInTheDocument();

      // Close dialog
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByTestId('signal-layout-blend')).not.toBeInTheDocument();
    });
  });

  describe('SignalList (with signals)', () => {
    beforeEach(() => {
      // Mock localStorage to simulate having draft signals
      const mockDraftData = {
        signalName: 'Test Draft Signal',
        isDraft: true,
        destinationType: 'channel',
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('current-signal-draft', JSON.stringify(mockDraftData));
    });

    it('should render signal list when signals exist', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        expect(screen.getByText('Signals')).toBeInTheDocument();
        expect(screen.getByText('Your signals')).toBeInTheDocument();
        expect(screen.getByText('Create a new signal')).toBeInTheDocument();
      });
    });

    it('should display sample signals correctly', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        expect(screen.getByText('Weekly User Engagement Report')).toBeInTheDocument();
        expect(screen.getByText('Daily Revenue Alert')).toBeInTheDocument();
        expect(screen.getByText('Performance Anomaly Detection')).toBeInTheDocument();
      });
    });

    it('should display draft signals from localStorage', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Draft Signal')).toBeInTheDocument();
      });
    });

    it('should show correct status badges for signals', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const badges = screen.getAllByTestId('badge');
        expect(badges.some(badge => badge.textContent === 'Active')).toBe(true);
        expect(badges.some(badge => badge.textContent === 'Draft')).toBe(true);
      });
    });

    it('should render channel-specific creation cards', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        expect(screen.getByText('Send to channels')).toBeInTheDocument();
        expect(screen.getByText('Send to inbox')).toBeInTheDocument();
        expect(screen.getByText('Send to API')).toBeInTheDocument();
      });
    });
  });

  describe('SignalCard component', () => {
    beforeEach(() => {
      // Add draft signal to localStorage
      const mockDraftData = {
        signalName: 'Test Draft Signal',
        isDraft: true,
        destinationType: 'channel',
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('current-signal-draft', JSON.stringify(mockDraftData));
    });

    it('should show edit button for each signal', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const editButtons = screen.getAllByTestId('edit-icon');
        expect(editButtons.length).toBeGreaterThan(0);
      });
    });

    it('should show dropdown menu when chevron is clicked', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const chevronButtons = screen.getAllByTestId('chevron-down-icon');
        fireEvent.click(chevronButtons[0]);

        expect(screen.getByText('Pause')).toBeInTheDocument();
        expect(screen.getByText('Archive')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });

    it('should show correct action in dropdown based on signal status', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const chevronButtons = screen.getAllByTestId('chevron-down-icon');
        fireEvent.click(chevronButtons[0]); // Active signal

        expect(screen.getByText('Pause')).toBeInTheDocument();
        expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const chevronButtons = screen.getAllByTestId('chevron-down-icon');
        fireEvent.click(chevronButtons[0]);

        expect(screen.getByText('Pause')).toBeInTheDocument();

        // Click outside
        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Pause')).not.toBeInTheDocument();
      });
    });

    it('should handle edit button click for regular signals', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]); // First signal (Slack)

        expect(window.location.href).toBe('/slack-signal-config');
      });
    });

    it('should load draft data when editing draft signal', async () => {
      const mockLoadFromStorage = jest.fn();
      
      // Mock the useSignalConfig hook
      jest.doMock('@/ui', () => ({
        SignalConfigProvider: ({ children }: { children: React.ReactNode }) => children,
        useSignalConfig: () => ({
          loadFromStorage: mockLoadFromStorage,
        }),
      }));

      render(<SignalsPage />);

      await waitFor(() => {
        // Find and click edit button for draft signal
        const editButtons = screen.getAllByText('Edit');
        const draftSignalCard = screen.getByText('Test Draft Signal').closest('[data-testid="signal-card"]') || 
                               screen.getByText('Test Draft Signal').closest('div');
        
        if (draftSignalCard) {
          const editButton = draftSignalCard.querySelector('button');
          fireEvent.click(editButton!);
        }

        expect(mockLoadFromStorage).toHaveBeenCalledWith('current-signal-draft');
      });
    });

    it('should handle dropdown actions correctly', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const chevronButtons = screen.getAllByTestId('chevron-down-icon');
        fireEvent.click(chevronButtons[0]);

        // Test status toggle
        fireEvent.click(screen.getByText('Pause'));
        expect(mockConsoleLog).toHaveBeenCalledWith('Toggle status for signal 1');

        // Reopen dropdown
        fireEvent.click(chevronButtons[0]);

        // Test archive
        fireEvent.click(screen.getByText('Archive'));
        expect(mockConsoleLog).toHaveBeenCalledWith('Archive signal 1');

        // Reopen dropdown
        fireEvent.click(chevronButtons[0]);

        // Test delete
        fireEvent.click(screen.getByText('Delete'));
        expect(mockConsoleLog).toHaveBeenCalledWith('Delete signal 1');
      });
    });
  });

  describe('Draft signal loading', () => {
    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorage.setItem('current-signal-draft', 'invalid json');
      
      render(<SignalsPage />);

      expect(mockConsoleError).toHaveBeenCalledWith('Error loading draft signal:', expect.any(Error));
    });

    it('should ignore incomplete draft data', () => {
      const incompleteDraftData = {
        isDraft: true,
        // Missing signalName
        destinationType: 'channel'
      };
      localStorage.setItem('current-signal-draft', JSON.stringify(incompleteDraftData));

      render(<SignalsPage />);

      // Should not show any draft signals
      expect(screen.queryByText('Test Draft Signal')).not.toBeInTheDocument();
    });

    it('should load multiple draft signals if they exist', () => {
      // Set up multiple draft signals in localStorage
      const draftData1 = {
        signalName: 'Draft Signal 1',
        isDraft: true,
        destinationType: 'channel'
      };
      
      localStorage.setItem('current-signal-draft', JSON.stringify(draftData1));

      render(<SignalsPage />);

      // Should show the draft signal along with sample signals
      expect(screen.getByText('Draft Signal 1')).toBeInTheDocument();
      expect(screen.getByText('Weekly User Engagement Report')).toBeInTheDocument();
    });
  });

  describe('Channel type helpers', () => {
    it('should return correct edit paths for different channels', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        // Test all three channel navigation buttons in the creation section
        const buttons = screen.getAllByRole('button');
        
        // Find and test Slack button
        const slackButton = buttons.find(button => 
          button.textContent?.includes('Send to channels')
        );
        fireEvent.click(slackButton!);
        expect(window.location.href).toBe('/slack-signal-config');

        window.location.href = '';

        // Find and test Email button
        const emailButton = buttons.find(button => 
          button.textContent?.includes('Send to inbox')
        );
        fireEvent.click(emailButton!);
        expect(window.location.href).toBe('/email-signal-config');

        window.location.href = '';

        // Find and test Webhook button
        const webhookButton = buttons.find(button => 
          button.textContent?.includes('Send to API')
        );
        fireEvent.click(webhookButton!);
        expect(window.location.href).toBe('/webhook-signal-config');
      });
    });

    it('should show correct icons for different channel types', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        // Check that all channel icons are rendered
        expect(screen.getAllByTestId('slack-icon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('mail-icon').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('code-icon').length).toBeGreaterThan(0);
      });
    });

    it('should show correct status variants for badges', async () => {
      render(<SignalsPage />);

      await waitFor(() => {
        const badges = screen.getAllByTestId('badge');
        
        // Check that status variants are applied correctly
        const activeBadge = badges.find(badge => badge.textContent === 'Active');
        expect(activeBadge).toHaveAttribute('data-variant', 'success');

        const draftBadge = badges.find(badge => badge.textContent === 'Draft');
        expect(draftBadge).toHaveAttribute('data-variant', 'neutral');
      });
    });
  });

  describe('Component integration', () => {
    it('should render within SignalConfigProvider', () => {
      render(<SignalsPage />);
      
      // The component should render without errors, indicating proper provider setup
      expect(screen.getByTestId('default-page-layout')).toBeInTheDocument();
    });

    it('should handle window navigation correctly', async () => {
      render(<SignalsPage />);

      // Test multiple navigation scenarios
      const buttons = screen.getAllByRole('button');
      
      // Test navigation from empty state
      if (screen.queryByText('Create your first signal')) {
        const slackButton = buttons.find(button => 
          button.querySelector('[data-testid="slack-icon"]')
        );
        fireEvent.click(slackButton!);
        expect(window.location.href).toBe('/slack-signal-config');
      }
    });

    it('should show create signal dialog when opened', () => {
      render(<SignalsPage />);

      const createButton = screen.getAllByText('Create signal')[0];
      fireEvent.click(createButton);

      expect(screen.getByTestId('signal-layout-blend')).toBeInTheDocument();
    });
  });
});