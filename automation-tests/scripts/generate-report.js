const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('  MilkMan Automation Test Suite - Report Generator');
console.log('='.repeat(60));
console.log('');

const reportsDir = path.join(__dirname, '../reports');
const apiReportPath = path.join(reportsDir, 'api', 'api-test-report.html');
const uiReportPath = path.join(reportsDir, 'ui', 'ui-test-report.html');

console.log('📊 Checking for test reports...\n');

let reportsFound = false;

if (fs.existsSync(apiReportPath)) {
    console.log('✅ API Test Report found:');
    console.log(`   ${apiReportPath}`);
    console.log('');
    reportsFound = true;
}

if (fs.existsSync(uiReportPath)) {
    console.log('✅ UI Test Report found:');
    console.log(`   ${uiReportPath}`);
    console.log('');
    reportsFound = true;
}

if (!reportsFound) {
    console.log('❌ No test reports found.');
    console.log('');
    console.log('Please run tests first:');
    console.log('  npm run test:api    - Run API tests');
    console.log('  npm run test:ui     - Run UI tests');
    console.log('  npm test            - Run all tests');
    console.log('');
} else {
    console.log('📁 Reports Directory Structure:');
    console.log('');

    try {
        const listDirectory = (dir, prefix = '') => {
            if (!fs.existsSync(dir)) return;

            const items = fs.readdirSync(dir);
            items.forEach((item, index) => {
                const itemPath = path.join(dir, item);
                const isLast = index === items.length - 1;
                const connector = isLast ? '└──' : '├──';

                console.log(`${prefix}${connector} ${item}`);

                if (fs.statSync(itemPath).isDirectory()) {
                    const newPrefix = prefix + (isLast ? '    ' : '│   ');
                    listDirectory(itemPath, newPrefix);
                }
            });
        };

        listDirectory(reportsDir);
        console.log('');
    } catch (error) {
        console.log('Error reading reports directory:', error.message);
    }

    console.log('🌐 To view reports, open the HTML files in your browser:');
    console.log('');

    if (fs.existsSync(apiReportPath)) {
        console.log(`  API Report:  file:///${apiReportPath.replace(/\\/g, '/')}`);
    }

    if (fs.existsSync(uiReportPath)) {
        console.log(`  UI Report:   file:///${uiReportPath.replace(/\\/g, '/')}`);
    }

    console.log('');
}

console.log('='.repeat(60));
console.log('');
