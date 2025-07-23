import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ProviderInfo {
    value: string;
    providerName: string;
}

export function getJSON(fileName: string): any {
    return JSON.parse(readFileSync(join(__dirname, fileName), 'utf8'));
}

export function getProviders(): ProviderInfo[] {
    const data = getJSON("../data.json");
    const providers = Object.keys(data.providers);

    const providerList: ProviderInfo[] = [];

    for (const prov of providers) {
        const keys = Object.keys(data.providers[prov]);
        if (keys.length < 2) {
            continue;
        }
        try {
            const name = data.providers[prov][keys[1]]["providerName"];
            providerList.push({
                value: prov,
                providerName: name
            });
        } catch (error) {
            continue;
        }
    }
    return providerList;
}