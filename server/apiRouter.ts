import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from './db.ts';
import {
  authenticate,
  requireAuth,
  requireAdmin,
  requireParticipant,
  generateToken,
  AuthenticatedRequest,
} from './auth.ts';
import { executePython, runTestCases } from './executor.ts';

export const apiRouter = Router();

apiRouter.use(authenticate);

// ==========================================
// AUTH ROUTES
// ==========================================

// Register participant
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const settings = db.getSettings();
    if (!settings.registration_open) {
      return res.status(400).json({ error: 'Registration is currently closed by the organizers.' });
    }

    const {
      full_name,
      email,
      phone,
      register_number,
      department,
      year,
      team_name,
      team_members = [],
      password,
    } = req.body;

    if (!full_name || !email || !phone || !register_number || !department || !year || !team_name || !password) {
      return res.status(400).json({ error: 'All primary fields and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check duplicate email or register number
    const existingParticipants = db.getParticipants();
    const dupEmail = existingParticipants.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (dupEmail) {
      return res.status(400).json({ error: 'A registration with this email already exists.' });
    }

    const dupRegNo = existingParticipants.find(
      (p) => p.register_number.toLowerCase() === register_number.trim().toLowerCase()
    );
    if (dupRegNo) {
      return res.status(400).json({ error: 'A registration with this Register Number / Student ID already exists.' });
    }

    const { participant, user } = db.createParticipantWithUser(
      {
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        register_number: register_number.trim(),
        department: department.trim(),
        year: year.trim(),
        team_name: team_name.trim(),
        team_members: Array.isArray(team_members) ? team_members : [],
      },
      password
    );

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Code Masters 2026.',
      participant_id: participant.id,
      token,
      participant,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login (Participant or Admin)
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please enter your Participant ID / Email / Username and Password.' });
    }

    const cleanIdentifier = identifier.trim();

    // Check if matching participant by email first
    let user = db.findUserByIdentifier(cleanIdentifier);

    if (!user) {
      // Check if participant registered with this email
      const p = db.getParticipants().find((x) => x.email.toLowerCase() === cleanIdentifier.toLowerCase());
      if (p) {
        user = db.findUserById(p.user_id);
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please verify your Participant ID or Email.' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    let participant = null;
    if (user.role === 'PARTICIPANT') {
      participant = db.findParticipantByUserId(user.id);
      if (participant?.is_disabled) {
        return res.status(403).json({ error: 'Your account has been locked. Please contact the organizers.' });
      }
    }

    const token = generateToken(user);
    db.logAudit(user.identifier, 'LOGIN', `User logged in with role ${user.role}`);

    return res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user.id,
        identifier: user.identifier,
        role: user.role,
      },
      participant,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Get Current User Profile
apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  return res.json({
    user: {
      id: req.user!.id,
      identifier: req.user!.identifier,
      role: req.user!.role,
    },
    participant: req.participant || null,
  });
});

// ==========================================
// PUBLIC EVENT DATA
// ==========================================

apiRouter.get(['/public/event-info', '/event-info'], (req, res) => {
  const participants = db.getParticipants();
  const settings = db.getSettings();

  return res.json({
    event_name: 'CODE MASTERS',
    tagline: 'The Ultimate Coding Challenge',
    organizer: {
      department: 'Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
      school: 'School of Computing',
      university: 'Vel Tech University',
      location: 'Avadi, Chennai, Tamil Nadu, India',
    },
    event_date: '29 September 2026',
    timings: '9:00 AM – 4:00 PM',
    venue: 'Lecture Theatre (33220B)',
    prizes: {
      total: '₹5,250',
      breakdown: [
        { place: '1st Place', amount: '₹2,000', label: 'Winner Trophy & Cash Prize' },
        { place: '2nd Place', amount: '₹1,500', label: 'Runner-up Award & Cash Prize' },
        { place: '3rd Place', amount: '₹1,000', label: 'Second Runner-up & Cash Prize' },
        { place: '4th Place', amount: '₹750', label: 'Consolation Prize & Merit Certificate' },
      ],
    },
    capacity: '100+ Participant Capacity',
    registered_count: participants.length,
    settings: {
      registration_open: settings.registration_open,
      round1_open: settings.round1_open,
      round2_open: settings.round2_open,
      round3_open: settings.round3_open,
      show_results_publicly: settings.show_results_publicly,
    },
    timeline: db.getTimeline(),
    rules: db.getRules(),
    faqs: db.getFAQs(),
  });
});

// ==========================================
// PARTICIPANT DASHBOARD & STATUS
// ==========================================

apiRouter.get('/participant/dashboard', requireParticipant, (req: AuthenticatedRequest, res) => {
  const participant = req.participant!;
  const settings = db.getSettings();

  const mcqAttempt = db.getMCQAttempt(participant.id);
  const submissions = db.getParticipantSubmissions(participant.id);
  const presEntry = db.getPresentationEntry(participant.id);
  const violations = db.getViolations(participant.id);

  // Round 1 Status
  let round1Status: 'locked' | 'available' | 'in_progress' | 'completed' = 'locked';
  if (settings.round1_open) {
    if (!mcqAttempt) {
      round1Status = 'available';
    } else if (mcqAttempt.status === 'in_progress') {
      round1Status = 'in_progress';
    } else {
      round1Status = 'completed';
    }
  }

  // Round 2 Status
  let round2Status: 'locked' | 'available' | 'in_progress' | 'completed' = 'locked';
  if (settings.round2_open) {
    // Participant qualifies if Round 1 is completed or admin allows
    const r1Done = mcqAttempt && mcqAttempt.status === 'submitted';
    if (r1Done || settings.round2_open) {
      if (submissions.length === 0) {
        round2Status = 'available';
      } else {
        const uniqueProblems = new Set(submissions.map((s) => s.problem_id)).size;
        if (uniqueProblems >= db.getDebuggingProblems().length) {
          round2Status = 'completed';
        } else {
          round2Status = 'in_progress';
        }
      }
    }
  }

  // Round 3 Status
  let round3Status: 'locked' | 'available' | 'completed' = 'locked';
  if (settings.round3_open) {
    if (presEntry) {
      round3Status = 'completed';
    } else {
      round3Status = 'available';
    }
  }

  return res.json({
    participant,
    settings,
    rounds: {
      round1: {
        title: 'Round 01 — MCQ Challenge',
        total_questions: 25,
        status: round1Status,
        attempt: mcqAttempt
          ? {
              status: mcqAttempt.status,
              start_time: mcqAttempt.start_time,
              end_time: mcqAttempt.end_time,
              attempted: mcqAttempt.attempted,
              score: mcqAttempt.status === 'submitted' ? mcqAttempt.score : undefined,
              percentage: mcqAttempt.status === 'submitted' ? mcqAttempt.percentage : undefined,
              is_auto_submitted: mcqAttempt.is_auto_submitted,
            }
          : null,
      },
      round2: {
        title: 'Round 02 — Python Debugging Arena',
        total_problems: 5,
        status: round2Status,
        submissions_count: submissions.length,
        solved_problems_count: new Set(submissions.filter((s) => s.status === 'Accepted').map((s) => s.problem_id)).size,
      },
      round3: {
        title: 'Round 03 — Final Presentation',
        status: round3Status,
        is_qualified: presEntry ? presEntry.is_qualified : false,
        entry: presEntry || null,
      },
    },
    violations_count: violations.length,
  });
});

// ==========================================
// ROUND 1: MCQ ENGINE
// ==========================================

// Get Questions (Answer hidden for participants)
apiRouter.get('/mcq/questions', requireParticipant, (req: AuthenticatedRequest, res) => {
  const settings = db.getSettings();
  if (!settings.round1_open) {
    return res.status(403).json({ error: 'Round 1 MCQ Challenge is currently closed.' });
  }

  const questions = db.getMCQQuestions(false);
  const attempt = db.getMCQAttempt(req.participant!.id);

  return res.json({
    questions,
    attempt: attempt || null,
    duration_mins: settings.round1_duration_mins,
  });
});

// Start or Resume MCQ Exam
apiRouter.post('/mcq/start', requireParticipant, (req: AuthenticatedRequest, res) => {
  const settings = db.getSettings();
  if (!settings.round1_open) {
    return res.status(403).json({ error: 'Round 1 MCQ Challenge is currently closed.' });
  }

  const participantId = req.participant!.id;
  const attempt = db.startMCQAttempt(participantId);

  // Calculate remaining seconds
  const remainingSecs = Math.max(0, Math.floor((new Date(attempt.end_time).getTime() - Date.now()) / 1000));

  if (remainingSecs <= 0 && attempt.status === 'in_progress') {
    db.finalizeMCQAttempt(participantId, true);
    return res.json({
      attempt: db.getMCQAttempt(participantId),
      remaining_seconds: 0,
      expired: true,
    });
  }

  return res.json({
    attempt,
    remaining_seconds: remainingSecs,
    expired: false,
  });
});

// Save Answer (Auto-save in real-time)
apiRouter.post('/mcq/save-answer', requireParticipant, (req: AuthenticatedRequest, res) => {
  const { question_id, option } = req.body;
  if (!question_id || !['A', 'B', 'C', 'D'].includes(option)) {
    return res.status(400).json({ error: 'Valid question_id and option (A/B/C/D) required.' });
  }

  const participantId = req.participant!.id;
  const attempt = db.saveMCQAnswer(participantId, question_id, option);

  if (!attempt) {
    return res.status(400).json({ error: 'Cannot save answer: Exam not active or already submitted.' });
  }

  return res.json({
    success: true,
    attempted: attempt.attempted,
    answers: attempt.answers,
    status: attempt.status,
  });
});

// Anti-Tab Switch / Window Blur Violation Tracking
apiRouter.post('/mcq/violation', requireParticipant, (req: AuthenticatedRequest, res) => {
  const { violation_type = 'tab_hidden', details } = req.body;
  const participantId = req.participant!.id;

  const { attempt, autoSubmitted } = db.recordViolation(
    participantId,
    'round1',
    violation_type,
    details || 'Focus lost or tab visibility changed'
  );

  const maxViolations = db.getSettings().max_violations || 3;
  const currentCount = attempt ? attempt.violations_count : 1;

  let warningMessage = '';
  if (autoSubmitted || currentCount >= maxViolations) {
    warningMessage = 'Strike 3: Violation limit exceeded. Your test has been automatically submitted.';
  } else if (currentCount === 2) {
    warningMessage = 'Final Warning (Strike 2/3): One more window blur or tab switch will automatically submit your exam!';
  } else {
    warningMessage = `Warning (Strike ${currentCount}/${maxViolations}): You have navigated away from the exam window. This activity has been recorded.`;
  }

  return res.json({
    violations_count: currentCount,
    max_violations: maxViolations,
    auto_submitted: autoSubmitted,
    warning: warningMessage,
    status: attempt ? attempt.status : 'unknown',
  });
});

// Authoritative Timer Sync
apiRouter.get('/mcq/status', requireParticipant, (req: AuthenticatedRequest, res) => {
  const participantId = req.participant!.id;
  const attempt = db.getMCQAttempt(participantId);

  if (!attempt) {
    return res.json({ started: false, remaining_seconds: 0 });
  }

  const remainingSecs = Math.max(0, Math.floor((new Date(attempt.end_time).getTime() - Date.now()) / 1000));

  if (remainingSecs <= 0 && attempt.status === 'in_progress') {
    db.finalizeMCQAttempt(participantId, true);
    return res.json({
      started: true,
      remaining_seconds: 0,
      status: 'submitted',
      auto_submitted: true,
    });
  }

  return res.json({
    started: true,
    remaining_seconds: remainingSecs,
    status: attempt.status,
    attempted: attempt.attempted,
    violations_count: attempt.violations_count,
  });
});

// Finalize MCQ Submission
apiRouter.post('/mcq/submit', requireParticipant, (req: AuthenticatedRequest, res) => {
  const participantId = req.participant!.id;
  const attempt = db.finalizeMCQAttempt(participantId, false);

  if (!attempt) {
    return res.status(400).json({ error: 'No active attempt found.' });
  }

  return res.json({
    success: true,
    message: 'Round 1 MCQ Challenge submitted successfully!',
    score: attempt.score,
    total_questions: attempt.total_questions,
    attempted: attempt.attempted,
    percentage: attempt.percentage,
    submitted_at: attempt.submitted_at,
  });
});

// ==========================================
// ROUND 2: DEBUGGING ARENA
// ==========================================

// Get Debugging Problems
apiRouter.get('/debugging/problems', requireParticipant, (req: AuthenticatedRequest, res) => {
  const settings = db.getSettings();
  if (!settings.round2_open) {
    return res.status(403).json({ error: 'Round 2 Debugging Arena is currently locked.' });
  }

  const problems = db.getDebuggingProblems(false);
  const submissions = db.getParticipantSubmissions(req.participant!.id);

  return res.json({
    problems,
    submissions,
    duration_mins: settings.round2_duration_mins,
  });
});

// Run Code Against Visible Test Cases Only
apiRouter.post('/debugging/run', requireParticipant, async (req: AuthenticatedRequest, res) => {
  const { problem_id, code } = req.body;
  if (!problem_id || typeof code !== 'string') {
    return res.status(400).json({ error: 'problem_id and code are required.' });
  }

  const problem = db.getDebuggingProblemById(problem_id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found.' });
  }

  try {
    const results = await runTestCases(code, problem.visible_examples, (problem.time_limit_sec || 3) * 1000);
    const allPassed = results.every((r) => r.passed);

    return res.json({
      success: true,
      all_passed: allPassed,
      total_tests: results.length,
      passed_count: results.filter((r) => r.passed).length,
      test_results: results,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Execution engine error: ' + err.message });
  }
});

// Final Submit Against All Hidden Test Cases
apiRouter.post('/debugging/submit', requireParticipant, async (req: AuthenticatedRequest, res) => {
  const { problem_id, code } = req.body;
  if (!problem_id || typeof code !== 'string') {
    return res.status(400).json({ error: 'problem_id and code are required.' });
  }

  const participantId = req.participant!.id;
  const problem = db.getDebuggingProblemById(problem_id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found.' });
  }

  // Check submission limit
  const pastSubs = db.getParticipantSubmissions(participantId).filter((s) => s.problem_id === problem_id);
  const maxSubs = problem.max_submissions || 5;
  if (pastSubs.length >= maxSubs) {
    return res.status(400).json({
      error: `Maximum submission limit of ${maxSubs} reached for this problem.`,
    });
  }

  try {
    // Run visible tests
    const visibleResults = await runTestCases(code, problem.visible_examples, (problem.time_limit_sec || 3) * 1000);
    const passedVisible = visibleResults.filter((r) => r.passed).length;

    // Run hidden tests
    const hiddenResults = await runTestCases(code, problem.hidden_test_cases, (problem.time_limit_sec || 3) * 1000);
    const passedHidden = hiddenResults.filter((r) => r.passed).length;

    const totalTests = problem.visible_examples.length + problem.hidden_test_cases.length;
    const totalPassed = passedVisible + passedHidden;

    let status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' = 'Accepted';
    if (totalPassed < totalTests) {
      const hasTLE = visibleResults.concat(hiddenResults).some((r) => r.errorMessage === 'Time Limit Exceeded');
      const hasRuntimeErr = visibleResults.concat(hiddenResults).some((r) => r.errorMessage && r.errorMessage.includes('Runtime'));
      if (hasTLE) status = 'Time Limit Exceeded';
      else if (hasRuntimeErr) status = 'Runtime Error';
      else status = 'Wrong Answer';
    }

    const maxMarks = problem.marks || 20;
    const calculatedScore = totalTests > 0 ? Math.round((totalPassed / totalTests) * maxMarks) : 0;
    const avgTime = Math.round(
      visibleResults.concat(hiddenResults).reduce((sum, r) => sum + r.executionTimeMs, 0) / Math.max(1, totalTests)
    );

    const submission = db.addDebuggingSubmission({
      participant_id: participantId,
      problem_id,
      code,
      passed_visible: passedVisible,
      total_visible: problem.visible_examples.length,
      passed_hidden: passedHidden,
      total_hidden: problem.hidden_test_cases.length,
      status,
      execution_time_ms: avgTime,
      score: calculatedScore,
    });

    return res.json({
      success: true,
      submission,
      visible_results: visibleResults,
      hidden_summary: {
        passed: passedHidden,
        total: problem.hidden_test_cases.length,
      },
      total_passed: totalPassed,
      total_tests: totalTests,
      score: calculatedScore,
      status,
      remaining_submissions: maxSubs - (pastSubs.length + 1),
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Evaluation failed: ' + err.message });
  }
});

// ==========================================
// ADMIN DASHBOARD ROUTES
// ==========================================

// Admin Overview
apiRouter.get('/admin/overview', requireAdmin, (req, res) => {
  const participants = db.getParticipants();
  const mcqAttempts = db.getMCQQuestions().length > 0 ? db.getParticipants().map((p) => db.getMCQAttempt(p.id)) : [];
  const activeAttempts = mcqAttempts.filter((a) => a && a.status === 'in_progress').length;
  const completedR1 = mcqAttempts.filter((a) => a && a.status === 'submitted').length;
  const allSubmissions = db.getParticipants().flatMap((p) => db.getParticipantSubmissions(p.id));
  const violations = db.getViolations();
  const presEntries = db.getPresentationEntries();

  const auditLogs = db.getAuditLogs().slice(0, 15);

  return res.json({
    total_registered: participants.length,
    active_attempts: activeAttempts,
    round1_completed: completedR1,
    round2_submissions: allSubmissions.length,
    total_violations: violations.length,
    round3_participants: presEntries.length,
    recent_activity: auditLogs,
    settings: db.getSettings(),
  });
});

// Participant Management
apiRouter.get('/admin/participants', requireAdmin, (req, res) => {
  const participants = db.getParticipants();
  const detailed = participants.map((p) => {
    const attempt = db.getMCQAttempt(p.id);
    const subs = db.getParticipantSubmissions(p.id);
    const pres = db.getPresentationEntry(p.id);
    const viols = db.getViolations(p.id);

    return {
      ...p,
      round1_attempt: attempt || null,
      debugging_submissions_count: subs.length,
      presentation: pres || null,
      violations_count: viols.length,
    };
  });

  return res.json(detailed);
});

// Toggle Participant Lock
apiRouter.post('/admin/participants/:id/toggle-lock', requireAdmin, (req, res) => {
  const { disabled } = req.body;
  const updated = db.toggleParticipantDisabled(req.params.id, !!disabled);
  if (!updated) {
    return res.status(404).json({ error: 'Participant not found' });
  }
  return res.json({ success: true, participant: updated });
});

// MCQ Questions CRUD
apiRouter.get('/admin/questions', requireAdmin, (req, res) => {
  return res.json(db.getMCQQuestions(true));
});

apiRouter.post('/admin/questions', requireAdmin, (req, res) => {
  const { question, option_a, option_b, option_c, option_d, correct_answer, marks = 1, difficulty = 'Medium', category = 'General', code_snippet } = req.body;
  if (!question || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
    return res.status(400).json({ error: 'All question fields and correct_answer are required.' });
  }

  const newQ = db.createMCQQuestion({
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    marks: Number(marks) || 1,
    difficulty,
    category,
    code_snippet: code_snippet || '',
  });

  return res.status(201).json(newQ);
});

apiRouter.put('/admin/questions/:id', requireAdmin, (req, res) => {
  const updated = db.updateMCQQuestion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Question not found' });
  return res.json(updated);
});

apiRouter.delete('/admin/questions/:id', requireAdmin, (req, res) => {
  const ok = db.deleteMCQQuestion(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Question not found' });
  return res.json({ success: true });
});

// Debugging Problems CRUD
apiRouter.get('/admin/problems', requireAdmin, (req, res) => {
  return res.json(db.getDebuggingProblems(true));
});

apiRouter.post('/admin/problems', requireAdmin, (req, res) => {
  const { title, description, starter_code, input_format, output_format, constraints, visible_examples = [], hidden_test_cases = [], marks = 20, difficulty = 'Medium', time_limit_sec = 3, max_submissions = 5 } = req.body;

  if (!title || !description || !starter_code) {
    return res.status(400).json({ error: 'Title, description, and starter_code are required.' });
  }

  const newProb = db.createDebuggingProblem({
    title,
    description,
    starter_code,
    input_format: input_format || '',
    output_format: output_format || '',
    constraints: constraints || '',
    visible_examples,
    hidden_test_cases,
    marks: Number(marks) || 20,
    difficulty,
    time_limit_sec: Number(time_limit_sec) || 3,
    max_submissions: Number(max_submissions) || 5,
  });

  return res.status(201).json(newProb);
});

apiRouter.put('/admin/problems/:id', requireAdmin, (req, res) => {
  const updated = db.updateDebuggingProblem(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Problem not found' });
  return res.json(updated);
});

apiRouter.delete('/admin/problems/:id', requireAdmin, (req, res) => {
  const ok = db.deleteDebuggingProblem(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Problem not found' });
  return res.json({ success: true });
});

// Test Run For Admin
apiRouter.post('/admin/problems/test-run', requireAdmin, async (req, res) => {
  const { code, input } = req.body;
  try {
    const result = await executePython(code || '', input || '');
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Results Engine
apiRouter.get('/admin/results', requireAdmin, (req, res) => {
  const results = db.calculateComprehensiveResults();
  return res.json({
    results,
    settings: db.getSettings(),
  });
});

// CSV Export
apiRouter.get('/admin/export-csv', requireAdmin, (req, res) => {
  const results = db.calculateComprehensiveResults();

  const headers = [
    'Rank',
    'Participant ID',
    'Full Name',
    'Team Name',
    'Department',
    'Year',
    'Round 1 Score',
    'Round 1 Max',
    'Round 1 Weighted',
    'Round 2 Score',
    'Round 2 Max',
    'Round 2 Weighted',
    'Round 3 Marks',
    'Round 3 Weighted',
    'Total Score',
    'Time Taken (s)',
    'Violations',
  ];

  const rows = results.map((r) => [
    r.rank,
    `"${r.participant_id}"`,
    `"${r.full_name}"`,
    `"${r.team_name}"`,
    `"${r.department}"`,
    `"${r.year}"`,
    r.round1.raw_score,
    r.round1.max_score,
    r.round1.weighted_score,
    r.round2.raw_score,
    r.round2.max_score,
    r.round2.weighted_score,
    r.round3.raw_score,
    r.round3.weighted_score,
    r.total_score,
    r.round1.time_seconds,
    r.violations_count,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="codemasters_2026_results.csv"');
  return res.send(csvContent);
});

// Admin Settings
apiRouter.get('/admin/settings', requireAdmin, (req, res) => {
  return res.json(db.getSettings());
});

apiRouter.put('/admin/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  return res.json(updated);
});

// Round 3 Presentation Scoring
apiRouter.post('/admin/presentation', requireAdmin, (req, res) => {
  const { participant_id, team_name, round3_marks = 0, comments = '', judge_name = '', is_qualified = true } = req.body;
  if (!participant_id) {
    return res.status(400).json({ error: 'participant_id is required' });
  }

  const entry = db.upsertPresentationEntry({
    participant_id,
    team_name: team_name || '',
    round3_marks: Number(round3_marks) || 0,
    comments,
    judge_name,
    is_qualified: !!is_qualified,
  });

  return res.json({ success: true, entry });
});

// Event Config (Timeline, Rules, FAQs)
apiRouter.put('/admin/timeline', requireAdmin, (req, res) => {
  const updated = db.updateTimeline(req.body.timeline || []);
  return res.json(updated);
});

apiRouter.put('/admin/rules', requireAdmin, (req, res) => {
  const updated = db.updateRules(req.body.rules || []);
  return res.json(updated);
});

apiRouter.put('/admin/faqs', requireAdmin, (req, res) => {
  const updated = db.updateFAQs(req.body.faqs || []);
  return res.json(updated);
});

apiRouter.get('/admin/violations', requireAdmin, (req, res) => {
  return res.json(db.getViolations());
});
