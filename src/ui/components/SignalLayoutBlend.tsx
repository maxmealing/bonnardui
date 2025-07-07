"use client";
// @subframe/sync-disable

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DialogLayout } from "@/ui/layouts/DialogLayout";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { FeatherSlack } from "@subframe/core";
import { FeatherCode } from "@subframe/core";
import { FeatherMail } from "@subframe/core";
import { Button } from "@/ui/components/Button";

interface SignalLayoutBlendProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SignalType = "slack" | "webhook" | "email" | null;

function SignalLayoutBlend({ open, onOpenChange }: SignalLayoutBlendProps) {
  const [selectedType, setSelectedType] = useState<SignalType>(null);
  const router = useRouter();
  return (
    <DialogLayout open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full w-full flex-col items-start gap-6 bg-default-background px-12 py-12">
        <span className="text-heading-2 font-heading-2 text-default-font">
          Choose a signal type
        </span>
        <div className="w-full items-start gap-3 grid grid-cols-3">
          <div 
            className={`flex flex-col items-start gap-2 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedType === "slack" 
                ? "bg-brand-50 border border-solid border-brand-200 shadow-sm" 
                : "bg-white border border-solid border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
            }`}
            onClick={() => setSelectedType("slack")}
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
          </div>
          <div className="flex flex-col items-start gap-2 p-4 rounded-lg bg-neutral-50 border border-solid border-neutral-200 cursor-not-allowed opacity-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100">
                <FeatherMail className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-body-bold font-body-bold text-neutral-400">
                  Email
                </span>
                <span className="text-caption font-caption text-neutral-400">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 p-4 rounded-lg bg-neutral-50 border border-solid border-neutral-200 cursor-not-allowed opacity-50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-100">
                <FeatherCode className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-body-bold font-body-bold text-neutral-400">
                  Webhook
                </span>
                <span className="text-caption font-caption text-neutral-400">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-end">
          <Button 
            disabled={!selectedType}
            onClick={() => {
              if (selectedType === "slack") {
                onOpenChange(false);
                router.push("/slack-signal-config");
              } else if (selectedType === "email") {
                onOpenChange(false);
                router.push("/email-signal-config");
              } else if (selectedType === "webhook") {
                onOpenChange(false);
                router.push("/webhook-signal-config");
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </DialogLayout>
  );
}

export default SignalLayoutBlend;