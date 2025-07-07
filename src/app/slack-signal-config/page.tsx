"use client";

import React, { useState } from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown, FeatherAlertCircle, FeatherCheck } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { FeatherX } from "@subframe/core";
import { TriggerSection, ScopeSection, ContentSection, SignalConfigLayout, TooltipField, useSignalValidation, useAutoSave, SignalConfigProvider, useSignalConfig } from "@/ui";

// Recipient data for personalized previews
const recipientData: Record<string, {
  name: string;
  firstName: string;
  metrics: {
    activeUsers: string;
    sessionDuration: string;
    pageViews: string;
    trend: string;
    changePercent: string;
    previousValue: string;
  };
  insights: string;
}> = {
  "me": {
    name: "You",
    firstName: "You",
    metrics: { activeUsers: "1,247", sessionDuration: "8.3", pageViews: "2,891", trend: "up", changePercent: "+12.4", previousValue: "1,109" },
    insights: "• Focus on mobile optimization - 60% of your traffic is mobile\n• Review checkout funnel - 23% drop-off at payment step\n• Optimize page load speeds - average 3.2s can be improved\n• A/B test new onboarding flow - 15% signup completion rate"
  },
  "sarah-johnson": {
    name: "Sarah Johnson", 
    firstName: "Sarah",
    metrics: { activeUsers: "2,156", sessionDuration: "6.7", pageViews: "4,328", trend: "up", changePercent: "+8.9", previousValue: "1,981" },
    insights: "• Boost mobile app engagement - evening usage up 40%\n• Launch targeted push notifications for retention\n• Optimize in-app purchase flow - 18% conversion opportunity\n• Expand social media campaign reach - 25% engagement growth"
  },
  "mike-chen": {
    name: "Mike Chen",
    firstName: "Mike", 
    metrics: { activeUsers: "3,402", sessionDuration: "12.1", pageViews: "7,845", trend: "up", changePercent: "+15.2", previousValue: "2,954" },
    insights: "• Scale new feature adoption - 78% user satisfaction\n• Optimize API performance - reduce 200ms latency\n• Implement advanced analytics dashboard\n• Launch beta testing program for power users"
  },
  "emily-davis": {
    name: "Emily Davis",
    firstName: "Emily",
    metrics: { activeUsers: "1,879", sessionDuration: "9.4", pageViews: "3,567", trend: "down", changePercent: "-3.1", previousValue: "1,939" },
    insights: "• Revamp email marketing - 12% open rate needs improvement\n• Launch retargeting campaigns for cart abandoners\n• A/B test landing page headlines - 8% conversion boost\n• Optimize social media content strategy"
  },
  "alex-kim": {
    name: "Alex Kim",
    firstName: "Alex",
    metrics: { activeUsers: "2,734", sessionDuration: "7.8", pageViews: "5,123", trend: "up", changePercent: "+22.7", previousValue: "2,230" },
    insights: "• Expand user onboarding flow - 85% completion rate\n• Launch premium features upsell campaign\n• Optimize search functionality - 67% usage increase\n• Implement user feedback collection system"
  },
  "john-smith": {
    name: "John Smith",
    firstName: "John",
    metrics: { activeUsers: "1,634", sessionDuration: "5.2", pageViews: "2,987", trend: "up", changePercent: "+6.3", previousValue: "1,537" },
    insights: "• Improve lead qualification process - 34% conversion rate\n• Launch automated follow-up sequences\n• Optimize sales funnel touchpoints\n• Implement CRM integration for better tracking"
  },
  "lisa-wong": {
    name: "Lisa Wong",
    firstName: "Lisa",
    metrics: { activeUsers: "2,945", sessionDuration: "11.6", pageViews: "6,234", trend: "up", changePercent: "+18.9", previousValue: "2,477" },
    insights: "• Expand customer success program - 92% satisfaction\n• Launch product tutorial video series\n• Implement proactive support notifications\n• Optimize help center search functionality"
  },
  "david-taylor": {
    name: "David Taylor",
    firstName: "David",
    metrics: { activeUsers: "1,423", sessionDuration: "4.9", pageViews: "2,156", trend: "down", changePercent: "-1.8", previousValue: "1,449" },
    insights: "• Streamline user interface - reduce click complexity\n• Optimize server response times - 15% improvement needed\n• Implement automated workflow processes\n• Review and update user documentation"
  }
};

