import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const canterburyFont = await readFile(join(__dirname, "fonts", "Canterbury.ttf"));
  const interFont = await readFile(join(__dirname, "fonts", "Inter-Regular.ttf"));
  const boardImage = await readFile(join(__dirname, "..", "..", "..", ".github", "game_board.png"));

  const boardImageDataUrl = `data:image/png;base64,${boardImage.toString("base64")}`;

  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#F9FAFB",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 330,
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 42,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Canterbury",
          fontSize: 136,
          lineHeight: 0.9,
          color: "#0F172A",
        }}
      >
        Queen&apos;s Blood
      </div>

      <div
        style={{
          position: "absolute",
          top: 184,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          fontFamily: "Inter",
          fontSize: 28,
          color: "#6B7280",
          letterSpacing: 0.2,
        }}
      >
        Fan-made multiplayer strategy card game inspired by FFVII Rebirth
      </div>

      <div
        style={{
          position: "absolute",
          top: 238,
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
            border: "2px solid #111827",
            backgroundColor: "#FFFFFF",
            fontFamily: "Inter",
            fontSize: 28,
            color: "#111827",
          }}
        >
          Play Now
        </div>
      </div>

      <img
        src={boardImageDataUrl}
        style={{
          position: "absolute",
          left: -240,
          top: 328,
          width: 1680,
          height: 383,
          opacity: 0.88,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 318,
          bottom: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.34) 42%, rgba(255,255,255,0.14) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 318,
          bottom: 0,
          width: 64,
          background: "linear-gradient(90deg, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 318,
          bottom: 0,
          width: 64,
          background: "linear-gradient(270deg, rgba(249,250,251,1) 0%, rgba(249,250,251,0) 100%)",
        }}
      />
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
