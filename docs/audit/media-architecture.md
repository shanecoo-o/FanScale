# Media architecture audit

## Current media inventory

The prototype treats media primarily as direct remote URLs. This is suitable for visual fixtures but does not model upload, processing, ownership, access, deletion, or delivery security.

| Media class | Current representation/consumer | Current gap | Required production treatment |
|---|---|---|---|
| User/creator avatar | URL rendered across Header, profiles, cards, messages, notifications | No intrinsic dimensions, fallback policy, ownership, or processing state | Public thumbnail renditions, stable asset ID, fallback initials, moderation and deletion behavior |
| Creator cover | URL in creator profile | Direct remote origin and no art-direction variants | Responsive cover renditions with focal point/crop metadata |
| Post images/gallery | `Post.mediaUrls[]` in PostCard/profile/feed | URLs arrive before entitlement enforcement; no dimensions or rendition metadata | Ordered media attachments with blur placeholder, dimensions, responsive renditions, processing/access state |
| Post video | `mediaType` can be video, but no `<video>` player exists | Type suggests capability that UI cannot play or secure | Transcoded HLS/DASH renditions, poster, captions, duration, playback authorization, analytics |
| Story media | `Story.mediaUrl` in reel/viewer | No expiry, prefetch policy, view receipt, or protected delivery | Expiring story resource with poster/renditions, ordered navigation, view event, and access token |
| Live media | `LiveSession` plus modal presentation | No stream key, playback token, latency/state, recording, or moderation model | Provider abstraction for ingest/playback, short-lived credentials, lifecycle webhooks, recording policy |
| Message attachment | Optional message media URL | No upload scan, conversation authorization, expiry, or attachment metadata | Conversation-scoped attachment asset, malware scan, safe preview, short-lived download/playback access |
| KYC document/selfie | URL fields in type; UI uses boolean upload flags | Sensitive document pipeline is simulated | Separate restricted storage/account, provider tokenization, encryption, redacted preview, strict retention and access logs |
| PPV/subscriber media | Same URLs as public fixture media plus local `isUnlocked` | Client already possesses the protected location | Server entitlement check before issuing a short-lived rendition/playback credential |
| Thumbnails/posters | Not modeled separately | Full source may be downloaded for compact cards | Generated AVIF/WebP/JPEG thumbnails and video posters selected through `srcset`/`sizes` |
| Watermark/provenance | Not modeled | No leak deterrence or content provenance | Optional viewer/session watermark for high-risk content plus asset audit metadata; do not treat watermarking as access control |

## Proposed resource model

This is an API-oriented mapping, not a database schema.

| Resource | Purpose | Key client-visible fields | Restricted/server-only fields |
|---|---|---|---|
| `MediaAsset` | Stable logical asset owned by a user/resource | ID, kind, lifecycle state, width, height, duration, aspect ratio, alt/caption, created time | Origin bucket/key, scan findings, provider internals, encryption material |
| `MediaAttachment` | Ordered relationship between asset and post/story/message/profile/KYC case | Resource reference, asset ID, order, display role, focal point | Ownership authorization evidence |
| `MediaRendition` | Processed file appropriate for delivery | Kind, codec/format, width/height/bitrate, byte size, delivery handle/expiry | Origin location, signing secret, internal job references |
| `UploadIntent` | Short-lived permission to upload a constrained object | Intent ID, allowed size/type, upload target, expiry, required headers | Storage credentials, risk/rate-limit decision |
| `MediaProcessingJob` | Scan, metadata strip, image transform, transcode, caption, poster | Safe lifecycle/status projection and retryable failure code | Worker trace, raw scanner output, provider credentials |
| `MediaAccessGrant` | Short-lived viewer permission for a specific rendition set | Delivery URL/token, expiry, playback policy | Entitlement decision inputs, signing keys, fraud signals |

Suggested lifecycle: `intent_created → uploaded → quarantined → scanning → processing → ready → blocked|failed → deleted`. Only `ready` assets may be attached to published content. A failed or blocked asset exposes a safe reason code, not internal scanner details.

## Upload flow

1. Authenticated client requests an upload intent with purpose, expected type/size, and parent resource context.
2. API authorizes ownership, account/KYC state where applicable, quota, rate limits, and allowed media policy.
3. Client uploads directly to a quarantine location using the short-lived intent and reports completion by intent ID.
4. Worker verifies actual bytes, type, dimensions/duration, strips unsafe metadata, scans malware, and generates renditions/posters.
5. API marks the asset ready and returns sanitized metadata; the client may then attach/publish it through a separate authorized mutation.
6. Publication triggers moderation workflows as required. Deletion removes access immediately and schedules origin/rendition cleanup according to retention/legal-hold policy.

The client must support progress, cancellation, offline/retry, expired intent, type/size rejection, scan failure, processing delay, and partial batch failure. It must never mark an upload complete from a local boolean.

## Delivery and entitlement flow

Public thumbnails may use CDN-cacheable immutable rendition URLs. Private, subscriber, PPV, message, live, and KYC assets require an authenticated authorization request. The API checks resource visibility, account state, ownership/membership, subscription/PPV entitlement, region, and moderation status, then issues a short-lived URL or playback token scoped to the minimum rendition set. Origin storage stays private.

For paid media, metadata responses may reveal a safe locked preview, price offer/version, and dimensions, but not an origin key or reusable protected URL. Cache keys must separate public and authorized responses. Revocation, refund, chargeback, subscription expiry, moderation takedown, and account suspension must stop new grants; expiry limits already issued access.

KYC delivery is separate from creator content delivery: no public CDN, no broad support access, short expiry, strong audit logging, redaction where possible, and no browser caching.

## Responsive frontend media primitive

The proposed `Media` component should accept asset/rendition metadata rather than a bare URL. It owns intrinsic aspect ratio, `width`/`height`, `srcset`, `sizes`, eager loading only for the measured LCP candidate, lazy loading elsewhere, decode strategy, placeholder, object fit/position, failure recovery, alt/caption policy, entitlement placeholder, and reduced-data behavior. `VideoPlayer` adds poster, captions, keyboard controls, volume state, full-screen/Picture-in-Picture policy, bandwidth adaptation, and playback-token renewal.

## Operational requirements

- Per-purpose size/type/duration limits and quotas.
- Idempotent completion and processing jobs with dead-letter/retry policy.
- Object inventory reconciliation and orphan cleanup.
- CDN purge/revocation procedure and takedown SLA.
- Moderation signals, hash matching where lawful, and appeal/evidence retention.
- Metrics for upload success, processing latency/failure, playback startup/rebuffering, authorization denial, egress, and storage growth.
- Synthetic tests proving public availability and private/paid/KYC denial.
- Backups and deletion workflows aligned with privacy, accounting, and legal retention policies.

