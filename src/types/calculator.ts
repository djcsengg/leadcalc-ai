export type InputType = "slider" | "number" | "select" | "toggle";

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: InputType;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  unit?: string;
  prefix?: string;
  options?: SelectOption[];
  description?: string;
}

export type OutputFormat =
  | "currency"
  | "number"
  | "percentage"
  | "years"
  | "months"
  | "days"
  | "custom";

export interface CalculatorOutput {
  id: string;
  label: string;
  formula: string;
  format: OutputFormat;
  unit?: string;
  prefix?: string;
  decimals?: number;
  highlight?: boolean;
  description?: string;
}

export interface CalculatorSchema {
  title: string;
  description: string;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
}

export interface CalculatorStyling {
  primaryColor: string;
  accentColor: string;
  theme: "light" | "dark" | "system";
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  showBadge: boolean;
  buttonText: string;
}

export interface GateConfig {
  enabled: boolean;
  timing: "before_results" | "after_results" | "optional";
  headline: string;
  subheadline?: string;
  requireName: boolean;
  requireEmail: boolean;
  requirePhone: boolean;
  buttonLabel: string;
  privacyText?: string;
}

export interface EvaluatedOutput {
  id: string;
  label: string;
  value: number | string;
  formatted: string;
  highlight?: boolean;
  description?: string;
}

export interface LeadSubmissionPayload {
  email: string;
  name?: string;
  phone?: string;
  inputs: Record<string, number | string>;
  result: Record<string, number | string>;
}

export interface CalculatorRecord {
  id: string;
  userId: string;
  slug: string;
  title: string;
  description?: string | null;
  category: string;
  schemaJson: string;
  stylingJson?: string | null;
  gateConfigJson?: string | null;
  viewCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  leadsCount?: number;
}
