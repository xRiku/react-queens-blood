import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const canterburyFont = await readFile(join(__dirname, "fonts", "Canterbury.ttf"));
  const interFont = await readFile(join(__dirname, "fonts", "Inter-Regular.ttf"));
  const boardRaw = await readFile(join(__dirname, "..", "..", "..", ".github", "game_board_filled.png"));

  // Crop just the 3×5 board grid from the screenshot,
  // stripping title, player labels, and card hand.
  // Resize to 1200px wide, preserving aspect ratio (no distortion).
  const boardBuffer = await sharp(boardRaw)
    .extract({ left: 460, top: 140, width: 1980, height: 880 })
    .resize(1200, 340, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const boardImageDataUrl = `data:image/png;base64,${boardBuffer.toString("base64")}`;

  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* White background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#f5f5f5",
        }}
      />

      {/* Board image anchored to bottom, full width, no distortion */}
      <img
        src={boardImageDataUrl}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1200,
        }}
      />

      {/* Fade the top edge of the board into the white background */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(180deg, #f5f5f5 0%, rgba(245,245,245,0) 100%)",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Canterbury",
          fontSize: 136,
          lineHeight: 0.9,
          color: "#000000",
        }}
      >
        Queen&apos;s Blood
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Inter",
          fontSize: 26,
          color: "rgba(0,0,0,0.65)",
          letterSpacing: 0.2,
        }}
      >
        Fan-made multiplayer strategy card game inspired by FFVII Rebirth
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          top: 255,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            borderRadius: 999,
            padding: "12px 30px",
            border: "2px solid rgba(0,0,0,0.90)",
            backgroundColor: "rgba(255,255,255,0.70)",
            fontFamily: "Inter",
            fontSize: 26,
            color: "#000000",
          }}
        >
          Play Now
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Canterbury",
          data: canterburyFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interFont,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const pngBuffer = resvg.render().asPng();

  const outputDir = join(__dirname, "..", "public");
  await mkdir(outputDir, { recursive: true });

  const outputPath = join(outputDir, "og-image.png");
  await writeFile(outputPath, pngBuffer);

  console.log(`OG image generated at: ${outputPath}`);
  console.log(`Size: ${pngBuffer.length} bytes`);
}

main().catch(console.error);
