"use client";

import React, { useState } from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { TextField } from "@/ui/components/TextField";
import { FeatherLock, FeatherKey } from "@subframe/core";
import { TriggerSection, ScopeSection, ContentSection, SignalConfigLayout, TriggerType, TooltipField, useAutoSave, SignalConfigProvider } from "@/ui";

type AuthType = "none" | "api-key" | "bearer-token" | "basic-auth" | "oauth";

function WebhookSignalConfigContent() {
  const [signalName, setSignalName] = useState("Real-time Analytics Webhook");
  const [activeTriggerTab, setActiveTriggerTab] = useState<TriggerType>("scheduled");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [authType, setAuthType] = useState<AuthType>("none");
  
  // Accordion state
  const [isWebhookDestinationOpen, setIsWebhookDestinationOpen] = useState(false);
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);

  // Auto-save functionality
  const configData = {
    activeTriggerTab,
    selectedMetrics,
    authType
  };

  const { isSaving, lastSaved, error, manualSave } = useAutoSave({
    data: configData,
    onSave: async (data) => {
      // Simulate API call to save webhook signal configuration
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Saving Webhook signal configuration:', data);
    },
    delay: 2000 // Save 2 seconds after last change
  });
  
  const webhookPreview = (
    <div className="flex flex-col gap-3 w-full">
      <div className="rounded-lg border border-solid border-neutral-200 bg-neutral-50 p-3">
        <div className="text-caption-bold font-caption-bold text-neutral-700 mb-2">Request Preview:</div>
        <div className="text-caption font-mono text-neutral-600">
          POST /webhook/endpoint<br/>
          Content-Type: application/json<br/>
          Authorization: Bearer [token]
        </div>
      </div>
      
      <div className="rounded-lg border border-solid border-neutral-200 bg-white p-4">
        <pre className="text-caption font-mono text-default-font whitespace-pre-wrap">{`{
  "event_type": "performance_anomaly",
  "alert_level": "critical",
  "metric_name": "*metric name*",
  "current_value": "*metric value*",
  "previous_value": "*previous value*",
  "change_percentage": "*change percentage*",
  "trend": "*trend direction*",
  "time_period": "*time period*",
  "timestamp": "*timestamp*",
  "notify_team": true
}`}</pre>
      </div>
      
      <div className="rounded-lg border border-solid border-neutral-200 bg-brand-25 p-3">
        <div className="text-caption-bold font-caption-bold text-brand-700 mb-2">Variables:</div>
        <div className="text-caption font-caption text-brand-600">
          Variables like {`{{metric_value}}`} will be replaced with actual values when the webhook is triggered.
        </div>
      </div>
    </div>
  );
  
  return (
    <SignalConfigLayout 
      channelType="webhook"
      signalName={signalName}
      onSignalNameChange={setSignalName}
      autoSave={{ isSaving, lastSaved, error, onManualSave: manualSave }}
      previewContent={webhookPreview}
    >
      {/* Receiver Section */}
      <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
          <div 
            className={`flex w-full items-start justify-between transition-colors ${!isWebhookDestinationOpen ? 'cursor-pointer hover:bg-neutral-25' : ''}`}
            onClick={!isWebhookDestinationOpen ? () => setIsWebhookDestinationOpen(true) : undefined}
          >
            <div className="flex flex-col gap-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Receiver
              </span>
              <span className={`text-body font-body text-subtext-color ${isWebhookDestinationOpen ? 'invisible' : 'visible'}`}>
                API endpoint configuration
              </span>
            </div>
            <IconButton
              icon={isWebhookDestinationOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
              onClick={(e) => {
                e.stopPropagation();
                setIsWebhookDestinationOpen(!isWebhookDestinationOpen);
              }}
            />
          </div>
          {isWebhookDestinationOpen && (
            <div className="flex w-full flex-col items-start gap-4 pt-1">
              <TooltipField
                label="Webhook URL"
                tooltip="The endpoint where analytics data will be sent"
                className="w-full"
              >
                <TextField className="h-auto w-full">
                  <TextField.Input
                    type="url"
                    placeholder="https://api.example.com/webhooks/analytics"
                    value=""
                    onChange={() => {}}
                  />
                </TextField>
              </TooltipField>
              
              <TooltipField
                label="HTTP Method"
                tooltip="HTTP method for the webhook request"
                className="w-full"
              >
                <Select
                  className="h-auto w-full"
                  placeholder="Select method"
                  value={undefined}
                  onValueChange={() => {}}
                >
                  <Select.Item value="POST">POST</Select.Item>
                  <Select.Item value="PUT">PUT</Select.Item>
                  <Select.Item value="PATCH">PATCH</Select.Item>
                </Select>
              </TooltipField>
              
              {/* Authentication Section */}
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex items-center gap-2">
                  <FeatherLock className="text-heading-3 font-heading-3 text-subtext-color" />
                  <span className="text-body-bold font-body-bold text-default-font">
                    Authentication
                  </span>
                </div>
                
                <TooltipField
                  label="Authentication Type"
                  tooltip="Choose how to authenticate with the webhook endpoint"
                  className="w-full"
                >
                  <Select
                    className="h-auto w-full"
                    placeholder="Select authentication method"
                    value={authType}
                    onValueChange={(value: string) => setAuthType(value as AuthType)}
                  >
                    <Select.Item value="none">None</Select.Item>
                    <Select.Item value="api-key">API Key</Select.Item>
                    <Select.Item value="bearer-token">Bearer Token</Select.Item>
                    <Select.Item value="basic-auth">Basic Auth</Select.Item>
                    <Select.Item value="oauth">OAuth 2.0</Select.Item>
                  </Select>
                </TooltipField>
                
                {authType === "api-key" && (
                  <div className="flex w-full items-start gap-4">
                    <TooltipField
                      label="Header Name"
                      tooltip="Custom header name for the API key"
                      className="w-full"
                    >
                      <TextField className="h-auto w-full">
                        <TextField.Input
                          type="text"
                          placeholder="X-API-Key"
                          value=""
                          onChange={() => {}}
                        />
                      </TextField>
                    </TooltipField>
                    <TooltipField
                      label="API Key"
                      tooltip="Your API key value"
                      className="w-full"
                    >
                      <TextField className="h-auto w-full">
                        <TextField.Input
                          type="password"
                          placeholder="Enter API key"
                          value=""
                          onChange={() => {}}
                        />
                      </TextField>
                    </TooltipField>
                  </div>
                )}
                
                {authType === "bearer-token" && (
                  <TooltipField
                    label="Bearer Token"
                    tooltip="Authorization bearer token"
                    className="w-full"
                  >
                    <TextField className="h-auto w-full">
                      <TextField.Input
                        type="password"
                        placeholder="Enter bearer token"
                        value=""
                        onChange={() => {}}
                      />
                    </TextField>
                  </TooltipField>
                )}
                
                {authType === "basic-auth" && (
                  <div className="flex w-full items-start gap-4">
                    <TooltipField
                      label="Username"
                      tooltip="Basic auth username"
                      className="w-full"
                    >
                      <TextField className="h-auto w-full">
                        <TextField.Input
                          type="text"
                          placeholder="Username"
                          value=""
                          onChange={() => {}}
                        />
                      </TextField>
                    </TooltipField>
                    <TooltipField
                      label="Password"
                      tooltip="Basic auth password"
                      className="w-full"
                    >
                      <TextField className="h-auto w-full">
                        <TextField.Input
                          type="password"
                          placeholder="Password"
                          value=""
                          onChange={() => {}}
                        />
                      </TextField>
                    </TooltipField>
                  </div>
                )}
                
                {authType === "oauth" && (
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex w-full items-start gap-4">
                      <TooltipField
                        label="Client ID"
                        tooltip="OAuth 2.0 client identifier"
                        className="w-full"
                      >
                        <TextField className="h-auto w-full">
                          <TextField.Input
                            type="text"
                            placeholder="Client ID"
                            value=""
                            onChange={() => {}}
                          />
                        </TextField>
                      </TooltipField>
                      <TooltipField
                        label="Client Secret"
                        tooltip="OAuth 2.0 client secret"
                        className="w-full"
                      >
                        <TextField className="h-auto w-full">
                          <TextField.Input
                            type="password"
                            placeholder="Client Secret"
                            value=""
                            onChange={() => {}}
                          />
                        </TextField>
                      </TooltipField>
                    </div>
                    <TooltipField
                      label="Token URL"
                      tooltip="OAuth 2.0 token endpoint"
                      className="w-full"
                    >
                      <TextField className="h-auto w-full">
                        <TextField.Input
                          type="url"
                          placeholder="https://auth.example.com/oauth/token"
                          value=""
                          onChange={() => {}}
                        />
                      </TextField>
                    </TooltipField>
                    <TooltipField
                      label="Scopes"
                      tooltip="OAuth 2.0 scopes (comma-separated)"
                      className="w-full"
                    >
                      <TextField className="h-auto w-full">
                        <TextField.Input
                          type="text"
                          placeholder="read,write,analytics"
                          value=""
                          onChange={() => {}}
                        />
                      </TextField>
                    </TooltipField>
                  </div>
                )}
                
                {authType !== "none" && (
                  <div className="flex w-full flex-col items-start gap-2 rounded-md border border-solid border-brand-200 bg-brand-25 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FeatherKey className="text-caption-bold font-caption-bold text-brand-600" />
                      <span className="text-caption-bold font-caption-bold text-brand-600">
                        Secure Storage
                      </span>
                    </div>
                    <span className="text-caption font-caption text-brand-700">
                      All authentication credentials are encrypted and stored securely. They are only used to authenticate webhook requests.
                    </span>
                  </div>
                )}
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
      <ContentSection channelType="webhook" />
    </SignalConfigLayout>
  );
}

function WebhookSignalConfig() {
  return (
    <SignalConfigProvider>
      <WebhookSignalConfigContent />
    </SignalConfigProvider>
  );
}

export default WebhookSignalConfig;