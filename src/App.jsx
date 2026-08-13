import { useCallback, useEffect, useMemo, useState } from 'react';

import Navigation from './components/Navigation';
import PeriodicTable from './components/PeriodicTable';
import Filters from './components/Filters';
import Legend from './components/Legend';
import ElementExplorer from './components/ElementExplorer';
import BondLab from './components/BondLab';
import TrendVisualization from './components/TrendVisualization';
import ComparisonPanel from './components/ComparisonPanel';
import { ElementOfDay, SurpriseMe } from './components/Extras';

import { ELEMENTS, bySym } from './data';
import { emptyFilters, matchesFilters, matchesSearch } from './lib/filters';
import { useTheme } from './hooks/useTheme';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useMediaQuery } from './hooks/useMediaQuery';

export default function App() {
  const [theme, setTheme] = useTheme();
  const [reducedMotion, setReducedMotion] = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [selectedSym, setSelectedSym] = useState(null);
  const [econfigMode, setEconfigMode] = useState('beginner');
  const [bondA, setBondA] = useState('');
  const [bondB, setBondB] = useState('');
  const [compareList, setCompareList] = useState([]);

  const selectedElement = selectedSym ? bySym.get(selectedSym) : null;

  // Escape closes the Explorer.
  useEffect(() => {
    if (!selectedSym) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedSym(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedSym]);

  const resultCount = useMemo(
    () => ELEMENTS.filter((e) => matchesSearch(e, search) && matchesFilters(e, filters)).length,
    [search, filters]
  );

  /**
   * Carries the current element across views so the app behaves as one
   * system: Oxygen -> Bond Lab already has Oxygen in slot A.
   */
  const openBondLabWith = useCallback((sym) => {
    setBondA(sym);
    setBondB((prev) => (prev === sym ? '' : prev));
    setView('bondlab');
    setSelectedSym(null);
  }, []);

  const addToCompare = useCallback((sym) => {
    setCompareList((prev) => (prev.includes(sym) ? prev : [...prev, sym].slice(-4)));
    setView('compare');
    setSelectedSym(null);
  }, []);

  return (
    <div className={reducedMotion ? 'reduced-motion' : undefined} style={{ minHeight: '100%' }}>
      <Navigation
        view={view}
        setView={setView}
        theme={theme}
        setTheme={setTheme}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      <main className="mx-auto max-w-7xl px-4 py-5">
        {view === 'table' && (
          <div className="space-y-4">
            <h2 className="sr-only">Periodic table of the elements</h2>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <Filters
                  search={search}
                  setSearch={setSearch}
                  filters={filters}
                  setFilters={setFilters}
                  resultCount={resultCount}
                />
              </div>
              <div className="flex flex-col gap-2 lg:w-64">
                <ElementOfDay onExplore={setSelectedSym} />
                <SurpriseMe onExplore={setSelectedSym} />
              </div>
            </div>

            {/* Horizontal scroll below ~820px keeps periods and groups intact
                rather than reflowing the table into something unreadable. */}
            <div
              className="overflow-x-auto rounded-2xl p-2 sm:p-4"
              style={{ background: 'var(--panel-bg)', border: '1px solid var(--line-soft)' }}
            >
              <div style={{ minWidth: 820 }}>
                <PeriodicTable
                  elements={ELEMENTS}
                  search={search}
                  filters={filters}
                  selected={selectedSym}
                  onSelect={setSelectedSym}
                />
              </div>
            </div>

            <Legend />
          </div>
        )}

        {view === 'bondlab' && (
          <BondLab
            elA={bondA}
            elB={bondB}
            setElA={setBondA}
            setElB={setBondB}
            reducedMotion={reducedMotion}
          />
        )}

        {view === 'trends' && <TrendVisualization elements={ELEMENTS} />}

        {view === 'compare' && <ComparisonPanel selected={compareList} setSelected={setCompareList} />}
      </main>

      {selectedElement && (
        <>
          <div
            className="fixed inset-0 z-30"
            style={{ background: 'var(--scrim)' }}
            onClick={() => setSelectedSym(null)}
            aria-hidden="true"
          />
          <ElementExplorer
            element={selectedElement}
            onClose={() => setSelectedSym(null)}
            onOpenBondLab={openBondLabWith}
            onAddCompare={addToCompare}
            econfigMode={econfigMode}
            setEconfigMode={setEconfigMode}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
        </>
      )}

      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-2">
        <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
          Element data derived from{' '}
          <a
            href="https://github.com/Bowserinator/Periodic-Table-JSON"
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-2"
          >
            Bowserinator/Periodic-Table-JSON
          </a>
          , licensed CC BY-SA 3.0. Properties that have never been measured are shown as &ldquo;Not
          yet measured&rdquo; rather than estimated.
        </p>
      </footer>
    </div>
  );
}
