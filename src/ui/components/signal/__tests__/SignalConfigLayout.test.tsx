import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignalConfigLayout } from '../SignalConfigLayout';
import { SignalConfigProvider } from '@/ui/contexts/SignalConfigContext';

// Mock the DefaultPageLayout
jest.mock('@/ui/layouts/DefaultPageLayout', () => ({
  DefaultPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="default-page-layout">{children}</div>
  ),
}));

// Mock all UI components since they don't exist yet
jest.mock('@/ui/components/AutoSaveIndicator', () => ({
  AutoSaveIndicator: ({ isSaving, lastSaved, error, onManualSave }: any) => (
    <div data-testid="auto-save-indicator">
      <span data-testid="saving-state">{isSaving ? 'saving' : 'saved'}</span>
      <span data-testid="last-saved">{lastSaved?.toISOString() || 'never'}</span>
      <span data-testid="error">{error || 'none'}</span>
      {onManualSave && (
        <button data-testid="manual-save" onClick={onManualSave}>
          Manual Save
        </button>
      )}
    </div>
  ),
}));

jest.mock('@/ui/components/EditableTitle', () => ({
  EditableTitle: ({ value, onChange, onSave, placeholder, validateName, ...props }: any) => (
    <div data-testid="editable-title">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onSave && onSave(value)}
        placeholder={placeholder}
        data-testid="title-input"
        {...props}
      />
      <span data-testid="validation-error">
        {validateName(value) || 'valid'}
      </span>
    </div>
  ),
}));

jest.mock('@/ui/components/Button', () => ({
  Button: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/ui/components/IconButton', () => ({
  IconButton: ({ icon, onClick, variant, title, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      title={title}
      {...props}
    >
      {icon}
    </button>
  ),
}));

jest.mock('@/ui/components/signal/PreviewControls', () => ({
  PreviewControls: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="preview-controls">{children}</div>
  ),
}));

// Mock Subframe icons
jest.mock('@subframe/core', () => ({
  FeatherArrowLeft: () => <span data-testid="arrow-left-icon" />,
  FeatherEye: () => <span data-testid="eye-icon" />,
  FeatherMaximize2: () => <span data-testid="maximize-icon" />,
  FeatherMinimize2: () => <span data-testid="minimize-icon" />,
  FeatherCheck: () => <span data-testid="check-icon" />,
  FeatherAlertCircle: () => <span data-testid="alert-icon" />,
}));

// Mock window methods are handled in jest.setup.js

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <SignalConfigProvider>
      {ui}
    </SignalConfigProvider>
  );
};

