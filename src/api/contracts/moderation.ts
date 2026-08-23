import type { IsoUtcTimestamp, OpaqueId } from './common';

export type ReportSubjectType = 'post' | 'creator' | 'message' | 'live';
export type ModerationDecision = 'no_action' | 'remove_content' | 'restrict_account' | 'suspend_account';

export interface CreateReportRequest { subjectType: ReportSubjectType; subjectId: OpaqueId; reasonCode: string; details?: string; }
export interface Report { id: OpaqueId; subjectType: ReportSubjectType; subjectId: OpaqueId; status: 'submitted' | 'under_review' | 'resolved'; createdAt: IsoUtcTimestamp; }
export interface ModerationCase { id: OpaqueId; reportIds: OpaqueId[]; status: 'open' | 'assigned' | 'decided' | 'appealed' | 'closed'; version: number; }
export interface ModerationAction { caseId: OpaqueId; decision: ModerationDecision; reasonCode: string; expectedVersion: number; }
