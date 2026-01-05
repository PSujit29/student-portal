const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, 'all_model.txt');
const searchExtension = '.model.js';
const constantsPath = path.join(__dirname, 'shared', 'utils', 'constants.js');

/**
 * Recursively finds files and appends content
 */
function combineModels(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            combineModels(filePath);
        } else if (file.endsWith(searchExtension) && filePath !== outputFile && filePath !== __filename) {
            appendToFile(filePath, 'MODEL');
        }
    });
}

/**
 * Helper to append content with a clear header
 */
function appendToFile(filePath, type) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(__dirname, filePath);
        
        const divider = `\n\n// ==========================================\n`;
        const header = `// TYPE: ${type} | FILE: ${relativePath}\n`;
        const footer = `// ==========================================\n`;
        
        fs.appendFileSync(outputFile, divider + header + footer + content);
        console.log(`Appended ${type}: ${relativePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
}

// 1. Reset/Create the file
fs.writeFileSync(outputFile, `// COMBINED DATA - GENERATED ON ${new Date().toLocaleString()}\n`);

// 2. Run the recursive search for models
console.log('--- Gathering Models ---');
combineModels(__dirname);

// 3. Specifically append the constants file at the end
console.log('\n--- Appending Constants ---');
appendToFile(constantsPath, 'CONSTANTS');

console.log(`\nDone! Everything is in: ${outputFile}`);