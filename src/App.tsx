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
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. CONSTANTES DEL SISTEMA Y PRESETS
// ==========================================
const APP_ID = 'dice-football-hub-elite-v6'; // Actualizado v6

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
// NUEVO: PRESETS SEGUNDA DIVISIÓN
// ==========================================
const PRESETS_2 = {
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
  FR: [
    { name: 'Clermont Foot', att: 4, opp: 4, def: 4, color1: '#e30613', color2: '#0033a0', league: 'FR' },
    { name: 'Valenciennes FC', att: 4, opp: 4, def: 3, color1: '#e30613', color2: '#ffffff', league: 'FR' },
    { name: 'Chamois Niortais', att: 3, opp: 3, def: 4, color1: '#ffcc00', color2: '#006400', league: 'FR' },
    { name: 'Paris FC', att: 4, opp: 5, def: 4, color1: '#0033a0', color2: '#ffffff', league: 'FR' },
    { name: 'Rodez AF', att: 3, opp: 4, def: 3, color1: '#e30613', color2: '#ffcc00', league: 'FR' },
    { name: 'SM Caen', att: 3, opp: 4, def: 3, color1: '#0033a0', color2: '#e30613', league: 'FR' },
    { name: 'EA Guingamp', att: 3, opp: 4, def: 3, color1: '#e30613', color2: '#000000', league: 'FR' },
    { name: 'Amiens SC', att: 3, opp: 3, def: 4, color1: '#ffffff', color2: '#000000', league: 'FR' },
    { name: 'SC Bastia', att: 3, opp: 3, def: 4, color1: '#0033a0', color2: '#ffffff', league: 'FR' },
    { name: 'Pau FC', att: 3, opp: 4, def: 2, color1: '#ffcc00', color2: '#0033a0', league: 'FR' },
    { name: 'Grenoble Foot', att: 3, opp: 3, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'FR' },
    { name: 'FC Annecy', att: 3, opp: 4, def: 2, color1: '#e30613', color2: '#ffffff', league: 'FR' },
    { name: 'ES Troyes AC', att: 2, opp: 3, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'FR' },
    { name: 'AC Ajaccio', att: 2, opp: 3, def: 4, color1: '#ffffff', color2: '#e30613', league: 'FR' },
    { name: 'USL Dunkerque', att: 2, opp: 3, def: 3, color1: '#87ceeb', color2: '#ffffff', league: 'FR' },
    { name: 'Red Star FC', att: 2, opp: 3, def: 3, color1: '#00a650', color2: '#ffffff', league: 'FR' },
    { name: 'FC Metz', att: 3, opp: 3, def: 2, color1: '#6c1d45', color2: '#ffffff', league: 'FR' },
    { name: 'FC Lorient', att: 3, opp: 3, def: 3, color1: '#f68712', color2: '#000000', league: 'FR' }
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
  ],
  MI: [
    { name: 'SC Braga', att: 4, opp: 5, def: 3, color1: '#e30613', color2: '#ffffff', league: 'MI' },
    { name: 'Besiktas', att: 4, opp: 4, def: 4, color1: '#000000', color2: '#ffffff', league: 'MI' },
    { name: 'AEK Athens', att: 4, opp: 4, def: 3, color1: '#fde100', color2: '#000000', league: 'MI' },
    { name: 'PAOK', att: 4, opp: 4, def: 3, color1: '#000000', color2: '#ffffff', league: 'MI' },
    { name: 'KRC Genk', att: 4, opp: 4, def: 3, color1: '#0033a0', color2: '#ffffff', league: 'MI' },
    { name: 'Royal Antwerp', att: 3, opp: 4, def: 4, color1: '#e30613', color2: '#ffffff', league: 'MI' },
    { name: 'Young Boys', att: 4, opp: 4, def: 3, color1: '#ffd700', color2: '#000000', league: 'MI' },
    { name: 'FC Basel', att: 3, opp: 3, def: 3, color1: '#e30613', color2: '#0033a0', league: 'MI' },
    { name: 'Trabzonspor', att: 3, opp: 4, def: 3, color1: '#8b0000', color2: '#87ceeb', league: 'MI' },
    { name: 'Hajduk Split', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#0033a0', league: 'MI' },
    { name: 'FC Midtjylland', att: 3, opp: 4, def: 3, color1: '#000000', color2: '#e30613', league: 'MI' },
    { name: 'Brøndby IF', att: 3, opp: 3, def: 3, color1: '#ffd700', color2: '#0033a0', league: 'MI' },
    { name: 'Sturm Graz', att: 3, opp: 3, def: 3, color1: '#000000', color2: '#ffffff', league: 'MI' },
    { name: 'Viktoria Plzen', att: 3, opp: 3, def: 4, color1: '#e30613', color2: '#0033a0', league: 'MI' },
    { name: 'Ferencvaros', att: 3, opp: 3, def: 3, color1: '#00a650', color2: '#ffffff', league: 'MI' },
    { name: 'Ludogorets', att: 3, opp: 4, def: 2, color1: '#00a650', color2: '#ffffff', league: 'MI' },
    { name: 'Bodo/Glimt', att: 4, opp: 4, def: 2, color1: '#ffff00', color2: '#000000', league: 'MI' },
    { name: 'Qarabag FK', att: 3, opp: 3, def: 3, color1: '#000000', color2: '#ffffff', league: 'MI' },
    { name: 'Maccabi Tel Aviv', att: 3, opp: 3, def: 2, color1: '#ffd700', color2: '#0033a0', league: 'MI' },
    { name: 'Legia Warsaw', att: 3, opp: 3, def: 3, color1: '#ffffff', color2: '#000000', league: 'MI' }
  ]
};

// ==========================================
// 2. HELPERS Y GENERADORES
// ==========================================

let globalAudioCtx: any = null;
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

// MODIFICADO: Genera ambas divisiones para las ligas
const getDefaultComps = () => {
  const baseTeam = (preset, isDiv2 = false) => {
    const list = isDiv2 ? PRESETS_2[preset] : PRESETS[preset];
    if (!list) return [];
    const offset = isDiv2 ? 100 : 0; // Previene colisiones de ID
    return list.map((t, i) => ({ ...t, id: i + 1 + offset, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
  };

  const getLeagueData = (name, code) => {
    const t2 = baseTeam(code, true);
    return {
      type: 'league', name, 
      teams: baseTeam(code), matchday: 0, history: [], showWinner: false, 
      teams2: t2, matchday2: 0, history2: [], showWinner2: false,
      userTeamId: 1, userTeamId2: t2[0]?.id || 21, disqualified: false,
      promotionsLogs: null
    };
  };

  return {
    'L1': getLeagueData('Liga Española', 'ES'),
    'L2': getLeagueData('Liga Italiana', 'IT'),
    'L3': getLeagueData('Liga Inglesa', 'EN'),
    'L4': getLeagueData('Liga Alemana', 'DE'),
    'L5': getLeagueData('Liga Holandesa', 'NL'),
    'L6': getLeagueData('Liga Francesa', 'FR'),
    'L7': getLeagueData('Miscelánea', 'MI'),
    'C1': { type: 'cup', name: 'Champions League', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null, disqualified: false },
    'C2': { type: 'cup', name: 'Copa del Mundo', teams: [], matchday: 0, history: [], userTeamId: 1, showWinner: false, phase: 'groups', bracket: null, disqualified: false }
  };
};

// MODIFICADO: CL se construye desde el estado actual de comps, no desde los presets originales,
// para que los equipos ascendidos puedan jugarla.
const buildCLPool = (compsState) => {
  const pull = (compKey, guaranteed, extra) => {
    if (!compsState[compKey] || !compsState[compKey].teams) return [];
    const t = [...compsState[compKey].teams].sort((a,b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const top = t.slice(0, guaranteed);
    const rest = [...t.slice(guaranteed, guaranteed + 6)].sort(() => Math.random() - 0.5).slice(0, extra);
    return [...top, ...rest];
  }
  return [
    ...pull('L1', 3, 2), ...pull('L3', 3, 2), ...pull('L4', 3, 2), ...pull('L2', 3, 2),
    ...pull('L6', 3, 1), ...pull('L5', 3, 1), ...pull('L7', 3, 1),
  ];
};

const drawKnockoutGroups = (pool, isWC, randomize) => {
  let groups = Array.from({length: 8}, () => []);
  const sortedPool = [...pool].sort((a, b) => (b.att + b.opp + b.def) - (a.att + a.opp + a.def));
  let pots = [sortedPool.slice(0, 8), sortedPool.slice(8, 16), sortedPool.slice(16, 24), sortedPool.slice(24, 32)];

  if (randomize) pots = pots.map(pot => [...pot].sort(() => Math.random() - 0.5));

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
              groups[groupIdx].pop();
              team.used = false;
           }
        }
        return false;
     };
     let workingPots = pots.map(pot => pot.map(t => ({...t, used: false})));
     pots = workingPots;
     let success = solve(0, 0);
     if (!success) groups = Array.from({length: 8}, (_, i) => [pots[0][i], pots[1][i], pots[2][i], pots[3][i]]);
  } else {
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
     if (!success) groups = Array.from({length: 8}, (_, i) => [pots[0][i], pots[1][i], pots[2][i], pots[3][i]]);
  }

  const formattedGroups = groups.map((g, i) => ({ name: 'Grupo ' + String.fromCharCode(65 + i), teamIds: g.map(t => t.id) }));
  return { teams: pool, groups: formattedGroups, matchday: 0, history: [], phase: 'groups', showWinner: false, disqualified: false, userTeamId: pool[0].id, bracket: null };
};

const getAutoFillData = (compId, compsState) => {
  const isWC = compId === 'C2';
  let pool = isWC ? [...PRESETS.WC] : buildCLPool(compsState);
  pool = pool.map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));
  return drawKnockoutGroups(pool, isWC, false);
};

