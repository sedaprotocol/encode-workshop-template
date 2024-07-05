import { Process } from "@seda-protocol/as-sdk/assembly";
import { executionPhase } from "./execution-phase";
import { tallyPhase } from "./tally-phase";

if (Process.isDrVmMode()) {
  executionPhase();
// Optionally there is a check for Process.isTallyVmMode()
} else {
  tallyPhase();
}
