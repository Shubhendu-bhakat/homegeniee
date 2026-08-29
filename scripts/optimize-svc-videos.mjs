// One-time conversion of the sourced stock clips used for the landing-page
// service-card hover videos: strip audio, cap width at 900 (cards are small,
// not full-bleed like the hero), re-encode at a moderate CRF, pull a poster.
import { execFileSync } from "child_process";
import ffmpeg from "ffmpeg-static";
import path from "path";

const SCRATCH = "C:/Users/HP/AppData/Local/Temp/claude/C--Users-HP-Downloads-homegeniee-react-homegeniee-react/445335dd-d74f-4e96-9820-15ee94611d09/scratchpad/svc-videos";
const outDir = path.resolve(import.meta.dirname, "../public/videos/services");

const sources = ["interior-design", "modular-kitchen", "architectural-civil", "facade-elevational", "green-scape"];

for (const slug of sources) {
  const src = path.join(SCRATCH, `${slug}.mp4`);
  const mp4 = path.join(outDir, `${slug}.mp4`);
  const poster = path.join(outDir, `${slug}-poster.jpg`);
  execFileSync(ffmpeg, ["-y", "-i", src, "-an", "-vf", "scale=900:-2,fps=25", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-movflags", "+faststart", "-t", "8", mp4]);
  execFileSync(ffmpeg, ["-y", "-i", mp4, "-vframes", "1", "-q:v", "3", poster]);
  console.log(`${slug}: done`);
}
