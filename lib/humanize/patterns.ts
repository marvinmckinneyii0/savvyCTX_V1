export type PatternSeverity = 'high' | 'medium' | 'low';

export interface PatternFinding {
  id: string;
  label: string;
  severity: PatternSeverity;
  count: number;
  examples: string[];
}

export interface HumanizeScan {
  score: number;
  risk: 'low' | 'medium' | 'high';
  wordCount: number;
  findings: PatternFinding[];
}

export const TIER_1_REPLACEMENTS: Record<string, string> = {
  delve: 'look at',
  tapestry: 'mix',
  landscape: 'space',
  pivotal: 'important',
  underscore: 'show',
  testament: 'evidence',
  intricate: 'detailed',
  intricacies: 'details',
  meticulous: 'careful',
  meticulously: 'carefully',
  nuanced: 'complex',
  multifaceted: 'complex',
  embark: 'start',
  spearhead: 'lead',
  bolster: 'support',
  bolstered: 'supported',
  garner: 'get',
  interplay: 'relationship',
  realm: 'area',
  labyrinth: 'mess',
  symphony: 'mix',
};

export const TIER_2_REPLACEMENTS: Record<string, string> = {
  crucial: 'important',
  vibrant: 'active',
  foster: 'support',
  enhance: 'improve',
  leverage: 'use',
  navigate: 'handle',
  resonate: 'connect',
  illuminate: 'clarify',
  showcase: 'show',
  enduring: 'lasting',
  robust: 'strong',
  holistic: 'complete',
  comprehensive: 'thorough',
  innovative: 'new',
  dynamic: 'changing',
  seamless: 'smooth',
  seamlessly: 'smoothly',
  'cutting-edge': 'advanced',
  'game-changer': 'breakthrough',
};

