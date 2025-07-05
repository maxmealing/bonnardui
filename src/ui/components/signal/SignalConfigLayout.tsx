"use client";

import React from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { AutoSaveIndicator } from "@/ui/components/AutoSaveIndicator";
import { EditableTitle } from "@/ui/components/EditableTitle";
import { FeatherArrowLeft, FeatherEye } from "@subframe/core";

interface SignalConfigLayoutProps {
  channelType: "slack" | "email" | "webhook";
  signalName?: string;
  onSignalNameChange?: (name: string) => void;
  onSignalNameSave?: (name: string) => Promise<void>;
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  validationState?: {
    isValid: boolean;
    totalErrors: number;
    hasErrors: boolean;
  };
  autoSave?: {
    isSaving: boolean;
    lastSaved: Date | null;
    error: string | null;
    onManualSave?: () => void;
  };
  onLaunchClick?: () => void;
}

export function SignalConfigLayout({ 
  channelType, 
  signalName,
  onSignalNameChange,
  onSignalNameSave,
  children, 
  previewContent,
  validationState,
  autoSave,
  onLaunchClick
}: SignalConfigLayoutProps) {
  const getChannelDisplayName = () => {
    switch (channelType) {
      case "slack":
        return "Slack";
      case "email":
        return "Email";
      case "webhook":
        return "Webhook";
      default:
        return "Signal";
    }
  };

  const getContentDefinePath = () => {
    switch (channelType) {
      case "slack":
        return "/slack-signal-config/define-content";
      case "email":
        return "/email-signal-config/define-content";
      case "webhook":
        return "/webhook-signal-config/define-content";
      default:
        return "#";
    }
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex w-full flex-col items-center gap-12 bg-neutral-50 py-12 pb-32">
        <div className="flex w-full max-w-[1024px] items-center justify-between">
          <div className="flex items-center gap-4">
            <IconButton
              variant="neutral-tertiary"
              icon={<FeatherArrowLeft />}
              onClick={() => window.history.back()}
            />
            <span className="text-heading-2 font-heading-2 text-default-font">
              Configure {getChannelDisplayName()} Signal
            </span>
          </div>
          <div className="flex items-center gap-4">
            {autoSave && (
              <AutoSaveIndicator 
                isSaving={autoSave.isSaving}
                lastSaved={autoSave.lastSaved}
                error={autoSave.error}
                onManualSave={autoSave.onManualSave}
              />
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="neutral-tertiary"
                onClick={() => {}}
              >
                Finish Later
              </Button>
              <Button
                onClick={onLaunchClick || (() => {})}
              >
                Launch
              </Button>
            </div>
          </div>
        </div>
        
        {/* Editable Signal Name Section */}
        {onSignalNameChange && (
          <div className="w-full max-w-[1024px]">
            <EditableTitle
              value={signalName || ""}
              onChange={onSignalNameChange}
              onSave={onSignalNameSave}
              placeholder="Untitled"
              maxLength={100}
              minLength={1}
              isSaving={autoSave?.isSaving}
              validateName={(name) => {
                if (!name.trim()) return "Please enter a name for your signal";
                if (name.trim().length < 3) return "Signal name must be at least 3 characters";
                return null;
              }}
            />
          </div>
        )}
        
        <div className="flex w-full max-w-[1024px] items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
            {children}
          </div>
          <div className="flex w-96 flex-none flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 sticky top-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Preview
            </span>
            {previewContent || (
              <div className="flex h-96 w-full flex-none flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-border bg-neutral-50 px-6 py-12">
                <FeatherEye className="text-heading-1 font-heading-1 text-neutral-400" />
                <span className="text-body font-body text-subtext-color text-center">
                  Configure your signal to see a preview
                </span>
                <Button
                  variant="neutral-secondary"
                  onClick={() => window.location.href = getContentDefinePath()}
                >
                  Define Content
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}