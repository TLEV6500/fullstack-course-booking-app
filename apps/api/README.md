# Notes on testing the API

To test the API, first setup the environment:

## One-time setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install schemathesis
```

> Note: this project uses a Python virtual environment for Schemathesis (fuzz/property tests). Schemathesis must be installed into `.venv`.

## Running the tests

The `test:fuzz` script boots an ephemeral test server and then runs Schemathesis against `/api-docs.json`. Schemathesis requires an Authorization header (Bearer token) for endpoints that need authentication — you must provide an `AUTH_TOKEN` environment variable before running the fuzz tests.

Examples

POSIX (Linux / macOS / WSL):
```bash
export AUTH_TOKEN="your_jwt_token_here"
npm run test:fuzz

# or as a one-liner
AUTH_TOKEN="your_jwt_token_here" npm run test:fuzz
```

PowerShell:
```powershell
$env:AUTH_TOKEN = "your_jwt_token_here"; npm run test:fuzz
```

Windows cmd:
```cmd
set AUTH_TOKEN=your_jwt_token_here && npm run test:fuzz
```

Using a `.env` file

You can also add `AUTH_TOKEN` to a `.env` file in the `api/` directory. The test helper will pick it up when running `start-server-and-test`. Example (DO NOT commit secrets):

```
# .env (example — keep private)
AUTH_TOKEN=eyJhbGciOi...your.jwt.token.here
```

Pre-create reports directory

Schemathesis writes a JUnit report to `reports/fuzz-report.xml`. Ensure the directory exists before running the tests:

```bash
mkdir -p reports
```

Quick run

```bash
# create venv and install schemathesis (once)
python3 -m venv .venv
source .venv/bin/activate
pip install schemathesis

# set your token and run all tests (unit, integration, fuzz)
AUTH_TOKEN="your_jwt_token_here" npm run test:all
```

If you prefer a cross-platform wrapper to avoid shell quoting/escaping for the Authorization header, ask and I can add a small Node script and update `package.json` accordingly.
