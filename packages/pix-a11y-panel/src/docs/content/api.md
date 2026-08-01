# API

## Exports

- `PixA11yPanel` - Component class (extends `HTMLElement`)
- `DEFAULT_PREFERENCES` - Default preference values
- `STORAGE_KEY` - The `localStorage` key used for persistence
- `ACCESSIBILITY_OPTIONS` - Array of accessibility toggle definitions
- `RADIUS_PRESET_OPTIONS` - Array of corner radius preset definitions
- `FONT_SCALE_OPTIONS` - Array of font scale percentage options
- `HEADING_FONT_OPTIONS` - Array of heading font options
- `BODY_FONT_OPTIONS` - Array of body font options
- `CODE_FONT_OPTIONS` - Array of code font options
- `readPreferences()` - Read saved preferences from localStorage
- `applyPreferencesToDocument(prefs)` - Apply preferences to the document

## Component class: `PixA11yPanel`

### Properties

| Property      | Type                 | Description                      |
| ------------- | -------------------- | -------------------------------- |
| `preferences` | `A11yPanelPreferences` | The currently active preferences (alias `DisplayPreferences` deprecated) |

### Methods

| Method                          | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| `updatePreference(name, value)` | Update a single preference and apply it to the document |
| `isOpen()`                      | Check whether the popover panel is currently open       |

### Static Methods

| Method                    | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `ensureComponentStyles()` | Ensure component CSS is adopted in the document |

## Example

```js
import {
  PixA11yPanel,
  DEFAULT_PREFERENCES,
  STORAGE_KEY,
  readPreferences,
  applyPreferencesToDocument,
} from '@pix-galaxy/pix-a11y-panel';

// Read saved preferences
const prefs = readPreferences();
console.log(prefs.fontScale); // '100%'

// Apply defaults programmatically
applyPreferencesToDocument(DEFAULT_PREFERENCES);

// Update a preference via the component
const el = document.querySelector('pix-a11y-panel');
el.updatePreference('reduceMotion', true);
```
