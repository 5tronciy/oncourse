export type ScriptComponentType = "Script" | "Import" | "Query" | "Email" | "Message";

export interface ScriptComponent {
  type: ScriptComponentType;
  content?: string;
}

export interface ScriptQueryComponent extends ScriptComponent {
  queryClosureReturnValue?: string;
  entity?: string;
  query?: string;
}

export interface ScriptEmailComponent extends ScriptComponent {
  template?: string;
  bindings?: string;
  subject?: string;
  content?: string;
  to?: string;
  ccc?: string;
  bcc?: string;
}

export interface ScriptEmailComponent extends ScriptComponent {
  template?: string;
  bindings?: string;
  subject?: string;
  content?: string;
  to?: string;
  ccc?: string;
  bcc?: string;
}

export interface ScriptMessageComponent extends ScriptComponent {
  template?: string;
  from?: string;
  record?: string;
}