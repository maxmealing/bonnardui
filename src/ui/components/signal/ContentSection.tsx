"use client";

import React from "react";
import { Button } from "@/ui/components/Button";
import { FeatherEdit } from "@subframe/core";

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

  const getContentDescription = () => {
    switch (channelType) {
      case "slack":
        return "Message format and content";
      case "email":
        return "Email template and design";
      case "webhook":
        return "JSON payload structure";
      default:
        return "Content configuration";
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6">
      <div className="flex w-full items-center justify-between pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-heading-3 font-heading-3 text-default-font">
            Content
          </span>
          <span className="text-body font-body text-subtext-color">
            {getContentDescription()}
          </span>
        </div>
        <Button
          variant="neutral-tertiary"
          size="small"
          icon={<FeatherEdit />}
          onClick={() => window.location.href = getContentPath()}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}