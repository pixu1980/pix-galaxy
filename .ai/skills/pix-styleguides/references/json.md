# JSON Style Guide and Standards

## Purpose

* JSON is a data interchange format, not a place for logic or comments.
* Keep JSON predictable, stable, and easy to diff in code reviews.

## Validity rules

* JSON must be valid JSON, no trailing commas.
* Use double quotes for all strings and property names.
* Allowed value types: object, array, string, number, boolean, null.
* Do not use `undefined`, functions, dates, or NaN/Infinity. Represent missing values with `null` or omit the key.

## Structure and consistency

* Keep a consistent shape for the same concept across the codebase.
* Prefer stable ordering of keys inside objects to reduce diff noise.
* Use arrays for ordered collections, use objects for keyed lookups.
* Avoid deeply nested structures unless they are required by the domain.

## Naming conventions

* Use `camelCase` for keys by default.
* Use consistent suffixes and prefixes when meaningful, for example `Id`, `At`, `Url`, `isX`, `hasX`.
* Use plural names for arrays, singular for single objects.
* Do not encode types in names unless it improves clarity across the codebase.

## Numbers, precision, and units

* Do not store ambiguous numbers. Include units via naming or structure.

  * ok: `timeoutMs`, `sizeRem`, `angleDeg`
  * ok: `{ "value": 350, "unit": "ms" }` when multiple units are possible
* Avoid floating point for money. Store currency amounts as integer minor units plus currency code.

  * ok: `{ "amountMinor": 1299, "currency": "EUR" }`
* Avoid mixing numeric strings and numbers for the same field across the app.

## Dates and time

* Store timestamps as ISO 8601 strings in UTC when possible.

  * ok: `"2026-01-19T10:15:00Z"`
* If a timezone matters, include it explicitly.
* Do not store locale formatted dates.

## Booleans and nulls

* Use booleans for flags, do not use `"true"` or `"false"` strings.
* Use `null` only when "known empty" is meaningful.
* Prefer omitting optional fields over writing `null` everywhere, unless consumers rely on explicit nulls.

## Schema mindset

* When a JSON file represents a contract, define a schema and follow it strictly.
* Prefer explicit versioning for long lived formats.

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-01-19T10:15:00Z",
  "items": []
}
```

## Formatting rules

* Use 2-space indentation.
* Newline at end of file.
* One property per line.
* Keep lines reasonably short for diffs, wrap only by moving nested objects or arrays to their own lines.

## Ordering guideline for object keys

When not constrained by an external spec, prefer this order:

1. identity and version fields: `id`, `type`, `schemaVersion`
2. metadata: `name`, `title`, `description`
3. core content fields
4. configuration and options
5. computed or derived fields
6. timestamps: `createdAt`, `updatedAt`
7. extensibility buckets: `meta`, `extras`

## Examples

### Good: consistent, typed, unit safe

```json
{
  "id": "btn_primary",
  "name": "Primary Button",
  "isEnabled": true,
  "timeoutMs": 350,
  "createdAt": "2026-01-19T10:15:00Z",
  "tags": ["ui", "button"]
}
```

### Avoid: invalid JSON and ambiguous values

```json
{
  // comments are not allowed in JSON
  "timeout": "350", 
  "enabled": "true",
  "price": 12.99,
}
```

## Tooling and enforcement

* Always format JSON with a formatter on save.
* Validate JSON in CI to prevent broken files from landing in the repo.

## Contract evolution

* Introduce `schemaVersion` for long-lived documents.
* Prefer additive changes for backward compatibility.
* Deprecate keys in phases instead of abrupt removal.

Example:

```json
{
  "schemaVersion": 2,
  "id": "component_tokens",
  "name": "Component tokens",
  "tokens": [],
  "meta": {
    "deprecatedKeys": ["legacyColor"]
  }
}
```

## API payload consistency example

Good:

```json
{
  "id": "usr_001",
  "isActive": true,
  "createdAt": "2026-04-30T10:00:00Z",
  "profile": {
    "displayName": "Ada"
  }
}
```

Avoid mixed types for same key across payloads:

```json
{
  "id": 1,
  "isActive": "true"
}
```

## Numeric and money pattern

Preferred money representation:

```json
{
  "amountMinor": 2599,
  "currency": "EUR"
}
```

Avoid floating-point money in contracts:

```json
{
  "amount": 25.99,
  "currency": "EUR"
}
```

## Review checklist example

1. JSON is valid (no comments, no trailing commas).
2. Types are stable and predictable.
3. Units are explicit for numeric fields.
4. Dates are ISO UTC strings.
5. Optionality strategy is consistent (`null` vs omitted keys).
