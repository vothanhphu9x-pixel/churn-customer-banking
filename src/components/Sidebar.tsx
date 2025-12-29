import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Database } from "lucide-react";
import { schemaModules } from "@/data/schema";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeModuleId?: string;
  activeTableId?: string;
  onModuleSelect: (moduleId: string) => void;
  onTableSelect: (tableId: string) => void;
}

export default function Sidebar({
  activeModuleId,
  activeTableId,
  onModuleSelect,
  onTableSelect,
}: SidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(schemaModules.map((m) => m.id))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const filteredModules = schemaModules.filter((module) => {
    const query = searchQuery.toLowerCase();
    return (
      module.name.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query) ||
      module.tables.some(
        (table) =>
          table.name.toLowerCase().includes(query) ||
          table.description.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-foreground mb-4">
          Data Dictionary
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/50" />
          <Input
            placeholder="Tìm kiếm schema..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery((e.target as HTMLInputElement).value)
            }
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto">
        {filteredModules.length === 0 ? (
          <div className="p-4 text-center text-sidebar-foreground/50 text-sm">
            Không tìm thấy kết quả
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredModules.map((module) => (
              <div key={module.id}>
                {/* Module Header */}
                <button
                  onClick={() => {
                    toggleModule(module.id);
                    onModuleSelect(module.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeModuleId === module.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  {expandedModules.has(module.id) ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                  <Database className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{module.name}</span>
                  {module.importance && (
                    <span className="ml-auto text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-0.5 rounded">
                      {module.importance}⭐
                    </span>
                  )}
                </button>

                {/* Tables */}
                {expandedModules.has(module.id) && (
                  <div className="ml-6 space-y-1 mt-1">
                    {module.tables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => onTableSelect(table.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left",
                          activeTableId === table.id
                            ? "bg-sidebar-primary/20 text-sidebar-primary font-medium"
                            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                        title={table.description}
                      >
                        <span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />
                        <span className="truncate">{table.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
        <p>
          {schemaModules.length} modules •{" "}
          {schemaModules.reduce((sum, m) => sum + m.tables.length, 0)} tables
        </p>
      </div>
    </div>
  );
}
