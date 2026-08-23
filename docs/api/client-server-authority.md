# Client and server authority

The browser is an untrusted presentation and request client. It may display server projections and optimistically present only reversible, non-sensitive interactions. It cannot create identity, financial, access, KYC, moderation, or administrative authority.

| Domain | Client may request | Client may display | Server must calculate | Server must authorize | Server must persist | Server must audit |
| --- | --- | --- | --- | --- | --- | --- |
| Roles | registration/account-type request | granted role labels and allowed UI | effective claims and assurance | every protected operation | grants/revocations | admin role changes |
| Prices | quote or offer selection | versioned offer and totals | canonical price, fees, tax, discounts | offer eligibility | offer versions and quotes | price/offer changes |
| Subscriptions | checkout/cancel | lifecycle and renewal projection | billing state and entitlement impact | customer, creator and resource | provider lifecycle | state transitions/refunds |
| PPV | unlock intent | offer, pending state, access decision | charged price and grant state | buyer/resource entitlement | purchase and grant | settlement/revoke/refund |
| Wallet | deposit/payout request | available, pending, reserved, paid | ledger-derived balances | account ownership and limits | immutable ledger/projections | corrections/reconciliation |
| Payments/tips | create intent/perform provider action | provider-safe status | settlement, fees, recipient and purpose | payer/recipient/offer | intents, verified events, postings | webhook/reconciliation events |
| Payouts | request/cancel where allowed | server lifecycle | eligibility, limits and reservation | owner, KYC, step-up, risk | destination, reserve, payout | every transition/exception |
| KYC | upload through intent, consent, submit | own minimal status | provider/risk/review outcome | applicant and restricted reviewer | encrypted restricted case | consent, access and decisions |
| Moderation | submit report or appeal | own safe status | priority/state transition | reporter/moderator scope | case, evidence and decision | actor/reason/before/after |
| Media access | request upload/access | safe preview and short-lived rendition | processing and access decision | ownership, membership, entitlement | asset lifecycle and policy | restricted access/takedown |
| Creator approval | onboarding submission | public verification projection | eligibility and verification state | restricted service/reviewer | private review record | decisions and access |
| Admin operations | explicit bounded command | scoped/redacted queues | permitted transition | RBAC/ABAC and step-up | command result | immutable privileged event |

Client booleans such as `isSubscribed`, `isUnlocked`, `verified`, and role state remain fixture presentation only. Production media delivery must re-authorize on the server and never rely on those values. Payment success comes from authenticated provider events, never a browser callback or success animation.
