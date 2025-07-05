"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DialogLayout } from "@/ui/layouts/DialogLayout";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { FeatherMessageSquare } from "@subframe/core";
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
        <div className="w-full items-start gap-4 grid grid-cols-3">
          <div 
            className={`flex grow shrink-0 basis-0 items-center gap-4 rounded-md border border-solid px-4 py-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
              selectedType === "slack" 
                ? "border-brand-primary bg-brand-50" 
                : "border-neutral-border bg-default-background hover:border-neutral-300"
            }`}
            onClick={() => setSelectedType("slack")}
          >
            <IconWithBackground
              size="large"
              icon={<FeatherMessageSquare />}
              square={true}
            />
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
              <span className="text-body-bold font-body-bold text-default-font">
                Slack
              </span>
              <span className="text-caption font-caption text-subtext-color">
                Send insights to Slack channels
              </span>
            </div>
          </div>
          <div 
            className={`flex grow shrink-0 basis-0 items-center gap-4 rounded-md border border-solid px-4 py-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
              selectedType === "email" 
                ? "border-brand-primary bg-brand-50" 
                : "border-neutral-border bg-default-background hover:border-neutral-300"
            }`}
            onClick={() => setSelectedType("email")}
          >
            <IconWithBackground
              size="large"
              icon={<FeatherMail />}
              square={true}
            />
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
              <span className="text-body-bold font-body-bold text-default-font">
                Email
              </span>
              <span className="text-caption font-caption text-subtext-color">
                Send formatted email reports
              </span>
            </div>
          </div>
          <div 
            className={`flex grow shrink-0 basis-0 items-center gap-4 rounded-md border border-solid px-4 py-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${
              selectedType === "webhook" 
                ? "border-brand-primary bg-brand-50" 
                : "border-neutral-border bg-default-background hover:border-neutral-300"
            }`}
            onClick={() => setSelectedType("webhook")}
          >
            <IconWithBackground
              size="large"
              icon={<FeatherCode />}
              square={true}
            />
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-1">
              <span className="text-body-bold font-body-bold text-default-font">
                Webhook
              </span>
              <span className="text-caption font-caption text-subtext-color">
                Send JSON data to HTTP endpoints
              </span>
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