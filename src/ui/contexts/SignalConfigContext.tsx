"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SignalConfigData {
  // Signal identity
  signalId?: string;
  signalName: string;
  
  // Receiver configuration
  destinationType: string;
  selectedChannel: string;
  selectedRecipients: string[];
  
  // Trigger configuration
  triggerType: "scheduled" | "one-time" | "agent-triggered";
  scheduledTime?: string;
  scheduledDays?: string[];
  oneTimeDate?: string;
  oneTimeTime?: string;
  
  // Scope configuration
  selectedMetrics: string[];
  
  // Content configuration
  hasContent: boolean;
  contentBlocks: Array<{ id: string; type: string; content: string; level?: number }>;
  
  // Status
  isDraft: boolean;
  isComplete: boolean;
  lastSaved?: Date;
}

export interface SectionStatus {
  isComplete: boolean;
  errors: string[];
  hasErrors: boolean;
}

export interface SignalConfigState {
  receiver: SectionStatus;
  trigger: SectionStatus;
  scope: SectionStatus;
  content: SectionStatus;
  overall: SectionStatus;
}

interface SignalConfigContextType {
  data: SignalConfigData;
  updateData: (updates: Partial<SignalConfigData>) => void;
  resetData: () => void;
  saveToStorage: () => void;
  loadFromStorage: (signalId?: string) => void;
  getSectionStatus: (section: keyof SignalConfigState) => SectionStatus;
  getOverallStatus: () => SectionStatus;
  canLaunch: () => boolean;
  markAsComplete: () => void;
  markAsDraft: () => void;
  validateSignalName: (name: string) => { isValid: boolean; errors: string[] };
  getRecipientName: (recipientId: string) => string;
  generatePersonalizedPreview: (recipientId?: string) => {
    userName: string;
    timePeriod: string;
    metricValue: string;
    previousValue: string;
    changePercentage: string;
    trendDirection: string;
  };
}

const defaultData: SignalConfigData = {
  signalName: "",
  destinationType: "",
  selectedChannel: "",
  selectedRecipients: [],
  triggerType: "scheduled",
  selectedMetrics: [],
  hasContent: false,
  contentBlocks: [],
  isDraft: true,
  isComplete: false,
};

const SignalConfigContext = createContext<SignalConfigContextType | undefined>(undefined);

