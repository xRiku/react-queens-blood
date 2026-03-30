import { staticFile, continueRender, delayRender } from "remotion";

let loaded = false;

export const loadFonts = () => {
  if (loaded) return;
  loaded = true;

  const waitForFont = delayRender("Loading Canterbury font");
  const font = new FontFace(
    "Canterbury Regular",
    `url(${staticFile("fonts/Canterbury.ttf")})`
  );

  font
    .load()
    .then(() => {
      document.fonts.add(font);
      continueRender(waitForFont);
    })
    .catch((err) => {
      console.error("Failed to load Canterbury font:", err);
      continueRender(waitForFont);
    });
};
