/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trophy, Settings, Calendar, History, Swords, ChevronLeft, Save, 
  Users, BarChart3, Play, RotateCcw, Check, Dice1, Dice2, Dice3, 
  Dice4, Dice5, Dice6, Globe, Shield as ShieldIcon, Info, ArrowRight, Dices,
  Wand2, Shuffle, ArrowUpCircle, ArrowDownCircle, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// 1. CONSTANTES Y PRESETS
// ==========================================
const APP_ID = 'hub-football-v2-final';

const PRESETS: Record<string, any[]> = {
  ES: [
    { name: 'Real Madrid', att: 5, opp: 5, def: 4, color1: '#ffffff', color2: '#1e3a8a' },
    { name: 'FC Barcelona', att: 5, opp: 5, def: 4, color1: '#a71930', color2: '#004d98' },
    { name: 'Atlético Madrid', att: 4, opp: 4, def: 4, color1: '#cb3524', color2: '#ffffff' },
    { name: 'Villarreal CF', att: 4, opp: 4, def: 3, color1: '#facc15', color2: '#1e3a8a' },
    { name: 'Real Sociedad', att: 4, opp: 4, def: 4, color1: '#004d98', color2: '#ffffff' },
    { name: 'Athletic Club', att: 4, opp: 4, def: 4, color1: '#cb3524', color2: '#000000' },
    { name: 'Girona FC', att: 4, opp: 5, def: 3, color1: '#cb3524', color2: '#ffffff' },
    { name: 'Real Betis', att: 3, opp: 4, def: 3, color1: '#16a34a', color2: '#ffffff' },
    { name: 'Valencia CF', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'Sevilla FC', att: 3, opp: 4, def: 3, color1: '#ffffff', color2: '#cb3524' },
    { name: 'Osasuna', att: 3, opp: 3, def: 4, color1: '#cb3524', color2: '#1e3a8a' },
    { name: 'Getafe', att: 2, opp: 3, def: 5, color1: '#1e3a8a', color2: '#ffffff' },
    { name: 'Celta Vigo', att: 3, opp: 4, def: 2, color1: '#87d3f8', color2: '#ffffff' },
    { name: 'Mallorca', att: 2, opp: 3, def: 4, color1: '#cb3524', color2: '#000000' },
    { name: 'Rayo Vallecano', att: 2, opp: 4, def: 3, color1: '#ffffff', color2: '#cb3524' },
    { name: 'Las Palmas', att: 2, opp: 4, def: 2, color1: '#facc15', color2: '#1e3a8a' },
    { name: 'Alavés', att: 2, opp: 3, def: 3, color1: '#1e3a8a', color2: '#ffffff' },
    { name: 'Leganés', att: 2, opp: 2, def: 4, color1: '#ffffff', color2: '#1e3a8a' },
    { name: 'Valladolid', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#951b81' },
    { name: 'Espanyol', att: 2, opp: 3, def: 3, color1: '#004d98', color2: '#ffffff' }
  ],
  IT: [
    { name: 'Inter Milan', att: 5, opp: 5, def: 4, color1: '#003399', color2: '#000000' },
    { name: 'Juventus', att: 4, opp: 4, def: 4, color1: '#ffffff', color2: '#000000' },
    { name: 'AC Milan', att: 4, opp: 5, def: 4, color1: '#fb090b', color2: '#000000' },
    { name: 'Napoli', att: 4, opp: 5, def: 3, color1: '#00bfff', color2: '#ffffff' },
    { name: 'AS Roma', att: 4, opp: 4, def: 4, color1: '#8e1f2f', color2: '#f0bc42' },
    { name: 'Atalanta', att: 4, opp: 5, def: 3, color1: '#1e71b8', color2: '#000000' },
    { name: 'Lazio', att: 3, opp: 4, def: 3, color1: '#87d3f8', color2: '#ffffff' },
    { name: 'Fiorentina', att: 3, opp: 4, def: 3, color1: '#4b2e83', color2: '#ffffff' },
    { name: 'Bologna', att: 3, opp: 3, def: 4, color1: '#a71930', color2: '#1e3a8a' },
    { name: 'Torino', att: 2, opp: 3, def: 4, color1: '#8b0000', color2: '#ffffff' },
    { name: 'Monza', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#cb3524' },
    { name: 'Genoa', att: 2, opp: 3, def: 4, color1: '#a71930', color2: '#1e3a8a' },
    { name: 'Lecce', att: 2, opp: 2, def: 4, color1: '#facc15', color2: '#cb3524' },
    { name: 'Udinese', att: 2, opp: 2, def: 4, color1: '#ffffff', color2: '#000000' },
    { name: 'Cagliari', att: 2, opp: 3, def: 3, color1: '#a71930', color2: '#1e3a8a' },
    { name: 'Empoli', att: 2, opp: 2, def: 4, color1: '#1e3a8a', color2: '#ffffff' },
    { name: 'Verona', att: 2, opp: 2, def: 3, color1: '#facc15', color2: '#1e3a8a' },
    { name: 'Parma', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'Como', att: 3, opp: 3, def: 2, color1: '#1e3a8a', color2: '#ffffff' },
    { name: 'Venezia', att: 2, opp: 2, def: 3, color1: '#fb923c', color2: '#16a34a' }
  ],
  EN: [
    { name: 'Man City', att: 5, opp: 5, def: 4, color1: '#6caee0', color2: '#ffffff' },
    { name: 'Liverpool', att: 5, opp: 5, def: 4, color1: '#c8102e', color2: '#f6eb61' },
    { name: 'Arsenal', att: 5, opp: 5, def: 4, color1: '#ef0107', color2: '#ffffff' },
    { name: 'Aston Villa', att: 4, opp: 5, def: 4, color1: '#95bfe5', color2: '#670e36' },
    { name: 'Tottenham', att: 4, opp: 5, def: 3, color1: '#ffffff', color2: '#132257' },
    { name: 'Chelsea', att: 4, opp: 4, def: 3, color1: '#034694', color2: '#ffffff' },
    { name: 'Man United', att: 3, opp: 4, def: 3, color1: '#da291c', color2: '#fbe122' },
    { name: 'Newcastle', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'West Ham', att: 3, opp: 3, def: 3, color1: '#7a263a', color2: '#1bb1e7' },
    { name: 'Brighton', att: 3, opp: 5, def: 2, color1: '#0057b8', color2: '#ffffff' },
    { name: 'Wolves', att: 3, opp: 3, def: 3, color1: '#facc15', color2: '#000000' },
    { name: 'Bournemouth', att: 3, opp: 4, def: 2, color1: '#cb3524', color2: '#000000' },
    { name: 'Fulham', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'Crystal Palace', att: 3, opp: 3, def: 3, color1: '#1e3a8a', color2: '#cb3524' },
    { name: 'Brentford', att: 3, opp: 4, def: 2, color1: '#cb3524', color2: '#ffffff' },
    { name: 'Everton', att: 2, opp: 2, def: 4, color1: '#003399', color2: '#ffffff' },
    { name: 'Nottingham', att: 2, opp: 3, def: 3, color1: '#cb3524', color2: '#ffffff' },
    { name: 'Leicester', att: 2, opp: 3, def: 3, color1: '#1e3a8a', color2: '#ffffff' },
    { name: 'Ipswich', att: 2, opp: 3, def: 2, color1: '#1e3a8a', color2: '#ffffff' },
    { name: 'Southampton', att: 2, opp: 3, def: 2, color1: '#cb3524', color2: '#ffffff' }
  ]
};

const PRESETS_2: Record<string, any[]> = {
  ES: [
    { name: 'Almería', att: 4, opp: 4, def: 3, color1: '#e30613', color2: '#ffffff' },
    { name: 'Granada', att: 4, opp: 4, def: 3, color1: '#cb3524', color2: '#ffffff' },
    { name: 'Cádiz', att: 3, opp: 4, def: 3, color1: '#facc15', color2: '#1e3a8a' },
    { name: 'Levante', att: 3, opp: 4, def: 3, color1: '#004d98', color2: '#a71930' },
    { name: 'Eibar', att: 3, opp: 3, def: 3, color1: '#a71930', color2: '#004d98' },
    { name: 'Oviedo', att: 3, opp: 3, def: 3, color1: '#004d98', color2: '#ffffff' },
    { name: 'Sporting', att: 3, opp: 3, def: 3, color1: '#cb3524', color2: '#ffffff' },
    { name: 'Elche', att: 3, opp: 3, def: 3, color1: '#16a34a', color2: '#ffffff' },
    { name: 'Racing', att: 3, opp: 3, def: 2, color1: '#16a34a', color2: '#000000' },
    { name: 'Zaragoza', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#004d98' },
    { name: 'Tenerife', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#004d98' },
    { name: 'Burgos', att: 2, opp: 2, def: 4, color1: '#ffffff', color2: '#000000' },
    { name: 'Huesca', att: 2, opp: 2, def: 4, color1: '#cb3524', color2: '#004d98' },
    { name: 'Málaga', att: 2, opp: 3, def: 3, color1: '#87d3f8', color2: '#ffffff' },
    { name: 'Castellón', att: 3, opp: 4, def: 2, color1: '#ffffff', color2: '#000000' },
    { name: 'Córdoba', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#16a34a' },
    { name: 'Albacete', att: 2, opp: 3, def: 2, color1: '#ffffff', color2: '#cb3524' },
    { name: 'Cartagena', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'Mirandés', att: 2, opp: 2, def: 3, color1: '#cb3524', color2: '#000000' },
    { name: 'Eldense', att: 2, opp: 2, def: 2, color1: '#cb3524', color2: '#1e3a8a' }
  ],
  IT: [
    { name: 'Sassuolo', att: 4, opp: 4, def: 3, color1: '#00a650', color2: '#000000' },
    { name: 'Salernitana', att: 3, opp: 4, def: 3, color1: '#8b0000', color2: '#ffffff' },
    { name: 'Frosinone', att: 3, opp: 4, def: 3, color1: '#fde100', color2: '#003399' },
    { name: 'Sampdoria', att: 3, opp: 3, def: 3, color1: '#003399', color2: '#ffffff' },
    { name: 'Palermo', att: 3, opp: 3, def: 3, color1: '#ffc0cb', color2: '#000000' },
    { name: 'Cremonese', att: 3, opp: 3, def: 3, color1: '#8b0000', color2: '#a9a9a9' },
    { name: 'Bari', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#fb090b' },
    { name: 'Spezia', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'Pisa', att: 2, opp: 3, def: 3, color1: '#003399', color2: '#000000' },
    { name: 'Brescia', att: 2, opp: 3, def: 3, color1: '#003399', color2: '#ffffff' },
    { name: 'Modena', att: 2, opp: 2, def: 3, color1: '#fde100', color2: '#003399' },
    { name: 'Reggiana', att: 2, opp: 2, def: 3, color1: '#8b0000', color2: '#ffffff' },
    { name: 'Catanzaro', att: 3, opp: 3, def: 2, color1: '#fb090b', color2: '#fde100' },
    { name: 'Cosenza', att: 2, opp: 2, def: 3, color1: '#003399', color2: '#fb090b' },
    { name: 'Sudtirol', att: 2, opp: 2, def: 4, color1: '#ffffff', color2: '#fb090b' },
    { name: 'Cittadella', att: 2, opp: 2, def: 3, color1: '#8b0000', color2: '#ffffff' },
    { name: 'Mantova', att: 2, opp: 3, def: 2, color1: '#fb090b', color2: '#ffffff' },
    { name: 'Cesena', att: 2, opp: 3, def: 2, color1: '#ffffff', color2: '#000000' },
    { name: 'Juve Stabia', att: 2, opp: 2, def: 3, color1: '#fde100', color2: '#003399' },
    { name: 'Carrarese', att: 2, opp: 2, def: 2, color1: '#003399', color2: '#fde100' }
  ],
  EN: [
    { name: 'Leeds', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#1d428a' },
    { name: 'Burnley', att: 4, opp: 4, def: 3, color1: '#6c1d45', color2: '#87ceeb' },
    { name: 'Luton', att: 3, opp: 4, def: 3, color1: '#f78f1e', color2: '#000000' },
    { name: 'Sheffield Utd', att: 3, opp: 4, def: 3, color1: '#ee2737', color2: '#ffffff' },
    { name: 'West Brom', att: 3, opp: 3, def: 3, color1: '#002f68', color2: '#ffffff' },
    { name: 'Norwich', att: 3, opp: 3, def: 3, color1: '#fff200', color2: '#00a650' },
    { name: 'Sunderland', att: 3, opp: 3, def: 3, color1: '#ff0000', color2: '#ffffff' },
    { name: 'Middlesbrough', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff' },
    { name: 'Coventry', att: 2, opp: 3, def: 3, color1: '#87ceeb', color2: '#ffffff' },
    { name: 'Hull City', att: 2, opp: 3, def: 3, color1: '#f5a12d', color2: '#000000' },
    { name: 'Watford', att: 2, opp: 3, def: 3, color1: '#fbee21', color2: '#ed2127' },
    { name: 'Bristol City', att: 2, opp: 2, def: 3, color1: '#e30613', color2: '#ffffff' },
    { name: 'Swansea', att: 2, opp: 3, def: 2, color1: '#ffffff', color2: '#000000' },
    { name: 'Portsmouth', att: 2, opp: 2, def: 3, color1: '#000080', color2: '#ffffff' },
    { name: 'Derby County', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#000000' },
    { name: 'Oxford Utd', att: 2, opp: 2, def: 3, color1: '#ffff00', color2: '#000040' },
    { name: 'Blackburn', att: 2, opp: 3, def: 2, color1: '#0000ff', color2: '#ffffff' },
    { name: 'Preston', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#000040' },
    { name: 'QPR', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#0000ff' },
    { name: 'Millwall', att: 2, opp: 2, def: 4, color1: '#000040', color2: '#ffffff' }
  ]
};

// ==========================================
// 2. HELPERS Y LÓGICA DE JUEGO
// ==========================================

const generateLeagueSchedule = (teams: any[]) => {
  if (!teams || teams.length < 2) return [];
  const n = teams.length;
  const teamIds = teams.map(t => t.id);
  const rounds = [];
  for (let j = 0; j < (n - 1) * 2; j++) {
    const round = [];
    const isReturn = j >= (n - 1);
    const r = isReturn ? j - (n - 1) : j;
    for (let i = 0; i < n / 2; i++) {
      const home = i === 0 ? teamIds[n - 1] : teamIds[(r + i) % (n - 1)];
      const away = teamIds[(n - 1 - i + r) % (n - 1)];
      if (isReturn) round.push({ homeId: away, awayId: home });
      else round.push({ homeId: home, awayId: away });
    }
    rounds.push(round);
  }
  return rounds;
};

const getDefaultComps = () => {
  const baseTeam = (presetKey: string, isDiv2 = false) => {
    const list = isDiv2 ? PRESETS_2[presetKey] || PRESETS_2.ES : PRESETS[presetKey] || PRESETS.ES;
    const offset = isDiv2 ? 100 : 0;
    return list.map((t, i) => ({ 
      ...t, id: i + 1 + offset, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, league: presetKey 
    }));
  };

  const getLeague = (name: string, key: string) => ({
    type: 'league', name, teams: baseTeam(key), teams2: baseTeam(key, true),
    matchday: 0, matchday2: 0, history: [], history2: [], showWinner: false, showWinner2: false, userTeamId: 1
  });

  return {
    'L1': getLeague('Liga Española', 'ES'),
    'L2': getLeague('Liga Italiana', 'IT'),
    'L3': getLeague('Liga Inglesa', 'EN'),
    'C1': { type: 'cup', name: 'Champions League', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null },
    'C2': { type: 'cup', name: 'Copa del Mundo', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null }
  };
};

// ==========================================
// 3. COMPONENTES DE UI
// ==========================================

const Shield = ({ color1, color2, initial, size = 'md' }: any) => {
  const dims = size === 'lg' ? 'w-16 h-20' : size === 'sm' ? 'w-8 h-10' : 'w-12 h-14';
  return (
    <div className={`${dims} relative overflow-hidden shadow-md shrink-0`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)' }}>
      <div className='absolute inset-0 flex'>
        <div className='w-1/2 h-full' style={{ backgroundColor: color1 }}></div>
        <div className='w-1/2 h-full' style={{ backgroundColor: color2 }}></div>
      </div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-xs font-black text-white mix-blend-difference italic'>{initial?.[0]}</span>
      </div>
    </div>
  );
};

const AttrStepper = ({ label, val, min, max, onUpdate }: any) => (
  <div className='flex flex-col items-center bg-black/40 rounded-xl p-1.5 border border-white/10'>
    <span className='text-[7px] font-black uppercase text-slate-400 mb-1'>{label}</span>
    <div className='flex items-center gap-2'>
      <button onClick={() => onUpdate(Math.max(min, val - 1))} className='w-5 h-5 bg-slate-800 rounded text-white text-xs'>-</button>
      <span className='text-[10px] font-black w-3 text-center'>{val}</span>
      <button onClick={() => onUpdate(Math.min(max, val + 1))} className='w-5 h-5 bg-slate-800 rounded text-white text-xs'>+</button>
    </div>
  </div>
);

// ==========================================
// 4. APLICACIÓN PRINCIPAL
// ==========================================

export default function App() {
  const [view, setView] = useState('hub');
  const [activeCompId, setActiveCompId] = useState<string | null>(null);
  const [compView, setCompView] = useState('main');
  const [viewDiv, setViewDiv] = useState(1); // 1 o 2
  const [matchState, setMatchState] = useState<any>(null);
  const [rolling, setRolling] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState<any>(null);

  // PERSISTENCIA
  const [comps, setComps] = useState<any>(() => {
    const saved = localStorage.getItem(APP_ID);
    return saved ? JSON.parse(saved) : getDefaultComps();
  });

  useEffect(() => {
    localStorage.setItem(APP_ID, JSON.stringify(comps));
  }, [comps]);

  const activeComp = activeCompId ? comps[activeCompId] : null;

  const updateActiveComp = (newData: any) => {
    if (!activeCompId) return;
    setComps((prev: any) => ({ ...prev, [activeCompId]: { ...prev[activeCompId], ...newData } }));
  };

  // LÓGICA DE ASCENSO / DESCENSO
  const handleSeasonEnd = (compId: string) => {
    const comp = comps[compId];
    if (comp.processingPromotion) return;

    const s1 = [...comp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const s2 = [...comp.teams2].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    const relegated = s1.slice(-3); // 18, 19, 20
    const promoted = s2.slice(0, 3); // 1, 2, 3

    // Guardar stats originales de los que bajan para dárselos a los que suben
    const origStats = relegated.map(t => ({ att: t.att, opp: t.opp, def: t.def }));

    // Boost descendidos
    const boostedRelegated = relegated.map((t, i) => ({
      ...t,
      att: i === 0 ? 5 : i === 1 ? 4 : 3,
      opp: i === 0 ? 5 : i === 1 ? 4 : 4,
      def: i === 0 ? 3 : i === 1 ? 4 : 3,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
    }));

    // Ascendidos heredan stats originales
    const adjustedPromoted = promoted.map((t, i) => ({
      ...t,
      att: origStats[i].att,
      opp: origStats[i].opp,
      def: origStats[i].def,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
    }));

    const resetStats = (t: any) => ({ ...t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });

    const next1 = [...s1.slice(0, -3).map(resetStats), ...adjustedPromoted];
    const next2 = [...s2.slice(3).map(resetStats), ...boostedRelegated];

    setShowPromoModal({ relegated, promoted });
    setComps((prev: any) => ({
      ...prev,
      [compId]: { 
        ...prev[compId], 
        teams: next1, teams2: next2, 
        matchday: 0, matchday2: 0, 
        history: [], history2: [],
        showWinner: false, showWinner2: false
      }
    }));
  };

  // LÓGICA DE PARTIDO
  const startMatch = (hId: number, aId: number, isDiv2: boolean) => {
    const teams = isDiv2 ? activeComp.teams2 : activeComp.teams;
    const home = teams.find((t: any) => t.id === hId);
    const away = teams.find((t: any) => t.id === aId);
    setMatchState({ home, away, scoreH: 0, scoreA: 0, oppH: home.opp, oppA: away.opp, turn: 'H', phase: 'att', isDiv2, logs: ['¡Empieza el partido!'], lastDie: 1, finished: false });
    setCompView('playing');
  };

  const handleRoll = () => {
    if (rolling || matchState.finished) return;
    setRolling(true);
    setTimeout(() => {
      const die = Math.floor(Math.random() * 6) + 1;
      setMatchState((prev: any) => {
        const isH = prev.turn === 'H';
        const atk = isH ? prev.home : prev.away;
        const dfd = isH ? prev.away : prev.home;
        let { scoreH, scoreA, phase, logs } = prev;
        let nextPhase = phase;

        if (phase === 'att') {
          if (die <= atk.att) {
            logs.unshift(`🎯 ${atk.name} saca ${die}. ¡Peligro!`);
            nextPhase = 'gk';
          } else {
            logs.unshift(`❌ ${atk.name} falla (${die}).`);
            return advance(prev, die, logs);
          }
        } else {
          if (die > dfd.def) {
            logs.unshift(`⚽ ¡GOL de ${atk.name}! (${die})`);
            isH ? scoreH++ : scoreA++;
          } else {
            logs.unshift(`🧤 ¡PARADÓN! (${die})`);
          }
          nextPhase = 'att';
          return advance({ ...prev, scoreH, scoreA }, die, logs);
        }
        return { ...prev, lastDie: die, phase: nextPhase, logs };
      });
      setRolling(false);
    }, 600);
  };

  const advance = (s: any, die: number, logs: string[]) => {
    let { oppH, oppA, turn } = s;
    if (turn === 'H') oppH--; else oppA--;
    let nextTurn = turn === 'H' ? 'A' : 'H';
    if (nextTurn === 'H' && oppH <= 0) nextTurn = 'A';
    if (nextTurn === 'A' && oppA <= 0) nextTurn = 'H';
    const finished = oppH <= 0 && oppA <= 0;
    if (finished) logs.unshift('🏁 Final del partido.');
    return { ...s, lastDie: die, oppH, oppA, turn: nextTurn, phase: 'att', logs, finished };
  };

  const finalizeMatch = () => {
    const isDiv2 = matchState.isDiv2;
    const teams = isDiv2 ? activeComp.teams2 : activeComp.teams;
    const mday = isDiv2 ? activeComp.matchday2 : activeComp.matchday;
    const hist = isDiv2 ? activeComp.history2 : activeComp.history;

    const schedule = generateLeagueSchedule(teams);
    const round = schedule[mday];

    const results = round.map((m: any) => {
      if (m.homeId === matchState.home.id || m.awayId === matchState.home.id || m.homeId === matchState.away.id || m.awayId === matchState.away.id) {
        const isH = m.homeId === matchState.home.id || m.homeId === matchState.away.id;
        const hS = m.homeId === matchState.home.id ? matchState.scoreH : matchState.scoreA;
        const aS = m.awayId === matchState.away.id ? matchState.scoreA : matchState.scoreH;
        return { hId: m.homeId, aId: m.awayId, sh: hS, sa: aS };
      }
      const h = teams.find((t: any) => t.id === m.homeId);
      const a = teams.find((t: any) => t.id === m.awayId);
      let sh = 0, sa = 0;
      for(let i=0; i<h.opp; i++) if(Math.floor(Math.random()*6)+1 <= h.att && Math.floor(Math.random()*6)+1 > a.def) sh++;
      for(let i=0; i<a.opp; i++) if(Math.floor(Math.random()*6)+1 <= a.att && Math.floor(Math.random()*6)+1 > h.def) sa++;
      return { hId: m.homeId, aId: m.awayId, sh, sa };
    });

    const updatedTeams = teams.map((t: any) => {
      const res = results.find(r => r.hId === t.id || r.aId === t.id);
      if (!res) return t;
      const isH = res.hId === t.id;
      const gf = isH ? res.sh : res.sa;
      const ga = isH ? res.sa : res.sh;
      const w = gf > ga ? 1 : 0, d = gf === ga ? 1 : 0, l = gf < ga ? 1 : 0;
      return { ...t, p: t.p+1, w: t.w+w, d: t.d+d, l: t.l+l, gf: t.gf+gf, ga: t.ga+ga, pts: t.pts + (w*3 + d) };
    });

    const isLast = mday === schedule.length - 1;
    const update: any = isDiv2 
      ? { teams2: updatedTeams, matchday2: isLast ? mday : mday + 1, history2: [{ day: mday+1, results }, ...hist], showWinner2: isLast }
      : { teams: updatedTeams, matchday: isLast ? mday : mday + 1, history: [{ day: mday+1, results }, ...hist], showWinner: isLast };
    
    updateActiveComp(update);
    setCompView('main');
    setMatchState(null);
  };

  // VISTAS
  const Hub = () => (
    <div className='p-6 space-y-8'>
      <header className='text-center py-10'>
        <h1 className='text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400'>Football Hub</h1>
        <p className='text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2'>Elite Simulation Engine</p>
      </header>
      <div className='grid gap-4'>
        {Object.entries(comps).filter(([_, c]: any) => c.type === 'league').map(([id, c]: any) => (
          <button key={id} onClick={() => { setActiveCompId(id); setView('competition'); }} className='p-6 bg-slate-900/40 rounded-[2rem] border border-white/10 flex items-center justify-between hover:bg-slate-800 transition-all'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400'><ShieldIcon size={24}/></div>
              <div className='text-left'>
                <h3 className='text-sm font-black uppercase italic text-white'>{c.name}</h3>
                <p className='text-[9px] font-bold text-slate-500 uppercase'>1ª y 2ª División</p>
              </div>
            </div>
            <ArrowRight size={20} className='text-slate-600'/>
          </button>
        ))}
      </div>
    </div>
  );

  const Competition = () => {
    const isDiv2 = viewDiv === 2;
    const teams = isDiv2 ? activeComp.teams2 : activeComp.teams;
    const mday = isDiv2 ? activeComp.matchday2 : activeComp.matchday;
    const sorted = [...teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const userTeam = teams.find((t: any) => t.id === activeComp.userTeamId) || teams[0];
    const schedule = generateLeagueSchedule(teams);
    const nextMatch = schedule[mday]?.find((m: any) => m.homeId === userTeam.id || m.awayId === userTeam.id) || schedule[mday]?.[0];

    const isFinished = activeComp.matchday === generateLeagueSchedule(activeComp.teams).length - 1 && 
                       activeComp.matchday2 === generateLeagueSchedule(activeComp.teams2).length - 1;

    if (compView === 'playing') return (
      <div className='p-4 flex flex-col min-h-screen'>
        <div className='bg-slate-900/60 rounded-[2.5rem] p-6 mb-4 border-b-4 border-slate-800'>
          <div className='flex items-center justify-between'>
            <div className='text-center w-24'>
              <Shield color1={matchState.home.color1} color2={matchState.home.color2} initial={matchState.home.name} size='lg'/>
              <p className='text-[10px] font-black uppercase italic mt-2 truncate'>{matchState.home.name}</p>
            </div>
            <div className='text-center'>
              <div className='text-5xl font-black italic tabular-nums'>{matchState.scoreH} - {matchState.scoreA}</div>
              {!matchState.finished && <div className='text-[8px] font-bold text-slate-500 uppercase mt-2'>{matchState.oppH} vs {matchState.oppA} Tiros</div>}
            </div>
            <div className='text-center w-24'>
              <Shield color1={matchState.away.color1} color2={matchState.away.color2} initial={matchState.away.name} size='lg'/>
              <p className='text-[10px] font-black uppercase italic mt-2 truncate'>{matchState.away.name}</p>
            </div>
          </div>
        </div>
        <div className='flex-grow bg-emerald-900/20 rounded-[3rem] border-4 border-white/5 flex flex-col items-center justify-center relative overflow-hidden'>
          <div className='absolute top-1/2 w-full h-px bg-white/10'></div>
          <div className='z-10 flex flex-col items-center gap-8'>
            <motion.div animate={rolling ? { rotate: 360, scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 0.4 }}>
              <DieIcon value={matchState.lastDie} className='w-20 h-20 text-white'/>
            </motion.div>
            {!matchState.finished ? (
              <button onClick={handleRoll} disabled={rolling} className='bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest active:scale-90 transition-all'>Lanzar</button>
            ) : (
              <button onClick={finalizeMatch} className='bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest active:scale-90 transition-all'>Finalizar</button>
            )}
          </div>
        </div>
        <div className='h-32 mt-4 bg-black/40 rounded-2xl p-4 overflow-y-auto space-y-1'>
          {matchState.logs.map((l: string, i: number) => <div key={i} className={`text-[10px] font-bold italic ${i === 0 ? 'text-white' : 'text-slate-500'}`}>• {l}</div>)}
        </div>
      </div>
    );

    if (compView === 'config') return (
      <div className='p-6 space-y-6'>
        <header className='flex items-center gap-4'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900 rounded-xl'><ChevronLeft/></button>
          <h2 className='text-xl font-black uppercase italic'>Ajustes</h2>
        </header>
        <div className='bg-red-900/20 p-4 rounded-2xl border border-red-500/30'>
          <h4 className='text-xs font-black text-red-400 uppercase flex items-center gap-2 mb-3'><AlertTriangle size={14}/> Reset Total</h4>
          <button onClick={() => { if(window.confirm('¿Restaurar valores originales?')) updateActiveComp(getDefaultComps()[activeCompId!]); }} className='w-full py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px]'>Restaurar Liga</button>
        </div>
        <div className='space-y-4'>
          {teams.map((t: any) => (
            <div key={t.id} className='p-4 bg-slate-900/40 rounded-3xl border border-white/10 flex items-center gap-4'>
              <Shield color1={t.color1} color2={t.color2} initial={t.name} size='sm'/>
              <div className='flex-grow'>
                <input className='bg-transparent text-sm font-black uppercase italic outline-none w-full' value={t.name} onChange={e => {
                  const nt = teams.map((x: any) => x.id === t.id ? { ...x, name: e.target.value } : x);
                  updateActiveComp(isDiv2 ? { teams2: nt } : { teams: nt });
                }}/>
                <div className='grid grid-cols-3 gap-2 mt-2'>
                  <AttrStepper label="Atk" val={t.att} min={1} max={5} onUpdate={(v: any) => {
                    const nt = teams.map((x: any) => x.id === t.id ? { ...x, att: v } : x);
                    updateActiveComp(isDiv2 ? { teams2: nt } : { teams: nt });
                  }}/>
                  <AttrStepper label="Tir" val={t.opp} min={1} max={5} onUpdate={(v: any) => {
                    const nt = teams.map((x: any) => x.id === t.id ? { ...x, opp: v } : x);
                    updateActiveComp(isDiv2 ? { teams2: nt } : { teams: nt });
                  }}/>
                  <AttrStepper label="Def" val={t.def} min={1} max={4} onUpdate={(v: any) => {
                    const nt = teams.map((x: any) => x.id === t.id ? { ...x, def: v } : x);
                    updateActiveComp(isDiv2 ? { teams2: nt } : { teams: nt });
                  }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className='p-4 space-y-6'>
        <header className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button onClick={() => setView('hub')} className='p-2 bg-slate-900 rounded-xl'><ChevronLeft/></button>
            <h2 className='text-xl font-black uppercase italic'>{activeComp.name}</h2>
          </div>
          <button onClick={() => setCompView('config')} className='p-2 bg-slate-900 rounded-xl'><Settings size={20}/></button>
        </header>

        <div className='flex bg-slate-900/60 p-1 rounded-2xl border border-white/10'>
          <button onClick={() => setViewDiv(1)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${!isDiv2 ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>1ª División</button>
          <button onClick={() => setViewDiv(2)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${isDiv2 ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>2ª División</button>
        </div>

        {isFinished && (
          <button onClick={() => handleSeasonEnd(activeCompId!)} className='w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl font-black uppercase italic text-white shadow-lg animate-pulse flex items-center justify-center gap-2'>
            <ArrowUpCircle size={20}/> Procesar Ascensos y Descensos <ArrowDownCircle size={20}/>
          </button>
        )}

        <section className='bg-slate-900/40 rounded-[2rem] p-4 border border-white/10'>
          <h3 className='text-[10px] font-black uppercase text-slate-500 mb-4'>Clasificación {isDiv2 ? '2ª' : '1ª'} Div</h3>
          <div className='space-y-2'>
            {sorted.map((t, i) => (
              <div key={t.id} className={`flex items-center gap-3 p-2 rounded-xl bg-black/20 ${isDiv2 && i < 3 ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : !isDiv2 && i >= sorted.length - 3 ? 'bg-red-500/10 border-l-2 border-red-500' : ''}`}>
                <span className='text-[10px] font-black text-slate-500 w-4'>{i+1}</span>
                <Shield color1={t.color1} color2={t.color2} initial={t.name} size='sm'/>
                <span className='text-[11px] font-bold uppercase truncate flex-grow'>{t.name}</span>
                <span className='text-[10px] font-black text-emerald-400'>{t.pts} PTS</span>
              </div>
            ))}
          </div>
        </section>

        {nextMatch && (
          <div className='bg-gradient-to-br from-blue-700 to-indigo-900 p-6 rounded-[2.5rem] shadow-2xl'>
            <div className='flex justify-between items-center mb-6'>
              <div className='text-center w-20'>
                <Shield color1={teams.find((t: any) => t.id === nextMatch.homeId)?.color1} color2={teams.find((t: any) => t.id === nextMatch.homeId)?.color2} initial={teams.find((t: any) => t.id === nextMatch.homeId)?.name} size='lg'/>
                <p className='text-[9px] font-black uppercase mt-2 truncate text-white'>{teams.find((t: any) => t.id === nextMatch.homeId)?.name}</p>
              </div>
              <div className='text-white/20 font-black italic text-2xl'>VS</div>
              <div className='text-center w-20'>
                <Shield color1={teams.find((t: any) => t.id === nextMatch.awayId)?.color1} color2={teams.find((t: any) => t.id === nextMatch.awayId)?.color2} initial={teams.find((t: any) => t.id === nextMatch.awayId)?.name} size='lg'/>
                <p className='text-[9px] font-black uppercase mt-2 truncate text-white'>{teams.find((t: any) => t.id === nextMatch.awayId)?.name}</p>
              </div>
            </div>
            <button onClick={() => startMatch(nextMatch.homeId, nextMatch.awayId, isDiv2)} className='w-full py-4 bg-white text-slate-950 rounded-2xl font-black uppercase italic text-xs active:scale-95 transition-all'>Jugar Jornada {mday + 1}</button>
          </div>
        )}
      </div>
    );
  };

  const DieIcon = ({ value, className }: any) => {
    const Icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const Icon = Icons[value - 1] || Dices;
    return <Icon className={className}/>;
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden'>
      <div className='fixed inset-0 bg-[url("https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000")] bg-cover bg-center opacity-10 pointer-events-none'></div>
      <div className='relative z-10 max-w-md mx-auto min-h-screen flex flex-col'>
        <AnimatePresence mode='wait'>
          {view === 'hub' && <motion.div key='hub' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Hub/></motion.div>}
          {view === 'competition' && <motion.div key='comp' initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}><Competition/></motion.div>}
        </AnimatePresence>

        {showPromoModal && (
          <div className='fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6'>
            <div className='bg-slate-900 rounded-[3rem] p-8 border border-white/10 w-full max-w-sm text-center'>
              <Trophy size={60} className='text-yellow-400 mx-auto mb-6'/>
              <h2 className='text-3xl font-black uppercase italic mb-2'>Temporada Finalizada</h2>
              <p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8'>Resumen de movimientos</p>
              <div className='space-y-4 mb-8'>
                <div className='bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20'>
                  <h4 className='text-[10px] font-black text-emerald-400 uppercase mb-2 flex items-center gap-2'><ArrowUpCircle size={14}/> Ascensos a 1ª</h4>
                  <div className='text-[11px] font-bold uppercase italic'>{showPromoModal.promoted.map((t: any) => t.name).join(', ')}</div>
                </div>
                <div className='bg-red-500/10 p-4 rounded-2xl border border-red-500/20'>
                  <h4 className='text-[10px] font-black text-red-400 uppercase mb-2 flex items-center gap-2'><ArrowDownCircle size={14}/> Descensos a 2ª</h4>
                  <div className='text-[11px] font-bold uppercase italic'>{showPromoModal.relegated.map((t: any) => t.name).join(', ')}</div>
                </div>
              </div>
              <button onClick={() => setShowPromoModal(null)} className='w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase italic active:scale-95 transition-all'>Empezar Nueva Temporada</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}