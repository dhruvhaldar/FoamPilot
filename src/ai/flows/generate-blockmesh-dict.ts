'use server';

/**
 * @fileOverview Provides an AI-powered generator for OpenFOAM blockMeshDict files.
 *
 * - generateBlockMeshDict - A function that takes geometry definitions and returns a complete blockMeshDict file content.
 * - GenerateBlockMeshDictInput - The input type for the generateBlockMeshDict function.
 * - GenerateBlockMeshDictOutput - The return type for the generateBlockMeshDict function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlockMeshDictInputSchema = z.object({
  vertices: z.string().describe('The vertices for the block mesh, defined as a list of (x y z) coordinates.'),
  blocks: z.string().describe('The blocks definition, specifying connectivity and cell counts.'),
  edges: z.string().describe('Optional edge definitions for curved surfaces.'),
  boundary: z.string().describe('The boundary patch definitions.'),
  convertToMeters: z.string().default('1').describe('The scale factor to convert to meters.'),
});
export type GenerateBlockMeshDictInput = z.infer<typeof GenerateBlockMeshDictInputSchema>;

const GenerateBlockMeshDictOutputSchema = z.object({
  blockMeshDictContent: z.string().describe('The complete, valid content of the generated blockMeshDict file.'),
});
export type GenerateBlockMeshDictOutput = z.infer<typeof GenerateBlockMeshDictOutputSchema>;


export async function generateBlockMeshDict(
  input: GenerateBlockMeshDictInput
): Promise<GenerateBlockMeshDictOutput> {
  return generateBlockMeshDictFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateBlockMeshDictPrompt',
  input: {schema: GenerateBlockMeshDictInputSchema},
  output: {schema: GenerateBlockMeshDictOutputSchema},
  prompt: `You are an expert in OpenFOAM. Your task is to generate a complete and valid blockMeshDict file based on the provided geometry information.

You must construct a standard blockMeshDict file including the header, FoamFile dictionary, and all the required sections (convertToMeters, vertices, blocks, edges, boundary).

Use the following inputs:

convertToMeters: {{convertToMeters}}

vertices:
{{vertices}}

blocks:
{{blocks}}

edges:
{{#if edges}}{{edges}}{{else}}// No edges provided{{/if}}

boundary:
{{boundary}}

Generate the full blockMeshDict file content. Do not include any explanations, only the file content itself inside the 'blockMeshDictContent' field.
`,
});

const generateBlockMeshDictFlow = ai.defineFlow(
  {
    name: 'generateBlockMeshDictFlow',
    inputSchema: GenerateBlockMeshDictInputSchema,
    outputSchema: GenerateBlockMeshDictOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