export const TRANSITION_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bfurthermore\b/gi, 'Also'],
  [/\bmoreover\b/gi, 'Also'],
  [/\badditionally\b/gi, 'Also'],
  [/\bconsequently\b/gi, 'So'],
  [/\bnevertheless\b/gi, 'Still'],
  [/\bsubsequently\b/gi, 'Then'],
  [/\bnotably\b/gi, ''],
  [/\bindeed\b/gi, ''],
  [/\bnonetheless\b/gi, 'Still'],
  [/\bhence\b/gi, 'So'],
  [/\bthus\b/gi, 'So'],
  [/\bin conclusion\b[:,]?/gi, ''],
  [/\bin summary\b[:,]?/gi, ''],
  [/\bit(?:'|’)s worth noting that\b/gi, ''],
  [/\bit(?:'|’)s important to understand that\b/gi, ''],
];

const DRAMATIC_OPENERS: Array<[RegExp, string]> = [
  [/\bhere(?:'|’)s the thing\s*:\s*/gi, ''],
  [/\bhere(?:'|’)s what nobody tells you\s*:\s*/gi, ''],
  [/\blet(?:'|’)s dive in\b[.:]?\s*/gi, ''],
  [/\blet(?:'|’)s unpack this\b[.:]?\s*/gi, ''],
  [/\blet(?:'|’)s break this down\b[.:]?\s*/gi, ''],
];

const HEDGING_PATTERNS = [
  /\bgenerally speaking\b/gi,
  /\bto some extent\b/gi,
  /\bfrom a broader perspective\b/gi,
  /\bit could be argued that\b/gi,
  /\bsome might say\b/gi,
];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectMatches(text: string, regex: RegExp, limit = 3): string[] {
  const matches = text.match(regex) ?? [];
  return matches.slice(0, limit).map(match => match.trim());
}

function addFinding(
  findings: PatternFinding[],
  id: string,
  label: string,
  severity: PatternSeverity,
  matches: string[]
) {
  if (!matches.length) return;
  findings.push({ id, label, severity, count: matches.length, examples: matches.slice(0, 3) });
}

export function scanAiPatterns(text: string): HumanizeScan {
  const findings: PatternFinding[] = [];
  const wordCount = (text.trim().match(/\b[\w’'-]+\b/g) ?? []).length;

  for (const word of Object.keys(TIER_1_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    addFinding(findings, `tier1:${word}`, `High-signal AI word: ${word}`, 'high', collectMatches(text, regex));
  }

  for (const word of Object.keys(TIER_2_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    addFinding(findings, `tier2:${word}`, `Overused AI word: ${word}`, 'medium', collectMatches(text, regex));
  }

  const formalTransitions = TRANSITION_REPLACEMENTS.flatMap(([regex]) => collectMatches(text, regex, 20));
  if (formalTransitions.length > 2) {
    addFinding(findings, 'formal-transitions', 'Clustered formal transitions', 'medium', formalTransitions);
  }

  addFinding(
    findings,
    'parallel-negation',
    'Formulaic “not X, but Y” contrast',
    'high',
    collectMatches(text, /\bnot\b[^.!?\n]{0,100}\bbut\b[^.!?\n]{0,100}/gi)
  );

  addFinding(
    findings,
    'tricolon',
    'Rule-of-three list pattern',
    'medium',
    collectMatches(text, /\b[A-Za-z][\w'-]*,\s+[A-Za-z][\w'-]*,\s+(?:and|or)\s+[A-Za-z][\w'-]*\b/g)
  );

  const emDashes = collectMatches(text, /—/g, 20);
  const allowedDashes = Math.max(1, Math.floor(wordCount / 500));
  if (emDashes.length > allowedDashes) {
    addFinding(findings, 'em-dash-overuse', 'Em dash overuse', 'medium', emDashes);
  }

  addFinding(
    findings,
    'rhetorical-qa',
    'Rhetorical question followed by immediate answer',
    'medium',
    collectMatches(
      text,
      /\b(?:what|why|how|who|where|when|does|do|is|are|can|could|should|would)\b[^?\n]{0,140}\?\s+(?:it|this|that|the|we|you)\b[^.!?\n]{0,140}/gi
    )
  );

  const dramaticMatches = DRAMATIC_OPENERS.flatMap(([regex]) => collectMatches(text, regex, 10));
  addFinding(findings, 'dramatic-openers', 'Dramatic reveal/setup language', 'medium', dramaticMatches);

  const hedgeMatches = HEDGING_PATTERNS.flatMap(regex => collectMatches(text, regex, 10));
  addFinding(findings, 'hedging', 'Generic hedging language', 'low', hedgeMatches);

  const weightedScore = findings.reduce((total, finding) => {
    const weight = finding.severity === 'high' ? 12 : finding.severity === 'medium' ? 6 : 3;
    return total + weight * Math.min(finding.count, 3);
  }, 0);

  const score = Math.min(100, weightedScore);
  const risk = score >= 45 ? 'high' : score >= 18 ? 'medium' : 'low';

  return { score, risk, wordCount, findings };
}

function preserveCase(source: string, replacement: string) {
  if (!replacement) return replacement;
  if (source === source.toUpperCase()) return replacement.toUpperCase();
  if (source[0] === source[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function replaceWords(text: string, replacements: Record<string, string>) {
  let output = text;
  for (const [word, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    output = output.replace(regex, match => preserveCase(match, replacement));
  }
  return output;
}

export function localHumanize(text: string): string {
  let output = text;

  for (const [regex, replacement] of DRAMATIC_OPENERS) {
    output = output.replace(regex, replacement);
  }

  for (const [regex, replacement] of TRANSITION_REPLACEMENTS) {
    output = output.replace(regex, replacement);
  }

  output = replaceWords(output, TIER_1_REPLACEMENTS);
  output = replaceWords(output, TIER_2_REPLACEMENTS);

  // The local pass is intentionally conservative. It removes obvious tells without
  // attempting risky structural rewrites that could change meaning.
  output = output.replace(/\s*—\s*/g, ', ');
  output = output.replace(/[ \t]{2,}/g, ' ');
  output = output.replace(/\n[ \t]+/g, '\n');
  output = output.replace(/\s+([,.;!?])/g, '$1');
  output = output.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`);

  return output.trim();
}
