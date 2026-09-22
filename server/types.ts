export type Role = 'ADMIN' | 'PARTICIPANT';

export interface User {
  id: string;
  identifier: string; // email or participant ID or admin username
  password_hash: string;
  role: Role;
  created_at: string;
}

export interface TeamMember {
  name: string;
  register_number: string;
  email?: string;
  phone?: string;
}

export interface Participant {
  id: string; // CM26-XXXX
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  register_number: string;
  department: string;
  year: string;
  team_name: string;
  team_members: TeamMember[];
  is_disabled: boolean;
  created_at: string;
}

export interface AdminSettings {
  registration_open: boolean;
  round1_open: boolean;
  round2_open: boolean;
  round3_open: boolean;
  round1_duration_mins: number;
  round2_duration_mins: number;
  max_violations: number;
  r1_weight: number;
  r2_weight: number;
  r3_weight: number;
  tie_breaker: 'mcq' | 'debugging' | 'time';
  show_results_publicly: boolean;
}

export interface MCQQuestion {
  id: string;
  question: string;
  code_snippet?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface MCQAttempt {
  id: string;
  participant_id: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string (calculated server-side)
  submitted_at?: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  total_questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentage: number;
  violations_count: number;
  is_auto_submitted: boolean;
  status: 'not_started' | 'in_progress' | 'submitted' | 'disqualified';
}

export interface Violation {
  id: string;
  participant_id: string;
  round: 'round1' | 'round2';
  violation_type: 'tab_hidden' | 'window_blur' | 'fullscreen_exit' | 'back_attempt';
  count: number;
  timestamp: string;
  details?: string;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface DebuggingProblem {
  id: string;
  title: string;
  description: string;
  starter_code: string;
  input_format: string;
  output_format: string;
  constraints: string;
  visible_examples: TestCase[];
  hidden_test_cases: TestCase[];
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_limit_sec: number;
  max_submissions: number;
}

export interface DebuggingSubmission {
  id: string;
  participant_id: string;
  problem_id: string;
  code: string;
  passed_visible: number;
  total_visible: number;
  passed_hidden: number;
  total_hidden: number;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  execution_time_ms: number;
  score: number;
  submitted_at: string;
  error_message?: string;
}

export interface PresentationEntry {
  id: string;
  participant_id: string;
  team_name: string;
  round3_marks: number;
  comments: string;
  judge_name?: string;
  is_qualified: boolean;
  updated_at: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'live' | 'completed';
  sort_order: number;
}

export interface RuleSection {
  id: string;
  title: string;
  items: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  participants: Participant[];
  admin_settings: AdminSettings;
  mcq_questions: MCQQuestion[];
  mcq_attempts: MCQAttempt[];
  violations: Violation[];
  debugging_problems: DebuggingProblem[];
  debugging_submissions: DebuggingSubmission[];
  presentation_entries: PresentationEntry[];
  timeline_events: TimelineEvent[];
  rules: RuleSection[];
  faqs: FAQItem[];
  audit_logs: AuditLog[];
}
