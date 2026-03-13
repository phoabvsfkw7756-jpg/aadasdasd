import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_LANG = 'en';
const DICT_DIR = path.join(__dirname, '..', 'dictionaries');
const CONCURRENCY_LIMIT = 5;
const REQUEST_DELAY = 300;

const getTargetLanguages = () => {
    const files = fs.readdirSync(DICT_DIR);
    return files
        .filter((file) => file.endsWith('.json') && file !== `${SOURCE_LANG}.json`)
        .map((file) => path.basename(file, '.json'));
};

const extractStrings = (obj, path = []) => {
    const results = [];
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = [...path, key];
        if (typeof value === 'string') {
            results.push({ path: currentPath, value });
        } else if (typeof value === 'object' && value !== null) {
            results.push(...extractStrings(value, currentPath));
        }
    }
    return results;
};

const getValueByPath = (obj, path) => {
    let current = obj;
    for (const key of path) {
        if (current === undefined || current === null) return undefined;
        current = current[key];
    }
    return current;
};

const setValueByPath = (obj, path, value) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) current[key] = {};
        current = current[key];
    }
    current[path[path.length - 1]] = value;
};

const translateText = async (text, targetLang) => {
    if (!text || text.trim() === '') return text;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${SOURCE_LANG}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return (
            data?.[0]
                ?.map((item) => item[0])
                .filter(Boolean)
                .join('') || text
        );
    } catch (error) {
        console.error(`  Translation error for "${text.substring(0, 20)}...": ${error.message}`);
        return text;
    }
};

const translateLanguage = async (sourceData, strings, lang) => {
    const outputFile = path.join(DICT_DIR, `${lang}.json`);
    let targetData = {};
    if (fs.existsSync(outputFile)) {
        try {
            targetData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
        } catch {
            console.warn(`  Warning: Could not parse existing ${lang}.json, starting fresh.`);
        }
    }

    const translated = structuredClone(targetData);

    const toTranslate = strings.filter(({ path, value }) => {
        if (/^\{[\w()]+\}$/.test(value)) return false;

        const existingValue = getValueByPath(targetData, path);
        return existingValue === undefined || existingValue === null;
    });

    if (toTranslate.length === 0) {
        console.log(`  All strings already translated for ${lang}.`);
        return translated;
    }

    console.log(`  Translating ${toTranslate.length} new strings for ${lang}...`);

    for (let i = 0; i < toTranslate.length; i += CONCURRENCY_LIMIT) {
        const batch = toTranslate.slice(i, i + CONCURRENCY_LIMIT);
        await Promise.all(
            batch.map(async ({ path, value }) => {
                const translatedText = await translateText(value, lang);
                setValueByPath(translated, path, translatedText);
            })
        );

        const progress = Math.min(i + CONCURRENCY_LIMIT, toTranslate.length);
        console.log(`  Progress: ${progress}/${toTranslate.length}`);

        if (i + CONCURRENCY_LIMIT < toTranslate.length) {
            await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY));
        }
    }

    return translated;
};

const languages = getTargetLanguages();
const sourceFile = path.join(DICT_DIR, `${SOURCE_LANG}.json`);
const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
const strings = extractStrings(sourceData);

for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    console.log(`[${i + 1}/${languages.length}] ${lang}...`);

    const translated = await translateLanguage(sourceData, strings, lang);
    const outputFile = path.join(DICT_DIR, `${lang}.json`);

    const sortObject = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;
        return Object.keys(obj).sort((a, b) => a.localeCompare(b)).reduce((acc, key) => {
            acc[key] = sortObject(obj[key]);
            return acc;
        }, {});
    };

    fs.writeFileSync(outputFile, JSON.stringify(sortObject(translated), null, 4));
}
