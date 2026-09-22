import bcrypt from 'bcryptjs';
import { MCQQuestion, DebuggingProblem, TimelineEvent, RuleSection, FAQItem, AdminSettings } from './types.ts';

export const defaultSettings: AdminSettings = {
  registration_open: true,
  round1_open: true,
  round2_open: true,
  round3_open: false,
  round1_duration_mins: 30,
  round2_duration_mins: 45,
  max_violations: 3,
  r1_weight: 30,
  r2_weight: 50,
  r3_weight: 20,
  tie_breaker: 'debugging',
  show_results_publicly: false,
};

export const defaultTimeline: TimelineEvent[] = [
  {
    id: 'tl-1',
    title: 'Participant Registration',
    description: 'Online registration for student teams (1-3 members) from all engineering departments.',
    date: '2026-09-01 to 2026-09-28',
    start_time: '09:00 AM',
    end_time: '11:59 PM',
    status: 'completed',
    sort_order: 1,
  },
  {
    id: 'tl-2',
    title: 'Inauguration & Keynote Address',
    description: 'Welcome address by Head of Department, CSE (AI & ML), School of Computing at Vel Tech University.',
    date: '29 September 2026',
    start_time: '09:00 AM',
    end_time: '09:30 AM',
    status: 'upcoming',
    sort_order: 2,
  },
  {
    id: 'tl-3',
    title: 'Round 1 — MCQ Challenge',
    description: '25 Python questions testing core syntax, memory, data structures, and output prediction.',
    date: '29 September 2026',
    start_time: '09:45 AM',
    end_time: '10:45 AM',
    status: 'upcoming',
    sort_order: 3,
  },
  {
    id: 'tl-4',
    title: 'Evaluation & Round 1 Shortlist',
    description: 'Automated leaderboard computation and announcement of qualifying teams for Round 2.',
    date: '29 September 2026',
    start_time: '10:45 AM',
    end_time: '11:15 AM',
    status: 'upcoming',
    sort_order: 4,
  },
  {
    id: 'tl-5',
    title: 'Round 2 — Debugging Arena',
    description: '5 buggy Python programs evaluated in real-time inside the Code Masters sandbox environment.',
    date: '29 September 2026',
    start_time: '11:30 AM',
    end_time: '01:00 PM',
    status: 'upcoming',
    sort_order: 5,
  },
  {
    id: 'tl-6',
    title: 'Lunch & Networking Break',
    description: 'Refreshments and networking opportunity for all participants and faculty coordinators.',
    date: '29 September 2026',
    start_time: '01:00 PM',
    end_time: '02:00 PM',
    status: 'upcoming',
    sort_order: 6,
  },
  {
    id: 'tl-7',
    title: 'Round 3 — Final Presentation',
    description: 'Top finalist teams present technical solutions and code architecture before the judging panel.',
    date: '29 September 2026',
    start_time: '02:00 PM',
    end_time: '03:30 PM',
    status: 'upcoming',
    sort_order: 7,
  },
  {
    id: 'tl-8',
    title: 'Valedictory & Prize Distribution',
    description: 'Awarding cash prizes totaling ₹5,250, merit shields, and certificates of excellence.',
    date: '29 September 2026',
    start_time: '03:30 PM',
    end_time: '04:00 PM',
    status: 'upcoming',
    sort_order: 8,
  },
];

