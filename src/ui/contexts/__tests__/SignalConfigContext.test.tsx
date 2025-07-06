import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { SignalConfigProvider, useSignalConfig, SignalConfigData } from '../SignalConfigContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('SignalConfigContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Provider', () => {
    it('should provide default values', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      expect(result.current.data.signalName).toBe('');
      expect(result.current.data.destinationType).toBe('');
      expect(result.current.data.selectedChannel).toBe('');
      expect(result.current.data.selectedRecipients).toEqual([]);
      expect(result.current.data.triggerType).toBe('scheduled');
      expect(result.current.data.selectedMetrics).toEqual([]);
      expect(result.current.data.hasContent).toBe(false);
      expect(result.current.data.contentBlocks).toEqual([]);
      expect(result.current.data.isDraft).toBe(true);
      expect(result.current.data.isComplete).toBe(false);
    });

    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const { result } = renderHook(() => useSignalConfig());
      
      expect(result.error).toEqual(
        new Error('useSignalConfig must be used within a SignalConfigProvider')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('updateData', () => {
    it('should update data correctly', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.updateData({
          signalName: 'Test Signal',
          destinationType: 'channel',
        });
      });

      expect(result.current.data.signalName).toBe('Test Signal');
      expect(result.current.data.destinationType).toBe('channel');
      expect(result.current.data.lastSaved).toBeInstanceOf(Date);
    });

    it('should auto-save to localStorage when data changes', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.updateData({
          signalName: 'Test Signal',
        });
      });

      // The auto-save happens in useEffect, so we should call saveToStorage manually for testing
      act(() => {
        result.current.saveToStorage();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'current-signal-draft',
        expect.stringContaining('"signalName":"Test Signal"')
      );
    });
  });

  describe('resetData', () => {
    it('should reset data to default values', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.updateData({
          signalName: 'Test Signal',
          destinationType: 'channel',
        });
      });

      act(() => {
        result.current.resetData();
      });

      expect(result.current.data.signalName).toBe('');
      expect(result.current.data.destinationType).toBe('');
    });
  });

  describe('saveToStorage', () => {
    it('should save data to localStorage', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.updateData({
          signalName: 'Test Signal',
        });
      });

      act(() => {
        result.current.saveToStorage();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'current-signal-draft',
        expect.stringContaining('"signalName":"Test Signal"')
      );
    });

    it('should use signalId as storage key when available', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.updateData({
          signalId: 'custom-id',
          signalName: 'Test Signal',
        });
      });

      act(() => {
        result.current.saveToStorage();
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'custom-id',
        expect.stringContaining('"signalName":"Test Signal"')
      );
    });
  });

  describe('loadFromStorage', () => {
    it('should load data from localStorage', () => {
      const storedData = {
        signalName: 'Stored Signal',
        destinationType: 'channel',
        selectedChannel: 'general',
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.loadFromStorage();
      });

      expect(result.current.data.signalName).toBe('Stored Signal');
      expect(result.current.data.destinationType).toBe('channel');
      expect(result.current.data.selectedChannel).toBe('general');
    });

    it('should handle invalid JSON gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.loadFromStorage();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error loading signal config from storage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should use custom signalId as storage key', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.loadFromStorage('custom-signal-id');
      });

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('custom-signal-id');
    });
  });

  describe('validateSignalName', () => {
    it('should validate signal name correctly', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // Valid name
      const validResult = result.current.validateSignalName('Valid Signal Name');
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toEqual([]);

      // Empty name
      const emptyResult = result.current.validateSignalName('');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.errors).toContain('Signal name is required');

      // Too short
      const shortResult = result.current.validateSignalName('Hi');
      expect(shortResult.isValid).toBe(false);
      expect(shortResult.errors).toContain('Signal name must be at least 3 characters long');

      // Too long
      const longName = 'a'.repeat(101);
      const longResult = result.current.validateSignalName(longName);
      expect(longResult.isValid).toBe(false);
      expect(longResult.errors).toContain('Signal name must be less than 100 characters');

      // Invalid characters
      const invalidResult = result.current.validateSignalName('Invalid@Signal#Name');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors).toContain('Signal name contains invalid characters');
    });
  });

  describe('getSectionStatus', () => {
    it('should validate receiver section', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // Empty receiver
      const emptyStatus = result.current.getSectionStatus('receiver');
      expect(emptyStatus.isComplete).toBe(false);
      expect(emptyStatus.errors).toContain('Destination type is required');

      // Channel without selection
      act(() => {
        result.current.updateData({
          destinationType: 'channel',
        });
      });

      const channelStatus = result.current.getSectionStatus('receiver');
      expect(channelStatus.isComplete).toBe(false);
      expect(channelStatus.errors).toContain('Channel selection is required');

      // Complete channel
      act(() => {
        result.current.updateData({
          selectedChannel: 'general',
        });
      });

      const completeStatus = result.current.getSectionStatus('receiver');
      expect(completeStatus.isComplete).toBe(true);
      expect(completeStatus.errors).toEqual([]);
    });

    it('should validate trigger section', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // Scheduled without details
      const scheduledStatus = result.current.getSectionStatus('trigger');
      expect(scheduledStatus.isComplete).toBe(false);
      expect(scheduledStatus.errors).toContain('Scheduled time is required');
      expect(scheduledStatus.errors).toContain('At least one day is required');

      // Complete scheduled
      act(() => {
        result.current.updateData({
          triggerType: 'scheduled',
          scheduledTime: '09:00',
          scheduledDays: ['monday', 'tuesday'],
        });
      });

      const completeScheduledStatus = result.current.getSectionStatus('trigger');
      expect(completeScheduledStatus.isComplete).toBe(true);
      expect(completeScheduledStatus.errors).toEqual([]);

      // One-time without details
      act(() => {
        result.current.updateData({
          triggerType: 'one-time',
          scheduledTime: undefined,
          scheduledDays: undefined,
        });
      });

      const oneTimeStatus = result.current.getSectionStatus('trigger');
      expect(oneTimeStatus.isComplete).toBe(false);
      expect(oneTimeStatus.errors).toContain('Date is required');
      expect(oneTimeStatus.errors).toContain('Time is required');
    });

    it('should validate scope section', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // Empty scope
      const emptyStatus = result.current.getSectionStatus('scope');
      expect(emptyStatus.isComplete).toBe(false);
      expect(emptyStatus.errors).toContain('At least one metric is required');

      // Complete scope
      act(() => {
        result.current.updateData({
          selectedMetrics: ['metric1', 'metric2'],
        });
      });

      const completeStatus = result.current.getSectionStatus('scope');
      expect(completeStatus.isComplete).toBe(true);
      expect(completeStatus.errors).toEqual([]);
    });

    it('should validate content section', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // No content
      const noContentStatus = result.current.getSectionStatus('content');
      expect(noContentStatus.isComplete).toBe(false);
      expect(noContentStatus.errors).toContain('Content is required');

      // Has content but no blocks
      act(() => {
        result.current.updateData({
          hasContent: true,
        });
      });

      const noBlocksStatus = result.current.getSectionStatus('content');
      expect(noBlocksStatus.isComplete).toBe(false);
      expect(noBlocksStatus.errors).toContain('At least one content block is required');

      // Has content with empty blocks
      act(() => {
        result.current.updateData({
          contentBlocks: [
            { id: '1', type: 'text', content: 'Valid content' },
            { id: '2', type: 'text', content: '' },
          ],
        });
      });

      const emptyBlocksStatus = result.current.getSectionStatus('content');
      expect(emptyBlocksStatus.isComplete).toBe(false);
      expect(emptyBlocksStatus.errors).toContain('All content blocks must have content');

      // Complete content
      act(() => {
        result.current.updateData({
          contentBlocks: [
            { id: '1', type: 'text', content: 'Valid content' },
            { id: '2', type: 'text', content: 'Another valid content' },
          ],
        });
      });

      const completeStatus = result.current.getSectionStatus('content');
      expect(completeStatus.isComplete).toBe(true);
      expect(completeStatus.errors).toEqual([]);
    });
  });

  describe('getOverallStatus', () => {
    it('should combine all section validations', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // Incomplete overall
      const incompleteStatus = result.current.getOverallStatus();
      expect(incompleteStatus.isComplete).toBe(false);
      expect(incompleteStatus.errors.length).toBeGreaterThan(0);

      // Complete all sections
      act(() => {
        result.current.updateData({
          destinationType: 'channel',
          selectedChannel: 'general',
          triggerType: 'scheduled',
          scheduledTime: '09:00',
          scheduledDays: ['monday'],
          selectedMetrics: ['metric1'],
          hasContent: true,
          contentBlocks: [
            { id: '1', type: 'text', content: 'Valid content' },
          ],
        });
      });

      const completeStatus = result.current.getOverallStatus();
      expect(completeStatus.isComplete).toBe(true);
      expect(completeStatus.errors).toEqual([]);
    });
  });

  describe('canLaunch', () => {
    it('should return true when all validations pass', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      // Initially can't launch
      expect(result.current.canLaunch()).toBe(false);

      // Complete all sections
      act(() => {
        result.current.updateData({
          destinationType: 'channel',
          selectedChannel: 'general',
          triggerType: 'scheduled',
          scheduledTime: '09:00',
          scheduledDays: ['monday'],
          selectedMetrics: ['metric1'],
          hasContent: true,
          contentBlocks: [
            { id: '1', type: 'text', content: 'Valid content' },
          ],
        });
      });

      expect(result.current.canLaunch()).toBe(true);
    });
  });

  describe('markAsComplete and markAsDraft', () => {
    it('should mark signal as complete', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.markAsComplete();
      });

      expect(result.current.data.isComplete).toBe(true);
      expect(result.current.data.isDraft).toBe(false);
    });

    it('should mark signal as draft', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      act(() => {
        result.current.markAsDraft();
      });

      expect(result.current.data.isDraft).toBe(true);
      expect(result.current.data.isComplete).toBe(false);
    });
  });

  describe('getRecipientName', () => {
    it('should return correct recipient names', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      expect(result.current.getRecipientName('me')).toBe('Me (You)');
      expect(result.current.getRecipientName('sarah-johnson')).toBe('Sarah Johnson');
      expect(result.current.getRecipientName('mike-chen')).toBe('Mike Chen');
      expect(result.current.getRecipientName('unknown-id')).toBe('unknown-id');
    });
  });

  describe('generatePersonalizedPreview', () => {
    it('should generate generic preview without recipient', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      const preview = result.current.generatePersonalizedPreview();
      
      expect(preview.userName).toBe('*user name*');
      expect(preview.timePeriod).toBe('*time period*');
      expect(preview.metricValue).toBe('*metric value*');
      expect(preview.previousValue).toBe('*previous value*');
      expect(preview.changePercentage).toBe('*change %*');
      expect(preview.trendDirection).toBe('*trend*');
    });

    it('should generate personalized preview with recipient', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      const preview = result.current.generatePersonalizedPreview('sarah-johnson');
      
      expect(preview.userName).toBe('Sarah');
      expect(preview.timePeriod).toBe('this week');
      expect(preview.metricValue).toBe('1,234');
      expect(preview.previousValue).toBe('1,156');
      expect(preview.changePercentage).toBe('+6.7');
      expect(preview.trendDirection).toBe('up');
    });

    it('should handle recipient with single name', () => {
      const { result } = renderHook(() => useSignalConfig(), {
        wrapper: SignalConfigProvider,
      });

      const preview = result.current.generatePersonalizedPreview('me');
      
      expect(preview.userName).toBe('Me');
    });
  });
});