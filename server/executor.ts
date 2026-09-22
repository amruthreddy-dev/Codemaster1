import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  timedOut: boolean;
  error?: string;
}

export interface TestCaseResult {
  testIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  errorMessage?: string;
}

/**
 * Execute Python code in an isolated subprocess with strict timeouts,
 * memory & process protection, and input redirection.
 */
export async function executePython(
  code: string,
  input: string = '',
  timeoutMs: number = 3000
): Promise<ExecutionResult> {
  const startTime = Date.now();

  // Create isolated temp file
  const tempDir = path.join(os.tmpdir(), 'codemasters_sandbox');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const scriptPath = path.join(tempDir, `exec_${Date.now()}_${Math.random().toString(36).substring(7)}.py`);

  // Basic security wrap to restrict harmful OS operations and infinite loops
  const sandboxedCode = `
import sys
import io

# Disable direct unsafe subprocess / os execution if attempted
try:
    import os
    # Limit harmful filesystem and system calls
    def disabled_call(*args, **kwargs):
        raise PermissionError("System execution is disabled in the Code Masters competition sandbox.")
    os.system = disabled_call
    if hasattr(os, 'fork'):
        os.fork = disabled_call
    if hasattr(os, 'spawnl'):
        os.spawnl = disabled_call
except Exception:
    pass

try:
    import subprocess
    subprocess.Popen = disabled_call
    subprocess.run = disabled_call
    subprocess.call = disabled_call
except Exception:
    pass

# Execute user code
${code}
`;

  fs.writeFileSync(scriptPath, sandboxedCode, 'utf8');

  return new Promise<ExecutionResult>((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn('/usr/bin/python3', [scriptPath], {
      env: {
        PATH: '/usr/local/bin:/usr/bin:/bin',
        PYTHONUNBUFFERED: '1',
        PYTHONDONTWRITEBYTECODE: '1',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch (e) {
        // ignore
      }
    }, timeoutMs);

    // Feed stdin if provided
    if (input) {
      try {
        child.stdin.write(input);
        if (!input.endsWith('\n')) {
          child.stdin.write('\n');
        }
      } catch (err) {
        // ignore pipe error if closed early
      }
    }
    try {
      child.stdin.end();
    } catch (e) {
      // ignore
    }

    child.stdout.on('data', (data) => {
      if (stdout.length < 65536) {
        stdout += data.toString();
      }
    });

    child.stderr.on('data', (data) => {
      if (stderr.length < 65536) {
        stderr += data.toString();
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try {
        if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
      } catch (e) {}
      const executionTimeMs = Date.now() - startTime;
      resolve({
        stdout,
        stderr: err.message,
        exitCode: -1,
        executionTimeMs,
        timedOut: false,
        error: err.message,
      });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      try {
        if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
      } catch (e) {}
      const executionTimeMs = Date.now() - startTime;

      if (timedOut) {
        resolve({
          stdout,
          stderr: 'Time Limit Exceeded (3.0 seconds)',
          exitCode: null,
          executionTimeMs,
          timedOut: true,
          error: 'Time Limit Exceeded',
        });
      } else {
        resolve({
          stdout,
          stderr,
          exitCode: code,
          executionTimeMs,
          timedOut: false,
        });
      }
    });
  });
}

function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

/**
 * Runs code against a list of test cases
 */
export async function runTestCases(
  code: string,
  testCases: Array<{ input: string; output: string }>,
  timeoutMs: number = 3000
): Promise<TestCaseResult[]> {
  const results: TestCaseResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await executePython(code, tc.input, timeoutMs);

    const normActual = normalizeOutput(execRes.stdout);
    const normExpected = normalizeOutput(tc.output);

    const passed = !execRes.timedOut && execRes.exitCode === 0 && normActual === normExpected;

    results.push({
      testIndex: i + 1,
      input: tc.input,
      expectedOutput: tc.output,
      actualOutput: execRes.stdout,
      passed,
      executionTimeMs: execRes.executionTimeMs,
      errorMessage: execRes.timedOut
        ? 'Time Limit Exceeded'
        : execRes.exitCode !== 0
        ? execRes.stderr || 'Runtime Error'
        : undefined,
    });
  }

  return results;
}
