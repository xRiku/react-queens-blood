import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const CAPTURE_DIR = import.meta.dirname;
const RECORDINGS_DIR = path.join(CAPTURE_DIR, "recordings");
const PUBLIC_DIR = path.join(CAPTURE_DIR, "..", "public");

const scripts = [
  "play-instantly",
  "card-effects",
  "preview",
  "deck-builder",
];

function run(cmd: string) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: path.join(CAPTURE_DIR, "..") });
}

async function main() {
  // Ensure directories exist
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  for (const script of scripts) {
    console.log(`\n--- Capturing: ${script} ---\n`);

    // Clear old recordings so we can find the new one
    const before = new Set(fs.readdirSync(RECORDINGS_DIR));

    // Run the capture script
    run(`npx tsx capture/${script}.ts`);

    // Find the new recording file(s)
    const after = fs.readdirSync(RECORDINGS_DIR);
    const newFiles = after.filter((f) => !before.has(f) && f.endsWith(".webm"));

    if (newFiles.length === 0) {
      console.error(`⚠ No recording found for ${script}`);
      continue;
    }

    // Take the most recent new file
    const webmFile = path.join(RECORDINGS_DIR, newFiles[newFiles.length - 1]);
    const mp4File = path.join(PUBLIC_DIR, `${script}.mp4`);

    // Convert webm → mp4 with re-encoding for Remotion compatibility
    console.log(`\nConverting ${path.basename(webmFile)} → ${script}.mp4`);
    run(
      `npx remotion ffmpeg -y -i "${webmFile}" -c:v libx264 -crf 18 -pix_fmt yuv420p -an "${mp4File}"`
    );

    console.log(`✓ ${script}.mp4 saved to public/`);
  }

  console.log("\n=== All captures complete ===");
  console.log("Files in public/:");
  fs.readdirSync(PUBLIC_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .forEach((f) => console.log(`  ${f}`));
}

main().catch(console.error);
