"use client";

import React, { useState } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { FeatherChevronDown } from "@subframe/core";
import { Tabs } from "@/ui/components/Tabs";
import { TextField } from "@/ui/components/TextField";
import { TextArea } from "@/ui/components/TextArea";
import { FeatherEdit2 } from "@subframe/core";
import { FeatherEye } from "@subframe/core";
import { FeatherX } from "@subframe/core";

type TriggerType = "scheduled" | "one-time" | "agent-triggered";

function SlackSignalConfig() {
  const [activeTriggerTab, setActiveTriggerTab] = useState<TriggerType>("scheduled");
  const [destinationType, setDestinationType] = useState<string>("channel");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  
  // Accordion state
  const [isSlackDestinationOpen, setIsSlackDestinationOpen] = useState(true);
  const [isTriggerOpen, setIsTriggerOpen] = useState(true);
  const [isScopeOpen, setIsScopeOpen] = useState(true);
  
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex w-full flex-col items-center gap-12 bg-neutral-50 py-12 pb-32">
        <div className="flex w-full max-w-[1024px] items-center justify-between">
          <span className="text-heading-2 font-heading-2 text-default-font">
            Configure Slack Signal
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral-tertiary"
              onClick={() => {}}
            >
              Finish Later
            </Button>
            <Button
              onClick={() => {}}
            >
              Launch
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-[1024px] items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    Slack Destination
                  </span>
                  <IconButton
                    icon={isSlackDestinationOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
                    onClick={() => setIsSlackDestinationOpen(!isSlackDestinationOpen)}
                  />
                </div>
                {isSlackDestinationOpen && (
                  <div className="flex w-full flex-col items-start gap-4">
                  <Select
                    className="h-auto w-full"
                    label="Destination Type"
                    placeholder="Choose destination"
                    helpText="Select where you want to send your analytics insights"
                    value={destinationType}
                    onValueChange={(value: string) => setDestinationType(value)}
                  >
                    <Select.Item value="channel">Channel</Select.Item>
                    <Select.Item value="direct-message">Direct Message</Select.Item>
                  </Select>
                  
                  {destinationType === "channel" && (
                    <Select
                      className="h-auto w-full"
                      label="Select Channel"
                      placeholder="Choose a channel"
                      helpText="Select the channel where signals will be posted"
                      value={undefined}
                      onValueChange={() => {}}
                    >
                      <Select.Item value="general"># general</Select.Item>
                      <Select.Item value="analytics"># analytics</Select.Item>
                      <Select.Item value="product-updates"># product-updates</Select.Item>
                      <Select.Item value="alerts"># alerts</Select.Item>
                      <Select.Item value="team-insights"># team-insights</Select.Item>
                    </Select>
                  )}
                  
                  {destinationType === "direct-message" && (
                    <div className="flex w-full flex-col items-start gap-4">
                      <div className="flex w-full flex-col items-start gap-2">
                        <span className="text-body-bold font-body-bold text-default-font">
                          Select Recipients
                        </span>
                        <span className="text-caption font-caption text-subtext-color">
                          Choose people who will receive individual direct messages (each person gets their own DM)
                        </span>
                      </div>
                      
                      {selectedRecipients.length > 0 && (
                        <div className="flex w-full flex-wrap items-start gap-2">
                          {selectedRecipients.map((recipient) => {
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
                          Me (You)
                        </Select.Item>
                        <Select.Item value="sarah-johnson" disabled={selectedRecipients.includes("sarah-johnson")}>
                          Sarah Johnson
                        </Select.Item>
                        <Select.Item value="mike-chen" disabled={selectedRecipients.includes("mike-chen")}>
                          Mike Chen
                        </Select.Item>
                        <Select.Item value="emily-davis" disabled={selectedRecipients.includes("emily-davis")}>
                          Emily Davis
                        </Select.Item>
                        <Select.Item value="alex-kim" disabled={selectedRecipients.includes("alex-kim")}>
                          Alex Kim
                        </Select.Item>
                        <Select.Item value="john-smith" disabled={selectedRecipients.includes("john-smith")}>
                          John Smith
                        </Select.Item>
                        <Select.Item value="lisa-wong" disabled={selectedRecipients.includes("lisa-wong")}>
                          Lisa Wong
                        </Select.Item>
                        <Select.Item value="david-taylor" disabled={selectedRecipients.includes("david-taylor")}>
                          David Taylor
                        </Select.Item>
                      </Select>
                    </div>
                  )}
                </div>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
              <div className="flex w-full items-center justify-between">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Trigger
                </span>
                <IconButton
                  icon={isTriggerOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
                  onClick={() => setIsTriggerOpen(!isTriggerOpen)}
                />
              </div>
              {isTriggerOpen && (
                <div className="flex w-full flex-col items-start gap-4">
                  <Tabs>
                  <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                    <div className="w-full items-start gap-2 grid grid-cols-3">
                      <Tabs.Item 
                        active={activeTriggerTab === "scheduled"}
                        onClick={() => setActiveTriggerTab("scheduled")}
                      >
                        Scheduled
                      </Tabs.Item>
                      <Tabs.Item 
                        active={activeTriggerTab === "one-time"}
                        onClick={() => setActiveTriggerTab("one-time")}
                      >
                        One-time
                      </Tabs.Item>
                      <Tabs.Item 
                        active={activeTriggerTab === "agent-triggered"}
                        onClick={() => setActiveTriggerTab("agent-triggered")}
                      >
                        Agent Triggered
                      </Tabs.Item>
                    </div>
                    <div className="flex w-full items-start mt-4">
                      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-4">
                        {activeTriggerTab === "scheduled" && (
                          <>
                            <Select
                              className="h-auto w-full"
                              label="Frequency"
                              placeholder="Select frequency"
                              helpText="How often should the signal trigger"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="daily">Daily</Select.Item>
                              <Select.Item value="weekly">Weekly</Select.Item>
                              <Select.Item value="monthly">Monthly</Select.Item>
                            </Select>
                            <TextField 
                              className="h-auto w-full"
                              label="Repeat Interval" 
                              helpText="Every X days/weeks/months (e.g., every 2 weeks)"
                            >
                              <TextField.Input
                                type="number"
                                placeholder="1"
                                value=""
                                min="1"
                                onChange={() => {}}
                              />
                            </TextField>
                            <TextField 
                              className="h-auto w-full"
                              label="Start Date & Time" 
                              helpText="When should the signal first trigger"
                            >
                              <TextField.Input
                                type="datetime-local"
                                value=""
                                onChange={() => {}}
                              />
                            </TextField>
                            <Select
                              className="h-auto w-full"
                              label="Timezone"
                              placeholder="Select timezone"
                              helpText="Choose your timezone for scheduling"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="UTC">UTC (GMT+0)</Select.Item>
                              <Select.Item value="America/New_York">Eastern Time (EST/EDT)</Select.Item>
                              <Select.Item value="America/Chicago">Central Time (CST/CDT)</Select.Item>
                              <Select.Item value="America/Denver">Mountain Time (MST/MDT)</Select.Item>
                              <Select.Item value="America/Los_Angeles">Pacific Time (PST/PDT)</Select.Item>
                              <Select.Item value="Europe/London">London Time (GMT/BST)</Select.Item>
                              <Select.Item value="Europe/Paris">Central European Time (CET/CEST)</Select.Item>
                              <Select.Item value="Asia/Tokyo">Japan Standard Time (JST)</Select.Item>
                            </Select>
                          </>
                        )}
                        
                        {activeTriggerTab === "one-time" && (
                          <>
                            <TextField 
                              className="h-auto w-full"
                              label="Execution Date & Time" 
                              helpText="When should the signal execute (one time only)"
                            >
                              <TextField.Input
                                type="datetime-local"
                                value=""
                                onChange={() => {}}
                              />
                            </TextField>
                            <Select
                              className="h-auto w-full"
                              label="Timezone"
                              placeholder="Select timezone"
                              helpText="Choose your timezone for execution"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="UTC">UTC (GMT+0)</Select.Item>
                              <Select.Item value="America/New_York">Eastern Time (EST/EDT)</Select.Item>
                              <Select.Item value="America/Chicago">Central Time (CST/CDT)</Select.Item>
                              <Select.Item value="America/Denver">Mountain Time (MST/MDT)</Select.Item>
                              <Select.Item value="America/Los_Angeles">Pacific Time (PST/PDT)</Select.Item>
                              <Select.Item value="Europe/London">London Time (GMT/BST)</Select.Item>
                              <Select.Item value="Europe/Paris">Central European Time (CET/CEST)</Select.Item>
                              <Select.Item value="Asia/Tokyo">Japan Standard Time (JST)</Select.Item>
                            </Select>
                            <div className="flex w-full flex-col items-start gap-2 rounded-md border border-solid border-neutral-200 bg-neutral-50 px-4 py-3">
                              <span className="text-caption-bold font-caption-bold text-default-font">
                                Single Execution Only
                              </span>
                              <span className="text-caption font-caption text-subtext-color">
                                This signal will execute once at the specified time and then be automatically disabled.
                              </span>
                            </div>
                          </>
                        )}
                        
                        {activeTriggerTab === "agent-triggered" && (
                          <>
                            <Select
                              className="h-auto w-full"
                              label="Monitor Metric"
                              placeholder="Select metric to monitor"
                              helpText="Choose which metric the AI should monitor for changes"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="user-engagement">User Engagement</Select.Item>
                              <Select.Item value="conversion-rate">Conversion Rate</Select.Item>
                              <Select.Item value="retention">User Retention</Select.Item>
                              <Select.Item value="revenue">Revenue</Select.Item>
                              <Select.Item value="page-views">Page Views</Select.Item>
                              <Select.Item value="error-rate">Error Rate</Select.Item>
                            </Select>
                            
                            <Select
                              className="h-auto w-full"
                              label="Condition Type"
                              placeholder="Select condition type"
                              helpText="How should the AI evaluate the metric"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="threshold">Threshold (above/below value)</Select.Item>
                              <Select.Item value="percentage-change">Percentage Change</Select.Item>
                              <Select.Item value="trend">Trend Analysis</Select.Item>
                              <Select.Item value="anomaly">Anomaly Detection</Select.Item>
                            </Select>
                            
                            <div className="flex w-full items-start gap-4">
                              <Select
                                className="h-auto w-full"
                                label="Direction"
                                placeholder="Select direction"
                                helpText="Trigger direction"
                                value={undefined}
                                onValueChange={() => {}}
                              >
                                <Select.Item value="increases">Increases</Select.Item>
                                <Select.Item value="decreases">Decreases</Select.Item>
                                <Select.Item value="changes">Changes (either)</Select.Item>
                              </Select>
                              
                              <TextField 
                                className="h-auto w-full"
                                label="Threshold Value" 
                                helpText="Value or percentage"
                              >
                                <TextField.Input
                                  type="number"
                                  placeholder="10"
                                  value=""
                                  onChange={() => {}}
                                />
                              </TextField>
                            </div>
                            
                            <Select
                              className="h-auto w-full"
                              label="Time Window"
                              placeholder="Select time window"
                              helpText="Period to evaluate the condition over"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="5m">5 minutes</Select.Item>
                              <Select.Item value="15m">15 minutes</Select.Item>
                              <Select.Item value="30m">30 minutes</Select.Item>
                              <Select.Item value="1h">1 hour</Select.Item>
                              <Select.Item value="6h">6 hours</Select.Item>
                              <Select.Item value="24h">24 hours</Select.Item>
                            </Select>
                            
                            <Select
                              className="h-auto w-full"
                              label="Check Frequency"
                              placeholder="Select check frequency"
                              helpText="How often to evaluate the condition"
                              value={undefined}
                              onValueChange={() => {}}
                            >
                              <Select.Item value="5m">Every 5 minutes</Select.Item>
                              <Select.Item value="15m">Every 15 minutes</Select.Item>
                              <Select.Item value="30m">Every 30 minutes</Select.Item>
                              <Select.Item value="1h">Every hour</Select.Item>
                            </Select>
                            
                            <TextField 
                              className="h-auto w-full"
                              label="Cooldown Period" 
                              helpText="Minimum time between triggers (in minutes) to prevent spam"
                            >
                              <TextField.Input
                                type="number"
                                placeholder="60"
                                value=""
                                min="1"
                                onChange={() => {}}
                              />
                            </TextField>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Tabs>
              </div>
              )}
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
              <div className="flex w-full items-center justify-between">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Scope
                </span>
                <IconButton
                  icon={isScopeOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
                  onClick={() => setIsScopeOpen(!isScopeOpen)}
                />
              </div>
              {isScopeOpen && (
                <div className="flex w-full flex-col items-start gap-4">
                  <TextArea
                  className="h-auto w-full"
                  label="Signal Prompt"
                  helpText="Natural-language guidance for AI analysis"
                >
                  <TextArea.Input
                    placeholder="Enter signal prompt"
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLTextAreaElement>
                    ) => {}}
                  />
                </TextArea>
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full flex-col items-start gap-2">
                    <span className="text-body-bold font-body-bold text-default-font">
                      Metric Selection
                    </span>
                    <span className="text-caption font-caption text-subtext-color">
                      Select metrics with audience compatibility for analysis
                    </span>
                  </div>
                  
                  {selectedMetrics.length > 0 && (
                    <div className="flex w-full flex-wrap items-start gap-2">
                      {selectedMetrics.map((metric) => {
                        const metricNames: Record<string, string> = {
                          "user-engagement": "User Engagement",
                          "conversion-rate": "Conversion Rate",
                          "retention": "Retention",
                          "revenue": "Revenue",
                          "page-views": "Page Views",
                          "error-rate": "Error Rate",
                          "bounce-rate": "Bounce Rate",
                          "session-duration": "Session Duration"
                        };
                        return (
                          <div
                            key={metric}
                            className="flex items-center gap-2 rounded-md border border-solid border-neutral-200 bg-neutral-50 px-3 py-1"
                          >
                            <span className="text-caption font-caption text-default-font">
                              {metricNames[metric]}
                            </span>
                            <IconButton
                              size="small"
                              icon={<FeatherX />}
                              onClick={() => {
                                setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <Select
                    className="h-auto w-full"
                    placeholder="Add metrics..."
                    value=""
                    onValueChange={(value: string) => {
                      if (value && !selectedMetrics.includes(value)) {
                        setSelectedMetrics([...selectedMetrics, value]);
                      }
                    }}
                  >
                    <Select.Item value="user-engagement" disabled={selectedMetrics.includes("user-engagement")}>
                      User Engagement
                    </Select.Item>
                    <Select.Item value="conversion-rate" disabled={selectedMetrics.includes("conversion-rate")}>
                      Conversion Rate
                    </Select.Item>
                    <Select.Item value="retention" disabled={selectedMetrics.includes("retention")}>
                      Retention
                    </Select.Item>
                    <Select.Item value="revenue" disabled={selectedMetrics.includes("revenue")}>
                      Revenue
                    </Select.Item>
                    <Select.Item value="page-views" disabled={selectedMetrics.includes("page-views")}>
                      Page Views
                    </Select.Item>
                    <Select.Item value="error-rate" disabled={selectedMetrics.includes("error-rate")}>
                      Error Rate
                    </Select.Item>
                    <Select.Item value="bounce-rate" disabled={selectedMetrics.includes("bounce-rate")}>
                      Bounce Rate
                    </Select.Item>
                    <Select.Item value="session-duration" disabled={selectedMetrics.includes("session-duration")}>
                      Session Duration
                    </Select.Item>
                  </Select>
                </div>
                <Select
                  className="h-auto w-full"
                  label="Global Time Frame"
                  placeholder="Select time range"
                  helpText="Choose analysis period"
                  value={undefined}
                  onValueChange={() => {}}
                >
                  <Select.Item value="24h">24h</Select.Item>
                  <Select.Item value="7d">7d</Select.Item>
                  <Select.Item value="30d">30d</Select.Item>
                  <Select.Item value="90d">90d</Select.Item>
                  <Select.Item value="custom">custom</Select.Item>
                </Select>
              </div>
              )}
            </div>
            <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
              <div className="flex w-full items-center justify-between">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Content
                </span>
                <IconButton
                  icon={<FeatherEdit2 />}
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 sticky top-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Preview
            </span>
            <div className="flex h-96 w-full flex-none flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-border bg-neutral-50 px-6 py-12">
              <FeatherEye className="text-heading-1 font-heading-1 text-neutral-400" />
              <span className="text-body font-body text-subtext-color text-center">
                Configure your signal to see a preview
              </span>
              <Button
                variant="neutral-secondary"
                onClick={() => window.location.href = '/slack-signal-config/define-content'}
              >
                Define Content
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default SlackSignalConfig;