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
// 1. TIPOS Y ESTRUCTURAS
// ==========================================

interface Team {
  id: number;
  name: string;
  att: number;
  opp: number;
  def: number;
  color1: string;
  color2: string;
  league: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
  isFlag?: boolean;
  region?: string;
}

interface LeagueComp {
  type: 'league';
  name: string;
  teams: Team[];      // 1ª División
  teams2: Team[];     // 2ª División
  matchday: number;   // Jornada 1ª
  matchday2: number;  // Jornada 2ª
  history: any[];     // Historial 1ª
  history2: any[];    // Historial 2ª
  showWinner: boolean;
  showWinner2: boolean;
  userTeamId: number;
  processingPromotion?: boolean;
}

interface CupComp {
  type: 'cup';
  name: string;
  teams: Team[];
  matchday: number;
  history: any[];
  userTeamId: number;
  showWinner: boolean;
  phase: string;
  bracket: any;
  groups?: any[];
}

type Competition = LeagueComp | CupComp;

// ==========================================
// 2. PRESETS (PRIMERA DIVISIÓN)
// ==========================================

const PRESETS: Record<string, any[]> = {
  ES: [
    { name: 'Real Madrid', att: 5, opp: 5, def: 4, color1: '#ffffff', color2: '#1e3a8a', league: 'ES' },
    { name: 'FC Barcelona', att: 5, opp: 5, def: 4, color1: '#a71930', color2: '#004d98', league: 'ES' },
    { name: 'Atlético Madrid', att: 4, opp: 4, def: 4, color1: '#cb3524', color2: '#ffffff', league: 'ES' },
    { name: 'Villarreal CF', att: 4, opp: 4, def: 3, color1: '#facc15', color2: '#1e3a8a', league: 'ES' },
    { name: 'Real Sociedad', att: 4, opp: 4, def: 4, color1: '#004d98', color2: '#ffffff', league: 'ES' },
    { name: 'Athletic Club', att: 4, opp: 4, def: 4, color1: '#cb3524', color2: '#000000', league: 'ES' },
    { name: 'Girona FC', att: 4, opp: 5, def: 3, color1: '#cb3524', color2: '#ffffff', league: 'ES' },
    { name: 'Real Betis', att: 3, opp: 4, def: 3, color1: '#16a34a', color2: '#ffffff', league: 'ES' },
    { name: 'Valencia CF', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#000000', league: 'ES' },
    { name: 'Sevilla FC', att: 3, opp: 4, def: 3, color1: '#ffffff', color2: '#cb3524', league: 'ES' },
    { name: 'Osasuna', att: 3, opp: 3, def: 4, color1: '#cb3524', color2: '#1e3a8a', league: 'ES' },
    { name: 'Getafe', att: 2, opp: 3, def: 5, color1: '#1e3a8a', color2: '#ffffff', league: 'ES' },
    { name: 'Celta Vigo', att: 3, opp: 4, def: 2, color1: '#87d3f8', color2: '#ffffff', league: 'ES' },
    { name: 'Mallorca', att: 2, opp: 3, def: 4, color1: '#cb3524', color2: '#000000', league: 'ES' },
    { name: 'Rayo Vallecano', att: 2, opp: 4, def: 3, color1: '#ffffff', color2: '#cb3524', league: 'ES' },
    { name: 'Las Palmas', att: 2, opp: 4, def: 2, color1: '#facc15', color2: '#1e3a8a', league: 'ES' },
    { name: 'Alavés', att: 2, opp: 3, def: 3, color1: '#1e3a8a', color2: '#ffffff', league: 'ES' },
    { name: 'Leganés', att: 2, opp: 2, def: 4, color1: '#ffffff', color2: '#1e3a8a', league: 'ES' },
    { name: 'Valladolid', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#951b81', league: 'ES' },
    { name: 'Espanyol', att: 2, opp: 3, def: 3, color1: '#004d98', color2: '#ffffff', league: 'ES' }
  ],
  IT: [
    { name: 'Inter Milan', att: 5, opp: 5, def: 4, color1: '#003399', color2: '#000000', league: 'IT' },
    { name: 'Juventus', att: 4, opp: 4, def: 4, color1: '#ffffff', color2: '#000000', league: 'IT' },
    { name: 'AC Milan', att: 4, opp: 5, def: 4, color1: '#fb090b', color2: '#000000', league: 'IT' },
    { name: 'Napoli', att: 4, opp: 5, def: 3, color1: '#00bfff', color2: '#ffffff', league: 'IT' },
    { name: 'AS Roma', att: 4, opp: 4, def: 4, color1: '#8e1f2f', color2: '#f0bc42', league: 'IT' },
    { name: 'Atalanta', att: 4, opp: 5, def: 3, color1: '#1e71b8', color2: '#000000', league: 'IT' },
    { name: 'Lazio', att: 3, opp: 4, def: 3, color1: '#87d3f8', color2: '#ffffff', league: 'IT' },
    { name: 'Fiorentina', att: 3, opp: 4, def: 3, color1: '#4b2e83', color2: '#ffffff', league: 'IT' },
    { name: 'Bologna', att: 3, opp: 3, def: 4, color1: '#a71930', color2: '#1e3a8a', league: 'IT' },
    { name: 'Torino', att: 2, opp: 3, def: 4, color1: '#8b0000', color2: '#ffffff', league: 'IT' },
    { name: 'Monza', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#cb3524', league: 'IT' },
    { name: 'Genoa', att: 2, opp: 3, def: 4, color1: '#a71930', color2: '#1e3a8a', league: 'IT' },
    { name: 'Lecce', att: 2, opp: 2, def: 4, color1: '#facc15', color2: '#cb3524', league: 'IT' },
    { name: 'Udinese', att: 2, opp: 2, def: 4, color1: '#ffffff', color2: '#000000', league: 'IT' },
    { name: 'Cagliari', att: 2, opp: 3, def: 3, color1: '#a71930', color2: '#1e3a8a', league: 'IT' },
    { name: 'Empoli', att: 2, opp: 2, def: 4, color1: '#1e3a8a', color2: '#ffffff', league: 'IT' },
    { name: 'Verona', att: 2, opp: 2, def: 3, color1: '#facc15', color2: '#1e3a8a', league: 'IT' },
    { name: 'Parma', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#000000', league: 'IT' },
    { name: 'Como', att: 3, opp: 3, def: 2, color1: '#1e3a8a', color2: '#ffffff', league: 'IT' },
    { name: 'Venezia', att: 2, opp: 2, def: 3, color1: '#fb923c', color2: '#16a34a', league: 'IT' }
  ],
  EN: [
    { name: 'Manchester City', att: 5, opp: 5, def: 4, color1: '#6caee0', color2: '#ffffff', league: 'EN' },
    { name: 'Liverpool FC', att: 5, opp: 5, def: 4, color1: '#c8102e', color2: '#f6eb61', league: 'EN' },
    { name: 'Arsenal FC', att: 5, opp: 5, def: 4, color1: '#ef0107', color2: '#ffffff', league: 'EN' },
    { name: 'Aston Villa', att: 4, opp: 5, def: 4, color1: '#95bfe5', color2: '#670e36', league: 'EN' },
    { name: 'Tottenham', att: 4, opp: 5, def: 3, color1: '#ffffff', color2: '#132257', league: 'EN' },
    { name: 'Chelsea FC', att: 4, opp: 4, def: 3, color1: '#034694', color2: '#ffffff', league: 'EN' },
    { name: 'Man United', att: 3, opp: 4, def: 3, color1: '#da291c', color2: '#fbe122', league: 'EN' },
    { name: 'Newcastle', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#000000', league: 'EN' },
    { name: 'West Ham', att: 3, opp: 3, def: 3, color1: '#7a263a', color2: '#1bb1e7', league: 'EN' },
    { name: 'Brighton', att: 3, opp: 5, def: 2, color1: '#0057b8', color2: '#ffffff', league: 'EN' },
    { name: 'Wolves', att: 3, opp: 3, def: 3, color1: '#facc15', color2: '#000000', league: 'EN' },
    { name: 'Bournemouth', att: 3, opp: 4, def: 2, color1: '#cb3524', color2: '#000000', league: 'EN' },
    { name: 'Fulham', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#000000', league: 'EN' },
    { name: 'Crystal Palace', att: 3, opp: 3, def: 3, color1: '#1e3a8a', color2: '#cb3524', league: 'EN' },
    { name: 'Brentford', att: 3, opp: 4, def: 2, color1: '#cb3524', color2: '#ffffff', league: 'EN' },
    { name: 'Everton', att: 2, opp: 2, def: 4, color1: '#003399', color2: '#ffffff', league: 'EN' },
    { name: 'Nottingham Forest', att: 2, opp: 3, def: 3, color1: '#cb3524', color2: '#ffffff', league: 'EN' },
    { name: 'Leicester City', att: 2, opp: 3, def: 3, color1: '#1e3a8a', color2: '#ffffff', league: 'EN' },
    { name: 'Ipswich Town', att: 2, opp: 3, def: 2, color1: '#1e3a8a', color2: '#ffffff', league: 'EN' },
    { name: 'Southampton', att: 2, opp: 3, def: 2, color1: '#cb3524', color2: '#ffffff', league: 'EN' }
  ]
};

// ==========================================
// 3. PRESETS (SEGUNDA DIVISIÓN)
// ==========================================

const PRESETS_2: Record<string, any[]> = {
  ES: [
    { name: 'Almería', att: 5, opp: 5, def: 3, color1: '#e30613', color2: '#ffffff', league: 'ES' },
    { name: 'Cádiz CF', att: 4, opp: 4, def: 4, color1: '#fde100', color2: '#0000ff', league: 'ES' },
    { name: 'Granada CF', att: 4, opp: 5, def: 3, color1: '#c8102e', color2: '#ffffff', league: 'ES' },
    { name: 'SD Eibar', att: 4, opp: 4, def: 4, color1: '#a71930', color2: '#004d98', league: 'ES' },
    { name: 'Sporting Gijón', att: 4, opp: 4, def: 3, color1: '#e30613', color2: '#ffffff', league: 'ES' },
    { name: 'Real Oviedo', att: 3, opp: 4, def: 4, color1: '#00529f', color2: '#ffffff', league: 'ES' },
    { name: 'Levante UD', att: 4, opp: 4, def: 3, color1: '#a71930', color2: '#004d98', league: 'ES' },
    { name: 'Real Zaragoza', att: 3, opp: 4, def: 4, color1: '#ffffff', color2: '#00529f', league: 'ES' },
    { name: 'Racing Santander', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#006400', league: 'ES' },
    { name: 'Elche CF', att: 3, opp: 4, def: 3, color1: '#ffffff', color2: '#006400', league: 'ES' },
    { name: 'CD Tenerife', att: 3, opp: 3, def: 4, color1: '#ffffff', color2: '#00529f', league: 'ES' },
    { name: 'Burgos CF', att: 2, opp: 3, def: 4, color1: '#ffffff', color2: '#000000', league: 'ES' },
    { name: 'SD Huesca', att: 2, opp: 3, def: 4, color1: '#a71930', color2: '#004d98', league: 'ES' },
    { name: 'Málaga CF', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#87ceeb', league: 'ES' },
    { name: 'Dep. La Coruña', att: 3, opp: 4, def: 3, color1: '#ffffff', color2: '#00529f', league: 'ES' },
    { name: 'Castellón', att: 4, opp: 4, def: 2, color1: '#000000', color2: '#ffffff', league: 'ES' },
    { name: 'Córdoba CF', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#006400', league: 'ES' },
    { name: 'Albacete', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#8b0000', league: 'ES' },
    { name: 'Mirandés', att: 2, opp: 2, def: 4, color1: '#e30613', color2: '#000000', league: 'ES' },
    { name: 'Eldense', att: 2, opp: 3, def: 2, color1: '#e30613', color2: '#0000ff', league: 'ES' }
  ],
  IT: [
    { name: 'Sassuolo', att: 5, opp: 5, def: 3, color1: '#000000', color2: '#00a650', league: 'IT' },
    { name: 'Frosinone', att: 4, opp: 4, def: 3, color1: '#ffcc00', color2: '#0033a0', league: 'IT' },
    { name: 'Salernitana', att: 4, opp: 4, def: 3, color1: '#8b0000', color2: '#ffffff', league: 'IT' },
    { name: 'Sampdoria', att: 4, opp: 5, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'IT' },
    { name: 'Palermo', att: 4, opp: 4, def: 3, color1: '#ffc0cb', color2: '#000000', league: 'IT' },
    { name: 'Cremonese', att: 4, opp: 4, def: 4, color1: '#8b0000', color2: '#a9a9a9', league: 'IT' },
    { name: 'Brescia', att: 3, opp: 4, def: 4, color1: '#0033a0', color2: '#ffffff', league: 'IT' },
    { name: 'Bari', att: 3, opp: 4, def: 3, color1: '#ffffff', color2: '#e30613', league: 'IT' },
    { name: 'Pisa', att: 4, opp: 4, def: 3, color1: '#000000', color2: '#0033a0', league: 'IT' },
    { name: 'Spezia', att: 3, opp: 3, def: 4, color1: '#ffffff', color2: '#000000', league: 'IT' },
    { name: 'Catanzaro', att: 3, opp: 4, def: 2, color1: '#ffcc00', color2: '#e30613', league: 'IT' },
    { name: 'Reggiana', att: 2, opp: 3, def: 4, color1: '#8b0000', color2: '#ffffff', league: 'IT' },
    { name: 'Südtirol', att: 2, opp: 3, def: 4, color1: '#ffffff', color2: '#e30613', league: 'IT' },
    { name: 'Modena', att: 3, opp: 3, def: 3, color1: '#ffcc00', color2: '#0033a0', league: 'IT' },
    { name: 'Cosenza', att: 2, opp: 3, def: 3, color1: '#0033a0', color2: '#e30613', league: 'IT' },
    { name: 'Cittadella', att: 2, opp: 2, def: 4, color1: '#8b0000', color2: '#ffffff', league: 'IT' },
    { name: 'Mantova', att: 3, opp: 4, def: 2, color1: '#ffffff', color2: '#e30613', league: 'IT' },
    { name: 'Cesena', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#000000', league: 'IT' },
    { name: 'Juve Stabia', att: 2, opp: 3, def: 3, color1: '#ffcc00', color2: '#0033a0', league: 'IT' },
    { name: 'Carrarese', att: 2, opp: 2, def: 3, color1: '#ffcc00', color2: '#0033a0', league: 'IT' }
  ],
  EN: [
    { name: 'Leeds United', att: 5, opp: 5, def: 4, color1: '#ffffff', color2: '#1d428a', league: 'EN' },
    { name: 'Burnley', att: 4, opp: 5, def: 4, color1: '#6c1d45', color2: '#87ceeb', league: 'EN' },
    { name: 'Sheffield United', att: 4, opp: 4, def: 4, color1: '#ee2737', color2: '#ffffff', league: 'EN' },
    { name: 'Luton Town', att: 4, opp: 4, def: 3, color1: '#f78f1e', color2: '#000000', league: 'EN' },
    { name: 'West Bromwich', att: 3, opp: 4, def: 4, color1: '#002f68', color2: '#ffffff', league: 'EN' },
    { name: 'Norwich City', att: 4, opp: 4, def: 3, color1: '#fff200', color2: '#00a650', league: 'EN' },
    { name: 'Sunderland', att: 4, opp: 4, def: 3, color1: '#ff0000', color2: '#ffffff', league: 'EN' },
    { name: 'Middlesbrough', att: 4, opp: 4, def: 3, color1: '#e30613', color2: '#ffffff', league: 'EN' },
    { name: 'Coventry City', att: 3, opp: 4, def: 3, color1: '#87ceeb', color2: '#ffffff', league: 'EN' },
    { name: 'Hull City', att: 3, opp: 4, def: 3, color1: '#f5a12d', color2: '#000000', league: 'EN' },
    { name: 'Watford', att: 3, opp: 3, def: 3, color1: '#fbee21', color2: '#ed2127', league: 'EN' },
    { name: 'Bristol City', att: 3, opp: 3, def: 4, color1: '#e30613', color2: '#ffffff', league: 'EN' },
    { name: 'Swansea City', att: 3, opp: 4, def: 2, color1: '#ffffff', color2: '#000000', league: 'EN' },
    { name: 'Preston N.E.', att: 2, opp: 3, def: 4, color1: '#ffffff', color2: '#000040', league: 'EN' },
    { name: 'QPR', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#0033a0', league: 'EN' },
    { name: 'Stoke City', att: 2, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff', league: 'EN' },
    { name: 'Sheffield Wed', att: 2, opp: 3, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'EN' },
    { name: 'Blackburn', att: 3, opp: 3, def: 2, color1: '#0033a0', color2: '#ffffff', league: 'EN' },
    { name: 'Millwall', att: 2, opp: 2, def: 4, color1: '#000040', color2: '#ffffff', league: 'EN' },
    { name: 'Derby County', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#000000', league: 'EN' }
  ]
};

DE: [ 
    { name: 'Bayern Munich', att: 5, opp: 5, def: 4, color1: '#dc052d', color2: '#ffffff', league: 'DE' },
    { name: 'B. Dortmund', att: 4, opp: 5, def: 3, color1: '#fde100', color2: '#000000', league: 'DE' },
    { name: 'B. Leverkusen', att: 5, opp: 5, def: 4, color1: '#e32221', color2: '#000000', league: 'DE' },
    { name: 'RB Leipzig', att: 4, opp: 4, def: 4, color1: '#ffffff', color2: '#dd013f', league: 'DE' },
    { name: 'VfB Stuttgart', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#e32221', league: 'DE' },
    { name: 'E. Frankfurt', att: 4, opp: 4, def: 3, color1: '#000000', color2: '#e32221', league: 'DE' },
    { name: 'SC Freiburg', att: 3, opp: 4, def: 4, color1: '#000000', color2: '#ffffff', league: 'DE' },
    { name: 'M\'gladbach', att: 3, opp: 4, def: 3, color1: '#000000', color2: '#ffffff', league: 'DE' },
    { name: 'Wolfsburg', att: 3, opp: 3, def: 3, color1: '#009d00', color2: '#ffffff', league: 'DE' },
    { name: 'Werder Bremen', att: 3, opp: 3, def: 3, color1: '#1d9053', color2: '#ffffff', league: 'DE' },
    { name: 'Union Berlin', att: 2, opp: 3, def: 4, color1: '#d71920', color2: '#f6d800', league: 'DE' },
    { name: 'Hoffenheim', att: 3, opp: 4, def: 2, color1: '#004f9f', color2: '#ffffff', league: 'DE' },
    { name: 'Augsburg', att: 2, opp: 3, def: 3, color1: '#ba3733', color2: '#ffffff', league: 'DE' },
    { name: 'Mainz 05', att: 2, opp: 3, def: 3, color1: '#ed1c24', color2: '#ffffff', league: 'DE' },
    { name: 'VfL Bochum', att: 2, opp: 3, def: 2, color1: '#005ca9', color2: '#ffffff', league: 'DE' },
    { name: 'Heidenheim', att: 2, opp: 3, def: 3, color1: '#e2001a', color2: '#ffffff', league: 'DE' },
    { name: 'St. Pauli', att: 2, opp: 3, def: 2, color1: '#754b29', color2: '#ffffff', league: 'DE' },
    { name: 'Holstein Kiel', att: 2, opp: 3, def: 2, color1: '#0053a4', color2: '#ffffff', league: 'DE' }
  ],
  NL: [ 
    { name: 'PSV Eindhoven', att: 4, opp: 4, def: 4, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'Feyenoord', att: 4, opp: 4, def: 3, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'Ajax', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#ff0000', league: 'NL' },
    { name: 'AZ Alkmaar', att: 3, opp: 4, def: 3, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'FC Twente', att: 3, opp: 3, def: 4, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'Utrecht', att: 3, opp: 3, def: 3, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'Sparta Rotterdam', att: 2, opp: 3, def: 3, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'Go Ahead Eagles', att: 2, opp: 3, def: 2, color1: '#ff0000', color2: '#ffff00', league: 'NL' },
    { name: 'NEC Nijmegen', att: 2, opp: 3, def: 3, color1: '#ff0000', color2: '#000000', league: 'NL' },
    { name: 'Heerenveen', att: 2, opp: 3, def: 2, color1: '#0000ff', color2: '#ffffff', league: 'NL' },
    { name: 'Fortuna Sittard', att: 2, opp: 2, def: 3, color1: '#ffff00', color2: '#16a34a', league: 'NL' },
    { name: 'Heracles Almelo', att: 2, opp: 2, def: 2, color1: '#000000', color2: '#ffffff', league: 'NL' },
    { name: 'PEC Zwolle', att: 2, opp: 2, def: 2, color1: '#00bfff', color2: '#ffffff', league: 'NL' },
    { name: 'Almere City', att: 1, opp: 2, def: 3, color1: '#ff0000', color2: '#000000', league: 'NL' },
    { name: 'RKC Waalwijk', att: 1, opp: 2, def: 2, color1: '#ffff00', color2: '#1e3a8a', league: 'NL' },
    { name: 'Willem II', att: 2, opp: 2, def: 3, color1: '#ff0000', color2: '#ffffff', league: 'NL' },
    { name: 'Groningen', att: 2, opp: 2, def: 3, color1: '#16a34a', color2: '#ffffff', league: 'NL' },
    { name: 'NAC Breda', att: 2, opp: 2, def: 2, color1: '#ffff00', color2: '#000000', league: 'NL' }
  ],
  WC: [
    { name: 'Argentina', att: 5, opp: 5, def: 4, color1: '#75aadb', color2: '#ffffff', isFlag: true, region: 'SA' },
    { name: 'France', att: 5, opp: 5, def: 4, color1: '#002395', color2: '#ffffff', isFlag: true, region: 'EU' },
    { name: 'Brazil', att: 5, opp: 5, def: 4, color1: '#fedf00', color2: '#009b3a', isFlag: true, region: 'SA' },
    { name: 'England', att: 5, opp: 5, def: 4, color1: '#ffffff', color2: '#ce1124', isFlag: true, region: 'EU' },
    { name: 'Spain', att: 4, opp: 5, def: 4, color1: '#aa151b', color2: '#f1bf00', isFlag: true, region: 'EU' },
    { name: 'Germany', att: 4, opp: 5, def: 4, color1: '#000000', color2: '#ffce00', isFlag: true, region: 'EU' },
    { name: 'Portugal', att: 5, opp: 4, def: 4, color1: '#046a38', color2: '#da291c', isFlag: true, region: 'EU' },
    { name: 'Netherlands', att: 4, opp: 4, def: 4, color1: '#f36c21', color2: '#ffffff', isFlag: true, region: 'EU' },
    { name: 'Italy', att: 3, opp: 4, def: 4, color1: '#008c45', color2: '#ffffff', isFlag: true, region: 'EU' },
    { name: 'Uruguay', att: 4, opp: 4, def: 4, color1: '#0081c8', color2: '#ffffff', isFlag: true, region: 'SA' },
    { name: 'Croatia', att: 3, opp: 4, def: 4, color1: '#ff0000', color2: '#ffffff', isFlag: true, region: 'EU' },
    { name: 'Morocco', att: 3, opp: 3, def: 4, color1: '#c1272d', color2: '#006233', isFlag: true, region: 'AF' },
    { name: 'Japan', att: 3, opp: 5, def: 3, color1: '#ffffff', color2: '#bc002d', isFlag: true, region: 'AS' },
    { name: 'USA', att: 3, opp: 4, def: 3, color1: '#b22234', color2: '#3c3b6e', isFlag: true, region: 'NA' },
    { name: 'Mexico', att: 3, opp: 3, def: 3, color1: '#006847', color2: '#ce1126', isFlag: true, region: 'NA' },
    { name: 'Colombia', att: 4, opp: 3, def: 3, color1: '#fcd116', color2: '#003893', isFlag: true, region: 'SA' }
  ]
};

const PRESETS_2_EXTRA: Record<string, any[]> = {
  DE: [
    { name: 'FC Köln', att: 5, opp: 5, def: 3, color1: '#e30613', color2: '#ffffff', league: 'DE' },
    { name: 'Darmstadt 98', att: 4, opp: 4, def: 4, color1: '#0033a0', color2: '#ffffff', league: 'DE' },
    { name: 'Hamburger SV', att: 5, opp: 5, def: 3, color1: '#ffffff', color2: '#0033a0', league: 'DE' },
    { name: 'Hertha BSC', att: 4, opp: 4, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'DE' },
    { name: 'Schalke 04', att: 4, opp: 4, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'DE' },
    { name: 'Hannover 96', att: 4, opp: 4, def: 4, color1: '#e30613', color2: '#000000', league: 'DE' },
    { name: 'F. Düsseldorf', att: 4, opp: 4, def: 4, color1: '#e30613', color2: '#ffffff', league: 'DE' },
    { name: 'Karlsruher SC', att: 4, opp: 4, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'DE' },
    { name: 'FC Nürnberg', att: 3, opp: 3, def: 3, color1: '#8b0000', color2: '#ffffff', league: 'DE' },
    { name: 'SC Paderborn', att: 4, opp: 4, def: 3, color1: '#000000', color2: '#0033a0', league: 'DE' },
    { name: 'Greuther Fürth', att: 3, opp: 4, def: 3, color1: '#00a650', color2: '#ffffff', league: 'DE' },
    { name: 'SV Elversberg', att: 3, opp: 4, def: 2, color1: '#ffffff', color2: '#000000', league: 'DE' },
    { name: 'FC Magdeburg', att: 4, opp: 4, def: 2, color1: '#0033a0', color2: '#ffffff', league: 'DE' },
    { name: 'E. Braunschweig', att: 2, opp: 3, def: 3, color1: '#ffcc00', color2: '#0033a0', league: 'DE' },
    { name: 'Kaiserslautern', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff', league: 'DE' },
    { name: 'SSV Ulm', att: 2, opp: 2, def: 4, color1: '#000000', color2: '#ffffff', league: 'DE' },
    { name: 'Preußen Münster', att: 2, opp: 3, def: 3, color1: '#00a650', color2: '#000000', league: 'DE' },
    { name: 'Jahn Regensburg', att: 2, opp: 2, def: 3, color1: '#ffffff', color2: '#e30613', league: 'DE' }
  ],
  NL: [
    { name: 'Excelsior', att: 5, opp: 5, def: 3, color1: '#000000', color2: '#e30613', league: 'NL' },
    { name: 'Vitesse', att: 4, opp: 4, def: 4, color1: '#ffcc00', color2: '#000000', league: 'NL' },
    { name: 'FC Volendam', att: 4, opp: 4, def: 3, color1: '#f5a12d', color2: '#000000', league: 'NL' },
    { name: 'De Graafschap', att: 4, opp: 4, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'NL' },
    { name: 'ADO Den Haag', att: 4, opp: 4, def: 3, color1: '#00a650', color2: '#ffcc00', league: 'NL' },
    { name: 'SC Cambuur', att: 4, opp: 5, def: 2, color1: '#ffcc00', color2: '#0033a0', league: 'NL' },
    { name: 'FC Emmen', att: 3, opp: 3, def: 4, color1: '#e30613', color2: '#ffffff', league: 'NL' },
    { name: 'Roda JC', att: 3, opp: 4, def: 3, color1: '#ffcc00', color2: '#000000', league: 'NL' },
    { name: 'MVV Maastricht', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff', league: 'NL' },
    { name: 'VVV-Venlo', att: 3, opp: 3, def: 3, color1: '#ffcc00', color2: '#000000', league: 'NL' },
    { name: 'FC Dordrecht', att: 4, opp: 4, def: 2, color1: '#00a650', color2: '#ffffff', league: 'NL' },
    { name: 'Helmond Sport', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#000000', league: 'NL' },
    { name: 'FC Eindhoven', att: 2, opp: 3, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'NL' },
    { name: 'SC Telstar', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#0033a0', league: 'NL' },
    { name: 'TOP Oss', att: 2, opp: 2, def: 3, color1: '#e30613', color2: '#ffffff', league: 'NL' },
    { name: 'FC Den Bosch', att: 3, opp: 3, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'NL' },
    { name: 'Jong Ajax', att: 3, opp: 4, def: 2, color1: '#ffffff', color2: '#e30613', league: 'NL' },
    { name: 'Jong PSV', att: 3, opp: 4, def: 2, color1: '#ff0000', color2: '#ffffff', league: 'NL' }
  ]
};

// Combinar presets de segunda
Object.assign(PRESETS_2, PRESETS_2_EXTRA);

// ==========================================
// 4. HELPERS Y LÓGICA DE GENERACIÓN
// ==========================================

const generateLeagueSchedule = (teams: Team[], twoLegged = true) => {
  if (!teams || teams.length < 2) return [];
  const n = teams.length;
  const teamIds = teams.map(t => t.id);
  const rounds: any[] = [];
  const totalRounds = twoLegged ? (n - 1) * 2 : (n - 1);

  for (let j = 0; j < totalRounds; j++) {
    const round: any[] = [];
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

const getDefaultComps = (): Record<string, Competition> => {
  const baseTeam = (preset: string, isDiv2 = false) => {
    const list = isDiv2 ? PRESETS_2[preset] : PRESETS[preset];
    if (!list) return [];
    const offset = isDiv2 ? 100 : 0;
    return list.map((t, i) => ({ 
      ...t, 
      id: i + 1 + offset, 
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 
    }));
  };

  const getLeagueData = (name: string, code: string): LeagueComp => ({
    type: 'league', name, 
    teams: baseTeam(code), matchday: 0, history: [], showWinner: false, 
    teams2: baseTeam(code, true), matchday2: 0, history2: [], showWinner2: false,
    userTeamId: 1
  });

  return {
    'L1': getLeagueData('Liga Española', 'ES'),
    'L2': getLeagueData('Liga Italiana', 'IT'),
    'L3': getLeagueData('Liga Inglesa', 'EN'),
    'L4': getLeagueData('Liga Alemana', 'DE'),
    'L5': getLeagueData('Liga Holandesa', 'NL'),
    'C1': { type: 'cup', name: 'Champions League', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null },
    'C2': { type: 'cup', name: 'Copa del Mundo', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null }
  };
};

// ==========================================
// 5. COMPONENTES DE UI
// ==========================================

const Shield = ({ color1, color2, initial, size = 'md', isFlag = false }: any) => {
  const dims = size === 'lg' ? 'w-20 h-24' : size === 'sm' ? 'w-8 h-10' : size === 'xs' ? 'w-5 h-6' : 'w-12 h-14';
  const fontSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-[10px]' : size === 'xs' ? 'text-[8px]' : 'text-sm';
  const safeInitial = initial ? initial[0] : '?';

  if (isFlag) {
    return (
      <div className={`${dims} relative overflow-hidden shadow-md rounded-sm border border-white/10 shrink-0 bg-slate-800 flex items-center justify-center`}>
        <span className={`${fontSize} font-black text-white italic`}>{safeInitial}</span>
      </div>
    );
  }

  return (
    <div className={`${dims} relative overflow-hidden shadow-md shrink-0`} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 80%, 50% 100%, 0% 80%)' }}>
      <div className='absolute inset-0 flex'>
        <div className='w-1/2 h-full' style={{ backgroundColor: color1 || '#333' }}></div>
        <div className='w-1/2 h-full' style={{ backgroundColor: color2 || '#666' }}></div>
      </div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className={`${fontSize} font-black text-white mix-blend-difference italic drop-shadow-md`}>{safeInitial}</span>
      </div>
    </div>
  );
};

const DieIcon = ({ value, className }: { value: number; className?: string }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1] || Dices;
  return <Icon className={className} strokeWidth={1.5} />;
};

const Confetti = () => (
  <div className='fixed inset-0 pointer-events-none z-[55] overflow-hidden'>
    {[...Array(40)].map((_, i) => (
      <div 
        key={i} className='absolute animate-bounce'
        style={{
          left: (Math.random() * 100) + '%', top: '-10%', width: '8px', height: '8px',
          backgroundColor: ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ffffff'][Math.floor(Math.random() * 5)],
          animation: `confetti-fall ${2 + Math.random() * 2}s linear infinite`, animationDelay: `${Math.random() * 2}s`
        }}
      />
    ))}
    <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(720deg); } }`}</style>
  </div>
);

const AttrStepper = ({ label, val, min, max, onUpdate }: any) => (
  <div className='flex flex-col items-center bg-black/40 rounded-xl p-1.5 border border-white/10'>
    <span className='text-[7px] font-black uppercase text-slate-300 mb-1'>{label}</span>
    <div className='flex items-center gap-2 w-full justify-center'>
      <button onClick={() => onUpdate(Math.max(min, val - 1))} className='w-5 h-5 bg-slate-800/80 hover:bg-slate-700 rounded text-white text-xs font-bold flex items-center justify-center'>-</button>
      <span className='text-[10px] font-black w-2 text-center text-white'>{val}</span>
      <button onClick={() => onUpdate(Math.min(max, val + 1))} className='w-5 h-5 bg-slate-800/80 hover:bg-slate-700 rounded text-white text-xs font-bold flex items-center justify-center'>+</button>
    </div>
  </div>
);

const MenuButton = ({ icon, label, onClick, disabled = false, isDanger = false, isWide = false }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`
      flex flex-col items-center justify-center p-3 rounded-2xl border transition-all 
      ${isWide ? 'col-span-2 flex-row gap-2' : 'col-span-1'}
      ${disabled ? 'opacity-30 cursor-not-allowed bg-slate-900/20 border-white/5' : 
        isDanger ? 'bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40 active:scale-95' : 
        'bg-slate-800/40 border-white/10 text-white hover:bg-slate-700/60 active:scale-95 backdrop-blur-md'}
    `}
  >
    <div className={isWide ? 'mb-0' : 'mb-1'}>{icon}</div>
    <span className='text-[8px] font-black uppercase italic tracking-wider'>{label}</span>
  </button>
);

const PenaltyDots = ({ history }: { history: boolean[] }) => (
  <div className="flex justify-center gap-[3px] mb-2 min-h-[14px]">
    {history.map((h, i) => (
      <div key={i} className={`w-3 h-3 rounded-full flex items-center justify-center ${h ? 'bg-green-500' : 'bg-red-500'}`}>
        <span className="text-[6px] text-white font-black">{h ? '✓' : '✗'}</span>
      </div>
    ))}
  </div>
);

// ==========================================
// 6. APLICACIÓN PRINCIPAL
// ==========================================

export default function App() {
  const [view, setView] = useState('hub');
  const [activeCompId, setActiveCompId] = useState<string | null>(null);
  const [compView, setCompView] = useState('main');
  const [viewDiv, setViewDiv] = useState(1); 
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [matchState, setMatchState] = useState<any>(null);
  const [rolling, setRolling] = useState(false);
  const rollIntervalRef = useRef<any>(null);

  // Persistencia de Competiciones
  const [comps, setComps] = useState<Record<string, Competition>>(() => {
    const defaults = getDefaultComps();
    try {
      const saved = localStorage.getItem(`${APP_ID}_comps`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      }
    } catch (e) {}
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem(`${APP_ID}_comps`, JSON.stringify(comps));
  }, [comps]);

  // Historial / Archivo
  const [archive, setArchive] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(`${APP_ID}_archive`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`${APP_ID}_archive`, JSON.stringify(archive));
  }, [archive]);

  const activeComp = activeCompId ? comps[activeCompId] : null;

  const updateActiveComp = (newData: Partial<Competition>) => {
    if (!activeCompId) return;
    setComps(prev => ({
      ...prev,
      [activeCompId]: { ...prev[activeCompId], ...newData } as Competition
    }));
  };

  // Lógica de Sorteo CL/WC
  const handleDraw = (compId: string, type: 'auto' | 'shuffle') => {
    const isWC = compId === 'C2';
    const pool = isWC ? [...PRESETS.WC] : [...PRESETS.ES.slice(0, 4), ...PRESETS.IT.slice(0, 4), ...PRESETS.EN.slice(0, 4)];
    const teams = pool.map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));

    if (type === 'shuffle') teams.sort(() => Math.random() - 0.5);

    const groups = Array.from({ length: 8 }, (_, i) => ({
      name: `Grupo ${String.fromCharCode(65 + i)}`,
      teamIds: teams.slice(i * 4, (i + 1) * 4).map(t => t.id)
    }));

    setComps(prev => ({
      ...prev,
      [compId]: { ...prev[compId], teams, groups, phase: 'groups', matchday: 0, history: [] } as CupComp
    }));
  };

  // Reset Total de una Liga
  const handleTotalReset = (compId: string) => {
    const defaults = getDefaultComps();
    setComps(prev => ({ ...prev, [compId]: defaults[compId] }));
    setCompView('main');
  };

  // ==========================================
  // 7. LÓGICA DE PARTIDO Y SIMULACIÓN
  // ==========================================

  const startMatch = (homeId: number, awayId: number, isDiv2Context: boolean) => {
    if (!activeComp) return;
    const sourceTeams = isDiv2Context ? (activeComp as LeagueComp).teams2 : activeComp.teams;
    const home = sourceTeams.find(t => t.id === homeId);
    const away = sourceTeams.find(t => t.id === awayId);
    if (!home || !away) return;

    setMatchState({
      home, away, scoreH: 0, scoreA: 0, oppH: home.opp, oppA: away.opp, turn: 'H', phase: 'att', isDiv2Context,
      logs: ['⚽ ¡Comienza el encuentro!', 'Al terreno de juego.'],
      lastDie: 1, finished: false, penalties: null
    });
    setCompView('playing');
  };

  const handleRoll = () => {
    if (rolling || matchState.finished) return;
    setRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setMatchState((prev: any) => ({ ...prev, lastDie: Math.floor(Math.random() * 6) + 1 }));
      count++;
      if (count > 8) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 60);
    rollIntervalRef.current = interval;
  };

  const finalizeRoll = () => {
    const die = Math.floor(Math.random() * 6) + 1;
    setRolling(false);

    setMatchState((prev: any) => {
      if (!prev) return prev;
      const isHome = prev.turn === 'H';
      const attacker = isHome ? prev.home : prev.away;
      const defender = isHome ? prev.away : prev.home;
      let newLogs = [...prev.logs];
      let { scoreH, scoreA, phase: newPhase } = prev;

      if (newPhase === 'att') {
        if (die <= attacker.att) {
          newLogs.unshift(`🎯 ${attacker.name} saca ${die}. ¡A portería!`);
          return { ...prev, lastDie: die, logs: newLogs, phase: 'gk' };
        } else {
          newLogs.unshift(`❌ ${attacker.name} falla (Dado: ${die}).`);
          return advanceTurn({ ...prev, lastDie: die, logs: newLogs, phase: 'att' });
        }
      } else {
        if (die > defender.def) {
          newLogs.unshift(`⚽ ¡GOL de ${attacker.name}! (Dado: ${die})`);
          isHome ? scoreH++ : scoreA++;
        } else {
          newLogs.unshift(`🧤 ¡PARADÓN! Evitó el gol (Dado: ${die}).`);
        }
        return advanceTurn({ ...prev, lastDie: die, logs: newLogs, scoreH, scoreA, phase: 'att' });
      }
    });
  };

  const advanceTurn = (state: any) => {
    let nextOppH = state.turn === 'H' ? state.oppH - 1 : state.oppH;
    let nextOppA = state.turn === 'A' ? state.oppA - 1 : state.oppA;
    let nextTurn = state.turn === 'H' ? 'A' : 'H';

    if (nextTurn === 'H' && nextOppH <= 0) nextTurn = 'A';
    if (nextTurn === 'A' && nextOppA <= 0) nextTurn = 'H';

    if (nextOppH <= 0 && nextOppA <= 0) {
      return { ...state, oppH: 0, oppA: 0, finished: true, logs: ['🏁 Final del partido.', ...state.logs] };
    }
    return { ...state, oppH: nextOppH, oppA: nextOppA, turn: nextTurn, phase: 'att' };
  };

  // ==========================================
  // 8. PROCESAMIENTO DE JORNADA Y ASCENSOS
  // ==========================================

  const processMatchday = () => {
    if (!activeComp || !matchState) return;

    if (activeComp.type === 'league') {
      const isDiv2 = matchState.isDiv2Context;
      const teams = isDiv2 ? activeComp.teams2 : activeComp.teams;
      const matchday = isDiv2 ? activeComp.matchday2 : activeComp.matchday;
      const history = isDiv2 ? activeComp.history2 : activeComp.history;

      const schedule = generateLeagueSchedule(teams);
      const currentRound = schedule[matchday] || [];

      // Simular resto de partidos de la jornada
      const results = currentRound.map((m: any) => {
        if (m.homeId === matchState.home.id || m.awayId === matchState.home.id || 
            m.homeId === matchState.away.id || m.awayId === matchState.away.id) {
          const isHome = m.homeId === matchState.home.id || m.homeId === matchState.away.id;
          const hScore = m.homeId === matchState.home.id ? matchState.scoreH : matchState.scoreA;
          const aScore = m.awayId === matchState.away.id ? matchState.scoreA : matchState.scoreH;
          return { hId: m.homeId, aId: m.awayId, sh: hScore, sa: aScore };
        }

        const h = teams.find(t => t.id === m.homeId)!;
        const a = teams.find(t => t.id === m.awayId)!;
        let sh = 0, sa = 0;
        for(let i=0; i<h.opp; i++) if(Math.floor(Math.random()*6)+1 <= h.att && Math.floor(Math.random()*6)+1 > a.def) sh++;
        for(let i=0; i<a.opp; i++) if(Math.floor(Math.random()*6)+1 <= a.att && Math.floor(Math.random()*6)+1 > h.def) sa++;
        return { hId: m.homeId, aId: m.awayId, sh, sa };
      });

      // Actualizar tabla
      const updatedTeams = teams.map(t => {
        const res = results.find(r => r.hId === t.id || r.aId === t.id);
        if (!res) return t;
        const isHome = res.hId === t.id;
        const gf = isHome ? res.sh : res.sa;
        const ga = isHome ? res.sa : res.sh;
        const w = gf > ga ? 1 : 0;
        const d = gf === ga ? 1 : 0;
        const l = gf < ga ? 1 : 0;
        return { ...t, p: t.p + 1, w: t.w + w, d: t.d + d, l: t.l + l, gf: t.gf + gf, ga: t.ga + ga, pts: t.pts + (w * 3 + d) };
      });

      const isFinished = matchday === schedule.length - 1;
      const nextMatchday = isFinished ? matchday : matchday + 1;
      const newHistory = [{ day: matchday + 1, results }, ...history];

      const update: any = isDiv2 
        ? { teams2: updatedTeams, history2: newHistory, matchday2: nextMatchday, showWinner2: isFinished }
        : { teams: updatedTeams, history: newHistory, matchday: nextMatchday, showWinner: isFinished };

      updateActiveComp(update);
    }
    setCompView('main');
    setMatchState(null);
  };

  const handlePromotionAndNewSeason = () => {
    if (!activeComp || activeComp.type !== 'league') return;
    const comp = activeComp as LeagueComp;

    const s1 = [...comp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const s2 = [...comp.teams2].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    const relegated = s1.slice(-3);
    const promoted = s2.slice(0, 3);

    // Boost descendidos
    const boostedRelegated = relegated.map((t, i) => ({
      ...t,
      att: i === 0 ? 5 : i === 1 ? 4 : 3,
      opp: i === 0 ? 5 : i === 1 ? 4 : 4,
      def: i === 0 ? 3 : i === 1 ? 4 : 3,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
    }));

    // Restaurar originales ascendidos (usando presets)
    const restoredPromoted = promoted.map((t, i) => {
      const original = PRESETS[comp.name.split(' ')[1]]?.find(p => p.name === t.name) || 
                       PRESETS_2[comp.name.split(' ')[1]]?.find(p => p.name === t.name);
      return {
        ...t,
        att: original?.att || t.att,
        opp: original?.opp || t.opp,
        def: original?.def || t.def,
        p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0
      };
    });

    const next1 = [...s1.slice(0, -3).map(t => ({...t, p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0})), ...restoredPromoted];
    const next2 = [...s2.slice(3).map(t => ({...t, p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0})), ...boostedRelegated];

    updateActiveComp({
      teams: next1, teams2: next2,
      matchday: 0, matchday2: 0,
      history: [], history2: [],
      showWinner: false, showWinner2: false
    });
    setShowPromoModal(false);
  };

 // ==========================================
  // 9. VISTAS DE COMPETICIÓN
  // ==========================================

  const CompetitionView = () => {
    if (!activeComp) return null;
    const isLeague = activeComp.type === 'league';
    const isDiv2 = viewDiv === 2 && isLeague;

    const currentTeams = isDiv2 ? (activeComp as LeagueComp).teams2 : activeComp.teams;
    const currentMatchday = isDiv2 ? (activeComp as LeagueComp).matchday2 : activeComp.matchday;
    const currentHistory = isDiv2 ? (activeComp as LeagueComp).history2 : activeComp.history;
    const currentShowWinner = isDiv2 ? (activeComp as LeagueComp).showWinner2 : activeComp.showWinner;

    const sortedTeams = [...currentTeams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const userTeam = currentTeams.find(t => t.id === activeComp.userTeamId) || currentTeams[0];

    const getNextMatch = () => {
      if (isLeague) {
        const schedule = generateLeagueSchedule(currentTeams);
        const round = schedule[currentMatchday];
        return round?.find((m: any) => m.homeId === userTeam.id || m.awayId === userTeam.id) || round?.[0];
      }
      return null; // Simplificado para ligas en esta parte
    };

    const nextMatch = getNextMatch();
    const homeTeam = currentTeams.find(t => t.id === nextMatch?.homeId);
    const awayTeam = currentTeams.find(t => t.id === nextMatch?.awayId);

    const isSeasonFinished = isLeague && 
      (activeComp as LeagueComp).matchday >= generateLeagueSchedule((activeComp as LeagueComp).teams).length - 1 &&
      (activeComp as LeagueComp).matchday2 >= generateLeagueSchedule((activeComp as LeagueComp).teams2).length - 1;

    if (compView === 'playing') return <PlayingView />;
    if (compView === 'config') return <ConfigPanel />;
    if (compView === 'stats') return <StatsView sortedTeams={sortedTeams} isDiv2={isDiv2} />;
    if (compView === 'results') return <ResultsView history={currentHistory} teams={currentTeams} isDiv2={isDiv2} />;
    if (compView === 'calendar') return <CalendarView teams={currentTeams} matchday={currentMatchday} history={currentHistory} isDiv2={isDiv2} />;

    return (
      <div className='flex-grow px-4 pb-20'>
        <header className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <button onClick={() => setView('hub')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl text-slate-200 border border-white/10'><ChevronLeft /></button>
            <h2 className='text-xl font-black italic uppercase'>{activeComp.name}</h2>
          </div>
          <button onClick={() => setCompView('config')} className='p-2 bg-slate-900/30 rounded-xl border border-white/10'><Settings size={20}/></button>
        </header>

        {isLeague && (
          <div className='flex mb-6 bg-slate-900/40 p-1 rounded-2xl border border-white/10'>
            <button onClick={() => setViewDiv(1)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all ${viewDiv === 1 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>1ª División</button>
            <button onClick={() => setViewDiv(2)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all ${viewDiv === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>2ª División</button>
          </div>
        )}

        <div className='grid grid-cols-4 gap-2 mb-6'>
          <MenuButton icon={<BarChart3 size={18} className='text-emerald-400'/>} label="Tabla" onClick={() => setCompView('stats')} />
          <MenuButton icon={<Calendar size={18} className='text-blue-400'/>} label="Fechas" onClick={() => setCompView('calendar')} />
          <MenuButton icon={<History size={18} className='text-yellow-400'/>} label="Result." onClick={() => setCompView('results')} />
          <MenuButton icon={<Users size={18} className='text-indigo-400'/>} label="Equipo" onClick={() => {/* Seleccionar equipo */}} />
        </div>

        {isSeasonFinished && !currentShowWinner && (
          <button onClick={() => setShowPromoModal(true)} className='w-full mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 py-4 rounded-2xl shadow-lg animate-pulse text-white font-black uppercase italic flex items-center justify-center gap-2'>
            <ArrowUpCircle size={20} /> Gestionar Ascensos <ArrowDownCircle size={20}/>
          </button>
        )}

        <section className='bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 mb-6'>
          <h3 className='text-[10px] font-black uppercase text-slate-400 mb-3'>Clasificación {isDiv2 ? '2ª' : '1ª'} Div</h3>
          <div className='space-y-1.5'>
            {sortedTeams.slice(0, 5).map((t, i) => (
              <div key={t.id} className={`flex items-center gap-3 p-2 rounded-xl bg-black/30 ${isDiv2 && i < 3 ? 'border-l-2 border-emerald-500' : ''}`}>
                <span className='text-[10px] font-black text-slate-500 w-4'>{i+1}</span>
                <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' />
                <span className='text-[11px] font-bold uppercase truncate flex-grow'>{t.name}</span>
                <span className='text-[10px] font-black text-emerald-400'>{t.pts} PTS</span>
              </div>
            ))}
          </div>
        </section>

        {nextMatch && !currentShowWinner && (
          <section className='bg-gradient-to-br from-blue-700/80 to-indigo-900/80 rounded-[2.5rem] p-6 shadow-2xl border border-white/20'>
            <div className='flex justify-between items-center mb-6'>
              <div className='text-center w-20'>
                <Shield color1={homeTeam?.color1} color2={homeTeam?.color2} initial={homeTeam?.name} size='lg' />
                <p className='mt-2 text-[9px] font-black uppercase truncate text-white'>{homeTeam?.name}</p>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-xs font-black text-white/50 italic mb-1'>VS</span>
                <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'><Play size={20} className='ml-1 text-white' /></div>
              </div>
              <div className='text-center w-20'>
                <Shield color1={awayTeam?.color1} color2={awayTeam?.color2} initial={awayTeam?.name} size='lg' />
                <p className='mt-2 text-[9px] font-black uppercase truncate text-white'>{awayTeam?.name}</p>
              </div>
            </div>
            <button onClick={() => startMatch(homeTeam!.id, awayTeam!.id, isDiv2)} className='w-full bg-white text-blue-900 py-4 rounded-2xl text-xs font-black uppercase italic tracking-widest active:scale-95 transition-all'>
              Jugar Jornada {currentMatchday + 1}
            </button>
          </section>
        )}
      </div>
    );
  };

  const CalendarView = ({ teams, matchday, history, isDiv2 }: any) => {
    const schedule = generateLeagueSchedule(teams);
    return (
      <div className='flex-grow px-4 pb-20'>
        <header className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 rounded-xl border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase'>Calendario {isDiv2 ? '2ª' : '1ª'} Div</h2>
        </header>
        <div className='space-y-4'>
          {schedule.map((round: any, ri: number) => (
            <div key={ri} className={`bg-slate-900/30 rounded-3xl p-4 border border-white/10 ${ri === matchday ? 'ring-2 ring-blue-500' : 'opacity-60'}`}>
              <div className='flex justify-between items-center mb-3'>
                <h3 className='text-[9px] font-black uppercase text-slate-300'>Jornada {ri + 1} {ri === matchday && '(Actual)'}</h3>
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${ri < matchday ? 'bg-emerald-500/20 text-emerald-400' : ri === matchday ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  {ri < matchday ? 'Finalizado' : ri === matchday ? 'En Curso' : 'Próximo'}
                </span>
              </div>
              <div className='space-y-2'>
                {round.map((m: any, mi: number) => {
                  const home = teams.find((t: any) => t.id === m.homeId);
                  const away = teams.find((t: any) => t.id === m.awayId);
                  const result = history.find((h: any) => h.day === (ri + 1))?.results.find((r: any) => (r.hId === m.homeId && r.aId === m.awayId) || (r.hId === m.awayId && r.aId === m.homeId));
                  return (
                    <div key={mi} className='flex items-center justify-between bg-black/30 p-2 rounded-xl'>
                      <div className='flex items-center gap-2 w-24'><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' /><span className='text-[9px] font-bold uppercase truncate'>{home?.name}</span></div>
                      <div className='flex flex-col items-center'>
                        {result ? <span className='text-[10px] font-black tabular-nums bg-slate-800 px-2 py-0.5 rounded'>{result.sh} - {result.sa}</span> : <span className='text-[8px] font-black text-slate-500 italic'>VS</span>}
                      </div>
                      <div className='flex items-center gap-2 w-24 justify-end'><span className='text-[9px] font-bold uppercase truncate'>{away?.name}</span><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ConfigPanel = () => {
    const [editDiv, setEditDiv] = useState(1);
    const comp = activeComp as LeagueComp;
    const teams = editDiv === 1 ? comp.teams : comp.teams2;

    const updateTeam = (id: number, field: string, val: any) => {
      const key = editDiv === 1 ? 'teams' : 'teams2';
      const updated = teams.map(t => t.id === id ? { ...t, [field]: val } : t);
      updateActiveComp({ [key]: updated });
    };

    return (
      <div className='flex-grow px-4 pb-24'>
        <header className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 rounded-xl border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase'>Ajustes</h2>
        </header>

        <div className='bg-red-900/20 rounded-3xl p-4 border border-red-500/30 mb-6'>
          <h3 className='text-xs font-black text-red-400 uppercase italic mb-3 flex items-center gap-2'><AlertTriangle size={14}/> Zona de Peligro</h3>
          <button onClick={() => { if(window.confirm('¿Restaurar valores originales? Se perderá el progreso.')) handleTotalReset(activeCompId!); }} className='w-full py-3 bg-red-900/40 text-red-200 font-bold uppercase tracking-wider text-[10px] rounded-xl border border-red-500/30'>Restaurar Liga</button>
        </div>

        <div className='flex mb-4 bg-slate-900/50 p-1 rounded-2xl border border-white/10'>
          <button onClick={() => setEditDiv(1)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all ${editDiv === 1 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>1ª División</button>
          <button onClick={() => setEditDiv(2)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all ${editDiv === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>2ª División</button>
        </div>

        <div className='space-y-4'>
          {teams.map(t => (
            <div key={t.id} className='bg-slate-900/30 p-5 rounded-[2rem] border border-white/10 space-y-4'>
              <div className='flex items-center gap-4'>
                <Shield color1={t.color1} color2={t.color2} initial={t.name} size='lg' />
                <div className='flex-grow'>
                  <input className='bg-black/30 w-full rounded-xl p-2 text-sm font-black italic uppercase border border-white/10 outline-none' value={t.name} onChange={(e) => updateTeam(t.id, 'name', e.target.value)} />
                  <div className='grid grid-cols-3 gap-2 mt-3'>
                    <AttrStepper label="Atk" val={t.att} min={1} max={5} onUpdate={(v: any) => updateTeam(t.id, 'att', v)} />
                    <AttrStepper label="Tiros" val={t.opp} min={1} max={5} onUpdate={(v: any) => updateTeam(t.id, 'opp', v)} />
                    <AttrStepper label="Def" val={t.def} min={1} max={4} onUpdate={(v: any) => updateTeam(t.id, 'def', v)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const HubView = () => {
    const [showLeagues, setShowLeagues] = useState(false);
    const leagueIds = ['L1', 'L2', 'L3', 'L4', 'L5'];

    return (
      <div className='flex-grow flex flex-col px-4 pb-8'>
        <header className='py-12 text-center'>
          <h1 className='text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-green-400'>Football Hub</h1>
          <p className='text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2'>Elite Dice Engine v2.0</p>
        </header>

        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <button onClick={() => setView('archive')} className='p-6 bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/40 transition-all'>
              <div className='w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400'><History size={24} /></div>
              <h3 className='text-[11px] font-black uppercase italic text-white'>Historial</h3>
            </button>
            <button onClick={() => {/* Reglas */}} className='p-6 bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/40 transition-all'>
              <div className='w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400'><Info size={24} /></div>
              <h3 className='text-[11px] font-black uppercase italic text-white'>Reglas</h3>
            </button>
          </div>

          <section>
            <h3 className='text-xs font-black uppercase text-slate-500 mb-4 flex items-center gap-2'><Trophy size={14} className="text-yellow-500" /> Torneos</h3>
            <div className='grid grid-cols-2 gap-4'>
              {['C1', 'C2'].map(id => (
                <button key={id} onClick={() => { setActiveCompId(id); setCompView('main'); setView('competition'); }} className='p-6 bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-4 hover:bg-slate-800/40 transition-all'>
                  <div className={`w-12 h-12 rounded-full bg-slate-950/40 flex items-center justify-center text-white border border-white/5`}>
                    {id === 'C1' ? <Trophy size={24} className="text-blue-400" /> : <Globe size={24} className="text-emerald-400" />}
                  </div>
                  <h4 className='text-[10px] font-black uppercase italic text-white text-center'>{comps[id]?.name}</h4>
                </button>
              ))}
            </div>
          </section>

          <section>
            <button onClick={() => setShowLeagues(!showLeagues)} className='w-full p-6 bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex items-center justify-between hover:bg-slate-800/50 transition-all'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400'><ShieldIcon size={24} /></div>
                <div className='text-left'>
                  <h3 className='text-sm font-black uppercase italic text-white'>Ligas Nacionales</h3>
                  <p className='text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5'>1ª y 2ª Div con Ascensos</p>
                </div>
              </div>
              <ArrowRight size={20} className={showLeagues ? 'rotate-90 transition-transform' : 'transition-transform'} />
            </button>

            <AnimatePresence>
              {showLeagues && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='grid grid-cols-1 gap-2 pt-4'>
                  {leagueIds.map(id => (
                    <button key={id} onClick={() => { setActiveCompId(id); setCompView('main'); setView('competition'); }} className='p-4 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/50 transition-all'>
                      <div className='flex items-center gap-4'>
                        <div className='w-8 h-8 rounded-lg bg-slate-950/40 flex items-center justify-center text-slate-400'><BarChart3 size={16} /></div>
                        <h4 className='text-xs font-black uppercase italic text-slate-200'>{comps[id]?.name}</h4>
                      </div>
                      <ArrowRight size={14} className='text-slate-500' />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className='relative min-h-screen font-sans text-slate-100 overflow-hidden bg-slate-950'>
      <div className='fixed inset-0 bg-[url("https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop")] bg-cover bg-center opacity-20 z-0'></div>
      <div className='relative z-10 max-w-md mx-auto min-h-screen flex flex-col'>
        <AnimatePresence mode='wait'>
          {view === 'hub' && <motion.div key='hub' className='flex-grow flex flex-col' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HubView /></motion.div>}
          {view === 'competition' && <motion.div key='comp' className='flex-grow flex flex-col' initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}><CompetitionView /></motion.div>}
        </AnimatePresence>

        {showPromoModal && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md'>
            <div className='bg-slate-900 rounded-[2.5rem] p-8 border border-white/20 w-full max-w-sm text-center'>
              <Trophy size={48} className='text-emerald-400 mx-auto mb-4' />
              <h2 className='text-2xl font-black uppercase italic mb-2'>Temporada Finalizada</h2>
              <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8'>Se han definido los ascensos y descensos.</p>
              <button onClick={handlePromotionAndNewSeason} className='w-full bg-blue-600 py-4 rounded-2xl font-black uppercase italic text-white active:scale-95 transition-all'>Empezar Nueva Temporada</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

 // ==========================================
  // 10. SUB-VISTAS DE PARTIDO Y ESTADÍSTICAS
  // ==========================================

  const PlayingView = () => {
    if (!matchState) return null;
    return (
      <div className='flex-grow flex flex-col px-4'>
        <div className='flex justify-between items-center mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 rounded-xl border border-white/10'><ChevronLeft /></button>
          <div className='px-4 py-1 bg-red-600 rounded-full text-[9px] font-black uppercase italic animate-pulse'>En Vivo</div>
          <div className='w-10'></div>
        </div>

        <div className='bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-6 mb-4 border-b-4 border-slate-800 relative'>
          <div className='flex items-center'>
            <div className='flex-1 flex flex-col items-center text-center'>
              <Shield color1={matchState.home.color1} color2={matchState.home.color2} initial={matchState.home.name} size='lg' />
              <p className='text-[10px] font-black uppercase italic mt-2 truncate w-full'>{matchState.home.name}</p>
            </div>

            <div className='px-4 flex flex-col items-center shrink-0 w-32'>
              <div className='text-5xl font-black italic tracking-tighter flex gap-3 tabular-nums'>
                <span>{matchState.scoreH}</span>
                <span className='text-slate-500'>-</span>
                <span>{matchState.scoreA}</span>
              </div>
              {!matchState.finished && (
                <div className='text-[8px] font-black text-white/50 uppercase italic mt-1'>
                  {matchState.oppH} vs {matchState.oppA} Tiros
                </div>
              )}
            </div>

            <div className='flex-1 flex flex-col items-center text-center'>
              <Shield color1={matchState.away.color1} color2={matchState.away.color2} initial={matchState.away.name} size='lg' />
              <p className='text-[10px] font-black uppercase italic mt-2 truncate w-full'>{matchState.away.name}</p>
            </div>
          </div>
        </div>

        <div className='flex-grow bg-emerald-800/40 rounded-[3rem] border-8 border-slate-900/40 relative overflow-hidden flex flex-col items-center justify-center shadow-inner'>
          <div className='absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2'></div>
          <div className='absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2'></div>

          {!matchState.finished ? (
            <div className='z-10 flex flex-col items-center gap-6'>
              <div className={rolling ? 'animate-bounce' : ''}>
                <DieIcon value={matchState.lastDie} className='w-20 h-20 text-white drop-shadow-lg' />
              </div>
              <button 
                onClick={handleRoll} 
                disabled={rolling}
                className='bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-xl active:scale-90 transition-transform'
              >
                {rolling ? 'Lanzando...' : 'Lanzar Dado'}
              </button>
            </div>
          ) : (
            <div className='z-10 text-center p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20'>
              <Trophy size={40} className='text-yellow-400 mx-auto mb-3' />
              <h3 className='text-lg font-black uppercase italic mb-4'>¡Final del Juego!</h3>
              <button onClick={processMatchday} className='w-full bg-white text-slate-950 py-3 rounded-xl font-black uppercase italic text-xs'>Continuar</button>
            </div>
          )}
        </div>

        <div className='mt-4 bg-slate-900/40 rounded-3xl p-4 h-32 overflow-y-auto border border-white/10 space-y-1 text-[10px] font-bold italic'>
          {matchState.logs.map((log: string, i: number) => (
            <div key={i} className={i === 0 ? 'text-white' : 'text-slate-500'}>• {log}</div>
          ))}
        </div>
      </div>
    );
  };

  const StatsView = ({ sortedTeams, isDiv2 }: any) => (
    <div className='flex-grow px-4 pb-20'>
      <header className='flex items-center gap-3 mb-6'>
        <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 rounded-xl border border-white/10'><ChevronLeft /></button>
        <h2 className='text-xl font-black italic uppercase'>Tabla {isDiv2 ? '2ª' : '1ª'} Div</h2>
      </header>
      <div className='bg-slate-900/30 rounded-2xl border border-white/10 overflow-hidden'>
        <table className='w-full text-left text-[10px]'>
          <thead className='bg-black/40 text-slate-400 uppercase font-black'>
            <tr>
              <th className='p-3'>Pos</th>
              <th className='p-3'>Equipo</th>
              <th className='p-3 text-center'>PJ</th>
              <th className='p-3 text-center'>Pts</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-white/5'>
            {sortedTeams.map((t: any, i: number) => (
              <tr key={t.id} className={t.id === activeComp?.userTeamId ? 'bg-blue-600/20' : ''}>
                <td className={`p-3 font-black ${isDiv2 && i < 3 ? 'text-emerald-400' : !isDiv2 && i >= sortedTeams.length - 3 ? 'text-red-400' : ''}`}>{i + 1}</td>
                <td className='p-3 flex items-center gap-2 font-bold uppercase italic'>
                  <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' />
                  {t.name}
                </td>
                <td className='p-3 text-center font-bold'>{t.p}</td>
                <td className='p-3 text-center font-black text-emerald-400'>{t.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ResultsView = ({ history, teams, isDiv2 }: any) => (
    <div className='flex-grow px-4 pb-20'>
      <header className='flex items-center gap-3 mb-6'>
        <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 rounded-xl border border-white/10'><ChevronLeft /></button>
        <h2 className='text-xl font-black italic uppercase'>Resultados {isDiv2 ? '2ª' : '1ª'} Div</h2>
      </header>
      <div className='space-y-4'>
        {history.length === 0 && <p className='text-center py-10 text-slate-500 font-bold uppercase italic text-xs'>No hay partidos jugados.</p>}
        {history.map((h: any, i: number) => (
          <div key={i} className='bg-slate-900/30 rounded-2xl p-4 border border-white/10'>
            <h3 className='text-[9px] font-black uppercase text-blue-400 mb-3'>Jornada {h.day}</h3>
            <div className='space-y-2'>
              {h.results.map((r: any, ri: number) => {
                const home = teams.find((t: any) => t.id === r.hId);
                const away = teams.find((t: any) => t.id === r.aId);
                return (
                  <div key={ri} className='flex items-center justify-between bg-black/20 p-2 rounded-xl'>
                    <div className='flex items-center gap-2 w-24'><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' /><span className='text-[9px] font-bold uppercase truncate'>{home?.name}</span></div>
                    <div className='bg-slate-800 px-2 py-0.5 rounded text-[10px] font-black tabular-nums'>{r.sh} - {r.sa}</div>
                    <div className='flex items-center gap-2 w-24 justify-end'><span className='text-[9px] font-bold uppercase truncate'>{away?.name}</span><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' /></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );