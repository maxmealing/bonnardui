"use client";

import React, { useState, useRef, useEffect } from "react";
import { FeatherAlertTriangle } from "@subframe/core";
import { Button } from "./Button";

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  className?: string;
  isSaving?: boolean;
  onSave?: (value: string) => Promise<void>;
  validateName?: (value: string) => string | null; // Returns error message or null
}

export function EditableTitle({
  value,
  onChange,
  placeholder = "Untitled",
  maxLength = 100,
  minLength = 1,
  className = "",
  isSaving = false,
  onSave,
  validateName
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [isLocalSaving, setIsLocalSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const validateInput = (inputValue: string): string | null => {
    const trimmed = inputValue.trim();
    
    if (trimmed.length === 0) {
      return "Please enter a name for your email";
    }
    
    if (trimmed.length < minLength) {
      return `Title must be at least ${minLength} character${minLength === 1 ? '' : 's'}`;
    }
    
    if (trimmed.length > maxLength) {
      return `Title must be ${maxLength} characters or less`;
    }

    if (validateName) {
      return validateName(trimmed);
    }

    return null;
  };

  const handleSave = async () => {
    const trimmed = editValue.trim();
    const validationError = validateInput(editValue);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    if (trimmed === value.trim()) {
      setIsEditing(false);
      setError(null);
      return;
    }

    setError(null);
    
    if (onSave) {
      setIsLocalSaving(true);
      try {
        await onSave(trimmed);
        onChange(trimmed);
        setIsEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save title');
      } finally {
        setIsLocalSaving(false);
      }
    } else {
      onChange(trimmed);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setError(null);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const displayValue = value || placeholder;
  const showSavingState = isSaving || isLocalSaving;
  const hasError = !!error;

  if (isEditing) {
    return (
      <div className={`flex flex-col gap-3 w-full ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full text-heading-2 font-heading-2 text-default-font bg-default-background border-2 border-solid rounded-md px-4 py-3 outline-none transition-colors ${
            hasError 
              ? 'border-error-500 focus:border-error-500' 
              : 'border-neutral-200 focus:border-brand-500'
          }`}
          disabled={showSavingState}
          aria-label="Edit title"
        />
        
        {error && (
          <div className="flex items-center gap-2">
            <FeatherAlertTriangle className="w-4 h-4 text-error-600 flex-shrink-0" />
            <span className="text-body font-body text-error-600">
              {error}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={showSavingState || hasError}
            size="medium"
            variant="brand-primary"
          >
            {showSavingState ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={showSavingState}
            variant="neutral-secondary"
            size="medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h1 className="text-heading-1 font-heading-1 text-default-font">
        {displayValue}
      </h1>
      <button
        onClick={() => setIsEditing(true)}
        className="text-brand-600 hover:text-brand-700 text-body font-body text-left transition-colors cursor-pointer"
      >
        Edit name
      </button>
    </div>
  );
}