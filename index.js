#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function isJsonFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.json';
}

function parseTxtReport(txtContent) {
  const lines = txtContent.split('\n');
  const reportData = [];
  let currentFile = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    if (!line.startsWith('  ')) {
      currentFile = {
        filePath: trimmedLine,
        messages: []
      };
      reportData.push(currentFile);
    } else if (currentFile) {
      const match = trimmedLine.match(/^(\d+):(\d+)\s+(warning|error)\s+(.+)$/);
      if (match) {
        const [, line, column, severity, rest] = match;
        const words = rest.split(/\s+/);
        const ruleId = words[words.length - 1];
        const message = words.slice(0, -1).join(' ');
        
        currentFile.messages.push({
          line: parseInt(line),
          column: parseInt(column),
          severity: severity === 'error' ? 2 : 1,
          message: message.trim(),
          ruleId: ruleId
        });
      }
    }
  }
  
  return reportData.filter(file => file.messages.length > 0);
}

function loadReport(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (isJsonFile(filePath)) {
    return JSON.parse(content);
  } else {
    return parseTxtReport(content);
  }
}

function parseReport(reportData) {
  const errorMap = new Map();
  
  reportData.forEach(file => {
    if (file.messages && file.messages.length > 0) {
      file.messages.forEach(message => {
        const key = `${file.filePath}:${message.line}:${message.column}:${message.ruleId}`;
        errorMap.set(key, {
          filePath: file.filePath,
          line: message.line,
          column: message.column,
          severity: message.severity === 2 ? 'error' : 'warning',
          message: message.message,
          ruleId: message.ruleId
        });
      });
    }
  });
  
  return errorMap;
}

function createDiff(report1, report2) {
  const errors1 = parseReport(report1);
  const errors2 = parseReport(report2);
  
  const newErrors = new Map();
  
  errors2.forEach((error, key) => {
    if (!errors1.has(key)) {
      newErrors.set(key, error);
    }
  });
  
  return newErrors;
}

function formatDiff(newErrors) {
  const fileGroups = new Map();
  
  newErrors.forEach(error => {
    if (!fileGroups.has(error.filePath)) {
      fileGroups.set(error.filePath, []);
    }
    fileGroups.get(error.filePath).push(error);
  });
  
  let output = '';
  
  fileGroups.forEach((errors, filePath) => {
    output += `${filePath}\n`;
    errors.forEach(error => {
      output += `  ${error.line}:${error.column}  ${error.severity}  ${error.message}  ${error.ruleId}\n`;
    });
  });
  
  return output;
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: eslint-report-diff <report1.json|txt> <report2.json|txt>');
    process.exit(1);
  }
  
  const [report1Path, report2Path] = args;
  
  if (!fs.existsSync(report1Path)) {
    console.error(`Error: File not found: ${report1Path}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(report2Path)) {
    console.error(`Error: File not found: ${report2Path}`);
    process.exit(1);
  }
  
  try {
    const report1 = loadReport(report1Path);
    const report2 = loadReport(report2Path);
    
    const newErrors = createDiff(report1, report2);
    const diffOutput = formatDiff(newErrors);
    
    const outputFile = 'eslint-diff.txt';
    fs.writeFileSync(outputFile, diffOutput);
    
    console.log(`Diff created successfully: ${outputFile}`);
    console.log(`New errors found: ${newErrors.size}`);
    
  } catch (error) {
    console.error('Error reading or parsing files:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseReport,
  createDiff,
  formatDiff,
  loadReport,
  parseTxtReport,
  isJsonFile
};