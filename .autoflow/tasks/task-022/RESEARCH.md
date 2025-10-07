# Research: Settings Persistence (localStorage)

**Task ID**: task-022
**Title**: Settings Persistence (localStorage)

---

## localStorage API Overview

### What is localStorage?

`localStorage` is a browser-native Web Storage API that allows web applications to store key-value pairs in a user's browser persistently (data survives page reloads and browser restarts).

### Key Characteristics

- **Capacity**: ~5-10MB per origin (varies by browser)
- **Persistence**: Data persists indefinitely (until explicitly deleted)
- **Scope**: Per origin (protocol + domain + port)
- **Synchronous**: Blocking API (reads/writes are synchronous)
- **Simple**: Key-value string storage (requires JSON serialization for objects)

### Browser Support

| Browser | Version | localStorage Support |
|---------|---------|---------------------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |

**Conclusion**: localStorage is universally supported in all target browsers ✅

---

## localStorage API Methods

### Basic Operations

```typescript
// Set item (key-value)
localStorage.setItem('key', 'value');

// Get item
const value = localStorage.getItem('key'); // Returns string | null

// Remove item
localStorage.removeItem('key');

// Clear all items
localStorage.clear();

// Get number of items
const count = localStorage.length;

// Get key by index
const key = localStorage.key(0);
```

### Working with Objects

```typescript
// Save object (requires serialization)
const data = { brightness: 10, contrast: 5 };
localStorage.setItem('settings', JSON.stringify(data));

// Load object (requires parsing)
const saved = localStorage.getItem('settings');
if (saved) {
  const data = JSON.parse(saved); // May throw if invalid JSON
}
```

---

## Best Practices for localStorage

### 1. Error Handling

**Why**: localStorage can fail in multiple scenarios

**Failure Scenarios**:
- **Private/Incognito Mode**: Some browsers disable or limit localStorage
- **Quota Exceeded**: Storage limit reached (rare for small data)
- **Browser Settings**: User may have disabled storage
- **Security Policy**: CSP or browser policy may block access

**Pattern**:
```typescript
function saveToLocalStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    // Log error for debugging
    console.error('Failed to save to localStorage:', error);

    // Don't throw - graceful degradation
    return false;
  }
}

function loadFromLocalStorage<T>(key: string): T | null {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;

    return JSON.parse(saved) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}
```

**Best Practice**: NEVER throw errors from localStorage operations. Always return null/undefined on failure.

---

### 2. Data Validation

**Why**: localStorage data can be manipulated by users or corrupted

**Attack Vectors**:
- User editing localStorage via DevTools
- Malicious browser extensions
- Data corruption (disk failure, browser bugs)
- Schema changes (app updates)

**Pattern**:
```typescript
interface PersistedSettings {
  brightness: number;
  contrast: number;
  threshold: number;
  preset: string;
  version: number;
}

function isValidPersistedSettings(data: unknown): data is PersistedSettings {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  // Check all required fields exist and have correct types
  if (typeof obj.brightness !== 'number') return false;
  if (typeof obj.contrast !== 'number') return false;
  if (typeof obj.threshold !== 'number') return false;
  if (typeof obj.preset !== 'string') return false;
  if (typeof obj.version !== 'number') return false;

  // Check value ranges
  if (obj.brightness < -100 || obj.brightness > 100) return false;
  if (obj.contrast < -100 || obj.contrast > 100) return false;
  if (obj.threshold < -50 || obj.threshold > 50) return false;

  // Check for NaN, Infinity
  if (!Number.isFinite(obj.brightness)) return false;
  if (!Number.isFinite(obj.contrast)) return false;
  if (!Number.isFinite(obj.threshold)) return false;

  return true;
}

function loadSettings(): PersistedSettings | null {
  try {
    const saved = localStorage.getItem('craftyprep-settings');
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // CRITICAL: Validate before using
    if (isValidPersistedSettings(parsed)) {
      return parsed;
    } else {
      // Invalid data - clear it
      console.warn('Invalid settings data, clearing localStorage');
      localStorage.removeItem('craftyprep-settings');
      return null;
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
}
```

