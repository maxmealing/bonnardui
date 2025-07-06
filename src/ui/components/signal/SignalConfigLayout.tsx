"use client";

import React, { useState } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { AutoSaveIndicator } from "@/ui/components/AutoSaveIndicator";
import { EditableTitle } from "@/ui/components/EditableTitle";
import { FeatherArrowLeft, FeatherEye, FeatherMaximize2, FeatherMinimize2, FeatherCheck, FeatherAlertCircle } from "@subframe/core";
import { useSignalConfig } from "@/ui/contexts/SignalConfigContext";
import { PreviewControls } from "@/ui/components/signal/PreviewControls";

interface SignalConfigLayoutProps {
  channelType: "slack" | "email" | "webhook";
  signalName?: string;
  onSignalNameChange?: (name: string) => void;
  onSignalNameSave?: (name: string) => Promise<void>;
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  renderPersonalizedContent?: (recipientId: string) => React.ReactNode;
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
  canLaunch?: boolean;
}

export function SignalConfigLayout({ 
  channelType, 
  signalName,
  onSignalNameChange,
  onSignalNameSave,
  children, 
  previewContent,
  renderPersonalizedContent,
  validationState,
  autoSave,
  onLaunchClick,
  canLaunch: canLaunchProp
}: SignalConfigLayoutProps) {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [currentPreviewContent, setCurrentPreviewContent] = useState(previewContent);
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGeneratedPreviews, setHasGeneratedPreviews] = useState(false);
  const { validateSignalName, markAsDraft, saveToStorage, data, generatePersonalizedPreview } = useSignalConfig();
  
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

  const handleFinishLater = () => {
    // Mark as draft and save to storage
    markAsDraft();
    saveToStorage();
    
    // Navigate back to signals list
    window.location.href = '/signals';
  };

  const handleGeneratePreview = async (recipientId?: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate preview generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (recipientId) {
        const personalizedData = generatePersonalizedPreview(recipientId);
        console.log('Generated preview for:', recipientId, personalizedData);
      }
      
      // Update preview content with personalized data
      setCurrentPreviewContent(previewContent);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateForAll = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate preview generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Generated previews for recipients');
      
      // Mark that we have generated previews
      setHasGeneratedPreviews(true);
      
      // Update preview content with current recipient
      updatePreviewForCurrentRecipient();
    } catch (error) {
      console.error('Error generating previews:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePreviewForCurrentRecipient = () => {
    if (hasGeneratedPreviews && data.selectedRecipients.length > 0 && renderPersonalizedContent) {
      const currentRecipient = data.selectedRecipients[currentRecipientIndex];
      if (currentRecipient) {
        const personalizedContent = renderPersonalizedContent(currentRecipient);
        setCurrentPreviewContent(personalizedContent);
      }
    } else {
      // Show template/prompt version by default
      setCurrentPreviewContent(previewContent);
    }
  };

  // Update preview content when recipient changes
  React.useEffect(() => {
    updatePreviewForCurrentRecipient();
  }, [currentRecipientIndex, hasGeneratedPreviews, data.selectedRecipients, renderPersonalizedContent]);

  const handleConfigureRecipients = () => {
    // Navigate to the receiver section or scroll to it
    // For now, we'll just scroll to the top where the receiver section is
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onClick={handleFinishLater}
              >
                Finish Later
              </Button>
              <Button
                onClick={onLaunchClick || (() => {})}
                disabled={canLaunchProp === false}
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
                const validation = validateSignalName(name);
                return validation.isValid ? null : validation.errors[0];
              }}
            />
          </div>
        )}
        
        <div className="flex w-full max-w-[1024px] items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
            {children}
          </div>
          <div className="flex w-96 flex-none flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 sticky top-6">
            <div className="flex w-full items-center justify-between">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Preview
              </span>
              {previewContent && (
                <IconButton
                  variant="neutral-tertiary"
                  icon={<FeatherMaximize2 />}
                  onClick={() => setIsPreviewExpanded(true)}
                  title="Expand preview"
                />
              )}
            </div>
            
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
        
        {/* Expanded Preview Modal */}
        {isPreviewExpanded && previewContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex h-[90vh] w-[90vw] max-w-4xl flex-col rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <span className="text-heading-2 font-heading-2 text-default-font">
                  Preview
                </span>
                <IconButton
                  variant="neutral-tertiary"
                  icon={<FeatherMinimize2 />}
                  onClick={() => setIsPreviewExpanded(false)}
                  title="Minimize preview"
                />
              </div>
              
              {/* Preview Controls */}
              <div className="border-b border-neutral-200 px-6 py-4">
                <PreviewControls
                  channelType={channelType}
                  destinationType={data.destinationType}
                  selectedRecipients={data.selectedRecipients}
                  selectedChannel={data.selectedChannel}
                  onGeneratePreview={handleGeneratePreview}
                  onGenerateForAll={handleGenerateForAll}
                  onConfigureRecipients={handleConfigureRecipients}
                  isGenerating={isGenerating}
                  currentRecipientIndex={currentRecipientIndex}
                  onRecipientChange={setCurrentRecipientIndex}
                />
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-full px-8">
                    {currentPreviewContent || previewContent}
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
                <span className="text-caption font-caption text-subtext-color">
                  This is how your {getChannelDisplayName().toLowerCase()} signal will appear to recipients
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="neutral-secondary"
                    onClick={() => window.location.href = getContentDefinePath()}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setIsPreviewExpanded(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultPageLayout>
  );
}