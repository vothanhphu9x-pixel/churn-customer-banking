/**
 * ModuleOverview Component
 * 
 * Design Philosophy: Modern Technical Documentation
 * - Display module information and statistics
 * - Show all tables in the module
 * - Provide quick navigation
 */

import { Module } from '@/data/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Table2 } from 'lucide-react';

interface ModuleOverviewProps {
  module: Module;
  onTableSelect: (tableId: string) => void;
}

export default function ModuleOverview({ module, onTableSelect }: ModuleOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start gap-3 mb-4">
          <Database className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{module.name}</h1>
            {module.role && (
              <p className="text-sm text-muted-foreground mt-1">
                Vai trò: <span className="font-medium text-foreground">{module.role}</span>
              </p>
            )}
          </div>
          {module.importance && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {module.importance}⭐
            </Badge>
          )}
        </div>
        <p className="text-foreground/80 leading-relaxed">{module.description}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Số bảng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{module.tables.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tổng số cột</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {module.tables.reduce((sum, t) => sum + t.columns.length, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cột dùng trong model</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {module.tables.reduce(
                (sum, t) => sum + t.columns.filter((c) => c.usedInModel).length,
                0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables List */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Bảng trong module</h2>
        <div className="grid gap-4">
          {module.tables.map((table) => (
            <Card
              key={table.id}
              className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
              onClick={() => onTableSelect(table.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Table2 className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg font-mono">{table.name}</CardTitle>
                    </div>
                    <CardDescription className="text-foreground/70">
                      {table.description}
                    </CardDescription>
                  </div>
                  {table.importance && (
                    <Badge variant="outline">{table.importance}⭐</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">{table.columns.length}</span> cột
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      {table.columns.filter((c) => c.usedInModel).length}
                    </span>{' '}
                    dùng trong model
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      {table.columns.filter((c) => !c.nullable).length}
                    </span>{' '}
                    NOT NULL
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
