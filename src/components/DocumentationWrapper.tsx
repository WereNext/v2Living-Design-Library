import { ComponentDocumentation } from './ComponentDocumentation';
import { useDocumentation } from '../hooks/useDocumentation';

interface DocumentationWrapperProps {
  componentId: string;
  componentName: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that adds documentation capability to any component showcase
 * Usage:
 * <DocumentationWrapper componentId="buttons" componentName="Buttons & Actions">
 *   <YourShowcaseContent />
 * </DocumentationWrapper>
 */
export function DocumentationWrapper({ 
  componentId, 
  componentName, 
  children 
}: DocumentationWrapperProps) {
  const { getDocumentation, saveDocumentation } = useDocumentation();
  const documentation = getDocumentation(componentId);

  return (
    <div className="space-y-6">
      <ComponentDocumentation
        componentId={componentId}
        componentName={componentName}
        documentation={documentation}
        onSave={saveDocumentation}
      />
      {children}
    </div>
  );
}
