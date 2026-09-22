import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  DatabaseSchema,
  User,
  Participant,
  AdminSettings,
  MCQQuestion,
  MCQAttempt,
  Violation,
  DebuggingProblem,
  DebuggingSubmission,
  PresentationEntry,
  TimelineEvent,
  RuleSection,
  FAQItem,
  AuditLog,
} from './types.ts';
import {
  defaultSettings,
  defaultTimeline,
  defaultRules,
  defaultFAQs,
  defaultMCQQuestions,
  defaultDebuggingProblems,
} from './seedData.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

class Database {
  private schema: DatabaseSchema;
  private initialized = false;

  constructor() {
    this.schema = this.getEmptySchema();
  }

  private getEmptySchema(): DatabaseSchema {
    return {
      users: [],
      participants: [],
      admin_settings: defaultSettings,
      mcq_questions: defaultMCQQuestions,
      mcq_attempts: [],
      violations: [],
      debugging_problems: defaultDebuggingProblems,
      debugging_submissions: [],
      presentation_entries: [],
      timeline_events: defaultTimeline,
      rules: defaultRules,
      faqs: defaultFAQs,
      audit_logs: [],
    };
  }

  public init() {
    if (this.initialized) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        this.schema = {
          ...this.getEmptySchema(),
          ...parsed,
        };
      } catch (err) {
        console.error('Failed reading existing database file, reinitializing', err);
        this.bootstrapDefaultData();
      }
    } else {
      this.bootstrapDefaultData();
    }

    // Ensure admin user exists
    const adminExists = this.schema.users.some((u) => u.role === 'ADMIN');
    if (!adminExists) {
      const salt = bcrypt.genSaltSync(10);
      const password_hash = bcrypt.hashSync('admin@codemasters2026', salt);
      const adminUser: User = {
        id: 'usr-admin-01',
        identifier: 'admin',
        password_hash,
        role: 'ADMIN',
        created_at: new Date().toISOString(),
      };
      this.schema.users.push(adminUser);
      this.save();
    }

    this.initialized = true;
  }

  private bootstrapDefaultData() {
    this.schema = this.getEmptySchema();
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync('admin@codemasters2026', salt);

    this.schema.users.push({
      id: 'usr-admin-01',
      identifier: 'admin',
      password_hash,
      role: 'ADMIN',
      created_at: new Date().toISOString(),
    });

    this.save();
  }

  public save() {
    try {
      const tempPath = `${DB_PATH}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.schema, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_PATH);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // --- Audit Logging ---
  public logAudit(actor: string, action: string, details: string) {
    const entry: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      actor,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.schema.audit_logs.unshift(entry);
    if (this.schema.audit_logs.length > 500) {
      this.schema.audit_logs = this.schema.audit_logs.slice(0, 500);
    }
    this.save();
  }

  // --- Users & Participants ---
  public getUsers(): User[] {
    return this.schema.users;
  }

  public findUserById(id: string): User | undefined {
    return this.schema.users.find((u) => u.id === id);
  }

  public findUserByIdentifier(identifier: string): User | undefined {
    const lower = identifier.trim().toLowerCase();
    return this.schema.users.find((u) => u.identifier.toLowerCase() === lower);
  }

  public getParticipants(): Participant[] {
    return this.schema.participants;
  }

  public findParticipantById(id: string): Participant | undefined {
    return this.schema.participants.find((p) => p.id === id);
  }

  public findParticipantByUserId(userId: string): Participant | undefined {
    return this.schema.participants.find((p) => p.user_id === userId);
  }

  public generateParticipantId(): string {
    const existing = this.schema.participants
      .map((p) => {
        const match = p.id.match(/^CM26-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existing.length > 0 ? Math.max(...existing) : 1000;
    const nextNum = Math.max(maxNum + 1, 1001);
    return `CM26-${nextNum}`;
  }

  public createParticipantWithUser(
    participantData: Omit<Participant, 'id' | 'user_id' | 'created_at' | 'is_disabled'>,
    plainPassword: string
  ): { participant: Participant; user: User } {
    const participantId = this.generateParticipantId();
    const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(plainPassword, salt);

    const newUser: User = {
      id: userId,
      identifier: participantId,
      password_hash,
      role: 'PARTICIPANT',
      created_at: new Date().toISOString(),
    };

    const newParticipant: Participant = {
      ...participantData,
      id: participantId,
      user_id: userId,
      is_disabled: false,
      created_at: new Date().toISOString(),
    };

    this.schema.users.push(newUser);
    this.schema.participants.push(newParticipant);

    this.logAudit('System', 'REGISTRATION', `New participant registered: ${participantId} (${participantData.full_name}, Team: ${participantData.team_name})`);
    this.save();

    return { participant: newParticipant, user: newUser };
  }

  public toggleParticipantDisabled(participantId: string, disabled: boolean): Participant | null {
    const p = this.schema.participants.find((x) => x.id === participantId);
    if (!p) return null;
    p.is_disabled = disabled;
    this.save();
    return p;
  }

  // --- Settings ---
  public getSettings(): AdminSettings {
    return this.schema.admin_settings;
  }

  public updateSettings(settings: Partial<AdminSettings>): AdminSettings {
    this.schema.admin_settings = {
      ...this.schema.admin_settings,
      ...settings,
    };
    this.logAudit('Admin', 'SETTINGS_UPDATE', JSON.stringify(settings));
    this.save();
    return this.schema.admin_settings;
  }

  // --- Round 1: MCQs ---
  public getMCQQuestions(includeAnswer = false): Array<Omit<MCQQuestion, 'correct_answer'> & { correct_answer?: string }> {
    if (includeAnswer) {
      return this.schema.mcq_questions;
    }
    return this.schema.mcq_questions.map(({ correct_answer, ...rest }) => rest);
  }

  public getMCQQuestionById(id: string): MCQQuestion | undefined {
    return this.schema.mcq_questions.find((q) => q.id === id);
  }

  public createMCQQuestion(q: Omit<MCQQuestion, 'id'>): MCQQuestion {
    const newQ: MCQQuestion = {
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
    this.schema.mcq_questions.push(newQ);
    this.save();
    return newQ;
  }

  public updateMCQQuestion(id: string, updates: Partial<MCQQuestion>): MCQQuestion | null {
    const idx = this.schema.mcq_questions.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    this.schema.mcq_questions[idx] = {
      ...this.schema.mcq_questions[idx],
      ...updates,
    };
    this.save();
    return this.schema.mcq_questions[idx];
  }

  public deleteMCQQuestion(id: string): boolean {
    const prevLen = this.schema.mcq_questions.length;
    this.schema.mcq_questions = this.schema.mcq_questions.filter((q) => q.id !== id);
    if (this.schema.mcq_questions.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Round 1: Attempts ---
  public getMCQAttempt(participantId: string): MCQAttempt | undefined {
    return this.schema.mcq_attempts.find((a) => a.participant_id === participantId);
  }

  public startMCQAttempt(participantId: string): MCQAttempt {
    let attempt = this.getMCQAttempt(participantId);
    if (attempt) {
      return attempt;
    }

    const durationMins = this.schema.admin_settings.round1_duration_mins || 30;
    const now = new Date();
    const endTime = new Date(now.getTime() + durationMins * 60 * 1000);

    attempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      participant_id: participantId,
      start_time: now.toISOString(),
      end_time: endTime.toISOString(),
      answers: {},
      score: 0,
      total_questions: this.schema.mcq_questions.length,
      attempted: 0,
      correct: 0,
      incorrect: 0,
      percentage: 0,
      violations_count: 0,
      is_auto_submitted: false,
      status: 'in_progress',
    };

    this.schema.mcq_attempts.push(attempt);
    this.logAudit(participantId, 'EXAM_START', `Participant started Round 1 MCQ exam. Time limit: ${durationMins} mins.`);
    this.save();
    return attempt;
  }

  public saveMCQAnswer(participantId: string, questionId: string, option: 'A' | 'B' | 'C' | 'D'): MCQAttempt | null {
    const attempt = this.getMCQAttempt(participantId);
    if (!attempt || attempt.status !== 'in_progress') return null;

    // Check if expired
    if (new Date() > new Date(attempt.end_time)) {
      this.finalizeMCQAttempt(participantId, true);
      return this.getMCQAttempt(participantId) || null;
    }

    attempt.answers[questionId] = option;
    attempt.attempted = Object.keys(attempt.answers).length;
    this.save();
    return attempt;
  }

  public recordViolation(participantId: string, round: 'round1' | 'round2', type: 'tab_hidden' | 'window_blur' | 'fullscreen_exit' | 'back_attempt', details?: string): { attempt: MCQAttempt | null; autoSubmitted: boolean } {
    const maxViolations = this.schema.admin_settings.max_violations || 3;
    const count = this.schema.violations.filter((v) => v.participant_id === participantId && v.round === round).length + 1;

    const violation: Violation = {
      id: `viol-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      participant_id: participantId,
      round,
      violation_type: type,
      count,
      timestamp: new Date().toISOString(),
      details,
    };
    this.schema.violations.push(violation);

    let autoSubmitted = false;
    let attempt = this.getMCQAttempt(participantId) || null;

    if (attempt) {
      attempt.violations_count = count;
      if (count >= maxViolations && attempt.status === 'in_progress') {
        attempt.is_auto_submitted = true;
        this.finalizeMCQAttempt(participantId, true);
        autoSubmitted = true;
        this.logAudit(participantId, 'DISQUALIFIED_AUTO_SUBMIT', `Max violations exceeded (${count}/${maxViolations}). Exam auto-submitted.`);
      } else {
        this.save();
      }
    } else {
      this.save();
    }

    return { attempt, autoSubmitted };
  }

  public finalizeMCQAttempt(participantId: string, isAuto = false): MCQAttempt | null {
    const attempt = this.getMCQAttempt(participantId);
    if (!attempt) return null;
    if (attempt.status === 'submitted') return attempt;

    let score = 0;
    let correct = 0;
    let incorrect = 0;

    const questionsMap = new Map(this.schema.mcq_questions.map((q) => [q.id, q]));

    for (const [qId, selectedOption] of Object.entries(attempt.answers)) {
      const q = questionsMap.get(qId);
      if (q) {
        if (q.correct_answer === selectedOption) {
          score += q.marks || 1;
          correct += 1;
        } else {
          incorrect += 1;
        }
      }
    }

    const totalQ = this.schema.mcq_questions.length;
    attempt.status = 'submitted';
    attempt.submitted_at = new Date().toISOString();
    attempt.is_auto_submitted = isAuto;
    attempt.score = score;
    attempt.correct = correct;
    attempt.incorrect = incorrect;
    attempt.total_questions = totalQ;
    attempt.attempted = Object.keys(attempt.answers).length;
    attempt.percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

    this.logAudit(participantId, 'EXAM_SUBMIT', `Round 1 MCQ submitted. Score: ${score}/${totalQ} (${attempt.percentage}%). Auto-submitted: ${isAuto}`);
    this.save();
    return attempt;
  }

  // --- Round 2: Debugging Problems ---
  public getDebuggingProblems(includeHidden = false): Array<Omit<DebuggingProblem, 'hidden_test_cases'> & { hidden_test_cases?: any[] }> {
    if (includeHidden) {
      return this.schema.debugging_problems;
    }
    return this.schema.debugging_problems.map(({ hidden_test_cases, ...rest }) => rest);
  }

  public getDebuggingProblemById(id: string): DebuggingProblem | undefined {
    return this.schema.debugging_problems.find((p) => p.id === id);
  }

  public createDebuggingProblem(p: Omit<DebuggingProblem, 'id'>): DebuggingProblem {
    const newP: DebuggingProblem = {
      ...p,
      id: `prob-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
    this.schema.debugging_problems.push(newP);
    this.save();
    return newP;
  }

  public updateDebuggingProblem(id: string, updates: Partial<DebuggingProblem>): DebuggingProblem | null {
    const idx = this.schema.debugging_problems.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.schema.debugging_problems[idx] = {
      ...this.schema.debugging_problems[idx],
      ...updates,
    };
    this.save();
    return this.schema.debugging_problems[idx];
  }

  public deleteDebuggingProblem(id: string): boolean {
    const prev = this.schema.debugging_problems.length;
    this.schema.debugging_problems = this.schema.debugging_problems.filter((p) => p.id !== id);
    if (this.schema.debugging_problems.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  public getParticipantSubmissions(participantId: string): DebuggingSubmission[] {
    return this.schema.debugging_submissions.filter((s) => s.participant_id === participantId);
  }

  public addDebuggingSubmission(submission: Omit<DebuggingSubmission, 'id' | 'submitted_at'>): DebuggingSubmission {
    const newSub: DebuggingSubmission = {
      ...submission,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      submitted_at: new Date().toISOString(),
    };
    this.schema.debugging_submissions.push(newSub);
    this.logAudit(submission.participant_id, 'DEBUG_SUBMISSION', `Problem: ${submission.problem_id}, Status: ${submission.status}, Score: ${submission.score}`);
    this.save();
    return newSub;
  }

  // --- Round 3: Presentation ---
  public getPresentationEntries(): PresentationEntry[] {
    return this.schema.presentation_entries;
  }

  public getPresentationEntry(participantId: string): PresentationEntry | undefined {
    return this.schema.presentation_entries.find((e) => e.participant_id === participantId);
  }

  public upsertPresentationEntry(entry: Omit<PresentationEntry, 'id' | 'updated_at'>): PresentationEntry {
    const existingIdx = this.schema.presentation_entries.findIndex((e) => e.participant_id === entry.participant_id);
    const updated_at = new Date().toISOString();

    if (existingIdx !== -1) {
      this.schema.presentation_entries[existingIdx] = {
        ...this.schema.presentation_entries[existingIdx],
        ...entry,
        updated_at,
      };
      this.save();
      return this.schema.presentation_entries[existingIdx];
    }

    const newEntry: PresentationEntry = {
      ...entry,
      id: `pres-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      updated_at,
    };
    this.schema.presentation_entries.push(newEntry);
    this.save();
    return newEntry;
  }

  // --- Results Engine & Leaderboard ---
  public calculateComprehensiveResults() {
    const settings = this.schema.admin_settings;
    const r1Weight = settings.r1_weight || 30;
    const r2Weight = settings.r2_weight || 50;
    const r3Weight = settings.r3_weight || 20;

    const participants = this.schema.participants;

    const results = participants.map((p) => {
      // Round 1
      const mcqAttempt = this.schema.mcq_attempts.find((a) => a.participant_id === p.id);
      const r1RawScore = mcqAttempt ? mcqAttempt.score : 0;
      const r1MaxScore = this.schema.mcq_questions.length || 25;
      const r1Percentage = r1MaxScore > 0 ? (r1RawScore / r1MaxScore) * 100 : 0;
      const r1Weighted = (r1Percentage * r1Weight) / 100;

      // Round 2
      const subs = this.schema.debugging_submissions.filter((s) => s.participant_id === p.id);
      // Best score per problem
      const problemBestScores = new Map<string, number>();
      for (const s of subs) {
        const cur = problemBestScores.get(s.problem_id) || 0;
        if (s.score > cur) problemBestScores.set(s.problem_id, s.score);
      }
      const r2RawScore = Array.from(problemBestScores.values()).reduce((a, b) => a + b, 0);
      const r2MaxScore = this.schema.debugging_problems.reduce((a, b) => a + (b.marks || 20), 0) || 100;
      const r2Percentage = r2MaxScore > 0 ? (r2RawScore / r2MaxScore) * 100 : 0;
      const r2Weighted = (r2Percentage * r2Weight) / 100;

      // Round 3
      const presEntry = this.schema.presentation_entries.find((e) => e.participant_id === p.id);
      const r3RawScore = presEntry ? presEntry.round3_marks : 0;
      const r3MaxScore = 100;
      const r3Percentage = r3RawScore;
      const r3Weighted = (r3Percentage * r3Weight) / 100;

      const totalWeightedScore = Number((r1Weighted + r2Weighted + r3Weighted).toFixed(2));

      // Timing & Violations
      let timeSpentSeconds = 0;
      if (mcqAttempt && mcqAttempt.submitted_at && mcqAttempt.start_time) {
        timeSpentSeconds = Math.max(
          0,
          Math.floor((new Date(mcqAttempt.submitted_at).getTime() - new Date(mcqAttempt.start_time).getTime()) / 1000)
        );
      }
      const violationsCount = this.schema.violations.filter((v) => v.participant_id === p.id).length;

      return {
        participant_id: p.id,
        full_name: p.full_name,
        team_name: p.team_name,
        department: p.department,
        year: p.year,
        is_disabled: p.is_disabled,
        round1: {
          attempted: !!mcqAttempt,
          status: mcqAttempt ? mcqAttempt.status : 'not_started',
          raw_score: r1RawScore,
          max_score: r1MaxScore,
          percentage: r1Percentage,
          weighted_score: Number(r1Weighted.toFixed(2)),
          time_seconds: timeSpentSeconds,
        },
        round2: {
          submissions_count: subs.length,
          raw_score: r2RawScore,
          max_score: r2MaxScore,
          percentage: r2Percentage,
          weighted_score: Number(r2Weighted.toFixed(2)),
        },
        round3: {
          is_qualified: presEntry ? presEntry.is_qualified : false,
          raw_score: r3RawScore,
          weighted_score: Number(r3Weighted.toFixed(2)),
          comments: presEntry ? presEntry.comments : '',
        },
        total_score: totalWeightedScore,
        violations_count: violationsCount,
      };
    });

    // Sort according to tie breaker
    results.sort((a, b) => {
      // 1. Total score desc
      if (b.total_score !== a.total_score) {
        return b.total_score - a.total_score;
      }
      // Tie breakers
      if (settings.tie_breaker === 'debugging') {
        if (b.round2.raw_score !== a.round2.raw_score) return b.round2.raw_score - a.round2.raw_score;
        if (b.round1.raw_score !== a.round1.raw_score) return b.round1.raw_score - a.round1.raw_score;
        return a.round1.time_seconds - b.round1.time_seconds;
      } else if (settings.tie_breaker === 'mcq') {
        if (b.round1.raw_score !== a.round1.raw_score) return b.round1.raw_score - a.round1.raw_score;
        if (b.round2.raw_score !== a.round2.raw_score) return b.round2.raw_score - a.round2.raw_score;
        return a.round1.time_seconds - b.round1.time_seconds;
      } else {
        // time
        if (a.round1.time_seconds !== b.round1.time_seconds) return a.round1.time_seconds - b.round1.time_seconds;
        return b.round2.raw_score - a.round2.raw_score;
      }
    });

    return results.map((r, idx) => ({ rank: idx + 1, ...r }));
  }

  // --- Timeline, Rules & FAQs ---
  public getTimeline(): TimelineEvent[] {
    return this.schema.timeline_events.sort((a, b) => a.sort_order - b.sort_order);
  }

  public updateTimeline(events: TimelineEvent[]): TimelineEvent[] {
    this.schema.timeline_events = events;
    this.save();
    return this.schema.timeline_events;
  }

  public getRules(): RuleSection[] {
    return this.schema.rules;
  }

  public updateRules(rules: RuleSection[]): RuleSection[] {
    this.schema.rules = rules;
    this.save();
    return this.schema.rules;
  }

  public getFAQs(): FAQItem[] {
    return this.schema.faqs;
  }

  public updateFAQs(faqs: FAQItem[]): FAQItem[] {
    this.schema.faqs = faqs;
    this.save();
    return this.schema.faqs;
  }

  public getViolations(participantId?: string): Violation[] {
    if (participantId) {
      return this.schema.violations.filter((v) => v.participant_id === participantId);
    }
    return this.schema.violations;
  }

  public getAuditLogs(): AuditLog[] {
    return this.schema.audit_logs;
  }
}

export const db = new Database();
db.init();
