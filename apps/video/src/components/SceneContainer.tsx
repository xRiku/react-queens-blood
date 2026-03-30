import { AbsoluteFill } from "remotion";
import { COLORS } from "../lib/theme";
import { loadFonts } from "../lib/fonts";

type SceneContainerProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export const SceneContainer: React.FC<SceneContainerProps> = ({
  backgroundColor = COLORS.black,
  children,
}) => {
  loadFonts();

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        overflow: "hidden",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
