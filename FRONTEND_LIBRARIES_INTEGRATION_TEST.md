# Front-End Libraries Integration - Test Scenarios

## Overview
This document outlines test scenarios to verify the integration between Front-End Libraries and Design System Builder is bulletproof.

## Test Scenarios

### ✅ Happy Path - Normal Import Flow
**Steps:**
1. Navigate to Configuration → Front-End Libraries
2. Browse templates and click "Import & Customize" on any template (e.g., shadcn Admin Dashboard)
3. Should see toast: "Ready to customize {template name}!"
4. Should automatically navigate to Design System Builder
5. Design System Builder should show purple alert: "Starting from {template name}"
6. System name and description fields should be pre-filled with template data
7. User can customize tokens and generate system normally

**Expected Result:** ✅ Seamless flow from browsing to customization

---

### ✅ Edge Case - Direct Navigation to Builder
**Steps:**
1. Navigate directly to Design System Builder (without coming from Front-End Libraries)
2. Click on sidebar: Configuration → Design System Builder

**Expected Result:**
- No errors
- Shows default "Fresh Start Template" alert (not purple template alert)
- Form fields are empty
- User can use builder normally

---

### ✅ Edge Case - Multiple Imports in Same Session
**Steps:**
1. Import template A from Front-End Libraries
2. Navigate to Design System Builder (should show template A data)
3. Navigate back to Front-End Libraries
4. Import template B
5. Navigate to Design System Builder again

**Expected Result:**
- Second visit should show template B data (not template A)
- localStorage is properly cleaned up after each read
- No stale data from previous import

---

### ✅ Edge Case - Manual Template Override
**Steps:**
1. Import template from Front-End Libraries
2. Navigate to Design System Builder (should show imported template alert)
3. Click "Minimal Template" button
4. Purple alert should disappear
5. Template picker should work normally

**Expected Result:**
- Imported template indicator clears when user manually loads a template
- No confusion about which template is active

---

### ✅ Edge Case - Corrupted localStorage Data
**Steps:**
1. Manually corrupt localStorage data:
   ```javascript
   localStorage.setItem('ldl-selected-template', '{invalid json}');
   ```
2. Navigate to Design System Builder

**Expected Result:**
- No app crash
- Error logged to console
- Toast shows: "Failed to load template data - Starting with a blank template instead"
- localStorage is cleaned up
- User can continue using builder normally

---

### ✅ Edge Case - Missing Required Fields
**Steps:**
1. Manually set incomplete template data:
   ```javascript
   localStorage.setItem('ldl-selected-template', JSON.stringify({ id: 'test' }));
   ```
2. Navigate to Design System Builder

**Expected Result:**
- Invalid data is detected and cleaned up
- No errors thrown
- Builder loads with default state

---

### ✅ Edge Case - localStorage Quota Exceeded
**Steps:**
1. Fill localStorage to near quota limit
2. Try to import a template from Front-End Libraries

**Expected Result:**
- Try-catch handles the quota error
- Toast shows: "Failed to import template - Please try again or check your browser storage"
- User is notified of the issue
- No silent failure

---

### ✅ Edge Case - Hash Navigation Conflicts
**Steps:**
1. Navigate to Design System Builder via Front-End Libraries
2. Use browser back button
3. Navigate forward again

**Expected Result:**
- Hash is properly cleaned up after navigation
- No duplicate navigation events
- History works correctly

---

### ✅ Edge Case - Dev Mode Conflicts
**Steps:**
1. Open app with dev mode: `http://localhost:3001/#dev/Button`
2. Navigate to Front-End Libraries and import a template

**Expected Result:**
- Dev mode takes priority (has its own hash handler)
- Import still works when exiting dev mode
- No conflicts between hash handlers

---

### ✅ Integration - Template Metadata Preserved
**Steps:**
1. Import "shadcn Admin Dashboard" template
2. Check that all metadata is preserved:
   - id: 'shadcn-admin'
   - name: 'shadcn Admin Dashboard'
   - description: 'Modern admin dashboard...'
   - github: 'satnaing/shadcn-admin'
   - uiLibrary: 'shadcn/ui'
   - framework: 'Vite + React'
   - demoUrl: 'https://shadcn-admin.netlify.app'

**Expected Result:**
- All fields are properly stored and retrieved
- No data loss during localStorage round-trip

---

## Error Handling Checklist

- ✅ **JSON Parse Errors**: Try-catch with cleanup
- ✅ **Missing Required Fields**: Validation before use
- ✅ **localStorage Quota**: Try-catch with user feedback
- ✅ **Invalid Template Type**: Type checking before processing
- ✅ **Stale Data**: Automatic cleanup after reading
- ✅ **Hash Navigation Conflicts**: Proper event listener cleanup
- ✅ **Null/Undefined Values**: Fallback to empty strings

---

## Performance Considerations

### localStorage Operations
- **Write**: Single write operation per import (fast)
- **Read**: Single read on Design System Builder mount (fast)
- **Cleanup**: Immediate cleanup after read (prevents stale data)

### Navigation
- **Hash-based**: Instant navigation (no page reload)
- **History Management**: Clean URLs after navigation
- **Event Listeners**: Proper cleanup to prevent memory leaks

---

## Security Considerations

### XSS Prevention
- ✅ Template data is JSON stringified (not eval'd)
- ✅ No innerHTML usage
- ✅ All template data is from curated internal list

### Data Validation
- ✅ Type checking before use
- ✅ Required field validation
- ✅ Fallbacks for missing data

---

## Browser Compatibility

### localStorage Support
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Private/Incognito mode (localStorage available)
- ✅ localStorage disabled: Feature gracefully fails with error message

### Hash Navigation
- ✅ Works in all browsers
- ✅ Properly handles history API
- ✅ No conflicts with browser navigation

---

## Future Enhancements

1. **Add Loading State**: Show loading indicator during navigation
2. **Add Animation**: Smooth transition between pages
3. **Add Undo**: Allow users to revert to imported template if they load a different one
4. **Add Template History**: Track recently imported templates
5. **Add Deep Linking**: Support direct URLs like `/frontend-libraries?import=shadcn-admin`

---

## Debugging Tips

### Check localStorage State
```javascript
console.log('Template data:', localStorage.getItem('ldl-selected-template'));
```

### Clear Template Data
```javascript
localStorage.removeItem('ldl-selected-template');
```

### Simulate Import
```javascript
localStorage.setItem('ldl-selected-template', JSON.stringify({
  id: 'test',
  name: 'Test Template',
  description: 'Test description',
  github: 'test/repo',
  uiLibrary: 'shadcn/ui',
  framework: 'React',
  demoUrl: 'https://example.com'
}));
window.location.hash = '#design-system-builder';
```

---

## Known Limitations

1. **No Automatic Token Extraction**: Currently only passes metadata, not actual design tokens from GitHub
2. **Single Template at a Time**: Only one template can be "staged" for import at a time
3. **No Offline Support**: Requires internet to view demo URLs
4. **No Template Validation**: Assumes all templates in the registry are valid

---

## Changelog

### Version 1.0 (Current)
- ✅ Hash-based navigation between Front-End Libraries and Design System Builder
- ✅ localStorage-based template metadata passing
- ✅ Comprehensive error handling and validation
- ✅ Edge case protection (corrupted data, missing fields, quota exceeded)
- ✅ Clean UI indicators (purple alert for imported templates)
- ✅ Proper cleanup of localStorage and event listeners
