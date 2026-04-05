import { chromium } from "@playwright/test";
import path from "path";

const RECORDINGS_DIR = path.join(import.meta.dirname, "recordings");
const BASE_URL = process.env.BASE_URL ?? "http://localhost:5173";

async function capture() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: RECORDINGS_DIR,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  // Navigate to home page
  await page.goto(BASE_URL);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);

  // Type player name
  const nameInput = page.locator('input[placeholder="Your name"]').first();
  await nameInput.click();
  await nameInput.type("Player", { delay: 80 });
  await page.waitForTimeout(600);

  // Click Play vs Bot
  await page.locator('button:has-text("Play vs Bot")').click();

  // Wait for game to load and "Draw Blood!" modal
  await page.waitForURL("**/game/bot", { timeout: 5000 });
  await page.waitForTimeout(500);

  // Wait for the Draw Blood modal to appear and fade
  try {
    await page.locator('h2:has-text("Draw Blood!")').waitFor({ timeout: 3000 });
  } catch {
    // Modal may have already appeared and dismissed
  }
  await page.waitForTimeout(3500);

  // Show the board for a moment
  await page.waitForTimeout(1500);

  await context.close();
  await browser.close();

  console.log("✓ play-instantly captured");
}

capture().catch(console.error);
