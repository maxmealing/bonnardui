import { renderHook, act } from '@testing-library/react';
import { useSignalValidation, SignalData } from '../useSignalValidation';

describe('useSignalValidation', () => {
  describe('Initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useSignalValidation());

      expect(result.current.data).toEqual({
        destinationType: '',
        selectedRecipients: [],
        triggerType: 'scheduled',
        signalPrompt: '',
        selectedMetrics: [],
        hasContent: false
      });
      expect(result.current.hasAttemptedLaunch).toBe(false);
      expect(result.current.validationState.showErrors).toBe(false);
    });

    it('should initialize with provided initial data', () => {
      const initialData = {
        destinationType: 'channel',
        selectedChannel: 'general',
        triggerType: 'one-time' as const
      };

      const { result } = renderHook(() => useSignalValidation(initialData));

      expect(result.current.data.destinationType).toBe('channel');
      expect(result.current.data.selectedChannel).toBe('general');
      expect(result.current.data.triggerType).toBe('one-time');
    });
  });

  describe('Data updates', () => {
    it('should update data correctly', () => {
      const { result } = renderHook(() => useSignalValidation());

      act(() => {
        result.current.updateData({
          destinationType: 'channel',
          selectedChannel: 'general'
        });
      });

      expect(result.current.data.destinationType).toBe('channel');
      expect(result.current.data.selectedChannel).toBe('general');
    });

    it('should preserve existing data when updating', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel',
        selectedChannel: 'general'
      }));

      act(() => {
        result.current.updateData({
          triggerType: 'one-time'
        });
      });

      expect(result.current.data.destinationType).toBe('channel');
      expect(result.current.data.selectedChannel).toBe('general');
      expect(result.current.data.triggerType).toBe('one-time');
    });
  });

  describe('Receiver validation', () => {
    it('should validate missing destination type', () => {
      const { result } = renderHook(() => useSignalValidation());

      expect(result.current.validationState.receiver.isValid).toBe(false);
      expect(result.current.validationState.receiver.errors).toHaveLength(1);
      expect(result.current.validationState.receiver.errors[0].message).toBe('Please select a destination type');
    });

    it('should validate channel selection when destination type is channel', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel'
      }));

      expect(result.current.validationState.receiver.isValid).toBe(false);
      expect(result.current.validationState.receiver.errors.some(e => 
        e.message === 'Please select a Slack channel'
      )).toBe(true);
    });

    it('should be valid when channel is properly configured', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel',
        selectedChannel: 'general'
      }));

      expect(result.current.validationState.receiver.isValid).toBe(true);
      expect(result.current.validationState.receiver.isComplete).toBe(true);
    });

    it('should validate recipients selection when destination type is direct-message', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'direct-message',
        selectedRecipients: []
      }));

      expect(result.current.validationState.receiver.isValid).toBe(false);
      expect(result.current.validationState.receiver.errors.some(e => 
        e.message === 'Please select at least one recipient'
      )).toBe(true);
    });

    it('should be valid when direct-message is properly configured', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'direct-message',
        selectedRecipients: ['user1', 'user2']
      }));

      expect(result.current.validationState.receiver.isValid).toBe(true);
      expect(result.current.validationState.receiver.isComplete).toBe(true);
    });
  });

  describe('Trigger validation', () => {
    it('should validate scheduled trigger fields', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'scheduled'
      }));

      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message === 'Please select a frequency')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please set a start date and time')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please select a timezone')).toBe(true);
    });

    it('should be valid when scheduled trigger is properly configured', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'scheduled',
        frequency: 'daily',
        startDateTime: '2023-12-25T10:00',
        timezone: 'UTC'
      }));

      expect(result.current.validationState.trigger.isValid).toBe(true);
      expect(result.current.validationState.trigger.isComplete).toBe(true);
    });

    it('should validate one-time trigger fields', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'one-time'
      }));

      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message === 'Please set an execution date and time')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please select a timezone')).toBe(true);
    });

    it('should be valid when one-time trigger is properly configured', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'one-time',
        executionDateTime: '2023-12-25T10:00',
        timezone: 'UTC'
      }));

      expect(result.current.validationState.trigger.isValid).toBe(true);
      expect(result.current.validationState.trigger.isComplete).toBe(true);
    });

    it('should validate agent-triggered fields', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'agent-triggered'
      }));

      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message === 'Please select a metric to monitor')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please select a condition type')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please select a direction')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please enter a threshold value')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please select a time window')).toBe(true);
      expect(triggerErrors.some(e => e.message === 'Please select a check frequency')).toBe(true);
    });

    it('should validate threshold value as number for agent-triggered', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'agent-triggered',
        thresholdValue: 'not-a-number'
      }));

      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message === 'Threshold must be a valid number')).toBe(true);
    });

    it('should validate cooldown period as number for agent-triggered', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'agent-triggered',
        cooldownPeriod: 'invalid'
      }));

      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message === 'Cooldown period must be a valid number')).toBe(true);
    });

    it('should be valid when agent-triggered is properly configured', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'agent-triggered',
        monitorMetric: 'user_count',
        conditionType: 'threshold',
        direction: 'above',
        thresholdValue: '1000',
        timeWindow: '1h',
        checkFrequency: '5m',
        cooldownPeriod: '30'
      }));

      expect(result.current.validationState.trigger.isValid).toBe(true);
      expect(result.current.validationState.trigger.isComplete).toBe(true);
    });
  });

  describe('Scope validation', () => {
    it('should validate missing signal prompt', () => {
      const { result } = renderHook(() => useSignalValidation());

      const scopeErrors = result.current.validationState.scope.errors;
      expect(scopeErrors.some(e => e.message === 'Please enter a signal prompt')).toBe(true);
    });

    it('should validate signal prompt length', () => {
      const { result } = renderHook(() => useSignalValidation({
        signalPrompt: 'short'
      }));

      const scopeErrors = result.current.validationState.scope.errors;
      expect(scopeErrors.some(e => e.message === 'Signal prompt should be at least 10 characters')).toBe(true);
    });

    it('should validate missing metrics', () => {
      const { result } = renderHook(() => useSignalValidation());

      const scopeErrors = result.current.validationState.scope.errors;
      expect(scopeErrors.some(e => e.message === 'Please select at least one metric')).toBe(true);
    });

    it('should validate missing time frame', () => {
      const { result } = renderHook(() => useSignalValidation());

      const scopeErrors = result.current.validationState.scope.errors;
      expect(scopeErrors.some(e => e.message === 'Please select a time frame')).toBe(true);
    });

    it('should be valid when scope is properly configured', () => {
      const { result } = renderHook(() => useSignalValidation({
        signalPrompt: 'This is a detailed signal prompt with sufficient length',
        selectedMetrics: ['metric1', 'metric2'],
        timeFrame: 'last_week'
      }));

      expect(result.current.validationState.scope.isValid).toBe(true);
      expect(result.current.validationState.scope.isComplete).toBe(true);
    });
  });

  describe('Content validation', () => {
    it('should validate missing content', () => {
      const { result } = renderHook(() => useSignalValidation());

      const contentErrors = result.current.validationState.content.errors;
      expect(contentErrors.some(e => e.message === 'Please define content for your signal')).toBe(true);
    });

    it('should be valid when content is defined', () => {
      const { result } = renderHook(() => useSignalValidation({
        hasContent: true
      }));

      expect(result.current.validationState.content.isValid).toBe(true);
      expect(result.current.validationState.content.isComplete).toBe(true);
    });
  });

  describe('Overall validation state', () => {
    it('should calculate overall validation state correctly', () => {
      const { result } = renderHook(() => useSignalValidation());

      expect(result.current.validationState.isValid).toBe(false);
      expect(result.current.validationState.hasErrors).toBe(true);
      expect(result.current.validationState.totalErrors).toBeGreaterThan(0);
    });

    it('should be valid when all sections are valid', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel',
        selectedChannel: 'general',
        triggerType: 'scheduled',
        frequency: 'daily',
        startDateTime: '2023-12-25T10:00',
        timezone: 'UTC',
        signalPrompt: 'This is a detailed signal prompt with sufficient length',
        selectedMetrics: ['metric1'],
        timeFrame: 'last_week',
        hasContent: true
      }));

      expect(result.current.validationState.isValid).toBe(true);
      expect(result.current.validationState.hasErrors).toBe(false);
      expect(result.current.validationState.totalErrors).toBe(0);
    });
  });

  describe('Field error handling', () => {
    it('should not show field errors before launch attempt', () => {
      const { result } = renderHook(() => useSignalValidation());

      expect(result.current.getFieldError('destinationType')).toBeUndefined();
      expect(result.current.hasAttemptedLaunch).toBe(false);
    });

    it('should show field errors after launch attempt', () => {
      const { result } = renderHook(() => useSignalValidation());

      act(() => {
        result.current.attemptLaunch();
      });

      expect(result.current.getFieldError('destinationType')).toBe('Please select a destination type');
      expect(result.current.hasAttemptedLaunch).toBe(true);
      expect(result.current.validationState.showErrors).toBe(true);
    });

    it('should return correct field error messages', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel',
        triggerType: 'scheduled'
      }));

      act(() => {
        result.current.attemptLaunch();
      });

      expect(result.current.getFieldError('selectedChannel')).toBe('Please select a Slack channel');
      expect(result.current.getFieldError('frequency')).toBe('Please select a frequency');
      expect(result.current.getFieldError('signalPrompt')).toBe('Please enter a signal prompt');
    });
  });

  describe('Launch attempt', () => {
    it('should return false when validation fails', () => {
      const { result } = renderHook(() => useSignalValidation());

      let launchResult: boolean;
      act(() => {
        launchResult = result.current.attemptLaunch();
      });

      expect(launchResult!).toBe(false);
      expect(result.current.hasAttemptedLaunch).toBe(true);
    });

    it('should return true when validation passes', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel',
        selectedChannel: 'general',
        triggerType: 'scheduled',
        frequency: 'daily',
        startDateTime: '2023-12-25T10:00',
        timezone: 'UTC',
        signalPrompt: 'This is a detailed signal prompt with sufficient length',
        selectedMetrics: ['metric1'],
        timeFrame: 'last_week',
        hasContent: true
      }));

      let launchResult: boolean;
      act(() => {
        launchResult = result.current.attemptLaunch();
      });

      expect(launchResult!).toBe(true);
      expect(result.current.hasAttemptedLaunch).toBe(true);
    });
  });

  describe('Validation reset', () => {
    it('should reset validation state', () => {
      const { result } = renderHook(() => useSignalValidation());

      act(() => {
        result.current.attemptLaunch();
      });

      expect(result.current.hasAttemptedLaunch).toBe(true);

      act(() => {
        result.current.resetValidation();
      });

      expect(result.current.hasAttemptedLaunch).toBe(false);
      expect(result.current.validationState.showErrors).toBe(false);
    });
  });

  describe('Validation state reactivity', () => {
    it('should update validation state when data changes', () => {
      const { result } = renderHook(() => useSignalValidation());

      // Initially invalid
      expect(result.current.validationState.receiver.isValid).toBe(false);

      act(() => {
        result.current.updateData({
          destinationType: 'channel',
          selectedChannel: 'general'
        });
      });

      // Should now be valid
      expect(result.current.validationState.receiver.isValid).toBe(true);
    });

    it('should update error count when data changes', () => {
      const { result } = renderHook(() => useSignalValidation());

      const initialErrorCount = result.current.validationState.totalErrors;

      act(() => {
        result.current.updateData({
          destinationType: 'channel',
          selectedChannel: 'general'
        });
      });

      expect(result.current.validationState.totalErrors).toBeLessThan(initialErrorCount);
    });
  });

  describe('Section completeness', () => {
    it('should correctly identify incomplete sections', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel'
        // Missing selectedChannel
      }));

      expect(result.current.validationState.receiver.isComplete).toBe(false);
    });

    it('should correctly identify complete sections', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'channel',
        selectedChannel: 'general'
      }));

      expect(result.current.validationState.receiver.isComplete).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle whitespace-only signal prompt', () => {
      const { result } = renderHook(() => useSignalValidation({
        signalPrompt: '   '
      }));

      const scopeErrors = result.current.validationState.scope.errors;
      expect(scopeErrors.some(e => e.message === 'Please enter a signal prompt')).toBe(true);
    });

    it('should handle empty selected recipients array', () => {
      const { result } = renderHook(() => useSignalValidation({
        destinationType: 'direct-message',
        selectedRecipients: []
      }));

      const receiverErrors = result.current.validationState.receiver.errors;
      expect(receiverErrors.some(e => e.message === 'Please select at least one recipient')).toBe(true);
    });

    it('should handle valid cooldown period for agent-triggered', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'agent-triggered',
        cooldownPeriod: '30'
      }));

      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message.includes('Cooldown period'))).toBe(false);
    });

    it('should handle missing optional fields correctly', () => {
      const { result } = renderHook(() => useSignalValidation({
        triggerType: 'agent-triggered',
        monitorMetric: 'user_count',
        conditionType: 'threshold',
        direction: 'above',
        thresholdValue: '1000',
        timeWindow: '1h',
        checkFrequency: '5m'
        // cooldownPeriod is optional
      }));

      // Should not have cooldown period error since it's optional
      const triggerErrors = result.current.validationState.trigger.errors;
      expect(triggerErrors.some(e => e.message.includes('Cooldown period'))).toBe(false);
    });
  });
});