const getShuffleData = (compId, compsState) => {
  const isWC = compId === 'C2';
  let pool = isWC ? [...PRESETS.WC] : buildCLPool(compsState);
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
// [Se mantienen intactos]
const COUNTRY_CODES = {
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

const getCountryCode = (name) => {
  if (!name) return null;
  return COUNTRY_CODES[name.toLowerCase().trim()] || null;
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
          <img src={`https://flagcdn.com/${code}.svg`} alt={initial} className='w-full h-full object-cover' onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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
          <p className="text-[10px] text-slate-300 font-bold uppercase italic tracking-widest text-center mb-6 drop-shadow-md">Últimos Registros</p>
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
                  <h3 className='text-sm font-black uppercase italic truncate text-white'>{entry.name} {entry.div === 2 ? '(2ª Div)' : ''}</h3>
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
            <h3 className='text-2xl font-black italic uppercase mb-1 text-white'>{selectedArchiveEntry.name} {selectedArchiveEntry.div === 2 ? '(2ª Div)' : ''}</h3>
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
        <h4 className='text-xs font-black uppercase italic text-emerald-400 mb-2'>1. Dos Divisiones</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Cada liga tiene 1ª y 2ª división. Al finalizar ambas, los 3 últimos de Primera descienden y los 3 primeros de Segunda ascienden, heredando e intercambiando estadísticas.</p>
      </div>
      <div className='bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg'>
        <h4 className='text-xs font-black uppercase italic text-blue-400 mb-2'>2. Ataque y Defensa</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Para marcar gol, el atacante debe sacar un número menor o igual a su ATK. Si lo logra, el portero rival debe sacar un número <strong className='text-white'>menor o igual a su DEF</strong> para detenerlo.</p>
      </div>
      <div className='bg-slate-900/30 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg'>
        <h4 className='text-xs font-black uppercase italic text-purple-400 mb-2'>3. Guardado Automático</h4>
        <p className='text-[11px] font-bold text-slate-200 leading-relaxed'>Tu progreso de todas las ligas se guarda automáticamente. Cualquier edición que hagas en los equipos perdurará durante tus temporadas.</p>
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
      <p className='text-[11px] text-slate-200 font-bold uppercase tracking-widest mt-3 drop-shadow-md'>Elite Dice Engine v6</p>
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
            <button key={id} onClick={() => { setActiveCompId(id); setCompView('main'); setView('competition'); }} className='p-6 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/10 flex flex-col items-center gap-4 hover:bg-slate-800/40 hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all duration-300 group'>
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
              <p className='text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1'>1ª y 2ª División con Ascensos</p>
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
                    <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={id} onClick={() => { setActiveCompId(id); setCompView('main'); setView('competition'); }} className='p-4 bg-slate-900/30 backdrop-blur-md rounded-[1.5rem] border border-white/5 flex items-center justify-between hover:bg-slate-800/50 hover:border-emerald-500/20 hover:shadow-[0_0_15px_rgba(52,211,153,0.1)] active:scale-[0.98] transition-all duration-200 group'>
                      <div className='flex items-center gap-4'>
                        <div className='w-10 h-10 rounded-xl bg-slate-950/40 flex items-center justify-center text-slate-200 border border-white/5 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all'><BarChart3 size={18} /></div>
                        <div className='text-left'>
                          <h4 className='text-xs font-black uppercase italic text-slate-100 group-hover:text-white transition-colors tracking-wide'>{comp.name}</h4>
                          <p className='text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5'>{isConf ? `Jornadas: 1ª(${comp.matchday}) / 2ª(${comp.matchday2 || 0})` : 'No Inicializada'}</p>
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
    <footer className='py-6 text-center opacity-40'><p className='text-[9px] font-black uppercase tracking-widest text-white drop-shadow-md'>Powered by Dice Engine v6.0</p></footer>
  </div>
)};

const ConfigPanel = ({ initialComp, compId, onSave, onCancel, onTotalReset }) => {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(initialComp)));
  const [editDiv, setEditDiv] = useState(1);
  const [drawModal, setDrawModal] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const hasStarted = initialComp.type === 'league' 
    ? (initialComp.matchday > 0 || initialComp.matchday2 > 0 || initialComp.history?.length > 0)
    : (initialComp.matchday > 0 || initialComp.history?.length > 0);

  const currentTeams = editDiv === 2 ? draft.teams2 : draft.teams;
  const updateTeamAttr = (id, field, val) => {
    if (editDiv === 2) {
      setDraft(prev => ({ ...prev, teams2: prev.teams2.map(t => t.id === id ? { ...t, [field]: val } : t) }));
    } else {
      setDraft(prev => ({ ...prev, teams: prev.teams.map(t => t.id === id ? { ...t, [field]: val } : t) }));
    }
  };

  const handleDrawUI = (type) => {
    if (hasStarted) return;
    const isWC = compId === 'C2';
    // Construir pool usando estado guardado actual para incluir equipos ascendidos
    const compsState = JSON.parse(window.localStorage.getItem(`${APP_ID}_comps`));
    const pool = isWC ? [...PRESETS.WC] : buildCLPool(compsState || getDefaultComps());
    const initializedPool = pool.map((t, i) => ({ ...t, id: i + 1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }));

    initializedPool.sort((a, b) => (b.att + b.opp + b.def) - (a.att + a.opp + a.def));
    const pots = [
      initializedPool.slice(0, 8), initializedPool.slice(8, 16),
      initializedPool.slice(16, 24), initializedPool.slice(24, 32)
    ];
    const drawData = drawKnockoutGroups(initializedPool, isWC, type === 'shuffle');
    setDrawModal({ step: 'pots', pots, groups: drawData.groups, drawData });
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
        <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Ajustes</h2>
      </div>

      <div className='bg-slate-900/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg mb-6'>
        <h3 className='text-xs font-black text-red-400 uppercase italic mb-3 flex items-center gap-2'><AlertTriangle size={14}/> Zona de Peligro</h3>
        <button onClick={() => setShowResetConfirm(true)} className='w-full py-4 bg-gradient-to-r from-red-700/60 via-red-600/50 to-red-700/60 text-red-200 font-black uppercase tracking-widest text-[11px] rounded-2xl border-2 border-red-500/40 active:scale-95 transition-all shadow-[0_0_25px_rgba(239,68,68,0.2)] hover:shadow-[0_0_35px_rgba(239,68,68,0.35)] hover:border-red-400/60 flex items-center justify-center gap-2 italic'>
           <RotateCcw size={15} className='text-red-300'/> Reiniciar Temporada (Ambas Divisiones)
         </button>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md'>
            <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }} className='bg-gradient-to-b from-slate-900 to-slate-950 w-full max-w-sm rounded-[2rem] border border-red-500/30 shadow-2xl overflow-hidden'>
              <div className='bg-gradient-to-r from-red-900/60 via-red-800/40 to-red-900/60 px-6 py-5 border-b border-red-500/20'>
                <div className='flex items-center justify-center gap-3'>
                  <div className='w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30'>
                    <AlertTriangle size={20} className='text-red-400' />
                  </div>
                  <h3 className='text-lg font-black uppercase italic text-red-300 tracking-tight'>Reiniciar Temporada</h3>
                </div>
              </div>
              <div className='px-6 py-5'>
                <p className='text-sm font-bold text-slate-200 text-center leading-relaxed'>
                  Esto borrará <span className='text-red-400'>todo el progreso</span> de esta competición y restaurará los equipos originales.
                </p>
                <p className='text-[10px] font-bold text-slate-500 text-center mt-2 uppercase tracking-wider'>Esta acción no se puede deshacer</p>
              </div>
              <div className='flex gap-3 px-6 pb-6'>
                <button onClick={() => setShowResetConfirm(false)} className='flex-1 bg-slate-800/80 border border-white/10 text-slate-200 py-3.5 rounded-2xl text-[11px] font-black uppercase italic tracking-widest active:scale-95 transition-all'>
                  Cancelar
                </button>
                <button onClick={() => { onTotalReset(compId); setShowResetConfirm(false); }} className='flex-1 bg-gradient-to-r from-red-700/80 to-red-600/80 border-2 border-red-400/40 text-white py-3.5 rounded-2xl text-[11px] font-black uppercase italic tracking-widest active:scale-95 transition-all shadow-[0_0_25px_rgba(239,68,68,0.35)] flex items-center justify-center gap-2'>
                  <RotateCcw size={14} className='text-red-200'/> Reiniciar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {draft.type === 'league' && (
        <div className='flex mb-4 bg-slate-900/50 p-1 rounded-2xl border border-white/10 backdrop-blur-sm'>
          <button onClick={() => setEditDiv(1)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all ${editDiv === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>1ª División</button>
          <button onClick={() => setEditDiv(2)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all ${editDiv === 2 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>2ª División</button>
        </div>
      )}

      {draft.type !== 'league' && (
        <div className='grid grid-cols-2 gap-2 mb-6'>
          <button onClick={() => handleDrawUI('auto')} disabled={hasStarted} className={`p-3 border rounded-2xl text-[8px] font-black uppercase italic flex flex-col items-center justify-center gap-1 transition-all backdrop-blur-md ${hasStarted ? 'opacity-40 cursor-not-allowed bg-yellow-900/20 border-yellow-500/10 text-yellow-500/50' : 'bg-yellow-600/20 text-yellow-200 border-yellow-500/40 hover:bg-yellow-600/40 active:scale-95'}`}>
            <Wand2 size={16}/> Auto-Rellenar
          </button>
          <button onClick={() => handleDrawUI('shuffle')} disabled={hasStarted} className={`p-3 border rounded-2xl text-[8px] font-black uppercase italic flex flex-col items-center justify-center gap-1 transition-all backdrop-blur-md ${hasStarted ? 'opacity-40 cursor-not-allowed bg-emerald-900/20 border-emerald-500/10 text-emerald-500/50' : 'bg-emerald-600/20 text-emerald-200 border-emerald-500/40 hover:bg-emerald-600/40 active:scale-95'}`}>
            <Shuffle size={16}/> Sorteo Dinámico
          </button>
          {hasStarted && <p className='col-span-2 text-[8px] text-center text-red-400 font-bold uppercase italic mt-1 drop-shadow-md'>No puedes re-sortear torneos en curso.</p>}
        </div>
      )}

      <div className='grid gap-4'>
        {(!Array.isArray(currentTeams) || currentTeams.length === 0) && <div className='text-center py-10 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-dashed border-white/20'><p className='text-[10px] font-bold text-slate-300 uppercase italic'>No hay equipos configurados.</p></div>}
        {Array.isArray(currentTeams) && currentTeams.map(t => (
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
        <button onClick={() => onSave(draft)} className='w-full bg-blue-600/80 backdrop-blur-md text-white py-4 rounded-2xl font-black uppercase italic tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 active:scale-95 transition-all border border-blue-400'><Save size={18} /> Guardar Cambios</button>
      </div>
    </div>
  );
};

// ==========================================
// 5. APLICACIÓN PRINCIPAL Y LÓGICA DE COMPETICIÓN
// ==========================================

function DiceFootballApp() {
  const [view, setView] = useState('hub');
  const [activeCompId, setActiveCompId] = useState(null);
  const [compView, setCompView] = useState('main');
  const [viewDiv, setViewDiv] = useState(1); 
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [championModalTab, setChampionModalTab] = useState<'champion' | 'stats' | 'results' | 'promotions' | 'bracket'>('champion');
  const [championModalDiv, setChampionModalDiv] = useState(1);
  const [eliminatedModal, setEliminatedModal] = useState<{ compId: string; phase: string } | null>(null);
  const [resetConfirmModal, setResetConfirmModal] = useState(false);

  useEffect(() => {
    if (view !== 'hub' || compView !== 'main') window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      if (compView !== 'main') { setCompView('main'); }
      else if (view !== 'hub') { setView('hub'); setActiveCompId(null); }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view, compView]);

  const [archive, setArchive] = useState(() => {
    try { const saved = window.localStorage.getItem(`${APP_ID}_archive`); if (saved) return JSON.parse(saved); } catch (e) {} return [];
  });
  useEffect(() => { try { window.localStorage.setItem(`${APP_ID}_archive`, JSON.stringify(archive)); } catch(e){} }, [archive]);

  const [selectedArchiveEntry, setSelectedArchiveEntry] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (e.target.closest('button')) playClick(); };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const [comps, setComps] = useState(() => {
    const defaultComps = getDefaultComps();
    try {
      const saved = window.localStorage.getItem(`${APP_ID}_comps`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const merged = { ...defaultComps };
          Object.keys(parsed).forEach(key => { if (merged[key]) merged[key] = { ...merged[key], ...parsed[key] }; });
          return merged;
        }
      }
    } catch (e) {}
    return defaultComps;
  });

  useEffect(() => { try { window.localStorage.setItem(`${APP_ID}_comps`, JSON.stringify(comps)); } catch(e){} }, [comps]);

  const activeComp = comps[activeCompId];
  const updateActiveComp = (newData) => setComps(prev => ({ ...prev, [activeCompId]: { ...prev[activeCompId], ...newData } }));

  // Helper para asegurar persistencia manual
  const manualSave = () => {
    try { 
      window.localStorage.setItem(`${APP_ID}_comps`, JSON.stringify(comps)); 
      setShowSaveModal(true);
      setTimeout(() => setShowSaveModal(false), 2000);
    } catch(e) {}
  };

  const archiveCompetition = (compId, div, customWinner = null) => {
    const comp = comps[compId];
    if (!comp) return;
    const isDiv2 = div === 2;
    const t = isDiv2 ? comp.teams2 : comp.teams;

    let winner = customWinner;
    if (!winner) {
      if (comp.type === 'league') {
        winner = [...t].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga))[0];
      } else {
        const final = comp.bracket?.Final?.[0] || comp.bracket?.Final;
        if (final && final.sh !== null) {
          if (final.sh > final.sa) winner = t.find(x => x.id === final.hId);
          else if (final.sa > final.sh) winner = t.find(x => x.id === final.aId);
          else winner = t.find(x => x.id === (final.penH > final.penA ? final.hId : final.aId));
        }
      }
    }

    const entry = { 
      id: Date.now(), compId, name: comp.name, date: new Date().toLocaleDateString(), div, winner, 
      teams: t, history: isDiv2 ? comp.history2 : comp.history, bracket: comp.bracket, groups: comp.groups, type: comp.type 
    };
    setArchive(prev => [entry, ...prev].slice(0, 5));
  };

  const [matchState, setMatchState] = useState(null);
  const [rolling, setRolling] = useState(false);
  const rollIntervalRef = useRef(null);

  useEffect(() => () => rollIntervalRef.current && clearInterval(rollIntervalRef.current), []);

  const startMatch = (homeId, awayId, isDiv2Context) => {
    const sourceTeams = isDiv2Context ? activeComp.teams2 : activeComp.teams;
    const home = sourceTeams.find(t => t.id === homeId);
    const away = sourceTeams.find(t => t.id === awayId);
    if (!home || !away) return;

    const isVuelta = activeCompId === 'C1' && activeComp.matchday % 2 !== 0 && activeComp.phase !== 'Final' && activeComp.phase !== 'groups';
    let aggregate = null;
    if (isVuelta && activeComp.bracket) {
      const matchArray = Array.isArray(activeComp.bracket[activeComp.phase]) ? activeComp.bracket[activeComp.phase] : [activeComp.bracket[activeComp.phase]];
      const match = matchArray.find(m => m && m.hId === awayId && m.aId === homeId);
      if (match) aggregate = { sh: match.sa, sa: match.sh };
    }

    setMatchState({
      home, away, scoreH: 0, scoreA: 0, oppH: home.opp, oppA: away.opp, turn: 'H', phase: 'att', isDiv2Context,
      logs: ['⚽ ¡Comienza el encuentro!', aggregate ? `📊 Global: ${aggregate.sh} - ${aggregate.sa}` : 'Al terreno de juego.'],
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
          let historyH = [...(prev.penalties.historyH || [])]; let historyA = [...(prev.penalties.historyA || [])];
          let newLogs = [...prev.logs]; let nextTurn = prev.penalties.turn;

          if (penPhase === 'att') {
            if (die <= attacker.att) { newLogs.unshift('🎯 ' + attacker.name + ' saca un ' + die + '. ¡A portería!'); penPhase = 'gk'; } 
            else {
              newLogs.unshift('❌ ' + attacker.name + ' falló el penalti (' + die + ').');
              if (isHome) { historyH = [...historyH, false]; shotsH++; } else { historyA = [...historyA, false]; shotsA++; }
              nextTurn = isHome ? 'A' : 'H'; penPhase = 'att';
            }
          } else {
            if (die > defender.def) {
              newLogs.unshift('⚽ ¡GOL de penalti! ' + attacker.name + ' marcó.');
              if (isHome) { historyH = [...historyH, true]; scoreH++; } else { historyA = [...historyA, true]; scoreA++; }
            } else {
              newLogs.unshift('🧤 ¡PARADÓN! El portero detuvo el penalti.');
              if (isHome) historyH = [...historyH, false]; else historyA = [...historyA, false];
            }
            if (isHome) shotsH++; else shotsA++;
            nextTurn = isHome ? 'A' : 'H'; penPhase = 'att';
          }

          let finished = false;
          if (penPhase === 'att') {
            if (shotsH >= 5 && shotsA >= 5) { if (scoreH !== scoreA && shotsH === shotsA) finished = true; }
            else if (scoreH > scoreA + (5 - shotsA) || scoreA > scoreH + (5 - shotsH)) finished = true;
          }
          if (finished) {
            newLogs.unshift('🏆 Ganador tanda: ' + (scoreH > scoreA ? prev.home.name : prev.away.name));
            return { ...prev, lastDie: die, logs: newLogs, finished: true, penalties: { scoreH, scoreA, shotsH, shotsA, finished: true, historyH, historyA } };
          }
          return { ...prev, lastDie: die, logs: newLogs, penalties: { scoreH, scoreA, shotsH, shotsA, turn: nextTurn, phase: penPhase, historyH, historyA } };
        }

        const isHome = prev.turn === 'H';
        const attacker = isHome ? prev.home : prev.away; const defender = isHome ? prev.away : prev.home;
        let newLogs = [...prev.logs]; let { scoreH, scoreA, phase: newPhase } = prev;

        if (newPhase === 'att') {
          if (die <= attacker.att) { newLogs.unshift('🎯 ' + attacker.name + ' saca ' + die + '. ¡Va a portería!'); newPhase = 'gk'; } 
          else { newLogs.unshift('❌ ' + attacker.name + ' falla (Dado: ' + die + ').'); return advanceTurn({ ...prev, lastDie: die, logs: newLogs, phase: 'att' }); }
        } else {
          if (die > defender.def) { newLogs.unshift('⚽ ¡GOL de ' + attacker.name + '! (Dado: ' + die + ')'); isHome ? scoreH++ : scoreA++; } 
          else { newLogs.unshift('🧤 ¡PARADÓN! Evitó el gol (Dado: ' + die + ').'); }
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

      if (needsPenalties) return { ...state, oppH: 0, oppA: 0, phase: 'penalties', penalties: { scoreH: 0, scoreA: 0, turn: 'H', shotsH: 0, shotsA: 0, phase: 'att', finished: false, historyH: [], historyA: [] }, logs: ['⚖️ Empate. ¡Penaltis!', ...state.logs] };
      return { ...state, oppH: 0, oppA: 0, finished: true, logs: ['🏁 Final.', ...state.logs] };
    }
    return { ...state, oppH: nextOppH, oppA: nextOppA, turn: nextTurn, phase: 'att' };
  };

  const simulateDivisionMatchday = (teams: any[], matchday: number, history: any[]) => {
    const schedule = generateLeagueSchedule(teams);
    if (matchday >= schedule.length) return null;
    const currentRound = Array.isArray(schedule) ? schedule[matchday] : [];
    const results = currentRound.map((m: any) => {
      const h = teams.find((t: any) => t.id === m.homeId); const a = teams.find((t: any) => t.id === m.awayId);
      let sh = 0, sa = 0;
      for(let i=0; i<(h?.opp||0); i++) if(Math.floor(Math.random()*6)+1 <= (h?.att||0) && Math.floor(Math.random()*6)+1 > (a?.def||0)) sh++;
      for(let i=0; i<(a?.opp||0); i++) if(Math.floor(Math.random()*6)+1 <= (a?.att||0) && Math.floor(Math.random()*6)+1 > (h?.def||0)) sa++;
      return { hId: m.homeId, aId: m.awayId, sh, sa };
    });
    const updatedTeams = teams.map((t: any) => {
      const res = results.find((r: any) => r.hId === t.id || r.aId === t.id);
      if (!res) return t;
      const isHome = res.hId === t.id;
      const gf = isHome ? res.sh : res.sa; const ga = isHome ? res.sa : res.sh;
      const w = gf > ga ? 1 : 0; const d = gf === ga ? 1 : 0; const l = gf < ga ? 1 : 0;
      return { ...t, p: t.p + 1, w: t.w + w, d: t.d + d, l: t.l + l, gf: t.gf + gf, ga: t.ga + ga, pts: t.pts + (w * 3 + d) };
    });
    const isFinished = matchday >= schedule.length - 1;
    const nextMatchday = matchday + 1;
    const newHistory = [{ day: matchday + 1, results }, ...history];
    return { updatedTeams, nextMatchday, newHistory, isFinished };
  };

  const processMatchday = () => {
    if (activeComp.type === 'league') {
      const isDiv2Context = matchState.isDiv2Context;
      const tArray = isDiv2Context ? activeComp.teams2 : activeComp.teams;
      const tMatchday = isDiv2Context ? activeComp.matchday2 : activeComp.matchday;
      const tHistory = isDiv2Context ? activeComp.history2 : activeComp.history;

      const schedule = generateLeagueSchedule(tArray);
      const currentRound = Array.isArray(schedule) ? schedule[tMatchday] : [];

      const results = currentRound.map((m: any) => {
        if (m.homeId === matchState.home.id || m.awayId === matchState.home.id || m.homeId === matchState.away.id || m.awayId === matchState.away.id) {
          if(m.homeId === matchState.home.id) return { hId: m.homeId, aId: m.awayId, sh: matchState.scoreH, sa: matchState.scoreA };
          if(m.homeId === matchState.away.id) return { hId: m.homeId, aId: m.awayId, sh: matchState.scoreA, sa: matchState.scoreH };
        }
        const h = tArray.find((t: any) => t.id === m.homeId); const a = tArray.find((t: any) => t.id === m.awayId);
        let sh = 0, sa = 0;
        for(let i=0; i<(h?.opp||0); i++) if(Math.floor(Math.random()*6)+1 <= (h?.att||0) && Math.floor(Math.random()*6)+1 > (a?.def||0)) sh++;
        for(let i=0; i<(a?.opp||0); i++) if(Math.floor(Math.random()*6)+1 <= (a?.att||0) && Math.floor(Math.random()*6)+1 > (h?.def||0)) sa++;
        return { hId: m.homeId, aId: m.awayId, sh, sa };
      });

      const updatedTeams = tArray.map((t: any) => {
        const res = results.find((r: any) => r.hId === t.id || r.aId === t.id);
        if (!res) return t;
        const isHome = res.hId === t.id;
        const gf = isHome ? res.sh : res.sa; const ga = isHome ? res.sa : res.sh;
        const w = gf > ga ? 1 : 0; const d = gf === ga ? 1 : 0; const l = gf < ga ? 1 : 0;
        return { ...t, p: t.p + 1, w: t.w + w, d: t.d + d, l: t.l + l, gf: t.gf + gf, ga: t.ga + ga, pts: t.pts + (w * 3 + d) };
      });

      const isFinished = tMatchday === schedule.length - 1;
      const nextMatchday = tMatchday + 1;
      const newHistory = [{ day: tMatchday + 1, results }, ...tHistory];

      // Datos de la división que el usuario jugó
      const playedDivUpdate: any = {};
      if (isDiv2Context) {
        playedDivUpdate.teams2 = updatedTeams;
        playedDivUpdate.history2 = newHistory;
        playedDivUpdate.matchday2 = nextMatchday;
        playedDivUpdate.showWinner2 = isFinished;
      } else {
        playedDivUpdate.teams = updatedTeams;
        playedDivUpdate.history = newHistory;
        playedDivUpdate.matchday = nextMatchday;
        playedDivUpdate.showWinner = isFinished;
      }

      // Simular simultáneamente la OTRA división
      const otherTeams = isDiv2Context ? activeComp.teams : activeComp.teams2;
      const otherMatchday = isDiv2Context ? activeComp.matchday : activeComp.matchday2;
      const otherHistory = isDiv2Context ? activeComp.history : activeComp.history2;
      const otherSchedule = generateLeagueSchedule(otherTeams);
      const otherNotFinished = otherMatchday < otherSchedule.length;

      if (otherTeams && otherTeams.length > 0 && otherNotFinished) {
        const otherResult = simulateDivisionMatchday(otherTeams, otherMatchday, otherHistory);
        if (otherResult) {
          if (isDiv2Context) {
            playedDivUpdate.teams = otherResult.updatedTeams;
            playedDivUpdate.history = otherResult.newHistory;
            playedDivUpdate.matchday = otherResult.nextMatchday;
            playedDivUpdate.showWinner = otherResult.isFinished;
          } else {
            playedDivUpdate.teams2 = otherResult.updatedTeams;
            playedDivUpdate.history2 = otherResult.newHistory;
            playedDivUpdate.matchday2 = otherResult.nextMatchday;
            playedDivUpdate.showWinner2 = otherResult.isFinished;
          }
        }
      }

      updateActiveComp(playedDivUpdate);

    } else {
       // Copas y Mundiales mantienen la lógica original sin divisiones múltiples
       // ... Lógica reducida de torneo (C1/C2) ...
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
                      results.push({ hId: m.homeId, aId: m.awayId, sh, sa, penH: null, penA: null });
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
          let newBracket = null;
          if (isEndOfGroups) newBracket = generateKnockoutBrackets({ ...activeComp, teams: updatedTeams });
           updateActiveComp({ teams: updatedTeams, history: [{ day: 'Jornada ' + nextMatchday, results }, ...activeComp.history], matchday: nextMatchday, phase: isEndOfGroups ? (newBracket.Octavos ? 'Octavos' : 'Cuartos') : 'groups', bracket: newBracket });
           
           // Check if user's team was eliminated in group stage
           if (isEndOfGroups) {
             const userTeamId = activeComp.userTeamId;
             const userGroup = activeComp.groups.find(g => g.teamIds.includes(userTeamId));
             if (userGroup) {
               const groupTeams = updatedTeams.filter(t => userGroup.teamIds.includes(t.id)).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
               const userPos = groupTeams.findIndex(t => t.id === userTeamId);
               if (userPos >= 2) {
                 setTimeout(() => setEliminatedModal({ compId: activeCompId, phase: 'Fase de Grupos' }), 500);
               }
             }
           }
       } else {
          // Eliminatorias
          const isChampions = activeCompId === 'C1';
          const phase = activeComp.phase;
          const isVuelta = isChampions && activeComp.matchday % 2 !== 0 && phase !== 'Final';
          const newBracket = { ...activeComp.bracket };
          const matchesToProcess = Array.isArray(newBracket[phase]) ? newBracket[phase] : [newBracket[phase]];
          const allResults = [];

          matchesToProcess.forEach(m => {
             let sh, sa, penH, penA;
             if (m.hId === matchState.home.id && m.aId === matchState.away.id) { sh = matchState.scoreH; sa = matchState.scoreA; penH = matchState.penalties?.scoreH; penA = matchState.penalties?.scoreA; } 
             else if (isVuelta && m.hId === matchState.away.id && m.aId === matchState.home.id) { sh = matchState.scoreA; sa = matchState.scoreH; penH = matchState.penalties?.scoreA; penA = matchState.penalties?.scoreH; } 
             else {
                const h = activeComp.teams.find(t => t.id === (isVuelta ? m.aId : m.hId)); const a = activeComp.teams.find(t => t.id === (isVuelta ? m.hId : m.aId));
                let simH = 0, simA = 0;
                for(let i=0; i<h.opp; i++) if(Math.floor(Math.random()*6)+1 <= h.att && Math.floor(Math.random()*6)+1 > a.def) simH++;
                for(let i=0; i<a.opp; i++) if(Math.floor(Math.random()*6)+1 <= a.att && Math.floor(Math.random()*6)+1 > h.def) simA++;
                if (isVuelta) { sh = simA; sa = simH; } else { sh = simH; sa = simA; }
                const isDraw = (isChampions && isVuelta && phase !== 'Final') ? (m.sh + sh === m.sa + sa) : (sh === sa);
                if (isDraw && (!isChampions || isVuelta || phase === 'Final')) {
                   let spH=0, spA=0, shH=0, shA=0;
                   const sim = (att, def) => (Math.floor(Math.random()*6)+1 <= att && Math.floor(Math.random()*6)+1 > def);
                   for(let i=0; i<5; i++){
                      if(sim(h.att, a.def)) spH++; shH++;
                      if(spH > spA + (5-shA) || spA > spH + (5-shH)) break;
                      if(sim(a.att, h.def)) spA++; shA++;
                      if(spH > spA + (5-shA) || spA > spH + (5-shH)) break;
                   }
                   while(spH===spA){ if(sim(h.att, a.def)) spH++; if(sim(a.att, h.def)) spA++; }
                   penH = spH; penA = spA;
                }
             }
             if (isVuelta) { m.sh2 = sh; m.sa2 = sa; } else { m.sh = sh; m.sa = sa; }
             if (penH !== undefined) { m.penH = penH; m.penA = penA; }
             allResults.push(isVuelta ? { hId: m.aId, aId: m.hId, sh: sa, sa: sh, penH: penA, penA: penH } : { hId: m.hId, aId: m.aId, sh, sa, penH, penA });
          });

          let nextPhase = phase, showWinner = false;
          if (!isChampions || isVuelta || phase === 'Final') {
             const winners = matchesToProcess.map(m => {
                const tH = isChampions && phase!=='Final' ? m.sh+m.sh2 : m.sh; const tA = isChampions && phase!=='Final' ? m.sa+m.sa2 : m.sa;
                if(tH>tA) return m.hId; if(tA>tH) return m.aId; return m.penH>m.penA ? m.hId : m.aId;
             });
             if (phase === 'Octavos') { nextPhase = 'Cuartos'; newBracket.Cuartos = Array(4).fill(0).map((_, i) => ({ id: 'C'+(i+1), hId: winners[i*2], aId: winners[i*2+1], sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null })); } 
             else if (phase === 'Cuartos') { nextPhase = 'Semis'; newBracket.Semis = Array(2).fill(0).map((_, i) => ({ id: 'S'+(i+1), hId: winners[i*2], aId: winners[i*2+1], sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null })); } 
             else if (phase === 'Semis') { nextPhase = 'Final'; newBracket.Final = [{ id: 'F1', hId: winners[0], aId: winners[1], sh: null, sa: null, penH: null, penA: null, sh2: null, sa2: null }]; } 
             else { nextPhase = 'Terminado'; showWinner = true; }
          }
           const updatedComp = { history: [{ day: phase + (isChampions ? (isVuelta ? ' (Vuelta)' : ' (Ida)') : ''), results: allResults }, ...activeComp.history], matchday: activeComp.matchday + 1, phase: nextPhase, bracket: newBracket, showWinner };
           updateActiveComp(updatedComp);
           if (showWinner) archiveCompetition(activeCompId, 1);

           // Check if user's team was eliminated in knockout
           if (!isChampions || isVuelta || phase === 'Final') {
             const userTeamId = activeComp.userTeamId;
             const winners = matchesToProcess.map(m => {
               const tH = isChampions && phase!=='Final' ? m.sh+m.sh2 : m.sh; const tA = isChampions && phase!=='Final' ? m.sa+m.sa2 : m.sa;
               if(tH>tA) return m.hId; if(tA>tH) return m.aId; return m.penH>m.penA ? m.hId : m.aId;
             });
             const wasInThisRound = matchesToProcess.some(m => m.hId === userTeamId || m.aId === userTeamId);
             const userAdvanced = winners.includes(userTeamId);
             if (wasInThisRound && !userAdvanced && !showWinner) {
               setTimeout(() => setEliminatedModal({ compId: activeCompId, phase }), 500);
             }
           }
       }
    }
    setCompView('main');
  };

  const handlePromotionAndNewSeason = () => {
    if (activeComp.type !== 'league') return;

    // Archivamos a los campeones
    archiveCompetition(activeCompId, 1);
    archiveCompetition(activeCompId, 2);

    const sorted1 = [...activeComp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
    const sorted2 = [...activeComp.teams2].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    const bottom3 = sorted1.slice(-3); // Descienden (18, 19, 20)
    const top3 = sorted2.slice(0, 3); // Ascienden (1, 2, 3)

    // Guardar stats originales de los que descienden
    const origStats = bottom3.map(t => ({ att: t.att, opp: t.opp, def: t.def }));

    // Aplicar stats fijos a los que descienden (boost en segunda)
    const boostedRelegated = [
      { ...bottom3[0], att: 5, opp: 5, def: 3 }, // 18º
      { ...bottom3[1], att: 4, opp: 4, def: 4 }, // 19º
      { ...bottom3[2], att: 3, opp: 4, def: 3 }  // 20º
    ];

    // Aplicar stats originales a los que ascienden
    const adjustedPromoted = [
      { ...top3[0], att: origStats[0].att, opp: origStats[0].opp, def: origStats[0].def },
      { ...top3[1], att: origStats[1].att, opp: origStats[1].opp, def: origStats[1].def },
      { ...top3[2], att: origStats[2].att, opp: origStats[2].opp, def: origStats[2].def }
    ];

    const resetStats = (t) => ({ ...t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });

    const remaining1 = sorted1.slice(0, -3).map(resetStats);
    const remaining2 = sorted2.slice(3).map(resetStats);

    const nextTeams1 = [...remaining1, ...adjustedPromoted.map(resetStats)];
    const nextTeams2 = [...remaining2, ...boostedRelegated.map(resetStats)];

    updateActiveComp({
      teams: nextTeams1,
      teams2: nextTeams2,
      matchday: 0,
      matchday2: 0,
      history: [],
      history2: [],
      showWinner: false,
      showWinner2: false
    });

  };

  const handleTotalReset = (compId) => {
    const defaultData = getDefaultComps()[compId];
    updateActiveComp({
      teams: defaultData.teams,
      teams2: defaultData.teams2,
      matchday: 0, matchday2: 0, history: [], history2: [],
      showWinner: false, showWinner2: false, phase: defaultData.phase, bracket: null
    });
    setCompView('main');
  };

  const CompetitionView = () => {
    if (!activeComp) return null;
    const hasStarted = activeComp.type === 'league' 
      ? (activeComp.matchday > 0 || activeComp.matchday2 > 0 || activeComp.history?.length > 0)
      : (activeComp.matchday > 0 || activeComp.history?.length > 0);

    const isLeague = activeComp.type === 'league';
    const isDiv2 = viewDiv === 2 && isLeague;

    // Selectores dinámicos basados en la división actual
    const currentTeams = isDiv2 ? activeComp.teams2 : activeComp.teams;
    const currentMatchday = isDiv2 ? activeComp.matchday2 : activeComp.matchday;
    const currentHistory = isDiv2 ? activeComp.history2 : activeComp.history;
    const currentShowWinner = isDiv2 ? activeComp.showWinner2 : activeComp.showWinner;

    if (!currentTeams || currentTeams.length === 0) {
      return (
        <div className='flex-grow flex flex-col items-center justify-center text-center p-8'>
          <div className='w-24 h-24 bg-slate-900/30 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl'><Trophy size={48} className='text-slate-400' /></div>
          <h2 className='text-3xl font-black italic uppercase mb-2 text-white drop-shadow-md'>{activeComp?.name}</h2>
          <p className='text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-10 drop-shadow-md'>Faltan equipos en {isDiv2 ? '2ª' : '1ª'} División.</p>
          <div className='space-y-4 w-full max-w-xs'>
            {!isLeague && (
              <>
                <button onClick={() => {
                   const compsState = JSON.parse(window.localStorage.getItem(`${APP_ID}_comps`));
                   updateActiveComp(getAutoFillData(activeCompId, compsState));
                }} className='w-full bg-blue-600/80 backdrop-blur-md hover:bg-blue-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2'>
                  <Wand2 size={16}/> Auto-Rellenar
                </button>
                <button onClick={() => {
                   const compsState = JSON.parse(window.localStorage.getItem(`${APP_ID}_comps`));
                   updateActiveComp(getShuffleData(activeCompId, compsState));
                }} className='w-full bg-emerald-600/80 backdrop-blur-md hover:bg-emerald-500 text-white py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2'>
                  <Shuffle size={16}/> Sorteo Dinámico
                </button>
              </>
            )}
            <button onClick={() => setView('hub')} className='w-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-slate-200 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest transition-all active:scale-95'>Volver al Inicio</button>
          </div>
        </div>
      );
    }

    const sortedTeams = [...currentTeams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));

    const currentUserTeamId = isDiv2 ? (activeComp.userTeamId2 || activeComp.teams2?.[0]?.id) : activeComp.userTeamId;
    const userTeam = currentTeams.find(t => t.id === currentUserTeamId) || currentTeams[0];

    const winner = useMemo(() => {
      if (!currentTeams || currentTeams.length === 0) return null;
      if (isLeague) return sortedTeams[0];
      const final = activeComp.bracket?.Final?.[0] || activeComp.bracket?.Final;
      if (final && final.sh !== null) {
        if (final.sh > final.sa) return activeComp.teams.find(t => t.id === final.hId);
        if (final.sa > final.sh) return activeComp.teams.find(t => t.id === final.aId);
        return activeComp.teams.find(t => t.id === (final.penH > final.penA ? final.hId : final.aId));
      }
      return currentTeams[0];
    }, [activeComp, currentTeams, isLeague, sortedTeams]);

    useEffect(() => {
      if (!isLeague && activeComp.phase !== 'groups' && !activeComp.bracket) {
        const newBracket = generateKnockoutBrackets(activeComp);
        if (newBracket) updateActiveComp({ bracket: newBracket });
      }
    }, [activeComp?.phase, activeComp?.bracket, isLeague]);

    const getGroupMatch = () => {
      if (!currentTeams || currentTeams.length === 0) return null;
      if (isLeague) return (generateLeagueSchedule(currentTeams)[currentMatchday] || []).find(m => m.homeId === userTeam.id || m.awayId === userTeam.id);

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

    const homeTeam = currentTeams.find(t => t.id === homeId);
    const awayTeam = currentTeams.find(t => t.id === awayId);

    // Sistema de validación de ascensos (solo Ligas)
    const isMax1 = isLeague && activeComp.teams && activeComp.matchday >= generateLeagueSchedule(activeComp.teams).length;
    const isMax2 = isLeague && activeComp.teams2 && activeComp.matchday2 >= generateLeagueSchedule(activeComp.teams2).length;
    const readyForPromotion = isLeague && isMax1 && isMax2 && !activeComp.showWinner && !activeComp.showWinner2;

    if (compView === 'config') return (
      <ConfigPanel 
        initialComp={activeComp} 
        compId={activeCompId} 
        onSave={(draftData) => { updateActiveComp(draftData); setCompView('main'); }}
        onCancel={() => setCompView('main')}
        onTotalReset={handleTotalReset}
      />
    );

    if (compView === 'main') return (
      <div className='flex-grow px-4 pb-20 relative'>

        {/* SAVE MODAL */}
        {/* SAVE MODAL */}
        <AnimatePresence>
          {showSaveModal && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className='fixed top-4 right-4 z-[80]'>
              <div className='bg-emerald-600/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/40 shadow-[0_0_30px_rgba(52,211,153,0.4)] flex items-center gap-3'>
                <div className='w-8 h-8 bg-emerald-500/30 rounded-full flex items-center justify-center'>
                  <Check size={16} className='text-white' />
                </div>
                <div>
                  <p className='text-[11px] font-black uppercase italic text-white'>¡Guardado!</p>
                  <p className='text-[8px] font-bold text-emerald-200 uppercase tracking-wider'>Progreso almacenado</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ELIMINATED MODAL - Switch team in cups (groups + knockout) */}
        <AnimatePresence>
          {eliminatedModal && activeComp && activeComp.type !== 'league' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md'>
              <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} className='bg-slate-900/95 backdrop-blur-xl w-full max-w-sm rounded-[2.5rem] border border-red-500/30 shadow-2xl relative overflow-hidden max-h-[85vh] flex flex-col'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent' />
                <div className='p-6 text-center shrink-0'>
                  <AlertTriangle size={48} className='text-red-400 mx-auto mb-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]' />
                  <h2 className='text-xl font-black italic uppercase text-red-400 mb-2'>¡Eliminado!</h2>
                  <p className='text-[11px] font-bold text-slate-300'>Tu equipo fue eliminado en <span className='text-red-300 uppercase'>{eliminatedModal.phase}</span>.</p>
                  <p className='text-[10px] font-bold text-slate-400 mt-1'>Elige un nuevo equipo para continuar el torneo.</p>
                </div>
                <div className='overflow-y-auto flex-grow px-4 pb-4 custom-scrollbar'>
                  <div className='grid gap-2'>
                    {(() => {
                      // Get remaining teams based on current phase
                      const bracket = activeComp.bracket;
                      const nextPhase = activeComp.phase;
                      let remainingTeams: any[] = [];
                      
                      if (bracket && bracket[nextPhase]) {
                        // Knockout: get teams from next round bracket
                        const nextMatches = Array.isArray(bracket[nextPhase]) ? bracket[nextPhase] : [bracket[nextPhase]];
                        const remainingIds = new Set<number>();
                        nextMatches.forEach((m: any) => { if (m?.hId) remainingIds.add(m.hId); if (m?.aId) remainingIds.add(m.aId); });
                        remainingTeams = activeComp.teams.filter((t: any) => remainingIds.has(t.id));
                      } else if (bracket) {
                        // After group stage: get all teams still in bracket (any phase)
                        const allIds = new Set<number>();
                        ['Octavos', 'Cuartos', 'Semis', 'Final'].forEach(p => {
                          const matches = bracket[p];
                          if (matches) {
                            const arr = Array.isArray(matches) ? matches : [matches];
                            arr.forEach((m: any) => { if (m?.hId) allIds.add(m.hId); if (m?.aId) allIds.add(m.aId); });
                          }
                        });
                        remainingTeams = activeComp.teams.filter((t: any) => allIds.has(t.id));
                      }

                      return remainingTeams.map((t: any) => (
                        <button key={t.id} onClick={() => {
                          updateActiveComp({ userTeamId: t.id });
                          setEliminatedModal(null);
                        }} className='flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-slate-800/40 hover:bg-blue-600/30 hover:border-blue-400/50 active:scale-95 transition-all backdrop-blur-md'>
                          <Shield color1={t.color1} color2={t.color2} initial={t.name} size='sm' isFlag={t.isFlag} />
                          <div className='text-left'>
                            <p className='text-[10px] font-black uppercase italic text-white'>{t.name}</p>
                            <p className='text-[8px] font-bold text-slate-300'>{t.att}/{t.opp}/{t.def}</p>
                          </div>
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESET CONFIRM MODAL */}
        <AnimatePresence>
          {resetConfirmModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md'>
              <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} className='bg-slate-900/95 backdrop-blur-xl w-full max-w-sm rounded-[2.5rem] border border-red-500/30 shadow-2xl relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent' />
                <div className='p-8 text-center'>
                  <div className='w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(239,68,68,0.3)]'>
                    <RotateCcw size={36} className='text-red-400' />
                  </div>
                  <h2 className='text-xl font-black italic uppercase text-red-400 mb-3'>¿Reiniciar Temporada?</h2>
                  {isLeague ? (
                    <div className='space-y-2 mb-6'>
                      <p className='text-[11px] font-bold text-slate-300'>Se reiniciarán <span className='text-white'>ambas divisiones</span> de {activeComp.name}:</p>
                      <div className='flex gap-2 justify-center mt-3'>
                        <div className='bg-blue-900/30 border border-blue-500/20 px-3 py-2 rounded-xl'>
                          <p className='text-[9px] font-black text-blue-400 uppercase'>1ª División</p>
                          <p className='text-[8px] text-slate-400 font-bold'>Jornada {activeComp.matchday}</p>
                        </div>
                        <div className='bg-emerald-900/30 border border-emerald-500/20 px-3 py-2 rounded-xl'>
                          <p className='text-[9px] font-black text-emerald-400 uppercase'>2ª División</p>
                          <p className='text-[8px] text-slate-400 font-bold'>Jornada {activeComp.matchday2 || 0}</p>
                        </div>
                      </div>
                      <p className='text-[9px] font-bold text-red-400/80 mt-2'>⚠️ Todo el progreso, estadísticas y resultados se perderán.</p>
                    </div>
                  ) : (
                    <div className='mb-6'>
                      <p className='text-[11px] font-bold text-slate-300'>Se reiniciará todo el torneo de <span className='text-white'>{activeComp.name}</span>.</p>
                      <p className='text-[9px] font-bold text-red-400/80 mt-2'>⚠️ Equipos, grupos y resultados se restaurarán.</p>
                    </div>
                  )}
                  <div className='flex gap-3'>
                    <button onClick={() => setResetConfirmModal(false)} className='flex-1 bg-slate-800/80 border border-white/10 text-slate-200 py-3.5 rounded-2xl text-[10px] font-black uppercase italic tracking-widest active:scale-95 transition-all'>Cancelar</button>
                    <button onClick={() => { handleTotalReset(activeCompId); setResetConfirmModal(false); }} className='flex-1 bg-gradient-to-r from-red-700/80 to-red-600/80 border-2 border-red-400/40 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase italic tracking-widest active:scale-95 transition-all shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] hover:border-red-300/60 flex items-center justify-center gap-2'>
                      <RotateCcw size={14} className='text-red-200'/> Reiniciar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(currentShowWinner || readyForPromotion) && compView === 'main' && (() => {
            const sorted1 = activeComp.teams ? [...activeComp.teams].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)) : [];
            const sorted2 = activeComp.teams2 ? [...activeComp.teams2].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga)) : [];
            const champion1 = sorted1[0];
            const champion2 = sorted2[0];
            const displayTeams = championModalDiv === 2 ? sorted2 : sorted1;
            const displayHistory = championModalDiv === 2 ? (activeComp.history2 || []) : (activeComp.history || []);
            const displayAllTeams = championModalDiv === 2 ? (activeComp.teams2 || []) : (activeComp.teams || []);
            const relegated = sorted1.slice(-3);
            const promoted = sorted2.slice(0, 3);
            const origStats = relegated.map(t => ({ att: t.att, opp: t.opp, def: t.def }));
            const newPromotedStats = [
              { att: origStats[0]?.att, opp: origStats[0]?.opp, def: origStats[0]?.def },
              { att: origStats[1]?.att, opp: origStats[1]?.opp, def: origStats[1]?.def },
              { att: origStats[2]?.att, opp: origStats[2]?.opp, def: origStats[2]?.def }
            ];
            const newRelegatedStats = [
              { att: 5, opp: 5, def: 3 },
              { att: 4, opp: 4, def: 4 },
              { att: 3, opp: 4, def: 3 }
            ];

            return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[60] bg-slate-950/98 backdrop-blur-xl flex flex-col'>
              {/* Confetti removed */}
              
              {/* Header */}
               <div className='shrink-0 pt-3 pb-2 px-4'>
                <div className='flex items-center justify-center gap-3'>
                  <Trophy size={36} className='text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]' />
                  <div>
                    <h1 className='text-xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-md'>¡CAMPEÓN!</h1>
                    <p className='text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]'>{activeComp.name}</p>
                  </div>
                </div>
              </div>

              {/* Winner showcase */}
              <div className='shrink-0 px-4 pb-3'>
                <div className='bg-gradient-to-br from-yellow-500/15 to-amber-600/10 border border-yellow-500/30 rounded-2xl p-3 shadow-[0_0_30px_rgba(234,179,8,0.1)]'>
                  <div className='flex items-center gap-3'>
                    <Shield color1={winner?.color1} color2={winner?.color2} initial={winner?.name} size='md' isFlag={winner?.isFlag} />
                    <div className='flex-1 min-w-0'>
                      <h2 className='text-base font-black uppercase italic text-white drop-shadow-md truncate'>{winner?.name}</h2>
                      <p className='text-[8px] font-bold text-yellow-400/80 uppercase tracking-widest'>
                        {isDiv2 ? '2ª División' : (isLeague ? '1ª División' : activeComp.name)}
                      </p>
                      {winner && (
                        <div className='flex gap-1.5 mt-1.5 flex-wrap'>
                          <span className='text-[9px] font-black bg-yellow-500/25 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-500/40'>{winner.pts} PTS</span>
                          <span className='text-[9px] font-bold bg-slate-800/70 text-slate-200 px-2 py-0.5 rounded-full border border-white/10'>{winner.w}G {winner.d}E {winner.l}P</span>
                          <span className='text-[9px] font-bold bg-slate-800/70 text-slate-200 px-2 py-0.5 rounded-full border border-white/10'>GF:{winner.gf} GC:{winner.ga}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className='flex mx-4 bg-slate-900/80 rounded-2xl border border-white/10 p-0.5 shrink-0'>
                {[
                  { key: 'stats', label: '📊 Clasificación' },
                  { key: 'results', label: '📋 Resultados' },
                  ...(!isLeague ? [{ key: 'bracket', label: '⚔️ Llaves' }] : []),
                  ...(isLeague ? [{ key: 'promotions', label: '↕️ Asc/Desc' }] : [])
                ].map(tab => (
                  <button key={tab.key} onClick={() => setChampionModalTab(tab.key as any)} className={`flex-1 py-2 text-[8px] font-black uppercase italic tracking-wider rounded-xl transition-all ${championModalTab === tab.key ? 'text-yellow-400 bg-yellow-500/15 shadow-inner' : 'text-slate-400 hover:text-white'}`}>{tab.label}</button>
                ))}
              </div>

              {/* Div switcher for leagues */}
              {isLeague && championModalTab !== 'champion' && (
                <div className='flex mx-4 mt-2 bg-slate-800/60 p-0.5 rounded-xl border border-white/10 shrink-0'>
                  <button onClick={() => setChampionModalDiv(1)} className={`flex-1 py-1.5 text-[9px] font-black uppercase italic rounded-lg transition-all ${championModalDiv === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>1ª División</button>
                  <button onClick={() => setChampionModalDiv(2)} className={`flex-1 py-1.5 text-[9px] font-black uppercase italic rounded-lg transition-all ${championModalDiv === 2 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}>2ª División</button>
                </div>
              )}

              {/* Content area */}
              <div className='flex-grow overflow-y-auto px-4 py-4 custom-scrollbar'>
                {/* TAB: STATS */}
                {championModalTab === 'stats' && (
                  <div>
                    {isLeague ? (
                      <>
                        <h3 className='text-xs font-black uppercase text-slate-200 mb-3 text-center'>Clasificación {championModalDiv === 2 ? '2ª' : '1ª'} Div.</h3>
                        <div className='bg-slate-900/30 rounded-2xl border border-white/10 overflow-hidden'>
                          <table className='w-full text-left border-collapse'>
                            <thead className='bg-[#0f172a] sticky top-0 z-10'>
                              <tr className='text-[8px] font-black uppercase italic text-slate-400'>
                                <th className='p-2 sticky left-0 z-20 bg-[#0f172a]' style={{ minWidth: '28px' }}>Pos</th>
                                <th className='p-2 sticky left-[28px] z-20 bg-[#0f172a]' style={{ minWidth: '110px' }}>Equipo</th>
                                <th className='p-2 text-center sticky left-[138px] z-20 bg-[#0f172a] border-r border-white/10'>PJ</th>
                                <th className='p-2 text-center'>G</th><th className='p-2 text-center'>E</th><th className='p-2 text-center'>P</th>
                                <th className='p-2 text-center'>GF</th><th className='p-2 text-center'>GC</th><th className='p-2 text-center'>DG</th>
                                <th className='p-2 text-center text-emerald-400'>Pts</th>
                              </tr>
                            </thead>
                          </table>
                          <div className='overflow-x-auto custom-scrollbar' style={{ maxHeight: '50vh' }}>
                            <table className='w-full text-left border-collapse min-w-[480px]'>
                              <tbody className='divide-y divide-white/5'>
                                {displayTeams.map((t, i) => {
                                  const isPromo = championModalDiv === 2 && i < 3;
                                  const isReleg = championModalDiv === 1 && i >= displayTeams.length - 3;
                                  const rowBg = i === 0 ? 'bg-yellow-500/15' : isPromo ? 'bg-emerald-900/20' : isReleg ? 'bg-red-900/20' : '';
                                  return (
                                    <tr key={t.id} className={rowBg}>
                                      <td className={'p-2 text-[10px] font-black italic sticky left-0 z-10 bg-[#0f172a] ' + (i === 0 ? 'text-yellow-400' : isPromo ? 'text-emerald-400' : isReleg ? 'text-red-400' : 'text-slate-300')} style={{ minWidth: '28px' }}>{i+1}</td>
                                      <td className='p-2 sticky left-[28px] z-10 bg-[#0f172a]' style={{ minWidth: '110px' }}>
                                        <div className='flex items-center gap-1.5'>
                                          <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' isFlag={t.isFlag}/>
                                          <span className='text-[9px] font-bold uppercase truncate italic max-w-[80px]'>{t.name}</span>
                                        </div>
                                      </td>
                                      <td className='p-2 text-center text-[10px] font-bold sticky left-[138px] z-10 bg-[#0f172a] border-r border-white/10'>{t.p}</td>
                                      <td className='p-2 text-center text-[10px] font-bold'>{t.w}</td>
                                      <td className='p-2 text-center text-[10px] font-bold'>{t.d}</td>
                                      <td className='p-2 text-center text-[10px] font-bold'>{t.l}</td>
                                      <td className='p-2 text-center text-[10px] font-bold'>{t.gf}</td>
                                      <td className='p-2 text-center text-[10px] font-bold'>{t.ga}</td>
                                      <td className='p-2 text-center text-[10px] font-bold'>{t.gf - t.ga}</td>
                                      <td className='p-2 text-center text-[10px] font-black text-emerald-400'>{t.pts}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className='text-xs font-black uppercase text-slate-200 mb-3 text-center'>Clasificación por Grupo</h3>
                        <div className='space-y-4'>
                          {(activeComp.groups || []).map((group, gi) => {
                            const groupTeams = (activeComp.teams || []).filter(t => Array.isArray(group.teamIds) && group.teamIds.includes(t.id)).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
                            return (
                              <div key={gi} className='bg-slate-900/30 rounded-2xl border border-white/10 overflow-hidden'>
                                <div className='bg-[#0f172a] p-2 border-b border-white/10'>
                                  <h4 className='text-[10px] font-black uppercase text-blue-400 flex items-center gap-1.5'><ShieldIcon size={10} /> {group.name}</h4>
                                </div>
                                {/* Fixed header */}
                                <table className='w-full text-left border-collapse'>
                                  <thead className='bg-[#0f172a]'>
                                    <tr className='text-[8px] font-black uppercase italic text-slate-400'>
                                      <th className='p-1.5 sticky left-0 z-20 bg-[#0f172a]' style={{ minWidth: '24px' }}>Pos</th>
                                      <th className='p-1.5 sticky left-[24px] z-20 bg-[#0f172a]' style={{ minWidth: '90px' }}>Equipo</th>
                                      <th className='p-1.5 text-center sticky left-[114px] z-20 bg-[#0f172a] border-r border-white/10'>PJ</th>
                                      <th className='p-1.5 text-center'>G</th><th className='p-1.5 text-center'>E</th><th className='p-1.5 text-center'>P</th>
                                      <th className='p-1.5 text-center'>GF</th><th className='p-1.5 text-center'>GC</th><th className='p-1.5 text-center'>DG</th>
                                      <th className='p-1.5 text-center text-emerald-400'>Pts</th>
                                    </tr>
                                  </thead>
                                </table>
                                <div className='overflow-x-auto custom-scrollbar'>
                                  <table className='w-full text-left border-collapse min-w-[400px]'>
                                    <tbody className='divide-y divide-white/5'>
                                      {groupTeams.map((t, i) => (
                                        <tr key={t.id} className={i < 2 ? 'bg-emerald-900/15' : ''}>
                                          <td className='p-1.5 text-[9px] font-black italic text-slate-300 sticky left-0 z-10 bg-[#0f172a]' style={{ minWidth: '24px' }}>{i+1}</td>
                                          <td className='p-1.5 sticky left-[24px] z-10 bg-[#0f172a]' style={{ minWidth: '90px' }}>
                                            <div className='flex items-center gap-1'>
                                              <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs' isFlag={t.isFlag}/>
                                              <span className='text-[8px] font-bold uppercase truncate italic max-w-[65px]'>{t.name}</span>
                                            </div>
                                          </td>
                                          <td className='p-1.5 text-center text-[9px] font-bold sticky left-[114px] z-10 bg-[#0f172a] border-r border-white/10'>{t.p}</td>
                                          <td className='p-1.5 text-center text-[9px] font-bold'>{t.w}</td>
                                          <td className='p-1.5 text-center text-[9px] font-bold'>{t.d}</td>
                                          <td className='p-1.5 text-center text-[9px] font-bold'>{t.l}</td>
                                          <td className='p-1.5 text-center text-[9px] font-bold'>{t.gf}</td>
                                          <td className='p-1.5 text-center text-[9px] font-bold'>{t.ga}</td>
                                          <td className='p-1.5 text-center text-[9px] font-bold'>{t.gf - t.ga}</td>
                                          <td className='p-1.5 text-center text-[9px] font-black text-emerald-400'>{t.pts}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB: RESULTS */}
                {championModalTab === 'results' && (
                  <div>
                    <h3 className='text-xs font-black uppercase text-slate-200 mb-3 text-center'>Resultados {championModalDiv === 2 ? '2ª' : '1ª'} Div.</h3>
                    <div className='space-y-3'>
                      {displayHistory.length === 0 && <p className='text-center text-[10px] text-slate-400 italic py-8'>No hay resultados.</p>}
                      {displayHistory.slice(0, 5).map((h, i) => (
                        <div key={i} className='bg-black/20 rounded-xl p-2.5 border border-white/5'>
                          <h4 className='text-[8px] font-black uppercase text-blue-300 mb-1.5'>Jornada {h.day}</h4>
                          <div className='space-y-1'>
                            {Array.isArray(h.results) && h.results.map((r, ri) => {
                              const home = displayAllTeams.find(t => t.id === r.hId);
                              const away = displayAllTeams.find(t => t.id === r.aId);
                              return (
                                <div key={ri} className='flex items-center justify-between text-[8px] py-0.5'>
                                  <div className='flex items-center gap-1 w-20 truncate'>
                                    <Shield color1={home?.color1} color2={home?.color2} initial={home?.name} size='xs' isFlag={home?.isFlag}/>
                                    <span className='font-bold uppercase truncate'>{home?.name}</span>
                                  </div>
                                  <span className='font-black bg-slate-800/60 px-1.5 rounded tabular-nums'>{r.sh}-{r.sa}</span>
                                  <div className='flex items-center gap-1 w-20 justify-end truncate'>
                                    <span className='font-bold uppercase truncate'>{away?.name}</span>
                                    <Shield color1={away?.color1} color2={away?.color2} initial={away?.name} size='xs' isFlag={away?.isFlag}/>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {displayHistory.length > 5 && <p className='text-center text-[8px] text-slate-400 italic'>... y {displayHistory.length - 5} jornadas más</p>}
                    </div>
                  </div>
                )}

                {championModalTab === 'bracket' && !isLeague && activeComp.bracket && (
                  <div>
                    <h3 className='text-sm font-black uppercase text-slate-200 mb-4 text-center'>Eliminatorias</h3>
                    <div className='flex gap-6 overflow-x-auto custom-scrollbar pb-4'>
                      {['Octavos', 'Cuartos', 'Semis', 'Final'].filter(p => activeComp.bracket[p]).map(phase => (
                        <div key={phase} className='min-w-[240px] flex-shrink-0'>
                          <h4 className='text-[10px] font-black uppercase text-blue-300 mb-3 px-3 border-l-2 border-blue-500 bg-slate-900/40 rounded-r-xl py-1'>{phase}</h4>
                          <div className='grid grid-cols-1 gap-2.5'>
                            {(Array.isArray(activeComp.bracket[phase]) ? activeComp.bracket[phase] : [activeComp.bracket[phase]]).filter(m => m !== null).map((m, mi) => {
                              const h = activeComp.teams.find(t => t.id === m.hId);
                              const a = activeComp.teams.find(t => t.id === m.aId);
                              const isChampions = activeCompId === 'C1';
                              let bWinner = null;
                              if ((isChampions && phase !== 'Final' ? m.sh2 !== null : m.sh !== null)) {
                                if (isChampions && phase !== 'Final') {
                                  const totH = (m.sh || 0) + (m.sh2 || 0); const totA = (m.sa || 0) + (m.sa2 || 0);
                                  if (totH > totA) bWinner = h; else if (totA > totH) bWinner = a; else if (m.penH !== null && m.penH !== undefined) bWinner = m.penH > m.penA ? h : a;
                                } else {
                                  if (m.sh > m.sa) bWinner = h; else if (m.sa > m.sh) bWinner = a; else if (m.penH !== null && m.penH !== undefined) bWinner = m.penH > m.penA ? h : a;
                                }
                              }
                              return (
                                <div key={mi} className='bg-slate-900/40 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5'>
                                  <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-1.5 flex-1 truncate'>
                                      <Shield color1={h?.color1} color2={h?.color2} initial={h?.name} size='xs' isFlag={h?.isFlag} />
                                      <span className={'text-[9px] font-bold uppercase italic truncate ' + (h ? '' : 'text-slate-500')}>{h?.name || 'TBD'}</span>
                                    </div>
                                    <div className='flex items-center gap-1 tabular-nums font-black italic text-[10px] bg-black/30 px-1.5 py-0.5 rounded'>
                                      {m.sh !== null && <span>{m.sh}</span>}{isChampions && m.sh2 !== null && <span className='text-slate-400 text-[8px]'>({m.sh2})</span>}{m.penH !== null && m.penH !== undefined && <span className='text-red-400 text-[8px] font-black'>[{m.penH}]</span>}
                                    </div>
                                  </div>
                                  <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-1.5 flex-1 truncate'>
                                      <Shield color1={a?.color1} color2={a?.color2} initial={a?.name} size='xs' isFlag={a?.isFlag} />
                                      <span className={'text-[9px] font-bold uppercase italic truncate ' + (a ? '' : 'text-slate-500')}>{a?.name || 'TBD'}</span>
                                    </div>
                                    <div className='flex items-center gap-1 tabular-nums font-black italic text-[10px] bg-black/30 px-1.5 py-0.5 rounded'>
                                      {m.sa !== null && <span>{m.sa}</span>}{isChampions && m.sa2 !== null && <span className='text-slate-400 text-[8px]'>({m.sa2})</span>}{m.penA !== null && m.penA !== undefined && <span className='text-red-400 text-[8px] font-black'>[{m.penA}]</span>}
                                    </div>
                                  </div>
                                  {bWinner && (
                                    <div className='mt-1 pt-1.5 border-t border-white/10 flex items-center justify-center gap-1.5 bg-emerald-900/30 rounded-b-lg py-1'>
                                      <span className='text-[7px] font-black uppercase text-emerald-300 italic'>Pasa:</span>
                                      <Shield color1={bWinner.color1} color2={bWinner.color2} initial={bWinner.name} size='xs' isFlag={bWinner.isFlag} />
                                      <span className='text-[8px] font-black uppercase italic truncate max-w-[80px]'>{bWinner.name}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {championModalTab === 'promotions' && isLeague && (
                  <div className='space-y-4 text-left'>
                    <div className='bg-emerald-900/20 border border-emerald-500/20 p-3 rounded-2xl'>
                      <h4 className='text-[9px] font-black uppercase text-emerald-400 mb-2 flex items-center gap-1.5'><ArrowUpCircle size={13}/> Ascienden a 1ª</h4>
                      <div className='space-y-1.5'>
                        {promoted.map((t, i) => (
                          <div key={t.id} className='flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/5'>
                            <span className='text-[9px] font-black text-emerald-300 w-3'>{i+1}</span>
                            <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs'/>
                            <span className='text-[9px] font-bold uppercase truncate flex-grow'>{t.name}</span>
                            <span className='text-[7px] font-bold text-slate-400'>{t.att}/{t.opp}/{t.def}</span>
                            <span className='text-[7px] text-emerald-400'>→</span>
                            <span className='text-[7px] font-black text-emerald-300'>{newPromotedStats[i]?.att}/{newPromotedStats[i]?.opp}/{newPromotedStats[i]?.def}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='bg-red-900/20 border border-red-500/20 p-3 rounded-2xl'>
                      <h4 className='text-[9px] font-black uppercase text-red-400 mb-2 flex items-center gap-1.5'><ArrowDownCircle size={13}/> Descienden a 2ª</h4>
                      <div className='space-y-1.5'>
                        {relegated.map((t, i) => (
                          <div key={t.id} className='flex items-center gap-2 bg-black/30 p-2 rounded-xl border border-white/5'>
                            <span className='text-[9px] font-black text-red-300 w-3'>↓</span>
                            <Shield color1={t.color1} color2={t.color2} initial={t.name} size='xs'/>
                            <span className='text-[9px] font-bold uppercase truncate flex-grow'>{t.name}</span>
                            <span className='text-[7px] font-bold text-slate-400'>{t.att}/{t.opp}/{t.def}</span>
                            <span className='text-[7px] text-red-400'>→</span>
                            <span className='text-[7px] font-black text-red-300'>{newRelegatedStats[i]?.att}/{newRelegatedStats[i]?.opp}/{newRelegatedStats[i]?.def}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer buttons */}
              <div className='shrink-0 p-4 border-t border-white/10 bg-slate-950/80 space-y-2'>
                {isLeague && readyForPromotion && championModalTab !== 'promotions' ? (
                  <button onClick={() => setChampionModalTab('promotions')} className='w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2'>
                    <ArrowUpCircle size={16}/> Ver Ascensos y Descensos
                  </button>
                ) : isLeague && readyForPromotion && championModalTab === 'promotions' ? (
                  <button onClick={() => {
                    setChampionModalTab('champion');
                    setChampionModalDiv(1);
                    handlePromotionAndNewSeason();
                  }} className='w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2'>
                    <RotateCcw size={16}/> Nueva Temporada (1ª y 2ª Div)
                  </button>
                ) : !isLeague ? (
                  <div className='flex gap-2'>
                    <button onClick={() => {
                       setChampionModalTab('champion');
                       setChampionModalDiv(1);
                       updateActiveComp({ showWinner: false });
                    }} className='flex-1 bg-slate-800/80 border border-white/10 text-slate-200 py-3.5 rounded-2xl text-[10px] font-black uppercase italic tracking-widest active:scale-95 transition-all'>Cerrar</button>
                    <button onClick={() => {
                       setChampionModalTab('champion');
                       setChampionModalDiv(1);
                       handleTotalReset(activeCompId);
                       updateActiveComp({ showWinner: false });
                    }} className='flex-[2] bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 py-3.5 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2'>
                      <RotateCcw size={14}/> Nueva Temporada
                    </button>
                  </div>
                ) : (
                  <button onClick={() => {
                     setChampionModalTab('champion');
                     setChampionModalDiv(1);
                     if (isDiv2) updateActiveComp({ showWinner2: false }); else updateActiveComp({ showWinner: false });
                  }} className='w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 py-4 rounded-2xl text-[11px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all'>Continuar</button>
                )}
              </div>
            </motion.div>
            );
          })()}
        </AnimatePresence>

        <header className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <button onClick={() => setView('hub')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl text-slate-200 border border-white/10 active:scale-95 transition-all'><ChevronLeft /></button>
            <div>
              <h2 className='text-xl font-black italic uppercase truncate drop-shadow-md'>{activeComp?.name}</h2>
              {activeComp.type !== 'league' && <span className='text-[8px] font-black text-blue-300 uppercase tracking-widest drop-shadow-md'>Fase: {activeComp.phase}</span>}
            </div>
          </div>
          <button onClick={manualSave} className='p-2 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-500/40 active:scale-95'><Save size={18}/></button>
        </header>

        {isLeague && (
          <div className='flex mb-6 bg-slate-900/40 p-1 rounded-2xl border border-white/10 backdrop-blur-md'>
            <button onClick={() => setViewDiv(1)} className={`flex-1 py-2.5 text-[10px] font-black uppercase italic rounded-[10px] transition-all ${!isDiv2 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>1ª División</button>
            <button onClick={() => setViewDiv(2)} className={`flex-1 py-2.5 text-[10px] font-black uppercase italic rounded-[10px] transition-all ${isDiv2 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>2ª División</button>
          </div>
        )}

        <div className='grid grid-cols-4 gap-2 mb-6 bg-slate-900/30 p-3 rounded-[2rem] border border-white/10 backdrop-blur-md shadow-lg'>
           <MenuButton icon={<BarChart3 size={18} className='text-emerald-400'/>} label="Stats" onClick={() => setCompView('stats')} />
           <MenuButton icon={<Calendar size={18} className='text-blue-400'/>} label="Fechas" onClick={() => setCompView('calendar')} />
           <MenuButton icon={<History size={18} className='text-yellow-400'/>} label="Result." onClick={() => setCompView('results')} />
           {activeComp.type !== 'league' && (
             <MenuButton icon={<Swords size={18} className='text-purple-400'/>} label="Llaves" onClick={() => setCompView('bracket')} />
           )}
           {activeComp.type === 'league' && (
             <MenuButton icon={<Users size={18} className='text-indigo-400'/>} label="Equipo" onClick={() => setCompView('teamSelect')} />
           )}

           <MenuButton icon={<Users size={16} className='text-indigo-400'/>} label="Mi Equipo" onClick={() => setCompView('teamSelect')} isWide />
           <MenuButton icon={<Settings size={16} className='text-slate-300'/>} label="Ajustes" onClick={() => setCompView('config')} isWide />
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

        {isLeague && (
          <section className='bg-slate-900/30 backdrop-blur-md rounded-[2rem] p-4 border border-white/10 mb-6 shadow-lg'>
            <h3 className='text-[10px] font-black uppercase text-slate-200 mb-3 flex items-center gap-2 drop-shadow-md'><BarChart3 size={12} /> Top Clasificación {isDiv2 ? '2ª' : '1ª'} Div.</h3>
            <div className='space-y-1.5'>
              {sortedTeams.slice(0, 6).map((t, i) => (
                <div key={t.id} className={'flex items-center gap-3 p-2 rounded-xl ' + (t.id === activeComp.userTeamId ? 'bg-blue-600/40 border border-blue-400/50 shadow-inner' : (isDiv2 && i < 3 ? 'bg-emerald-900/30 border border-emerald-500/20' : 'bg-black/30'))}>
                  <span className={'text-[10px] font-black italic w-4 ' + (isDiv2 && i < 3 ? 'text-emerald-400' : 'text-slate-300')}>{i+1}</span>
                  <Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='sm' isFlag={t?.isFlag} />
                  <span className='text-[11px] font-bold uppercase truncate flex-grow italic text-white drop-shadow-sm'>{t?.name}</span>
                  <span className='text-[10px] font-black bg-slate-800/60 px-2 py-0.5 rounded-md text-emerald-400 border border-white/10'>{t.pts} PTS</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!currentShowWinner && (currentMatch || (isLeague && currentMatchday >= generateLeagueSchedule(currentTeams).length)) && (
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

            {(() => {
              const schedule = generateLeagueSchedule(currentTeams);
              const isDone = currentMatchday >= schedule.length;
              if (isLeague && isDone) {
                 return (
                   <button disabled className='w-full bg-slate-800 text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-inner border border-white/10'>
                     Temporada Finalizada
                   </button>
                 );
              }
              return (
                <button onClick={() => startMatch(homeId, awayId, isDiv2)} className='w-full bg-white/95 text-blue-900 py-4 rounded-2xl text-xs font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center'>
                  <span>{activeComp.phase === 'Final' ? 'Gran Final' : ('Jugar ' + (isLeague || activeComp.phase === 'groups' ? 'Jornada ' + (currentMatchday + 1) : activeComp.phase + (activeCompId === 'C1' ? (activeComp.matchday % 2 === 0 ? ' (Ida)' : ' (Vuelta)') : '')))}</span>
                  <span className='text-[7px] opacity-60 mt-0.5 tracking-normal'>{homeTeam?.opp} vs {awayTeam?.opp} TIROS DISPONIBLES</span>
                  
                </button>
              );
            })()}

          </section>
        )}
      </div>
    );

    if (compView === 'stats') return (
      <div className='flex-grow px-4 pb-20'>
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => setCompView('main')} className='p-2 bg-slate-900/30 backdrop-blur-md rounded-xl active:scale-95 transition-all border border-white/10'><ChevronLeft /></button>
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Estadísticas {isDiv2 && '(2ª Div)'}</h2>
        </div>

        {isLeague ? (
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
                {Array.isArray(sortedTeams) && sortedTeams.map((t, i) => {
                  const isUser = t.id === activeComp.userTeamId;
                  const isPromo = isDiv2 && i < 3;
                  const isRelegation = !isDiv2 && i >= sortedTeams.length - 3;
                  const rowBg = isUser ? 'bg-blue-600/30' : (isPromo ? 'bg-emerald-900/20' : (isRelegation ? 'bg-red-900/20' : ''));
                  return (
                    <tr key={t.id} className={rowBg}>
                      <td className={'p-3 text-[10px] font-black italic sticky z-40 bg-[#0f172a] ' + (isPromo ? 'text-emerald-400' : isRelegation ? 'text-red-400' : 'text-slate-300')} style={{ left: 0 }}>{i+1}</td>
                      <td className='p-3 flex items-center gap-2 sticky z-40 bg-[#0f172a]' style={{ left: '40px', minWidth: '130px' }}><Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='xs' isFlag={t?.isFlag} /><span className='text-[10px] font-bold uppercase truncate italic max-w-[80px]'>{t?.name}</span></td>
                      <td className='p-3 text-center text-[10px] font-bold sticky z-40 bg-[#0f172a] border-r border-white/10' style={{ left: '170px' }}>{t.p}</td>
                      <td className='p-3 text-center text-[10px] font-bold'>{t.w}</td><td className='p-3 text-center text-[10px] font-bold'>{t.d}</td><td className='p-3 text-center text-[10px] font-bold'>{t.l}</td><td className='p-3 text-center text-[10px] font-bold'>{t.gf}</td><td className='p-3 text-center text-[10px] font-bold'>{t.ga}</td><td className='p-3 text-center text-[10px] font-bold'>{t.gf - t.ga}</td><td className='p-3 text-center text-[10px] font-black text-emerald-400'>{t.pts}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Lógica original de Copas y Eliminatorias */}
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
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Resultados {isDiv2 && '(2ª)'}</h2>
        </div>
        <div className='space-y-4'>
          {(!Array.isArray(currentHistory) || currentHistory.length === 0) && <div className='text-center py-20 text-slate-300 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-white/5 italic font-bold uppercase text-[10px] shadow-lg'>No hay partidos jugados aún.</div>}
          {Array.isArray(currentHistory) && currentHistory.map((h, i) => (
            <div key={i} className='bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-lg'>
              <h3 className='text-[9px] font-black uppercase text-blue-300 mb-3 drop-shadow-md'>Jornada/Día: {h.day}</h3>
              <div className='space-y-2'>
                {Array.isArray(h.results) && h.results.map((r, ri) => {
                  const home = Array.isArray(currentTeams) ? currentTeams.find(t => t.id === r.hId) : null;
                  const away = Array.isArray(currentTeams) ? currentTeams.find(t => t.id === r.aId) : null;
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
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Calendario {isDiv2 && '(2ª)'}</h2>
        </div>
        <div className='space-y-4'>
          {isLeague ? (
            (() => {
              const rounds = generateLeagueSchedule(currentTeams).map((round, ri) => ({ round, ri }));
              return [...rounds.filter(r => r.ri === currentMatchday), ...rounds.filter(r => r.ri > currentMatchday), ...rounds.filter(r => r.ri < currentMatchday).reverse()];
            })().map(({ round, ri }) => (
              <div key={ri} className={'bg-slate-900/30 backdrop-blur-md rounded-3xl p-4 border border-white/10 shadow-lg ' + (ri === currentMatchday ? 'ring-2 ring-blue-500/50' : 'opacity-80')}>
                <div className='flex justify-between items-center mb-3'>
                  <h3 className='text-[9px] font-black uppercase text-slate-300'>Jornada {ri + 1} {ri === currentMatchday && '(Actual)'}</h3>
                  <span className={'text-[7px] font-black uppercase px-2 py-0.5 rounded-full ' + (ri < currentMatchday ? 'bg-emerald-500/30 text-emerald-300' : ri === currentMatchday ? 'bg-blue-500/40 text-blue-200' : 'bg-slate-800/80 text-slate-300')}>{ri < currentMatchday ? 'Finalizado' : ri === currentMatchday ? 'En Curso' : 'Próximo'}</span>
                </div>
                <div className='space-y-2'>
                  {round.map((m, mi) => {
                    const home = currentTeams.find(t => t.id === m.homeId); const away = currentTeams.find(t => t.id === m.awayId);
                    const result = currentHistory.find(h => h.day === (ri + 1))?.results.find(r => (r.hId === m.homeId && r.aId === m.awayId) || (r.hId === m.awayId && r.aId === m.homeId));
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
            // Lógica intacta para torneos
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
          <h2 className='text-xl font-black italic uppercase drop-shadow-md'>Seleccionar Equipo {isDiv2 ? '(2ª Div)' : ''}</h2>
        </div>
        {isLeague && (
          <div className='flex mb-4 bg-slate-900/40 p-1 rounded-2xl border border-white/10 backdrop-blur-md'>
            <button onClick={() => setViewDiv(1)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-[10px] transition-all ${!isDiv2 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>1ª División</button>
            <button onClick={() => setViewDiv(2)} className={`flex-1 py-2 text-[10px] font-black uppercase italic rounded-[10px] transition-all ${isDiv2 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>2ª División</button>
          </div>
        )}
        <div className='grid gap-3 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar'>
          {Array.isArray(currentTeams) && currentTeams.map(t => (
            <button key={t.id} onClick={() => { updateActiveComp(isDiv2 ? { userTeamId2: t.id } : { userTeamId: t.id }); setCompView('main'); }} className={'flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-95 backdrop-blur-md ' + (t.id === currentUserTeamId ? 'bg-blue-600/60 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-slate-900/40 border-white/10 hover:border-white/30')}>
              <Shield color1={t?.color1} color2={t?.color2} initial={t?.name} size='md' isFlag={t?.isFlag} />
              <div className='text-left'>
                <p className='text-xs font-black uppercase italic text-white drop-shadow-md'>{t?.name}</p>
                <p className='text-[8px] font-bold text-slate-200 uppercase bg-black/40 px-1.5 py-0.5 rounded inline-block mt-1'>{t?.att + '/' + t?.opp + '/' + t?.def}</p>
              </div>
              {t.id === currentUserTeamId && <div className='ml-auto bg-white/30 p-1.5 rounded-full shadow-inner'><Check size={14} className="text-white"/></div>}
            </button>
          ))}
        </div>
      </div>
    );

    return null;
  };

  return (
    <div className='relative min-h-screen selection:bg-blue-500/30 font-sans text-slate-100 overflow-hidden'>
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
    </div>
  );
}

export default DiceFootballApp;