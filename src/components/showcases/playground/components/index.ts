import { buttonComponents } from "./ButtonComponents";
import { formComponents } from "./FormComponents";
import { cardComponents } from "./CardComponents";
import { feedbackComponents } from "./FeedbackComponents";
import { layoutComponents } from "./LayoutComponents";
import { dataDisplayComponents } from "./DataDisplayComponents";
import type { PlaygroundComponent } from "../types";

export const playgroundComponents: PlaygroundComponent[] = [
  ...buttonComponents,
  ...formComponents,
  ...cardComponents,
  ...feedbackComponents,
  ...layoutComponents,
  ...dataDisplayComponents,
];

export function getComponentsByCategory(components: PlaygroundComponent[]): string[] {
  return Array.from(new Set(components.map(c => c.category)));
}

export function findComponentById(
  components: PlaygroundComponent[],
  id: string
): PlaygroundComponent | undefined {
  return components.find(c => c.id === id);
}

export * from "./ButtonComponents";
export * from "./FormComponents";
export * from "./CardComponents";
export * from "./FeedbackComponents";
export * from "./LayoutComponents";
export * from "./DataDisplayComponents";
