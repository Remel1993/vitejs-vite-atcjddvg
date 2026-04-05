/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trophy, Settings, Calendar, History, Swords, ChevronLeft, Save, 
  Users, BarChart3, Play, RotateCcw, Check, Dice1, Dice2, Dice3, 
  Dice4, Dice5, Dice6, Globe, Shield as ShieldIcon, Info, ArrowRight, Dices,
  Wand2, Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. CONSTANTES DEL SISTEMA Y PRESETS
// ==========================================
const APP_ID = 'dice-football-hub-elite-v5';

const PRESETS = {
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
  FR: [ 
    { name: 'PSG', att: 5, opp: 5, def: 4, color1: '#004170', color2: '#da291c', league: 'FR' },
    { name: 'AS Monaco', att: 4, opp: 4, def: 4, color1: '#e30613', color2: '#ffffff', league: 'FR' },
    { name: 'Marseille', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#009dff', league: 'FR' },
    { name: 'Lille OSC', att: 4, opp: 4, def: 4, color1: '#e2001a', color2: '#002654', league: 'FR' },
    { name: 'Olympique Lyon', att: 4, opp: 4, def: 3, color1: '#ffffff', color2: '#da291c', league: 'FR' },
    { name: 'RC Lens', att: 3, opp: 4, def: 4, color1: '#ed1c24', color2: '#ffcc00', league: 'FR' },
    { name: 'OGC Nice', att: 3, opp: 4, def: 4, color1: '#000000', color2: '#e30613', league: 'FR' },
    { name: 'Stade Rennais', att: 3, opp: 4, def: 3, color1: '#e2001a', color2: '#000000', league: 'FR' },
    { name: 'Stade Reims', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff', league: 'FR' },
    { name: 'Strasbourg', att: 3, opp: 3, def: 3, color1: '#00529f', color2: '#ffffff', league: 'FR' },
    { name: 'Toulouse', att: 3, opp: 3, def: 3, color1: '#542f88', color2: '#ffffff', league: 'FR' },
    { name: 'Montpellier', att: 3, opp: 3, def: 3, color1: '#0033a0', color2: '#f68712', league: 'FR' },
    { name: 'FC Nantes', att: 2, opp: 3, def: 3, color1: '#fdf200', color2: '#006532', league: 'FR' },
    { name: 'Brest', att: 3, opp: 4, def: 3, color1: '#e2001a', color2: '#ffffff', league: 'FR' },
    { name: 'Le Havre', att: 2, opp: 3, def: 3, color1: '#00529f', color2: '#87ceeb', league: 'FR' },
    { name: 'AJ Auxerre', att: 2, opp: 3, def: 2, color1: '#ffffff', color2: '#00529f', league: 'FR' },
    { name: 'Angers SCO', att: 2, opp: 3, def: 2, color1: '#000000', color2: '#ffffff', league: 'FR' },
    { name: 'Saint-Étienne', att: 2, opp: 3, def: 3, color1: '#006532', color2: '#ffffff', league: 'FR' },
    { name: 'FC Metz', att: 2, opp: 3, def: 2, color1: '#6c1d45', color2: '#ffffff', league: 'FR' },
    { name: 'FC Lorient', att: 2, opp: 2, def: 3, color1: '#f68712', color2: '#000000', league: 'FR' }
  ],
  MI: [ 
    { name: 'FC Porto', att: 4, opp: 4, def: 4, color1: '#003399', color2: '#ffffff', league: 'MI' },
    { name: 'Benfica', att: 4, opp: 4, def: 4, color1: '#e30613', color2: '#ffffff', league: 'MI' },
    { name: 'Sporting CP', att: 4, opp: 4, def: 4, color1: '#006532', color2: '#ffffff', league: 'MI' },
    { name: 'Celtic FC', att: 3, opp: 4, def: 3, color1: '#006532', color2: '#ffffff', league: 'MI' },
    { name: 'Rangers FC', att: 3, opp: 4, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'MI' },
    { name: 'Galatasaray', att: 3, opp: 4, def: 3, color1: '#a32638', color2: '#fdb913', league: 'MI' },
    { name: 'Fenerbahçe', att: 3, opp: 4, def: 3, color1: '#0033a0', color2: '#fdb913', league: 'MI' },
    { name: 'Olympiacos', att: 3, opp: 4, def: 3, color1: '#e30613', color2: '#ffffff', league: 'MI' },
    { name: 'Panathinaikos', att: 3, opp: 3, def: 3, color1: '#006532', color2: '#ffffff', league: 'MI' },
    { name: 'Club Brugge', att: 3, opp: 4, def: 3, color1: '#0033a0', color2: '#000000', league: 'MI' },
    { name: 'Anderlecht', att: 3, opp: 3, def: 3, color1: '#542f88', color2: '#ffffff', league: 'MI' },
    { name: 'RB Salzburg', att: 3, opp: 4, def: 3, color1: '#ffffff', color2: '#e30613', league: 'MI' },
    { name: 'Slavia Praga', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff', league: 'MI' },
    { name: 'Sparta Praga', att: 3, opp: 3, def: 3, color1: '#a32638', color2: '#0033a0', league: 'MI' },
    { name: 'Dinamo Zagreb', att: 3, opp: 3, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'MI' },
    { name: 'Estrella Roja', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#ffffff', league: 'MI' },
    { name: 'FC Copenhague', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#0033a0', league: 'MI' },
    { name: 'Malmö FF', att: 3, opp: 3, def: 3, color1: '#87ceeb', color2: '#ffffff', league: 'MI' },
    { name: 'Shakhtar D.', att: 3, opp: 4, def: 3, color1: '#f68712', color2: '#000000', league: 'MI' },
    { name: 'Dynamo Kyiv', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#0033a0', league: 'MI' }
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
    { name: 'Colombia', att: 4, opp: 3, def: 3, color1: '#fcd116', color2: '#003893', isFlag: true, region: 'SA' },
    { name: 'Belgium', att: 4, opp: 4, def: 3, color1: '#e30613', color2: '#000000', isFlag: true, region: 'EU' },
    { name: 'Senegal', att: 3, opp: 3, def: 3, color1: '#00853f', color2: '#fdef42', isFlag: true, region: 'AF' },
    { name: 'Switzerland', att: 3, opp: 3, def: 4, color1: '#d52b1e', color2: '#ffffff', isFlag: true, region: 'EU' },
    { name: 'Denmark', att: 3, opp: 3, def: 3, color1: '#c60c30', color2: '#ffffff', isFlag: true, region: 'EU' },
    { name: 'South Korea', att: 3, opp: 4, def: 2, color1: '#ffffff', color2: '#cd2e3a', isFlag: true, region: 'AS' },
    { name: 'Chile', att: 3, opp: 3, def: 3, color1: '#0039a6', color2: '#d52b1e', isFlag: true, region: 'SA' },
    { name: 'Ecuador', att: 3, opp: 3, def: 3, color1: '#ffdd00', color2: '#0033a0', isFlag: true, region: 'SA' },
    { name: 'Nigeria', att: 3, opp: 4, def: 2, color1: '#008751', color2: '#ffffff', isFlag: true, region: 'AF' },
    { name: 'Cameroon', att: 2, opp: 3, def: 3, color1: '#007a5e', color2: '#ce1126', isFlag: true, region: 'AF' },
    { name: 'Ghana', att: 2, opp: 3, def: 2, color1: '#ffffff', color2: '#000000', isFlag: true, region: 'AF' },
    { name: 'Canada', att: 3, opp: 3, def: 2, color1: '#ff0000', color2: '#ffffff', isFlag: true, region: 'NA' },
    { name: 'Australia', att: 2, opp: 3, def: 3, color1: '#00008b', color2: '#ffcd00', isFlag: true, region: 'AS' },
    { name: 'Serbia', att: 3, opp: 3, def: 3, color1: '#c6363c', color2: '#0c4076', isFlag: true, region: 'EU' },
    { name: 'Poland', att: 3, opp: 2, def: 4, color1: '#ffffff', color2: '#dc143c', isFlag: true, region: 'EU' },
    { name: 'Peru', att: 2, opp: 3, def: 3, color1: '#ffffff', color2: '#d91023', isFlag: true, region: 'SA' },
    { name: 'Egypt', att: 3, opp: 2, def: 3, color1: '#ce1126', color2: '#000000', isFlag: true, region: 'AF' }
  ]
};

// ==========================================
// 2. HELPERS Y GENERADORES
// ==========================================

// Global context para prevenir el error de "hardware contexts provided (6) is greater than..."
let globalAudioCtx = null;

const playClick = () => {
  try {
    if (!globalAudioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) globalAudioCtx = new AudioContext();
    }
    if (!globalAudioCtx) return;
    if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume();
    
    const osc = globalAudioCtx.createOscillator();
    const gain = globalAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(globalAudioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, globalAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, globalAudioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, globalAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, globalAudioCtx.currentTime + 0.05);
    osc.start();
    osc.stop(globalAudioCtx.currentTime + 0.05);
  } catch (e) {}
};

const pickLeague = (preset: any[], guaranteed: number, extra: number) => {
  const top = preset.slice(0, guaranteed);
  const rest = [...preset.slice(guaranteed, guaranteed + 6)].sort(() => Math.random() - 0.5).slice(0, extra);
  return [...top, ...rest];
};

const buildCLPool = () => [
  ...pickLeague(PRESETS.ES, 3, 2),
  ...pickLeague(PRESETS.EN, 3, 2),
  ...pickLeague(PRESETS.DE, 3, 2),
  ...pickLeague(PRESETS.IT, 3, 2),
  ...pickLeague(PRESETS.FR, 3, 1),
  ...pickLeague(PRESETS.NL, 3, 1),
  ...pickLeague(PRESETS.MI, 3, 1),
];

// Motor de Sorteo con Algoritmo de Vuelta Atrás Recursiva (Backtracking)
// Asegura cumplir matemáticamente las reglas de la FIFA
const drawKnockoutGroups = (pool, isWC, randomize) => {
  let groups = Array.from({length: 8}, () => []);
  const sortedPool = [...pool].sort((a, b) => (b.att + b.opp + b.def) - (a.att + a.opp + a.def));
  let pots = [sortedPool.slice(0, 8), sortedPool.slice(8, 16), sortedPool.slice(16, 24), sortedPool.slice(24, 32)];

  if (randomize) {
     pots = pots.map(pot => [...pot].sort(() => Math.random() - 0.5));
  }

  if (isWC) {
     const solve = (potIdx, groupIdx) => {
        if (potIdx === 4) return true;
        if (groupIdx === 8) return solve(potIdx + 1, 0);

        for (let i = 0; i < pots[potIdx].length; i++) {
           const team = pots[potIdx][i];
           if (team.used) continue;

           const regionCount = groups[groupIdx].filter(t => t.region === team.region).length;
           let conflict = false;
           if (team.region === 'EU' && regionCount >= 2) conflict = true;
           if (team.region !== 'EU' && regionCount >= 1) conflict = true;

           if (!conflict) {
              team.used = true;
              groups[groupIdx].push(team);
              if (solve(potIdx, groupIdx + 1)) return true;
              // Backtrack
              groups[groupIdx].pop();
              team.used = false;
           }
        }
        return false;
     };

     let workingPots = pots.map(pot => pot.map(t => ({...t, used: false})));
     pots = workingPots;
     let success = solve(0, 0);

     if (!success) {
        // Failsafe, no debería ocurrir en WC de 32
        groups = Array.from({length: 8}, (_, i) => [pots[0][i], pots[1][i], pots[2][i], pots[3][i]]);
     }
  } else {
     // Reglas de CL
     const solve = (potIdx, groupIdx) => {
        if (potIdx === 4) return true;
        if (groupIdx === 8) return solve(potIdx + 1, 0);

        for (let i = 0; i < pots[potIdx].length; i++) {
           const team = pots[potIdx][i];
           if (team.used) continue;

           const sameLeagueCount = groups[groupIdx].filter(t => t.league === team.league).length;
           if (sameLeagueCount === 0) {
              team.used = true;
              groups[groupIdx].push(team);
              if (solve(potIdx, groupIdx + 1)) return true;
              groups[groupIdx].pop();
              team.used = false;
           }
        }
        return false;
     };
     let workingPots = pots.map(pot => pot.map(t => ({...t, used: false})));
     pots = workingPots;
     let success = solve(0, 0);
     if (!success) {
        groups = Array.from({length: 8}, (_, i) => [pots[0][i], pots[1][i], pots[2][i], pots[3][i]]);
     }
  }

  const formattedGroups = groups.map((g, i) => ({ name: 'Grupo ' + String.fromCharCode(65 + i), teamIds: g.map(t => t.id) }));

  return { teams: pool, groups: formattedGroups, matchday: 0, history: [], phase: 'groups', showWinner: false, disqualified: false, userTeamId: pool[0].id, bracket: null };
};

const getAutoFillData = (compId) => {
  const isWC = compId === 'C2';
  let pool = isWC ? [...PRESETS.WC] : buildCLPool();
  pool = pool.map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
  return drawKnockoutGroups(pool, isWC, false);
};

const getShuffleData = (compId) => {
  const isWC = compId === 'C2';
  let pool = isWC ? [...PRESETS.WC] : buildCLPool();
  pool = pool.map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
  return drawKnockoutGroups(pool, isWC, true);
};

const generateKnockoutBrackets = (comp) => {
  if (!comp || !Array.isArray(comp.groups) || !Array.isArray(comp.teams)) return null;
  const groupResults = comp.groups.map(g => {
    const teams = comp.teams.filter(t => g.teamIds && g.teamIds.includes(t.id)).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    return { first: teams[0], second: teams[1] };
  });

  const numGroups = groupResults.length;
  const bracket = { Octavos: [], Cuartos: [], Semis: [], Final: [{ id: 'F1', hId: null, aId: null, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null }] };

  if (numGroups === 8) {
    for (let i = 0; i < 8; i += 2) {
      if (groupResults[i] && groupResults[i+1]) {
        bracket.Octavos.push({ id: 'O'+(i+1), hId: groupResults[i].first?.id, aId: groupResults[i+1].second?.id, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null });
        bracket.Octavos.push({ id: 'O'+(i+2), hId: groupResults[i+1].first?.id, aId: groupResults[i].second?.id, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null });
      }
    }
    bracket.Cuartos = Array(4).fill(null).map((_, i) => ({ id: 'Q'+(i+1), hId: null, aId: null, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null }));
    bracket.Semis = Array(2).fill(null).map((_, i) => ({ id: 'S'+(i+1), hId: null, aId: null, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null }));
  } else if (numGroups === 4) {
    for (let i = 0; i < 4; i += 2) {
      if (groupResults[i] && groupResults[i+1]) {
        bracket.Cuartos.push({ id: 'Q'+(i+1), hId: groupResults[i].first?.id, aId: groupResults[i+1].second?.id, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null });
        bracket.Cuartos.push({ id: 'Q'+(i+2), hId: groupResults[i+1].first?.id, aId: groupResults[i].second?.id, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null });
      }
    }
    bracket.Semis = Array(2).fill(null).map((_, i) => ({ id: 'S'+(i+1), hId: null, aId: null, sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null }));
    bracket.Octavos = null;
  }
  return bracket;
};

const generateLeagueSchedule = (teams, twoLegged = true) => {
  if (!Array.isArray(teams)) return [];
  const n = teams.length;
  if (n % 2 !== 0) return [];
  const teamIds = teams.map(t => t.id);
  const rounds = [];
  const totalRounds = twoLegged ? (n - 1) * 2 : (n - 1);

  for (let j = 0; j < totalRounds; j++) {
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


// ==========================================
// 3. COMPONENTES ATÓMICOS
// ==========================================
const COUNTRY_CODES: Record<string, string> = {
  'afghanistan': 'af', 'afganistán': 'af', 'albania': 'al', 'algeria': 'dz', 'argelia': 'dz',
  'andorra': 'ad', 'angola': 'ao', 'argentina': 'ar', 'armenia': 'am', 'australia': 'au',
  'austria': 'at', 'azerbaijan': 'az', 'azerbaiyán': 'az', 'bahrain': 'bh', 'baréin': 'bh',
  'bangladesh': 'bd', 'belarus': 'by', 'bielorrusia': 'by', 'belgium': 'be', 'bélgica': 'be',
  'benin': 'bj', 'bénin': 'bj', 'bolivia': 'bo', 'bosnia': 'ba', 'botswana': 'bw',
  'brazil': 'br', 'brasil': 'br', 'bulgaria': 'bg', 'burkina faso': 'bf', 'burundi': 'bi',
  'cambodia': 'kh', 'camboya': 'kh', 'cameroon': 'cm', 'camerún': 'cm', 'canada': 'ca',
  'canadá': 'ca', 'cape verde': 'cv', 'cabo verde': 'cv', 'central african republic': 'cf',
  'chad': 'td', 'chile': 'cl', 'china': 'cn', 'colombia': 'co', 'congo': 'cg',
  'dr congo': 'cd', 'rep dem congo': 'cd', 'costa rica': 'cr', 'croatia': 'hr',
  'croacia': 'hr', 'cuba': 'cu', 'cyprus': 'cy', 'chipre': 'cy', 'czech republic': 'cz',
  'czechia': 'cz', 'rep checa': 'cz', 'república checa': 'cz', 'denmark': 'dk',
  'dinamarca': 'dk', 'djibouti': 'dj', 'dominican republic': 'do', 'rep dominicana': 'do',
  'ecuador': 'ec', 'egypt': 'eg', 'egipto': 'eg', 'el salvador': 'sv', 'england': 'gb-eng',
  'inglaterra': 'gb-eng', 'equatorial guinea': 'gq', 'guinea ecuatorial': 'gq',
  'eritrea': 'er', 'estonia': 'ee', 'ethiopia': 'et', 'etiopía': 'et', 'finland': 'fi',
  'finlandia': 'fi', 'france': 'fr', 'francia': 'fr', 'gabon': 'ga', 'gambia': 'gm',
  'georgia': 'ge', 'germany': 'de', 'alemania': 'de', 'ghana': 'gh', 'greece': 'gr',
  'grecia': 'gr', 'guatemala': 'gt', 'guinea': 'gn', 'guinea-bissau': 'gw',
  'guinea bissau': 'gw', 'haiti': 'ht', 'haití': 'ht', 'honduras': 'hn', 'hungary': 'hu',
  'hungría': 'hu', 'iceland': 'is', 'islandia': 'is', 'india': 'in', 'indonesia': 'id',
  'iran': 'ir', 'irán': 'ir', 'iraq': 'iq', 'irak': 'iq', 'ireland': 'ie', 'irlanda': 'ie',
  'israel': 'il', 'italy': 'it', 'italia': 'it', 'ivory coast': 'ci', 'costa de marfil': 'ci',
  'jamaica': 'jm', 'japan': 'jp', 'japón': 'jp', 'jordan': 'jo', 'jordania': 'jo',
  'kazakhstan': 'kz', 'kazajistán': 'kz', 'kenya': 'ke', 'kenia': 'ke', 'kuwait': 'kw',
  'kyrgyzstan': 'kg', 'laos': 'la', 'latvia': 'lv', 'letonia': 'lv', 'lebanon': 'lb',
  'líbano': 'lb', 'lesotho': 'ls', 'liberia': 'lr', 'libya': 'ly', 'libia': 'ly',
  'liechtenstein': 'li', 'lithuania': 'lt', 'lituania': 'lt', 'luxembourg': 'lu',
  'luxemburgo': 'lu', 'madagascar': 'mg', 'malawi': 'mw', 'malaysia': 'my', 'malasia': 'my',
  'maldives': 'mv', 'mali': 'ml', 'malta': 'mt', 'mauritania': 'mr', 'mauritius': 'mu',
  'mexico': 'mx', 'méxico': 'mx', 'moldova': 'md', 'mongolia': 'mn', 'montenegro': 'me',
  'morocco': 'ma', 'marruecos': 'ma', 'mozambique': 'mz', 'myanmar': 'mm', 'namibia': 'na',
  'nepal': 'np', 'netherlands': 'nl', 'holanda': 'nl', 'países bajos': 'nl', 'new zealand': 'nz',
  'nueva zelanda': 'nz', 'nicaragua': 'ni', 'niger': 'ne', 'nigeria': 'ng', 'north korea': 'kp',
  'corea del norte': 'kp', 'north macedonia': 'mk', 'macedonia': 'mk', 'norway': 'no',
  'noruega': 'no', 'oman': 'om', 'omán': 'om', 'pakistan': 'pk', 'panamá': 'pa', 'panama': 'pa',
  'papua new guinea': 'pg', 'paraguay': 'py', 'peru': 'pe', 'perú': 'pe', 'philippines': 'ph',
  'filipinas': 'ph', 'poland': 'pl', 'polonia': 'pl', 'portugal': 'pt', 'qatar': 'qa',
  'romania': 'ro', 'rumanía': 'ro', 'russia': 'ru', 'rusia': 'ru', 'rwanda': 'rw',
  'saudi arabia': 'sa', 'arabia saudita': 'sa', 'arabia saudí': 'sa', 'scotland': 'gb-sct',
  'escocia': 'gb-sct', 'senegal': 'sn', 'serbia': 'rs', 'sierra leone': 'sl',
  'singapore': 'sg', 'singapur': 'sg', 'slovakia': 'sk', 'eslovaquia': 'sk',
  'slovenia': 'si', 'eslovenia': 'si', 'somalia': 'so', 'south africa': 'za',
  'sudáfrica': 'za', 'south korea': 'kr', 'corea del sur': 'kr', 'spain': 'es', 'españa': 'es',
  'sri lanka': 'lk', 'sudan': 'sd', 'sudán': 'sd', 'sweden': 'se', 'suecia': 'se',
  'switzerland': 'ch', 'suiza': 'ch', 'syria': 'sy', 'siria': 'sy', 'taiwan': 'tw',
  'tajikistan': 'tj', 'tanzania': 'tz', 'thailand': 'th', 'tailandia': 'th', 'togo': 'tg',
  'trinidad': 'tt', 'trinidad and tobago': 'tt', 'trinidad y tobago': 'tt', 'tunisia': 'tn',
  'túnez': 'tn', 'turkey': 'tr', 'turquía': 'tr', 'turkmenistan': 'tm', 'uganda': 'ug',
  'ukraine': 'ua', 'ucrania': 'ua', 'uae': 'ae', 'emiratos árabes': 'ae',
  'emiratos arabes unidos': 'ae', 'united arab emirates': 'ae', 'united states': 'us',
  'usa': 'us', 'estados unidos': 'us', 'uruguay': 'uy', 'uzbekistan': 'uz', 'venezuela': 've',
  'vietnam': 'vn', 'wales': 'gb-wls', 'gales': 'gb-wls', 'yemen': 'ye', 'zambia': 'zm',
  'zimbabwe': 'zw',
};

const getCountryCode = (name: string): string | null => {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  return COUNTRY_CODES[key] || null;
};

const Shield = ({ color1, color2, initial, size = 'md', isFlag = false }) => {
  const dims = size === 'lg' ? 'w-20 h-24' : size === 'sm' ? 'w-8 h-10' : size === 'xs' ? 'w-5 h-6' : 'w-12 h-14';
  const imgDims = size === 'lg' ? 'w-20 h-14' : size === 'sm' ? 'w-8 h-6' : size === 'xs' ? 'w-5 h-4' : 'w-12 h-8';
  const fontSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-[10px]' : size === 'xs' ? 'text-[8px]' : 'text-sm';
  const safeInitial = initial ? initial[0] : '?';

  if (isFlag) {
    const code = getCountryCode(initial);
    if (code) {
      return (
        <div className={`${imgDims} relative overflow-hidden shadow-md rounded-sm border border-white/10 shrink-0`}>
          <img
            src={`https://flagcdn.com/${code}.svg`}
            alt={initial}
            className='w-full h-full object-cover'
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      );
    }
    return (
      <div className={`${dims} relative overflow-hidden shadow-md rounded-lg border border-white/10 shrink-0`}>
        <div className='absolute inset-0 flex flex-col'>
          <div className='h-1/2 w-full' style={{ backgroundColor: color1 || '#333' }}></div>
          <div className='h-1/2 w-full' style={{ backgroundColor: color2 || '#666' }}></div>
        </div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className={`${fontSize} font-black text-white mix-blend-difference italic drop-shadow-md`}>{safeInitial}</span>
        </div>
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

const DieIcon = ({ value, className }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1] || Dices;
  return <Icon className={className} strokeWidth={1.5} />;
};

const Confetti = () => (
  <div className='fixed inset-0 pointer-events-none z-[55] overflow-hidden'>
    {[...Array(60)].map((_, i) => (
      <div 
        key={i} className='absolute animate-bounce'
        style={{
          left: (Math.random() * 100) + '%', top: '-10%', width: '8px', height: '8px',
          backgroundColor: ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ffffff'][Math.floor(Math.random() * 5)],
          animation: `confetti-fall ${2 + Math.random() * 3}s linear infinite`, animationDelay: `${Math.random() * 2}s`
        }}
      />
    ))}
    <style>{`@keyframes confetti-fall { to { transform: translateY(110vh) rotate(720deg); } }`}</style>
  </div>
);

const AttrStepper = ({ label, val, min, max, onUpdate }) => (
  <div className='flex flex-col items-center bg-black/40 rounded-xl p-1.5 border border-white/10'>
    <span className='text-[7px] font-black uppercase text-slate-300 mb-1'>{label}</span>
    <div className='flex items-center gap-2 w-full justify-center'>
      <button onClick={() => onUpdate(Math.max(min, val - 1))} className='w-5 h-5 bg-slate-800/80 hover:bg-slate-700 rounded text-white text-xs font-bold active:scale-95 flex items-center justify-center transition-all'>-</button>
      <span className='text-[10px] font-black w-2 text-center text-white'>{val}</span>
      <button onClick={() => onUpdate(Math.min(max, val + 1))} className='w-5 h-5 bg-slate-800/80 hover:bg-slate-700 rounded text-white text-xs font-bold active:scale-95 flex items-center justify-center transition-all'>+</button>
    </div>
  </div>
);

const MenuButton = ({ icon, label, onClick, disabled = false, isDanger = false, isWide = false }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`
      flex flex-col items-center justify-center p-3 rounded-2xl border transition-all 
      ${isWide ? 'col-span-2 flex-row gap-2' : 'col-span-1'}
      ${disabled ? 'opacity-30 cursor-not-allowed bg-slate-900/20 border-white/5' : 
        isDanger ? 'bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40 active:scale-95' : 
        'bg-slate-800/40 border-white/10 text-white hover:bg-slate-700/60 active:scale-95 hover:border-white/30 backdrop-blur-md'}
    `}
  >
    <div className={isWide ? 'mb-0' : 'mb-1'}>{icon}</div>
    <span className='text-[8px] font-black uppercase italic tracking-wider'>{label}</span>
  </button>
);

const PenaltyDots = ({ history }) => {
  const totalLen = history ? history.length : 0;
  const startIdx = totalLen % 5 === 0 && totalLen > 0 ? totalLen - 5 : totalLen - (totalLen % 5);
  const visibleHistory = history && totalLen > 0 ? history.slice(startIdx) : [];

  return (
    <div className="flex justify-center gap-[3px] mb-2 min-h-[14px]">
      {visibleHistory.map((h, i) => {
        const globalIdx = startIdx + i;
        const isNewest = globalIdx === totalLen - 1;
        return (
          <div
            key={globalIdx}
            style={isNewest ? { animation: 'penDotPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both' } : {}}
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${h ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]'}`}
          >
            <span className="text-[7px] text-white font-black">{h ? '✓' : '✗'}</span>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 4. VISTAS SECUNDARIAS (MÓDULOS DE UI)
// ==========================================

const ArchiveView = ({ setView, archive, selectedArchiveEntry, setSelectedArchiveEntry }) => (
  <div className='flex-grow flex flex-col'>
    <header className='flex items-center gap-3 mb-8 px-4'>
      <button onClick={() => selectedArchiveEntry ? setSelectedArchiveEntry(null) : setView('hub')} className='p-3 bg-slate-900/30 backdrop-blur-md rounded-2xl text-slate-300 hover:text-white active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
      <h2 className='text-xl font-black uppercase italic text-yellow-500 drop-shadow-md'>Salón de la Fama</h2>
    </header>

    <div className='px-4 pb-8'>
      {!selectedArchiveEntry ? (
        <div className='space-y-4'>
          <p className="text-[10px] text-slate-300 font-bold uppercase italic tracking-widest text-center mb-6 drop-shadow-md">Últimos 5 Campeones Registrados</p>
          {archive.length === 0 ? (
            <div className='text-center py-20 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl'>
              <History size={48} className='mx-auto mb-4 text-slate-400' />
              <p className='text-xs font-black uppercase italic text-slate-300'>No hay registros guardados</p>
            </div>
          ) : (
            archive.map((entry, idx) => (
              <button key={entry.id || idx} onClick={() => setSelectedArchiveEntry(entry)} className='w-full p-4 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-4 hover:bg-slate-800/50 active:scale-95 transition-all text-left shadow-lg group'>
                <div className='w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0 group-hover:scale-110 transition-transform'><Trophy size={24} /></div>
                <div className='flex-grow overflow-hidden'>
                  <h3 className='text-sm font-black uppercase italic truncate text-white'>{entry.name}</h3>
                  <p className='text-[10px] text-slate-300 font-bold'>{entry.date} • Campeón: {entry.winner?.name || 'Desconocido'}</p>
                </div>
                <ArrowRight size={16} className='text-slate-400 shrink-0 group-hover:text-yellow-500 transition-colors' />
              </button>
            ))
          )}
        </div>
      ) : (
        <div className='bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-yellow-500/40 p-6 relative overflow-hidden shadow-2xl'>
          <div className='absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none'></div>
          <div className="text-center relative z-10">
            <Trophy size={56} className='text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' />
            <h3 className='text-2xl font-black italic uppercase mb-1 text-white'>{selectedArchiveEntry.name}</h3>
            <p className='text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6'>{selectedArchiveEntry.date}</p>
            
            <div className='bg-black/30 rounded-3xl p-6 mb-6 border border-white/10 backdrop-blur-sm'>
              <h4 className='text-[10px] font-black uppercase text-yellow-500/80 mb-4 tracking-widest'>Campeón del Torneo</h4>
              <div className='flex flex-col items-center justify-center gap-3'>
                <Shield color1={selectedArchiveEntry.winner?.color1} color2={selectedArchiveEntry.winner?.color2} initial={selectedArchiveEntry.winner?.name} size='lg' isFlag={selectedArchiveEntry.winner?.isFlag} />
                <span className='text-xl font-black uppercase italic text-yellow-400 mt-2'>{selectedArchiveEntry.winner?.name}</span>
              </div>
            </div>

            {selectedArchiveEntry.type === 'league' && selectedArchiveEntry.teams && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5 text-left">
                <h4 className='text-[10px] font-black uppercase text-slate-300 mb-3 flex items-center gap-2'><BarChart3 size={14}/> Top 4 Clasificación</h4>
                <div className="space-y-2">
                  {[...selectedArchiveEntry.teams].sort((a,b)=>b.pts-a.pts || (b.gf-b.ga)-(a.gf-a.ga)).slice(0, 4).map((t, i) => (
                    <div key={i} className={`flex items-center justify-between text-[10px] p-2 rounded-xl ${i===0 ? 'bg-yellow-500/20 text-yellow-100 font-black' : 'bg-black/20 text-slate-200 font-bold'}`}>
                        <div className="flex items-center gap-2">
                            <span className="w-3 text-slate-400">{i+1}</span>
                            <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' isFlag={t.isFlag}/>
                            <span className="uppercase italic">{t.name}</span>
                        </div>
                        <span className="text-emerald-400">{t.pts} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedArchiveEntry.type !== 'league' && selectedArchiveEntry.bracket?.Final && selectedArchiveEntry.bracket.Final[0] && (
               <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                 <h4 className='text-[10px] font-black uppercase text-slate-300 mb-3 flex justify-center items-center gap-2'><Swords size={14}/> La Gran Final</h4>
                 {(() => {
                   const finalMatch = selectedArchiveEntry.bracket.Final[0];
                   const home = selectedArchiveEntry.teams?.find(t => t.id === finalMatch.hId);
                   const away = selectedArchiveEntry.teams?.find(t => t.id === finalMatch.aId);
                   return (
                     <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 w-20">
                           <Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag}/>
                           <span className="text-[9px] font-bold uppercase truncate">{home?.name}</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <span className="bg-slate-900/50 px-3 py-1 rounded text-[11px] font-black tabular-nums">{finalMatch.sh} - {finalMatch.sa}</span>
                           {finalMatch.penH !== null && finalMatch.penH !== undefined && (
                             <span className="text-[8px] text-blue-300 font-bold mt-1">(pen {finalMatch.penH}-{finalMatch.penA})</span>
                           )}
                        </div>
                        <div className="flex items-center gap-2 w-20 justify-end">
                           <span className="text-[9px] font-bold uppercase truncate text-right">{away?.name}</span>
                           <Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag}/>
                        </div>
                     </div>
                   );
                 })()}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

const RulesView = ({ setView }) => (
  <div className='flex-grow px-4 pb-8 flex flex-col'>
    <header className='flex items-center gap-3 mb-8'>
      <button onClick={() => setView('hub')} className='p-3 bg-slate-900/30 backdrop-blur-md rounded-2xl text-slate-300 hover:text-white active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
      <h2 className='text-xl font-black uppercase italic text-blue-400 drop-shadow-md'>Reglas del Juego</h2>
    </header>
    <div className='space-y-4'>
      <div className='bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg'>
        <h4 className='text-xs font-black uppercase italic text-emerald-400 mb-2'>1. El Sistema de Dados</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Cada partido se decide por turnos de ataque. Los equipos tienen un número limitado de tiros (OPORT) basado en su fortaleza.</p>
      </div>
      <div className='bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg'>
        <h4 className='text-xs font-black uppercase italic text-blue-400 mb-2'>2. Ataque y Defensa</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Para marcar gol, el atacante debe sacar un número menor o igual a su ATK. Si lo logra, el portero rival debe sacar un número <strong className='text-white'>menor o igual a su DEF</strong> para detenerlo. Si saca mayor, es GOL.</p>
      </div>
      <div className='bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg'>
        <h4 className='text-xs font-black uppercase italic text-yellow-400 mb-2'>3. Formatos y Fechas</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Ligas de 18 o 20 equipos calculan sus jornadas automáticamente. Las copas tienen grupos, ida, vuelta, y una Final a partido único.</p>
      </div>
      <div className='bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg'>
        <h4 className='text-xs font-black uppercase italic text-purple-400 mb-2'>4. Tanda de Penales</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Si hay empate global, se van a penales. Verás el registro individual de cada tiro (✓ o ✗). Si persiste el empate en los 5 tiros, ¡Muerte Súbita!</p>
      </div>
    </div>
  </div>
);

const HubView = ({ setView, setActiveCompId, setCompView, comps }) => {
  const [showLeagues, setShowLeagues] = useState(false);
  const leagues = [
    { id: 'L1', color: 'blue' }, { id: 'L2', color: 'emerald' }, { id: 'L3', color: 'orange' }, 
    { id: 'L4', color: 'purple' }, { id: 'L5', color: 'red' }, { id: 'L6', color: 'indigo' }, { id: 'L7', color: 'pink' }
  ];

  return (
  <div className='flex-grow flex flex-col px-4 pb-8'>
    <header className='py-10 text-center'>
      <h1 className='text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-green-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]'>Football Hub</h1>
      <p className='text-[11px] text-slate-200 font-bold uppercase tracking-widest mt-3 drop-shadow-md'>Elite Dice Engine</p>
    </header>

    <div className='space-y-8 flex-grow'>
      <div className='grid grid-cols-2 gap-4'>
        <button onClick={() => setView('archive')} className='p-5 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/40 hover:border-yellow-500/30 hover:shadow-[0_0_25px_rgba(234,179,8,0.25)] active:scale-[0.98] transition-all duration-300 group'>
          <div className='w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-[inset_0_0_15px_rgba(234,179,8,0.2)] group-hover:scale-110 transition-transform duration-300'><History size={28} /></div>
          <div className='text-center'>
            <h3 className='text-[13px] font-black uppercase italic text-white group-hover:text-yellow-400 transition-colors'>Historial</h3>
            <p className='text-[9px] text-slate-300 font-bold mt-1 tracking-widest uppercase'>Salón de Fama</p>
          </div>
        </button>

        <button onClick={() => setView('rules')} className='p-5 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 flex flex-col items-center gap-3 hover:bg-slate-800/40 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] active:scale-[0.98] transition-all duration-300 group'>
          <div className='w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-300'><Info size={28} /></div>
          <div className='text-center'>
            <h3 className='text-[13px] font-black uppercase italic text-white group-hover:text-blue-400 transition-colors'>Reglas</h3>
            <p className='text-[9px] text-slate-300 font-bold mt-1 tracking-widest uppercase'>Cómo jugar</p>
          </div>
        </button>
      </div>

      <section>
        <h3 className='text-xs font-black uppercase text-slate-200 mb-4 flex items-center gap-2 drop-shadow-md tracking-wider'><Trophy size={14} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" /> Torneos Internacionales</h3>
        <div className='grid grid-cols-2 gap-4'>
          {['C1', 'C2'].map(id => (
            <button key={id} onClick={() => { setActiveCompId(id); setView('competition'); setCompView('main'); }} className='p-6 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 flex flex-col items-center gap-4 hover:bg-slate-800/40 hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all duration-300 group'>
              <div className={`w-14 h-14 rounded-full bg-slate-950/40 flex items-center justify-center text-white border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300 ${id === 'C1' ? 'drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]' : 'drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]'}`}>
                {id === 'C1' ? <Trophy size={28} className="text-blue-400" /> : <Globe size={28} className="text-emerald-400" />}
              </div>
              <div className='text-center'>
                <h4 className='text-[11px] font-black uppercase italic text-white tracking-wide'>{comps[id]?.name}</h4>
                <span className='text-[8px] font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-slate-100 mt-2 inline-block uppercase tracking-wider'>{comps[id]?.phase === 'groups' ? 'Fase Grupos' : comps[id]?.phase}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <button onClick={() => setShowLeagues(!showLeagues)} className='w-full p-5 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 flex items-center justify-between hover:bg-slate-800/50 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] active:scale-[0.98] transition-all duration-300 group'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[inset_0_0_15px_rgba(52,211,153,0.2)] group-hover:scale-110 transition-transform duration-300'>
              <ShieldIcon size={28} />
            </div>
            <div className='text-left'>
              <h3 className='text-sm font-black uppercase italic text-white tracking-wide group-hover:text-emerald-50 transition-colors'>Ligas Nacionales</h3>
              <p className='text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1'>Selecciona tu liga local</p>
            </div>
          </div>
          <motion.div animate={{ rotate: showLeagues ? 90 : 0 }} transition={{ type: "spring", stiffness: 200 }} className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors'>
            <ArrowRight size={20} />
          </motion.div>
        </button>

        <AnimatePresence>
          {showLeagues && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className='overflow-hidden'>
              <div className='grid grid-cols-1 gap-2 pt-4 px-2'>
                {leagues.map(({id}) => {
                  const comp = comps[id]; if (!comp) return null;
                  const isConf = comp.teams && comp.teams.length > 0;
                  return (
                    <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={id} onClick={() => { setActiveCompId(id); setView('competition'); setCompView('main'); }} className='p-4 bg-slate-900/30 backdrop-blur-md rounded-[1.5rem] border border-white/5 flex items-center justify-between hover:bg-slate-800/50 hover:border-emerald-500/20 hover:shadow-[0_0_15px_rgba(52,211,153,0.1)] active:scale-[0.98] transition-all duration-200 group'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-xl bg-slate-950/40 flex items-center justify-center text-slate-200 border border-white/5 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all'><BarChart3 size={18} /></div>
                        <div className='text-left'>
                          <h4 className='text-xs font-black uppercase italic text-slate-100 group-hover:text-white transition-colors tracking-wide'>{comp.name}</h4>
                          <p className='text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5'>{isConf ? `Jornada ${(comp.matchday || 0) + 1} de ${(comp.teams.length - 1) * 2}` : 'No Inicializada'}</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className='text-slate-400 group-hover:text-emerald-400 transition-colors' />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
    <footer className='py-6 text-center opacity-40'><p className='text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md'>Powered by Dice Engine v5.0</p></footer>
  </div>
)};

const ConfigPanel = ({ initialComp, compId, hasStarted, onSave, onCancel }) => {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(initialComp)));
  const [drawModal, setDrawModal] = useState(null); // Para mostrar bombos antes de asignar

  const updateTeamAttr = (id, field, val) => {
    setDraft(prev => ({ ...prev, teams: prev.teams.map(t => t.id === id ? { ...t, [field]: val } : t) }));
  };

  const handleLeaguePreset = (presetId) => {
    if (hasStarted) return;
    setDraft(prev => ({ ...prev, teams: PRESETS[presetId].map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 })) }));
  };

  const handleDrawUI = (type) => {
    if (hasStarted) return;
    const isWC = compId === 'C2';
    const pool = isWC ? [...PRESETS.WC] : buildCLPool();
    const initializedPool = pool.map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
    
    // 1. Crear y ordenar bombos por fuerza para mostrarlos
    initializedPool.sort((a, b) => (b.att + b.opp + b.def) - (a.att + a.opp + a.def));
    const pots = [
      initializedPool.slice(0, 8),
      initializedPool.slice(8, 16),
      initializedPool.slice(16, 24),
      initializedPool.slice(24, 32)
    ];

    // 2. Realizar el Sorteo de acuerdo a las Reglas
    const drawData = drawKnockoutGroups(initializedPool, isWC, type === 'shuffle');

    // 3. Mostrar Modal Visual interactivo
    setDrawModal({
      step: 'pots',
      pots,
      groups: drawData.groups,
      drawData
    });
  };

  return (
    <div className='flex-grow px-4 pb-24 relative'>
      {drawModal && (
          <div className='fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col p-6 overflow-y-auto custom-scrollbar'>
              <h2 className='text-2xl font-black uppercase italic text-yellow-400 text-center mb-6 mt-4 drop-shadow-md'>
                  {drawModal.step === 'pots' ? 'Bombos Generados' : 'Sorteo Finalizado'}
              </h2>
              {drawModal.step === 'pots' ? (
                  <div className='space-y-4 mb-20'>
                       <p className='text-[10px] text-center text-slate-300 font-bold mb-4 uppercase'>Equipos ordenados por ranking de fuerza en 4 bombos.</p>
                       {drawModal.pots.map((pot, i) => (
                           <div key={i} className='bg-slate-900/50 p-4 rounded-2xl border border-white/10'>
                               <h3 className='text-sm font-black uppercase text-blue-400 mb-3 flex items-center gap-2'><ShieldIcon size={14}/> Bombo {i+1}</h3>
                               <div className='grid grid-cols-2 gap-2'>
                                   {pot.map(t => (
                                       <div key={t.id} className='flex items-center gap-2 text-[10px] bg-black/30 p-2 rounded-xl border border-white/5'>
                                          <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' isFlag={t.isFlag} />
                                          <span className='font-bold uppercase truncate'>{t.name}</span>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       ))}
                       <button onClick={() => setDrawModal({...drawModal, step: 'groups'})} className='w-full mt-6 bg-emerald-600 py-4 rounded-xl font-black uppercase italic text-white active:scale-95 shadow-lg shadow-emerald-500/20 transition-all'>Asignar a Grupos (A-H)</button>
                  </div>
              ) : (
                  <div className='space-y-4 mb-20'>
                       <p className='text-[10px] text-center text-slate-300 font-bold mb-4 uppercase'>Grupos formados respetando reglas de confederación.</p>
                       <div className='grid grid-cols-1 gap-4'>
                           {drawModal.groups.map((g, i) => (
                               <div key={i} className='bg-slate-900/50 p-4 rounded-2xl border border-white/10'>
                                   <h3 className='text-[11px] font-black uppercase text-emerald-400 mb-2 flex justify-between'>
                                      <span>{g.name}</span>
                                   </h3>
                                   <div className='space-y-1.5'>
                                       {g.teamIds.map(id => {
                                           const t = drawModal.drawData.teams.find(x => x.id === id);
                                           return (
                                               <div key={id} className='flex items-center justify-between text-[10px] bg-black/30 p-2 rounded-xl border border-white/5'>
                                                   <div className='flex items-center gap-2'>
                                                       <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' isFlag={t.isFlag} />
                                                       <span className='font-bold uppercase'>{t.name}</span>
                                                   </div>
                                                   {compId === 'C2' && <span className='text-[8px] font-black text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-white/5'>{t.region}</span>}
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           ))}
                       </div>
                       <div className='flex gap-3 mt-6'>
                          <button onClick={() => setDrawModal(null)} className='flex-1 bg-slate-800 border border-white/10 py-4 rounded-xl font-black uppercase italic text-white active:scale-95 transition-all'>Cancelar</button>
                          <button onClick={() => { setDraft(prev => ({...prev, ...drawModal.drawData})); setDrawModal(null); }} className='flex-[2] bg-blue-600 py-4 rounded-xl font-black uppercase italic text-white active:scale-95 shadow-lg shadow-blue-500/20 transition-all'>Confirmar y Guardar</button>
                       </div>
                  </div>
              )}
          </div>
      )}

      <div className='flex items-center gap-3 mb-6'>
        <button onClick={onCancel} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
        <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Configuración</h2>
      </div>

      <div className='grid grid-cols-2 gap-2 mb-6'>
        {draft.type === 'league' ? (
          [
            {id: 'ES', label: 'Liga Española', color: 'blue'}, {id: 'IT', label: 'Liga Italiana', color: 'emerald'},
            {id: 'EN', label: 'Liga Inglesa', color: 'orange'}, {id: 'DE', label: 'Liga Alemana', color: 'purple'},
            {id: 'NL', label: 'Liga Holandesa', color: 'red'}, {id: 'FR', label: 'Liga Francesa', color: 'indigo'},
            {id: 'MI', label: 'Miscelánea', color: 'pink'}
          ].map(l => (
            <button key={l.id} onClick={() => handleLeaguePreset(l.id)} disabled={hasStarted} className={`p-3 bg-${l.color}-600/20 backdrop-blur-md text-${l.color}-200 border border-${l.color}-500/40 rounded-2xl text-[8px] font-black uppercase italic transition-all ${l.id === 'MI' ? 'col-span-2' : ''} ${hasStarted ? 'opacity-40 cursor-not-allowed' : 'active:scale-95 hover:bg-' + l.color + '-600/40'}`}>{l.label}</button>
          ))
        ) : (
          <>
            <button onClick={() => handleDrawUI('auto')} disabled={hasStarted} className={`p-3 border rounded-2xl text-[8px] font-black uppercase italic flex flex-col items-center justify-center gap-1 transition-all backdrop-blur-md ${hasStarted ? 'opacity-40 cursor-not-allowed bg-yellow-900/20 border-yellow-500/10 text-yellow-500/50' : 'bg-yellow-600/20 text-yellow-200 border-yellow-500/40 hover:bg-yellow-600/40 active:scale-95'}`}>
              <Wand2 size={16}/> Auto-Rellenar
            </button>
            <button onClick={() => handleDrawUI('shuffle')} disabled={hasStarted} className={`p-3 border rounded-2xl text-[8px] font-black uppercase italic flex flex-col items-center justify-center gap-1 transition-all backdrop-blur-md ${hasStarted ? 'opacity-40 cursor-not-allowed bg-emerald-900/20 border-emerald-500/10 text-emerald-500/50' : 'bg-emerald-600/20 text-emerald-200 border-emerald-500/40 hover:bg-emerald-600/40 active:scale-95'}`}>
              <Shuffle size={16}/> Sorteo Dinámico
            </button>
            {hasStarted && <p className='col-span-2 text-[8px] text-center text-red-400 font-bold uppercase italic mt-1 drop-shadow-md'>No puedes mezclar/rellenar en temporada activa.</p>}
          </>
        )}
      </div>

      <div className='grid gap-4'>
        {(!Array.isArray(draft.teams) || draft.teams.length === 0) && <div className='text-center py-10 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-dashed border-white/20'><p className='text-[10px] font-bold text-slate-300 uppercase italic'>No hay equipos configurados.</p></div>}
        {Array.isArray(draft.teams) && draft.teams.map(t => (
          <div key={t.id} className='bg-slate-900/30 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 shadow-lg space-y-4'>
            <div className='flex items-center gap-4'>
              <Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='lg' isFlag={t?.isFlag} />
              <div className='flex-grow'>
                <input className='bg-black/30 w-full rounded-xl p-2 text-sm font-black italic uppercase border border-white/10 focus:border-blue-500 focus:bg-slate-800/80 outline-none text-white transition-colors backdrop-blur-sm' value={t?.name} onChange={(e) => updateTeamAttr(t.id, 'name', e.target.value)} />
                <div className='grid grid-cols-3 gap-2 mt-3'>
                  <AttrStepper label="Atk (1-5)" val={t.att} min={1} max={5} onUpdate={(v) => updateTeamAttr(t.id, 'att', v)} />
                  <AttrStepper label="Opp (1-5)" val={t.opp} min={1} max={5} onUpdate={(v) => updateTeamAttr(t.id, 'opp', v)} />
                  <AttrStepper label="Def (1-4)" val={t.def} min={1} max={4} onUpdate={(v) => updateTeamAttr(t.id, 'def', v)} />
                </div>
                <div className='flex gap-2 mt-3 bg-black/30 p-1.5 rounded-xl border border-white/5 w-max backdrop-blur-sm'>
                  <input type='color' value={t.color1} onChange={(e) => updateTeamAttr(t.id, 'color1', e.target.value)} className='w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none p-0' />
                  <input type='color' value={t.color2} onChange={(e) => updateTeamAttr(t.id, 'color2', e.target.value)} className='w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none p-0' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 z-50'>
        <button onClick={() => onSave(draft)} className='w-full bg-blue-600/80 backdrop-blur-md text-white py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 active:scale-95 transition-all border border-blue-400'><Save size={18} /> Guardar</button>
      </div>
    </div>
  );
};

// ==========================================
// 5. APLICACIÓN PRINCIPAL Y LÓGICA DE COMPETICIÓN
// ==========================================

export default function App() {
  const [view, setView] = useState('hub');
  const [activeCompId, setActiveCompId] = useState(null);
  const [compView, setCompView] = useState('main');
  const [showExitModal, setShowExitModal] = useState(false);

  // MANEJO DE NAVEGACIÓN Y BOTÓN FÍSICO (ANDROID/PWA)
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href); // Mantiene el bloqueo del pop default
      
      if (showExitModal) {
        setShowExitModal(false);
        return;
      }

      if (view === 'competition' && compView !== 'main') {
        setCompView('main');
      } else if (view !== 'hub') {
        setView('hub');
        setActiveCompId(null);
        setCompView('main');
      } else {
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view, compView, showExitModal]);

  const [archive, setArchive] = useState([]);
  const [selectedArchiveEntry, setSelectedArchiveEntry] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (e.target.closest('button')) playClick(); };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const [comps, setComps] = useState(() => {
    const baseTeam = (preset) => PRESETS[preset].map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
    return {
      'L1': { type: 'league', name: 'Liga Española', teams: baseTeam('ES'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'L2': { type: 'league', name: 'Liga Italiana', teams: baseTeam('IT'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'L3': { type: 'league', name: 'Liga Inglesa', teams: baseTeam('EN'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'L4': { type: 'league', name: 'Liga Alemana', teams: baseTeam('DE'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'L5': { type: 'league', name: 'Liga Holandesa', teams: baseTeam('NL'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'L6': { type: 'league', name: 'Liga Francesa', teams: baseTeam('FR'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'L7': { type: 'league', name: 'Miscelánea', teams: baseTeam('MI'), matchday: 0, history: [], userTeamId: 1, showWinner: false, disqualified: false },
      'C1': { type: 'cup', name: 'Champions League', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null, disqualified: false },
      'C2': { type: 'cup', name: 'Copa del Mundo', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null, disqualified: false }
    };
  });

  const activeComp = comps[activeCompId];
  const updateActiveComp = (newData) => setComps(prev => ({ ...prev, [activeCompId]: { ...prev[activeCompId], ...newData } }));

  const archiveCompetition = (compId, compData = null) => {
    const comp = compData || comps[compId];
    if (!comp) return;

    if (archive.length > 0) {
      const compEntries = archive.filter(e => e.compId === compId);
      if (compEntries.length > 0) {
        const last = compEntries[0];
        if (last.name === comp.name && last.winner?.id === (comp.type === 'league' ? [...comp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))[0]?.id : null)) return; 
      }
    }

    let winner;
    if (comp.type === 'league') {
      winner = [...comp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))[0];
    } else {
      const final = comp.bracket?.Final?.[0] || comp.bracket?.Final;
      if (final && final.sh !== null) {
        if (final.sh > final.sa) winner = comp.teams.find(t => t.id === final.hId);
        else if (final.sa > final.sh) winner = comp.teams.find(t => t.id === final.aId);
        else winner = comp.teams.find(t => t.id === (final.penH > final.penA ? final.hId : final.aId));
      }
    }

    const entry = { id: Date.now(), compId, name: comp.name, date: new Date().toLocaleDateString(), winner, teams: comp.teams, history: comp.history, bracket: comp.bracket, groups: comp.groups, type: comp.type };
    setArchive(prev => {
      const newArchive = [entry, ...prev];
      return newArchive.slice(0, 5); 
    });
  };

  const [matchState, setMatchState] = useState(null);
  const [rolling, setRolling] = useState(false);
  const rollIntervalRef = useRef(null);

  useEffect(() => () => rollIntervalRef.current && clearInterval(rollIntervalRef.current), []);

  const startMatch = (homeId, awayId) => {
    const home = activeComp.teams.find(t => t.id === homeId);
    const away = activeComp.teams.find(t => t.id === awayId);
    if (!home || !away) return;

    const isVuelta = activeCompId === 'C1' && activeComp.matchday % 2 !== 0 && activeComp.phase !== 'Final' && activeComp.phase !== 'groups';
    let aggregate = null;
    if (isVuelta && activeComp.bracket) {
      const phaseData = activeComp.bracket[activeComp.phase];
      const matchArray = Array.isArray(phaseData) ? phaseData : (phaseData ? [phaseData] : []);
      const match = matchArray.find(m => m && m.hId === awayId && m.aId === homeId);
      if (match) aggregate = { sh: match.sa, sa: match.sh };
    }

    setMatchState({
      home, away, scoreH: 0, scoreA: 0, oppH: home.opp, oppA: away.opp, turn: 'H', phase: 'att',
      logs: ['⚽ ¡Comienza el encuentro!', aggregate ? `📊 Global de la ida: ${aggregate.sh} - ${aggregate.sa}` : 'Los equipos saltan al terreno de juego.'],
      lastDie: 1, finished: false, isKnockout: activeComp.type === 'knockout' || (activeComp.type === 'cup' && activeComp.phase !== 'groups'), penalties: null, aggregate
    });
    setCompView('playing');
  };

  const handleRoll = () => {
    if (rolling || matchState.finished) return;
    setRolling(true);
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    rollIntervalRef.current = setInterval(() => setMatchState(prev => prev ? { ...prev, lastDie: Math.floor(Math.random() * 6) + 1 } : prev), 100);

    setTimeout(() => {
      if (rollIntervalRef.current) { clearInterval(rollIntervalRef.current); rollIntervalRef.current = null; }
      const die = Math.floor(Math.random() * 6) + 1;

      setMatchState(prev => {
        if (!prev) return prev;
        
        if (prev.phase === 'penalties') {
          const isHome = prev.penalties.turn === 'H';
          const attacker = isHome ? prev.home : prev.away;
          const defender = isHome ? prev.away : prev.home;
          let { scoreH, scoreA, shotsH, shotsA, phase: penPhase = 'att' } = prev.penalties;
          let historyH = [...(prev.penalties.historyH || [])];
          let historyA = [...(prev.penalties.historyA || [])];
          let newLogs = [...prev.logs];
          let nextTurn = prev.penalties.turn;

          if (penPhase === 'att') {
            if (die <= attacker.att) {
              newLogs.unshift('🎯 ' + attacker.name + ' saca un ' + die + '. ¡Va a portería!');
              penPhase = 'gk';
            } else {
              newLogs.unshift('❌ ' + attacker.name + ' sacó un ' + die + '. El penalti se va fuera.');
              if (isHome) { historyH = [...historyH, false]; shotsH++; }
              else { historyA = [...historyA, false]; shotsA++; }
              nextTurn = isHome ? 'A' : 'H';
              penPhase = 'att';
            }
          } else {
            if (die > defender.def) {
              newLogs.unshift('⚽ ¡GOL de penalti! ' + attacker.name + ' marcó con un ' + die + '.');
              if (isHome) { historyH = [...historyH, true]; scoreH++; }
              else { historyA = [...historyA, true]; scoreA++; }
            } else {
              newLogs.unshift('🧤 ¡PARADÓN! El portero sacó un ' + die + ' y detuvo el penalti.');
              if (isHome) historyH = [...historyH, false];
              else historyA = [...historyA, false];
            }
            if (isHome) shotsH++; else shotsA++;
            nextTurn = isHome ? 'A' : 'H';
            penPhase = 'att';
          }

          let finished = false;
          if (penPhase === 'att') {
            if (shotsH >= 5 && shotsA >= 5) { if (scoreH !== scoreA && shotsH === shotsA) finished = true; }
            else if (scoreH > scoreA + (5 - shotsA) || scoreA > scoreH + (5 - shotsH)) finished = true;
          }

          if (finished) {
            newLogs.unshift('🏆 ¡Final de la tanda! Ganador: ' + (scoreH > scoreA ? prev.home.name : prev.away.name));
            return { ...prev, lastDie: die, logs: newLogs, finished: true, penalties: { scoreH, scoreA, shotsH, shotsA, finished: true, historyH, historyA } };
          }
          return { ...prev, lastDie: die, logs: newLogs, penalties: { scoreH, scoreA, shotsH, shotsA, turn: nextTurn, phase: penPhase, historyH, historyA } };
        }

        const isHome = prev.turn === 'H';
        const attacker = isHome ? prev.home : prev.away;
        const defender = isHome ? prev.away : prev.home;
        let newLogs = [...prev.logs];
        let { scoreH, scoreA, phase: newPhase } = prev;

        if (newPhase === 'att') {
          if (die <= attacker.att) { newLogs.unshift('🎯 ' + attacker.name + ' sacó un ' + die + '. ¡Va a portería!'); newPhase = 'gk'; } 
          else { newLogs.unshift('❌ ' + attacker.name + ' sacó un ' + die + '. El disparo se va fuera.'); return advanceTurn({ ...prev, lastDie: die, logs: newLogs, phase: 'att' }); }
        } else {
          if (die > defender.def) { newLogs.unshift('⚽ ¡GOOOOOOL de ' + attacker.name + '! El dado marcó ' + die + '.'); isHome ? scoreH++ : scoreA++; } 
          else { newLogs.unshift('🧤 ¡PARADÓN del portero! Sacó un ' + die + ' y evitó el gol.'); }
          return advanceTurn({ ...prev, lastDie: die, logs: newLogs, scoreH, scoreA, phase: 'att' });
        }
        return { ...prev, lastDie: die, logs: newLogs, phase: newPhase };
      });
      setRolling(false);
    }, 800);
  };

  const advanceTurn = (state) => {
    let nextOppH = state.turn === 'H' ? state.oppH - 1 : state.oppH;
    let nextOppA = state.turn === 'A' ? state.oppA - 1 : state.oppA;
    let nextTurn = state.turn === 'H' ? 'A' : 'H';
    if (nextTurn === 'H' && nextOppH <= 0) nextTurn = 'A';
    if (nextTurn === 'A' && nextOppA <= 0) nextTurn = 'H';

    if (nextOppH <= 0 && nextOppA <= 0) {
      const isChampions = activeCompId === 'C1';
      const isIda = isChampions && activeComp.matchday % 2 === 0 && activeComp.phase !== 'Final' && activeComp.phase !== 'groups';
      const isVuelta = isChampions && activeComp.matchday % 2 !== 0 && activeComp.phase !== 'Final' && activeComp.phase !== 'groups';

      let needsPenalties = state.isKnockout && state.scoreH === state.scoreA && !isIda && !isVuelta;
      if (isVuelta && state.aggregate) if (state.aggregate.sh + state.scoreH === state.aggregate.sa + state.scoreA) needsPenalties = true;

      if (needsPenalties) return { ...state, oppH: 0, oppA: 0, phase: 'penalties', penalties: { scoreH: 0, scoreA: 0, turn: 'H', shotsH: 0, shotsA: 0, phase: 'att', finished: false, historyH: [], historyA: [] }, logs: ['⚖️ ¡Empate global! Nos vamos a la tanda de penaltis.', ...state.logs] };
      return { ...state, oppH: 0, oppA: 0, finished: true, logs: ['🏁 Final del partido.', ...state.logs] };
    }
    return { ...state, oppH: nextOppH, oppA: nextOppA, turn: nextTurn, phase: 'att' };
  };

  const processMatchday = () => {
    if (activeComp.type === 'league') {
      const schedule = generateLeagueSchedule(activeComp.teams);
      const currentRound = Array.isArray(schedule) ? schedule[activeComp.matchday] : [];
      const results = Array.isArray(currentRound) ? currentRound.map(m => {
        if (m.homeId === activeComp.userTeamId || m.awayId === activeComp.userTeamId) return { hId: m.homeId, aId: m.awayId, sh: matchState.scoreH, sa: matchState.scoreA, penH: undefined, penA: undefined };
        const h = activeComp.teams.find(t => t.id === m.homeId);
        const a = activeComp.teams.find(t => t.id === m.awayId);
        let sh = 0, sa = 0;
        for(let i=0; i<(h?.opp || 0); i++) if(Math.floor(Math.random()*6)+1 <= (h?.att || 0) && Math.floor(Math.random()*6)+1 > (a?.def || 0)) sh++;
        for(let i=0; i<(a?.opp || 0); i++) if(Math.floor(Math.random()*6)+1 <= (a?.att || 0) && Math.floor(Math.random()*6)+1 > (h?.def || 0)) sa++;
        return { hId: m.homeId, aId: m.awayId, sh, sa, penH: undefined, penA: undefined };
      }) : [];

      const updatedTeams = Array.isArray(activeComp.teams) ? activeComp.teams.map(t => {
        const res = results.find(r => r.hId === t.id || r.aId === t.id);
        if (!res) return t;
        const isHome = res.hId === t.id;
        const gf = isHome ? res.sh : res.sa;
        const ga = isHome ? res.sa : res.sh;
        const w = gf > ga ? 1 : 0; const d = gf === ga ? 1 : 0; const l = gf < ga ? 1 : 0;
        return { ...t, p: t.p + 1, w: t.w + w, d: t.d + d, l: t.l + l, gf: t.gf + gf, ga: t.ga + ga, pts: t.pts + (w * 3 + d) };
      }) : [];

      const isFinished = activeComp.matchday === schedule.length - 1;
      const updatedComp = { teams: updatedTeams, history: [{ day: activeComp.matchday + 1, results }, ...activeComp.history], matchday: isFinished ? activeComp.matchday : activeComp.matchday + 1, showWinner: isFinished };
      updateActiveComp(updatedComp);
      if (isFinished) archiveCompetition(activeCompId, { ...activeComp, ...updatedComp });

    } else if (activeComp.type === 'cup' || activeComp.type === 'knockout') {
      const results = [{ hId: matchState.home.id, aId: matchState.away.id, sh: matchState.scoreH, sa: matchState.scoreA, penH: matchState.penalties?.scoreH, penA: matchState.penalties?.scoreA }];

      if (activeComp.phase === 'groups') {
        const isWorldCup = activeCompId === 'C2';
        const maxMatchdays = isWorldCup ? 3 : 6;

        activeComp.groups.forEach(group => {
          const groupTeams = activeComp.teams.filter(t => group.teamIds.includes(t.id));
          const currentRound = generateLeagueSchedule(groupTeams, !isWorldCup)[activeComp.matchday % maxMatchdays];
          if (currentRound) {
            currentRound.forEach(m => {
              if (m.homeId !== activeComp.userTeamId && m.awayId !== activeComp.userTeamId) {
                const h = activeComp.teams.find(t => t.id === m.homeId); const a = activeComp.teams.find(t => t.id === m.awayId);
                let sh = 0, sa = 0;
                for(let i=0; i<h.opp; i++) if(Math.floor(Math.random()*6)+1 <= h.att && Math.floor(Math.random()*6)+1 > a.def) sh++;
                for(let i=0; i<a.opp; i++) if(Math.floor(Math.random()*6)+1 <= a.att && Math.floor(Math.random()*6)+1 > h.def) sa++;
                results.push({ hId: m.homeId, aId: m.awayId, sh, sa, penH: undefined, penA: undefined });
              }
            });
          }
        });

        const updatedTeams = activeComp.teams.map(t => {
          const res = results.find(r => r.hId === t.id || r.aId === t.id);
          if (!res) return t;
          const isHome = res.hId === t.id;
          const gf = isHome ? res.sh : res.sa; const ga = isHome ? res.sa : res.sh;
          const w = gf > ga ? 1 : 0; const d = gf === ga ? 1 : 0; const l = gf < ga ? 1 : 0;
          return { ...t, p: t.p + 1, w: t.w + w, d: t.d + d, l: t.l + l, gf: t.gf + gf, ga: t.ga + ga, pts: t.pts + (w * 3 + d) };
        });

        const nextMatchday = activeComp.matchday + 1;
        const isEndOfGroups = nextMatchday >= maxMatchdays;
        let newBracket = null, isUserDisqualified = false;

        if (isEndOfGroups) {
          newBracket = generateKnockoutBrackets({ ...activeComp, teams: updatedTeams });
          const allTeamsInBracket = [...(newBracket.Octavos || []), ...(newBracket.Cuartos || []), ...(newBracket.Semis || []), ...(newBracket.Final || [])].flatMap(m => [m.hId, m.aId]).filter(id => id !== null);
          if (!allTeamsInBracket.includes(activeComp.userTeamId)) isUserDisqualified = true;
        }
        updateActiveComp({ teams: updatedTeams, history: [{ day: 'Jornada ' + nextMatchday, results }, ...activeComp.history], matchday: nextMatchday, phase: isEndOfGroups ? (newBracket.Octavos ? 'Octavos' : 'Cuartos') : 'groups', bracket: newBracket, disqualified: isUserDisqualified });

      } else {
        const isChampions = activeCompId === 'C1';
        const phase = activeComp.phase;
        const isVuelta = isChampions && activeComp.matchday % 2 !== 0 && phase !== 'Final';
        const newBracket = { ...activeComp.bracket };
        const currentMatches = newBracket[phase];
        const allResults = [];
        const matchesToProcess = Array.isArray(currentMatches) ? currentMatches : [currentMatches];

        matchesToProcess.forEach(m => {
          let sh, sa, penH, penA;
          if (m.hId === matchState.home.id && m.aId === matchState.away.id) {
            sh = matchState.scoreH; sa = matchState.scoreA; penH = matchState.penalties?.scoreH; penA = matchState.penalties?.scoreA;
          } else if (isVuelta && m.hId === matchState.away.id && m.aId === matchState.home.id) {
            sh = matchState.scoreA; sa = matchState.scoreH; penH = matchState.penalties?.scoreA; penA = matchState.penalties?.scoreH; 
          } else {
            const h = activeComp.teams.find(t => t.id === (isVuelta ? m.aId : m.hId));
            const a = activeComp.teams.find(t => t.id === (isVuelta ? m.hId : m.aId));
            let simH = 0, simA = 0;
            for(let i=0; i<h.opp; i++) if(Math.floor(Math.random()*6)+1 <= h.att && Math.floor(Math.random()*6)+1 > a.def) simH++;
            for(let i=0; i<a.opp; i++) if(Math.floor(Math.random()*6)+1 <= a.att && Math.floor(Math.random()*6)+1 > h.def) simA++;

            if (isVuelta) { sh = simA; sa = simH; } else { sh = simH; sa = simA; }

            const isDraw = (isChampions && isVuelta && phase !== 'Final') ? (m.sh + sh === m.sa + sa) : (sh === sa);
            if (isDraw && (!isChampions || isVuelta || phase === 'Final')) {
              let simPenH = 0; let simPenA = 0;
              let shotsH = 0; let shotsA = 0;
              const h_orig = activeComp.teams.find(t => t.id === m.hId);
              const a_orig = activeComp.teams.find(t => t.id === m.aId);
              const simPen = (att, def) => (Math.floor(Math.random() * 6) + 1 <= att && Math.floor(Math.random() * 6) + 1 > def);

              for (let i = 0; i < 5; i++) {
                if (simPen(h_orig.att, a_orig.def)) simPenH++;
                shotsH++;
                if (simPenH > simPenA + (5 - shotsA) || simPenA > simPenH + (5 - shotsH)) break;
                if (simPen(a_orig.att, h_orig.def)) simPenA++;
                shotsA++;
                if (simPenH > simPenA + (5 - shotsA) || simPenA > simPenH + (5 - shotsH)) break;
              }
              while (simPenH === simPenA) { if (simPen(h_orig.att, a_orig.def)) simPenH++; if (simPen(a_orig.att, h_orig.def)) simPenA++; }
              penH = simPenH; penA = simPenA;
            }
          }
          if (isVuelta) { m.sh2 = sh; m.sa2 = sa; } else { m.sh = sh; m.sa = sa; }
          if (penH !== undefined) { m.penH = penH; m.penA = penA; }
          allResults.push(isVuelta ? { hId: m.aId, aId: m.hId, sh: sa, sa: sh, penH: penA, penA: penH } : { hId: m.hId, aId: m.aId, sh, sa, penH, penA });
        });

        let nextPhase = phase, showWinner = false, isUserDisqualified = activeComp.disqualified || false;

        if (!isChampions || isVuelta || phase === 'Final') {
          const winners = matchesToProcess.map(m => {
            const totH = isChampions && phase !== 'Final' ? m.sh + m.sh2 : m.sh;
            const totA = isChampions && phase !== 'Final' ? m.sa + m.sa2 : m.sa;
            if (totH > totA) return m.hId; if (totA > totH) return m.aId;
            return m.penH > m.penA ? m.hId : m.aId;
          });
          if (!winners.includes(activeComp.userTeamId)) isUserDisqualified = true;

          if (phase === 'Octavos') { nextPhase = 'Cuartos'; newBracket.Cuartos = Array(4).fill(0).map((_, i) => ({ id: 'C'+(i+1), hId: winners[i*2], aId: winners[i*2+1], sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null })); } 
          else if (phase === 'Cuartos') { nextPhase = 'Semis'; newBracket.Semis = Array(2).fill(0).map((_, i) => ({ id: 'S'+(i+1), hId: winners[i*2], aId: winners[i*2+1], sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null })); } 
          else if (phase === 'Semis') { nextPhase = 'Final'; newBracket.Final = [{ id: 'F1', hId: winners[0], aId: winners[1], sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null }]; } 
          else { nextPhase = 'Terminado'; showWinner = true; }
        }

        const updatedComp = { history: [{ day: phase + (isChampions ? (isVuelta ? ' (Vuelta)' : ' (Ida)') : ''), results: allResults }, ...activeComp.history], matchday: activeComp.matchday + 1, phase: nextPhase, bracket: newBracket, showWinner, disqualified: isUserDisqualified };
        updateActiveComp(updatedComp);
        if (showWinner) archiveCompetition(activeCompId, { ...activeComp, ...updatedComp });
      }
    }
    setCompView('main');
  };

  const resetCompetition = (compId) => {
    setComps(prev => {
      const comp = prev[compId]; if (!comp) return prev;
      let newTeams = Array.isArray(comp.teams) ? comp.teams.map(t => ({ ...t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 })) : [];
      if (comp.type === 'league') {
        const pres = compId === 'L1' ? 'ES' : compId === 'L2' ? 'IT' : compId === 'L3' ? 'EN' : compId === 'L4' ? 'DE' : compId === 'L5' ? 'NL' : compId === 'L6' ? 'FR' : 'MI';
        if (PRESETS[pres]) newTeams = PRESETS[pres].map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
      }
      return { ...prev, [compId]: { ...comp, teams: newTeams, matchday: 0, history: [], phase: comp.type === 'league' ? 'league' : 'groups', showWinner: false, disqualified: false, bracket: null } };
    });
    setCompView('main');
  };

  const CompetitionView = () => {
    if (!activeComp) return null;
    const hasStarted = activeComp.matchday > 0 || activeComp.history?.length > 0;

    if (!activeComp.teams || activeComp.teams.length === 0) {
      return (
        <div className='flex-grow flex flex-col items-center justify-center text-center p-8'>
          <div className='w-24 h-24 bg-slate-900/30 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl'><Trophy size={48} className='text-slate-400' /></div>
          <h2 className='text-3xl font-black italic uppercase mb-2 text-white drop-shadow-md'>{activeComp?.name}</h2>
          <p className='text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-10 drop-shadow-md'>Esta competición aún no ha sido configurada.</p>
          <div className='space-y-4 w-full max-w-xs'>
            <button onClick={() => updateActiveComp(getAutoFillData(activeCompId))} className='w-full bg-blue-600/80 backdrop-blur-md hover:bg-blue-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2'>
              <Wand2 size={16}/> Auto-Rellenar
            </button>
            <button onClick={() => updateActiveComp(getShuffleData(activeCompId))} className='w-full bg-emerald-600/80 backdrop-blur-md hover:bg-emerald-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2'>
              <Shuffle size={16}/> Sorteo Dinámico
            </button>
            <button onClick={() => setView('hub')} className='w-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-slate-200 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest transition-all active:scale-95'>Volver al Inicio</button>
          </div>
        </div>
      );
    }

    const sortedTeams = [...activeComp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const userTeam = activeComp.teams.find(t => t.id === activeComp.userTeamId) || activeComp.teams[0];

    const winner = useMemo(() => {
      if (!activeComp.teams || activeComp.teams.length === 0) return null;
      if (activeComp.type === 'league') return [...activeComp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))[0];
      const final = activeComp.bracket?.Final?.[0] || activeComp.bracket?.Final;
      if (final && final.sh !== null) {
        if (final.sh > final.sa) return activeComp.teams.find(t => t.id === final.hId);
        if (final.sa > final.sh) return activeComp.teams.find(t => t.id === final.aId);
        return activeComp.teams.find(t => t.id === (final.penH > final.penA ? final.hId : final.aId));
      }
      return activeComp.teams[0];
    }, [activeComp]);

    useEffect(() => {
      if (activeComp && activeComp.phase !== 'groups' && !activeComp.bracket) {
        const newBracket = generateKnockoutBrackets(activeComp);
        if (newBracket) updateActiveComp({ bracket: newBracket });
      }
    }, [activeComp?.phase, activeComp?.bracket]);

    const getGroupMatch = () => {
      if (!activeComp.teams || activeComp.teams.length === 0) return null;
      if (activeComp.type === 'league') return (generateLeagueSchedule(activeComp.teams)[activeComp.matchday] || []).find(m => m.homeId === userTeam.id || m.awayId === userTeam.id);
      
      if (activeComp.phase === 'groups' && activeComp.groups) {
        const isWC = activeCompId === 'C2';
        const group = activeComp.groups.find(g => g.teamIds.includes(userTeam.id));
        if (group) return (generateLeagueSchedule(activeComp.teams.filter(t => group.teamIds.includes(t.id)), !isWC)[activeComp.matchday % (isWC ? 3 : 6)] || []).find(m => m.homeId === userTeam.id || m.awayId === userTeam.id);
        for (const g of activeComp.groups) {
          const m = (generateLeagueSchedule(activeComp.teams.filter(t => g.teamIds.includes(t.id)), !isWC)[activeComp.matchday % (isWC ? 3 : 6)] || [])[0];
          if (m) return m;
        }
      } else if (activeComp.bracket) {
        const matchArray = Array.isArray(activeComp.bracket[activeComp.phase]) ? activeComp.bracket[activeComp.phase] : [activeComp.bracket[activeComp.phase]];
        const isVuelta = activeCompId === 'C1' && activeComp.matchday % 2 !== 0 && activeComp.phase !== 'Final';
        const userMatch = matchArray.find(m => m && (m.hId === userTeam.id || m.aId === userTeam.id));
        if (userMatch) return (isVuelta && userMatch.sh2 === null) || (!isVuelta && userMatch.sh === null) ? userMatch : null;
        return matchArray.find(m => m && (isVuelta ? m.sh2 === null : m.sh === null));
      }
      return null;
    };

    const currentMatch = getGroupMatch();
    let homeId = currentMatch?.homeId || currentMatch?.hId;
    let awayId = currentMatch?.awayId || currentMatch?.aId;

    if (activeCompId === 'C1' && activeComp.matchday % 2 !== 0 && activeComp.phase !== 'Final' && activeComp.phase !== 'groups' && currentMatch?.hId) {
      const temp = homeId; homeId = awayId; awayId = temp;
    }

    const homeTeam = activeComp.teams.find(t => t.id === homeId);
    const awayTeam = activeComp.teams.find(t => t.id === awayId);
    
    const getRemainingTeams = () => {
      if (activeComp.phase === 'groups' || !activeComp.bracket || !activeComp.bracket[activeComp.phase]) return activeComp.teams;
      const matchArray = Array.isArray(activeComp.bracket[activeComp.phase]) ? activeComp.bracket[activeComp.phase] : [activeComp.bracket[activeComp.phase]];
      const teamIds = matchArray.flatMap(m => [m?.hId, m?.aId]).filter(id => id !== null);
      return activeComp.teams.filter(t => teamIds.includes(t.id));
    };

    const remainingTeams = getRemainingTeams();

    if (compView === 'config') return (
      <ConfigPanel 
        initialComp={activeComp} 
        compId={activeCompId} 
        hasStarted={hasStarted}
        onSave={(draftData) => {
          updateActiveComp(draftData);
          setCompView('main');
        }}
        onCancel={() => setCompView('main')}
      />
    );

    if (compView === 'main') return (
      <div className='flex-grow px-4 pb-20 relative'>
        <AnimatePresence>
          {activeComp.showWinner && compView === 'main' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md'>
              <Confetti />
              <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className='bg-slate-900/90 backdrop-blur-xl w-full max-w-sm rounded-[3.5rem] border border-yellow-500/30 p-8 shadow-2xl shadow-yellow-500/10 text-center relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent' />
                <Trophy size={64} className='text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]' />
                <h2 className='text-3xl font-black italic uppercase mb-2 tracking-tighter'>¡CAMPEÓN!</h2>
                <div className='my-8 flex flex-col items-center'>
                  <Shield color1={winner?.color1} color2={winner?.color2} initial={winner?.name} size='lg' isFlag={winner?.isFlag} />
                  <h3 className='text-xl font-black uppercase italic mt-4 text-white'>{winner?.name}</h3>
                  <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1'>Ha conquistado la {activeComp.name}</p>
                </div>
                
                <button onClick={() => resetCompetition(activeCompId)} className='w-full bg-yellow-500 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all mb-4'>Nueva Temporada</button>
                
                <div className='flex gap-2 w-full'>
                  <button onClick={() => setCompView('stats')} className='flex-1 bg-slate-800/80 border border-white/10 py-3 rounded-2xl flex flex-col items-center hover:bg-slate-700 active:scale-95 transition-all text-emerald-400'>
                    <BarChart3 size={16} className="mb-1"/>
                    <span className="text-[8px] font-black uppercase italic">Stats</span>
                  </button>
                  <button onClick={() => setCompView('results')} className='flex-1 bg-slate-800/80 border border-white/10 py-3 rounded-2xl flex flex-col items-center hover:bg-slate-700 active:scale-95 transition-all text-yellow-400'>
                    <History size={16} className="mb-1"/>
                    <span className="text-[8px] font-black uppercase italic">Result.</span>
                  </button>
                  {activeComp.type !== 'league' && (
                    <button onClick={() => setCompView('bracket')} className='flex-1 bg-slate-800/80 border border-white/10 py-3 rounded-2xl flex flex-col items-center hover:bg-slate-700 active:scale-95 transition-all text-purple-400'>
                      <Swords size={16} className="mb-1"/>
                      <span className="text-[8px] font-black uppercase italic">Llaves</span>
                    </button>
                  )}
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeComp.disqualified && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md'>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className='bg-slate-900/90 backdrop-blur-xl w-full max-w-sm rounded-[3rem] border border-red-500/30 p-8 shadow-2xl shadow-red-500/10'>
                <div className='w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6'><ShieldIcon size={40} /></div>
                <h2 className='text-2xl font-black italic uppercase text-center mb-2'>¡Descalificado!</h2>
                <p className='text-[10px] text-slate-400 font-bold uppercase text-center mb-8 tracking-widest'>Tu equipo ha sido eliminado de la competición. Selecciona un nuevo equipo para seguir jugando.</p>
                <div className='max-h-60 overflow-y-auto pr-2 space-y-2 mb-8 custom-scrollbar'>
                  {remainingTeams.map(t => (
                    <button key={t.id} onClick={() => updateActiveComp({ userTeamId: t.id, disqualified: false })} className='w-full flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-95 group'>
                      <Shield color1={t.color1} color2={t.color2} initial={t.name} size='sm' isFlag={t.isFlag} />
                      <span className='text-xs font-black uppercase italic flex-grow text-left group-hover:text-blue-400'>{t.name}</span>
                      <ArrowRight size={14} className='text-slate-500 group-hover:text-blue-400' />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className='flex items-center gap-3 mb-6'>
          <button onClick={() => setView('hub')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl text-slate-200 border border-white/10 active:scale-95 transition-all'><ChevronLeft /></button>
          <div className='flex-grow'>
            <h2 className='text-xl font-black italic uppercase truncate drop-shadow-md'>{activeComp?.name}</h2>
            {activeComp.type !== 'league' && <span className='text-[8px] font-black text-blue-300 uppercase tracking-widest drop-shadow-md'>Fase: {activeComp.phase}</span>}
          </div>
        </header>

        <div className='grid grid-cols-4 gap-2 mb-6 bg-slate-900/30 p-3 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-lg'>
           <MenuButton icon={<BarChart3 size={18} className='text-emerald-400'/>} label="Stats" onClick={() => setCompView('stats')} />
           <MenuButton icon={<Calendar size={18} className='text-blue-400'/>} label="Fechas" onClick={() => setCompView('calendar')} />
           <MenuButton icon={<History size={18} className='text-yellow-400'/>} label="Result." onClick={() => setCompView('results')} />
           {activeComp.type !== 'league' ? (
             <MenuButton icon={<Swords size={18} className='text-purple-400'/>} label="Llaves" onClick={() => setCompView('bracket')} />
           ) : (
             <MenuButton icon={<Users size={18} className='text-indigo-400'/>} label="Equipo" onClick={() => setCompView('teamSelect')} />
           )}
           
           <MenuButton icon={<Settings size={16} className='text-slate-300'/>} label="Ajustes" onClick={() => setCompView('config')} isWide />
           <MenuButton icon={<RotateCcw size={16}/>} label="Reset" onClick={() => resetCompetition(activeCompId)} isDanger isWide />
           {activeComp.type !== 'league' && <MenuButton icon={<Users size={16} className='text-indigo-400'/>} label="Mi Equipo" onClick={() => setCompView('teamSelect')} isWide />}
        </div>

        {activeComp.type !== 'league' && activeComp.phase === 'groups' && Array.isArray(activeComp.groups) && (
          <div className='grid grid-cols-1 gap-6 mb-8'>
            {activeComp.groups.map((group, gi) => (
              <section key={gi} className='bg-slate-900/30 backdrop-blur-md rounded-[2rem] p-4 border border-white/10 shadow-lg'>
                <h3 className='text-[10px] font-black uppercase text-blue-400 mb-3 flex items-center gap-2 drop-shadow-md'><ShieldIcon size={12} /> {group?.name}</h3>
                <div className='space-y-1.5'>
                  {activeComp.teams.filter(t => group.teamIds.includes(t.id)).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)).map((t, i) => (
                    <div key={t.id} className={'flex items-center gap-3 p-2 rounded-xl ' + (t.id === activeComp.userTeamId ? 'bg-blue-600/40 border border-blue-400/50 shadow-inner' : 'bg-black/30')}>
                      <span className='text-[10px] font-black text-slate-300 italic w-4'>{i+1}</span>
                      <Shield color1={t.color1} color2={t.color2} initial={t.name} size='sm' isFlag={t.isFlag} />
                      <span className='text-[11px] font-bold uppercase truncate flex-grow italic text-white drop-shadow-sm'>{t.name}</span>
                      <span className='text-[10px] font-black bg-slate-800/60 px-2 py-0.5 rounded-md text-emerald-400 border border-white/10'>{t.pts} PTS</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeComp.type === 'league' && (
          <section className='bg-slate-900/30 backdrop-blur-md rounded-[2rem] p-4 border border-white/10 mb-6 shadow-lg'>
            <h3 className='text-[10px] font-black uppercase text-slate-200 mb-3 flex items-center gap-2 drop-shadow-md'><BarChart3 size={12} /> Top Clasificación</h3>
            <div className='space-y-1.5'>
              {sortedTeams.slice(0, 6).map((t, i) => (
                <div key={t.id} className={'flex items-center gap-3 p-2 rounded-xl ' + (t.id === activeComp.userTeamId ? 'bg-blue-600/40 border border-blue-400/50 shadow-inner' : 'bg-black/30')}>
                  <span className='text-[10px] font-black text-slate-300 italic w-4'>{i+1}</span>
                  <Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='sm' isFlag={t?.isFlag} />
                  <span className='text-[11px] font-bold uppercase truncate flex-grow italic text-white drop-shadow-sm'>{t?.name}</span>
                  <span className='text-[10px] font-black bg-slate-800/60 px-2 py-0.5 rounded-md text-emerald-400 border border-white/10'>{t.pts} PTS</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!activeComp.showWinner && currentMatch && (
          <section className='bg-gradient-to-br from-blue-700/80 to-indigo-900/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden border border-white/20'>
            <div className='flex justify-between items-center mb-6'>
              <div className='text-center w-24'>
                <Shield color1={homeTeam?.color1} color2={homeTeam?.color2} initial={homeTeam?.name} size='lg' isFlag={homeTeam?.isFlag} />
                <p className='mt-2 text-[10px] font-black uppercase italic truncate text-white drop-shadow-sm'>{homeTeam?.name}</p>
                {homeTeam?.id === userTeam?.id && <span className='text-[7px] font-black bg-white/30 px-1.5 py-0.5 rounded uppercase backdrop-blur-sm'>Tu Equipo</span>}
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-xs font-black text-white/70 italic mb-1 drop-shadow-sm'>VS</span>
                <div className='w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse border border-white/30 shadow-inner'><Play size={20} className='ml-1 text-white' /></div>
              </div>
              <div className='text-center w-24'>
                <Shield color1={awayTeam?.color1} color2={awayTeam?.color2} initial={awayTeam?.name} size='lg' isFlag={awayTeam?.isFlag} />
                <p className='mt-2 text-[10px] font-black uppercase italic truncate text-white drop-shadow-sm'>{awayTeam?.name}</p>
                {awayTeam?.id === userTeam?.id && <span className='text-[7px] font-black bg-white/30 px-1.5 py-0.5 rounded uppercase backdrop-blur-sm'>Tu Equipo</span>}
              </div>
            </div>
            <button onClick={() => startMatch(homeId, awayId)} className='w-full bg-white/95 text-blue-900 py-4 rounded-2xl text-xs font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center'>
              <span>{activeComp.phase === 'Final' ? 'Gran Final' : ('Jugar ' + (activeComp.type === 'league' || activeComp.phase === 'groups' ? 'Jornada ' + (activeComp.matchday + 1) : activeComp.phase + (activeCompId === 'C1' ? (activeComp.matchday % 2 === 0 ? ' (Ida)' : ' (Vuelta)') : '')))}</span>
              <span className='text-[7px] opacity-60 mt-0.5 tracking-normal'>{homeTeam?.opp} vs {awayTeam?.opp} TIROS DISPONIBLES</span>
            </button>
          </section>
        )}
      </div>
    );

    if (compView === 'stats') return (
      <div className='flex-grow px-4 pb-20'>
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Estadísticas</h2>
        </div>

        {activeComp.type === 'league' ? (
          <div className='bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-x-auto custom-scrollbar relative shadow-xl'>
            <table className='w-full text-left border-collapse min-w-[550px]'>
              <thead className='bg-[#0f172a] sticky top-0 z-50 shadow-md'>
                <tr className='text-[8px] font-black uppercase italic text-slate-400'>
                  <th className='p-3 sticky z-50 bg-[#0f172a]' style={{ left: 0, minWidth: '40px' }}>Pos</th>
                  <th className='p-3 sticky z-50 bg-[#0f172a]' style={{ left: '40px', minWidth: '130px' }}>Equipo</th>
                  <th className='p-3 sticky z-50 bg-[#0f172a] text-center border-r border-white/10' style={{ left: '170px', minWidth: '40px' }}>PJ</th>
                  <th className='p-3 text-center'>G</th><th className='p-3 text-center'>E</th><th className='p-3 text-center'>P</th><th className='p-3 text-center'>GF</th><th className='p-3 text-center'>GC</th><th className='p-3 text-center'>DG</th><th className='p-3 text-center text-emerald-400'>Pts</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {Array.isArray(sortedTeams) && sortedTeams.map((t, i) => (
                  <tr key={t.id} className={t.id === activeComp.userTeamId ? 'bg-blue-600/30' : ''}>
                    <td className='p-3 text-[10px] font-black italic text-slate-300 sticky z-40 bg-[#0f172a]' style={{ left: 0 }}>{i+1}</td>
                    <td className='p-3 flex items-center gap-2 sticky z-40 bg-[#0f172a]' style={{ left: '40px', minWidth: '130px' }}><Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='xs' isFlag={t?.isFlag} /><span className='text-[10px] font-bold uppercase truncate italic max-w-[80px]'>{t?.name}</span></td>
                    <td className='p-3 text-center text-[10px] font-bold sticky z-40 bg-[#0f172a] border-r border-white/10' style={{ left: '170px' }}>{t.p}</td>
                    <td className='p-3 text-center text-[10px] font-bold'>{t.w}</td><td className='p-3 text-center text-[10px] font-bold'>{t.d}</td><td className='p-3 text-center text-[10px] font-bold'>{t.l}</td><td className='p-3 text-center text-[10px] font-bold'>{t.gf}</td><td className='p-3 text-center text-[10px] font-bold'>{t.ga}</td><td className='p-3 text-center text-[10px] font-bold'>{t.gf - t.ga}</td><td className='p-3 text-center text-[10px] font-black text-emerald-400'>{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='space-y-8'>
            {(activeComp.groups || []).map((group, gi) => (
              <div key={gi} className='bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-x-auto custom-scrollbar relative shadow-xl'>
                <div className='bg-[#0f172a] p-3 border-b border-white/10 sticky left-0 z-50'><h3 className='text-[10px] font-black uppercase text-blue-400 flex items-center gap-2'><ShieldIcon size={12} /> {group.name}</h3></div>
                <table className='w-full text-left border-collapse min-w-[550px]'>
                  <thead className='bg-[#0f172a] sticky top-0 z-50'>
                    <tr className='text-[8px] font-black uppercase italic text-slate-400'>
                      <th className='p-3 sticky z-50 bg-[#0f172a]' style={{ left: 0, minWidth: '40px' }}>Pos</th>
                      <th className='p-3 sticky z-50 bg-[#0f172a]' style={{ left: '40px', minWidth: '130px' }}>Equipo</th>
                      <th className='p-3 sticky z-50 bg-[#0f172a] text-center border-r border-white/10' style={{ left: '170px', minWidth: '40px' }}>PJ</th>
                      <th className='p-3 text-center'>G</th><th className='p-3 text-center'>E</th><th className='p-3 text-center'>P</th><th className='p-3 text-center'>GF</th><th className='p-3 text-center'>GC</th><th className='p-3 text-center'>DG</th><th className='p-3 text-center text-emerald-400'>Pts</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-white/5'>
                    {Array.isArray(activeComp.teams) && activeComp.teams.filter(t => Array.isArray(group.teamIds) && group.teamIds.includes(t.id)).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)).map((t, i) => (
                      <tr key={t.id} className={t.id === activeComp.userTeamId ? 'bg-blue-600/30' : ''}>
                        <td className='p-3 text-[10px] font-black italic text-slate-300 sticky z-40 bg-[#0f172a]' style={{ left: 0 }}>{i+1}</td>
                        <td className='p-3 flex items-center gap-2 sticky z-40 bg-[#0f172a]' style={{ left: '40px', minWidth: '130px' }}><Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='xs' isFlag={t?.isFlag} /><span className='text-[10px] font-bold uppercase truncate italic max-w-[80px]'>{t?.name}</span></td>
                        <td className='p-3 text-center text-[10px] font-bold sticky z-40 bg-[#0f172a] border-r border-white/10' style={{ left: '170px' }}>{t.p}</td>
                        <td className='p-3 text-center text-[10px] font-bold'>{t.w}</td><td className='p-3 text-center text-[10px] font-bold'>{t.d}</td><td className='p-3 text-center text-[10px] font-bold'>{t.l}</td><td className='p-3 text-center text-[10px] font-bold'>{t.gf}</td><td className='p-3 text-center text-[10px] font-bold'>{t.ga}</td><td className='p-3 text-center text-[10px] font-bold'>{t.gf - t.ga}</td><td className='p-3 text-center text-[10px] font-black text-emerald-400'>{t.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (compView === 'results') return (
      <div className='flex-grow px-4 pb-20'>
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Resultados</h2>
        </div>
        <div className='space-y-4'>
          {(!Array.isArray(activeComp.history) || activeComp.history.length === 0) && <div className='text-center py-20 text-slate-300 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/5 italic font-bold uppercase text-[10px] shadow-lg'>No hay partidos jugados aún.</div>}
          {Array.isArray(activeComp.history) && activeComp.history.map((h, i) => (
            <div key={i} className='bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-lg'>
              <h3 className='text-[9px] font-black uppercase text-blue-300 mb-3 drop-shadow-md'>{h.day}</h3>
              <div className='space-y-2'>
                {Array.isArray(h.results) && h.results.map((r, ri) => {
                  const home = Array.isArray(activeComp.teams) ? activeComp.teams.find(t => t.id === r.hId) : null;
                  const away = Array.isArray(activeComp.teams) ? activeComp.teams.find(t => t.id === r.aId) : null;
                  return (
                    <div key={ri} className='flex items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/5'>
                      <div className='flex items-center gap-2 w-24'><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag} /><span className='text-[9px] font-bold uppercase truncate italic'>{home?.name}</span></div>
                      <div className='bg-slate-800/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-black italic tabular-nums flex flex-col items-center border border-white/10'>
                        <span>{r.sh} - {r.sa}</span>
                        {r.penH !== undefined && r.penA !== undefined && <span className='text-[7px] text-blue-300 mt-0.5'>(pen {r.penH}-{r.penA})</span>}
                      </div>
                      <div className='flex items-center gap-2 w-24 justify-end'><span className='text-[9px] font-bold uppercase truncate italic'>{away?.name}</span><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (compView === 'calendar') return (
      <div className='flex-grow px-4 pb-20'>
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Calendario</h2>
        </div>
        <div className='space-y-4'>
          {activeComp.type === 'league' ? (
            (() => {
              const rounds = generateLeagueSchedule(activeComp.teams).map((round, ri) => ({ round, ri }));
              return [...rounds.filter(r => r.ri === activeComp.matchday), ...rounds.filter(r => r.ri > activeComp.matchday), ...rounds.filter(r => r.ri < activeComp.matchday).reverse()];
            })().map(({ round, ri }) => (
              <div key={ri} className={'bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-lg ' + (ri === activeComp.matchday ? 'ring-2 ring-blue-500/50' : 'opacity-80')}>
                <div className='flex justify-between items-center mb-3'>
                  <h3 className='text-[9px] font-black uppercase text-slate-300'>Jornada {ri + 1} {ri === activeComp.matchday && '(Actual)'}</h3>
                  <span className={'text-[7px] font-black uppercase px-2 py-0.5 rounded-full ' + (ri < activeComp.matchday ? 'bg-emerald-500/30 text-emerald-300' : ri === activeComp.matchday ? 'bg-blue-500/40 text-blue-200' : 'bg-slate-800/80 text-slate-300')}>{ri < activeComp.matchday ? 'Finalizado' : ri === activeComp.matchday ? 'En Curso' : 'Próximo'}</span>
                </div>
                <div className='space-y-2'>
                  {round.map((m, mi) => {
                    const home = activeComp.teams.find(t => t.id === m.homeId); const away = activeComp.teams.find(t => t.id === m.awayId);
                    const result = activeComp.history.find(h => h.day === 'Jornada ' + (ri + 1))?.results.find(r => (r.hId === m.homeId && r.aId === m.awayId) || (r.hId === m.awayId && r.aId === m.homeId));
                    return (
                      <div key={mi} className='flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5'>
                        <div className='flex items-center gap-2 w-24'><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag} /><span className='text-[9px] font-bold uppercase truncate italic'>{home?.name}</span></div>
                        <div className='flex flex-col items-center'>{result ? <span className='text-[10px] font-black tabular-nums bg-slate-800/60 px-2 py-0.5 rounded'>{result.sh} - {result.sa}</span> : <span className='text-[8px] font-black text-slate-400 italic'>VS</span>}</div>
                        <div className='flex items-center gap-2 w-24 justify-end'><span className='text-[9px] font-bold uppercase truncate italic'>{away?.name}</span><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className='space-y-8'>
              {(activeComp.groups || []).length > 0 && (
                <div className='space-y-6'>
                  <h2 className='text-xs font-black uppercase text-slate-200 border-b border-white/20 pb-2 drop-shadow-md'>Fase de Grupos</h2>
                  {(activeComp.groups || []).map((group, gi) => {
                    const groupTeams = activeComp.teams.filter(t => group.teamIds.includes(t.id));
                    const isWorldCup = activeCompId === 'C2';
                    const groupSchedule = generateLeagueSchedule(groupTeams, !isWorldCup);
                    const maxMatchdays = isWorldCup ? 3 : 6;
                    return (
                      <div key={gi} className='bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-lg'>
                        <h3 className='text-[10px] font-black uppercase text-blue-400 mb-4 flex items-center gap-2 drop-shadow-md'><ShieldIcon size={12} /> {group.name}</h3>
                        <div className='space-y-4'>
                          {(() => {
                            const rounds = groupSchedule.map((round, ri) => ({ round, ri }));
                            const curIdx = activeComp.matchday % maxMatchdays;
                            if (activeComp.phase !== 'groups') return [...rounds].reverse();
                            return [...rounds.filter(r => r.ri === curIdx), ...rounds.filter(r => r.ri > curIdx), ...rounds.filter(r => r.ri < curIdx).reverse()];
                          })().map(({ round, ri }) => {
                            const isCur = activeComp.phase === 'groups' && ri === (activeComp.matchday % maxMatchdays);
                            const isPast = activeComp.phase !== 'groups' || (activeComp.phase === 'groups' && ri < (activeComp.matchday % maxMatchdays));

                            return (
                              <div key={ri} className={'p-3 rounded-2xl bg-black/30 border border-white/5 ' + (isCur ? 'border-blue-400/40 shadow-inner' : 'opacity-80')}>
                                <div className='flex justify-between items-center mb-2'>
                                  <span className='text-[8px] font-black uppercase text-slate-300 italic'>Jornada {ri + 1}</span>
                                  <span className={'text-[7px] font-black uppercase px-2 py-0.5 rounded-full ' + (isPast ? 'bg-emerald-500/30 text-emerald-300' : isCur ? 'bg-blue-500/40 text-blue-200' : 'bg-slate-800/80 text-slate-300')}>{isPast ? 'Finalizado' : isCur ? 'En Curso' : 'Próximo'}</span>
                                </div>
                                {round.map((m, mi) => {
                                  const home = activeComp.teams.find(t => t.id === m.homeId); const away = activeComp.teams.find(t => t.id === m.awayId);
                                  const result = activeComp.history.find(h => h.day === 'Jornada ' + (ri + 1))?.results.find(r => (r.hId === m.homeId && r.aId === m.awayId) || (r.hId === m.awayId && r.aId === m.homeId));

                                  return (
                                    <div key={mi} className='flex items-center justify-between py-1 border-b border-white/10 last:border-0'>
                                      <div className='flex items-center gap-2 w-20'><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag} /><span className='text-[9px] font-bold uppercase italic truncate'>{home?.name}</span></div>
                                      <div className='flex flex-col items-center'>
                                        {result ? (
                                          <div className='flex flex-col items-center'>
                                            <span className='text-[10px] font-black tabular-nums bg-slate-800/60 px-1.5 rounded'>{result.sh} - {result.sa}</span>
                                            {result.penH !== undefined && <span className='text-[7px] text-blue-300 font-bold'>(pen {result.penH}-{result.penA})</span>}
                                          </div>
                                        ) : <span className='text-[8px] font-black text-slate-400 italic'>VS</span>}
                                      </div>
                                      <div className='flex items-center gap-2 w-20 justify-end'><span className='text-[9px] font-bold uppercase italic truncate text-right'>{away?.name}</span><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag} /></div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeComp.bracket && (
                <div className='space-y-6'>
                  <h2 className='text-xs font-black uppercase text-slate-200 border-b border-white/20 pb-2 drop-shadow-md'>Eliminatorias</h2>
                  {(() => {
                    const po = ['Octavos', 'Cuartos', 'Semis', 'Final'];
                    const curIdx = po.indexOf(activeComp.phase);
                    if (curIdx === -1) return po; 
                    return [...po.slice(curIdx, curIdx + 1), ...po.slice(curIdx + 1), ...po.slice(0, curIdx).reverse()];
                  })().map(phase => {
                    const matches = activeComp.bracket[phase];
                    if (!matches || (Array.isArray(matches) && matches.length === 0)) return null;
                    const matchArray = Array.isArray(matches) ? matches : [matches];
                    const phases = ['groups', 'Octavos', 'Cuartos', 'Semis', 'Final'];
                    const currentPhaseIdx = phases.indexOf(activeComp.phase);
                    const phaseIdx = phases.indexOf(phase);
                    let status = phaseIdx < currentPhaseIdx ? 'Finalizado' : phaseIdx === currentPhaseIdx ? 'En Curso' : 'Próximo';

                    return (
                      <div key={phase} className={'bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-lg ' + (status === 'En Curso' ? 'ring-2 ring-blue-500/50' : 'opacity-80')}>
                        <div className='flex justify-between items-center mb-3'>
                          <h3 className='text-[9px] font-black uppercase text-slate-300'>{phase}</h3>
                          <span className={'text-[7px] font-black uppercase px-2 py-0.5 rounded-full ' + (status === 'Finalizado' ? 'bg-emerald-500/30 text-emerald-300' : status === 'En Curso' ? 'bg-blue-500/40 text-blue-200' : 'bg-slate-800/80 text-slate-300')}>{status}</span>
                        </div>
                        <div className='space-y-2'>
                          {matchArray.map((m, mi) => {
                            if (!m) return null;
                            const home = activeComp.teams.find(t => t.id === m.hId); const away = activeComp.teams.find(t => t.id === m.aId);
                            const isChampions = activeCompId === 'C1';
                            const isPlayedIda = m.sh !== null; const isPlayedVuelta = m.sh2 !== null;

                            return (
                              <div key={mi} className='flex flex-col bg-black/30 p-3 rounded-2xl gap-2 border border-white/5'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-2 w-28'><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag} /><span className='text-[9px] font-bold uppercase truncate italic'>{home?.name || 'TBD'}</span></div>
                                  <div className='flex flex-col items-center flex-1'>
                                    {isPlayedIda ? <div className='flex items-center gap-2 bg-slate-800/60 px-1.5 rounded'><span className='text-[10px] font-black tabular-nums'>{m.sh} - {m.sa}</span><span className='text-[7px] font-bold text-slate-400 uppercase italic'>Ida</span></div> : <span className='text-[8px] font-black text-slate-500 italic'>VS (Ida)</span>}
                                  </div>
                                  <div className='flex items-center gap-2 w-28 justify-end'><span className='text-[9px] font-bold uppercase truncate italic text-right'>{away?.name || 'TBD'}</span><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag} /></div>
                                </div>

                                {isChampions && phase !== 'Final' && (
                                  <div className='flex items-center justify-between border-t border-white/10 pt-2'>
                                    <div className='flex items-center gap-2 w-28'><Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag} /><span className='text-[9px] font-bold uppercase truncate italic'>{away?.name || 'TBD'}</span></div>
                                    <div className='flex flex-col items-center flex-1'>
                                      {isPlayedVuelta ? (
                                        <div className='flex flex-col items-center'>
                                          <div className='flex items-center gap-2 bg-slate-800/60 px-1.5 rounded'><span className='text-[10px] font-black tabular-nums'>{m.sh2} - {m.sa2}</span><span className='text-[7px] font-bold text-slate-400 uppercase italic'>Vuelta</span></div>
                                          <div className='flex items-center gap-1 mt-1'>
                                            <span className='text-[8px] font-black text-blue-300 uppercase italic bg-blue-900/40 px-1.5 rounded'>Global: {m.sh + m.sh2} - {m.sa + m.sa2}</span>
                                            {m.penH !== undefined && m.penH !== null && <span className='text-[7px] text-blue-200 font-bold'>(pen {m.penH}-{m.penA})</span>}
                                          </div>
                                        </div>
                                      ) : <span className='text-[7px] font-bold text-slate-500 uppercase italic'>Vuelta Pendiente</span>}
                                    </div>
                                    <div className='flex items-center gap-2 w-28 justify-end'><span className='text-[9px] font-bold uppercase truncate italic text-right'>{home?.name || 'TBD'}</span><Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag} /></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    if (compView === 'bracket') return (
      <div className='flex-grow px-4 pb-20'>
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Eliminatorias</h2>
        </div>
        {!activeComp.bracket ? (
          <div className='text-center py-20 text-slate-300 font-black bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 uppercase italic text-[10px] shadow-lg'>Las eliminatorias se generarán al finalizar la fase de grupos.</div>
        ) : (
          <div className='flex gap-8 overflow-x-auto custom-scrollbar pb-8'>
            {['Octavos', 'Cuartos', 'Semis', 'Final'].filter(p => activeComp.bracket[p]).map(phase => (
              <div key={phase} className='min-w-[280px] flex-shrink-0'>
                <h3 className='text-[10px] font-black uppercase text-blue-300 mb-4 px-3 border-l-2 border-blue-500 bg-slate-900/40 backdrop-blur-md rounded-r-xl py-1 drop-shadow-md'>{phase}</h3>
                <div className='grid grid-cols-1 gap-3'>
                  {(Array.isArray(activeComp.bracket[phase]) ? activeComp.bracket[phase] : [activeComp.bracket[phase]]).filter(m => m !== null).map((m, mi) => {
                    const h = activeComp.teams.find(t => t.id === m.hId); const a = activeComp.teams.find(t => t.id === m.aId);
                    const isChampions = activeCompId === 'C1';
                    let winner = null;
                    if ((isChampions && phase !== 'Final' ? m.sh2 !== null : m.sh !== null)) {
                      if (isChampions && phase !== 'Final') {
                        const totH = (m.sh || 0) + (m.sh2 || 0); const totA = (m.sa || 0) + (m.sa2 || 0);
                        if (totH > totA) winner = h; else if (totA > totH) winner = a; else if (m.penH !== null && m.penH !== undefined) winner = m.penH > m.penA ? h : a;
                      } else {
                        if (m.sh > m.sa) winner = h; else if (m.sa > m.sh) winner = a; else if (m.penH !== null && m.penH !== undefined) winner = m.penH > m.penA ? h : a;
                      }
                    }

                    return (
                      <div key={mi} className='bg-slate-900/30 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex flex-col gap-2 shadow-lg'>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center gap-2 flex-1'><Shield color1={h?.color1} color2={h?.color2} initial={h?.name} size='xs' isFlag={h?.isFlag} /><span className={'text-[10px] font-bold uppercase italic truncate ' + (h ? 'text-white' : 'text-slate-400')}>{h?.name || 'TBD'}</span></div>
                          <div className='flex items-center gap-2 tabular-nums font-black italic text-xs bg-black/30 px-2 py-0.5 rounded'>
                            {m.sh !== null && <span>{m.sh}</span>}{isChampions && m.sh2 !== null && <span className='text-slate-400 text-[10px]'>({m.sh2})</span>}{m.penH !== null && m.penH !== undefined && <span className='text-red-400 text-[9px] font-black'>[{m.penH}]</span>}
                          </div>
                        </div>
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center gap-2 flex-1'><Shield color1={a?.color1} color2={a?.color2} initial={a?.name} size='xs' isFlag={a?.isFlag} /><span className={'text-[10px] font-bold uppercase italic truncate ' + (a ? 'text-white' : 'text-slate-400')}>{a?.name || 'TBD'}</span></div>
                          <div className='flex items-center gap-2 tabular-nums font-black italic text-xs bg-black/30 px-2 py-0.5 rounded'>
                            {m.sa !== null && <span>{m.sa}</span>}{isChampions && m.sa2 !== null && <span className='text-slate-400 text-[10px]'>({m.sa2})</span>}{m.penA !== null && m.penA !== undefined && <span className='text-red-400 text-[9px] font-black'>[{m.penA}]</span>}
                          </div>
                        </div>
                        {winner && (
                          <div className='mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-2 bg-emerald-900/30 backdrop-blur-sm rounded-b-xl'>
                            <span className='text-[7px] font-black uppercase text-emerald-300 italic'>Pasa:</span>
                            <Shield color1={winner.color1} color2={winner.color2} initial={winner.name} size='xs' isFlag={winner.isFlag} />
                            <span className='text-[8px] font-black uppercase italic text-white truncate max-w-[100px]'>{winner.name}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );

    if (compView === 'playing') {
      if (!matchState) return null;
      return (
        <div className='flex-grow flex flex-col px-4'>
        <div className='flex justify-between items-center mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-xl text-slate-200 active:scale-95 transition-all'><ChevronLeft /></button>
          <div className='px-4 py-1 bg-red-600/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase italic animate-pulse shadow-md'>En Vivo</div>
          <div className='w-10'></div>
        </div>

        <div className='bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-6 mb-4 border-b-4 border-slate-800 relative shadow-xl'>
          {matchState.aggregate && (
            <div className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-400 shadow-lg z-10'>
              <span className='text-[8px] font-black uppercase italic text-white tracking-widest'>Global: {matchState.aggregate.sh + matchState.scoreH} - {matchState.aggregate.sa + matchState.scoreA}</span>
            </div>
          )}
          <div className='flex items-center'>
            <div className='flex-1 flex flex-col items-center text-center'>
              {matchState.phase === 'penalties' && <PenaltyDots history={matchState.penalties?.historyH} />}
              <Shield color1={matchState.home?.color1} color2={matchState.home?.color2} initial={matchState.home?.name} size='lg' isFlag={matchState.home?.isFlag} />
              <p className='text-[10px] font-black uppercase italic mt-2 truncate text-white drop-shadow-md w-full'>{matchState.home?.name}</p>
              <p className='text-[8px] font-bold text-slate-300 mt-1 bg-black/40 backdrop-blur-sm inline-block px-2 rounded'>{matchState.home.att + '/' + matchState.home.opp + '/' + matchState.home.def}</p>
            </div>
            
            <div className='px-4 flex flex-col items-center shrink-0 w-32'>
              <div className='text-5xl font-black italic tracking-tighter flex gap-3 tabular-nums drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] text-white'><span>{matchState.scoreH}</span><span className='text-slate-400'>-</span><span>{matchState.scoreA}</span></div>
              {!matchState.finished && matchState.phase !== 'penalties' && <div className='text-[8px] font-black text-white/70 uppercase italic mt-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm'>{matchState.oppH} vs {matchState.oppA} TIROS RESTANTES</div>}
              {matchState.phase === 'penalties' && (
                <div className='mt-2 flex flex-col items-center w-full'>
                  <span className='text-[8px] font-black text-red-400 uppercase italic'>Penaltis</span>
                  <div className='text-xl font-black italic text-blue-300 tabular-nums drop-shadow-md'>(pen {matchState.penalties.scoreH} - {matchState.penalties.scoreA})</div>
                  {matchState.penalties.shotsH < 5 || matchState.penalties.shotsA < 5 ? (
                    <div className='flex justify-between w-full text-[7px] font-bold text-slate-300 uppercase mt-1'><span>Res H: {5 - matchState.penalties.shotsH}</span><span>Res A: {5 - matchState.penalties.shotsA}</span></div>
                  ) : <div className='text-[7px] font-bold text-yellow-400 uppercase mt-1 animate-pulse'>¡Muerte Súbita!</div>}
                  <div className='text-[7px] font-bold text-slate-200 uppercase mt-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-center'>{matchState.penalties.phase === 'att' ? '⚽ Preparando Disparo' : '🧤 ¡El portero se prepara!'}</div>
                </div>
              )}
            </div>
            
            <div className='flex-1 flex flex-col items-center text-center'>
              {matchState.phase === 'penalties' && <PenaltyDots history={matchState.penalties?.historyA} />}
              <Shield color1={matchState.away?.color1} color2={matchState.away?.color2} initial={matchState.away?.name} size='lg' isFlag={matchState.away?.isFlag} />
              <p className='text-[10px] font-black uppercase italic mt-2 truncate text-white drop-shadow-md w-full'>{matchState.away?.name}</p>
              <p className='text-[8px] font-bold text-slate-300 mt-1 bg-black/40 backdrop-blur-sm inline-block px-2 rounded'>{matchState.away.att + '/' + matchState.away.opp + '/' + matchState.away.def}</p>
            </div>
          </div>
        </div>

        <div className='flex-grow bg-[#2e7d32]/60 backdrop-blur-md rounded-[3rem] border-8 border-slate-900/40 relative overflow-hidden flex flex-col items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]'>
          <div className='absolute top-1/2 left-0 w-full h-[2px] bg-white/20 -translate-y-1/2'></div>
          <div className='absolute top-1/2 left-1/2 w-40 h-40 border-[2px] border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2'></div>
          <div className='absolute top-1/2 left-1/2 w-3 h-3 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2'></div>

          {!matchState.finished ? (
            <div className='z-10 flex flex-col items-center gap-8'>
              <div className={'transition-all duration-300 transform ' + (rolling ? 'scale-125 rotate-45' : 'scale-100')}>
                <DieIcon value={matchState.lastDie} className='w-24 h-24 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]' />
              </div>
              <button onClick={handleRoll} disabled={rolling} className='bg-white/90 backdrop-blur-sm text-emerald-900 px-10 py-5 rounded-3xl font-black uppercase italic tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5)] active:scale-90 transition-transform disabled:opacity-50'>{rolling ? 'Lanzando...' : 'Lanzar Dado'}</button>
            </div>
          ) : (
            <div className='z-10 text-center p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20 max-w-[80%] shadow-2xl'>
              <Trophy size={48} className='text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' />
              <h3 className='text-lg font-black uppercase italic mb-4 text-white drop-shadow-md'>¡Fin del Partido!</h3>
              <button onClick={processMatchday} className='w-full bg-white/90 backdrop-blur-sm text-slate-950 py-4 rounded-2xl font-black uppercase italic tracking-widest active:scale-95 transition-all shadow-md'>Finalizar</button>
            </div>
          )}
        </div>

        <div className='mt-4 bg-slate-900/40 backdrop-blur-md rounded-3xl p-5 h-40 overflow-y-auto border border-white/10 space-y-2 shadow-lg custom-scrollbar'>
          {matchState.logs.map((log, i) => (
            <div key={i} className={'text-[10px] font-bold italic flex gap-3 ' + (i === 0 ? 'text-white drop-shadow-md' : 'text-slate-300')}><span className='opacity-60 shrink-0'>⚽</span><p>{log}</p></div>
          ))}
        </div>
      </div>
    );
    }

    if (compView === 'teamSelect') return (
      <div className='flex-grow px-4 pb-20'>
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Seleccionar Equipo</h2>
        </div>
        <div className='grid gap-3 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar'>
          {Array.isArray(activeComp.teams) && activeComp.teams.map(t => (
            <button key={t.id} onClick={() => { updateActiveComp({ userTeamId: t.id }); setCompView('main'); }} className={'flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-95 backdrop-blur-md ' + (t.id === activeComp.userTeamId ? 'bg-blue-600/60 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-slate-900/40 border-white/10 hover:border-white/30')}>
              <Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='md' isFlag={t?.isFlag} />
              <div className='text-left'>
                <p className='text-xs font-black uppercase italic text-white drop-shadow-md'>{t?.name}</p>
                <p className='text-[8px] font-bold text-slate-200 uppercase bg-black/40 px-1.5 py-0.5 rounded inline-block mt-1'>{t?.att + '/' + t?.opp + '/' + t?.def}</p>
              </div>
              {t.id === activeComp.userTeamId && <div className='ml-auto bg-white/30 p-1.5 rounded-full shadow-inner'><Check size={14} className="text-white"/></div>}
            </button>
          ))}
        </div>
      </div>
    );

    return null;
  };

  return (
    <div className='relative min-h-screen selection:bg-blue-500/30 font-sans text-slate-100 overflow-hidden'>
      {/* BACKGROUND ESTADIO NOCTURNO PARA APRECIAR TRANSPARENCIAS */}
      <div className='fixed inset-0 bg-[url("https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop")] bg-cover bg-center bg-no-repeat z-0'></div>
      <div className='fixed inset-0 bg-slate-950/60 z-0 backdrop-blur-[2px]'></div>

      <div className='relative z-10 max-w-md mx-auto min-h-screen flex flex-col'>
        <AnimatePresence mode='wait'>
          {view === 'hub' && <motion.div key='hub' className='flex-grow flex flex-col' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HubView setView={setView} setActiveCompId={setActiveCompId} setCompView={setCompView} comps={comps} /></motion.div>}
          {view === 'rules' && <motion.div key='rules' className='flex-grow flex flex-col' initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}><RulesView setView={setView} /></motion.div>}
          {view === 'archive' && <motion.div key='archive' className='flex-grow flex flex-col' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><ArchiveView selectedArchiveEntry={selectedArchiveEntry} setSelectedArchiveEntry={setSelectedArchiveEntry} setView={setView} archive={archive} /></motion.div>}
          {view === 'competition' && <motion.div key='comp' className='flex-grow flex flex-col' initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}><CompetitionView /></motion.div>}
        </AnimatePresence>
      </div>

      {/* MODAL GLOBAL DE CONFIRMACIÓN DE SALIDA (ASOCIADO AL BOTÓN FÍSICO) */}
      <AnimatePresence>
        {showExitModal && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4'>
              <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} className='bg-slate-900 rounded-[2rem] border border-white/10 p-6 shadow-2xl max-w-sm w-full text-center'>
                  <h2 className='text-xl font-black uppercase italic text-white mb-2'>¿Salir del Juego?</h2>
                  <p className='text-[11px] text-slate-300 font-bold mb-6'>Todo tu progreso local se mantendrá guardado hasta la próxima vez.</p>
                  <div className='flex gap-3'>
                      <button onClick={() => setShowExitModal(false)} className='flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl border border-white/10 active:scale-95 transition-all text-xs uppercase'>Cancelar</button>
                      <button onClick={() => window.close()} className='flex-1 bg-red-600 text-white font-black uppercase py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-red-500/20 text-xs'>Salir</button>
                  </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}