const assert = require('assert');
const { parseReport, createDiff, formatDiff, parseTxtReport, isJsonFile, loadReport } = require('../index.js');
const { masterReport, newReport, emptyReport, multiFileReport, masterReportTxt, newReportTxt, multiFileTxt } = require('./fixtures.js');

function testParseReport() {
  console.log('Testing parseReport...');
  
  const result = parseReport(masterReport);
  assert.strictEqual(result instanceof Map, true, 'parseReport should return a Map');
  assert.strictEqual(result.size, 1, 'Should parse one error');
  
  const key = "/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx:32:9:jsx-a11y/anchor-is-valid";
  assert.strictEqual(result.has(key), true, 'Should contain the expected key');
  
  const error = result.get(key);
  assert.strictEqual(error.filePath, "/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx");
  assert.strictEqual(error.line, 32);
  assert.strictEqual(error.column, 9);
  assert.strictEqual(error.severity, 'warning');
  assert.strictEqual(error.ruleId, 'jsx-a11y/anchor-is-valid');
  
  const emptyResult = parseReport(emptyReport);
  assert.strictEqual(emptyResult.size, 0, 'Empty report should result in empty Map');
  
  const multiResult = parseReport(multiFileReport);
  assert.strictEqual(multiResult.size, 2, 'Multi-file report should parse all errors');
  
  console.log('✓ parseReport tests passed');
}

function testCreateDiff() {
  console.log('Testing createDiff...');
  
  const diff = createDiff(masterReport, newReport);
  assert.strictEqual(diff instanceof Map, true, 'createDiff should return a Map');
  assert.strictEqual(diff.size, 1, 'Should find one new error');
  
  const key = "/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx:45:9:jsx-a11y/anchor-is-valid";
  assert.strictEqual(diff.has(key), true, 'Should contain the new error');
  
  const error = diff.get(key);
  assert.strictEqual(error.line, 45);
  assert.strictEqual(error.column, 9);
  
  const noDiff = createDiff(masterReport, masterReport);
  assert.strictEqual(noDiff.size, 0, 'Identical reports should have no diff');
  
  const fromEmpty = createDiff(emptyReport, masterReport);
  assert.strictEqual(fromEmpty.size, 1, 'All errors should be new when comparing from empty');
  
  console.log('✓ createDiff tests passed');
}

function testFormatDiff() {
  console.log('Testing formatDiff...');
  
  const diff = createDiff(masterReport, newReport);
  const formatted = formatDiff(diff);
  
  assert.strictEqual(typeof formatted, 'string', 'formatDiff should return a string');
  assert.strictEqual(formatted.includes('/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx'), true, 'Should include file path');
  assert.strictEqual(formatted.includes('45:9  warning'), true, 'Should include line:column and severity');
  assert.strictEqual(formatted.includes('jsx-a11y/anchor-is-valid'), true, 'Should include rule ID');
  
  const emptyDiff = new Map();
  const emptyFormatted = formatDiff(emptyDiff);
  assert.strictEqual(emptyFormatted, '', 'Empty diff should result in empty string');
  
  console.log('✓ formatDiff tests passed');
}

function testParseTxtReport() {
  console.log('Testing parseTxtReport...');
  
  const result = parseTxtReport(masterReportTxt);
  assert.strictEqual(Array.isArray(result), true, 'parseTxtReport should return an array');
  assert.strictEqual(result.length, 1, 'Should parse one file');
  assert.strictEqual(result[0].filePath, '/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx');
  assert.strictEqual(result[0].messages.length, 1, 'Should parse one message');
  assert.strictEqual(result[0].messages[0].line, 32);
  assert.strictEqual(result[0].messages[0].column, 9);
  assert.strictEqual(result[0].messages[0].severity, 1);
  assert.strictEqual(result[0].messages[0].ruleId, 'jsx-a11y/anchor-is-valid');
  
  const multiResult = parseTxtReport(multiFileTxt);
  assert.strictEqual(multiResult.length, 2, 'Should parse multiple files');
  assert.strictEqual(multiResult[0].messages[0].severity, 2, 'Should parse error severity');
  assert.strictEqual(multiResult[1].messages[0].severity, 1, 'Should parse warning severity');
  
  console.log('✓ parseTxtReport tests passed');
}

function testIsJsonFile() {
  console.log('Testing isJsonFile...');
  
  assert.strictEqual(isJsonFile('test.json'), true, 'Should detect JSON file');
  assert.strictEqual(isJsonFile('test.JSON'), true, 'Should detect JSON file case insensitive');
  assert.strictEqual(isJsonFile('test.txt'), false, 'Should not detect TXT as JSON');
  assert.strictEqual(isJsonFile('test'), false, 'Should not detect file without extension as JSON');
  
  console.log('✓ isJsonFile tests passed');
}

function testEndToEnd() {
  console.log('Testing end-to-end functionality...');
  
  const diff = createDiff(masterReport, newReport);
  const formatted = formatDiff(diff);
  
  const expectedOutput = '/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx\n  45:9  warning  Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid\n';
  
  assert.strictEqual(formatted, expectedOutput, 'End-to-end output should match expected format');
  
  console.log('✓ End-to-end tests passed');
}

function testTxtEndToEnd() {
  console.log('Testing TXT end-to-end functionality...');
  
  const masterData = parseTxtReport(masterReportTxt);
  const newData = parseTxtReport(newReportTxt);
  
  const diff = createDiff(masterData, newData);
  const formatted = formatDiff(diff);
  
  const expectedOutput = '/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx\n  45:9  warning  Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid\n';
  
  assert.strictEqual(formatted, expectedOutput, 'TXT end-to-end output should match expected format');
  
  console.log('✓ TXT end-to-end tests passed');
}

function runAllTests() {
  console.log('Running all tests...\n');
  
  try {
    testParseReport();
    testCreateDiff();
    testFormatDiff();
    testParseTxtReport();
    testIsJsonFile();
    testEndToEnd();
    testTxtEndToEnd();
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = {
  testParseReport,
  testCreateDiff,
  testFormatDiff,
  testParseTxtReport,
  testIsJsonFile,
  testEndToEnd,
  testTxtEndToEnd,
  runAllTests
};