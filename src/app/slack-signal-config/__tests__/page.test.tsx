import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SlackSignalConfig from '../page';

// Mock all UI components and hooks
jest.mock('@/ui/components/IconButton', () => ({
  IconButton: ({ icon, onClick, size, ...props }: any) => (
    <button onClick={onClick} data-size={size} {...props}>
      {icon}
    </button>
  ),
}));

jest.mock('@/ui/components/Select', () => {
  const Select = ({ children, value, onValueChange, placeholder, error, ...props }: any) => (
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      data-error={error}
      data-placeholder={placeholder}
      {...props}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  );
  
  Select.Item = ({ value, children, disabled }: any) => (
    <option value={value} disabled={disabled}>{children}</option>
  );
  
  return { Select };
});

// Mock the UI components that are imported from @/ui
jest.mock('@/ui', () => ({
  TriggerSection: ({ validationData, updateData, isTriggerOpen, setIsTriggerOpen }: any) => (
    <div data-testid="trigger-section">
      <button onClick={() => setIsTriggerOpen(!isTriggerOpen)}>
        {isTriggerOpen ? 'Close' : 'Open'} Trigger
      </button>
      {isTriggerOpen && (
        <div>
          <button onClick={() => updateData({ triggerType: 'scheduled' })}>Scheduled</button>
          <button onClick={() => updateData({ triggerType: 'one-time' })}>One-time</button>
          <button onClick={() => updateData({ triggerType: 'agent-triggered' })}>Agent Triggered</button>
        </div>
      )}
    </div>
  ),
  ScopeSection: ({ selectedMetrics, setSelectedMetrics, isScopeOpen, setIsScopeOpen }: any) => (
    <div data-testid="scope-section">
      <button onClick={() => setIsScopeOpen(!isScopeOpen)}>
        {isScopeOpen ? 'Close' : 'Open'} Scope
      </button>
      {isScopeOpen && (
        <div>
          <button onClick={() => setSelectedMetrics(['metric1'])}>Add Metric 1</button>
          <button onClick={() => setSelectedMetrics(['metric1', 'metric2'])}>Add Metric 2</button>
        </div>
      )}
    </div>
  ),
  ContentSection: ({ channelType }: any) => (
    <div data-testid="content-section" data-channel-type={channelType}>
      Content Section for {channelType}
    </div>
  ),
  SignalConfigLayout: ({ children, signalName, onSignalNameChange, onLaunchClick, canLaunch, previewContent }: any) => (
    <div data-testid="signal-config-layout">
      <input 
        value={signalName}
        onChange={(e) => onSignalNameChange(e.target.value)}
        data-testid="signal-name-input"
      />
      <button 
        onClick={onLaunchClick}
        disabled={!canLaunch}
        data-testid="launch-button"
      >
        Launch
      </button>
      <div data-testid="preview-content">{previewContent}</div>
      <div data-testid="config-sections">{children}</div>
    </div>
  ),
  TooltipField: ({ children, label, error, required }: any) => (
    <div data-testid="tooltip-field">
      <label>
        {label} {required && '*'}
      </label>
      {error && <span data-testid="field-error">{error}</span>}
      {children}
    </div>
  ),
  useSignalValidation: jest.fn(() => ({
    data: {
      destinationType: '',
      selectedChannel: '',
      selectedRecipients: [],
      triggerType: 'scheduled',
      selectedMetrics: []
    },
    validationState: {
      receiver: { errors: [], isComplete: false },
      trigger: { errors: [], isComplete: false },
      scope: { errors: [], isComplete: false },
      overall: { errors: [], isComplete: false }
    },
    updateData: jest.fn(),
    getFieldError: jest.fn(() => null),
    attemptLaunch: jest.fn(() => true),
    hasAttemptedLaunch: false
  })),
  useAutoSave: jest.fn(() => ({
    isSaving: false,
    lastSaved: null,
    error: null,
    manualSave: jest.fn()
  })),
  SignalConfigProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="signal-config-provider">{children}</div>
  ),
  useSignalConfig: jest.fn(() => ({
    data: {
      signalName: '',
      destinationType: '',
      selectedChannel: '',
      selectedRecipients: [],
      triggerType: 'scheduled',
      selectedMetrics: []
    },
    updateData: jest.fn(),
    getSectionStatus: jest.fn(() => ({ errors: [], isComplete: false })),
    getOverallStatus: jest.fn(() => ({ errors: [], isComplete: false })),
    canLaunch: jest.fn(() => false),
    validateSignalName: jest.fn(() => ({ isValid: true, errors: [] }))
  }))
}));

