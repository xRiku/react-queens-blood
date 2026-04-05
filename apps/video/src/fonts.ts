import { loadFont as loadGoogleFont } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: titleFont } = loadGoogleFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

const { fontFamily: bodyFont } = loadInter("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

export { titleFont, bodyFont };
