"use client";

import React, { useState, useRef, useEffect } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { Badge } from "@/ui/components/Badge";
import { FeatherPlus, FeatherEdit, FeatherChevronDown, FeatherPause, FeatherPlay, FeatherArchive, FeatherTrash2 } from "@subframe/core";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { FeatherSlack } from "@subframe/core";
import { FeatherCode } from "@subframe/core";
import { FeatherMail } from "@subframe/core";
import { FeatherSignal } from "@subframe/core";
import SignalLayoutBlend from "@/ui/components/SignalLayoutBlend";
import { SignalConfigProvider, useSignalConfig } from "@/ui";

// Signal interface
interface Signal {
  id: string;
  name: string;
  channel: "slack" | "email" | "webhook";
  status: "active" | "paused" | "draft";
}

// Sample signal data
const sampleSignals: Signal[] = [
  { id: "1", name: "Weekly User Engagement Report", channel: "slack", status: "active" },
  { id: "2", name: "Daily Revenue Alert", channel: "email", status: "active" },
  { id: "3", name: "Performance Anomaly Detection", channel: "webhook", status: "draft" }
];

// Function to load draft signals from localStorage
const loadDraftSignals = (): Signal[] => {
  const drafts: Signal[] = [];
  
  // Check for current draft
  const currentDraft = localStorage.getItem('current-signal-draft');
  if (currentDraft) {
    try {
      const draftData = JSON.parse(currentDraft);
      if (draftData.signalName && draftData.isDraft) {
        drafts.push({
          id: 'current-draft',
          name: draftData.signalName,
          channel: 'slack', // TODO: Determine from config
          status: 'draft'
        });
      }
    } catch (error) {
      console.error('Error loading draft signal:', error);
    }
  }
  
  return drafts;
};

// Helper functions
const getChannelIcon = (channel: Signal['channel']) => {
  switch (channel) {
    case "slack": return <FeatherSlack />;
    case "email": return <FeatherMail />;
    case "webhook": return <FeatherCode />;
  }
};

const getStatusVariant = (status: Signal['status']): "success" | "warning" | "neutral" => {
  switch (status) {
    case "active": return "success";
    case "paused": return "warning";
    case "draft": return "neutral";
  }
};

const getEditPath = (channel: Signal['channel']) => {
  switch (channel) {
    case "slack": return "/slack-signal-config";
    case "email": return "/email-signal-config";
    case "webhook": return "/webhook-signal-config";
  }
};

