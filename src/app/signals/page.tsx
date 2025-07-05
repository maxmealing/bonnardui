"use client";

import React, { useState } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { FeatherPlus } from "@subframe/core";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { FeatherSlack } from "@subframe/core";
import { FeatherCode } from "@subframe/core";
import { FeatherMail } from "@subframe/core";
import { FeatherSignal } from "@subframe/core";
import SignalLayoutBlend from "@/ui/components/SignalLayoutBlend";

function NoSignalPlaceholder() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-neutral-50 py-12">
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

export default NoSignalPlaceholder;