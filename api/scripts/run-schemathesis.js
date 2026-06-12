#!/usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const venvBin = path.join(root, ".venv", process.platform === "win32" ? "Scripts" : "bin");

const candidates = process.platform === "win32"
  ? ["schemathesis.exe", "schemathesis.cmd", "schemathesis"]
  : ["schemathesis"];

let exe;
for (const name of candidates) {
  const p = path.join(venvBin, name);
  if (fs.existsSync(p)) {
    exe = p;
    break;
  }
}

if (!exe) {
  console.error("Could not find schemathesis in .venv. Install it with `.venv/bin/python -m pip install schemathesis`");
  process.exit(1);
}

const tokenFile = path.join(root, ".fuzz_auth_token");
let token = "";
if (fs.existsSync(tokenFile)) {
  token = fs.readFileSync(tokenFile, "utf8").trim();
} else if (process.env.AUTH_TOKEN) {
  token = process.env.AUTH_TOKEN;
} else {
  console.warn("AUTH_TOKEN not found. Running Schemathesis without Authorization header.");
}

const reportsDir = path.join(root, "reports");
fs.mkdirSync(reportsDir, { recursive: true });

const args = ["run", "http://localhost:4000/api-docs.json"];
if (token) {
  args.push("-H", `Authorization: Bearer ${token}`);
}
args.push("--report-junit-path", "reports/fuzz-report.xml");

console.log("Running schemathesis with args:", args.join(" "));

const child = spawn(exe, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code));
