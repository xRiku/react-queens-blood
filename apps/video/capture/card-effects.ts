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

  // Go directly to bot game
  await page.goto(`${BASE_URL}/game/bot`, {
    waitUntil: "networkidle",
  });

  // Wait for Draw Blood modal to pass
  await page.waitForTimeout(4000);

  // Wait for "Your Turn" modal
  try {
    await page.locator('h2:has-text("Your Turn")').waitFor({ timeout: 5000 });
  } catch {
    // May have already dismissed
  }
  await page.waitForTimeout(2500);

  // Select first card in hand
  const handCards = page.locator("ul li");
  const firstCard = handCards.first();
  await firstCard.click();
  await page.waitForTimeout(1000);

  // Find valid tiles (green-bordered) and hover over them to show preview
  const tiles = page.locator('[role="button"]');
  const tileCount = await tiles.count();

  // Hover over a few tiles to show the green ring highlights
  for (let i = 0; i < Math.min(tileCount, 8); i++) {
    const tile = tiles.nth(i);
    const box = await tile.boundingBox();
    if (box && box.width > 30) {
      await tile.hover();
      await page.waitForTimeout(400);
    }
  }

  // Click a valid tile to place the card
  for (let i = 0; i < tileCount; i++) {
    const tile = tiles.nth(i);
    const classes = await tile.getAttribute("class");
    if (classes?.includes("border-green")) {
      await tile.click();
      break;
    }
  }
  await page.waitForTimeout(2000);

  // Wait for bot turn and next turn
  await page.waitForTimeout(3000);

  // Try to place another card if it's our turn again
  try {
    await page.locator('h2:has-text("Your Turn")').waitFor({ timeout: 5000 });
    await page.waitForTimeout(2000);

    const secondCard = handCards.first();
    await secondCard.click();
    await page.waitForTimeout(800);

    // Hover and place on a valid tile
    for (let i = 0; i < tileCount; i++) {
      const tile = tiles.nth(i);
      const classes = await tile.getAttribute("class");
      if (classes?.includes("border-green")) {
        await tile.hover();
        await page.waitForTimeout(800);
        await tile.click();
        break;
      }
    }
    await page.waitForTimeout(2000);
  } catch {
    // Turn might not have come yet
  }

  await page.waitForTimeout(1500);

  await context.close();
  await browser.close();

  console.log("✓ card-effects captured");
}

capture().catch(console.error);
