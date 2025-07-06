import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';

describe('useAutoSave', () => {
  let mockOnSave: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockOnSave = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      expect(result.current.isSaving).toBe(false);
      expect(result.current.lastSaved).toBeNull();
      expect(result.current.error).toBeNull();
      expect(typeof result.current.manualSave).toBe('function');
    });

    it('should not trigger save on initial render', () => {
      renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Auto-save functionality', () => {
    it('should trigger auto-save after data changes and delay', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      // Change data
      rerender({ data: { test: 'changed' } });

      // Should not save immediately
      expect(mockOnSave).not.toHaveBeenCalled();

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ test: 'changed' });
      });
    });

    it('should debounce multiple rapid changes', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      // Make multiple rapid changes
      rerender({ data: { test: 'change1' } });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      rerender({ data: { test: 'change2' } });
      act(() => {
        jest.advanceTimersByTime(500);
      });

      rerender({ data: { test: 'final' } });

      // Only the final change should be saved after full delay
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith({ test: 'final' });
      });
    });

    it('should not trigger save if data is identical', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'value' } } }
      );

      // Set same data
      rerender({ data: { test: 'value' } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should use custom delay', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 3000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      rerender({ data: { test: 'changed' } });

      // Should not save before custom delay
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(mockOnSave).not.toHaveBeenCalled();

      // Should save after custom delay
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('should not auto-save when disabled', () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          enabled: false
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      rerender({ data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Manual save', () => {
    it('should save immediately when manualSave is called', async () => {
      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      await act(async () => {
        await result.current.manualSave();
      });

      expect(mockOnSave).toHaveBeenCalledWith({ test: 'data' });
    });

    it('should update lastSaved date after manual save', async () => {
      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      const beforeSave = new Date();

      await act(async () => {
        await result.current.manualSave();
      });

      expect(result.current.lastSaved).toBeInstanceOf(Date);
      expect(result.current.lastSaved!.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    });

    it('should prevent auto-save after manual save', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      // Change data
      rerender({ data: { test: 'changed' } });

      // Manual save before auto-save triggers
      await act(async () => {
        await result.current.manualSave();
      });

      // Clear the mock to check if auto-save triggers
      mockOnSave.mockClear();

      // Fast-forward past auto-save delay
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Auto-save should not trigger since manual save updated the reference
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Saving state management', () => {
    it('should set isSaving to true during auto-save', async () => {
      mockOnSave.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      rerender({ data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Should be saving
      expect(result.current.isSaving).toBe(true);

      // Wait for save to complete
      await act(async () => {
        jest.useRealTimers();
        await new Promise(resolve => setTimeout(resolve, 150));
        jest.useFakeTimers();
      });

      expect(result.current.isSaving).toBe(false);
    });

    it('should set isSaving to true during manual save', async () => {
      let resolvePromise: () => void;
      mockOnSave.mockImplementation(() => new Promise(resolve => {
        resolvePromise = resolve;
      }));

      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      const savePromise = act(async () => {
        await result.current.manualSave();
      });

      expect(result.current.isSaving).toBe(true);

      resolvePromise!();
      await savePromise;

      expect(result.current.isSaving).toBe(false);
    });

    it('should update lastSaved after successful auto-save', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      rerender({ data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.lastSaved).toBeInstanceOf(Date);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle auto-save errors', async () => {
      const error = new Error('Save failed');
      mockOnSave.mockRejectedValue(error);

      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      rerender({ data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Save failed');
        expect(result.current.isSaving).toBe(false);
      });
    });

    it('should handle manual save errors', async () => {
      const error = new Error('Manual save failed');
      mockOnSave.mockRejectedValue(error);

      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      await act(async () => {
        await result.current.manualSave();
      });

      expect(result.current.error).toBe('Manual save failed');
      expect(result.current.isSaving).toBe(false);
    });

    it('should handle non-Error objects', async () => {
      mockOnSave.mockRejectedValue('String error');

      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      await act(async () => {
        await result.current.manualSave();
      });

      expect(result.current.error).toBe('Failed to save');
    });

    it('should clear error on successful save', async () => {
      // First call fails
      mockOnSave.mockRejectedValueOnce(new Error('Save failed'));

      const { result } = renderHook(() => useAutoSave({
        data: { test: 'data' },
        onSave: mockOnSave
      }));

      // Manual save that fails
      await act(async () => {
        await result.current.manualSave();
      });

      expect(result.current.error).toBe('Save failed');

      // Second call succeeds
      mockOnSave.mockResolvedValueOnce(undefined);

      // Manual save that succeeds
      await act(async () => {
        await result.current.manualSave();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Cleanup', () => {
    it('should clear timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, rerender, unmount } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      // Change data to set a timeout
      rerender({ data: { test: 'changed' } });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it('should clear timeout when data changes rapidly', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      // First change
      rerender({ data: { test: 'change1' } });
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(0);

      // Second change should clear the previous timeout
      rerender({ data: { test: 'change2' } });
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Complex data changes', () => {
    it('should handle deep object changes', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { 
          initialProps: { 
            data: { 
              user: { name: 'John', age: 30 },
              settings: { theme: 'dark' }
            } 
          } 
        }
      );

      // Change nested data
      rerender({ 
        data: { 
          user: { name: 'John', age: 31 },
          settings: { theme: 'dark' }
        } 
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({
          user: { name: 'John', age: 31 },
          settings: { theme: 'dark' }
        });
      });
    });

    it('should handle array changes', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { items: ['a', 'b'] } } }
      );

      // Add item to array
      rerender({ data: { items: ['a', 'b', 'c'] } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ items: ['a', 'b', 'c'] });
      });
    });

    it('should handle undefined and null values', async () => {
      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          delay: 1000
        }),
        { initialProps: { data: { value: 'test' } } }
      );

      // Change to null
      rerender({ data: { value: null } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith({ value: null });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle enabled state changes', () => {
      const { result, rerender } = renderHook(
        ({ enabled, data }) => useAutoSave({
          data,
          onSave: mockOnSave,
          enabled
        }),
        { initialProps: { enabled: true, data: { test: 'initial' } } }
      );

      // Disable auto-save
      rerender({ enabled: false, data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockOnSave).not.toHaveBeenCalled();

      // Re-enable auto-save with new data
      rerender({ enabled: true, data: { test: 'changed-again' } });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(mockOnSave).toHaveBeenCalledWith({ test: 'changed-again' });
    });

    it('should handle onSave function changes', async () => {
      const newOnSave = jest.fn();

      const { result, rerender } = renderHook(
        ({ onSave, data }) => useAutoSave({
          data,
          onSave,
          delay: 1000
        }),
        { initialProps: { onSave: mockOnSave, data: { test: 'initial' } } }
      );

      // Change onSave function and data
      rerender({ onSave: newOnSave, data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(newOnSave).toHaveBeenCalledWith({ test: 'changed' });
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });

    it('should handle sync onSave functions', async () => {
      const syncOnSave = jest.fn();

      const { result, rerender } = renderHook(
        ({ data }) => useAutoSave({
          data,
          onSave: syncOnSave,
          delay: 1000
        }),
        { initialProps: { data: { test: 'initial' } } }
      );

      rerender({ data: { test: 'changed' } });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(syncOnSave).toHaveBeenCalledWith({ test: 'changed' });
      });
    });
  });
});