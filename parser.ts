import fs from "fs";
import { XMLParser } from "fast-xml-parser";

export type TestCase = {
  name: string;
  status: string;
  suite: string;
  keywords: string[];
  failureMessage?: string;
};

export function parseRobot(filePath: string): TestCase[] {
  const xml = fs.readFileSync(filePath, "utf-8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    processEntities: false,
  });

  const data = parser.parse(xml);

  const results: TestCase[] = [];

  function collectTests(suite: any, parentName = "") {
    if (!suite) return;

    const suiteName = parentName
      ? `${parentName}.${suite.name}`
      : suite.name;

    // Normalize tests to array
    const tests = suite.test
      ? Array.isArray(suite.test)
        ? suite.test
        : [suite.test]
      : [];

    for (const test of tests) {
      results.push({
        name: test.name,
        status: test.status?.status || "UNKNOWN",
        suite: suiteName,
        keywords: extractKeywords(test),
        failureMessage: extractFailure(test),
      });
    }

    // Normalize nested suites
    const childSuites = suite.suite
      ? Array.isArray(suite.suite)
        ? suite.suite
        : [suite.suite]
      : [];

    for (const child of childSuites) {
      collectTests(child, suiteName);
    }
  }

  collectTests(data.robot.suite);

  return results;
}
function extractKeywords(test: any): string[] {
  if (!test.kw) return [];

  const kws = Array.isArray(test.kw) ? test.kw : [test.kw];

  return kws.map((kw: any) => kw.name);
}
function extractFailure(test: any): string | undefined {
  if (test.status?.status !== "FAIL") return undefined;

  // Case 1: message directly in <status>
  if (typeof test.status === "string") {
    return test.status;
  }

  // Case 2: nested message (common)
  if (test.status?.["#text"]) {
    return test.status["#text"];
  }

  // Case 3: fallback → collect msg entries
  if (test.msg) {
    const msgs = Array.isArray(test.msg) ? test.msg : [test.msg];
    return msgs.map((m: any) => m["#text"] || "").join("\n");
  }

  return "Test failed (no message found)";
}