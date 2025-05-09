
'use server';
/**
 * @fileOverview A flow to summarize a company's business based on its activities.
 *
 * - summarizeBusiness - A function that handles the business summarization.
 * - SummarizeBusinessInput - The input type for the summarizeBusiness function.
 * - SummarizeBusinessOutput - The return type for the summarizeBusiness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBusinessInputSchema = z.object({
  atividadePrincipal: z.string().describe('The main business activity of the company.'),
  atividadesSecundarias: z.array(z.string()).optional().describe('A list of secondary business activities.'),
});
export type SummarizeBusinessInput = z.infer<typeof SummarizeBusinessInputSchema>;

const SummarizeBusinessOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the company\'s business.'),
});
export type SummarizeBusinessOutput = z.infer<typeof SummarizeBusinessOutputSchema>;

export async function summarizeBusiness(input: SummarizeBusinessInput): Promise<SummarizeBusinessOutput> {
  return summarizeBusinessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBusinessPrompt',
  input: {schema: SummarizeBusinessInputSchema},
  output: {schema: SummarizeBusinessOutputSchema},
  prompt: `Você é um analista de negócios experiente.
Sua tarefa é criar um resumo conciso sobre a área de atuação de uma empresa com base em suas atividades principal e secundárias.
O resumo deve ser claro, direto e em português brasileiro.

Atividade Principal: {{{atividadePrincipal}}}
{{#if atividadesSecundarias}}
Atividades Secundárias:
{{#each atividadesSecundarias}}
- {{{this}}}
{{/each}}
{{else}}
Atividades Secundárias: Nenhuma informada.
{{/if}}

Com base nessas informações, forneça um resumo do negócio da empresa.`,
});

const summarizeBusinessFlow = ai.defineFlow(
  {
    name: 'summarizeBusinessFlow',
    inputSchema: SummarizeBusinessInputSchema,
    outputSchema: SummarizeBusinessOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate business summary.');
    }
    return output;
  }
);
