import { $ } from 'bun';

import '../src/manifest.json';
import '../src/options/index.html';

await $`cp ./src/manifest.json ./out/manifest.json`;
await $`cp ./src/options/index.html ./out/options.html`;

const outputLog = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  console.log(`[${hours}:${minutes}:${seconds}]`, 'Copied files');
}
outputLog();