// SignalCard component
function SignalCard({ signal }: { signal: Signal }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { loadFromStorage } = useSignalConfig();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  
  const handleStatusToggle = () => {
    // TODO: Implement status toggle
    console.log(`Toggle status for signal ${signal.id}`);
  };
  
  const handleArchive = () => {
    // TODO: Implement archive
    console.log(`Archive signal ${signal.id}`);
  };
  
  const handleDelete = () => {
    // TODO: Implement delete
    console.log(`Delete signal ${signal.id}`);
  };

  const handleEdit = () => {
    // If it's a draft signal, load the data from storage first
    if (signal.status === 'draft' && signal.id === 'current-draft') {
      loadFromStorage('current-signal-draft');
    }
    window.location.href = getEditPath(signal.channel);
  };
  
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-4 transition-all hover:shadow-sm">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <IconWithBackground
          size="medium"
          icon={getChannelIcon(signal.channel)}
        />
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-body-bold font-body-bold text-default-font truncate">
            {signal.name}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(signal.status)}>
              {signal.status.charAt(0).toUpperCase() + signal.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center rounded-md border border-solid border-neutral-border bg-white">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-2 text-body font-body text-default-font hover:bg-neutral-50 transition-colors rounded-l-md border-r border-solid border-neutral-border"
          >
            <FeatherEdit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-center w-8 h-8 hover:bg-neutral-50 transition-colors rounded-r-md"
          >
            <FeatherChevronDown className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-solid border-neutral-border rounded-lg shadow-lg py-2 min-w-[140px] z-50">
            <button
              onClick={() => {
                handleStatusToggle();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 transition-colors text-body font-body text-default-font"
            >
              {signal.status === 'active' ? (
                <>
                  <FeatherPause className="w-4 h-4 text-neutral-600" />
                  Pause
                </>
              ) : (
                <>
                  <FeatherPlay className="w-4 h-4 text-neutral-600" />
                  Activate
                </>
              )}
            </button>
            <button
              onClick={() => {
                handleArchive();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 transition-colors text-body font-body text-default-font"
            >
              <FeatherArchive className="w-4 h-4 text-neutral-600" />
              Archive
            </button>
            <button
              onClick={() => {
                handleDelete();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 transition-colors text-body font-body text-red-600"
            >
              <FeatherTrash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoSignalPlaceholder() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-neutral-50 py-12 min-h-screen">
        <div className="flex w-full flex-col items-end gap-6">
          <Button
            icon={<FeatherPlus />}
            onClick={() => setIsDialogOpen(true)}
          >
            Create your first signal
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <span className="w-full text-heading-2 font-heading-2 text-default-font">
            Choose a channel
          </span>
          <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
          <div className="flex w-full items-center gap-2">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex w-full flex-col items-start gap-4 px-6">
                  <div className="flex w-full items-start gap-4 pb-10">
                    <button
                      onClick={() => window.location.href = '/slack-signal-config'}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <IconWithBackground
                        size="large"
                        icon={<FeatherSlack />}
                      />
                      <span className="text-caption font-caption text-default-font">
                        Slack
                      </span>
                    </button>
                    <button
                      onClick={() => window.location.href = '/webhook-signal-config'}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <IconWithBackground size="large" icon={<FeatherCode />} />
                      <span className="text-caption font-caption text-default-font">
                        Webhook
                      </span>
                    </button>
                    <button
                      onClick={() => window.location.href = '/email-signal-config'}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <IconWithBackground size="large" icon={<FeatherMail />} />
                      <span className="text-caption font-caption text-default-font">
                        Email
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-8 px-6 py-12">
            <div className="flex flex-col items-center gap-4">
              <IconWithBackground size="x-large" icon={<FeatherSignal />} />
              <span className="text-heading-1 font-heading-1 text-default-font">
                Create your first signal
              </span>
              <span className="text-body font-body text-subtext-color">
                Start automating your analytics insights
              </span>
            </div>
            <Button
              size="large"
              icon={<FeatherPlus />}
              onClick={() => setIsDialogOpen(true)}
            >
              Create signal
            </Button>
          </div>
        </div>
      </div>
      <SignalLayoutBlend 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </DefaultPageLayout>
  );
}

function SignalList({ signals }: { signals: Signal[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex w-full flex-col items-start gap-6 bg-neutral-50 py-12 min-h-screen">
        <div className="flex w-full items-center justify-between">
          <span className="text-heading-2 font-heading-2 text-default-font">
            Signals
          </span>
          <Button
            icon={<FeatherPlus />}
            onClick={() => setIsDialogOpen(true)}
          >
            Create signal
          </Button>
        </div>
        
        <div className="flex w-full flex-col gap-3 bg-neutral-25 rounded-lg py-4">
          <span className="text-body font-body text-subtext-color">
            Create a new signal
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/slack-signal-config'}
              className="flex flex-col items-start gap-2 p-4 rounded-lg bg-white border border-solid border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100">
                  <FeatherSlack className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Slack
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Send to channels
                  </span>
                </div>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/email-signal-config'}
              className="flex flex-col items-start gap-2 p-4 rounded-lg bg-white border border-solid border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100">
                  <FeatherMail className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Email
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Send to inbox
                  </span>
                </div>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/webhook-signal-config'}
              className="flex flex-col items-start gap-2 p-4 rounded-lg bg-white border border-solid border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100">
                  <FeatherCode className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Webhook
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Send to API
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex w-full flex-col gap-4">
          <span className="text-body font-body text-subtext-color">
            Your signals
          </span>
          <div className="flex w-full flex-col gap-3">
            {signals.map((signal) => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      </div>
      <SignalLayoutBlend 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </DefaultPageLayout>
  );
}

function SignalsPageContent() {
  const [signals, setSignals] = useState<Signal[]>([]);
  
  useEffect(() => {
    // Load signals (sample + drafts)
    const draftSignals = loadDraftSignals();
    const allSignals = [...sampleSignals, ...draftSignals];
    setSignals(allSignals);
  }, []);
  
  return signals.length > 0 ? (
    <SignalList signals={signals} />
  ) : (
    <NoSignalPlaceholder />
  );
}

export default function SignalsPage() {
  return (
    <SignalConfigProvider>
      <SignalsPageContent />
    </SignalConfigProvider>
  );
}