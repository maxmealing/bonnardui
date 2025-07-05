"use client";

import { useState, useCallback, useMemo } from 'react';

export interface ValidationError {
  field: string;
  message: string;
  section: 'receiver' | 'trigger' | 'scope' | 'content';
}

export interface ValidationSection {
  errors: ValidationError[];
  isValid: boolean;
  isComplete: boolean;
}

export interface ValidationState {
  receiver: ValidationSection;
  trigger: ValidationSection;
  scope: ValidationSection;
  content: ValidationSection;
  isValid: boolean;
  hasErrors: boolean;
  totalErrors: number;
}

export interface SignalData {
  // Receiver section
  destinationType: string;
  selectedChannel?: string;
  selectedRecipients: string[];
  
  // Trigger section
  triggerType: 'scheduled' | 'one-time' | 'agent-triggered';
  frequency?: string;
  startDateTime?: string;
  timezone?: string;
  executionDateTime?: string;
  monitorMetric?: string;
  conditionType?: string;
  direction?: string;
  thresholdValue?: string;
  timeWindow?: string;
  checkFrequency?: string;
  cooldownPeriod?: string;
  
  // Scope section
  signalPrompt: string;
  selectedMetrics: string[];
  timeFrame?: string;
  
  // Content section
  hasContent: boolean;
}

const validateReceiver = (data: SignalData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.destinationType) {
    errors.push({
      field: 'destinationType',
      message: 'Please select a destination type',
      section: 'receiver'
    });
  }
  
  if (data.destinationType === 'channel' && !data.selectedChannel) {
    errors.push({
      field: 'selectedChannel',
      message: 'Please select a Slack channel',
      section: 'receiver'
    });
  }
  
  if (data.destinationType === 'direct-message' && data.selectedRecipients.length === 0) {
    errors.push({
      field: 'selectedRecipients',
      message: 'Please select at least one recipient',
      section: 'receiver'
    });
  }
  
  return errors;
};

const validateTrigger = (data: SignalData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (data.triggerType === 'scheduled') {
    if (!data.frequency) {
      errors.push({
        field: 'frequency',
        message: 'Please select a frequency',
        section: 'trigger'
      });
    }
    
    if (!data.startDateTime) {
      errors.push({
        field: 'startDateTime',
        message: 'Please set a start date and time',
        section: 'trigger'
      });
    }
    
    if (!data.timezone) {
      errors.push({
        field: 'timezone',
        message: 'Please select a timezone',
        section: 'trigger'
      });
    }
  }
  
  if (data.triggerType === 'one-time') {
    if (!data.executionDateTime) {
      errors.push({
        field: 'executionDateTime',
        message: 'Please set an execution date and time',
        section: 'trigger'
      });
    }
    
    if (!data.timezone) {
      errors.push({
        field: 'timezone',
        message: 'Please select a timezone',
        section: 'trigger'
      });
    }
  }
  
  if (data.triggerType === 'agent-triggered') {
    if (!data.monitorMetric) {
      errors.push({
        field: 'monitorMetric',
        message: 'Please select a metric to monitor',
        section: 'trigger'
      });
    }
    
    if (!data.conditionType) {
      errors.push({
        field: 'conditionType',
        message: 'Please select a condition type',
        section: 'trigger'
      });
    }
    
    if (!data.direction) {
      errors.push({
        field: 'direction',
        message: 'Please select a direction',
        section: 'trigger'
      });
    }
    
    if (!data.thresholdValue) {
      errors.push({
        field: 'thresholdValue',
        message: 'Please enter a threshold value',
        section: 'trigger'
      });
    } else if (isNaN(Number(data.thresholdValue))) {
      errors.push({
        field: 'thresholdValue',
        message: 'Threshold must be a valid number',
        section: 'trigger'
      });
    }
    
    if (!data.timeWindow) {
      errors.push({
        field: 'timeWindow',
        message: 'Please select a time window',
        section: 'trigger'
      });
    }
    
    if (!data.checkFrequency) {
      errors.push({
        field: 'checkFrequency',
        message: 'Please select a check frequency',
        section: 'trigger'
      });
    }
    
    if (data.cooldownPeriod && isNaN(Number(data.cooldownPeriod))) {
      errors.push({
        field: 'cooldownPeriod',
        message: 'Cooldown period must be a valid number',
        section: 'trigger'
      });
    }
  }
  
  return errors;
};

