export type SolverType = 'simpleFoam' | 'pisoFoam' | 'icoFoam' | 'potentialFoam';

export interface CaseFile {
  id: string;
  name: string;
  content: string;
  isUnsaved?: boolean;
}

export interface Case {
  id:string;
  name: string;
  files: CaseFile[];
  solver: SolverType;
  consoleOutput: string[];
  isRunning: boolean;
}