**Best Practice**: ALWAYS validate localStorage data before using it. Never trust client-side storage.

---

### 3. Debouncing Writes

**Why**: Writing to localStorage is synchronous and can block the main thread

**Problem**: Saving on every slider pixel change (100+ writes per second) → Performance issues

**Solution**: Debounce writes (wait for user to stop adjusting before saving)

**Pattern**:
```typescript
import { useEffect, useRef } from 'react';

function useSettingsPersistence(settings: Settings): void {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    // Debounce: Wait 500ms after last change before saving
    timeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem('settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }, 500);

    // Cleanup: Clear timeout on unmount
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [settings]);
}
```

**Best Practice**: Debounce writes by 300-500ms for optimal UX and performance balance.

**Existing Implementation**: `/opt/workspaces/craftyprep.com/src/hooks/useCustomPresetPersistence.ts` already uses this pattern ✅

---

### 4. Storage Keys Naming Convention

**Why**: Avoid key collisions with other apps on same domain

**Bad Practices**:
- Generic keys: `settings`, `data`, `state`
- No namespacing

**Good Practices**:
- App-prefixed keys: `craftyprep-settings`, `craftyprep-custom-preset`
- Versioned keys: `craftyprep-settings-v1`, `craftyprep-settings-v2`
- Namespaced: `app:craftyprep:settings`

**Pattern for This Project**:
```typescript
const STORAGE_KEY = 'craftyprep-settings';
const CUSTOM_PRESET_KEY = 'craftyprep-custom-preset'; // Existing key
```

**Best Practice**: Use app-prefixed keys with descriptive names.

---

### 5. Schema Versioning

**Why**: Future-proof for app updates and schema changes

**Problem**: You add a new setting field → Old localStorage data is missing that field

**Solution**: Version your schema and handle migrations

**Pattern**:
```typescript
interface PersistedSettingsV1 {
  brightness: number;
  contrast: number;
  threshold: number;
  preset: string;
  version: 1;
}

interface PersistedSettingsV2 {
  brightness: number;
  contrast: number;
  threshold: number;
  preset: string;
  rotation: number; // New field in v2
  version: 2;
}

type PersistedSettings = PersistedSettingsV2;

function migrateSettings(data: unknown): PersistedSettings | null {
  if (!data || typeof data !== 'object') return null;

  const obj = data as Record<string, unknown>;

  // Detect version
  if (obj.version === 1) {
    // Migrate v1 to v2
    return {
      brightness: obj.brightness as number,
      contrast: obj.contrast as number,
      threshold: obj.threshold as number,
      preset: obj.preset as string,
      rotation: 0, // Default for new field
      version: 2,
    };
  } else if (obj.version === 2) {
    // Already v2
    return obj as PersistedSettings;
  } else {
    // Unknown version - reject
    return null;
  }
}
```

**Best Practice**: Include a `version` field in your schema from day 1.

---

### 6. Privacy and Security

#### What NOT to Store

❌ **Never store**:
- Passwords or credentials
- API keys or tokens
- Personally identifiable information (PII)
- Uploaded images (binary data)
- User session data
- Payment information

✅ **Safe to store**:
- UI preferences (theme, language)
- Application settings (brightness, contrast)
- Non-sensitive configuration
- Feature flags

#### Privacy Best Practices

1. **Transparency**: Inform users what is stored (privacy disclosure)
2. **Minimal Data**: Store only what's necessary
3. **User Control**: Provide a way to clear stored data
4. **No Tracking**: Don't store analytics or tracking data

**For This Project**:
```typescript
interface PersistedSettings {
  // ✅ Safe: UI settings only
  brightness: number;
  contrast: number;
  threshold: number;
  preset: 'auto' | 'wood' | 'leather' | 'acrylic' | 'glass' | 'metal' | 'custom';
  version: number;

  // ❌ NOT included: filename, image data, timestamps, user info
}
```

---

### 7. Testing localStorage

#### Mocking in Unit Tests

**Problem**: localStorage is a global browser API, needs mocking in tests

**Solution**: Mock localStorage in test setup