const validateScope = (data: SignalData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.signalPrompt.trim()) {
    errors.push({
      field: 'signalPrompt',
      message: 'Please enter a signal prompt',
      section: 'scope'
    });
  } else if (data.signalPrompt.trim().length < 10) {
    errors.push({
      field: 'signalPrompt',
      message: 'Signal prompt should be at least 10 characters',
      section: 'scope'
    });
  }
  
  if (data.selectedMetrics.length === 0) {
    errors.push({
      field: 'selectedMetrics',
      message: 'Please select at least one metric',
      section: 'scope'
    });
  }
  
  if (!data.timeFrame) {
    errors.push({
      field: 'timeFrame',
      message: 'Please select a time frame',
      section: 'scope'
    });
  }
  
  return errors;
};

const validateContent = (data: SignalData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.hasContent) {
    errors.push({
      field: 'content',
      message: 'Please define content for your signal',
      section: 'content'
    });
  }
  
  return errors;
};

export function useSignalValidation(initialData: Partial<SignalData> = {}) {
  const [data, setData] = useState<SignalData>({
    destinationType: '',
    selectedRecipients: [],
    triggerType: 'scheduled',
    signalPrompt: '',
    selectedMetrics: [],
    hasContent: false,
    ...initialData
  });

  const [hasAttemptedLaunch, setHasAttemptedLaunch] = useState(false);

  const validationState = useMemo<ValidationState>(() => {
    const receiverErrors = validateReceiver(data);
    const triggerErrors = validateTrigger(data);
    const scopeErrors = validateScope(data);
    const contentErrors = validateContent(data);
    
    const receiver: ValidationSection = {
      errors: receiverErrors,
      isValid: receiverErrors.length === 0,
      isComplete: receiverErrors.length === 0 && (
        (data.destinationType === 'channel' && !!data.selectedChannel) ||
        (data.destinationType === 'direct-message' && data.selectedRecipients.length > 0)
      )
    };
    
    const trigger: ValidationSection = {
      errors: triggerErrors,
      isValid: triggerErrors.length === 0,
      isComplete: triggerErrors.length === 0
    };
    
    const scope: ValidationSection = {
      errors: scopeErrors,
      isValid: scopeErrors.length === 0,
      isComplete: scopeErrors.length === 0
    };
    
    const content: ValidationSection = {
      errors: contentErrors,
      isValid: contentErrors.length === 0,
      isComplete: contentErrors.length === 0
    };
    
    const allErrors = [...receiverErrors, ...triggerErrors, ...scopeErrors, ...contentErrors];
    
    return {
      receiver,
      trigger,
      scope,
      content,
      isValid: allErrors.length === 0,
      hasErrors: allErrors.length > 0,
      totalErrors: allErrors.length
    };
  }, [data]);

  const updateData = useCallback((updates: Partial<SignalData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    // Only show errors if launch has been attempted
    if (!hasAttemptedLaunch) return undefined;
    
    const allErrors = [
      ...validationState.receiver.errors,
      ...validationState.trigger.errors,
      ...validationState.scope.errors,
      ...validationState.content.errors
    ];
    return allErrors.find(error => error.field === field)?.message;
  }, [validationState, hasAttemptedLaunch]);

  const attemptLaunch = useCallback(() => {
    setHasAttemptedLaunch(true);
    return validationState.isValid;
  }, [validationState.isValid]);

  const resetValidation = useCallback(() => {
    setHasAttemptedLaunch(false);
  }, []);

  return {
    data,
    validationState: {
      ...validationState,
      showErrors: hasAttemptedLaunch
    },
    updateData,
    getFieldError,
    attemptLaunch,
    resetValidation,
    hasAttemptedLaunch
  };
}