export function SignalConfigProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignalConfigData>(defaultData);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (data.signalName || data.destinationType || data.selectedMetrics.length > 0) {
      const storageKey = data.signalId || 'current-signal-draft';
      localStorage.setItem(storageKey, JSON.stringify({
        ...data,
        lastSaved: new Date()
      }));
    }
  }, [data]);

  const updateData = (updates: Partial<SignalConfigData>) => {
    setData(prev => ({
      ...prev,
      ...updates,
      lastSaved: new Date()
    }));
  };

  const resetData = () => {
    setData(defaultData);
  };

  const saveToStorage = () => {
    const storageKey = data.signalId || 'current-signal-draft';
    localStorage.setItem(storageKey, JSON.stringify({
      ...data,
      lastSaved: new Date()
    }));
  };

  const loadFromStorage = (signalId?: string) => {
    const storageKey = signalId || 'current-signal-draft';
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      } catch (error) {
        console.error('Error loading signal config from storage:', error);
      }
    }
  };

  const validateReceiver = (): SectionStatus => {
    const errors: string[] = [];
    
    if (!data.destinationType) {
      errors.push("Destination type is required");
    }
    
    if (data.destinationType === "channel" && !data.selectedChannel) {
      errors.push("Channel selection is required");
    }
    
    if (data.destinationType === "direct-message" && data.selectedRecipients.length === 0) {
      errors.push("At least one recipient is required");
    }
    
    return {
      isComplete: errors.length === 0,
      errors,
      hasErrors: errors.length > 0
    };
  };

  const validateTrigger = (): SectionStatus => {
    const errors: string[] = [];
    
    if (!data.triggerType) {
      errors.push("Trigger type is required");
    }
    
    if (data.triggerType === "scheduled") {
      if (!data.scheduledTime) {
        errors.push("Scheduled time is required");
      }
      if (!data.scheduledDays || data.scheduledDays.length === 0) {
        errors.push("At least one day is required");
      }
    }
    
    if (data.triggerType === "one-time") {
      if (!data.oneTimeDate) {
        errors.push("Date is required");
      }
      if (!data.oneTimeTime) {
        errors.push("Time is required");
      }
    }
    
    return {
      isComplete: errors.length === 0,
      errors,
      hasErrors: errors.length > 0
    };
  };

  const validateScope = (): SectionStatus => {
    const errors: string[] = [];
    
    if (data.selectedMetrics.length === 0) {
      errors.push("At least one metric is required");
    }
    
    return {
      isComplete: errors.length === 0,
      errors,
      hasErrors: errors.length > 0
    };
  };

  const validateContent = (): SectionStatus => {
    const errors: string[] = [];
    
    if (!data.hasContent) {
      errors.push("Content is required");
    }
    
    if (data.contentBlocks.length === 0) {
      errors.push("At least one content block is required");
    }
    
    // Check for empty content blocks
    const hasEmptyBlocks = data.contentBlocks.some(block => !block.content || block.content.trim() === '');
    if (hasEmptyBlocks) {
      errors.push("All content blocks must have content");
    }
    
    return {
      isComplete: errors.length === 0,
      errors,
      hasErrors: errors.length > 0
    };
  };

  const validateSignalName = (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!name || name.trim() === '') {
      errors.push("Signal name is required");
    } else {
      if (name.length < 3) {
        errors.push("Signal name must be at least 3 characters long");
      }
      if (name.length > 100) {
        errors.push("Signal name must be less than 100 characters");
      }
      // Check for invalid characters (basic validation)
      if (!/^[a-zA-Z0-9\s\-_.,!]+$/.test(name)) {
        errors.push("Signal name contains invalid characters");
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const getSectionStatus = (section: keyof SignalConfigState): SectionStatus => {
    switch (section) {
      case 'receiver':
        return validateReceiver();
      case 'trigger':
        return validateTrigger();
      case 'scope':
        return validateScope();
      case 'content':
        return validateContent();
      case 'overall':
        return getOverallStatus();
      default:
        return { isComplete: false, errors: [], hasErrors: false };
    }
  };

  const getOverallStatus = (): SectionStatus => {
    const receiver = validateReceiver();
    const trigger = validateTrigger();
    const scope = validateScope();
    const content = validateContent();
    
    const allErrors = [
      ...receiver.errors,
      ...trigger.errors,
      ...scope.errors,
      ...content.errors
    ];
    
    return {
      isComplete: receiver.isComplete && trigger.isComplete && scope.isComplete && content.isComplete,
      errors: allErrors,
      hasErrors: allErrors.length > 0
    };
  };

  const canLaunch = (): boolean => {
    return getOverallStatus().isComplete;
  };

  const markAsComplete = () => {
    updateData({ isComplete: true, isDraft: false });
  };

  const markAsDraft = () => {
    updateData({ isDraft: true, isComplete: false });
  };

  const getRecipientName = (recipientId: string): string => {
    const recipientNames: Record<string, string> = {
      "me": "Me (You)",
      "sarah-johnson": "Sarah Johnson",
      "mike-chen": "Mike Chen",
      "emily-davis": "Emily Davis",
      "alex-kim": "Alex Kim",
      "john-smith": "John Smith",
      "lisa-wong": "Lisa Wong",
      "david-taylor": "David Taylor"
    };
    return recipientNames[recipientId] || recipientId;
  };

  const generatePersonalizedPreview = (recipientId?: string) => {
    // Generate personalized preview data based on recipient
    if (!recipientId) {
      return {
        userName: "*user name*",
        timePeriod: "*time period*",
        metricValue: "*metric value*",
        previousValue: "*previous value*",
        changePercentage: "*change %*",
        trendDirection: "*trend*"
      };
    }

    const recipientName = getRecipientName(recipientId);
    const firstName = recipientName.split(' ')[0];

    return {
      userName: firstName,
      timePeriod: "this week",
      metricValue: "1,234",
      previousValue: "1,156",
      changePercentage: "+6.7",
      trendDirection: "up"
    };
  };

  return (
    <SignalConfigContext.Provider value={{
      data,
      updateData,
      resetData,
      saveToStorage,
      loadFromStorage,
      getSectionStatus,
      getOverallStatus,
      canLaunch,
      markAsComplete,
      markAsDraft,
      validateSignalName,
      getRecipientName,
      generatePersonalizedPreview
    }}>
      {children}
    </SignalConfigContext.Provider>
  );
}

export function useSignalConfig() {
  const context = useContext(SignalConfigContext);
  if (context === undefined) {
    throw new Error('useSignalConfig must be used within a SignalConfigProvider');
  }
  return context;
}