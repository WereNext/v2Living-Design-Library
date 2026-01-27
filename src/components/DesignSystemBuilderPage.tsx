import { DesignSystemBuilder } from "./DesignSystemBuilder";
import { useDesignSystems } from "../hooks/useDesignSystems";
import { toast } from "sonner";

export function DesignSystemBuilderPage() {
  const { addSystem, applySystem } = useDesignSystems();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="mb-2">Design System Builder</h1>
        <p className="text-muted-foreground">
          Create and customize your own design systems from scratch or using templates. Build multiple design systems for different projects, clients, or brand variations.
        </p>
      </div>

      <DesignSystemBuilder
        onSystemCreated={async (system, applyImmediately) => {
          // Create a theme from the token data
          const theme = {
            id: `theme-${Date.now()}`,
            name: system.name || 'Default Theme',
            colors: system.colors || {},
            spacing: system.spacing || {},
            typography: system.typography || {},
            borderRadius: system.borderRadius || {},
            shadows: system.shadows || {}
          };

          // Add system to saved library with themes array
          const newSystem = await addSystem({
            name: system.name,
            description: system.description,
            themes: [theme],
            activeThemeId: theme.id
          });

          if (!newSystem) {
            toast.error("Failed to save design system");
            return;
          }

          // Apply immediately if checkbox was checked
          if (applyImmediately) {
            // Use setTimeout to allow React to update state before applySystem looks up the system
            setTimeout(() => {
              applySystem(newSystem.id);
            }, 0);
            toast.success(`"${system.name}" created and applied!`);
          } else {
            toast.success(`"${system.name}" saved to library!`);
          }
        }}
      />
    </div>
  );
}
