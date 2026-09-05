# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.x     | Yes       |

The latest published minor in the active major line is the supported line;
older minors are supported for security fixes for 90 days after the next
minor ships (see GOVERNANCE.md Release Policy).

## Reporting a Vulnerability

Please do not report security vulnerabilities in public issues.

Preferred path:

1. Use GitHub private vulnerability reporting or a private security advisory, if enabled for the repository.
2. If private reporting is unavailable, contact the repository owner through GitHub at https://github.com/pixu1980 and clearly mark the report as a security issue.

Include:

- a description of the issue
- reproduction steps or a proof of concept
- impact assessment
- any suggested mitigation

## Scope

All published `@pix-galaxy/*` npm packages, the component portal, and the
build toolchain (release flows, CI workflows, dependency supply chain).
Dependency and supply-chain reports (Dependabot, `pnpm audit`) are triaged
under the same response targets.

## Response Targets

- Initial acknowledgement: within 3 business days.
- Triage decision: within 10 business days.
- Coordinated remediation target: within 90 days when feasible.

We will credit reporters who want public acknowledgement after a fix is available.
