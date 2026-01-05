import { ReactNode, useState } from "react";
import { SectionNavigation } from "./SectionNavigation";

interface Section {
  id: string;
  title: string;
}

interface ShowcaseWithNavProps {
  sections: Section[];
  children: ReactNode;
}

export function ShowcaseWithNav({ sections, children }: ShowcaseWithNavProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  return (
    <div className="flex gap-8 relative min-h-screen">
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <SectionNavigation 
        sections={sections} 
        activeSection={activeSection}
        onActiveChange={setActiveSection}
      />
    </div>
  );
}