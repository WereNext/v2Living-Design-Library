/**
 * Email Capture Patterns
 *
 * This showcase is powered by the pattern registry.
 * Patterns are defined in: src/patterns/email-capture.ts
 */

import { PatternPreview } from "../PatternPreview";
import { emailCapturePatterns } from "../../patterns/email-capture";

export function EmailCaptureShowcase() {
  return <PatternPreview category={emailCapturePatterns} />;
}
