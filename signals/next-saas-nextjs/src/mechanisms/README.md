# Gate Flow Mechanism

This directory contains pure logic for the gate flow system - platform-agnostic functions that can be visualized, tested, and reused.

## Visual Flow

```
┌─────────────────────────────────────────┐
│ Homepage (Signal List) - FREE           │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Drill 1, 2, 3 - FREE                    │
│ (View full signal details)              │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Drill 4 Attempt                         │
│ ⚠️  TRIGGER: Email Gate                 │
└──────────────┬──────────────────────────┘
               ↓
      ┌────────┴────────┐
      │  Email Provided? │
      └────────┬────────┘
         NO ←──┤ YES
         ↓     └──→ Continue
    BLOCKED         ↓
               ┌────────────────────┐
               │ Drills 5-9 - FREE  │
               │ (6 more signals)   │
               └──────┬─────────────┘
                      ↓
               ┌────────────────────┐
               │ Drill 10 Attempt   │
               │ ⚠️  TRIGGER: Broker │
               └──────┬─────────────┘
                      ↓
             ┌────────┴────────┐
             │ Broker Account?  │
             └────────┬────────┘
                NO ←──┤ YES
                ↓     └──→ Unlimited
           BLOCKED         Access ✅
```

## Files

### `gateFlowMechanism.ts`
Pure logic for gate flow - no React, no UI dependencies.

**Exports:**
- `GateFlowMechanism` - Main mechanism object with all functions
- `shouldShowEmailGate()` - Email gate logic
- `shouldShowBrokerGate()` - Broker gate logic
- `canAccessDrill()` - Access control
- State machine functions

## Usage

```typescript
import { GateFlowMechanism } from '@/mechanisms/gateFlowMechanism';

// Check which gate to show
const state = {
  hasEmail: false,
  hasBrokerAccount: false,
  drillsViewed: 3,
  drillsViewedAfterEmail: 0
};

const gate = GateFlowMechanism.getNextGate(state);
// Returns: 'email' (because drillsViewed >= 3 and no email)

// Check access
const decision = GateFlowMechanism.canAccessDrill(4, state);
// Returns: { canAccess: false, gateToShow: 'email', ... }
```

## Testing

Pure functions = easy to test:

```typescript
import { GateFlowMechanism } from '@/mechanisms/gateFlowMechanism';

test('email gate appears on 4th drill', () => {
  const state = {
    hasEmail: false,
    hasBrokerAccount: false,
    drillsViewed: 3,
    drillsViewedAfterEmail: 0
  };

  expect(GateFlowMechanism.shouldShowEmailGate(state)).toBe(true);
});
```

## Visualization

This mechanism can be visualized as:

1. **State Machine Diagram** - see ASCII art above
2. **Mermaid Flowchart** - export to docs
3. **Decision Tree** - for debugging
4. **Test Coverage** - see what paths are tested

## Architecture

```
mechanisms/gateFlowMechanism.ts  ← Pure logic (this file)
   ↓ uses
config/gates.ts                   ← Configuration
   ↓ manages state with
utils/gateState.ts                ← State management
   ↓ wrapped by
hooks/useGateFlow.ts              ← React integration
   ↓ used by
components/gates/GateManager.tsx  ← UI rendering
```

## Why Separate Mechanism?

1. **Platform Agnostic** - Can use in React, React Native, Node.js
2. **Easy to Test** - Pure functions, no mocks needed
3. **Easy to Visualize** - Export to diagrams
4. **Single Source of Truth** - One file = entire flow logic
5. **Easy to Document** - Code IS the documentation

## License

Internal use only - part of signals trading platform.
