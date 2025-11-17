const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const workbook = XLSX.readFile(path.join(__dirname, '../src/data/jikan_reviews_2025_fall_20251023_072601.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to CSV
const csv = XLSX.utils.sheet_to_csv(worksheet);

// Write to file
fs.writeFileSync(path.join(__dirname, '../src/data/jikan-reviews.csv'), csv);

console.log('Excel file converted to CSV successfully!');
console.log('First 500 characters:', csv.substring(0, 500));