**Pattern (Vitest)**:
```typescript
import { beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

beforeEach(() => {
  // Replace global localStorage with mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  // Clear before each test
  localStorage.clear();
});

afterEach(() => {
  // Clean up
  localStorage.clear();
});
```

**Testing localStorage Failures**:
```typescript
test('handles localStorage unavailable', () => {
  // Simulate localStorage failure
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = vi.fn(() => {
    throw new Error('QuotaExceededError');
  });

  // Test that app handles error gracefully
  const result = saveSettings({ brightness: 10, contrast: 5 });
  expect(result).toBe(false); // Should return false, not throw

  // Restore
  localStorage.setItem = originalSetItem;
});
```

#### E2E Testing with localStorage

**Playwright Pattern**:
```typescript
test('settings persist across page reloads', async ({ page }) => {
  // Visit app
  await page.goto('https://craftyprep.demosrv.uk');

  // Adjust settings
  await page.getByLabel('Brightness').fill('20');
  await page.getByLabel('Contrast').fill('10');

  // Wait for debounce
  await page.waitForTimeout(600);

  // Reload page
  await page.reload();

  // Verify settings restored
  const brightness = await page.getByLabel('Brightness').inputValue();
  expect(brightness).toBe('20');

  const contrast = await page.getByLabel('Contrast').inputValue();
  expect(contrast).toBe('10');
});

test('app works with localStorage disabled', async ({ page, context }) => {
  // Disable localStorage
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => { throw new Error('localStorage disabled'); },
        setItem: () => { throw new Error('localStorage disabled'); },
        removeItem: () => { throw new Error('localStorage disabled'); },
      },
      writable: false,
    });
  });

  // Visit app
  await page.goto('https://craftyprep.demosrv.uk');

  // Verify app loads without errors
  await page.waitForSelector('h1');

  // Verify sliders work
  await page.getByLabel('Brightness').fill('20');
  // Should work, just not persist
});
```

---

## Performance Considerations

### 1. localStorage is Synchronous

**Impact**: Blocks the main thread during read/write operations

**Best Practices**:
- **Minimize writes**: Debounce (500ms)
- **Read once on mount**: Don't repeatedly read from localStorage
- **Keep data small**: Serialize only necessary fields
- **Avoid large objects**: localStorage is for small data (<1MB ideal)

### 2. JSON Serialization/Parsing Overhead

**Impact**: `JSON.stringify()` and `JSON.parse()` have performance cost

**Best Practices**:
- **Small objects**: Keep serialized data <10KB
- **Flat structure**: Avoid deeply nested objects
- **No binary data**: Don't store images or large blobs

**For This Project**:
```typescript
interface PersistedSettings {
  brightness: number;    // 8 bytes
  contrast: number;      // 8 bytes
  threshold: number;     // 8 bytes
  preset: string;        // ~10 bytes
  version: number;       // 8 bytes
}
// Total: ~50 bytes → Serialized: ~100 bytes → Negligible overhead ✅
```

### 3. Storage Event (Multiple Tabs)

**localStorage changes trigger `storage` event in other tabs**

**Use Case**: Sync settings across tabs (optional enhancement)

**Pattern**:
```typescript
useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'craftyprep-settings' && event.newValue) {
      try {
        const settings = JSON.parse(event.newValue);
        if (isValidPersistedSettings(settings)) {
          // Apply settings from other tab
          applySettings(settings);
        }
      } catch (error) {
        console.error('Failed to sync settings:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);
```

**Note**: NOT in scope for this task, but useful for future enhancement.

---

## Alternative Storage APIs (Not Used)

### sessionStorage

**Difference**: Data cleared when tab/window closes

**Use Case**: Temporary data (current session only)

**Not Used**: We want persistence across sessions ❌

### IndexedDB

**Difference**: Asynchronous, larger capacity (>50MB), structured data

**Use Case**: Large amounts of structured data, offline apps

**Not Used**: Overkill for small settings object ❌

### Cookies

**Difference**: Sent with every HTTP request, smaller capacity (4KB)

**Use Case**: Server-side session management, authentication

**Not Used**: No server in this app, unnecessary overhead ❌

### Web SQL

