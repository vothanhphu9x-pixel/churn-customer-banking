import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TableDetail from "@/components/TableDetail";
import ModuleOverview from "@/components/ModuleOverview";
import { schemaModules, getModuleById, getTableById } from "@/data/schema";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [activeModuleId, setActiveModuleId] = useState(schemaModules[0]?.id);
  const [activeTableId, setActiveTableId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeModule = activeModuleId
    ? getModuleById(activeModuleId)
    : undefined;
  const activeTable = activeTableId ? getTableById(activeTableId) : undefined;

  const handleModuleSelect = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setActiveTableId(undefined);
  };

  const handleTableSelect = (tableId: string) => {
    setActiveTableId(tableId);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } hidden md:flex transition-all duration-300 overflow-hidden`}
      >
        <Sidebar
          activeModuleId={activeModuleId}
          activeTableId={activeTableId}
          onModuleSelect={handleModuleSelect}
          onTableSelect={handleTableSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {activeTable
                  ? activeTable.name
                  : activeModule?.name || "Data Dictionary"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeTable
                  ? `${activeModule?.name} • ${activeTable.columns.length} cột`
                  : activeModule?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {activeTable ? (
              <TableDetail table={activeTable} />
            ) : activeModule ? (
              <ModuleOverview
                module={activeModule}
                onTableSelect={handleTableSelect}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Chọn một module từ sidebar để bắt đầu
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border md:hidden transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          activeModuleId={activeModuleId}
          activeTableId={activeTableId}
          onModuleSelect={(id) => {
            handleModuleSelect(id);
            setSidebarOpen(false);
          }}
          onTableSelect={(id) => {
            handleTableSelect(id);
            setSidebarOpen(false);
          }}
        />
      </div>
    </div>
  );
}
