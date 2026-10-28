// The technical specs of a shot, as AYON keeps them in attributes.

export type Specs = {
  frameStart?: number;
  frameEnd?: number;
  handleStart?: number;
  handleEnd?: number;
  fps?: number;
  resolutionWidth?: number;
  resolutionHeight?: number;
  pixelAspect?: number;
};

/** Frames from frameStart to frameEnd, both included. */
export const frameCount = ({ frameStart, frameEnd }: Specs) =>
  frameStart != null && frameEnd != null ? frameEnd - frameStart + 1 : undefined;

/** `00:00:04:12` for 112 frames at 25 fps. */
export const timecode = (frames: number, fps: number) => {
  const rate = Math.round(fps);
  const pad = (value: number) => String(value).padStart(2, "0");
  const seconds = Math.floor(frames / rate);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60, frames % rate]
    .map(pad)
    .join(":");
};
