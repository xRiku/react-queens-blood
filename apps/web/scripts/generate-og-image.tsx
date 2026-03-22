import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { ReactNode } from "react";

const __dirname = dirname(fileURLToPath(import.meta.url));

const YELLOW = "#FACC15";
const DARK_BG = "#111827"; // gray-900
const CARD_BG = "#1F2937"; // gray-800
const CARD_CELL = "#374151"; // gray-700
const WHITE = "#FFFFFF";

// 5x5 card grid pattern (1 = yellow highlight, 0 = dark cell, 2 = center/white)
const CARD_PATTERN_1 = [
  [0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 2, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
];

const CARD_PATTERN_2 = [
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 2, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
];

function CardGrid({
  pattern,
  size,
}: {
  pattern: number[][];
  size: number;
}): ReactNode {
  const cellSize = Math.floor(size / 5);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: `2px solid ${YELLOW}`,
        borderRadius: 8,
        overflow: "hidden",
        opacity: 0.6,
      }}
    >
      {pattern.map((row, ri) => (
        <div key={ri} style={{ display: "flex" }}>
          {row.map((cell, ci) => (
            <div
              key={ci}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor:
                  cell === 1 ? YELLOW : cell === 2 ? WHITE : CARD_CELL,
                border: `1px solid ${DARK_BG}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PawnDot({
  color,
  size,
}: {
  color: string;
  size: number;
}): ReactNode {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        border: `2px solid ${DARK_BG}`,
      }}
    />
  );
}

async function main() {
  const canterburyFont = await readFile(
    join(__dirname, "fonts", "Canterbury.ttf")
  );
  const interFont = await readFile(
    join(__dirname, "fonts", "Inter-Regular.ttf")
  );

  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: DARK_BG,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow behind title */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(250,204,21,0.12) 0%, rgba(250,204,21,0) 70%)",
        }}
      />

      {/* Decorative card grids - left side */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 120,
          display: "flex",
          opacity: 0.4,
        }}
      >
        <CardGrid pattern={CARD_PATTERN_1} size={150} />
      </div>

      {/* Decorative card grids - right side */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 120,
          display: "flex",
          opacity: 0.4,
        }}
      >
        <CardGrid pattern={CARD_PATTERN_2} size={150} />
      </div>

      {/* Decorative pawns - left */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          display: "flex",
          gap: 8,
        }}
      >
        <PawnDot color="#4ADE80" size={24} />
        <PawnDot color="#4ADE80" size={24} />
      </div>

      {/* Decorative pawns - right */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 80,
          display: "flex",
          gap: 8,
        }}
      >
        <PawnDot color="#F87171" size={24} />
        <PawnDot color="#F87171" size={24} />
      </div>

      {/* Score dots - left bottom */}
      <div
        style={{
          position: "absolute",
          left: 110,
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <PawnDot color="#4ADE80" size={32} />
        <PawnDot color="#4ADE80" size={32} />
        <PawnDot color="#4ADE80" size={32} />
      </div>

      {/* Score dots - right bottom */}
      <div
        style={{
          position: "absolute",
          right: 110,
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <PawnDot color="#F87171" size={32} />
        <PawnDot color="#F87171" size={32} />
        <PawnDot color="#F87171" size={32} />
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "Canterbury",
            fontSize: 96,
            color: YELLOW,
            lineHeight: 1.1,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          Queen's Blood
        </div>

        {/* Decorative line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 120,
              height: 2,
              background: `linear-gradient(to right, transparent, ${YELLOW})`,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: YELLOW,
            }}
          />
          <div
            style={{
              width: 120,
              height: 2,
              background: `linear-gradient(to left, transparent, ${YELLOW})`,
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 28,
            color: WHITE,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          A Strategic Card Game
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 18,
            color: "#9CA3AF",
            marginTop: 16,
            letterSpacing: 2,
          }}
        >
          Inspired by Final Fantasy VII Rebirth
        </div>
      </div>

      {/* Bottom decorative bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1200,
          height: 4,
          background: `linear-gradient(to right, transparent, ${YELLOW}, transparent)`,
        }}
      />

      {/* Top decorative bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 4,
          background: `linear-gradient(to right, transparent, ${YELLOW}, transparent)`,
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
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outputDir = join(__dirname, "..", "public");
  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, "og-image.png");
  await writeFile(outputPath, pngBuffer);

  console.log(`OG image generated at: ${outputPath}`);
  console.log(`Size: ${pngBuffer.length} bytes`);
}

main().catch(console.error);
