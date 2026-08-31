import { buildHumanizeSystemPrompt, HumanizeContentType, HumanizeVoice } from './prompt';
import { localHumanize } from './local';
import { HumanizeScan, scanAiPatterns } from './patterns';

export interface HumanizeOptions {
  text: string;
  voice?: HumanizeVoice;
  contentType?: HumanizeContentType;
  writingSamples?: string;
  preferLlm?: boolean;
}

export interface HumanizeResult {
  text: string;
  mode: 'llm' | 'local' | 'local-fallback';
  before: HumanizeScan;
  after: HumanizeScan;
  warning?: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const DEFAULT_LLM_BASE_URL = 'https://api.openai.com/v1';

function getLlmConfig() {
  const model = process.env.HUMANIZE_LLM_MODEL?.trim();
  const configuredBaseUrl = process.env.HUMANIZE_LLM_BASE_URL?.trim();
  const baseUrl = (configuredBaseUrl || DEFAULT_LLM_BASE_URL).replace(/\/$/, '');
  const apiKey = process.env.HUMANIZE_LLM_API_KEY?.trim();

  const configured = Boolean(model && (apiKey || configuredBaseUrl));
  return { model, baseUrl, apiKey, configured };
}

async function rewriteWithLlm(options: Required<Pick<HumanizeOptions, 'text' | 'voice' | 'contentType'>> & Pick<HumanizeOptions, 'writingSamples'>) {
  const config = getLlmConfig();
  if (!config.configured || !config.model) return null;

  const systemPrompt = buildHumanizeSystemPrompt({
    voice: options.voice,
    contentType: options.contentType,
    writingSamples: options.writingSamples,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      temperature: 0.35,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Rewrite only the text between <source> tags. Preserve its meaning and factual content.\n\n<source>\n${options.text}\n</source>`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Humanize LLM request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const rewritten = payload.choices?.[0]?.message?.content?.trim();

  if (!rewritten) {
    throw new Error('Humanize LLM returned an empty response');
  }

  return rewritten;
}

export async function humanizeText(options: HumanizeOptions): Promise<HumanizeResult> {
  const text = options.text.trim();
  const voice = options.voice ?? 'clear-thinker';
  const contentType = options.contentType ?? 'general';
  const preferLlm = options.preferLlm ?? true;
  const before = scanAiPatterns(text);

  if (!text) {
    return { text: '', mode: 'local', before, after: before };
  }

  if (preferLlm) {
    try {
      const llmText = await rewriteWithLlm({
        text,
        voice,
        contentType,
        writingSamples: options.writingSamples,
      });

      if (llmText) {
        return {
          text: llmText,
          mode: 'llm',
          before,
          after: scanAiPatterns(llmText),
        };
      }
    } catch {
      const fallbackText = localHumanize(text);
      return {
        text: fallbackText,
        mode: 'local-fallback',
        before,
        after: scanAiPatterns(fallbackText),
        warning: 'The configured LLM rewrite was unavailable, so SavvyCTX applied the conservative local cleanup pass.',
      };
    }
  }

  const localText = localHumanize(text);
  return {
    text: localText,
    mode: 'local',
    before,
    after: scanAiPatterns(localText),
  };
}

export { scanAiPatterns } from './patterns';
export type { HumanizeContentType, HumanizeVoice } from './prompt';
