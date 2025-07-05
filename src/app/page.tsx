"use client";

import React from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { FeatherArrowRight, FeatherEye } from "@subframe/core";

export default function Home() {
  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex w-full flex-col items-center gap-12 bg-neutral-50 py-12 pb-32">
        <div className="flex w-full max-w-[1024px] items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 min-h-0">
            <div className="flex w-full flex-col items-center justify-center gap-8 rounded-md border border-solid border-neutral-border bg-default-background px-12 py-24">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="text-heading-1 font-heading-1 text-default-font">
                  BonnardUI Prototype
                </span>
                <span className="text-body font-body text-subtext-color max-w-md">
                  Welcome to the BonnardUI prototype. Click the button below to test the signals configuration flow.
                </span>
              </div>
              <Button
                size="large"
                icon={<FeatherArrowRight />}
                onClick={() => window.location.href = '/signals'}
              >
                Go to Signals Page
              </Button>
            </div>
          </div>
          <div className="flex w-96 flex-none flex-col items-start gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 sticky top-6">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Prototype Testing
            </span>
            <div className="flex h-96 w-full flex-none flex-col items-center justify-center gap-4 rounded-md border border-dashed border-neutral-border bg-neutral-50 px-6 py-12">
              <FeatherEye className="text-heading-1 font-heading-1 text-neutral-400" />
              <span className="text-body font-body text-subtext-color text-center">
                This is a prototype for Alex to test the signal configuration flow
              </span>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}