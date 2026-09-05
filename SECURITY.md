# Security Policy

## Supported Version

Security fixes are applied to the latest production version published from the
`master` branch.

## Reporting a Vulnerability

Please do not open a public issue for a suspected vulnerability. Use the
repository's private vulnerability reporting form instead:

https://github.com/datetoolofficial-netizen/date_tools/security/advisories/new

Include the affected URL or component, reproduction steps, expected impact,
and any supporting screenshots or logs. Do not include real user data,
credentials, API keys, or other secrets in the report.

We aim to acknowledge a report within 72 hours. Please allow time to investigate
and deploy a fix before publicly disclosing the issue.

## Scope

Reports about authentication, authorization, data exposure, file uploads,
Cloudflare Worker routes, Firebase access rules, and client-side injection are
in scope. Reports that only identify a public Firebase Web API key without a
demonstrated restriction bypass are not vulnerabilities; Firebase Web keys are
public client identifiers and are protected through domain and API restrictions.
