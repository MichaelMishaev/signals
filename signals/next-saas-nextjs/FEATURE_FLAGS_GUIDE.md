# Feature Flags System Guide

## Overview

The feature flag system allows both developer-controlled and admin dashboard-controlled feature toggling with granular scope support including:
- **Signal-level**: Control individual trading signals
- **Drill-level**: Control individual learning drills
- **Page-level**: Control entire pages/routes
- **Section-level**: Control specific page sections

## Quick Start

### 1. Admin Access
Admins (users with '@admin' in their email) can access the dashboard at:
```
/admin/feature-flags
```

### 2. Using Wrapper Components

#### Page Wrapper
```tsx
import { PageWrapper } from '@/components/shared/featureFlags';

export default function MyPage() {
  return (
    <PageWrapper pageId="my-page" pagePath="/my-page">
      <div>Your page content here</div>
    </PageWrapper>
  );
}
```

#### Signal Wrapper
```tsx
import { SignalWrapper } from '@/components/shared/featureFlags';

function SignalComponent({ signalId }: { signalId: string }) {
  return (
    <SignalWrapper signalId={signalId}>
      <div>Signal content for {signalId}</div>
    </SignalWrapper>
  );
}
```

#### Drill Wrapper
```tsx
import { DrillWrapper } from '@/components/shared/featureFlags';

function DrillComponent({ drillId }: { drillId: string }) {
  return (
    <DrillWrapper drillId={drillId}>
      <div>Drill content for {drillId}</div>
    </DrillWrapper>
  );
}
```

#### Section Wrapper
```tsx
import { SectionWrapper } from '@/components/shared/featureFlags';

function MyComponent() {
  return (
    <div>
      <SectionWrapper sectionId="hero" sectionName="Hero Section">
        <div>Hero content</div>
      </SectionWrapper>

      <SectionWrapper sectionId="pricing" sectionName="Pricing Table">
        <div>Pricing content</div>
      </SectionWrapper>
    </div>
  );
}
```

### 3. Using Hooks

#### Basic Feature Flag Check
```tsx
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

function MyComponent() {
  const { isEnabled } = useFeatureFlagContext();

  if (isEnabled('new_dashboard')) {
    return <NewDashboard />;
  }

  return <OldDashboard />;
}
```

#### Admin Management
```tsx
import { useFeatureFlagManagement } from '@/hooks/useFeatureFlags';

function AdminComponent() {
  const { createFlag, updateFlag, setScopeFlag } = useFeatureFlagManagement();

  const handleCreateFlag = async () => {
    await createFlag({
      key: 'new_feature',
      name: 'New Feature',
      description: 'Enable the new feature',
      enabled: true
    });
  };

  const handleSetSignalFlag = async (signalId: string) => {
    await setScopeFlag('flag-id', 'signal', signalId, {
      enabled: true,
      state: 'ACTIVE'
    });
  };
}
```

## Database Schema

### FeatureFlag Model
- `key`: Unique identifier for the flag
- `name`: Human-readable name
- `enabled`: Global enable/disable
- `type`: BOOLEAN, STRING, NUMBER, or JSON
- `value`: Optional value for the flag

### FeatureFlagScope Model
- `flagId`: Reference to the feature flag
- `scope`: Type of scope (signal, drill, page, section)
- `scopeId`: ID of the specific item
- `enabled`: Scope-specific enable/disable
- `state`: DRAFT, REVIEW, ACTIVE, or ARCHIVED

## Admin Dashboard Features

### Global Flag Management
- Create new feature flags
- Enable/disable existing flags
- Edit flag metadata
- Delete flags

### Scope-Specific Management
- Set flags for specific signals, drills, pages, or sections
- Control state workflow (Draft → Review → Active → Archived)
- Enable/disable per scope

### Admin Preview
- Toggle between user and admin view
- See hidden content with visual indicators
- Control panel for page-level flags

## API Endpoints

### GET /api/feature-flags
Get all feature flags or scope-specific flags
```
?scope=signal&scopeId=123 - Get flags for specific signal
?includeDisabled=true - Include disabled flags (admin only)
```

### POST /api/feature-flags
Create new feature flag (admin only)

### PUT /api/feature-flags
Update feature flag (admin only)

### DELETE /api/feature-flags
Delete feature flag (admin only)

### POST /api/feature-flags/scopes
Set scope-specific flag (admin only)

## Best Practices

### Naming Conventions
- Use snake_case for flag keys
- Prefix with scope: `signal_`, `drill_`, `page_`, `section_`
- Be descriptive: `signal_advanced_analytics`, `page_new_dashboard`

### Workflow States
1. **DRAFT**: Work in progress, not ready for review
2. **REVIEW**: Ready for stakeholder review
3. **ACTIVE**: Live and visible to users
4. **ARCHIVED**: Deprecated but kept for reference

### Admin Controls
- Admins see yellow control panels on wrapped content
- Use override toggles to preview user experience
- Visual indicators show flag status (active/inactive)

## Security

- Only users with '@admin' in email can manage flags
- Regular users only see active, enabled content
- Admin preview mode clearly distinguished from user view
- All admin actions are logged and audited

## Performance

- Flags are cached and can be refreshed on demand
- Minimal overhead for non-admin users
- Efficient database queries with proper indexing
- Optional refresh intervals for real-time updates