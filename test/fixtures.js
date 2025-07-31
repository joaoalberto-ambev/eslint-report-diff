const masterReport = [
  {
    filePath: "/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx",
    messages: [
      {
        ruleId: "jsx-a11y/anchor-is-valid",
        severity: 1,
        message: "Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md",
        line: 32,
        column: 9
      }
    ]
  }
];

const newReport = [
  {
    filePath: "/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx",
    messages: [
      {
        ruleId: "jsx-a11y/anchor-is-valid",
        severity: 1,
        message: "Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md",
        line: 32,
        column: 9
      },
      {
        ruleId: "jsx-a11y/anchor-is-valid",
        severity: 1,
        message: "Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md",
        line: 45,
        column: 9
      }
    ]
  }
];

const emptyReport = [];

const multiFileReport = [
  {
    filePath: "/path/to/file1.js",
    messages: [
      {
        ruleId: "no-unused-vars",
        severity: 2,
        message: "'unused' is assigned a value but never used.",
        line: 1,
        column: 7
      }
    ]
  },
  {
    filePath: "/path/to/file2.js",
    messages: [
      {
        ruleId: "no-console",
        severity: 1,
        message: "Unexpected console statement.",
        line: 5,
        column: 3
      }
    ]
  }
];

const masterReportTxt = `/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx
  32:9  warning  Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid`;

const newReportTxt = `/Users/joaoalberto/Developer/src/components/business/AnnounceStore/WarningModal/index.jsx
  32:9  warning  Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
  45:9  warning  Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid`;

const multiFileTxt = `/path/to/file1.js
  1:7  error  'unused' is assigned a value but never used.  no-unused-vars

/path/to/file2.js
  5:3  warning  Unexpected console statement.  no-console`;

module.exports = {
  masterReport,
  newReport,
  emptyReport,
  multiFileReport,
  masterReportTxt,
  newReportTxt,
  multiFileTxt
};