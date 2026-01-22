import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { BookOpen, Package, Info } from "lucide-react";
import { SavedDesignSystems } from "./SavedDesignSystems";
import { useDesignSystems } from "../hooks/useDesignSystems";
import { toast } from "sonner";

export function SavedDesignSystemsPage() {
  const { systems, activeSystemId, applySystem, deleteSystem, exportSystem } = useDesignSystems();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2">Saved Design Systems</h1>
        <p className="text-muted-foreground">
          Manage your custom design systems created in the Design System Builder. Apply, export, or delete saved systems.
        </p>
      </div>

      {/* Clarification Alert */}
      <Alert className="border-blue-200 bg-blue-50/50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <strong className="text-blue-900">Looking for brand themes?</strong>
          <div className="mt-2 text-sm text-blue-800">
            Switch between themes (Apple, Brutalist, Candy, etc.) using the <strong>Theme Customizer</strong> in the right sidebar →
          </div>
        </AlertDescription>
      </Alert>

      {/* Saved Systems */}
      <SavedDesignSystems
        systems={systems}
        activeSystemId={activeSystemId}
        onApply={(system) => {
          const success = applySystem(system.id);
          if (success) {
            toast.success(`Applied "${system.name}"!`);
          }
        }}
        onDelete={(id) => {
          deleteSystem(id);
          toast.success("Design system deleted");
        }}
        onExport={(system) => {
          exportSystem(system.id);
        }}
      />

      {/* Help Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            How Design Systems Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Themes vs Design Systems:</strong> Themes (Apple, Brutalist, Candy, etc.) are brand presets 
            you switch between in the Theme Customizer. Design Systems are your custom token configurations saved here.
          </div>
          <div>
            <strong>Creating Systems:</strong> Go to the Design System Builder to create custom systems with your 
            own colors, spacing, typography, and more. Save them here for reuse.
          </div>
          <div>
            <strong>Applying Systems:</strong> Click "Apply" to activate a saved system. All components will 
            update to use that system's tokens instantly.
          </div>
          <div>
            <strong>Exporting & Sharing:</strong> Export any system as JSON to share with your team, use in other 
            projects, or import into Figma/other design tools.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}