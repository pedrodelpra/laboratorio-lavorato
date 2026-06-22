const fs = require('fs');
const svg = fs.readFileSync('public/assets/images/logo-delpra.svg', 'utf8');

// Match all float numbers in the path data
const pathData = svg.match(/d="([^"]+)"/)[1];
const matches = pathData.match(/-?\d+\.?\d*/g);
if (!matches) {
    console.log("No numbers found");
    process.exit(0);
}
const numbers = matches.map(Number);

// Let's assume all numbers > 650 are likely X coords (since width is 1280),
// and all numbers between 300 and 600 are Y/X.
// Let's analyze the coordinates.
// An SVG path can have relative commands (lowercase c, v, h, etc.) where numbers are offsets,
// and absolute commands (uppercase M, C, L, etc.) where numbers are absolute positions.
// Let's just find the minimum and maximum absolute coordinates by rendering the path or checking the SVG source.
// But wait, the SVG starts with M538.92,457.72...
// Let's look at the absolute coordinates:
// M538.92,457.72
// M415.18,455.01
// M1098.07,458.76
// M740.58,460.43
// M197.84,462.24
// M408.69,519.13
// M520.58,528.3
// M1066.17,560.36
// These are all the absolute M commands!
// Notice the X values of M: 538, 415, 1098, 740, 197, 408, 520, 1066.
// Notice the Y values of M: 457, 455, 458, 460, 462, 519, 528, 560.
// All the Y values are between 450 and 560!
// What about the relative commands? They are offsets.
// Since all starting points (M) are in the vertical range [450, 560], and the offsets are relatively small (e.g. c11.74-11.95, 6.02-78.78, 7.7-97.72... which goes up by 97px), the absolute Y coordinates are definitely within the range [300, 600].
// Meanwhile, the viewBox is 0 0 1280 1024!
// So vertically, the drawing is centered at Y ~ 480, with a height of only about 200-300px.
// But the viewBox height is 1024px!
// This means the SVG has 300px of empty space at the top and 400px of empty space at the bottom!
console.log("SVG uses viewBox: 0 0 1280 1024");
