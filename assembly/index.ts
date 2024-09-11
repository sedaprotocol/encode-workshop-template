import { Process } from "@seda-protocol/as-sdk/assembly";
import { executionPhase } from "./execution-phase";
import { tallyPhase } from "./tally-phase";

/**
 * Determines whether the process is running in the
 * execution phase or tally phase based on the environment and
 * executes the appropriate logic.
 */
if (Process.isDrVmMode()) {
  // If in Data Request (DR) execution mode, call the execution phase
  executionPhase();
} else {
  // Otherwise, assume it's the tally phase
  tallyPhase();
}
