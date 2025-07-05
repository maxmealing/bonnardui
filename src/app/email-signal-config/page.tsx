"use client";

import React, { useState } from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { TextField } from "@/ui/components/TextField";
import { FeatherX } from "@subframe/core";
import { TriggerSection, ScopeSection, ContentSection, SignalConfigLayout, TriggerType, TooltipField, useAutoSave } from "@/ui";

function EmailSignalConfig() {
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

  const { isSaving, lastSaved, error } = useAutoSave({
    data: configData,
    onSave: async (data) => {
      // Simulate API call to save email signal configuration
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Saving Email signal configuration:', data);
    },
    delay: 2000 // Save 2 seconds after last change
  });
  
  return (
    <SignalConfigLayout 
      channelType="email"
      signalName={signalName}
      onSignalNameChange={setSignalName}
      autoSave={{ isSaving, lastSaved, error }}
    >
      {/* Receiver Section */}
      <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
        <div className="flex w-full flex-col items-start gap-4">
          <div 
            className={`flex w-full items-center justify-between pt-2 py-2 transition-colors ${!isEmailDestinationOpen ? 'cursor-pointer hover:bg-neutral-25' : ''}`}
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
            <div className="flex w-full flex-col items-start gap-3">
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

export default EmailSignalConfig;