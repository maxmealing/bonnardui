"use client";

import React from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherChevronUp, FeatherChevronDown, FeatherX } from "@subframe/core";
import { Select } from "@/ui/components/Select";
import { TextArea } from "@/ui/components/TextArea";
import { TooltipField } from "@/ui/components/signal/TooltipField";

interface SignalData {
  selectedMetrics: string[];
  signalPrompt: string;
  timeFrame?: string;
  [key: string]: any;
}

interface ScopeSectionProps {
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
  isScopeOpen: boolean;
  setIsScopeOpen: (open: boolean) => void;
  validationData?: SignalData;
  updateData?: (updates: Partial<SignalData>) => void;
  getFieldError?: (field: string) => string | undefined;
}

export function ScopeSection({
  selectedMetrics,
  setSelectedMetrics,
  isScopeOpen,
  setIsScopeOpen,
  validationData,
  updateData,
  getFieldError
}: ScopeSectionProps) {
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
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
      <div 
        className={`flex w-full items-center justify-between pt-2 py-2 transition-colors ${!isScopeOpen ? 'cursor-pointer hover:bg-neutral-25' : ''}`}
        onClick={!isScopeOpen ? () => setIsScopeOpen(true) : undefined}
      >
        <div className="flex flex-col gap-2">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Scope
          </span>
          <span className={`text-body font-body text-subtext-color ${isScopeOpen ? 'invisible' : 'visible'}`}>
            What data to include
          </span>
        </div>
        <IconButton
          icon={isScopeOpen ? <FeatherChevronUp /> : <FeatherChevronDown />}
          onClick={(e) => {
            e.stopPropagation();
            setIsScopeOpen(!isScopeOpen);
          }}
        />
      </div>
      {isScopeOpen && (
        <div className="flex w-full flex-col items-start gap-3">
          <TooltipField
            label="Signal Prompt"
            tooltip="Natural-language guidance for AI analysis of the selected metrics"
            className="w-full"
          >
            <TextArea className="h-auto w-full">
              <TextArea.Input
                placeholder="Enter signal prompt"
                value=""
                onChange={() => {}}
              />
            </TextArea>
          </TooltipField>
          
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-2 pt-1">
              <span className="text-body-bold font-body-bold text-default-font">
                Metric Selection
              </span>
              <span className="text-caption font-caption text-subtext-color">
                Select metrics with audience compatibility for analysis
              </span>
            </div>
            
            {selectedMetrics.length > 0 && (
              <div className="flex w-full flex-wrap items-start gap-2">
                {selectedMetrics.map((metric) => (
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
                ))}
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
          
          <TooltipField
            label="Global Time Frame"
            tooltip="Choose the analysis period for signal data collection"
            className="w-full"
          >
            <Select
              className="h-auto w-full"
              placeholder="Select time range"
              value={undefined}
              onValueChange={() => {}}
            >
              <Select.Item value="24h">24h</Select.Item>
              <Select.Item value="7d">7d</Select.Item>
              <Select.Item value="30d">30d</Select.Item>
              <Select.Item value="90d">90d</Select.Item>
              <Select.Item value="custom">custom</Select.Item>
            </Select>
          </TooltipField>
        </div>
      )}
    </div>
  );
}