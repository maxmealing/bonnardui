"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/ui/components/Button";
import { Select } from "@/ui/components/Select";
import { IconButton } from "@/ui/components/IconButton";
import { TextField } from "@/ui/components/TextField";
import { FeatherUser, FeatherAlertCircle, FeatherRefreshCw, FeatherChevronLeft, FeatherChevronRight } from "@subframe/core";

interface PreviewControlsProps {
  channelType: "slack" | "email" | "webhook";
  destinationType: string;
  selectedRecipients: string[];
  selectedChannel?: string;
  onGeneratePreview: (recipientId?: string) => void;
  onGenerateForAll?: () => void;
  onConfigureRecipients: () => void;
  isGenerating?: boolean;
  currentRecipientIndex?: number;
  onRecipientChange?: (index: number) => void;
}

// Recipient data mapping
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

export function PreviewControls({
  channelType,
  destinationType,
  selectedRecipients,
  selectedChannel,
  onGeneratePreview,
  onGenerateForAll,
  onConfigureRecipients,
  isGenerating = false,
  currentRecipientIndex = 0,
  onRecipientChange
}: PreviewControlsProps) {
  const [hasGenerated, setHasGenerated] = useState(false);
  const [numberOfRecipients, setNumberOfRecipients] = useState(selectedRecipients.length);
  const [inputValue, setInputValue] = useState(selectedRecipients.length.toString());
  const [generatedCount, setGeneratedCount] = useState(0);
  
  const hasRecipients = selectedRecipients.length > 0;
  const isDirectMessage = destinationType === "direct-message";
  const isChannel = destinationType === "channel";
  const currentRecipient = selectedRecipients[currentRecipientIndex];

  // Update number of recipients when selectedRecipients changes
  useEffect(() => {
    setNumberOfRecipients(selectedRecipients.length);
    setInputValue(selectedRecipients.length.toString());
    setHasGenerated(false); // Reset when recipients change
  }, [selectedRecipients.length]);

  // Reset current recipient index when it's out of bounds
  useEffect(() => {
    if (currentRecipientIndex >= generatedCount && generatedCount > 0) {
      onRecipientChange?.(0);
    }
  }, [generatedCount, currentRecipientIndex, onRecipientChange]);

  const handleGenerateForSelected = () => {
    setHasGenerated(true);
    setGeneratedCount(numberOfRecipients);
    onRecipientChange?.(0); // Reset to first recipient
    onGenerateForAll?.();
  };

  // Channel mode - recipients not needed for preview
  if (isChannel && selectedChannel) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-solid border-neutral-border bg-neutral-25 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-brand-100">
            <FeatherUser className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-body-bold font-body-bold text-default-font">
              Channel Preview
            </span>
            <span className="text-caption font-caption text-subtext-color">
              Previewing message for #{selectedChannel}
            </span>
          </div>
        </div>
        <Button
          variant="neutral-secondary"
          size="small"
          icon={isGenerating ? <FeatherRefreshCw className="animate-spin" /> : undefined}
          onClick={() => onGeneratePreview()}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
    );
  }

  // Direct message mode with recipients
  if (isDirectMessage && hasRecipients) {
    return (
      <div className="flex flex-col gap-4">
        {/* Generate Controls - 2 Column Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column: Generate Controls */}
          <div className="flex items-center gap-2">
            <span className="text-body font-body text-default-font">
              Generate previews for
            </span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                const newValue = e.target.value;
                setInputValue(newValue);
                
                // Update numberOfRecipients if it's a valid number
                if (newValue !== '') {
                  const parsed = parseInt(newValue);
                  if (!isNaN(parsed)) {
                    setNumberOfRecipients(parsed);
                  }
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                  setNumberOfRecipients(1);
                  setInputValue('1');
                } else if (value > selectedRecipients.length) {
                  setNumberOfRecipients(selectedRecipients.length);
                  setInputValue(selectedRecipients.length.toString());
                } else {
                  setNumberOfRecipients(value);
                  setInputValue(value.toString());
                }
              }}
              min={1}
              max={selectedRecipients.length}
              className="w-16 px-2 py-1 text-center border border-neutral-300 rounded text-body font-body"
            />
            <span className="text-body font-body text-default-font">
              of {selectedRecipients.length}
            </span>
            <Button
              variant="brand-primary"
              size="small"
              icon={isGenerating ? <FeatherRefreshCw className="animate-spin" /> : undefined}
              onClick={handleGenerateForSelected}
              disabled={isGenerating || numberOfRecipients < 1}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>

          {/* Right Column: Navigation Controls */}
          {hasGenerated && !isGenerating && (
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-neutral-100 border border-neutral-200">
                  <span className="text-caption font-caption text-neutral-700">
                    {recipientNames[currentRecipient] || currentRecipient}
                  </span>
                </div>
                <span className="text-caption font-caption text-subtext-color">
                  {currentRecipientIndex + 1} of {generatedCount}
                </span>
                <IconButton
                  variant="neutral-tertiary"
                  size="small"
                  icon={<FeatherChevronLeft />}
                  onClick={() => onRecipientChange?.(Math.max(0, currentRecipientIndex - 1))}
                  disabled={currentRecipientIndex === 0}
                />
                <IconButton
                  variant="neutral-tertiary"
                  size="small"
                  icon={<FeatherChevronRight />}
                  onClick={() => onRecipientChange?.(Math.min(generatedCount - 1, currentRecipientIndex + 1))}
                  disabled={currentRecipientIndex === generatedCount - 1}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback - no recipients selected or invalid state
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-solid border-error-200 bg-error-25 p-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-error-100">
          <FeatherAlertCircle className="w-4 h-4 text-error-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-body-bold font-body-bold text-error-700">
            Select audience to preview personalized messages
          </span>
          <span className="text-caption font-caption text-error-600">
            {channelType === "slack" 
              ? "Choose a channel or recipients in the Receiver section"
              : channelType === "email"
              ? "Select email recipients in the Receiver section" 
              : "Configure webhook destination in the Receiver section"
            }
          </span>
        </div>
      </div>
      <Button
        variant="destructive-secondary"
        size="small"
        onClick={onConfigureRecipients}
      >
        Configure Recipients
      </Button>
    </div>
  );
}