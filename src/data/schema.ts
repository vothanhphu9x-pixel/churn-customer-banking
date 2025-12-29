// Copied schema from repository root
export interface Column {
  id: string;
  name: string;
  dataType: string;
  nullable: boolean;
  description: string;
  businessMeaning?: string;
  example?: string;
  category?: "Raw" | "Engineered" | "Outcome" | "Identifier" | "PII";
  usedInModel?: boolean;
}

export interface Table {
  id: string;
  name: string;
  schema: string;
  description: string;
  columns: Column[];
  role?: string;
  importance?: number;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  tables: Table[];
  importance?: number;
  role?: string;
}

export const schemaModules: Module[] = [
  {
    id: "customer-master",
    name: "Customer Master",
    description:
      "Thông tin định danh khách hàng và các trường raw trong bảng Customer Master.",
    importance: 5,
    role: "Anchor & label",
    tables: [
      {
        id: "customer-master-main",
        name: "customer_master",
        schema: "public",
        description: "Bảng chính chứa thông tin khách hàng",
        role: "Anchor & label",
        importance: 5,
        columns: [
          {
            id: "customer-id",
            name: "customer_id",
            dataType: "STRING/INTEGER",
            nullable: false,
            description: "ID duy nhất khách hàng (khóa join)",
            businessMeaning:
              "Key để ghép dữ liệu, không dùng trực tiếp làm feature",
            example: "CUST_000123",
            category: "Identifier",
            usedInModel: false,
          },
          // ... truncated for brevity in the copied file (original file is long)
        ],
      },
    ],
  },
  // Note: the full schema was long; for runtime you can replace this file with the full schema.ts from root if needed.
];

export function getModuleById(id: string): Module | undefined {
  return schemaModules.find((m) => m.id === id);
}

export function getTableById(tableId: string): Table | undefined {
  for (const module of schemaModules) {
    const table = module.tables.find((t) => t.id === tableId);
    if (table) return table;
  }
  return undefined;
}

export function getAllTables(): Table[] {
  return schemaModules.flatMap((m) => m.tables);
}
