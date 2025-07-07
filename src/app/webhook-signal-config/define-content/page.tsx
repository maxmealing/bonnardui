"use client";

import React, { useState, useRef, useEffect } from "react";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { 
  FeatherPlus, 
  FeatherCode, 
  FeatherHash, 
  FeatherType,
  FeatherX, 
  FeatherSave, 
  FeatherArrowLeft,
  FeatherUser, 
  FeatherBarChart3, 
  FeatherClock, 
  FeatherTrendingUp, 
  FeatherPercent,
  FeatherMoreHorizontal,
  FeatherSparkles
} from "@subframe/core";

type FieldType = "string" | "number" | "boolean" | "variable";

interface Field {
  id: string;
  key: string;
  type: FieldType;
  value: string;
  description?: string;
}

interface VariableMenuProps {
  position: { x: number; y: number };
  onSelectVariable: (variable: string) => void;
  onClose: () => void;
}

const fieldTypeConfig = {
  string: {
    icon: FeatherType,
    label: 'Text',
    description: 'Text value'
  },
  number: {
    icon: FeatherHash,
    label: 'Number', 
    description: 'Numeric value'
  },
  boolean: {
    icon: FeatherCode,
    label: 'Boolean',
    description: 'True/false value'
  },
  variable: {
    icon: FeatherSparkles,
    label: 'Variable',
    description: 'Dynamic value from analytics'
  }
} as const;

