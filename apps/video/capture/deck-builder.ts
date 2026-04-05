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

  // Navigate to deck builder
  await page.goto(`${BASE_URL}/deck-builder`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1000);

  // Get all available card buttons in the grid
  // DeckBuilderCard components are <button> elements with aspect-[3/5]
  const cards = page.locator("button.aspect-\\[3\\/5\\]");
  const cardCount = await cards.count();

  // Click several cards to add them to the deck, with pauses
  const cardsToAdd = Math.min(8, cardCount);
  for (let i = 0; i < cardsToAdd; i++) {
    const card = cards.nth(i);
    const isDisabled = await card.isDisabled();
    if (!isDisabled) {
      await card.click();
      await page.waitForTimeout(500);
    }
  }

  // Pause to show the filled deck slots
  await page.waitForTimeout(2000);

  // Scroll up a bit to show the deck grid nicely
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(2000);

  await context.close();
  await browser.close();

  console.log("✓ deck-builder captured");
}

capture().catch(console.error);
