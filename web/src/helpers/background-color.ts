import { Color, RGBColor, color } from "d3";

const NOON_INNER = color("#bdddff") as RGBColor;
const NOON_OUTER = color("#b5ecd6") as RGBColor;
export const backgroundColourByTime = (hour: number) => {
  const phase = Math.sin((hour * Math.PI) / 23);
  const inner_r =
    NOON_INNER.r + (255 - NOON_INNER?.r) * (1 - phase) - (1 - phase) * 200;
  const inner_g =
    NOON_INNER.g - (NOON_INNER.g / 3) * (1 - phase) - (1 - phase) * 200;
  const inner_b =
    NOON_INNER.b - (NOON_INNER?.b / 3) * (1 - phase) - (1 - phase) * 150;
  const outer_r =
  NOON_OUTER.r + (255 - NOON_OUTER?.r) * (1 - phase) - (1 - phase) * 200;
  const outer_g =
    NOON_OUTER.g - (NOON_OUTER.g / 3) * (1 - phase) - (1 - phase) * 200;
  const outer_b =
  NOON_OUTER.b - (NOON_OUTER?.b / 3) * (1 - phase) - (1 - phase) * 150;
  return {
    innerColour: NOON_INNER.formatRgb(),
    outerColour: NOON_OUTER.formatRgb()
  };
};
