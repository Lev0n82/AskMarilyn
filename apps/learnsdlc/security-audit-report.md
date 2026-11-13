# Security Audit Report: learnsdlc.org Corporate Firewall Block

**Date:** May 13, 2026  
**Domain:** learnsdlc.org  
**Purpose:** Identify red flags that may cause corporate security filters to block the site

---

## Executive Summary

After a thorough audit of the site's HTTP headers, external resource dependencies, JavaScript bundle content, and domain reputation, I identified **seven potential red flags** that could trigger corporate web filters. The most likely culprits are the **manuscdn.com CDN reputation issue** (a known, documented problem affecting all Manus-hosted sites) and the **SQL injection educational content** containing literal attack payloads in the JavaScript bundle.

---

## Red Flags by Severity

### 1. manuscdn.com CDN Flagged as Compromised (CRITICAL)

This is the **most likely cause** of the block. The site loads images and assets from `files.manuscdn.com` and `private-us-east-1.manuscdn.com`. These domains have been **actively flagged** by multiple security vendors.

| Evidence Source | Status |
|---|---|
| Google Ads | Rejects sites with manuscdn.com as "Compromised Site" |
| Malwarebytes | Flags manuscdn.com as malicious |
| Email security filters | Quarantine emails containing manuscdn.com references |
| ScamAdviser | Notes hidden WHOIS ownership |
| Reddit community reports | Multiple users report identical blocking issues since Jan 2026 |

This is a **shared infrastructure problem**: because manuscdn.com is a shared CDN used by all Manus-hosted sites, if any site on the platform was flagged for violations, the entire CDN domain gets tainted in security databases. The site currently loads content from these affected domains:

- `files.manuscdn.com` (OG meta images, course card images)
- `private-us-east-1.manuscdn.com` (hero images, course illustrations with signed URLs)
- `d2xsxph8kpxj0f.cloudfront.net` (CMake infographic images via CloudFront)

### 2. manus-analytics.com Tracking Script (HIGH)

The site loads an external analytics script from `https://manus-analytics.com/umami`. Corporate web filters routinely block unknown or uncategorized analytics/tracking domains. Unlike well-known analytics providers (Google Analytics, Plausible, etc.), `manus-analytics.com` is unlikely to be whitelisted in corporate filter databases, and may be categorized as "tracking" or simply "uncategorized" — both of which trigger blocks in strict corporate environments.

### 3. SQL Injection Course Content with Live Payloads (HIGH)

The JavaScript bundle contains **literal SQL injection payloads** and security-related keywords that Data Loss Prevention (DLP) and content inspection systems actively scan for:

| Pattern | Count in JS Bundle |
|---|---|
| `inject` / `Inject` | 147 occurrences |
| `hack` / `HACK` | 20 occurrences |
| `attack` | 12 occurrences |
| `sql-injection` / `SQL Injection` | 11 occurrences |
| `XSS` | 2 occurrences |
| `bypass` / `Bypass` | 5 occurrences |
| `brute-force` / `Brute Force` | 4 occurrences |

The bundle also contains actual exploit strings like `' OR '1'='1'`, `UNION SELECT`, and `DROP TABLE`, along with an interactive SQL injection simulator that displays "SUCCESS: Authentication Bypass" messages. Corporate deep packet inspection (DPI) systems and next-gen firewalls (like Palo Alto, Zscaler, or Fortinet) scan HTTPS-decrypted traffic for exactly these patterns and may classify the site as a **hacking tool** or **security threat**.

### 4. CloudFront Signed URLs with Suspicious Parameters (MEDIUM)

Images served via the `/manus-storage/` proxy redirect to CloudFront signed URLs containing very long `Signature`, `Policy`, and `Key-Pair-Id` query parameters with base64-encoded content. These URLs can exceed 500 characters and resemble the obfuscated URLs commonly used in phishing campaigns. URL reputation scanners may flag these as suspicious.

### 5. Missing Security Headers (MEDIUM)

The site is missing several security headers that corporate security scanners check for:

| Header | Status | Impact |
|---|---|---|
| Content-Security-Policy | Missing | No restriction on script/resource origins |
| X-Frame-Options | Missing | Site can be embedded in iframes (clickjacking risk) |
| Referrer-Policy | Missing | Full referrer sent to external domains |
| Permissions-Policy | Missing | No restriction on browser features |
| X-Content-Type-Options | Present | Prevents MIME sniffing |
| Strict-Transport-Security | Present | Forces HTTPS |

While missing headers alone rarely cause blocks, they lower the site's security score in automated assessments, which can push it below a corporate filter's threshold.

### 6. Multiple External Domains (LOW)

The site connects to 6+ external domains at runtime, which increases the attack surface from a corporate security perspective:

| Domain | Purpose | Risk Level |
|---|---|---|
| fonts.googleapis.com / fonts.gstatic.com | Google Fonts | Low (usually whitelisted) |
| manus-analytics.com | Analytics tracking | High (unknown/uncategorized) |
| files.manuscdn.com | Image CDN | Critical (flagged as compromised) |
| private-us-east-1.manuscdn.com | Signed image CDN | Critical (flagged) |
| d2xsxph8kpxj0f.cloudfront.net | CloudFront CDN | Medium (generic CloudFront) |
| d36hbw14aib5lz.cloudfront.net | Storage proxy redirect | Medium (generic CloudFront) |

### 7. OAuth Login to External Domain (LOW)

The login flow redirects users to `manus.im` for OAuth authentication. Corporate filters may block this as an unrecognized SSO provider, especially if `manus.im` itself is not whitelisted in the organization's security policy.

---

## Recommendations

### Immediate Actions (to unblock the site)

1. **Request IT/Security to whitelist `learnsdlc.org`** — Ask the corporate security team to add the custom domain to their allowlist. Since it is a custom domain (not `*.manus.space`), it should be easier to justify.

2. **Request whitelisting of CDN domains** — Provide IT with the specific domains needed: `files.manuscdn.com`, `private-us-east-1.manuscdn.com`, `d2xsxph8kpxj0f.cloudfront.net`, and `manus-analytics.com`.

3. **Check the block reason** — Ask the corporate security team for the specific block category (e.g., "malware", "uncategorized", "hacking tools", "compromised"). This will confirm which red flag triggered the block.

### Medium-Term Mitigations (code changes)

4. **Move SQL Injection course to lazy-loaded chunks** — Currently all course content is bundled into a single JS file. Code-splitting the SQL Injection Masterclass into a separate lazy-loaded chunk would prevent its payloads from appearing in the initial page scan.

5. **Self-host images instead of using manuscdn.com** — Re-upload critical images to a reputable CDN (e.g., Cloudflare R2, AWS S3 with a custom CloudFront distribution under your own domain) to avoid the manuscdn.com reputation issue.

6. **Add security headers** — Configure CSP, X-Frame-Options, Referrer-Policy, and Permissions-Policy headers to improve the site's security posture score.

### Long-Term Considerations

7. **Consider self-hosting** — Given the known and ongoing reputation issues with Manus infrastructure domains, hosting the site on your own infrastructure (or a well-known hosting provider) would eliminate the shared-CDN reputation risk entirely.

8. **Submit domain for categorization** — Submit `learnsdlc.org` to major web filter vendors (Zscaler, Palo Alto, Fortinet, Symantec/Broadcom) for proper categorization as "Education/Training" rather than leaving it uncategorized.
