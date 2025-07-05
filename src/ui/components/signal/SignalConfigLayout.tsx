"use client";

import React from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { AutoSaveIndicator } from "@/ui/components/AutoSaveIndicator";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { FeatherArrowLeft, FeatherEye, FeatherMoreVertical, FeatherTrash, FeatherArchive } from "@subframe/core";
import * as SubframeCore from "@subframe/core";

interface SignalConfigLayoutProps {
  channelType: "slack" | "email" | "webhook";
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  validationState?: {
    isValid: boolean;
    totalErrors: number;
    hasErrors: boolean;
  };
  autoSave?: {
    isSaving: boolean;
    lastSaved: Date | null;
    error: string | null;
  };
  onLaunchClick?: () => void;
  onDeleteSignal?: () => void;
  onArchiveSignal?: () => void;
}

export function SignalConfigLayout({ 
  channelType, 
  children, 
  previewContent,
  validationState,
  autoSave,
  onLaunchClick,
  onDeleteSignal,
  onArchiveSignal
}: SignalConfigLayoutProps) {
  const getChannelDisplayName = () => {
    switch (channelType) {
      case "slack":
        return "Slack";
      case "email":
        return "Email";
      case "webhook":
        return "Webhook";
      default:
        return "Signal";
    }
  };

  const getContentDefinePath = () => {
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
    <DefaultPageLayout>
      <div className="container max-w-none flex w-full flex-col items-center gap-12 bg-neutral-50 py-12 pb-32">
        <div className="flex w-full max-w-[1024px] items-center justify-between">
          <div className="flex items-center gap-4">
            <IconButton
              variant="neutral-tertiary"
              icon={<FeatherArrowLeft />}
              onClick={() => window.history.back()}
            />
            <div className="flex items-center gap-3">
              <span className="text-heading-2 font-heading-2 text-default-font">
                Configure {getChannelDisplayName()} Signal
              </span>
              <SubframeCore.DropdownMenu.Root>
                <SubframeCore.DropdownMenu.Trigger asChild={true}>
                  <IconButton
                    variant="neutral-tertiary"
                    size="small"
                    icon={<FeatherMoreVertical />}
                  />
                </SubframeCore.DropdownMenu.Trigger>
                <SubframeCore.DropdownMenu.Portal>
                  <SubframeCore.DropdownMenu.Content
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    asChild={true}
                  >
                    <DropdownMenu>
                      <DropdownMenu.DropdownItem
                        icon={<FeatherArchive />}
                        onClick={onArchiveSignal}
                      >
                        Archive
                      </DropdownMenu.DropdownItem>
                      <DropdownMenu.DropdownDivider />
                      <DropdownMenu.DropdownItem
                        icon={<FeatherTrash />}
                        onClick={onDeleteSignal}
                        className="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </DropdownMenu.DropdownItem>
                    </DropdownMenu>
                  </SubframeCore.DropdownMenu.Content>
                </SubframeCore.DropdownMenu.Portal>
              </SubframeCore.DropdownMenu.Root>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {autoSave && (
              <AutoSaveIndicator 
                isSaving={autoSave.isSaving}
                lastSaved={autoSave.lastSaved}
                error={autoSave.error}
              />
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="neutral-tertiary"
                onClick={() => {}}
              >
                Finish Later
              </Button>
              <Button
                onClick={onLaunchClick || (() => {})}
              >
                Launch
              </Button>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-[1024px] items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
            {children}
          </div>
          <div className="flex w-96 flex-none flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 sticky top-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Preview
            </span>
            {previewContent || (
              <div className="flex h-96 w-full flex-none flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-border bg-neutral-50 px-6 py-12">
                <FeatherEye className="text-heading-1 font-heading-1 text-neutral-400" />
                <span className="text-body font-body text-subtext-color text-center">
                  Configure your signal to see a preview
                </span>
                <Button
                  variant="neutral-secondary"
                  onClick={() => window.location.href = getContentDefinePath()}
                >
                  Define Content
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}