"use client";

import React, { useState } from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown, FeatherCpu } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { TextField } from "@/ui/components/TextField";
import { FeatherX } from "@subframe/core";
import { TriggerSection, ScopeSection, ContentSection, SignalConfigLayout, TriggerType, TooltipField, useAutoSave, SignalConfigProvider } from "@/ui";

function EmailSignalConfigContent() {
  const [signalName, setSignalName] = useState("Monthly Performance Dashboard");
  const [activeTriggerTab, setActiveTriggerTab] = useState<TriggerType>("scheduled");
  const [destinationType, setDestinationType] = useState<string>("individual");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  
  // Accordion state
  const [isEmailDestinationOpen, setIsEmailDestinationOpen] = useState(false);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);

  // Auto-save functionality
  const configData = {
    activeTriggerTab,
    destinationType,
    selectedRecipients,
    selectedMetrics
  };

  const { isSaving, lastSaved, error, manualSave } = useAutoSave({
    data: configData,
    onSave: async (data) => {
      // Simulate API call to save email signal configuration
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Saving Email signal configuration:', data);
    },
    delay: 2000 // Save 2 seconds after last change
  });
  
  const emailPreview = (
    <div className="flex flex-col gap-3 rounded-lg border border-solid border-neutral-200 bg-white p-4 w-full">
      {/* Email header */}
      <div className="flex flex-col gap-2 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="text-caption-bold font-caption-bold text-default-font">From:</span>
          <span className="text-caption font-caption text-subtext-color">analytics@company.com</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption-bold font-caption-bold text-default-font">Subject:</span>
          <span className="text-caption font-caption text-default-font">
            📈 Daily Revenue Alert - <span className="font-bold">*time period*</span>
          </span>
        </div>
      </div>
      
      {/* Email content preview */}
      <div className="flex flex-col gap-3">
        <div className="text-heading-3 font-heading-3 text-default-font">
          Daily Revenue Summary
        </div>
        <div className="text-body font-body text-default-font">
          Hello <span className="font-bold">*user name*</span>,<br/><br/>
          Here&apos;s your daily revenue report for <span className="font-bold">*time period*</span>:
        </div>
        <div className="text-body-bold font-body-bold text-default-font">
          💰 Revenue Metrics
        </div>
        <div className="text-body font-body text-default-font">
          Total Revenue: $<span className="font-bold">*metric value*</span><br/>
          Change from yesterday: <span className="font-bold">*trend*</span> <span className="font-bold">*change %*</span>%<br/>
          Previous day: $<span className="font-bold">*previous value*</span>
        </div>
        <div className="rounded border border-solid border-neutral-200 bg-neutral-50 p-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <FeatherCpu className="w-4 h-4 text-brand-600" />
            <span className="text-caption-bold font-caption-bold text-brand-700">AI Generated</span>
          </div>
          <div className="text-body font-body text-neutral-700">
            [AI analysis of revenue trends and actionable insights...]
          </div>
        </div>
        <div className="text-center mt-3">
          <div className="inline-block bg-brand-600 text-white px-6 py-3 rounded-md text-body-bold font-body-bold">
            View Full Dashboard
          </div>
        </div>
        <div className="text-body font-body text-default-font mt-2 text-neutral-600">
          Best regards,<br/>
          The Analytics Team
        </div>
      </div>
    </div>
  );
  
  return (
    <SignalConfigLayout 
      channelType="email"
      signalName={signalName}
      onSignalNameChange={setSignalName}
      autoSave={{ isSaving, lastSaved, error, onManualSave: manualSave }}
      previewContent={emailPreview}
    >
      {/* Receiver Section */}
      <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
          <div 
            className={`flex w-full items-start justify-between transition-colors ${!isEmailDestinationOpen ? 'cursor-pointer hover:bg-neutral-25' : ''}`}
            onClick={!isEmailDestinationOpen ? () => setIsEmailDestinationOpen(true) : undefined}
          >
            <div className="flex flex-col gap-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Receiver
              </span>
              <span className={`text-body font-body text-subtext-color ${isEmailDestinationOpen ? 'invisible' : 'visible'}`}>
                Who receives this signal
              </span>
            </div>
            <IconButton
              icon={isEmailDestinationOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
              onClick={(e) => {
                e.stopPropagation();
                setIsEmailDestinationOpen(!isEmailDestinationOpen);
              }}
            />
          </div>
          {isEmailDestinationOpen && (
            <div className="flex w-full flex-col items-start gap-4 pt-1">
              <TooltipField
                label="Destination Type"
                tooltip="Select where you want to send your analytics emails"
                className="w-full"
              >
                <Select
                  className="h-auto w-full"
                  placeholder="Choose destination"
                  value={destinationType}
                  onValueChange={(value: string) => setDestinationType(value)}
                >
                  <Select.Item value="individual">Individual Recipients</Select.Item>
                  <Select.Item value="mailing-list">Mailing List</Select.Item>
                  <Select.Item value="distribution-group">Distribution Group</Select.Item>
                </Select>
              </TooltipField>
              
              {destinationType === "individual" && (
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full flex-col items-start gap-2">
                    <span className="text-body-bold font-body-bold text-default-font">
                      Email Recipients
                    </span>
                    <span className="text-caption font-caption text-subtext-color">
                      Enter email addresses for people who will receive the signal emails
                    </span>
                  </div>
                
                  {selectedRecipients.length > 0 && (
                    <div className="flex w-full flex-wrap items-start gap-2">
                      {selectedRecipients.map((recipient) => {
                        const recipientEmails: Record<string, string> = {
                          "me": "you@company.com",
                          "sarah-johnson": "sarah.johnson@company.com",
                          "mike-chen": "mike.chen@company.com",
                          "emily-davis": "emily.davis@company.com",
                          "alex-kim": "alex.kim@company.com",
                          "john-smith": "john.smith@company.com",
                          "lisa-wong": "lisa.wong@company.com",
                          "david-taylor": "david.taylor@company.com"
                        };
                        return (
                          <div
                            key={recipient}
                            className="flex items-center gap-2 rounded-md border border-solid border-neutral-200 bg-neutral-50 px-3 py-1"
                          >
                            <span className="text-caption font-caption text-default-font">
                              {recipientEmails[recipient]}
                            </span>
                            <IconButton
                              size="small"
                              icon={<FeatherX />}
                              onClick={() => {
                                setSelectedRecipients(selectedRecipients.filter(r => r !== recipient));
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
                      if (value && !selectedRecipients.includes(value)) {
                        setSelectedRecipients([...selectedRecipients, value]);
                      }
                    }}
                  >
                    <Select.Item value="me" disabled={selectedRecipients.includes("me")}>
                      you@company.com
                    </Select.Item>
                    <Select.Item value="sarah-johnson" disabled={selectedRecipients.includes("sarah-johnson")}>
                      sarah.johnson@company.com
                    </Select.Item>
                    <Select.Item value="mike-chen" disabled={selectedRecipients.includes("mike-chen")}>
                      mike.chen@company.com
                    </Select.Item>
                    <Select.Item value="emily-davis" disabled={selectedRecipients.includes("emily-davis")}>
                      emily.davis@company.com
                    </Select.Item>
                    <Select.Item value="alex-kim" disabled={selectedRecipients.includes("alex-kim")}>
                      alex.kim@company.com
                    </Select.Item>
                    <Select.Item value="john-smith" disabled={selectedRecipients.includes("john-smith")}>
                      john.smith@company.com
                    </Select.Item>
                    <Select.Item value="lisa-wong" disabled={selectedRecipients.includes("lisa-wong")}>
                      lisa.wong@company.com
                    </Select.Item>
                    <Select.Item value="david-taylor" disabled={selectedRecipients.includes("david-taylor")}>
                      david.taylor@company.com
                    </Select.Item>
                  </Select>
                </div>
              )}
              
              {destinationType === "mailing-list" && (
                <TooltipField
                  label="Mailing List Email"
                  tooltip="Enter the mailing list email address"
                  className="w-full"
                >
                  <TextField className="h-auto w-full">
                    <TextField.Input
                      type="email"
                      placeholder="analytics-team@company.com"
                      value=""
                      onChange={() => {}}
                    />
                  </TextField>
                </TooltipField>
              )}
              
              {destinationType === "distribution-group" && (
                <TooltipField
                  label="Distribution Group"
                  tooltip="Choose a predefined distribution group"
                  className="w-full"
                >
                  <Select
                    className="h-auto w-full"
                    placeholder="Select distribution group"
                    value={undefined}
                    onValueChange={() => {}}
                  >
                    <Select.Item value="executives">Executives</Select.Item>
                    <Select.Item value="product-team">Product Team</Select.Item>
                    <Select.Item value="analytics-team">Analytics Team</Select.Item>
                    <Select.Item value="marketing-team">Marketing Team</Select.Item>
                    <Select.Item value="all-hands">All Hands</Select.Item>
                  </Select>
                </TooltipField>
              )}

              {/* Email-specific sender configuration */}
              <div className="flex w-full items-start gap-4">
                <TooltipField
                  label="From Name"
                  tooltip="Display name for the sender"
                  className="w-full"
                >
                  <TextField className="h-auto w-full">
                    <TextField.Input
                      type="text"
                      placeholder="Analytics Team"
                      value=""
                      onChange={() => {}}
                    />
                  </TextField>
                </TooltipField>
                
                <TooltipField
                  label="From Email"
                  tooltip="Sender email address"
                  className="w-full"
                >
                  <TextField className="h-auto w-full">
                    <TextField.Input
                      type="email"
                      placeholder="analytics@company.com"
                      value=""
                      onChange={() => {}}
                    />
                  </TextField>
                </TooltipField>
              </div>
            </div>
          )}
        </div>

      {/* Trigger Section - Using extracted component */}
      <TriggerSection
        activeTriggerTab={activeTriggerTab}
        setActiveTriggerTab={setActiveTriggerTab}
        isTriggerOpen={isTriggerOpen}
        setIsTriggerOpen={setIsTriggerOpen}
      />

      {/* Scope Section - Using extracted component */}
      <ScopeSection
        selectedMetrics={selectedMetrics}
        setSelectedMetrics={setSelectedMetrics}
        isScopeOpen={isScopeOpen}
        setIsScopeOpen={setIsScopeOpen}
      />

      {/* Content Section - Using extracted component */}
      <ContentSection channelType="email" />
    </SignalConfigLayout>
  );
}

function EmailSignalConfig() {
  return (
    <SignalConfigProvider>
      <EmailSignalConfigContent />
    </SignalConfigProvider>
  );
}

export default EmailSignalConfig;