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

  // Wait for modals to pass
  await page.waitForTimeout(4000);
  try {
    await page.locator('h2:has-text("Your Turn")').waitFor({ timeout: 5000 });
  } catch {
    // May have already dismissed
  }
  await page.waitForTimeout(2500);

  // Select a card from hand
  const handCards = page.locator("ul li");
  await handCards.first().click();
  await page.waitForTimeout(1000);

  // Slowly hover across tiles to show green rings + preview
  const tiles = page.locator('[role="button"]');
  const tileCount = await tiles.count();

  for (let i = 0; i < tileCount; i++) {
    const tile = tiles.nth(i);
    const box = await tile.boundingBox();
    if (box && box.width > 30) {
      // Smooth hover with mouse movement
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 15,
      });
      await page.waitForTimeout(700);
    }
  }

  // Go back over valid tiles more slowly to emphasize the preview
  for (let i = 0; i < tileCount; i++) {
    const tile = tiles.nth(i);
    const classes = await tile.getAttribute("class");
    if (classes?.includes("border-green")) {
      const box = await tile.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
          steps: 20,
        });
        await page.waitForTimeout(1500);
      }
    }
  }

  await page.waitForTimeout(1000);

  await context.close();
  await browser.close();

  console.log("✓ preview captured");
}

capture().catch(console.error);
