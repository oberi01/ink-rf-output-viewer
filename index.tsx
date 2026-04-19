import { useState, useEffect } from "react";
import { render, Text, Box, useInput } from "ink";
import { parseRobot, TestCase } from "./parser.js";

let tests: TestCase[] = [];

try {
  const filePath = process.argv[2] || "output.xml";
  tests = parseRobot(filePath);
} catch (err: any) {
  console.error("Failed to read file:", err.message);
  process.exit(1);
}

const App = () => {
  const [selected, setSelected] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visibleTests = showAll
    ? tests
    : tests.filter(t => t.status === "FAIL");

  // Hooks
  useEffect(() => {
    setSelected(i => Math.min(i, Math.max(0, visibleTests.length - 1)));
  }, [visibleTests.length]);

  useInput((input, key) => {
    if (key.upArrow) setSelected(i => Math.max(0, i - 1));
    if (key.downArrow) setSelected(i => Math.min(visibleTests.length - 1, i + 1));
    if (input === "q") process.exit(0);
    if (input === "a") setShowAll(v => !v);
  });

  // Early Return nach den Hooks
  if (visibleTests.length === 0) {
    return <Text color="yellow">No tests found (q to quit, a to toggle all/failed)</Text>;
  }

  // --- LOGIK FÜR WINDOWING ---
  const VISIBLE_COUNT = 10;
  // Berechnet den Startindex so, dass 'selected' möglichst mittig bleibt
  const startIndex = Math.max(0, Math.min(
    selected - Math.floor(VISIBLE_COUNT / 2),
    visibleTests.length - VISIBLE_COUNT
  ));
  const displayedTests = visibleTests.slice(startIndex, startIndex + VISIBLE_COUNT);

  const selectedTest = visibleTests[selected] ?? visibleTests[0];

  // Daten für Detailansicht vorbereiten
  const MAX_LINES = 8;
  const rawFailureLines = selectedTest.failureMessage?.split("\n") ?? [];
  const failureLines = Array.from({ length: MAX_LINES }, (_, i) => rawFailureLines[i] ?? "");

  const MAX_KEYWORDS = 5;
  const rawKeywords = selectedTest.keywords ?? [];
  const keywordLines = Array.from({ length: MAX_KEYWORDS }, (_, i) => rawKeywords[i] ?? "");

  return (
    <Box flexDirection="column">
      <Text bold inverse> Robot Test Viewer </Text>
      <Text dimColor>(q: quit | a: toggle all/failed | Arrows: navigate)</Text>
      
      <Box flexDirection="column" marginTop={1} marginBottom={1}>
        {/* Anzeige von "..." wenn oben abgeschnitten */}
        {startIndex > 0 && <Text dimColor>   ...</Text>}

        {displayedTests.map((test, index) => {
          const globalIndex = startIndex + index;
          const isSelected = globalIndex === selected;
          const statusColor = test.status === "PASS" ? "green" : test.status === "FAIL" ? "red" : "yellow";

          return (
            <Text key={globalIndex} wrap="truncate">
              {isSelected ? "👉 " : "   "}
              {test.suite} / {test.name} [<Text color={statusColor}>{test.status}</Text>]
            </Text>
          );
        })}

        {/* Anzeige von "..." wenn unten abgeschnitten */}
        {startIndex + VISIBLE_COUNT < visibleTests.length && <Text dimColor>   ...</Text>}
      </Box>

      {/* Detailbereich (bleibt fixiert) */}
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
        <Text bold>Selected: {selectedTest.name} ({selected + 1}/{visibleTests.length})</Text>
        
        {selectedTest.failureMessage && (
          <Box flexDirection="column" marginTop={1}>
            <Text color="red" bold>Failure:</Text>
            {failureLines.map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
            {rawFailureLines.length > MAX_LINES && (
              <Text dimColor italic>... (+ {rawFailureLines.length - MAX_LINES} more lines)</Text>
            )}
          </Box>
        )}

        <Box flexDirection="column" marginTop={1}>
          <Text bold>Keywords:</Text>
          {keywordLines.map((kw, i) => (
            <Text key={i}>- {kw}</Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

render(<App />);
