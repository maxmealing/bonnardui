"use client";

import React, { useState } from "react";
import { Tooltip } from "@/ui/components/Tooltip";
import { FeatherHelpCircle, FeatherAlertCircle, FeatherCheck } from "@subframe/core";

interface TooltipFieldProps {
  children: React.ReactNode;
  tooltip: string;
  label: string;
  className?: string;
  error?: string;
  success?: boolean;
  required?: boolean;
}

export function TooltipField({ 
  children, 
  tooltip, 
  label, 
  className, 
  error, 
  success, 
  required 
}: TooltipFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative ${className || ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-body-bold font-body-bold text-default-font">
          {label}
          {required && <span className="text-error-600 ml-1">*</span>}
        </span>
        <div className="flex items-center gap-1">
          {/* Success indicator */}
          {success && !error && (
            <FeatherCheck className="w-4 h-4 text-success-600" />
          )}
          
          {/* Error indicator */}
          {error && (
            <FeatherAlertCircle className="w-4 h-4 text-error-600" />
          )}
          
          {/* Help tooltip */}
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <FeatherHelpCircle 
              className="w-4 h-4 text-neutral-400 hover:text-neutral-600 cursor-help transition-colors" 
            />
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                <div className="flex flex-col items-center">
                  <Tooltip className="min-w-max max-w-sm whitespace-normal text-center">
                    {error || tooltip}
                  </Tooltip>
                  {/* Tooltip arrow */}
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-800 -mt-px"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced children with error state */}
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          error: !!error
        })}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-1 px-3 py-2 transition-all duration-200 ease-in-out">
          <span className="text-caption font-caption text-error-700 leading-relaxed">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}