export const defaultRules: RuleSection[] = [
  {
    id: 'rule-1',
    title: '1. Eligibility & Verification',
    items: [
      'The competition is strictly open to bonafide undergraduate engineering students.',
      'Participants must present a valid college ID card or official department registration number during on-campus reporting at Lecture Theatre (33220B).',
      'Both individual entries and teams of up to 3 members are permitted.',
    ],
  },
  {
    id: 'rule-2',
    title: '2. Registration Guidelines',
    items: [
      'Registration must be completed on this official portal before the cutoff time.',
      'Upon registration, each participant/team is assigned a unique Participant ID formatted as CM26-XXXX.',
      'Duplicate registrations using the same student ID or email address will be rejected automatically.',
    ],
  },
  {
    id: 'rule-3',
    title: '3. Round 1 — MCQ Rules',
    items: [
      'Round 1 comprises 25 Python-centric questions spanning syntax, data structures, and output prediction.',
      'Total test duration is strictly 30 minutes from the instant "Start Exam" is initiated.',
      'Questions are presented sequentially. Answers are saved automatically in real-time.',
      'Each correct answer awards 1 mark. There is no negative marking.',
    ],
  },
  {
    id: 'rule-4',
    title: '4. Round 2 — Debugging Arena Rules',
    items: [
      'Participants receive 5 buggy Python scripts that fail edge cases or contain runtime errors.',
      'You must analyze, correct, and optimize the code without modifying input/output format specifications.',
      'Code is executed in an isolated secure sandbox against visible and hidden test suites.',
      'Points are awarded based on the percentage of passed test cases.',
    ],
  },
  {
    id: 'rule-5',
    title: '5. Round 3 — Presentation Rules',
    items: [
      'Final presentation format, problem statement, and judging criteria will be officially announced by the organizers on event day.',
      'Selected finalist teams will present their architectural and algorithmic approach to the faculty panel.',
    ],
  },
  {
    id: 'rule-6',
    title: '6. Anti-Tab / Violation Policy',
    items: [
      'During Round 1, the portal continuously monitors tab visibility, window blurs, and navigation attempts.',
      'Violation 1: Official warning banner logged to your audit trail.',
      'Violation 2: Final severe warning notice.',
      'Violation 3: The system terminates the session and automatically submits your test immediately.',
    ],
  },
  {
    id: 'rule-7',
    title: '7. Submission Guidelines',
    items: [
      'Ensure all answers are confirmed before the countdown reaches 00:00.',
      'In the event of network disruption, local state is cached and re-synchronized once connectivity resumes.',
      'The server clock is strictly authoritative across all sessions.',
    ],
  },
  {
    id: 'rule-8',
    title: '8. General Conduct & Academic Integrity',
    items: [
      'Participants must adhere to the professional academic ethics code of Vel Tech University.',
      'Any use of unauthorized AI assistants, peer whispering, or external devices will result in immediate disqualification.',
      'The decision of the organizing committee and jury is final and binding.',
    ],
  },
];

export const defaultFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'Who can participate in Code Masters?',
    answer: 'Any student currently enrolled in an undergraduate engineering or computer science program is eligible. You can register as an individual or in a team of up to 3 members.',
  },
  {
    id: 'faq-2',
    category: 'Registration',
    question: 'How do I register and receive my credentials?',
    answer: 'Click "Register Now" on the navigation bar, fill in your details (name, register number, department, year, team details), and set a password. You will receive an official Participant ID (e.g. CM26-1001) for login.',
  },
  {
    id: 'faq-3',
    category: 'Round 1',
    question: 'How many questions are in Round 1 and what is the duration?',
    answer: 'Round 1 contains 25 Python-centric multiple-choice questions with a total duration of 30 minutes. Each question carries 1 mark with zero negative marking.',
  },
  {
    id: 'faq-4',
    category: 'Technical',
    question: 'Which programming language is used for the competition?',
    answer: 'Python 3 is the exclusive language for Code Masters 2026. Round 1 tests Python language concepts and output predictions, and Round 2 features Python debugging challenges.',
  },
  {
    id: 'faq-5',
    category: 'Round 2',
    question: 'What happens in Round 2 — Debugging Arena?',
    answer: 'Qualifying participants receive 5 buggy Python programs. Using the built-in Monaco code editor, you must pinpoint the defects, fix them, and submit your solution to pass both visible and hidden test cases.',
  },
  {
    id: 'faq-6',
    category: 'Evaluation',
    question: 'How are debugging problems evaluated?',
    answer: 'Your submitted code is run inside an isolated Linux sandbox against predefined test suites. You can run visible tests any time. Final submission evaluates against all hidden cases to determine your score.',
  },
  {
    id: 'faq-7',
    category: 'Rules',
    question: 'What happens if I switch tabs or minimize the test window?',
    answer: 'The system has automated violation tracking. On the 1st and 2nd switch, a warning is recorded. On the 3rd violation, your test is automatically submitted and locked.',
  },
  {
    id: 'faq-8',
    category: 'Scoring',
    question: 'How are the final rankings and tie-breakers calculated?',
    answer: 'The final leaderboard uses weighted scores: Round 1 (30%), Round 2 (50%), and Round 3 (20%). In case of a tie, the team with the higher debugging score followed by lower submission time is prioritized.',
  },
  {
    id: 'faq-9',
    category: 'Venue',
    question: 'Where is the event conducted and what are the timings?',
    answer: 'Code Masters will take place on 29 September 2026 from 9:00 AM to 4:00 PM at Lecture Theatre (33220B), School of Computing, Vel Tech University, Avadi, Chennai.',
  },
  {
    id: 'faq-10',
    category: 'Contact',
    question: 'How can I contact the organizing committee?',
    answer: 'You can reach out to the student coordinators and faculty advisors at the Department of CSE (AI & ML), School of Computing, Vel Tech University via the official campus helpdesk.',
  },
];