describe('SignalConfigLayout', () => {
  const defaultProps = {
    channelType: 'slack' as const,
    signalName: 'Test Signal',
    onSignalNameChange: jest.fn(),
    onSignalNameSave: jest.fn(),
    children: <div data-testid="children-content">Test Content</div>,
    onLaunchClick: jest.fn(),
    canLaunch: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  describe('Rendering', () => {
    it('should render the layout with all sections', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      expect(screen.getByTestId('default-page-layout')).toBeInTheDocument();
      expect(screen.getByText('Configure Slack Signal')).toBeInTheDocument();
      expect(screen.getByTestId('children-content')).toBeInTheDocument();
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    it('should render different channel types correctly', () => {
      const { rerender } = renderWithProvider(<SignalConfigLayout {...defaultProps} channelType="email" />);
      expect(screen.getByText('Configure Email Signal')).toBeInTheDocument();

      rerender(
        <SignalConfigProvider>
          <SignalConfigLayout {...defaultProps} channelType="webhook" />
        </SignalConfigProvider>
      );
      expect(screen.getByText('Configure Webhook Signal')).toBeInTheDocument();
    });

    it('should render editable title when onSignalNameChange is provided', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      expect(screen.getByTestId('editable-title')).toBeInTheDocument();
      expect(screen.getByTestId('title-input')).toHaveValue('Test Signal');
    });

    it('should not render editable title when onSignalNameChange is not provided', () => {
      const propsWithoutNameChange = { ...defaultProps };
      delete propsWithoutNameChange.onSignalNameChange;

      renderWithProvider(<SignalConfigLayout {...propsWithoutNameChange} />);

      expect(screen.queryByTestId('editable-title')).not.toBeInTheDocument();
    });
  });

  describe('Auto-save functionality', () => {
    it('should render auto-save indicator when autoSave prop is provided', () => {
      const autoSaveProps = {
        isSaving: false,
        lastSaved: new Date('2023-01-01T12:00:00Z'),
        error: null,
        onManualSave: jest.fn(),
      };

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} autoSave={autoSaveProps} />
      );

      expect(screen.getByTestId('auto-save-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('saving-state')).toHaveTextContent('saved');
      expect(screen.getByTestId('last-saved')).toHaveTextContent('2023-01-01T12:00:00.000Z');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });

    it('should not render auto-save indicator when autoSave prop is not provided', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      expect(screen.queryByTestId('auto-save-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Preview functionality', () => {
    it('should render preview content when provided', () => {
      const previewContent = <div data-testid="preview-content">Preview Content</div>;

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} previewContent={previewContent} />
      );

      expect(screen.getByTestId('preview-content')).toBeInTheDocument();
      expect(screen.getByTestId('maximize-icon')).toBeInTheDocument();
    });

    it('should render placeholder when no preview content', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
      expect(screen.getByText('Configure your signal to see a preview')).toBeInTheDocument();
      expect(screen.getByText('Define Content')).toBeInTheDocument();
    });

    it('should expand preview when maximize button is clicked', () => {
      const previewContent = <div data-testid="preview-content">Preview Content</div>;

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} previewContent={previewContent} />
      );

      fireEvent.click(screen.getByTestId('maximize-icon'));

      expect(screen.getByText('This is how your slack signal will appear to recipients')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('should close expanded preview when close button is clicked', () => {
      const previewContent = <div data-testid="preview-content">Preview Content</div>;

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} previewContent={previewContent} />
      );

      fireEvent.click(screen.getByTestId('maximize-icon'));
      fireEvent.click(screen.getByText('Close'));

      expect(screen.queryByText('This is how your slack signal will appear to recipients')).not.toBeInTheDocument();
    });
  });

  describe('Button interactions', () => {
    it('should call onLaunchClick when Launch button is clicked', () => {
      const onLaunchClick = jest.fn();

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} onLaunchClick={onLaunchClick} />
      );

      fireEvent.click(screen.getByText('Launch'));

      expect(onLaunchClick).toHaveBeenCalled();
    });

    it('should disable Launch button when canLaunch is false', () => {
      renderWithProvider(
        <SignalConfigLayout {...defaultProps} canLaunch={false} />
      );

      const launchButton = screen.getByText('Launch');
      expect(launchButton).toBeDisabled();
    });

    it('should navigate back when back button is clicked', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      fireEvent.click(screen.getByTestId('arrow-left-icon'));

      expect(window.history.back).toHaveBeenCalled();
    });

    it('should handle "Finish Later" button click', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      fireEvent.click(screen.getByText('Finish Later'));

      expect(window.location.href).toBe('/signals');
    });

    it('should navigate to content definition from preview placeholder', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      fireEvent.click(screen.getByText('Define Content'));

      expect(window.location.href).toBe('/slack-signal-config/define-content');
    });

    it('should navigate to content definition from expanded preview', () => {
      const previewContent = <div data-testid="preview-content">Preview Content</div>;

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} previewContent={previewContent} />
      );

      fireEvent.click(screen.getByTestId('maximize-icon'));
      fireEvent.click(screen.getByText('Edit'));

      expect(window.location.href).toBe('/slack-signal-config/define-content');
    });
  });

  describe('Signal name validation', () => {
    it('should handle signal name changes', () => {
      const onSignalNameChange = jest.fn();

      renderWithProvider(
        <SignalConfigLayout {...defaultProps} onSignalNameChange={onSignalNameChange} />
      );

      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'New Signal Name' } });

      expect(onSignalNameChange).toHaveBeenCalledWith('New Signal Name');
    });

    it('should validate signal name correctly', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'ab' } }); // Too short

      expect(screen.getByTestId('validation-error')).toHaveTextContent('Signal name must be at least 3 characters long');
    });

    it('should show valid state for correct signal name', () => {
      renderWithProvider(<SignalConfigLayout {...defaultProps} />);

      const titleInput = screen.getByTestId('title-input');
      fireEvent.change(titleInput, { target: { value: 'Valid Signal Name' } });

      expect(screen.getByTestId('validation-error')).toHaveTextContent('valid');
    });
  });

  describe('Content definition paths', () => {
    it('should generate correct paths for different channel types', () => {
      const { rerender } = renderWithProvider(<SignalConfigLayout {...defaultProps} channelType="slack" />);
      
      fireEvent.click(screen.getByText('Define Content'));
      expect(window.location.href).toBe('/slack-signal-config/define-content');

      rerender(
        <SignalConfigProvider>
          <SignalConfigLayout {...defaultProps} channelType="email" />
        </SignalConfigProvider>
      );
      fireEvent.click(screen.getByText('Define Content'));
      expect(window.location.href).toBe('/email-signal-config/define-content');

      rerender(
        <SignalConfigProvider>
          <SignalConfigLayout {...defaultProps} channelType="webhook" />
        </SignalConfigProvider>
      );
      fireEvent.click(screen.getByText('Define Content'));
      expect(window.location.href).toBe('/webhook-signal-config/define-content');
    });
  });
});