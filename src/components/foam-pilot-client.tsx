'use client';

import React, { createContext, useContext, useReducer, ReactNode, useMemo, useState } from 'react';
import type { Case, CaseFile } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { CaseExplorer } from './case-explorer';
import { MainView } from './main-view';
import { tutorialCase } from '@/lib/mock-data';
import { WelcomeScreen } from './welcome-screen';
import { SettingsPage } from './settings-page';
import { Header } from './header';

type ActiveView = 'welcome' | 'case' | 'settings';

interface AppState {
  cases: Case[];
  activeCaseId: string | null;
  activeView: ActiveView;
}

type Action =
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'DELETE_CASE'; payload: string }
  | { type: 'SET_ACTIVE_CASE'; payload: string | null }
  | { type: 'SET_ACTIVE_VIEW'; payload: ActiveView }
  | { type: 'UPDATE_CASE'; payload: Partial<Case> & { id: string } }
  | { type: 'UPDATE_FILE'; payload: { caseId: string, fileId: string, content: string } }
  | { type: 'ADD_FILE_TO_CASE', payload: {caseId: string, file: CaseFile }};

const initialState: AppState = {
  cases: [],
  activeCaseId: null,
  activeView: 'welcome',
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_CASE':
      return {
        ...state,
        cases: [...state.cases, action.payload],
        activeCaseId: action.payload.id,
        activeView: 'case',
      };
    case 'DELETE_CASE': {
        const newCases = state.cases.filter(c => c.id !== action.payload);
        const newActiveCaseId = state.activeCaseId === action.payload ? (newCases.length > 0 ? newCases[0].id : null) : state.activeCaseId;
        return {
            ...state,
            cases: newCases,
            activeCaseId: newActiveCaseId,
            activeView: newActiveCaseId ? 'case' : 'welcome',
        };
    }
    case 'SET_ACTIVE_CASE':
      return { ...state, activeCaseId: action.payload };
    case 'SET_ACTIVE_VIEW':
        return { ...state, activeView: action.payload };
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
    case 'ADD_FILE_TO_CASE':
        return {
            ...state,
            cases: state.cases.map(c => {
                if (c.id === action.payload.caseId) {
                    // check if file with same name exists, if so, update it. else add it.
                    const fileExists = c.files.some(f => f.name === action.payload.file.name);
                    if (fileExists) {
                        return {
                            ...c,
                            files: c.files.map(f => f.name === action.payload.file.name ? { ...f, content: action.payload.file.content } : f)
                        }
                    }
                    return {
                        ...c,
                        files: [...c.files, action.payload.file]
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
  setActiveView: (view: ActiveView) => void;
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

  const setActiveView = (view: ActiveView) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }

  const loadTutorial = () => {
    if (!state.cases.find(c => c.id === tutorialCase.id)) {
        dispatch({ type: 'ADD_CASE', payload: tutorialCase });
    }
    dispatch({ type: 'SET_ACTIVE_CASE', payload: tutorialCase.id });
    setActiveView('case');
  };
  
  const renderMainContent = () => {
    switch(state.activeView) {
        case 'case':
            return activeCase ? <MainView /> : <WelcomeScreen />;
        case 'settings':
            return <SettingsPage />;
        case 'welcome':
        default:
            return <WelcomeScreen />;
    }
  }

  const contextValue = { state, dispatch, activeCase, addCase, loadTutorial, setActiveView };

  return (
    <AppContext.Provider value={contextValue}>
      <SidebarProvider>
        <div className="flex flex-col h-full">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar collapsible="icon">
              <CaseExplorer />
            </Sidebar>
            <SidebarInset className="p-4 flex-1 overflow-auto grid">
              {renderMainContent()}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AppContext.Provider>
  );
}
