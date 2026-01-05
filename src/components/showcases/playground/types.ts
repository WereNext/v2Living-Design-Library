import type { ReactNode } from "react";

export interface PlaygroundComponent {
  id: string;
  name: string;
  category: string;
  code: string;
  preview: ReactNode;
}

export interface PlaygroundIntent {
  value: string;
  label: string;
}

export type PlaygroundCategory =
  | "Buttons"
  | "Forms"
  | "Cards"
  | "Feedback"
  | "Layout"
  | "Data Display";
