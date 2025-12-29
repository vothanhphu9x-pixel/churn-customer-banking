import { useState } from "react";
import { Table, Column } from "@/data/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Link2, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableDetailProps {
  table: Table;
}

export default function TableDetail({ table }: TableDetailProps) {
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(
    new Set()
  );

  const toggleColumn = (columnId: string) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(columnId)) {
      newExpanded.delete(columnId);
    } else {
      newExpanded.add(columnId);
    }
    setExpandedColumns(newExpanded);
  };

  const getDataTypeColor = (dataType: string) => {
    const type = dataType.toLowerCase();
    if (type.includes("int"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (
      type.includes("varchar") ||
      type.includes("string") ||
      type.includes("text")
    )
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (
      type.includes("decimal") ||
      type.includes("numeric") ||
      type.includes("float")
    )
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    if (type.includes("date") || type.includes("timestamp"))
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    if (type.includes("boolean"))
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Raw":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
      case "Engineered":
        return "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200";
      case "Outcome":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start gap-3 mb-4">
          <Database className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{table.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Schema:{" "}
              <code className="bg-muted px-2 py-1 rounded">{table.schema}</code>
            </p>
          </div>
        </div>
        <p className="text-foreground/80 leading-relaxed">
          {table.description}
        </p>
        {table.role && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Vai trò:
            </span>
            <Badge variant="secondary">{table.role}</Badge>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="columns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="columns">
            Cột ({table.columns.length})
          </TabsTrigger>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="relations">Quan hệ</TabsTrigger>
        </TabsList>

        {/* Columns Tab */}
        <TabsContent value="columns" className="space-y-4">
          <div className="space-y-3">
            {table.columns.map((column) => (
              <div
                key={column.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleColumn(column.id)}
              >
                <div className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-base font-mono">{column.name}</div>
                        {column.category && (
                          <div className={getCategoryColor(column.category)}>
                            {column.category}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className={getDataTypeColor(column.dataType)}>
                          {column.dataType}
                        </div>
                        {!column.nullable && (
                          <div className="text-xs">NOT NULL</div>
                        )}
                        {column.usedInModel && (
                          <div className="text-xs">✓ Dùng trong model</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {expandedColumns.has(column.id) && (
                  <div className="pt-0 space-y-4 border-t border-border">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Mô tả
                      </p>
                      <p className="text-sm text-foreground/80">
                        {column.description}
                      </p>
                    </div>

                    {column.businessMeaning && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Ý nghĩa kinh doanh
                        </p>
                        <p className="text-sm text-foreground/80">
                          {column.businessMeaning}
                        </p>
                      </div>
                    )}

                    {column.example && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Ví dụ
                        </p>
                        <code className="block bg-muted px-3 py-2 rounded text-sm font-mono text-foreground">
                          {column.example}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div>
            <div>
              <h3>Thông tin chung</h3>
              <p>Tên bảng: {table.name}</p>
            </div>
          </div>
        </TabsContent>

        {/* Relations Tab */}
        <TabsContent value="relations">
          <div>
            <h3>Quan hệ bảng</h3>
            {table.columns.some((c) => c.name.includes("id")) ? (
              <div>
                {table.columns
                  .filter((c) => c.name.includes("id"))
                  .map((col) => (
                    <div
                      key={col.id}
                      className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                    >
                      <Link2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium">
                          {col.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {col.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p>Không có quan hệ ngoài được xác định</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div>Cột Raw</div>
          <div>{table.columns.filter((c) => c.category === "Raw").length}</div>
        </div>
        <div>
          <div>Cột Engineered</div>
          <div>
            {table.columns.filter((c) => c.category === "Engineered").length}
          </div>
        </div>
        <div>
          <div>Dùng trong model</div>
          <div>{table.columns.filter((c) => c.usedInModel).length}</div>
        </div>
      </div>
    </div>
  );
}
