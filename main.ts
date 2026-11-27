// DompetKeluarga — hand-in program for make.fun's best-household-budget-site
// bounty. It copies app/ and screenshots/ from this repository into the
// output directory and writes /output/dossier.json with buildDossier from
// the kit's frontend library (vendor/makefun-frontend.ts, copied unchanged).
// Runs twice with identical bytes: copying files and buildDossier are both
// deterministic. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(join(root, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(root, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    // This bounty's gate allows 3 to 4 screenshots, each at most 256 KiB.
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
