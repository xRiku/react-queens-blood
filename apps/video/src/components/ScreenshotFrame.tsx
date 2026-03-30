import { Img, staticFile } from "remotion";

type ScreenshotFrameProps = {
  src: string;
  opacity?: number;
  scale?: number;
  translateY?: number;
  translateX?: number;
  borderRadius?: number;
  objectFit?: "contain" | "cover";
  style?: React.CSSProperties;
};

export const ScreenshotFrame: React.FC<ScreenshotFrameProps> = ({
  src,
  opacity = 1,
  scale = 1,
  translateY = 0,
  translateX = 0,
  borderRadius = 0,
  objectFit = "contain",
  style,
}) => {
  return (
    <Img
      src={staticFile(`screenshots/${src}`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px) translateX(${translateX}px)`,
        borderRadius,
        ...style,
      }}
    />
  );
};
