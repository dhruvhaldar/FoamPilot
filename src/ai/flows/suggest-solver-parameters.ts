'use server';

/**
 * @fileOverview Provides AI-powered suggestions for optimal OpenFOAM solver parameters.
 *
 * - suggestSolverParameters - A function that takes OpenFOAM case data and returns suggested solver parameters.
 * - SuggestSolverParametersInput - The input type for the suggestSolverParameters function.
 * - SuggestSolverParametersOutput - The return type for the suggestSolverParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSolverParametersInputSchema = z.object({
  caseData: z
    .string()
    .describe(
      'A string containing the contents of the OpenFOAM case directory, including all relevant files (e.g., controlDict, fvSchemes, fvSolution).'
    ),
  solverType: z.string().describe('The type of OpenFOAM solver being used (e.g., simpleFoam, pisoFoam).'),
});
export type SuggestSolverParametersInput = z.infer<typeof SuggestSolverParametersInputSchema>;

const SuggestSolverParametersOutputSchema = z.object({
  suggestedParameters: z
    .string()
    .describe('A string containing suggested optimal solver parameters for the given OpenFOAM case.'),
  requiredFilesCheck: z.string().describe('A check for required files for the case.'),
});
export type SuggestSolverParametersOutput = z.infer<typeof SuggestSolverParametersOutputSchema>;

export async function suggestSolverParameters(
  input: SuggestSolverParametersInput
): Promise<SuggestSolverParametersOutput> {
  return suggestSolverParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSolverParametersPrompt',
  input: {schema: SuggestSolverParametersInputSchema},
  output: {schema: SuggestSolverParametersOutputSchema},
  prompt: `You are an expert in OpenFOAM simulations. Given an OpenFOAM case, you will analyze the case data and suggest optimal solver parameters to improve simulation speed and accuracy.

  Consider the solver type and case setup to recommend appropriate settings for parameters such as:
  - Time step
  - Relaxation factors
  - Solver tolerances
  - Linear solver settings (e.g., preconditioner, smoother)

  Also, please provide a check for required files for the case. Mention any files that are missing.

  OpenFOAM Case Data:
  {{caseData}}

  Solver Type:
  {{solverType}}`,
});

const suggestSolverParametersFlow = ai.defineFlow(
  {
    name: 'suggestSolverParametersFlow',
    inputSchema: SuggestSolverParametersInputSchema,
    outputSchema: SuggestSolverParametersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

