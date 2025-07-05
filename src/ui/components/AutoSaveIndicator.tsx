"use client";

import React from 'react';
import { FeatherCheck, FeatherRotateCw, FeatherAlertTriangle, FeatherSave } from '@subframe/core';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  className?: string;
  onManualSave?: () => void;
}

export function AutoSaveIndicator({ 
  isSaving, 
  lastSaved, 
  error, 
  className = "",
  onManualSave
}: AutoSaveIndicatorProps) {
  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 10) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <FeatherAlertTriangle className="w-4 h-4 text-error-600" />
        <span className="text-caption font-caption text-error-700">
          Unable to save
        </span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <FeatherRotateCw className="w-4 h-4 text-neutral-500 animate-spin" />
        <span className="text-caption font-caption text-neutral-600">
          Saving...
        </span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <button 
        onClick={onManualSave}
        disabled={!onManualSave}
        className={`flex items-center gap-2 ${onManualSave ? 'cursor-pointer hover:text-neutral-700 transition-colors' : ''} ${className}`}
      >
        <FeatherCheck className="w-4 h-4 text-neutral-400" />
        <span className="text-caption font-caption text-neutral-500">
          Saved {formatLastSaved(lastSaved)}
        </span>
      </button>
    );
  }

  // Default state - always show auto-save is enabled
  return (
    <button 
      onClick={onManualSave}
      disabled={!onManualSave}
      className={`flex items-center gap-2 ${onManualSave ? 'cursor-pointer hover:text-neutral-700 transition-colors' : ''} ${className}`}
    >
      <FeatherSave className="w-4 h-4 text-neutral-400" />
      <span className="text-caption font-caption text-neutral-500">
        Auto-save on
      </span>
    </button>
  );
}