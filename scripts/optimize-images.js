import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join, parse, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputDir = join(__dirname, "../public");
const outputDir = join(__dirname, "../public/bookmakers-optimized");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const files = readdirSync(inputDir);

for (const file of files) {
  const input = join(inputDir, file);
  const name = parse(file).name;

  try {
    await sharp(input)
      .resize(80, 80, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .webp({ quality: 85 })
      .toFile(join(outputDir, `${name}.webp`));

    console.log(`✔ ${file}`);
  } catch (err) {
    console.error(`✖ Failed: ${file}`, err.message);
  }
}
