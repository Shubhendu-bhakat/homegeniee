// One-time conversion of the client-supplied hero footage into web-ready
// clips: strip audio (autoplay requires it anyway), cap width at 1280,
// re-encode at a moderate CRF, and pull a poster frame for each. Re-run by
// hand if new source footage shows up — not wired into the build.
import { execFileSync } from "child_process";
import ffmpeg from "ffmpeg-static";
import path from "path";

const outDir = path.resolve(import.meta.dirname, "../public/videos");

const sources = [
  { in: "C:/Users/HP/Downloads/video2_1767961591.mp4", out: "hero-1" },
  { in: "C:/Users/HP/Downloads/video3_1767961591.mp4", out: "hero-2" },
  { in: "C:/Users/HP/Downloads/video_1766850336.mp4", out: "hero-3" },
];

for (const s of sources) {
  const mp4 = path.join(outDir, `${s.out}.mp4`);
  const poster = path.join(outDir, `${s.out}-poster.jpg`);
  execFileSync(ffmpeg, ["-y", "-i", s.in, "-an", "-vf", "scale=1280:-2,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-movflags", "+faststart", mp4]);
  execFileSync(ffmpeg, ["-y", "-i", mp4, "-vframes", "1", "-q:v", "3", poster]);
  console.log(`${s.out}: done`);
}
