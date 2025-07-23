/**
 * Utility to get the list of available GPU names from data.json.
 *
 * Usage:
 *   import getGPUS from './getGPUS';
 *   const gpus = getGPUS(); // returns string[]
 *
 * Returns:
 *   An array of GPU names (string[]) available in the system.
 *   Reads data from ../data.json (relative to this file).
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getJSON(fileName: string): any {
    return JSON.parse(readFileSync(join(__dirname, fileName), 'utf8'));
}

export default function getGPUS(): string[] {
    const data = getJSON("../data.json");
    return Object.keys(data.gpus);
}


