# ADR-008: `ElementInternals` for form association

## Status

Accepted

## Context

Custom elements should participate in native HTML forms.

## Decision

Use the `ElementInternals` API (`static formAssociated = true`, `attachInternals()`, `setFormValue()`).

## Rationale

- Form data submission without hidden inputs
- Native validation API (`setValidity()`)
- Works with `<form>` elements

## Consequences

- Only pix-color and pix-sortable currently implement it
- JSDOM doesn't fully support `setFormValue` - guarded with `typeof` check
- Form-associated elements must call `attachInternals()` - legacy components declare it but don't call it yet

## Tags

web-components, forms
