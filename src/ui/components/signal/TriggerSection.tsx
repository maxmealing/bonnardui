"use client";

import React from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { RadioCardGroup } from "@/ui/components/RadioCardGroup";
import { TextField } from "@/ui/components/TextField";
import { TooltipField } from "@/ui/components/signal/TooltipField";

export type TriggerType = "scheduled" | "one-time" | "agent-triggered";

interface SignalData {
  triggerType: TriggerType;
  frequency?: string;
  startDateTime?: string;
  timezone?: string;
  executionDateTime?: string;
  monitorMetric?: string;
  conditionType?: string;
  direction?: string;
  thresholdValue?: string;
  timeWindow?: string;
  checkFrequency?: string;
  cooldownPeriod?: string;
  [key: string]: unknown;
}

interface TriggerSectionProps {
  activeTriggerTab: TriggerType;
  setActiveTriggerTab: (tab: TriggerType) => void;
  isTriggerOpen: boolean;
  setIsTriggerOpen: (open: boolean) => void;
  validationData?: SignalData;
  updateData?: (updates: Partial<SignalData>) => void;
  getFieldError?: (field: string) => string | undefined;
}

export function TriggerSection({
  activeTriggerTab,
  setActiveTriggerTab,
  isTriggerOpen,
  setIsTriggerOpen,
  validationData: _validationData,
  updateData: _updateData,
  getFieldError: _getFieldError
}: TriggerSectionProps) {
  return (
    <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
      <div 
        className={`flex w-full items-start justify-between transition-colors ${!isTriggerOpen ? 'cursor-pointer hover:bg-neutral-25' : ''}`}
        onClick={!isTriggerOpen ? () => setIsTriggerOpen(true) : undefined}
      >
        <div className="flex flex-col gap-2">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Trigger
          </span>
          <span className={`text-body font-body text-subtext-color ${isTriggerOpen ? 'invisible' : 'visible'}`}>
            When to send this signal
          </span>
        </div>
        <IconButton
          icon={isTriggerOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
          onClick={(e) => {
            e.stopPropagation();
            setIsTriggerOpen(!isTriggerOpen);
          }}
        />
      </div>
      {isTriggerOpen && (
        <div className="flex w-full flex-col items-start gap-6 pt-4">
          {/* Trigger Type Selection */}
          <div className="w-full">
            <RadioCardGroup 
              value={activeTriggerTab}
              onValueChange={(value) => setActiveTriggerTab(value as TriggerType)}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full"
            >
              <RadioCardGroup.RadioCard 
                value="scheduled"
                className="flex items-center gap-3 p-3"
              >
                <div className="flex-1">
                  <div className="text-body-bold font-body-bold text-default-font">
                    Scheduled
                  </div>
                  <div className="text-caption font-caption text-subtext-color">
                    Regular intervals
                  </div>
                </div>
              </RadioCardGroup.RadioCard>
              
              <RadioCardGroup.RadioCard 
                value="one-time"
                className="flex items-center gap-3 p-3"
              >
                <div className="flex-1">
                  <div className="text-body-bold font-body-bold text-default-font">
                    One-time
                  </div>
                  <div className="text-caption font-caption text-subtext-color">
                    Single execution
                  </div>
                </div>
              </RadioCardGroup.RadioCard>
              
              <RadioCardGroup.RadioCard 
                value="agent-triggered"
                className="flex items-center gap-3 p-3 opacity-50 cursor-not-allowed"
                disabled
              >
                <div className="flex-1">
                  <div className="text-body-bold font-body-bold text-neutral-400">
                    Agent Triggered
                  </div>
                  <div className="text-caption font-caption text-neutral-400">
                    Coming soon
                  </div>
                </div>
              </RadioCardGroup.RadioCard>
            </RadioCardGroup>
          </div>
          
          {/* Configuration Content */}
          <div className="w-full">
            {/* Scheduled Content */}
            {activeTriggerTab === "scheduled" && (
                    <div className="w-full">
                      <div className="flex flex-col gap-6">
                        {/* Timing Configuration */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1 pt-1">
                            <span className="text-body-bold font-body-bold text-default-font">
                              Timing Configuration
                            </span>
                            <span className="text-caption font-caption text-subtext-color">
                              Set when and how often the signal should trigger
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TooltipField
                              label="Frequency"
                              tooltip="How often should the signal trigger"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select frequency"
                                value={undefined}
                                onValueChange={() => {}}
                              >
                                <Select.Item value="daily">Daily</Select.Item>
                                <Select.Item value="weekly">Weekly</Select.Item>
                                <Select.Item value="monthly">Monthly</Select.Item>
                              </Select>
                            </TooltipField>
                            
                            <TooltipField
                              label="Repeat Interval"
                              tooltip="Every X days/weeks/months (e.g., every 2 weeks)"
                              className="w-full"
                            >
                              <TextField className="h-auto w-full">
                                <TextField.Input
                                  type="number"
                                  placeholder="1"
                                  value=""
                                  min="1"
                                  onChange={() => {}}
                                />
                              </TextField>
                            </TooltipField>
                            
                            {/* Empty spacer column for consistent width */}
                            <div></div>
                          </div>
                        </div>

                        {/* Schedule Settings */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1 pt-1">
                            <span className="text-body-bold font-body-bold text-default-font">
                              Schedule Settings
                            </span>
                            <span className="text-caption font-caption text-subtext-color">
                              Configure when the signal starts and timezone
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TooltipField
                              label="Start Date & Time"
                              tooltip="When should the signal first trigger"
                              className="w-full"
                            >
                              <TextField className="h-auto w-full">
                                <TextField.Input
                                  type="datetime-local"
                                  value=""
                                  onChange={() => {}}
                                />
                              </TextField>
                            </TooltipField>
                            
                            <TooltipField
                              label="Timezone"
                              tooltip="Choose your timezone for scheduling"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select timezone"
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
                            </TooltipField>
                            
                            {/* Empty spacer column for consistent width */}
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
            )}

            {/* One-time Content */}
            {activeTriggerTab === "one-time" && (
                    <div className="w-full">
                      <div className="flex flex-col gap-6">
                        {/* Execution Settings */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-body-bold font-body-bold text-default-font">
                              Execution Settings
                            </span>
                            <span className="text-caption font-caption text-subtext-color">
                              Schedule a single execution of this signal
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TooltipField
                              label="Execution Date & Time"
                              tooltip="When should the signal execute (one time only)"
                              className="w-full"
                            >
                              <TextField className="h-auto w-full">
                                <TextField.Input
                                  type="datetime-local"
                                  value=""
                                  onChange={() => {}}
                                />
                              </TextField>
                            </TooltipField>
                            
                            <TooltipField
                              label="Timezone"
                              tooltip="Choose your timezone for execution"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select timezone"
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
                            </TooltipField>
                            
                            {/* Empty spacer column for consistent width */}
                            <div></div>
                          </div>
                        </div>

                        {/* Important Notice */}
                        <div className="flex w-full flex-col items-start gap-2 rounded-md border border-solid border-amber-200 bg-amber-25 px-4 py-3">
                          <span className="text-caption-bold font-caption-bold text-amber-800">
                            Single Execution Only
                          </span>
                          <span className="text-caption font-caption text-amber-700">
                            This signal will execute once at the specified time and then be automatically disabled.
                          </span>
                        </div>
                      </div>
                    </div>
            )}

            {/* Agent Triggered Content */}
            {activeTriggerTab === "agent-triggered" && (
                    <div className="w-full">
                      <div className="flex flex-col gap-6">
                        {/* Monitoring Configuration */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-body-bold font-body-bold text-default-font">
                              Monitoring Configuration
                            </span>
                            <span className="text-caption font-caption text-subtext-color">
                              Choose what metric to monitor and how to evaluate it
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TooltipField
                              label="Monitor Metric"
                              tooltip="Choose which metric the AI should monitor for changes"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select metric to monitor"
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
                            </TooltipField>
                            
                            <TooltipField
                              label="Condition Type"
                              tooltip="How should the AI evaluate the metric"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select condition type"
                                value={undefined}
                                onValueChange={() => {}}
                              >
                                <Select.Item value="threshold">Threshold (above/below value)</Select.Item>
                                <Select.Item value="percentage-change">Percentage Change</Select.Item>
                                <Select.Item value="trend">Trend Analysis</Select.Item>
                                <Select.Item value="anomaly">Anomaly Detection</Select.Item>
                              </Select>
                            </TooltipField>
                            
                            {/* Empty spacer column for consistent width */}
                            <div></div>
                          </div>
                        </div>

                        {/* Trigger Conditions */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-body-bold font-body-bold text-default-font">
                              Trigger Conditions
                            </span>
                            <span className="text-caption font-caption text-subtext-color">
                              Define when the signal should be triggered
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <TooltipField
                              label="Direction"
                              tooltip="When should the trigger activate"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select direction"
                                value={undefined}
                                onValueChange={() => {}}
                              >
                                <Select.Item value="increases">Increases</Select.Item>
                                <Select.Item value="decreases">Decreases</Select.Item>
                                <Select.Item value="changes">Changes (either)</Select.Item>
                              </Select>
                            </TooltipField>
                            
                            <TooltipField
                              label="Threshold Value"
                              tooltip="Value or percentage to trigger on"
                              className="w-full"
                            >
                              <TextField className="h-auto w-full">
                                <TextField.Input
                                  type="number"
                                  placeholder="10"
                                  value=""
                                  onChange={() => {}}
                                />
                              </TextField>
                            </TooltipField>
                            
                            {/* Empty spacer column for consistent width */}
                            <div></div>
                          </div>
                        </div>

                        {/* Advanced Settings */}
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-body-bold font-body-bold text-default-font">
                              Advanced Settings
                            </span>
                            <span className="text-caption font-caption text-subtext-color">
                              Fine-tune monitoring behavior and frequency
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TooltipField
                              label="Time Window"
                              tooltip="Period to evaluate condition over"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select time window"
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
                            </TooltipField>
                            
                            <TooltipField
                              label="Check Frequency"
                              tooltip="How often to evaluate condition"
                              className="w-full"
                            >
                              <Select
                                className="h-auto w-full"
                                placeholder="Select frequency"
                                value={undefined}
                                onValueChange={() => {}}
                              >
                                <Select.Item value="5m">Every 5 minutes</Select.Item>
                                <Select.Item value="15m">Every 15 minutes</Select.Item>
                                <Select.Item value="30m">Every 30 minutes</Select.Item>
                                <Select.Item value="1h">Every hour</Select.Item>
                              </Select>
                            </TooltipField>
                            
                            <TooltipField
                              label="Cooldown Period"
                              tooltip="Minutes between triggers"
                              className="w-full"
                            >
                              <TextField className="h-auto w-full">
                                <TextField.Input
                                  type="number"
                                  placeholder="60"
                                  value=""
                                  min="1"
                                  onChange={() => {}}
                                />
                              </TextField>
                            </TooltipField>
                          </div>
                        </div>
                      </div>
                    </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}