function VariableMenu({ position, onSelectVariable, onClose }: VariableMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const variables = [
    { 
      key: 'user_name', 
      label: 'User Name', 
      description: 'Name of the user',
      icon: FeatherUser,
      category: 'User'
    },
    { 
      key: 'metric_value', 
      label: 'Metric Value', 
      description: 'Current metric value',
      icon: FeatherBarChart3,
      category: 'Data'
    },
    { 
      key: 'time_period', 
      label: 'Time Period', 
      description: 'Analysis time frame',
      icon: FeatherClock,
      category: 'Time'
    },
    { 
      key: 'previous_value', 
      label: 'Previous Value', 
      description: 'Previous period value',
      icon: FeatherBarChart3,
      category: 'Data'
    },
    { 
      key: 'change_percentage', 
      label: 'Change %', 
      description: 'Percentage change',
      icon: FeatherPercent,
      category: 'Analysis'
    },
    { 
      key: 'trend_direction', 
      label: 'Trend Direction', 
      description: 'Up/down trend',
      icon: FeatherTrendingUp,
      category: 'Analysis'
    },
    { 
      key: 'timestamp', 
      label: 'Timestamp', 
      description: 'Current timestamp',
      icon: FeatherClock,
      category: 'Time'
    },
    { 
      key: 'metric_name', 
      label: 'Metric Name', 
      description: 'Name of the metric',
      icon: FeatherBarChart3,
      category: 'Data'
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-solid border-neutral-border rounded-lg shadow-xl py-2 min-w-[320px] max-h-80 overflow-y-auto"
      style={{ left: position.x, top: position.y }}
    >
      <div className="px-3 py-2 border-b border-neutral-100">
        <span className="text-caption-bold font-caption-bold text-neutral-600">
          Insert variable
        </span>
      </div>
      {variables.map((variable) => {
        const IconComponent = variable.icon;
        return (
          <button
            key={variable.key}
            onClick={() => onSelectVariable(variable.key)}
            className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-neutral-50 transition-colors group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-brand-50 group-hover:bg-brand-100 transition-colors">
              <IconComponent className="w-4 h-4 text-brand-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="text-body-bold font-body-bold text-default-font">
                  {variable.label}
                </div>
                <div className="text-caption font-caption text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                  {variable.category}
                </div>
              </div>
              <div className="text-caption font-caption text-subtext-color">
                {variable.description}
              </div>
            </div>
            <div className="text-caption font-caption text-neutral-400 font-mono">
              {`{{${variable.key}}}`}
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface FieldComponentProps {
  field: Field;
  onUpdate: (id: string, updates: Partial<Field>) => void;
  onDelete: (id: string) => void;
  onShowVariableMenu: (fieldId: string, position: { x: number; y: number }) => void;
}

function FieldComponent({ field, onUpdate, onDelete, onShowVariableMenu }: FieldComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFieldConfig = () => {
    return fieldTypeConfig[field.type];
  };

  const handleVariableMenu = () => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (rect) {
      onShowVariableMenu(field.id, { x: rect.left, y: rect.bottom + 8 });
    }
  };

  const renderTypeMenu = () => {
    
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-100 rounded"
          title="Field options"
        >
          <FeatherMoreHorizontal className="w-4 h-4 text-neutral-400" />
        </button>
        
        {showMenu && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-solid border-neutral-border rounded-lg shadow-lg py-2 min-w-[160px] z-50">
            <div className="px-3 py-2 border-b border-neutral-100">
              <span className="text-caption-bold font-caption-bold text-neutral-600">
                Change type
              </span>
            </div>
            {(Object.entries(fieldTypeConfig) as Array<[FieldType, typeof fieldTypeConfig[FieldType]]>).map(([type, typeConfig]) => {
              const IconComponent = typeConfig.icon;
              const isActive = type === field.type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    onUpdate(field.id, { type });
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-neutral-50 transition-colors ${
                    isActive ? 'bg-neutral-50 text-brand-600' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-body font-body">{typeConfig.label}</span>
                  {isActive && <span className="ml-auto text-caption text-brand-600">✓</span>}
                </button>
              );
            })}
            
            <div className="border-t border-neutral-100">
              <button
                onClick={() => {
                  onDelete(field.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 transition-colors text-red-600"
              >
                <FeatherX className="w-4 h-4" />
                <span className="text-body font-body">Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderValue = () => {
    const baseClasses = `w-full border border-solid border-neutral-200 rounded-md px-3 py-2 outline-none focus:border-brand-500 placeholder:text-neutral-400 transition-all`;
    
    if (field.type === 'boolean') {
      return (
        <select
          value={field.value}
          onChange={(e) => onUpdate(field.id, { value: e.target.value })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={baseClasses}
        >
          <option value="">Select value</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    }

    if (field.type === 'variable') {
      return (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={field.value}
            placeholder="{{variable_name}}"
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`${baseClasses} font-mono text-brand-700`}
          />
          <Button
            size="small"
            variant="neutral-secondary"
            onClick={handleVariableMenu}
            title="Insert variable"
          >
            @
          </Button>
        </div>
      );
    }

    return (
      <input
        ref={inputRef}
        type={field.type === 'number' ? 'number' : 'text'}
        value={field.value}
        placeholder={`Enter ${field.type} value...`}
        onChange={(e) => onUpdate(field.id, { value: e.target.value })}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={baseClasses}
      />
    );
  };

  return (
    <div className={`group flex items-start gap-3 py-3 px-3 rounded-lg transition-all ${
      isFocused ? 'bg-neutral-25 border border-neutral-200' : 'border border-transparent hover:bg-neutral-25'
    }`}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-neutral-100">
            {React.createElement(getFieldConfig().icon, { className: "w-3 h-3 text-neutral-600" })}
          </div>
          <input
            type="text"
            value={field.key}
            placeholder="field_name"
            onChange={(e) => onUpdate(field.id, { key: e.target.value })}
            className="flex-1 min-w-0 border border-solid border-neutral-200 rounded px-2 py-1 text-caption font-caption outline-none focus:border-brand-500"
          />
        </div>
        
        <span className="text-neutral-400 mx-2">:</span>
        
        <div className="flex-1 min-w-0">
          {renderValue()}
        </div>
      </div>
      
      {renderTypeMenu()}
    </div>
  );
}

export default function DefineWebhookContent() {
  const [fields, setFields] = useState<Field[]>([]);
  
  const [showVariableMenu, setShowVariableMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      key: 'new_field',
      type: 'string',
      value: '',
    };
    setFields([...fields, newField]);
    setHasUnsavedChanges(true);
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
    setHasUnsavedChanges(true);
  };

  const deleteField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter(field => field.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const handleVariableMenu = (fieldId: string, position: { x: number; y: number }) => {
    setActiveFieldId(fieldId);
    setMenuPosition(position);
    setShowVariableMenu(true);
  };

  const handleSelectVariable = (variable: string) => {
    if (activeFieldId) {
      updateField(activeFieldId, { value: `{{${variable}}}`, type: 'variable' });
    }
    setShowVariableMenu(false);
    setActiveFieldId(null);
  };

  const generateJSON = (fields: Field[]): Record<string, string | number | boolean> => {
    const result: Record<string, string | number | boolean> = {};
    
    for (const field of fields) {
      let value: string | number | boolean = field.value;
      if (field.type === 'number') {
        value = parseFloat(value) || 0;
      } else if (field.type === 'boolean') {
        value = value === 'true';
      }
      result[field.key] = value;
    }
    
    return result;
  };

  const jsonPreview = JSON.stringify(generateJSON(fields), null, 2);

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex w-full flex-col items-center gap-8 bg-neutral-50 py-12 pb-24 min-h-screen">
        <div className="flex w-full max-w-[1024px] items-center justify-between">
          <div className="flex items-center gap-4">
            <IconButton
              variant="neutral-tertiary"
              icon={<FeatherArrowLeft />}
              onClick={() => window.history.back()}
            />
            <span className="text-heading-2 font-heading-2 text-default-font">
              Define Webhook Payload
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral-secondary"
              onClick={() => {}}
            >
              Test Webhook
            </Button>
            <Button
              icon={<FeatherSave />}
              onClick={() => setHasUnsavedChanges(false)}
              variant={hasUnsavedChanges ? "brand-primary" : "neutral-secondary"}
            >
              {hasUnsavedChanges ? "Save Changes" : "Saved"}
            </Button>
          </div>
        </div>

        <div className="flex w-full max-w-[1024px] items-start gap-6">
          <div className="flex grow shrink-0 basis-0 flex-col gap-6 min-h-0">
            <div className="flex w-full flex-col gap-6 rounded-lg border border-solid border-neutral-border bg-default-background p-6">
              {/* Fields Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FeatherCode className="w-5 h-5 text-brand-600" />
                    <span className="text-heading-3 font-heading-3 text-default-font">
                      JSON Fields
                    </span>
                  </div>
                  <Button
                    size="small"
                    variant="neutral-secondary"
                    icon={<FeatherPlus />}
                    onClick={addField}
                  >
                    Add Field
                  </Button>
                </div>
                
                <div className="text-caption font-caption text-subtext-color bg-neutral-25 p-3 rounded-md border border-neutral-200">
                  Build your JSON payload using key-value pairs. Use @ symbol in variable fields to insert dynamic values from your analytics.
                </div>

                <div className="flex flex-col gap-2">
                  {fields.map((field) => (
                    <FieldComponent
                      key={field.id}
                      field={field}
                      onUpdate={updateField}
                      onDelete={deleteField}
                      onShowVariableMenu={handleVariableMenu}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-96 flex-none flex-col items-start gap-4">
            <div className="sticky top-6 flex w-full flex-col gap-4 rounded-lg border border-solid border-neutral-border bg-default-background p-6">
              <div className="flex items-center justify-between">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  JSON Preview
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {/* HTTP Request Preview */}
                <div className="rounded-lg border border-solid border-neutral-200 bg-neutral-50 p-3">
                  <div className="text-caption-bold font-caption-bold text-neutral-700 mb-2">Request Preview:</div>
                  <div className="text-caption font-mono text-neutral-600 mb-2">
                    POST /webhook/endpoint
                  </div>
                  <div className="text-caption font-mono text-neutral-600 mb-2">
                    Content-Type: application/json
                  </div>
                  <div className="text-caption font-mono text-neutral-600">
                    Authorization: Bearer [token]
                  </div>
                </div>
                
                {/* JSON Payload */}
                <div className="rounded-lg border border-solid border-neutral-200 bg-white p-4 max-h-[400px] overflow-auto">
                  <pre className="text-caption font-mono text-default-font whitespace-pre-wrap">
                    {jsonPreview.replace(/\{\{(\w+)\}\}/g, (match, variable) => (
                      `"*${variable.replace(/_/g, ' ')}*"`
                    ))}
                  </pre>
                </div>
                
                {/* Variable Legend */}
                <div className="rounded-lg border border-solid border-neutral-200 bg-brand-25 p-3">
                  <div className="text-caption-bold font-caption-bold text-brand-700 mb-2">Variables:</div>
                  <div className="text-caption font-caption text-brand-600">
                    Variables like {`{{metric_value}}`} will be replaced with actual values when the webhook is triggered.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variable Menu */}
        {showVariableMenu && (
          <VariableMenu
            position={menuPosition}
            onSelectVariable={handleSelectVariable}
            onClose={() => setShowVariableMenu(false)}
          />
        )}
      </div>
    </DefaultPageLayout>
  );
}