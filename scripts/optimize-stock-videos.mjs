// One-time: compress Mixkit (free licence) stock clips into hero loops.
// Usage: node scripts/optimize-stock-videos.mjs <srcDir>   (files named <id>.mp4)
import { execFileSync } from "child_process";
import ffmpeg from "ffmpeg-static";
import fs from "fs";
import path from "path";

const src = process.argv[2];
const out = path.resolve(import.meta.dirname, "../public/videos/stock");
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(src).filter((n) => n.endsWith(".mp4"))) {
  const id = path.basename(f, ".mp4");
  const mp4 = path.join(out, `${id}.mp4`);
  execFileSync(ffmpeg, ["-y", "-i", path.join(src, f), "-an", "-t", "14",
    "-vf", "scale='min(1920,iw)':-2,fps=25", "-c:v", "libx264", "-preset", "medium", "-crf", "27",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4], { stdio: "ignore" });
  execFileSync(ffmpeg, ["-y", "-ss", "1", "-i", mp4, "-vframes", "1", "-q:v", "4", path.join(out, `${id}.jpg`)], { stdio: "ignore" });
  console.log(id, (fs.statSync(mp4).size / 1e6).toFixed(1) + " MB");
}
