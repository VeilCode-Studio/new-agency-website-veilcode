import { readFile } from "fs/promises";
import path from "path";
import { importSeoPagesFromPayload } from "../lib/seo/seoPageImport";

async function main() {
  const args = new Set(process.argv.slice(2));
  const publishMode = args.has("--draft") ? "draft" : "live";

  const seedPath = path.join(process.cwd(), "docs", "seo", "veilcode-seo-page-seed-data.json");
  const raw = await readFile(seedPath, "utf8");
  const pages = JSON.parse(raw) as unknown;

  const { summary, results } = await importSeoPagesFromPayload({
    pages,
    publishMode,
  });

  console.log(
    JSON.stringify(
      {
        publishMode,
        total: summary.total,
        create: summary.create,
        update: summary.update,
        errors: summary.errors,
        warnings: summary.warnings,
        results,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
