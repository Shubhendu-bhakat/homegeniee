import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = path.resolve(import.meta.dirname, "../public/img/services");
const MAX_W = 1000;

const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));

for (const f of files) {
  const src = path.join(dir, f);
  const before = fs.statSync(src).size;
  const meta = await sharp(src).metadata();
  const outName = f.replace(/\.(png|jpe?g)$/i, ".jpg");
  const outPath = path.join(dir, outName);

  await sharp(src)
    .resize({ width: Math.min(MAX_W, meta.width), withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(outPath + ".tmp");
  fs.renameSync(outPath + ".tmp", outPath);

  if (outName !== f) fs.unlinkSync(src);

  const after = fs.statSync(outPath).size;
  console.log(`${f} -> ${outName}: ${meta.width}x${meta.height} ${(before / 1024).toFixed(0)}kb -> ${(after / 1024).toFixed(0)}kb`);
}
