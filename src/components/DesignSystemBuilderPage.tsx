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
        onSystemCreated={(system, applyImmediately) => {
          // Add system to saved library
          const newSystem = addSystem({
            name: system.name,
            description: system.description,
            colors: system.colors,
            spacing: system.spacing,
            typography: system.typography,
            borderRadius: system.borderRadius,
            shadows: system.shadows
          });

          // Apply immediately if checkbox was checked
          if (applyImmediately) {
            applySystem(newSystem.id);
            toast.success(`"${system.name}" created and applied!`);
          } else {
            toast.success(`"${system.name}" saved to library!`);
          }
        }}
      />
    </div>
  );
}
