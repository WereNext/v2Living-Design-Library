"use client";

import { useEffect, useRef } from "react";
import { cn } from "./ui/utils";

interface Section {
  id: string;
  title: string;
}

interface SectionNavigationProps {
  sections: Section[];
  activeSection: string;
  onActiveChange: (id: string) => void;
}

export function SectionNavigation({ 
  sections, 
  activeSection, 
  onActiveChange
}: SectionNavigationProps) {
  const isUserScrolling = useRef(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Only update if user is scrolling naturally (not clicking nav)
        if (!isUserScrolling.current) return;

        // Filter entries that are actually intersecting
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length === 0) return;

        // Find the section closest to the top of the viewport
        let closestEntry = visibleEntries[0];
        let closestDistance = Math.abs(visibleEntries[0].boundingClientRect.top);

        visibleEntries.forEach(entry => {
          const distance = Math.abs(entry.boundingClientRect.top);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestEntry = entry;
          }
        });

        onActiveChange(closestEntry.target.id);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-100px 0px -66% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections, onActiveChange]);

  const scrollToSection = (id: string) => {
    // Pause observer updates during programmatic scroll
    isUserScrolling.current = false;
    onActiveChange(id);

    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Resume observer updates after scroll completes
      setTimeout(() => {
        isUserScrolling.current = true;
      }, 1000);
    }
  };

  return (
    <div className="hidden lg:block w-48 flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-7rem)] self-start">
      <div className="space-y-4">
        <nav className="overflow-y-auto pb-4">
          <div className="space-y-1 pr-4 border-l-2 border-border pl-4">
            <p className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wide">On this page</p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "block w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200",
                  activeSection === section.id
                    ? "bg-accent text-accent-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}