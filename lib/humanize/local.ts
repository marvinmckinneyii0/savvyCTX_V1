const SAFE_WORD_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bpivotal\b/gi, 'important'],
  [/\bmultifaceted\b/gi, 'complex'],
  [/\bmeticulous\b/gi, 'careful'],
  [/\bmeticulously\b/gi, 'carefully'],
  [/\bembark\b/gi, 'start'],
  [/\bbolster\b/gi, 'support'],
  [/\bbolstered\b/gi, 'supported'],
  [/\bgarner\b/gi, 'get'],
  [/\bcrucial\b/gi, 'important'],
  [/\benhance\b/gi, 'improve'],
  [/\bcomprehensive\b/gi, 'thorough'],
  [/\bseamless\b/gi, 'smooth'],
  [/\bseamlessly\b/gi, 'smoothly'],
  [/\bcutting-edge\b/gi, 'advanced'],
  [/\bgame-changer\b/gi, 'breakthrough'],
];

const SAFE_PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bfurthermore\b/gi, 'Also'],
  [/\bmoreover\b/gi, 'Also'],
  [/\badditionally\b/gi, 'Also'],
  [/\bconsequently\b/gi, 'So'],
  [/\bnevertheless\b/gi, 'Still'],
  [/\bsubsequently\b/gi, 'Then'],
  [/\bnonetheless\b/gi, 'Still'],
  [/\bhence\b/gi, 'So'],
  [/\bthus\b/gi, 'So'],
  [/\bin conclusion\b[:,]?/gi, ''],
  [/\bin summary\b[:,]?/gi, ''],
  [/\bit(?:'|’)s worth noting that\b/gi, ''],
  [/\bit(?:'|’)s important to understand that\b/gi, ''],
  [/\bhere(?:'|’)s the thing\s*:\s*/gi, ''],
  [/\bhere(?:'|’)s what nobody tells you\s*:\s*/gi, ''],
  [/\blet(?:'|’)s dive in\b[.:]?\s*/gi, ''],
  [/\blet(?:'|’)s unpack this\b[.:]?\s*/gi, ''],
  [/\blet(?:'|’)s break this down\b[.:]?\s*/gi, ''],
];

function preserveInitialCase(source: string, replacement: string) {
  if (!replacement) return replacement;
  return source[0] === source[0].toUpperCase()
    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
    : replacement;
}

export function localHumanize(text: string): string {
  let output = text;

  for (const [regex, replacement] of SAFE_PHRASE_REPLACEMENTS) {
    output = output.replace(regex, match => preserveInitialCase(match, replacement));
  }

  for (const [regex, replacement] of SAFE_WORD_REPLACEMENTS) {
    output = output.replace(regex, match => preserveInitialCase(match, replacement));
  }

  // Keep this pass conservative. Context-dependent words such as “landscape,”
  // “robust,” “dynamic,” and “leverage” are only flagged by the scanner and are
  // left for the contextual LLM rewrite.
  output = output.replace(/\s*—\s*/g, ', ');
  output = output.replace(/[ \t]{2,}/g, ' ');
  output = output.replace(/\n[ \t]+/g, '\n');
  output = output.replace(/\s+([,.;!?])/g, '$1');
  output = output.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`
  );

  return output.trim();
}
