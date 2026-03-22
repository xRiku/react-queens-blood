import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { ReactNode } from "react";

const __dirname = dirname(fileURLToPath(import.meta.url));

const GREEN = "#4ADE80"; // green-400
const RED = "#F87171"; // red-400
const YELLOW = "#FACC15"; // yellow-400
const GRAY_800 = "#1F2937";
const GRAY_400 = "#9CA3AF";
const GRAY_500 = "#6B7280";
const BLACK = "#000000";
const WHITE = "#FFFFFF";

function ScoreCircle({
  color,
  score,
}: {
  color: string;
  score: number;
}): ReactNode {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `3px solid ${YELLOW}`,
      }}
    >
      <span
        style={{
          fontFamily: "Inter",
          fontSize: 22,
          fontWeight: 500,
          color: WHITE,
        }}
      >
        {score}
      </span>
    </div>
  );
}

function BoardTile({
  color,
  hasCard,
}: {
  color?: string;
  hasCard?: boolean;
}): ReactNode {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        backgroundColor: color || WHITE,
        border: `2px solid ${BLACK}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hasCard && (
        <div
          style={{
            width: 52,
            height: 64,
            backgroundColor: WHITE,
            border: `1px solid ${GRAY_400}`,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor:
                      i === 4 ? WHITE : [1, 5, 7].includes(i) ? YELLOW : GRAY_400,
                    border: `0.5px solid ${BLACK}`,
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              height: 14,
              backgroundColor: BLACK,
              borderTop: `1px solid ${YELLOW}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 7,
                color: YELLOW,
              }}
            >
              Card
            </span>
          </div>
        </div>
      )}
    </div>
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
        backgroundColor: WHITE,
        position: "relative",
      }}
    >
      {/* Title — matching app header exactly */}
      <div
        style={{
          fontFamily: "Canterbury",
          fontSize: 80,
          color: BLACK,
          lineHeight: 1.1,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Queen's Blood
      </div>

      {/* Mini board row — 1 row of the game board */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 36,
        }}
      >
        {/* P1 score column */}
        <div
          style={{
            width: 80,
            height: 76,
            backgroundColor: GRAY_800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${BLACK}`,
          }}
        >
          <ScoreCircle color={GREEN} score={5} />
        </div>

        {/* Board tiles */}
        <BoardTile color={GREEN} hasCard />
        <BoardTile />
        <BoardTile hasCard />
        <BoardTile />
        <BoardTile color={RED} hasCard />

        {/* P2 score column */}
        <div
          style={{
            width: 80,
            height: 76,
            backgroundColor: GRAY_800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${BLACK}`,
          }}
        >
          <ScoreCircle color={RED} score={3} />
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 24,
          color: GRAY_500,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        A Strategic Card Game
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 16,
          color: GRAY_400,
          letterSpacing: 1,
        }}
      >
        Inspired by Final Fantasy VII Rebirth
      </div>

      {/* Bottom links hint — mirroring home page */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          display: "flex",
          gap: 24,
        }}
      >
        {["How to Play", "All Cards", "Deck Builder"].map((label) => (
          <span
            key={label}
            style={{
              fontFamily: "Inter",
              fontSize: 14,
              color: GRAY_500,
              textDecoration: "underline",
            }}
          >
            {label}
          </span>
        ))}
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