export const defaultMCQQuestions: MCQQuestion[] = [
  {
    id: 'q1',
    category: 'Python Basics',
    difficulty: 'Easy',
    marks: 1,
    question: 'What is the output of the following Python snippet?',
    code_snippet: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))',
    option_a: '3',
    option_b: '4',
    option_c: 'Error: Cannot append to reference',
    option_d: 'None',
    correct_answer: 'B',
  },
  {
    id: 'q2',
    category: 'Data Types',
    difficulty: 'Medium',
    marks: 1,
    question: 'What will be printed by this nested list multiplication?',
    code_snippet: 'matrix = [[0] * 2] * 2\nmatrix[0][0] = 5\nprint(matrix)',
    option_a: '[[5, 0], [0, 0]]',
    option_b: '[[5, 0], [5, 0]]',
    option_c: '[[5, 5], [0, 0]]',
    option_d: '[[0, 0], [5, 0]]',
    correct_answer: 'B',
  },
  {
    id: 'q3',
    category: 'Functions',
    difficulty: 'Medium',
    marks: 1,
    question: 'What is the output when calling this function twice?',
    code_snippet: 'def append_to(item, target=[]):\n    target.append(item)\n    return target\n\nprint(append_to(1))\nprint(append_to(2))',
    option_a: '[1] then [2]',
    option_b: '[1] then [1, 2]',
    option_c: '[1, 2] then [1, 2]',
    option_d: 'TypeError: target cannot be mutable',
    correct_answer: 'B',
  },
  {
    id: 'q4',
    category: 'Output Prediction',
    difficulty: 'Easy',
    marks: 1,
    question: 'What will be the result of this boolean addition in Python?',
    code_snippet: 'print(True + True * False - True)',
    option_a: 'True',
    option_b: '0',
    option_c: '1',
    option_d: 'False',
    correct_answer: 'B',
  },
  {
    id: 'q5',
    category: 'Strings',
    difficulty: 'Easy',
    marks: 1,
    question: 'What is the value of result after string slicing?',
    code_snippet: 's = "VelTechAIML"\nresult = s[3:9:2]\nprint(result)',
    option_a: '"TeA"',
    option_b: '"TcA"',
    option_c: '"ThI"',
    option_d: '"TeAI"',
    correct_answer: 'A',
  },
  {
    id: 'q6',
    category: 'Dictionaries',
    difficulty: 'Medium',
    marks: 1,
    question: 'What is the length of dictionary d after these assignments?',
    code_snippet: 'd = {}\nd[1] = "A"\nd[1.0] = "B"\nd[True] = "C"\nprint(len(d), d[1])',
    option_a: '3, "A"',
    option_b: '1, "C"',
    option_c: '2, "B"',
    option_d: '1, "A"',
    correct_answer: 'B',
  },
  {
    id: 'q7',
    category: 'Control Flow',
    difficulty: 'Easy',
    marks: 1,
    question: 'What is the output of the following for...else block?',
    code_snippet: 'for i in range(1, 4):\n    if i == 5:\n        break\nelse:\n    print("Finished")\nprint("Done")',
    option_a: 'Only "Done"',
    option_b: '"Finished" then "Done"',
    option_c: 'SyntaxError on else',
    option_d: 'Infinite loop',
    correct_answer: 'B',
  },
  {
    id: 'q8',
    category: 'Tuples',
    difficulty: 'Medium',
    marks: 1,
    question: 'What happens when modifying a list inside an immutable tuple?',
    code_snippet: 't = (1, 2, [3, 4])\nt[2].append(5)\nprint(t)',
    option_a: 'TypeError: tuple does not support item assignment',
    option_b: '(1, 2, [3, 4, 5])',
    option_c: '(1, 2, [3, 4])',
    option_d: 'ValueError',
    correct_answer: 'B',
  },
  {
    id: 'q9',
    category: 'Exceptions',
    difficulty: 'Medium',
    marks: 1,
    question: 'What does this try...finally function return?',
    code_snippet: 'def test():\n    try:\n        return 1\n    finally:\n        return 2\n\nprint(test())',
    option_a: '1',
    option_b: '2',
    option_c: 'None',
    option_d: 'SyntaxError',
    correct_answer: 'B',
  },
  {
    id: 'q10',
    category: 'Scoping',
    difficulty: 'Medium',
    marks: 1,
    question: 'What happens when evaluating late-binding closures inside a comprehension?',
    code_snippet: 'funcs = [lambda: x for x in range(3)]\nprint([f() for f in funcs])',
    option_a: '[0, 1, 2]',
    option_b: '[2, 2, 2]',
    option_c: '[3, 3, 3]',
    option_d: 'NameError: x is not defined',
    correct_answer: 'B',
  },
  {
    id: 'q11',
    category: 'OOP',
    difficulty: 'Easy',
    marks: 1,
    question: 'In Python OOP, what must the __init__ method always return?',
    code_snippet: 'class Student:\n    def __init__(self, name):\n        self.name = name\n        # What is the default or allowed return value?',
    option_a: 'self',
    option_b: 'None',
    option_c: 'The class instance pointer',
    option_d: 'Any integer status code',
    correct_answer: 'B',
  },
  {
    id: 'q12',
    category: 'Operators',
    difficulty: 'Easy',
    marks: 1,
    question: 'What is the output of short-circuit logical evaluation?',
    code_snippet: 'a = []\nb = [1, 2]\nc = a or b and "CodeMasters"\nprint(c)',
    option_a: '[]',
    option_b: '[1, 2]',
    option_c: '"CodeMasters"',
    option_d: 'True',
    correct_answer: 'C',
  },
  {
    id: 'q13',
    category: 'Sets',
    difficulty: 'Medium',
    marks: 1,
    question: 'Which of the following elements cannot be stored in a Python set?',
    code_snippet: 's = {1, "Python", (1, 2), [3, 4]}',
    option_a: '(1, 2)',
    option_b: '"Python"',
    option_c: '[3, 4]',
    option_d: 'All of them can be stored',
    correct_answer: 'C',
  },
  {
    id: 'q14',
    category: 'Built-in Functions',
    difficulty: 'Hard',
    marks: 1,
    question: 'What are the return values of all([]) and any([]) respectively?',
    code_snippet: 'print(all([]), any([]))',
    option_a: 'False, False',
    option_b: 'True, False',
    option_c: 'False, True',
    option_d: 'True, True',
    correct_answer: 'B',
  },
  {
    id: 'q15',
    category: 'Output Prediction',
    difficulty: 'Hard',
    marks: 1,
    question: 'What is printed after unpacking variables in Python 3?',
    code_snippet: 'a, *b, c = [10, 20, 30, 40, 50]\nprint(b)',
    option_a: '(20, 30, 40)',
    option_b: '[20, 30, 40]',
    option_c: '20, 30, 40',
    option_d: 'Error: too many values to unpack',
    correct_answer: 'B',
  },
  {
    id: 'q16',
    category: 'OOP',
    difficulty: 'Hard',
    marks: 1,
    question: 'What is printed due to class variable shadowing?',
    code_snippet: 'class A:\n    count = 0\n\na1 = A()\na2 = A()\na1.count += 1\nprint(A.count, a1.count, a2.count)',
    option_a: '1 1 1',
    option_b: '0 1 0',
    option_c: '0 1 1',
    option_d: '1 1 0',
    correct_answer: 'B',
  },
  {
    id: 'q17',
    category: 'Memory & Identity',
    difficulty: 'Medium',
    marks: 1,
    question: 'Which statement is TRUE regarding "is" vs "==" in Python?',
    code_snippet: 'x = 256\ny = 256\nprint(x is y)\n\na = 1000\nb = 1000\nprint(a is b)',
    option_a: '"is" checks value equality; "==" checks memory address',
    option_b: '"is" checks object identity in memory; "==" checks value equivalence',
    option_c: 'Both are always strictly identical in Python 3',
    option_d: 'Neither checks memory address',
    correct_answer: 'B',
  },
  {
    id: 'q18',
    category: 'Generators',
    difficulty: 'Medium',
    marks: 1,
    question: 'What is the output of the generator expression when converted to list twice?',
    code_snippet: 'gen = (x * 2 for x in [1, 2, 3])\nprint(list(gen))\nprint(list(gen))',
    option_a: '[2, 4, 6] then [2, 4, 6]',
    option_b: '[2, 4, 6] then []',
    option_c: 'GeneratorError on second call',
    option_d: '[2, 4, 6] then None',
    correct_answer: 'B',
  },
  {
    id: 'q19',
    category: 'Strings',
    difficulty: 'Easy',
    marks: 1,
    question: 'What is the output of splitting a string with maxsplit parameter?',
    code_snippet: 'text = "Vel Tech School Computing"\nparts = text.split(" ", 2)\nprint(parts)',
    option_a: '["Vel", "Tech", "School", "Computing"]',
    option_b: '["Vel", "Tech", "School Computing"]',
    option_c: '["Vel Tech", "School Computing"]',
    option_d: '["Vel", "Tech"]',
    correct_answer: 'B',
  },
  {
    id: 'q20',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    marks: 1,
    question: 'What is the time complexity of looking up a key in a standard Python dict with no hash collisions?',
    code_snippet: '# d = {k: v for k, v in data}\n# value = d[target_key]',
    option_a: 'O(log n)',
    option_b: 'O(1) on average',
    option_c: 'O(n)',
    option_d: 'O(n log n)',
    correct_answer: 'B',
  },
  {
    id: 'q21',
    category: 'Functions',
    difficulty: 'Hard',
    marks: 1,
    question: 'What does this decorator do to the wrapped function’s output?',
    code_snippet: 'def power(f):\n    def wrapper(x):\n        return f(x) ** 2\n    return wrapper\n\n@power\ndef add_five(x):\n    return x + 5\n\nprint(add_five(3))',
    option_a: '14',
    option_b: '64',
    option_c: '34',
    option_d: '8',
    correct_answer: 'B',
  },
  {
    id: 'q22',
    category: 'Control Flow',
    difficulty: 'Medium',
    marks: 1,
    question: 'What is the output of this list comprehension with condition?',
    code_snippet: 'res = [x if x % 2 == 0 else -x for x in [1, 2, 3, 4]]\nprint(res)',
    option_a: '[-1, 2, -3, 4]',
    option_b: '[2, 4]',
    option_c: '[1, -2, 3, -4]',
    option_d: 'SyntaxError: else cannot precede for',
    correct_answer: 'A',
  },
  {
    id: 'q23',
    category: 'Built-in Functions',
    difficulty: 'Easy',
    marks: 1,
    question: 'What does enumerate(["a", "b", "c"], start=1) yield as its first element?',
    code_snippet: 'items = ["a", "b", "c"]\nfirst = next(iter(enumerate(items, start=1)))\nprint(first)',
    option_a: '(0, "a")',
    option_b: '(1, "a")',
    option_c: '("a", 1)',
    option_d: '[1, "a"]',
    correct_answer: 'B',
  },
  {
    id: 'q24',
    category: 'OOP',
    difficulty: 'Hard',
    marks: 1,
    question: 'What algorithm does Python 3 use for Method Resolution Order (MRO) in multiple inheritance?',
    code_snippet: 'class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n# How is D.__mro__ calculated?',
    option_a: 'Depth-First Search (DFS) strictly',
    option_b: 'C3 Superclass Linearization',
    option_c: 'Breadth-First Search (BFS)',
    option_d: 'Round-Robin Dispatch',
    correct_answer: 'B',
  },
  {
    id: 'q25',
    category: 'Output Prediction',
    difficulty: 'Hard',
    marks: 1,
    question: 'What is the output of zip on iterables of uneven length in Python 3?',
    code_snippet: 'a = [1, 2, 3]\nb = ["x", "y"]\nprint(list(zip(a, b)))',
    option_a: '[(1, "x"), (2, "y"), (3, None)]',
    option_b: '[(1, "x"), (2, "y")]',
    option_c: 'ValueError: lengths must match',
    option_d: '[(1, "x"), (2, "y"), (3, "")]',
    correct_answer: 'B',
  },
];