function SlackSignalConfigContent() {
  const { data: contextData, updateData: updateContextData, getOverallStatus, canLaunch, validateSignalName } = useSignalConfig();
  const [signalName, setSignalName] = useState(contextData.signalName || "");
  
  // Validation hook
  const { data, validationState, updateData, getFieldError, attemptLaunch, hasAttemptedLaunch } = useSignalValidation({
    destinationType: contextData.destinationType || "channel",
    triggerType: contextData.triggerType || "scheduled"
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
      
      // Update context with the latest data
      updateContextData({
        signalName,
        destinationType: configData.destinationType,
        selectedChannel: configData.selectedChannel,
        selectedRecipients: configData.selectedRecipients,
        triggerType: configData.triggerType,
        selectedMetrics: configData.selectedMetrics,
        hasContent: false, // Will be updated when content is added
        contentBlocks: []
      });
    },
    delay: 2000 // Save 2 seconds after last change
  });

  const handleLaunchClick = () => {
    // First check existing field validation
    const isFieldValid = attemptLaunch();
    
    // Then check overall signal validation including name
    const nameValidation = validateSignalName(signalName);
    const overallStatus = getOverallStatus();
    const canProceed = canLaunch() && nameValidation.isValid && isFieldValid;
    
    if (canProceed) {
      console.log('Launching signal with data:', data);
      // Mark signal as complete in context
      updateContextData({ isComplete: true, isDraft: false });
      // Proceed with launch
      alert('Signal launched successfully!'); // TODO: Replace with proper navigation
    } else {
      console.log('Launch blocked due to validation errors');
      console.log('Overall status:', overallStatus);
      console.log('Name validation:', nameValidation);
      // Validation errors will now be shown automatically
      
      // Show alert with validation summary
      const allErrors = [
        ...overallStatus.errors,
        ...nameValidation.errors
      ];
      if (allErrors.length > 0) {
        alert(`Please fix the following issues:\n\n${allErrors.join('\n')}`);
      }
    }
  };

  // Handle signal name changes
  const handleSignalNameChange = (newName: string) => {
    setSignalName(newName);
    updateContextData({ signalName: newName });
  };
  
  const renderPersonalizedSlackPreview = (recipientId: string) => {
    const recipient = recipientData[recipientId] || recipientData["me"];
    const { firstName, metrics, insights } = recipient;
    
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-solid border-neutral-200 bg-white p-4 w-full">
        {/* Slack message header */}
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <img
              className="h-4 w-4 flex-none object-cover"
              src="https://res.cloudinary.com/subframe/image/upload/v1751013286/uploads/15436/ojozrh7lowper2q3npma.png"
              alt="Bonnard"
            />
          </div>
          <span className="text-body-bold font-body-bold text-default-font">Bonnard</span>
          <span className="text-caption font-caption text-subtext-color">Today at 12:00 PM</span>
        </div>
        
        {/* Message content preview */}
        <div className="flex flex-col gap-2">
          <div className="text-heading-3 font-heading-3 text-default-font">
            {signalName || 'Signal Preview'}
          </div>
          <div className="text-body font-body text-default-font">
            Hey <span className="font-bold">{firstName}</span>! Here&apos;s your weekly engagement summary for <span className="font-bold">this week</span>:
          </div>
          <div className="text-body-bold font-body-bold text-default-font mt-2">
            Key Metrics
          </div>
          <div className="text-body font-body text-default-font">
            • Active Users: <span className="font-bold">{metrics.activeUsers}</span> (<span className="font-bold">{metrics.trend}</span> <span className="font-bold">{metrics.changePercent}</span>% from <span className="font-bold">{metrics.previousValue}</span>)<br/>
            • Session Duration: <span className="font-bold">{metrics.sessionDuration}</span> minutes<br/>
            • Page Views: <span className="font-bold">{metrics.pageViews}</span>
          </div>
          <div className="border-l-2 pl-4 py-3 mt-2" style={{borderLeft: "2px solid", borderImage: "linear-gradient(to bottom, #a855f7, #3b82f6) 1"}}>
            <div className="text-body-bold font-body-bold text-default-font mb-2">
              Recommended focus
            </div>
            <div className="text-body font-body text-neutral-700">
              <div className="space-y-1">
                {insights.split('\n').map((line: string, index: number) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const slackPreview = (
    <div className="flex flex-col gap-3 rounded-lg border border-solid border-neutral-200 bg-white p-4 w-full">
      {/* Slack message header */}
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
        <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center">
          <img
            className="h-4 w-4 flex-none object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1751013286/uploads/15436/ojozrh7lowper2q3npma.png"
            alt="Bonnard"
          />
        </div>
        <span className="text-body-bold font-body-bold text-default-font">Bonnard</span>
        <span className="text-caption font-caption text-subtext-color">Today at 12:00 PM</span>
      </div>
      
      {/* Message content preview */}
      <div className="flex flex-col gap-2">
        <div className="text-heading-3 font-heading-3 text-default-font">
          {signalName || 'Signal Preview'}
        </div>
{signalName ? (
          <>
            <div className="text-body font-body text-default-font">
              Hey <span className="font-bold">*user name*</span>! Here&apos;s your weekly engagement summary for <span className="font-bold">*time period*</span>:
            </div>
            <div className="text-body-bold font-body-bold text-default-font mt-2">
              Key Metrics
            </div>
            <div className="text-body font-body text-default-font">
              • Active Users: <span className="font-bold">*metric value*</span> (<span className="font-bold">*trend*</span> <span className="font-bold">*change %*</span>% from <span className="font-bold">*previous value*</span>)<br/>
              • Session Duration: <span className="font-bold">*metric value*</span> minutes<br/>
              • Page Views: <span className="font-bold">*metric value*</span>
            </div>
            <div className="border-l-2 pl-4 py-3 mt-2" style={{borderLeft: "2px solid", borderImage: "linear-gradient(to bottom, #a855f7, #3b82f6) 1"}}>
              <div className="text-body-bold font-body-bold text-default-font mb-2">
                Recommended focus
              </div>
              <div className="text-body font-body text-neutral-700">
                <span className="font-bold">*AI-generated recommendations based on user data and trends*</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="text-body font-body text-neutral-500 text-center">
              No content defined yet
            </div>
            <button
              onClick={() => window.location.href = '/slack-signal-config/define-content'}
              className="px-4 py-2 bg-brand-600 text-white rounded-md text-body-bold font-body-bold hover:bg-brand-700 transition-colors"
            >
              Define Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <SignalConfigLayout 
      channelType="slack"
      signalName={signalName}
      onSignalNameChange={handleSignalNameChange}
      validationState={validationState}
      autoSave={{ isSaving, lastSaved, error, onManualSave: manualSave }}
      onLaunchClick={handleLaunchClick}
      previewContent={slackPreview}
      renderPersonalizedContent={renderPersonalizedSlackPreview}
      canLaunch={canLaunch() && validateSignalName(signalName).isValid}
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

function SlackSignalConfig() {
  return (
    <SignalConfigProvider>
      <SlackSignalConfigContent />
    </SignalConfigProvider>
  );
}

export default SlackSignalConfig;