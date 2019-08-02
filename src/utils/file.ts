import fs from 'fs';
import path from 'path';

export function readFile(filePath: string): Buffer {
  const realPath = path.resolve(filePath);

  return fs.readFileSync(realPath);
}