export const defaultDebuggingProblems: DebuggingProblem[] = [
  {
    id: 'prob-1',
    title: 'Problem 1: Pair Sum Target Finder',
    difficulty: 'Easy',
    marks: 20,
    time_limit_sec: 3,
    max_submissions: 5,
    description: `Given a list of integers and a target sum, your program must find two distinct numbers whose sum equals the target. Print the two numbers in ascending order separated by a space. If no such pair exists, print "NONE".

The provided starter code has a bug where it re-uses the exact same index or miscalculates when duplicate numbers are present. Fix the code so it passes all test cases.`,
    input_format: 'First line contains space-separated integers representing the list.\nSecond line contains a single integer target.',
    output_format: 'Two integers in ascending order separated by a single space, or "NONE".',
    constraints: '2 <= len(nums) <= 10^5\n-10^9 <= nums[i], target <= 10^9',
    starter_code: `import sys

def find_pair():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    # Buggy starter logic:
    # 1. Incorrectly uses single number twice
    # 2. Doesn't handle duplicate numbers properly
    target = int(input_data[-1])
    nums = [int(x) for x in input_data[:-1]]
    
    seen = {}
    found = None
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen and seen[complement] != i:
            found = sorted([num, complement])
            break
        seen[num] = i
        
    if found:
        print(f"{found[0]} {found[1]}")
    else:
        print("NONE")

if __name__ == "__main__":
    find_pair()
`,
    visible_examples: [
      {
        input: '2 7 11 15\n9',
        output: '2 7',
        explanation: '2 + 7 = 9. Output is sorted ascending.',
      },
      {
        input: '3 2 4\n6',
        output: '2 4',
        explanation: '2 + 4 = 6. Numbers are output in ascending order.',
      },
    ],
    hidden_test_cases: [
      {
        input: '3 3\n6',
        output: '3 3',
      },
      {
        input: '1 5 8 10 14\n20',
        output: 'NONE',
      },
      {
        input: '-5 -2 0 3 7 9\n-2',
        output: '-5 3',
      },
      {
        input: '0 4 3 0\n0',
        output: '0 0',
      },
    ],
  },
  {
    id: 'prob-2',
    title: 'Problem 2: Matrix Diagonal & Boundary Sum',
    difficulty: 'Medium',
    marks: 20,
    time_limit_sec: 3,
    max_submissions: 5,
    description: `Given an N x N square matrix, calculate the sum of elements that lie on the primary diagonal (from top-left to bottom-right) or the secondary diagonal (from top-right to bottom-left). Elements that intersect at the exact center (for odd values of N) must ONLY be counted once.

The starter code double-counts the center element and incorrectly indexes the secondary diagonal. Fix the algorithm.`,
    input_format: 'First line contains integer N.\nNext N lines contain N space-separated integers.',
    output_format: 'A single integer representing the sum.',
    constraints: '1 <= N <= 500\n-10^4 <= matrix[i][j] <= 10^4',
    starter_code: `import sys

def diagonal_sum():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    
    n = int(lines[0].strip())
    matrix = []
    for i in range(1, n + 1):
        matrix.append([int(x) for x in lines[i].split()])
        
    total = 0
    # BUG: Double counts intersecting center element in odd matrices
    for i in range(n):
        total += matrix[i][i]
        total += matrix[i][n - 1 - i]
        
    print(total)

if __name__ == "__main__":
    diagonal_sum()
`,
    visible_examples: [
      {
        input: '3\n1 2 3\n4 5 6\n7 8 9',
        output: '25',
        explanation: 'Primary: 1 + 5 + 9 = 15. Secondary: 3 + 5 + 7 = 15. Center 5 is shared, so total = 15 + 15 - 5 = 25.',
      },
      {
        input: '4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1',
        output: '8',
        explanation: 'Primary diagonal has four 1s (4), secondary has four 1s (4). No shared center for even N. Total = 8.',
      },
    ],
    hidden_test_cases: [
      {
        input: '1\n42',
        output: '42',
      },
      {
        input: '3\n5 0 2\n0 3 0\n4 0 6',
        output: '20',
      },
      {
        input: '5\n1 0 0 0 1\n0 2 0 2 0\n0 0 3 0 0\n0 4 0 4 0\n5 0 0 0 5',
        output: '27',
      },
      {
        input: '2\n-1 -2\n-3 -4',
        output: '-10',
      },
    ],
  },
  {
    id: 'prob-3',
    title: 'Problem 3: Longest Palindromic Substring',
    difficulty: 'Medium',
    marks: 20,
    time_limit_sec: 3,
    max_submissions: 5,
    description: `Given a string s, find and return the longest palindromic substring in s. If there are multiple palindromic substrings of the same maximum length, return the one that appears first.

The starter code only checks odd-length palindromes, crashes on 1-character strings, and produces index out-of-range errors. Debug and complete the code.`,
    input_format: 'A single non-empty string s without spaces.',
    output_format: 'The longest palindromic substring.',
    constraints: '1 <= len(s) <= 1000\ns consists of lowercase English letters and digits.',
    starter_code: `import sys

def longest_palindrome():
    s = sys.stdin.read().strip()
    if not s:
        print("")
        return
        
    best = s[0]
    
    # BUG: Fails to check even-length palindromes (like "abba")
    # and has off-by-one boundary comparison
    for i in range(len(s)):
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(best):
                best = s[l:r+1]
            l -= 1
            r += 1
            
    print(best)

if __name__ == "__main__":
    longest_palindrome()
`,
    visible_examples: [
      {
        input: 'babad',
        output: 'bab',
        explanation: '"bab" is the first longest palindrome of length 3.',
      },
      {
        input: 'cbbd',
        output: 'bb',
        explanation: '"bb" has length 2.',
      },
    ],
    hidden_test_cases: [
      {
        input: 'a',
        output: 'a',
      },
      {
        input: 'racecar',
        output: 'racecar',
      },
      {
        input: 'abacdfgdcaba',
        output: 'aba',
      },
      {
        input: 'forgeeksskeegfor',
        output: 'geeksskeeg',
      },
    ],
  },
  {
    id: 'prob-4',
    title: 'Problem 4: Overlapping Interval Merger',
    difficulty: 'Hard',
    marks: 20,
    time_limit_sec: 3,
    max_submissions: 5,
    description: `Given a collection of intervals, merge all overlapping intervals and print the resulting disjoint intervals in ascending order of their start times.

The starter code does not sort the intervals beforehand, causing consecutive overlapping intervals to remain unmerged when presented in unsorted order. Fix the logic to merge correctly.`,
    input_format: 'First line contains integer N (number of intervals).\nNext N lines each contain two space-separated integers: start and end.',
    output_format: 'Each merged interval on a new line with start and end separated by a space.',
    constraints: '1 <= N <= 10^4\n0 <= start <= end <= 10^6',
    starter_code: `import sys

def merge_intervals():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0].strip())
    intervals = []
    for i in range(1, n + 1):
        parts = [int(x) for x in lines[i].split()]
        intervals.append(parts)
        
    # BUG: Intervals are not sorted, so comparisons fail for unordered inputs
    merged = []
    for current in intervals:
        if not merged or merged[-1][1] < current[0]:
            merged.append(current)
        else:
            merged[-1][1] = max(merged[-1][1], current[1])
            
    for interval in merged:
        print(f"{interval[0]} {interval[1]}")

if __name__ == "__main__":
    merge_intervals()
`,
    visible_examples: [
      {
        input: '4\n1 3\n2 6\n8 10\n15 18',
        output: '1 6\n8 10\n15 18',
        explanation: '[1,3] and [2,6] overlap, merging into [1,6].',
      },
      {
        input: '2\n1 4\n4 5',
        output: '1 5',
        explanation: 'Boundary endpoints touch at 4, merging into [1,5].',
      },
    ],
    hidden_test_cases: [
      {
        input: '3\n4 7\n1 4\n8 12',
        output: '1 7\n8 12',
      },
      {
        input: '1\n5 10',
        output: '5 10',
      },
      {
        input: '4\n1 10\n2 3\n4 8\n9 12',
        output: '1 12',
      },
      {
        input: '3\n6 8\n1 9\n2 4',
        output: '1 9',
      },
    ],
  },
  {
    id: 'prob-5',
    title: 'Problem 5: Bracket Stack Balancer & Validator',
    difficulty: 'Hard',
    marks: 20,
    time_limit_sec: 3,
    max_submissions: 5,
    description: `Given a string containing parentheses '()', curly brackets '{}', and square brackets '[]', determine if the input string is valid.
A string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every closing bracket has a corresponding open bracket of the same type.
Print "VALID" if the string is valid, or "INVALID" otherwise.

The starter code causes an IndexError on empty stack pops, matches brackets backwards, and ignores trailing unclosed brackets. Debug and fix the implementation.`,
    input_format: 'A single line containing bracket characters.',
    output_format: '"VALID" or "INVALID".',
    constraints: '1 <= len(s) <= 10^5\ns consists only of \'()\', \'[]\', and \'{}\'.',
    starter_code: `import sys

def validate_brackets():
    s = sys.stdin.read().strip()
    if not s:
        print("VALID")
        return
        
    stack = []
    # BUG: Reverse bracket map and uncaught stack underflow
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:
            stack.append(char)
        else:
            # Crashes if stack is empty!
            top = stack.pop()
            if pairs.get(top) != char:
                print("INVALID")
                return
                
    # BUG: Fails to check if unclosed brackets remain in stack
    print("VALID")

if __name__ == "__main__":
    validate_brackets()
`,
    visible_examples: [
      {
        input: '()[]{}',
        output: 'VALID',
        explanation: 'All brackets close in proper order.',
      },
      {
        input: '(]',
        output: 'INVALID',
        explanation: 'Parenthesis closed with square bracket.',
      },
    ],
    hidden_test_cases: [
      {
        input: '([)]',
        output: 'INVALID',
      },
      {
        input: '{[]}',
        output: 'VALID',
      },
      {
        input: ']',
        output: 'INVALID',
      },
      {
        input: '(((((())))))',
        output: 'VALID',
      },
    ],
  },
];