// Mock Subframe icons
jest.mock('@subframe/core', () => ({
  FeatherChevronUp: () => <span data-testid="chevron-up-icon" />,
  FeatherChevronDown: () => <span data-testid="chevron-down-icon" />,
  FeatherAlertCircle: () => <span data-testid="alert-circle-icon" />,
  FeatherCheck: () => <span data-testid="check-icon" />,
  FeatherSparkles: () => <span data-testid="sparkles-icon" />,
  FeatherActivity: () => <span data-testid="activity-icon" />,
  FeatherX: () => <span data-testid="x-icon" />,
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('SlackSignalConfig', () => {
  // Mock implementations for hooks
  let mockUpdateData: jest.Mock;
  let mockAttemptLaunch: jest.Mock;
  let mockGetFieldError: jest.Mock;
  let mockContextUpdateData: jest.Mock;
  let mockValidateSignalName: jest.Mock;
  let mockCanLaunch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockUpdateData = jest.fn();
    mockAttemptLaunch = jest.fn(() => true);
    mockGetFieldError = jest.fn(() => null);
    mockContextUpdateData = jest.fn();
    mockValidateSignalName = jest.fn(() => ({ isValid: true, errors: [] }));
    mockCanLaunch = jest.fn(() => false);

    // Reset mocks with proper implementations
    const { useSignalValidation, useAutoSave, useSignalConfig } = require('@/ui');
    
    useSignalValidation.mockReturnValue({
      data: {
        destinationType: '',
        selectedChannel: '',
        selectedRecipients: [],
        triggerType: 'scheduled',
        selectedMetrics: []
      },
      validationState: {
        receiver: { errors: [], isComplete: false },
        trigger: { errors: [], isComplete: false },
        scope: { errors: [], isComplete: false },
        overall: { errors: [], isComplete: false }
      },
      updateData: mockUpdateData,
      getFieldError: mockGetFieldError,
      attemptLaunch: mockAttemptLaunch,
      hasAttemptedLaunch: false
    });

    useAutoSave.mockReturnValue({
      isSaving: false,
      lastSaved: null,
      error: null,
      manualSave: jest.fn()
    });

    useSignalConfig.mockReturnValue({
      data: {
        signalName: 'Weekly User Engagement Report',
        destinationType: '',
        selectedChannel: '',
        selectedRecipients: [],
        triggerType: 'scheduled',
        selectedMetrics: []
      },
      updateData: mockContextUpdateData,
      getSectionStatus: jest.fn(() => ({ errors: [], isComplete: false })),
      getOverallStatus: jest.fn(() => ({ errors: [], isComplete: false })),
      canLaunch: mockCanLaunch,
      validateSignalName: mockValidateSignalName
    });
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockAlert.mockRestore();
  });

  describe('Rendering', () => {
    it('should render the main Slack signal configuration page', () => {
      render(<SlackSignalConfig />);

      expect(screen.getByTestId('signal-config-provider')).toBeInTheDocument();
      expect(screen.getByTestId('signal-config-layout')).toBeInTheDocument();
      expect(screen.getByTestId('config-sections')).toBeInTheDocument();
    });

    it('should render all configuration sections', () => {
      render(<SlackSignalConfig />);

      expect(screen.getByText('Receiver')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-section')).toBeInTheDocument();
      expect(screen.getByTestId('scope-section')).toBeInTheDocument();
      expect(screen.getByTestId('content-section')).toBeInTheDocument();
    });

    it('should display the default signal name', () => {
      render(<SlackSignalConfig />);

      const signalNameInput = screen.getByTestId('signal-name-input');
      expect(signalNameInput).toHaveValue('Weekly User Engagement Report');
    });

    it('should render Slack preview content', () => {
      render(<SlackSignalConfig />);

      const previewContent = screen.getByTestId('preview-content');
      expect(previewContent).toBeInTheDocument();
      expect(previewContent.textContent).toContain('📊 Weekly User Engagement Report');
      expect(previewContent.textContent).toContain('Bonnard');
      expect(previewContent.textContent).toContain('Key Metrics');
    });
  });

  describe('Receiver Section', () => {
    it('should show receiver section as collapsed by default', () => {
      render(<SlackSignalConfig />);

      expect(screen.getByText('Where to send this signal')).toBeInTheDocument();
      expect(screen.queryByText('Destination Type')).not.toBeInTheDocument();
    });

    it('should expand receiver section when clicked', () => {
      render(<SlackSignalConfig />);

      const receiverSection = screen.getByText('Receiver').closest('div');
      fireEvent.click(receiverSection!);

      expect(screen.getByText('Destination Type')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Choose destination')).toBeInTheDocument();
    });

    it('should toggle receiver section with chevron button', () => {
      render(<SlackSignalConfig />);

      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      expect(screen.getByText('Destination Type')).toBeInTheDocument();

      const chevronUpButton = screen.getByTestId('chevron-up-icon').closest('button');
      fireEvent.click(chevronUpButton!);
      expect(screen.queryByText('Destination Type')).not.toBeInTheDocument();
    });

    it('should handle destination type selection', () => {
      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      // Select destination type
      const destinationSelect = screen.getByDisplayValue('Choose destination');
      fireEvent.change(destinationSelect, { target: { value: 'channel' } });

      expect(mockUpdateData).toHaveBeenCalledWith({ destinationType: 'channel' });
    });

    it('should show channel selection when destination type is channel', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'channel',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: [], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      expect(screen.getByText('Select Channel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pick a Slack channel')).toBeInTheDocument();
    });

    it('should handle channel selection', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'channel',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: [], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      // Select channel
      const channelSelect = screen.getByDisplayValue('Pick a Slack channel');
      fireEvent.change(channelSelect, { target: { value: 'general' } });

      expect(mockUpdateData).toHaveBeenCalledWith({ selectedChannel: 'general' });
    });

    it('should show recipient selection when destination type is direct-message', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'direct-message',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: [], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      expect(screen.getByText('Select Recipients')).toBeInTheDocument();
      expect(screen.getByText('Add recipients...')).toBeInTheDocument();
    });

    it('should handle recipient selection and removal', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'direct-message',
          selectedChannel: '',
          selectedRecipients: ['me', 'sarah-johnson'],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: [], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      // Should show selected recipients
      expect(screen.getByText('Me (You)')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();

      // Test removing a recipient
      const removeButtons = screen.getAllByTestId('x-icon');
      fireEvent.click(removeButtons[0]);

      expect(mockUpdateData).toHaveBeenCalledWith({ 
        selectedRecipients: ['sarah-johnson'] 
      });
    });

    it('should add recipients when selected from dropdown', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'direct-message',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: [], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      // Add recipient
      const recipientSelect = screen.getByDisplayValue('Add recipients...');
      fireEvent.change(recipientSelect, { target: { value: 'mike-chen' } });

      expect(mockUpdateData).toHaveBeenCalledWith({ 
        selectedRecipients: ['mike-chen'] 
      });
    });
  });

  describe('Validation and Error Handling', () => {
    it('should show validation errors when attempted launch fails', () => {
      const { useSignalValidation } = require('@/ui');
      mockAttemptLaunch.mockReturnValue(false);
      mockValidateSignalName.mockReturnValue({ 
        isValid: false, 
        errors: ['Signal name is too short'] 
      });

      useSignalValidation.mockReturnValue({
        data: {
          destinationType: '',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: ['Destination type is required'], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: ['Destination type is required'], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: true
      });

      render(<SlackSignalConfig />);

      const launchButton = screen.getByTestId('launch-button');
      fireEvent.click(launchButton);

      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining('Please fix the following issues:')
      );
    });

    it('should show field errors in receiver section', () => {
      const { useSignalValidation } = require('@/ui');
      mockGetFieldError.mockImplementation((field) => {
        if (field === 'destinationType') return 'Destination type is required';
        return null;
      });

      useSignalValidation.mockReturnValue({
        data: {
          destinationType: '',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: ['Destination type is required'], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      // Expand receiver section
      const chevronButton = screen.getByTestId('chevron-down-icon').closest('button');
      fireEvent.click(chevronButton!);

      expect(screen.getByText('Destination type is required')).toBeInTheDocument();
    });

    it('should show validation error count in receiver header', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: '',
          selectedChannel: '',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: ['Error 1', 'Error 2'], isComplete: false },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: true
      });

      render(<SlackSignalConfig />);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByTestId('alert-circle-icon')).toBeInTheDocument();
    });

    it('should show success indicator when section is complete', () => {
      const { useSignalValidation } = require('@/ui');
      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'channel',
          selectedChannel: 'general',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: []
        },
        validationState: {
          receiver: { errors: [], isComplete: true },
          trigger: { errors: [], isComplete: false },
          scope: { errors: [], isComplete: false },
          overall: { errors: [], isComplete: false }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  describe('Signal Name Handling', () => {
    it('should handle signal name changes', () => {
      render(<SlackSignalConfig />);

      const signalNameInput = screen.getByTestId('signal-name-input');
      fireEvent.change(signalNameInput, { target: { value: 'New Signal Name' } });

      expect(mockContextUpdateData).toHaveBeenCalledWith({ 
        signalName: 'New Signal Name' 
      });
    });
  });

  describe('Launch Functionality', () => {
    it('should successfully launch when all validations pass', () => {
      const { useSignalValidation } = require('@/ui');
      mockAttemptLaunch.mockReturnValue(true);
      mockValidateSignalName.mockReturnValue({ isValid: true, errors: [] });
      mockCanLaunch.mockReturnValue(true);

      useSignalValidation.mockReturnValue({
        data: {
          destinationType: 'channel',
          selectedChannel: 'general',
          selectedRecipients: [],
          triggerType: 'scheduled',
          selectedMetrics: ['metric1']
        },
        validationState: {
          receiver: { errors: [], isComplete: true },
          trigger: { errors: [], isComplete: true },
          scope: { errors: [], isComplete: true },
          overall: { errors: [], isComplete: true }
        },
        updateData: mockUpdateData,
        getFieldError: mockGetFieldError,
        attemptLaunch: mockAttemptLaunch,
        hasAttemptedLaunch: false
      });

      render(<SlackSignalConfig />);

      const launchButton = screen.getByTestId('launch-button');
      fireEvent.click(launchButton);

      expect(mockAlert).toHaveBeenCalledWith('Signal launched successfully!');
      expect(mockContextUpdateData).toHaveBeenCalledWith({ 
        isComplete: true, 
        isDraft: false 
      });
    });

    it('should disable launch button when validation fails', () => {
      mockCanLaunch.mockReturnValue(false);
      mockValidateSignalName.mockReturnValue({ isValid: false, errors: [] });

      render(<SlackSignalConfig />);

      const launchButton = screen.getByTestId('launch-button');
      expect(launchButton).toBeDisabled();
    });
  });

  describe('Auto-save Integration', () => {
    it('should integrate with auto-save system', async () => {
      const mockManualSave = jest.fn();
      const { useAutoSave } = require('@/ui');
      
      useAutoSave.mockReturnValue({
        isSaving: true,
        lastSaved: new Date(),
        error: null,
        manualSave: mockManualSave
      });

      render(<SlackSignalConfig />);

      // Auto-save should be integrated with the signal configuration
      expect(useAutoSave).toHaveBeenCalledWith({
        data: expect.any(Object),
        onSave: expect.any(Function),
        delay: 2000
      });
    });

    it('should save configuration data properly', async () => {
      const { useAutoSave } = require('@/ui');
      let onSaveCallback: Function;
      
      useAutoSave.mockImplementation(({ onSave }) => {
        onSaveCallback = onSave;
        return {
          isSaving: false,
          lastSaved: null,
          error: null,
          manualSave: jest.fn()
        };
      });

      render(<SlackSignalConfig />);

      // Simulate auto-save trigger
      const configData = {
        destinationType: 'channel',
        selectedChannel: 'general',
        selectedRecipients: [],
        triggerType: 'scheduled',
        selectedMetrics: ['metric1']
      };

      await act(async () => {
        await onSaveCallback!(configData);
      });

      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Saving Slack signal configuration:',
        configData
      );
      expect(mockContextUpdateData).toHaveBeenCalledWith({
        signalName: 'Weekly User Engagement Report',
        destinationType: 'channel',
        selectedChannel: 'general',
        selectedRecipients: [],
        triggerType: 'scheduled',
        selectedMetrics: ['metric1'],
        hasContent: false,
        contentBlocks: []
      });
    });
  });

  describe('Section Integration', () => {
    it('should integrate with TriggerSection component', () => {
      render(<SlackSignalConfig />);

      const triggerSection = screen.getByTestId('trigger-section');
      expect(triggerSection).toBeInTheDocument();

      // Test trigger section interaction
      const openTriggerButton = screen.getByText('Open Trigger');
      fireEvent.click(openTriggerButton);

      const scheduledButton = screen.getByText('Scheduled');
      fireEvent.click(scheduledButton);

      expect(mockUpdateData).toHaveBeenCalledWith({ triggerType: 'scheduled' });
    });

    it('should integrate with ScopeSection component', () => {
      render(<SlackSignalConfig />);

      const scopeSection = screen.getByTestId('scope-section');
      expect(scopeSection).toBeInTheDocument();

      // Test scope section interaction
      const openScopeButton = screen.getByText('Open Scope');
      fireEvent.click(openScopeButton);

      const addMetricButton = screen.getByText('Add Metric 1');
      fireEvent.click(addMetricButton);

      expect(mockUpdateData).toHaveBeenCalledWith({ selectedMetrics: ['metric1'] });
    });

    it('should integrate with ContentSection component', () => {
      render(<SlackSignalConfig />);

      const contentSection = screen.getByTestId('content-section');
      expect(contentSection).toBeInTheDocument();
      expect(contentSection).toHaveAttribute('data-channel-type', 'slack');
    });
  });

  describe('Preview Content', () => {
    it('should render Slack-specific preview content', () => {
      render(<SlackSignalConfig />);

      const previewContent = screen.getByTestId('preview-content');
      
      // Check for Slack-specific elements
      expect(previewContent.textContent).toContain('Bonnard');
      expect(previewContent.textContent).toContain('📊 Weekly User Engagement Report');
      expect(previewContent.textContent).toContain('Key Metrics');
      expect(previewContent.textContent).toContain('Active Users');
      expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
      expect(previewContent.textContent).toContain('AI Generated');
    });

    it('should include personalization variables in preview', () => {
      render(<SlackSignalConfig />);

      const previewContent = screen.getByTestId('preview-content');
      
      // Check for personalization variables
      expect(previewContent.textContent).toContain('*user name*');
      expect(previewContent.textContent).toContain('*time period*');
      expect(previewContent.textContent).toContain('*metric value*');
      expect(previewContent.textContent).toContain('*trend*');
      expect(previewContent.textContent).toContain('*change %*');
    });
  });
});