"use client";

import React from "react";
import { IconButton } from "@/ui/components/IconButton";
import { FeatherEdit2 } from "@subframe/core";

interface ContentSectionProps {
  channelType: "slack" | "email" | "webhook";
}

export function ContentSection({ channelType }: ContentSectionProps) {
  const getContentPath = () => {
    switch (channelType) {
      case "slack":
        return "/slack-signal-config/define-content";
      case "email":
        return "/email-signal-config/define-content";
      case "webhook":
        return "/webhook-signal-config/define-content";
      default:
        return "#";
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
      <div className="flex w-full items-center justify-between pt-2">
        <span className="text-heading-3 font-heading-3 text-default-font">
          Content
        </span>
        <IconButton
          icon={<FeatherEdit2 />}
          onClick={() => window.location.href = getContentPath()}
        />
      </div>
    </div>
  );
}