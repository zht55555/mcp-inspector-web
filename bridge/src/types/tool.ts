export interface ToolItem {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ToolListData {
  tools: ToolItem[];
}