**Status**: Deprecated ❌

**Not Used**: Deprecated, don't use

---

## Security Considerations

### XSS (Cross-Site Scripting)

**Risk**: Malicious script could read localStorage

**Mitigation**:
- Don't store sensitive data (we don't ✅)
- Validate and sanitize all data before using
- Use Content Security Policy (CSP) headers

**For This Project**:
- No sensitive data stored ✅
- All data validated before use ✅
- CSP headers configured in nginx ✅

### CSRF (Cross-Site Request Forgery)

**Risk**: Not applicable (localStorage is client-side only)

**Mitigation**: N/A ✅

### Data Tampering

**Risk**: User can modify localStorage via DevTools

**Mitigation**:
- Validate all data before use ✅
- Don't trust client-side data for security decisions ✅
- This is a client-side-only app, so tampering only affects user ✅

---

## Existing Implementation Analysis

### useCustomPresetPersistence.ts

**Location**: `/opt/workspaces/craftyprep.com/src/hooks/useCustomPresetPersistence.ts`

**What It Does**:
- Saves custom preset values (brightness, contrast, threshold adjustments)
- Uses debounced writes (500ms)
- Validates data before saving
- Handles localStorage errors gracefully

**Strengths**:
- ✅ Good error handling
- ✅ Debouncing implemented
- ✅ Validation logic
- ✅ Clear separation of concerns

**Limitations**:
- ❌ Only saves custom preset (not preset selection)
- ❌ No restoration logic
- ❌ No UI for clearing

**Reuse Opportunities**:
- Debouncing pattern ✅
- Error handling pattern ✅
- Validation approach ✅

---

## Recommendations for Implementation

### 1. Reuse Existing Patterns

**From useCustomPresetPersistence**:
- Debouncing with useRef and setTimeout
- Error handling (try/catch with console.error)
- Validation before saving

**From presetValidation**:
- Type guards (`isValidCustomPreset` → `isValidPersistedSettings`)
- Safe loading with null return on failure
- Clear localStorage on invalid data

### 2. Create Separate Utilities

**Storage utilities** (`settingsStorage.ts`):
- `saveSettings()` - Serialization + saving
- `loadSettings()` - Loading + validation + parsing
- `clearSettings()` - Removal
- `isValidPersistedSettings()` - Type guard

**Hooks**:
- `useSettingsPersistence` - Auto-save (debounced)
- `useInitialSettings` - Restore on mount

**Rationale**: Separation of concerns, testability

### 3. TDD Approach

**Order**:
1. Write tests for storage utilities
2. Implement storage utilities
3. Write tests for hooks
4. Implement hooks
5. Write tests for components
6. Implement components
7. Integration tests
8. E2E tests

**Benefit**: Catch errors early, clear requirements, confidence in changes

---

## Key Takeaways

1. **localStorage is simple and well-supported** ✅
2. **Always wrap in try/catch** (graceful degradation)
3. **Always validate data** (never trust client-side storage)
4. **Debounce writes** (performance optimization)
5. **Version your schema** (future-proofing)
6. **Don't store sensitive data** (privacy and security)
7. **Test edge cases** (localStorage disabled, quota exceeded, corrupted data)
8. **Keep data small** (localStorage is for small settings, not large data)

---

## References

### MDN Web Docs
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)

### Existing Code
- `/opt/workspaces/craftyprep.com/src/hooks/useCustomPresetPersistence.ts`
- `/opt/workspaces/craftyprep.com/src/lib/utils/presetValidation.ts`
- `/opt/workspaces/craftyprep.com/src/hooks/useHistory.ts`

### Testing Patterns
- `/opt/workspaces/craftyprep.com/src/tests/unit/hooks/useHistory.test.ts`

---

## Conclusion

localStorage is the right choice for this feature:
- ✅ Simple API
- ✅ Universal browser support
- ✅ Sufficient capacity (~5MB >> our ~100 bytes)
- ✅ Persistence across sessions
- ✅ No backend required (privacy-focused)
- ✅ Existing patterns in codebase to follow

With proper error handling, validation, and testing, localStorage will provide a robust, performant solution for settings persistence.
