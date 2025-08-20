'use client';

import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import type { Case } from '@/lib/types';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CaseExplorer } from './case-explorer';
import { MainView } from './main-view';
import { tutorialCase } from '@/lib/mock-data';
import { WelcomeScreen } from './welcome-screen';

interface AppState {
  cases: Case[];
  activeCaseId: string | null;
}

type Action =
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'DELETE_CASE'; payload: string }
  | { type: 'SET_ACTIVE_CASE'; payload: string | null }
  | { type: 'UPDATE_CASE'; payload: Partial<Case> & { id: string } }
  | { type: 'UPDATE_FILE'; payload: { caseId: string, fileId: string, content: string } };

const initialState: AppState = {
  cases: [],
  activeCaseId: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_CASE':
      return {
        ...state,
        cases: [...state.cases, action.payload],
        activeCaseId: action.payload.id,
      };
    case 'DELETE_CASE': {
        const newCases = state.cases.filter(c => c.id !== action.payload);
        const newActiveCaseId = state.activeCaseId === action.payload ? null : state.activeCaseId;
        return {
            ...state,
            cases: newCases,
            activeCaseId: newActiveCaseId,
        };
    }
    case 'SET_ACTIVE_CASE':
      return { ...state, activeCaseId: action.payload };
    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };
    case 'UPDATE_FILE':
        return {
            ...state,
            cases: state.cases.map(c => {
                if (c.id === action.payload.caseId) {
                    return {
                        ...c,
                        files: c.files.map(f => {
                            if (f.id === action.payload.fileId) {
                                return { ...f, content: action.payload.content, isUnsaved: false };
                            }
                            return f;
                        })
                    }
                }
                return c;
            })
        }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  activeCase: Case | null;
  addCase: (name: string) => void;
  loadTutorial: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export function FoamPilotClient() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const activeCase = useMemo(() => {
    return state.cases.find(c => c.id === state.activeCaseId) || null;
  }, [state.cases, state.activeCaseId]);

  const addCase = (name: string) => {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      name,
      solver: 'simpleFoam',
      isRunning: false,
      consoleOutput: [`Case "${name}" created.`],
      files: [
        { id: 'cfd-1', name: 'controlDict', content: '/* New controlDict */' },
        { id: 'cfd-2', name: 'fvSchemes', content: '/* New fvSchemes */' },
        { id: 'cfd-3', name: 'fvSolution', content: '/* New fvSolution */' },
      ],
    };
    dispatch({ type: 'ADD_CASE', payload: newCase });
  };

  const loadTutorial = () => {
    if (!state.cases.find(c => c.id === tutorialCase.id)) {
        dispatch({ type: 'ADD_CASE', payload: tutorialCase });
    }
    dispatch({ type: 'SET_ACTIVE_CASE', payload: tutorialCase.id });
  };

  const contextValue = { state, dispatch, activeCase, addCase, loadTutorial };

  return (
    <AppContext.Provider value={contextValue}>
      <SidebarProvider>
        <div className="flex h-full">
          <CaseExplorer />
          <main className="flex-1 p-4">
            {activeCase ? (
                <MainView />
            ) : (
                <WelcomeScreen />
            )}
          </main>
        </div>
      </SidebarProvider>
    </AppContext.Provider>
  );
}
