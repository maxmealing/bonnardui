"use client";

import React, { useState } from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown, FeatherAlertCircle, FeatherCheck } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { FeatherX } from "@subframe/core";
import { TriggerSection, ScopeSection, ContentSection, SignalConfigLayout, TriggerType, TooltipField, useSignalValidation, useAutoSave, AutoSaveIndicator } from "@/ui";

function SlackSignalConfig() {
  const [signalName, setSignalName] = useState("Weekly User Engagement Report");
  
  // Validation hook
  const { data, validationState, updateData, getFieldError, attemptLaunch, hasAttemptedLaunch } = useSignalValidation({
    destinationType: "channel",
    triggerType: "scheduled"
  });
  
  // Accordion state
  const [isSlackDestinationOpen, setIsSlackDestinationOpen] = useState(false);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);

  // Auto-save functionality
  const { isSaving, lastSaved, error, manualSave } = useAutoSave({
    data,
    onSave: async (configData) => {
      // Simulate API call to save signal configuration
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Saving Slack signal configuration:', configData);
    },
    delay: 2000 // Save 2 seconds after last change
  });

  const handleLaunchClick = () => {
    const isValid = attemptLaunch();
    if (isValid) {
      console.log('Launching signal with data:', data);
      // Proceed with launch
    } else {
      console.log('Launch blocked due to validation errors');
      // Validation errors will now be shown automatically
    }
  };
  
  return (
    <SignalConfigLayout 
      channelType="slack"
      signalName={signalName}
      onSignalNameChange={setSignalName}
      validationState={validationState}
      autoSave={{ isSaving, lastSaved, error, onManualSave: manualSave }}
      onLaunchClick={handleLaunchClick}
    >
      {/* Receiver Section */}
      <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
          <div 
            className={`flex w-full items-start justify-between transition-colors ${!isSlackDestinationOpen ? 'cursor-pointer hover:bg-neutral-25' : ''}`}
            onClick={!isSlackDestinationOpen ? () => setIsSlackDestinationOpen(true) : undefined}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Receiver
                </span>
                {hasAttemptedLaunch && validationState.receiver.errors.length > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-error-50">
                    <FeatherAlertCircle className="w-3 h-3 text-error-600" />
                    <span className="text-caption font-caption text-error-700">
                      {validationState.receiver.errors.length}
                    </span>
                  </div>
                )}
                {!hasAttemptedLaunch && validationState.receiver.isComplete && (
                  <FeatherCheck className="w-4 h-4 text-success-600" />
                )}
              </div>
              <span className={`text-body font-body text-subtext-color ${isSlackDestinationOpen ? 'invisible' : 'visible'}`}>
                Where to send this signal
              </span>
            </div>
            <IconButton
              icon={isSlackDestinationOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
              onClick={(e) => {
                e.stopPropagation();
                setIsSlackDestinationOpen(!isSlackDestinationOpen);
              }}
            />
          </div>
          {isSlackDestinationOpen && (
            <div className="flex w-full flex-col items-start gap-4 pt-1">
            <TooltipField
              label="Destination Type"
              tooltip="Select where you want to send your analytics insights"
              className="w-full"
              error={getFieldError('destinationType')}
              required
            >
              <Select
                className="h-auto w-full"
                placeholder="Choose destination"
                value={data.destinationType}
                onValueChange={(value: string) => updateData({ destinationType: value })}
                error={!!getFieldError('destinationType')}
              >
                <Select.Item value="channel">Channel</Select.Item>
                <Select.Item value="direct-message">Direct Message</Select.Item>
              </Select>
            </TooltipField>
            
            {data.destinationType === "channel" && (
              <TooltipField
                label="Select Channel"
                tooltip="Select the channel where signals will be posted"
                className="w-full"
                error={getFieldError('selectedChannel')}
                required
              >
                <Select
                  className="h-auto w-full"
                  placeholder="Pick a Slack channel"
                  value={data.selectedChannel}
                  onValueChange={(value: string) => updateData({ selectedChannel: value })}
                  error={!!getFieldError('selectedChannel')}
                >
                  <Select.Item value="general"># general</Select.Item>
                  <Select.Item value="analytics"># analytics</Select.Item>
                  <Select.Item value="product-updates"># product-updates</Select.Item>
                  <Select.Item value="alerts"># alerts</Select.Item>
                  <Select.Item value="team-insights"># team-insights</Select.Item>
                </Select>
              </TooltipField>
            )}
            
            {data.destinationType === "direct-message" && (
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full flex-col items-start gap-2">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Select Recipients
                    <span className="text-error-600 ml-1">*</span>
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Choose people who will receive individual direct messages (each person gets their own DM)
                  </span>
                  {getFieldError('selectedRecipients') && (
                    <span className="text-caption font-caption text-error-700">
                      {getFieldError('selectedRecipients')}
                    </span>
                  )}
                </div>
                
                {data.selectedRecipients.length > 0 && (
                  <div className="flex w-full flex-wrap items-start gap-2">
                    {data.selectedRecipients.map((recipient) => {
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
                      return (
                        <div
                          key={recipient}
                          className="flex items-center gap-2 rounded-md border border-solid border-neutral-200 bg-neutral-50 px-3 py-1"
                        >
                          <span className="text-caption font-caption text-default-font">
                            {recipientNames[recipient]}
                          </span>
                          <IconButton
                            size="small"
                            icon={<FeatherX />}
                            onClick={() => {
                              const newRecipients = data.selectedRecipients.filter(r => r !== recipient);
                              updateData({ selectedRecipients: newRecipients });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <Select
                  className="h-auto w-full"
                  placeholder="Add recipients..."
                  value=""
                  onValueChange={(value: string) => {
                    if (value && !data.selectedRecipients.includes(value)) {
                      updateData({ selectedRecipients: [...data.selectedRecipients, value] });
                    }
                  }}
                  error={!!getFieldError('selectedRecipients')}
                >
                  <Select.Item value="me" disabled={data.selectedRecipients.includes("me")}>
                    Me (You)
                  </Select.Item>
                  <Select.Item value="sarah-johnson" disabled={data.selectedRecipients.includes("sarah-johnson")}>
                    Sarah Johnson
                  </Select.Item>
                  <Select.Item value="mike-chen" disabled={data.selectedRecipients.includes("mike-chen")}>
                    Mike Chen
                  </Select.Item>
                  <Select.Item value="emily-davis" disabled={data.selectedRecipients.includes("emily-davis")}>
                    Emily Davis
                  </Select.Item>
                  <Select.Item value="alex-kim" disabled={data.selectedRecipients.includes("alex-kim")}>
                    Alex Kim
                  </Select.Item>
                  <Select.Item value="john-smith" disabled={data.selectedRecipients.includes("john-smith")}>
                    John Smith
                  </Select.Item>
                  <Select.Item value="lisa-wong" disabled={data.selectedRecipients.includes("lisa-wong")}>
                    Lisa Wong
                  </Select.Item>
                  <Select.Item value="david-taylor" disabled={data.selectedRecipients.includes("david-taylor")}>
                    David Taylor
                  </Select.Item>
                </Select>
              </div>
            )}
          </div>
          )}
        </div>

      {/* Trigger Section - Using extracted component */}
      <TriggerSection
        activeTriggerTab={data.triggerType}
        setActiveTriggerTab={(type) => updateData({ triggerType: type })}
        isTriggerOpen={isTriggerOpen}
        setIsTriggerOpen={setIsTriggerOpen}
        validationData={data}
        updateData={updateData}
        getFieldError={getFieldError}
      />

      {/* Scope Section - Using extracted component */}
      <ScopeSection
        selectedMetrics={data.selectedMetrics}
        setSelectedMetrics={(metrics) => updateData({ selectedMetrics: metrics })}
        isScopeOpen={isScopeOpen}
        setIsScopeOpen={setIsScopeOpen}
        validationData={data}
        updateData={updateData}
        getFieldError={getFieldError}
      />

      {/* Content Section - Using extracted component */}
      <ContentSection channelType="slack" />
    </SignalConfigLayout>
  );
}

export default SlackSignalConfig;