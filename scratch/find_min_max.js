const fs = require('fs');
const svg = fs.readFileSync('public/assets/images/logo-delpra.svg', 'utf8');
const pathMatch = svg.match(/\bd="([^"]+)"/);
if (!pathMatch) {
    console.log("No path match found!");
    process.exit(1);
}
const pathData = pathMatch[1];
const tokens = pathData.match(/[a-zA-Z]|-?\d+\.?\d*/g);

let x = 0, y = 0;
let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;

function updateBounds(px, py) {
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
}

let i = 0;
while (i < tokens.length) {
    let token = tokens[i];
    if (/[a-zA-Z]/.test(token)) {
        let cmd = token;
        i++;
        const args = [];
        while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
            args.push(parseFloat(tokens[i]));
            i++;
        }
        
        if (cmd === 'M' || cmd === 'm') {
            const isRelative = cmd === 'm';
            for (let j = 0; j < args.length; j += 2) {
                if (isRelative && j > 0) {
                    x += args[j];
                    y += args[j+1];
                } else {
                    x = isRelative ? x + args[j] : args[j];
                    y = isRelative ? y + args[j+1] : args[j+1];
                }
                updateBounds(x, y);
            }
        } else if (cmd === 'c') {
            for (let j = 0; j < args.length; j += 6) {
                const x1 = x + args[j];
                const y1 = y + args[j+1];
                const x2 = x + args[j+2];
                const y2 = y + args[j+3];
                const x3 = x + args[j+4];
                const y3 = y + args[j+5];
                updateBounds(x1, y1);
                updateBounds(x2, y2);
                updateBounds(x3, y3);
                x = x3;
                y = y3;
            }
        } else if (cmd === 'C') {
            for (let j = 0; j < args.length; j += 6) {
                const x1 = args[j];
                const y1 = args[j+1];
                const x2 = args[j+2];
                const y2 = args[j+3];
                const x3 = args[j+4];
                const y3 = args[j+5];
                updateBounds(x1, y1);
                updateBounds(x2, y2);
                updateBounds(x3, y3);
                x = x3;
                y = y3;
            }
        } else if (cmd === 's') {
            for (let j = 0; j < args.length; j += 4) {
                const x2 = x + args[j];
                const y2 = y + args[j+1];
                const x3 = x + args[j+2];
                const y3 = y + args[j+3];
                updateBounds(x2, y2);
                updateBounds(x3, y3);
                x = x3;
                y = y3;
            }
        } else if (cmd === 'S') {
            for (let j = 0; j < args.length; j += 4) {
                const x2 = args[j];
                const y2 = args[j+1];
                const x3 = args[j+2];
                const y3 = args[j+3];
                updateBounds(x2, y2);
                updateBounds(x3, y3);
                x = x3;
                y = y3;
            }
        } else if (cmd === 'l') {
            for (let j = 0; j < args.length; j += 2) {
                x += args[j];
                y += args[j+1];
                updateBounds(x, y);
            }
        } else if (cmd === 'L') {
            for (let j = 0; j < args.length; j += 2) {
                x = args[j];
                y = args[j+1];
                updateBounds(x, y);
            }
        }
    } else {
        i++;
    }
}

console.log("Calculated Bounds:");
console.log(`X: [${minX}, ${maxX}] -> width: ${maxX - minX}`);
console.log(`Y: [${minY}, ${maxY}] -> height: ${maxY - minY}`);
