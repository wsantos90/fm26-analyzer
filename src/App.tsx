import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import {
  Users, BarChart3, Shield, Activity, TrendingUp,
  Search, ArrowRightLeft, Calendar, Upload,
  CheckCircle, X, Trophy, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// --- 1. TYPES & INTERFACES ---
interface PlayerAttributes {
  // Physical
  pace: number; acceleration: number; stamina: number; strength: number;
  balance: number; agility: number; jumping: number; naturalFitness: number;
  // Mental
  workRate: number; teamwork: number; aggression: number; bravery: number;
  decisions: number; composure: number; concentration: number; anticipation: number;
  vision: number; flair: number; determination: number;
  // Technical
  passing: number; crossing: number; dribbling: number; firstTouch: number;
  finishing: number; heading: number; longShots: number; technique: number;
  tackling: number; marking: number; positioning: number;
  // GK
  reflexes: number; handling: number; command: number; aerial: number; oneOnOne: number;
  kicking: number; rushing: number; eccentricity: number; communication: number; throwing: number;
}

interface Player {
  id: string;
  team: string;
  teamType: 'main' | 'youth' | 'reserve' | 'loan';
  name: string;
  age: number;
  nat: string;
  positions: { primary: string[]; secondary: string[] };
  attributes: PlayerAttributes;
  scores: {
    gk: number;
    stretching: number;
    linking: number;
    dynamic: number;
    engaged: number;
    tracking: number;
    outlet: number;
  };
  fm26Scores: {
    ip: Record<string, number>;
    oop: Record<string, number>;
  };
  mainScore: number;
  category: 'elite' | 'titular' | 'rotacao' | 'promessa' | 'vender' | 'baixo_nivel';
  bestRole: string;
  bestIPRole: string;
  bestOOPRole: string;
}

interface FormationSlot {
  id: string;
  role: string;
  positionKey: string[];
  x: number;
  y: number;
  methodology: keyof Player['scores'];
  ipRole?: string;
  oopRole?: string;
}

// --- 2. CONFIGURAÇÕES & CONSTANTES ---
const POS_LABELS: Record<string, string> = {
  gk: 'GR', dc: 'ZC', dl: 'DE', dr: 'DD', wbl: 'AE', wbr: 'AD',
  dmc: 'VOL', mc: 'MC', ml: 'ME', mr: 'MD', amc: 'MAC', aml: 'MAE', amr: 'MAD', st: 'PL'
};

// FM26 ROLE DEFINITIONS (Pesos de Atributos)
const FM26_ROLES = {
  // --- IN POSSESSION (IP) ---
  ip: {
    // Defensores
    'Defesa com Bola': { passing: 3, vision: 2, composure: 2, technique: 1 },
    'Zagueiro Lateral': { crossing: 2, dribbling: 1, pace: 2, positioning: 2 },
    'Defesa Avançado': { passing: 3, vision: 2, dribbling: 2, composure: 2 }, // Libero moderno
    'Lateral Invertido': { passing: 2, vision: 2, positioning: 3, decisions: 2 },
    'Ala Armador': { passing: 3, vision: 3, crossing: 2, technique: 2 },
    'Ala Ofensivo': { pace: 3, acceleration: 3, crossing: 3, dribbling: 2 },
    
    // Meio-Campo
    'Construtor de Jogo Recuado': { passing: 4, vision: 3, composure: 3, firstTouch: 2 },
    'Construtor Box-to-Box': { stamina: 3, passing: 3, vision: 2, workRate: 3 }, // Novo Roaming/Segundo Volante
    'Meio-Campista de Canal': { pace: 3, acceleration: 3, stamina: 3, offTheBall: 3 }, // Novo Mezzala
    'Construtor de Jogo Avançado': { passing: 3, vision: 3, technique: 2, flair: 2 },
    
    // Alas/Meias Ofensivos
    'Extremo Interior': { dribbling: 3, finishing: 2, acceleration: 3, flair: 2 },
    'Construtor de Jogo Aberto': { passing: 4, vision: 3, crossing: 2, technique: 2 },
    'Função Livre': { flair: 4, vision: 3, passing: 3, dribbling: 3 }, // Novo Trequartista/Enganche
    
    // Atacantes
    'Falso Nove': { vision: 3, passing: 3, dribbling: 2, composure: 2 },
    'Avançado de Canal': { pace: 4, acceleration: 3, offTheBall: 3, workRate: 2 },
    'Avançado Alvo': { strength: 4, heading: 4, balance: 3, teamwork: 2 }
  },
  
  // --- OUT OF POSSESSION (OOP) ---
  oop: {
    // Defensores
    'Zagueiro Tampão': { aggression: 3, bravery: 3, strength: 3, tackling: 2 },
    'Zagueiro de Cobertura': { pace: 3, anticipation: 3, positioning: 3, concentration: 2 },
    'Lateral de Pressão': { stamina: 3, aggression: 3, workRate: 3, tackling: 2 },
    'Lateral de Contenção': { positioning: 4, marking: 3, concentration: 3, strength: 2 },
    
    // Meio-Campo
    'Volante de Proteção': { positioning: 4, anticipation: 3, concentration: 3, strength: 2 }, // Novo Anchor
    'Volante de Pressão': { aggression: 3, workRate: 3, stamina: 3, tackling: 2 },
    'Volante de Cobertura': { pace: 2, stamina: 3, positioning: 3, teamwork: 2 }, // Cobre laterais
    'Meio-Campista de Marcação': { stamina: 4, workRate: 4, teamwork: 3, positioning: 2 },
    
    // Alas/Atacantes
    'Extremo de Marcação': { workRate: 4, stamina: 3, tackling: 2, teamwork: 3 },
    'Extremo de Escape': { pace: 4, acceleration: 4, anticipation: 2, flair: 1 }, // Fica na frente
    'Avançado de Pressão': { workRate: 4, aggression: 3, stamina: 4, teamwork: 3 },
    'Pivô de Escape': { pace: 3, acceleration: 3, finishing: 2, composure: 1 } // Fica na banheira
  }
};

const FORMATIONS: Record<string, FormationSlot[]> = {
  '4-3-3': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dl', role: 'DE', positionKey: ['dl', 'wbl'], x: 15, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Pressão' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 35, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 65, y: 80, methodology: 'engaged', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dr', role: 'DD', positionKey: ['dr', 'wbr'], x: 85, y: 75, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Contenção' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'dmc'], x: 30, y: 50, methodology: 'dynamic', ipRole: 'Meio-Campista de Canal', oopRole: 'Meio-Campista de Marcação' },
    { id: 'mcc', role: 'MC', positionKey: ['mc', 'dmc'], x: 50, y: 55, methodology: 'linking', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'dmc'], x: 70, y: 50, methodology: 'engaged', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'aml', role: 'MAE', positionKey: ['aml', 'ml'], x: 20, y: 25, methodology: 'stretching', ipRole: 'Extremo Interior', oopRole: 'Extremo de Marcação' },
    { id: 'amr', role: 'MAD', positionKey: ['amr', 'mr'], x: 80, y: 25, methodology: 'stretching', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Extremo de Escape' },
    { id: 'st', role: 'PL', positionKey: ['st'], x: 50, y: 15, methodology: 'dynamic', ipRole: 'Avançado de Canal', oopRole: 'Avançado de Pressão' }
  ],
  '3-5-2': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 25, y: 80, methodology: 'tracking', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcc', role: 'ZC', positionKey: ['dc'], x: 50, y: 82, methodology: 'linking', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 75, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'wbl', role: 'AE', positionKey: ['wbl', 'dl', 'ml'], x: 10, y: 50, methodology: 'stretching', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'dmc', role: 'VOL', positionKey: ['dmc', 'mc'], x: 50, y: 65, methodology: 'engaged', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'wbr', role: 'AD', positionKey: ['wbr', 'dr', 'mr'], x: 90, y: 50, methodology: 'stretching', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'amc'], x: 35, y: 45, methodology: 'dynamic', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'amc'], x: 65, y: 45, methodology: 'linking', ipRole: 'Construtor de Jogo Avançado', oopRole: 'Meio-Campista de Marcação' },
    { id: 'stl', role: 'PL', positionKey: ['st'], x: 35, y: 15, methodology: 'outlet', ipRole: 'Avançado de Canal', oopRole: 'Avançado de Pressão' },
    { id: 'str', role: 'PL', positionKey: ['st'], x: 65, y: 15, methodology: 'dynamic', ipRole: 'Avançado Alvo', oopRole: 'Avançado de Pressão' }
  ],
  '4-2-3-1': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dl', role: 'DE', positionKey: ['dl', 'wbl'], x: 10, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Pressão' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 35, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 65, y: 80, methodology: 'engaged', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dr', role: 'DD', positionKey: ['dr', 'wbr'], x: 90, y: 75, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Contenção' },
    { id: 'dmcl', role: 'VOL', positionKey: ['dmc', 'mc'], x: 35, y: 60, methodology: 'engaged', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'dmcr', role: 'VOL', positionKey: ['dmc', 'mc'], x: 65, y: 60, methodology: 'linking', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'aml', role: 'MAE', positionKey: ['aml', 'ml'], x: 20, y: 35, methodology: 'stretching', ipRole: 'Extremo Interior', oopRole: 'Extremo de Marcação' },
    { id: 'amc', role: 'MAC', positionKey: ['amc', 'mc'], x: 50, y: 35, methodology: 'linking', ipRole: 'Função Livre', oopRole: 'Meio-Campista de Marcação' },
    { id: 'amr', role: 'MAD', positionKey: ['amr', 'mr'], x: 80, y: 35, methodology: 'stretching', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Extremo de Escape' },
    { id: 'st', role: 'PL', positionKey: ['st'], x: 50, y: 15, methodology: 'dynamic', ipRole: 'Avançado de Canal', oopRole: 'Avançado de Pressão' }
  ],
  '4-4-2 Diamond': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dl', role: 'DE', positionKey: ['dl', 'wbl'], x: 15, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Contenção' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 35, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 65, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dr', role: 'DD', positionKey: ['dr', 'wbr'], x: 85, y: 75, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'dmc', role: 'VOL', positionKey: ['dmc', 'mc'], x: 50, y: 62, methodology: 'engaged', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mcl', role: 'MC', positionKey: ['mc'], x: 30, y: 48, methodology: 'linking', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'mcr', role: 'MC', positionKey: ['mc'], x: 70, y: 48, methodology: 'linking', ipRole: 'Construtor de Jogo Avançado', oopRole: 'Meio-Campista de Marcação' },
    { id: 'amc', role: 'MAC', positionKey: ['amc', 'mc'], x: 50, y: 32, methodology: 'linking', ipRole: 'Função Livre', oopRole: 'Meio-Campista de Marcação' },
    { id: 'stl', role: 'PL', positionKey: ['st'], x: 40, y: 15, methodology: 'dynamic', ipRole: 'Falso Nove', oopRole: 'Avançado de Pressão' },
    { id: 'str', role: 'PL', positionKey: ['st'], x: 60, y: 15, methodology: 'outlet', ipRole: 'Avançado de Canal', oopRole: 'Pivô de Escape' }
  ],
  '4-1-2-3': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dl', role: 'DE', positionKey: ['dl', 'wbl'], x: 15, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Pressão' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 35, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 65, y: 80, methodology: 'engaged', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dr', role: 'DD', positionKey: ['dr', 'wbr'], x: 85, y: 75, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Contenção' },
    { id: 'dmc', role: 'VOL', positionKey: ['dmc', 'mc'], x: 50, y: 62, methodology: 'engaged', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'amc'], x: 35, y: 48, methodology: 'linking', ipRole: 'Meio-Campista de Canal', oopRole: 'Meio-Campista de Marcação' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'amc'], x: 65, y: 48, methodology: 'linking', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'aml', role: 'MAE', positionKey: ['aml', 'ml'], x: 20, y: 25, methodology: 'stretching', ipRole: 'Extremo Interior', oopRole: 'Extremo de Marcação' },
    { id: 'amr', role: 'MAD', positionKey: ['amr', 'mr'], x: 80, y: 25, methodology: 'stretching', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Extremo de Escape' },
    { id: 'st', role: 'PL', positionKey: ['st'], x: 50, y: 12, methodology: 'dynamic', ipRole: 'Avançado de Canal', oopRole: 'Avançado de Pressão' }
  ],
  '5-4-1': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dl', role: 'DE', positionKey: ['dl', 'wbl'], x: 10, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Contenção' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 30, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcc', role: 'ZC', positionKey: ['dc'], x: 50, y: 82, methodology: 'engaged', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 70, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dr', role: 'DD', positionKey: ['dr', 'wbr'], x: 90, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Pressão' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'dmc'], x: 30, y: 55, methodology: 'engaged', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Meio-Campista de Marcação' },
    { id: 'mccl', role: 'MC', positionKey: ['mc', 'dmc'], x: 45, y: 52, methodology: 'linking', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mccr', role: 'MC', positionKey: ['mc', 'dmc'], x: 55, y: 52, methodology: 'linking', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'dmc'], x: 70, y: 55, methodology: 'engaged', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Meio-Campista de Marcação' },
    { id: 'st', role: 'PL', positionKey: ['st'], x: 50, y: 15, methodology: 'outlet', ipRole: 'Avançado Alvo', oopRole: 'Pivô de Escape' }
  ],
  '3-4-3': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 30, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcc', role: 'ZC', positionKey: ['dc'], x: 50, y: 82, methodology: 'engaged', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 70, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'dmc', 'ml'], x: 25, y: 55, methodology: 'engaged', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'mccl', role: 'MC', positionKey: ['mc', 'dmc'], x: 42, y: 58, methodology: 'linking', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mccr', role: 'MC', positionKey: ['mc', 'dmc'], x: 58, y: 58, methodology: 'linking', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'dmc', 'mr'], x: 75, y: 55, methodology: 'engaged', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'aml', role: 'MAE', positionKey: ['aml', 'ml', 'st'], x: 20, y: 20, methodology: 'stretching', ipRole: 'Extremo Interior', oopRole: 'Extremo de Marcação' },
    { id: 'st', role: 'PL', positionKey: ['st'], x: 50, y: 12, methodology: 'dynamic', ipRole: 'Avançado de Canal', oopRole: 'Avançado de Pressão' },
    { id: 'amr', role: 'MAD', positionKey: ['amr', 'mr', 'st'], x: 80, y: 20, methodology: 'stretching', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Extremo de Escape' }
  ],
  '4-3-1-2': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dl', role: 'DE', positionKey: ['dl', 'wbl'], x: 15, y: 75, methodology: 'tracking', ipRole: 'Lateral Invertido', oopRole: 'Lateral de Contenção' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 35, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 65, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dr', role: 'DD', positionKey: ['dr', 'wbr'], x: 85, y: 75, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'dmc'], x: 30, y: 55, methodology: 'engaged', ipRole: 'Meio-Campista de Canal', oopRole: 'Meio-Campista de Marcação' },
    { id: 'mcc', role: 'MC', positionKey: ['mc', 'dmc'], x: 50, y: 58, methodology: 'linking', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'dmc'], x: 70, y: 55, methodology: 'engaged', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'amc', role: 'MAC', positionKey: ['amc', 'mc'], x: 50, y: 35, methodology: 'linking', ipRole: 'Função Livre', oopRole: 'Meio-Campista de Marcação' },
    { id: 'stl', role: 'PL', positionKey: ['st'], x: 40, y: 15, methodology: 'dynamic', ipRole: 'Falso Nove', oopRole: 'Avançado de Pressão' },
    { id: 'str', role: 'PL', positionKey: ['st'], x: 60, y: 15, methodology: 'dynamic', ipRole: 'Avançado de Canal', oopRole: 'Pivô de Escape' }
  ],
  '3-4-2-1': [
    { id: 'gk', role: 'GR', positionKey: ['gk'], x: 50, y: 90, methodology: 'gk' },
    { id: 'dcl', role: 'ZC', positionKey: ['dc'], x: 30, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'dcc', role: 'ZC', positionKey: ['dc'], x: 50, y: 82, methodology: 'engaged', ipRole: 'Defesa Avançado', oopRole: 'Zagueiro de Cobertura' },
    { id: 'dcr', role: 'ZC', positionKey: ['dc'], x: 70, y: 80, methodology: 'engaged', ipRole: 'Defesa com Bola', oopRole: 'Zagueiro Tampão' },
    { id: 'mcl', role: 'MC', positionKey: ['mc', 'dmc', 'ml'], x: 25, y: 58, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'mccl', role: 'MC', positionKey: ['mc', 'dmc'], x: 42, y: 60, methodology: 'engaged', ipRole: 'Construtor de Jogo Recuado', oopRole: 'Volante de Proteção' },
    { id: 'mccr', role: 'MC', positionKey: ['mc', 'dmc'], x: 58, y: 60, methodology: 'engaged', ipRole: 'Construtor Box-to-Box', oopRole: 'Volante de Pressão' },
    { id: 'mcr', role: 'MC', positionKey: ['mc', 'dmc', 'mr'], x: 75, y: 58, methodology: 'tracking', ipRole: 'Ala Ofensivo', oopRole: 'Lateral de Pressão' },
    { id: 'amcl', role: 'MAC', positionKey: ['amc', 'mc', 'aml'], x: 38, y: 32, methodology: 'linking', ipRole: 'Extremo Interior', oopRole: 'Extremo de Marcação' },
    { id: 'amcr', role: 'MAC', positionKey: ['amc', 'mc', 'amr'], x: 62, y: 32, methodology: 'linking', ipRole: 'Construtor de Jogo Aberto', oopRole: 'Extremo de Escape' },
    { id: 'st', role: 'PL', positionKey: ['st'], x: 50, y: 12, methodology: 'outlet', ipRole: 'Avançado Alvo', oopRole: 'Pivô de Escape' }
  ]
};

// --- 3. HELPER FUNCTIONS ---
const getVal = (row: any[], index: number) => {
  if (!row[index]) return 0;
  let val = row[index];
  if (typeof val === 'string') val = val.replace(',', '.');
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

const calculateScores = (attr: PlayerAttributes, isGk: boolean) => {
  if (isGk) {
    const gkScore = (attr.reflexes + attr.handling + attr.command + attr.aerial + attr.oneOnOne + attr.positioning) / 6;
    return { gk: gkScore, stretching: 0, linking: 0, dynamic: 0, engaged: 0, tracking: 0, outlet: 0 };
  }

  return {
    gk: 0,
    stretching: (attr.pace + attr.acceleration + attr.dribbling + attr.crossing + attr.workRate) / 5,
    linking: (attr.passing + attr.vision + attr.firstTouch + attr.decisions + attr.composure) / 5,
    dynamic: (attr.finishing + attr.anticipation + attr.acceleration + attr.stamina + attr.workRate) / 5,
    engaged: (attr.aggression + attr.bravery + attr.teamwork + attr.workRate + attr.strength) / 5,
    tracking: (attr.tackling + attr.marking + attr.positioning + attr.stamina + attr.concentration) / 5,
    outlet: (attr.strength + attr.heading + attr.firstTouch + attr.balance + attr.composure) / 5
  };
};

const calculateFM26Scores = (attr: PlayerAttributes) => {
  const scores: { ip: Record<string, number>; oop: Record<string, number> } = { ip: {}, oop: {} };
  
  // Calculate IP Roles
  Object.entries(FM26_ROLES.ip).forEach(([role, weights]) => {
    let total = 0;
    let weightSum = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      total += (attr[key as keyof PlayerAttributes] || 0) * weight;
      weightSum += weight;
    });
    scores.ip[role] = total / weightSum;
  });
  
  // Calculate OOP Roles
  Object.entries(FM26_ROLES.oop).forEach(([role, weights]) => {
    let total = 0;
    let weightSum = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      total += (attr[key as keyof PlayerAttributes] || 0) * weight;
      weightSum += weight;
    });
    scores.oop[role] = total / weightSum;
  });
  
  return scores;
};

const analyzeCSV = (data: any[]): Player[] => {
  // Função para detectar tipo de time
  const detectTeamType = (teamName: string): 'main' | 'youth' | 'reserve' | 'loan' => {
    if (!teamName) return 'main';
    if (teamName.includes('EMP')) return 'loan';
    if (/S\d{2}/.test(teamName)) return 'youth'; // S19, S20, etc
    if (/\s\d$/.test(teamName)) return 'reserve'; // "2", "3", etc
    return 'main';
  };

  return data
    .filter(row => row.length > 50 && row[0] && row[0] !== 'Time')
    .map((row, idx) => {
      // MAPEAMENTO ATUALIZADO com coluna Time
      // 0: Time, 1: Nome, 2: Nacionalidades, 3: Idade, 4-6: Pés/Altura
      // 7-14: Físicos, 15-27: Mentais, 28-37: Técnicos, 38-47: GK
      // 48-51: Salário/Contrato, 52-65: Posições

      const team = row[0] || '';
      const teamType = detectTeamType(team);

      const attr: PlayerAttributes = {
        // Physical (índices 7-14) - AJUSTADO +1
        acceleration: getVal(row, 7),
        agility: getVal(row, 8),
        balance: getVal(row, 9),
        jumping: getVal(row, 10),
        naturalFitness: getVal(row, 11),
        pace: getVal(row, 12),
        stamina: getVal(row, 13),
        strength: getVal(row, 14),

        // Mental (índices 15-27) - AJUSTADO +1
        aggression: getVal(row, 15),
        anticipation: getVal(row, 16),
        bravery: getVal(row, 17),
        composure: getVal(row, 18),
        concentration: getVal(row, 19),
        decisions: getVal(row, 20),
        determination: getVal(row, 21),
        flair: getVal(row, 22),
        positioning: getVal(row, 23), // Sem a Bola
        workRate: getVal(row, 27), // Índice de Trabalho
        teamwork: getVal(row, 25),
        vision: getVal(row, 26),

        // Technical (índices 28-37) - AJUSTADO +1
        crossing: getVal(row, 28),
        dribbling: getVal(row, 29),
        finishing: getVal(row, 30),
        firstTouch: getVal(row, 31),
        heading: getVal(row, 32),
        longShots: getVal(row, 33),
        marking: getVal(row, 34),
        passing: getVal(row, 35),
        tackling: getVal(row, 36),
        technique: getVal(row, 37),

        // GK (índices 38-47) - AJUSTADO +1
        aerial: getVal(row, 38),
        command: getVal(row, 39),
        communication: getVal(row, 40),
        eccentricity: getVal(row, 41),
        handling: getVal(row, 42),
        kicking: getVal(row, 43),
        oneOnOne: getVal(row, 44),
        reflexes: getVal(row, 45),
        rushing: getVal(row, 46),
        throwing: getVal(row, 47)
      };

      // Posições (índices 52-65) - AJUSTADO +1
      const posMap: Record<string, number> = {
        amc: getVal(row, 52),  // Meia-Atacante Central
        aml: getVal(row, 53),  // Meia-Atacante Esquerdo
        amr: getVal(row, 54),  // Meia-Atacante Direito
        dc: getVal(row, 55),   // Zagueiro
        dl: getVal(row, 56),   // Lateral Esquerdo
        dr: getVal(row, 57),   // Lateral Direita
        dmc: getVal(row, 58),  // Volante
        gk: getVal(row, 59),   // Goleiro
        mc: getVal(row, 60),   // Meio-Campo
        ml: getVal(row, 61),   // Meia-Esquerda
        mr: getVal(row, 62),   // Meia-Direita
        st: getVal(row, 63),   // Ponta-de-lança
        wbl: getVal(row, 64),  // Ala Esquerda
        wbr: getVal(row, 65)   // Ala Direita
      };

      const primary = Object.entries(posMap).filter(([_, v]) => v > 14).map(([k]) => k);
      const secondary = Object.entries(posMap).filter(([_, v]) => v >= 10 && v <= 14).map(([k]) => k);
      const isGk = posMap.gk > 15;

      const scores = calculateScores(attr, isGk);
      const fm26Scores = calculateFM26Scores(attr);

      let mainScore = 0;
      if (isGk) mainScore = scores.gk;
      else {
        const outfieldScores = [scores.stretching, scores.linking, scores.dynamic, scores.engaged, scores.tracking, scores.outlet];
        outfieldScores.sort((a, b) => b - a);
        mainScore = (outfieldScores[0] + outfieldScores[1] + outfieldScores[2]) / 3;
      }

      let category: Player['category'] = 'rotacao';
      const age = getVal(row, 3); // IDADE NO ÍNDICE 3 - AJUSTADO +1

      if (mainScore >= 14) category = 'elite';
      else if (mainScore >= 12.5) category = 'titular';
      else if (age <= 21 && mainScore >= 10.5) category = 'promessa';
      else if (age >= 29 && mainScore < 10) category = 'vender'; // Nota < 10 e velho = Vender
      else if (mainScore < 10) category = 'baixo_nivel'; // Nota < 10 mas não velho = Baixo Nível (não é rotação útil)

      let bestRole = 'Rotational';
      if (isGk) bestRole = 'Guarda-Redes';
      else {
        const bestMethod = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
        if (bestMethod) bestRole = bestMethod[0].toUpperCase();
      }

      // Calculate Best FM26 Roles
      const bestIPRoleEntry = Object.entries(fm26Scores.ip).sort((a, b) => b[1] - a[1])[0];
      const bestIPRole = bestIPRoleEntry ? bestIPRoleEntry[0] : '-';

      const bestOOPRoleEntry = Object.entries(fm26Scores.oop).sort((a, b) => b[1] - a[1])[0];
      const bestOOPRole = bestOOPRoleEntry ? bestOOPRoleEntry[0] : '-';

      return {
        id: idx.toString(),
        team, // NOVO
        teamType, // NOVO
        name: row[1], // NOME NO ÍNDICE 1 - AJUSTADO +1
        age: age,
        nat: row[2], // NACIONALIDADES NO ÍNDICE 2 - AJUSTADO +1
        positions: { primary, secondary },
        attributes: attr,
        scores,
        fm26Scores, // ADDED
        mainScore,
        category,
        bestRole,
        bestIPRole, // ADDED
        bestOOPRole // ADDED
      };
    }).sort((a, b) => b.mainScore - a.mainScore);
};

// --- 4. MAIN COMPONENT ---
const FMAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [players, setPlayers] = useState<Player[]>([]);
  
  // FM26 Tactics State
  const [formationIP, setFormationIP] = useState('4-3-3');
  const [formationOOP, setFormationOOP] = useState('4-4-2 Diamond');
  const [tacticalPhase, setTacticalPhase] = useState<'ip' | 'oop'>('ip');
  
  // Derived state for compatibility
  const formation = tacticalPhase === 'ip' ? formationIP : formationOOP;
  const setFormation = (fmt: string) => tacticalPhase === 'ip' ? setFormationIP(fmt) : setFormationOOP(fmt);

  const [history, setHistory] = useState<{ date: string, count: number, avgScore: number }[]>([]);
  const [compareList, setCompareList] = useState<Player[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'attributes'>('overview');
  const [modalPositionContext, setModalPositionContext] = useState<string>('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('fm_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleOpenPlayerModal = (player: Player) => {
    setSelectedPlayer(player);
    setModalPositionContext(player.positions.primary[0] || 'mc');
    setShowPlayerModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          // @ts-ignore
          const processed = analyzeCSV(results.data);
          setPlayers(processed);
          saveSnapshot(processed);
        }
      });
    }
  };

  const saveSnapshot = (currentPlayers: Player[]) => {
    const avgScore = currentPlayers.reduce((acc, p) => acc + p.mainScore, 0) / currentPlayers.length;
    const newEntry = {
      date: new Date().toLocaleDateString(),
      count: currentPlayers.length,
      avgScore
    };
    const newHistory = [...history, newEntry].slice(-5);
    setHistory(newHistory);
    localStorage.setItem('fm_history', JSON.stringify(newHistory));
  };

  // --- SUB-COMPONENTS ---

  const Dashboard = () => {
    const stats = {
      total: players.length,
      elite: players.filter(p => p.category === 'elite').length,
      prospects: players.filter(p => p.category === 'promessa').length,
      avgAge: (players.reduce((acc, p) => acc + p.age, 0) / players.length || 0).toFixed(1)
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
            <div className="flex items-center gap-3 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-blue-400 transition-colors"><Users size={14} /> Total Elenco</div>
            <div className="text-4xl font-black text-white tracking-tighter">{stats.total}</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-yellow-500/20 shadow-xl shadow-yellow-900/5 hover:border-yellow-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-2 text-yellow-500/80 font-bold text-[10px] uppercase tracking-widest group-hover:text-yellow-400 transition-colors"><Trophy size={14} /> Elite (Classe A)</div>
            <div className="text-4xl font-black text-white tracking-tighter">{stats.elite}</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 shadow-xl shadow-purple-900/5 hover:border-purple-500/40 transition-all group">
            <div className="flex items-center gap-3 mb-2 text-purple-400/80 font-bold text-[10px] uppercase tracking-widest group-hover:text-purple-400 transition-colors"><TrendingUp size={14} /> Promessas</div>
            <div className="text-4xl font-black text-white tracking-tighter">{stats.prospects}</div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl hover:bg-slate-900/80 transition-all group">
            <div className="flex items-center gap-3 mb-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-blue-400 transition-colors"><Calendar size={14} /> Idade Média</div>
            <div className="text-4xl font-black text-white tracking-tighter">{stats.avgAge}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h3 className="text-white font-bold flex items-center gap-3 text-sm uppercase tracking-wider"><Activity size={18} className="text-blue-500" /> Evolução do Elenco</h3>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja apagar o histórico?')) {
                      setHistory([]);
                      localStorage.removeItem('fm_history');
                    }
                  }}
                  className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded border border-red-500/20 transition-all font-bold uppercase tracking-widest"
                >
                  Resetar
                </button>
              )}
            </div>
            <div className="h-64 w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={history}>
                    <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis domain={[0, 20]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#60a5fa' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Média Geral" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 font-medium text-sm">Sem dados históricos disponíveis.</div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 shadow-xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-sm uppercase tracking-wider border-b border-white/5 pb-4"><Search size={18} className="text-blue-500" /> Raio-X (Necessidades)</h3>
            <div className="flex flex-col gap-3">
              {['gk', 'dc', 'dl', 'dr', 'dmc', 'mc', 'st'].map(pos => {
                const count = players.filter(p => p.positions.primary.includes(pos) && p.category !== 'vender').length;
                const status = count < 2 ? 'Crítico' : count < 3 ? 'Atenção' : 'Ideal';
                const color = count < 2 ? 'text-red-400 bg-red-500/10 border-red-500/20' : count < 3 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20';
                return (
                  <div key={pos} className="flex justify-between items-center group">
                    <span className="uppercase font-bold text-slate-400 text-xs tracking-wider flex items-center gap-3 w-full">
                      <span className="w-8 h-8 rounded bg-black/40 flex items-center justify-center text-[10px] text-slate-500 group-hover:text-white group-hover:bg-blue-600 transition-all font-black border border-white/5">{POS_LABELS[pos] || pos}</span>
                      <div className="h-px bg-white/5 flex-1 mx-2"></div>
                    </span>
                    <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${color}`}>{status} ({count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TacticsBoard = () => {
    const slots = FORMATIONS[formation];

    const FM26_INSTRUCTIONS = {
      ip: {
        'Terço Final': ['Drible', 'Paciência', 'Chutes de Longe', 'Estilo de Cruzamento'],
        'Progressão': ['Corridas de Apoio', 'Progredir Através', 'Recepção de Passe'],
        'Construção': ['Estratégia de Construção', 'Tiros de Meta', 'Distribuição do GR']
      },
      oop: {
        'Pressão Alta': ['Armadilhas de Pressão', 'Distribuição Curta do GR'],
        'Bloco Médio': ['Armadilha de Pressão'],
        'Bloco Baixo': ['Envolvimento em Cruzamentos']
      }
    };

        {/* Algoritmo de Recomendação de Formações */}
    const recommendedFormations = useMemo(() => {
      // Se não houver jogadores, retorna lista vazia
      if (players.length === 0) return [];

      // Mapeia todas as formações possíveis para calcular a pontuação de cada uma
      return Object.entries(FORMATIONS).map(([formName, formSlots]) => {
        const usedIds = new Set<string>(); // Rastreia jogadores já usados nesta formação para não repetir
        let totalScore = 0;
        let filledSlots = 0;

        // Cria uma cópia dos slots da formação
        const sortedSlots = [...formSlots];

        // Para cada posição na formação...
        for (const slot of sortedSlots) {
          // Encontra candidatos elegíveis:
          // 1. Não usados ainda
          // 2. Não marcados para venda/baixo nível
          // 3. Que jogam na posição exigida (ex: 'mc', 'st')
          const candidates = players.filter(p =>
            !usedIds.has(p.id) &&
            p.category !== 'vender' && p.category !== 'baixo_nivel' &&
            slot.positionKey.some(k => p.positions.primary.includes(k))
          );

          // Ordena candidatos pela pontuação específica da metodologia daquela posição
          // Agora suporta FM26 IP/OOP roles
          candidates.sort((a, b) => {
            if (tacticalPhase === 'ip' && slot.ipRole && a.fm26Scores.ip[slot.ipRole]) {
               return b.fm26Scores.ip[slot.ipRole] - a.fm26Scores.ip[slot.ipRole];
            }
            if (tacticalPhase === 'oop' && slot.oopRole && a.fm26Scores.oop[slot.oopRole]) {
               return b.fm26Scores.oop[slot.oopRole] - a.fm26Scores.oop[slot.oopRole];
            }
            // @ts-ignore
            return b.scores[slot.methodology] - a.scores[slot.methodology];
          });

          const best = candidates[0];
          if (best) {
            let score = 0;
            if (tacticalPhase === 'ip' && slot.ipRole && best.fm26Scores.ip[slot.ipRole]) {
               score = best.fm26Scores.ip[slot.ipRole];
            } else if (tacticalPhase === 'oop' && slot.oopRole && best.fm26Scores.oop[slot.oopRole]) {
               score = best.fm26Scores.oop[slot.oopRole];
            } else {
               // @ts-ignore
               score = best.scores[slot.methodology];
            }
            totalScore += score; // Soma a pontuação ao total do time
            filledSlots++;
            usedIds.add(best.id); // Marca jogador como usado
          }
        }

        return {
          name: formName,
          score: filledSlots === 11 ? totalScore / 11 : 0, // Calcula média apenas se preencher os 11 titulares
          filled: filledSlots
        };
      })
        .filter(f => f.filled === 11) // Remove formações que não conseguimos preencher
        .sort((a, b) => b.score - a.score) // Ordena da maior pontuação para a menor
        .slice(0, 3); // Pega apenas as top 3
    }, [players]);

    const getPlayerForSlot = (slot: FormationSlot, excludeIds: string[]) => {
      const candidates = players.filter(p =>
        !excludeIds.includes(p.id) &&
        p.category !== 'vender' && p.category !== 'baixo_nivel' &&
        slot.positionKey.some(k => p.positions.primary.includes(k))
      );

      // @ts-ignore
      candidates.sort((a, b) => {
        if (tacticalPhase === 'ip' && slot.ipRole && a.fm26Scores.ip[slot.ipRole]) {
            return b.fm26Scores.ip[slot.ipRole] - a.fm26Scores.ip[slot.ipRole];
        }
        if (tacticalPhase === 'oop' && slot.oopRole && a.fm26Scores.oop[slot.oopRole]) {
            return b.fm26Scores.oop[slot.oopRole] - a.fm26Scores.oop[slot.oopRole];
        }
        // @ts-ignore
        return b.scores[slot.methodology] - a.scores[slot.methodology];
      });

      return {
        main: candidates[0],
        backup: candidates[1],
        prospect: candidates.find(p => p.category === 'promessa' && p.id !== candidates[0]?.id && p.id !== candidates[1]?.id)
      };
    };

    // SISTEMA ANTI-DUPLICATAS: rastreia TODOS os jogadores usados (titular, reserva E promessa)
    const assignedIds: string[] = [];
    const lineup = slots.map(slot => {
      const data = getPlayerForSlot(slot, assignedIds);
      // Adiciona TODOS os jogadores selecionados à lista de exclusão
      if (data.main) assignedIds.push(data.main.id);
      if (data.backup) assignedIds.push(data.backup.id);
      if (data.prospect) assignedIds.push(data.prospect.id);
      return { ...slot, ...data };
    });

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* FM26 Phase Selector */}
        <div className="lg:col-span-3 flex justify-center mb-2">
           <div className="bg-slate-900/80 p-1 rounded-xl flex gap-2 border border-white/10 shadow-2xl">
              <button 
                onClick={() => setTacticalPhase('ip')}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-black text-sm uppercase tracking-widest transition-all ${tacticalPhase === 'ip' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Activity size={16} /> Com a Posse (IP)
              </button>
              <button 
                onClick={() => setTacticalPhase('oop')}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-black text-sm uppercase tracking-widest transition-all ${tacticalPhase === 'oop' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 ring-1 ring-white/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Shield size={16} /> Sem a Posse (OOP)
              </button>
           </div>
        </div>

        {/* Recomendação de Formações */}
        {recommendedFormations.length > 0 && (
          <div className={`lg:col-span-3 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group ${tacticalPhase === 'ip' ? 'border-blue-500/20' : 'border-red-500/20'}`}>
            <div className={`absolute inset-0 ${tacticalPhase === 'ip' ? 'bg-blue-600/5 group-hover:bg-blue-600/10' : 'bg-red-600/5 group-hover:bg-red-600/10'} transition-colors`}></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`${tacticalPhase === 'ip' ? 'bg-blue-600 shadow-blue-900/30' : 'bg-red-600 shadow-red-900/30'} p-3 rounded-xl shadow-lg text-white`}><Trophy size={28} /></div>
              <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Formações Recomendadas</h3>
                <p className={`${tacticalPhase === 'ip' ? 'text-blue-200' : 'text-red-200'} text-xs font-medium tracking-wide`}>
                  Melhor estrutura {tacticalPhase === 'ip' ? 'Ofensiva' : 'Defensiva'} baseada no elenco
                </p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto relative z-10 px-2">
              {recommendedFormations.map((rec, idx) => (
                <button
                  key={rec.name}
                  onClick={() => setFormation(rec.name)}
                  className={`flex flex-col items-center p-4 rounded-xl border min-w-[140px] transition-all hover:scale-105 group/btn ${formation === rec.name
                    ? (tacticalPhase === 'ip' ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/50 ring-2 ring-white/20' : 'bg-red-600 border-red-400 shadow-lg shadow-red-900/50 ring-2 ring-white/20')
                    : 'bg-black/40 border-white/5 hover:bg-black/60 hover:border-white/20'
                    }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${formation === rec.name ? 'text-white' : 'text-slate-400'}`}>{idx + 1}º Melhor</span>
                  <div className="text-white font-black text-lg">{rec.name}</div>
                  <div className={`text-xs font-bold mt-1 px-2 py-0.5 rounded-full ${formation === rec.name ? 'bg-white/20 text-white' : 'bg-green-500/10 text-green-400'}`}>{rec.score.toFixed(1)} pts</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="lg:col-span-2 relative bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[750px]">
          {/* Campo Tático */}
          <div className={`absolute inset-0 transition-colors duration-500 ${tacticalPhase === 'ip' ? 'bg-[#0f2e1a]/80' : 'bg-[#1a0f0f]/80'}`}>
            {/* Gramado Stripes */}
            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.03) 50px)' }}></div>
            {/* Linhas do Campo */}
            <div className="absolute top-4 bottom-4 left-4 right-4 border-2 border-white/20 rounded-lg"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-36 h-36 border-2 border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            </div>
            
            {/* Phase Indicator on Pitch */}
            <div className="absolute top-8 right-8 text-white/10 font-black text-6xl uppercase pointer-events-none select-none">
                {tacticalPhase === 'ip' ? 'ATK' : 'DEF'}
            </div>

            <div className="absolute top-[15%] left-1/2 w-[60%] h-px bg-white/10 transform -translate-x-1/2 border-dashed border-t"></div>
            <div className="absolute bottom-[15%] left-1/2 w-[60%] h-px bg-white/10 transform -translate-x-1/2 border-dashed border-t"></div>
          </div>

          {lineup.map((slot) => {
             let displayScore = 0;
             let roleName = slot.role;
             
             if (slot.main) {
                 if (tacticalPhase === 'ip' && slot.ipRole && slot.main.fm26Scores.ip[slot.ipRole]) {
                     displayScore = slot.main.fm26Scores.ip[slot.ipRole];
                     roleName = slot.ipRole; // Show FM26 Role name on hover? Maybe too long. Keep generic role.
                 } else if (tacticalPhase === 'oop' && slot.oopRole && slot.main.fm26Scores.oop[slot.oopRole]) {
                     displayScore = slot.main.fm26Scores.oop[slot.oopRole];
                 } else {
                     displayScore = slot.main.mainScore;
                 }
             }

             return (
            <div
              key={slot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-36 group z-10 hover:z-50"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="bg-black/60 backdrop-blur text-white text-[10px] font-black px-3 py-0.5 rounded-full mb-1 border border-white/10 tracking-widest uppercase shadow-sm">{slot.role}</div>

              {slot.main ? (
                <div
                  onClick={() => handleOpenPlayerModal(slot.main)}
                  className={`bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center w-full shadow-xl cursor-pointer hover:bg-slate-800 transition-all hover:scale-110 group-hover:ring-2 ${tacticalPhase === 'ip' ? 'hover:border-blue-500 hover:shadow-blue-900/30 group-hover:ring-blue-500/50' : 'hover:border-red-500 hover:shadow-red-900/30 group-hover:ring-red-500/50'}`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${displayScore >= 14 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : displayScore >= 12.5 ? 'bg-green-400' : 'bg-slate-500'}`}></span>
                    <div className="text-white font-bold text-xs truncate max-w-[90px]">{slot.main.name.split(' ').pop()}</div>
                  </div>
                  <div className="bg-black/40 rounded px-2 py-0.5 inline-block border border-white/5">
                    <span className={`${tacticalPhase === 'ip' ? 'text-blue-400' : 'text-red-400'} text-xs font-black`}>{displayScore.toFixed(1)}</span>
                  </div>

                  {/* Tooltip Hover */}
                  <div className="hidden group-hover:block absolute bg-slate-900/95 backdrop-blur-xl p-4 rounded-xl border border-white/10 z-50 w-56 -bottom-2 translate-y-full left-1/2 -translate-x-1/2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <h5 className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Opções de Banco</h5>
                    {slot.backup && (
                      <div className="flex justify-between text-xs items-center mb-2 hover:bg-white/5 p-1.5 rounded transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); if (slot.backup) handleOpenPlayerModal(slot.backup); }}>
                        <span className="text-white font-medium">{slot.backup.name}</span>
                        <span className="text-slate-400 font-bold bg-slate-800 px-1.5 rounded">
                            {(tacticalPhase === 'ip' && slot.ipRole && slot.backup.fm26Scores.ip[slot.ipRole] ? slot.backup.fm26Scores.ip[slot.ipRole] : (tacticalPhase === 'oop' && slot.oopRole && slot.backup.fm26Scores.oop[slot.oopRole] ? slot.backup.fm26Scores.oop[slot.oopRole] : slot.backup.mainScore)).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {slot.prospect && (
                      <div className="flex justify-between text-xs items-center mt-2 pt-2 border-t border-white/5 hover:bg-white/5 p-1.5 rounded transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); if (slot.prospect) handleOpenPlayerModal(slot.prospect); }}>
                        <span className="text-purple-400 font-bold flex items-center gap-1"><TrendingUp size={10} /> {slot.prospect.name}</span>
                        <span className="text-purple-300 font-bold">
                            {(tacticalPhase === 'ip' && slot.ipRole && slot.prospect.fm26Scores.ip[slot.ipRole] ? slot.prospect.fm26Scores.ip[slot.ipRole] : (tacticalPhase === 'oop' && slot.oopRole && slot.prospect.fm26Scores.oop[slot.oopRole] ? slot.prospect.fm26Scores.oop[slot.oopRole] : slot.prospect.mainScore)).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {!slot.backup && !slot.prospect && <span className="text-slate-500 text-[10px] italic">Sem substitutos diretos.</span>}
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/20 backdrop-blur border border-red-500/30 p-2 rounded-lg text-red-200 text-xs font-bold w-full text-center">VAZIO</div>
              )}
            </div>
          );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className={`text-white font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 ${tacticalPhase === 'ip' ? 'border-blue-500' : 'border-red-500'} pl-3`}>
                Formação {tacticalPhase === 'ip' ? '(Com Bola)' : '(Sem Bola)'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(FORMATIONS).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setFormation(fmt)}
                  className={`p-3 rounded-lg text-xs font-bold transition-all border ${formation === fmt
                    ? (tacticalPhase === 'ip' ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/20' : 'bg-red-600 text-white border-red-400 shadow-md shadow-red-900/20')
                    : 'bg-black/20 text-slate-400 border-transparent hover:bg-black/40 hover:text-white hover:border-white/10'}`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* FM26 Instructions Panel */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-white font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-purple-500 pl-3">
                Instruções {tacticalPhase === 'ip' ? 'Ofensivas' : 'Defensivas'} (FM26)
            </h3>
            <div className="space-y-4">
                {Object.entries(tacticalPhase === 'ip' ? FM26_INSTRUCTIONS.ip : FM26_INSTRUCTIONS.oop).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{category}</div>
                        <div className="flex flex-wrap gap-2">
                            {items.map(item => (
                                <div key={item} className="px-2 py-1 bg-black/30 rounded border border-white/5 text-[10px] text-slate-300 font-medium hover:bg-white/5 cursor-pointer transition-colors">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
            <h3 className="text-white font-black mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-yellow-500 pl-3">Legenda Tática</h3>
            <div className="space-y-3 text-xs font-medium">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-white/5"><div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div> <span className="text-slate-200">Elite / Classe Mundial</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-white/5"><div className="w-3 h-3 bg-green-400 rounded-full"></div> <span className="text-slate-200">Titular Sólido</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-white/5"><div className="w-3 h-3 bg-slate-500 rounded-full"></div> <span className="text-slate-200">Em Desenvolvimento / Rotação</span></div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-white/5"><TrendingUp size={14} className="text-purple-400" /> <span className="text-purple-300">Jovem Promessa (Banco)</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SquadList = () => {
    const [teamFilter, setTeamFilter] = useState('all');
    const [catFilter, setCatFilter] = useState('all');

    const filtered = players.filter(p => {
      // Filtro de Time
      if (teamFilter !== 'all') {
        if (teamFilter === 'main' && p.teamType !== 'main') return false;
        if (teamFilter === 'youth' && p.teamType !== 'youth') return false;
        if (teamFilter === 'reserve' && p.teamType !== 'reserve') return false;
        if (teamFilter === 'loan' && p.teamType !== 'loan') return false;
      }

      // Filtro de Categoria
      if (catFilter !== 'all' && p.category !== catFilter) return false;

      return true;
    });

    const toggleCompare = (player: Player) => {
      if (compareList.find(c => c.id === player.id)) {
        setCompareList(compareList.filter(c => c.id !== player.id));
      } else {
        if (compareList.length < 2) setCompareList([...compareList, player]);
        else alert("Remova um jogador antes de adicionar outro.");
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Filtros Hierárquicos */}
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl space-y-4">
          {/* Nível 1: Times */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {[
              { id: 'all', label: 'Todos os Times' },
              { id: 'main', label: 'Principal', color: 'bg-blue-600' },
              { id: 'youth', label: 'Sub-19/20', color: 'bg-purple-600' },
              { id: 'reserve', label: 'Reserva', color: 'bg-slate-600' },
              { id: 'loan', label: 'Emprestados', color: 'bg-orange-600' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTeamFilter(t.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${teamFilter === t.id
                  ? (t.color || 'bg-white text-slate-900') + ' scale-105 shadow-md ring-2 ring-white/20'
                  : 'bg-black/40 text-slate-400 border border-white/5 hover:bg-black/60 hover:text-white'
                  } ${teamFilter === t.id && t.id !== 'all' ? 'text-white' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Nível 2: Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-2 items-center scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mr-3 flex items-center gap-1"><Filter size={12} /> Status:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'elite', label: 'Elite' },
              { id: 'titular', label: 'Titular' },
              { id: 'rotacao', label: 'Rotação' },
              { id: 'promessa', label: 'Promessa' },
              { id: 'baixo_nivel', label: 'Baixo Nível' },
              { id: 'vender', label: 'Vender' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCatFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${catFilter === cat.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'bg-black/20 text-slate-500 border border-white/5 hover:text-slate-300 hover:bg-black/40'
                  }`}
              >
                {cat.label}
              </button>
            ))}

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <button
              onClick={() => setShowCompareModal(true)}
              disabled={compareList.length < 2}
              className={`ml-auto flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${compareList.length === 2
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50 hover:bg-purple-500 hover:scale-105'
                : 'bg-white/5 text-slate-600 opacity-50 cursor-not-allowed border border-white/5'
                }`}
            >
              <ArrowRightLeft size={14} /> Comparar ({compareList.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => handleOpenPlayerModal(p)}
              className={`bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border transition-all hover:scale-[1.02] cursor-pointer hover:shadow-2xl group ${p.category === 'elite' ? 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)] hover:border-yellow-500/60' :
                p.category === 'titular' ? 'border-green-500/30 hover:border-green-500/60' :
                  p.category === 'promessa' ? 'border-purple-500/30 hover:border-purple-500/60' :
                    p.category === 'vender' ? 'border-red-500/30 hover:border-red-500/60 opacity-80' : 'border-white/5 hover:border-white/20'
                }`}
            >
              {/* Badge de Time */}
              <div className="mb-3 flex justify-between items-start">
                <span className={`text-[10px] px-2 py-1 rounded font-black uppercase tracking-widest ${p.teamType === 'main' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' :
                  p.teamType === 'youth' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' :
                    p.teamType === 'reserve' ? 'bg-slate-700/40 text-slate-400 border border-slate-600/30' :
                      'bg-orange-600/20 text-orange-300 border border-orange-500/30'
                  }`}>
                  {p.team}
                  {p.teamType === 'youth' && ' ⭐'}
                  {p.teamType === 'loan' && ' ↔️'}
                  {p.teamType === 'reserve' && ' B'}
                </span>
                {compareList.find(c => c.id === p.id) && <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></span>}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-white font-bold text-lg leading-tight truncate max-w-[150px] group-hover:text-blue-400 transition-colors">{p.name}</h4>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">{p.age} anos • {p.nat}</div>
                </div>
                <div className={`text-2xl font-black ${p.mainScore >= 14 ? 'text-yellow-400' : p.mainScore >= 12 ? 'text-green-400' : 'text-slate-400'}`}>
                  {p.mainScore.toFixed(1)}
                </div>
              </div>

              <div className="flex gap-1.5 mb-4 flex-wrap">
                {p.positions.primary.map(pos => (
                  <span key={pos} className="px-2 py-1 bg-black/40 text-slate-300 text-[10px] rounded border border-white/10 font-bold uppercase tracking-wider">{POS_LABELS[pos]}</span>
                ))}
              </div>

              {/* TRAINING PRIORITY */}
              <div className="bg-black/20 p-3 rounded-lg border border-white/5 mb-4 group-hover:bg-black/40 transition-colors">
                <div className="text-slate-500 uppercase font-black mb-2 text-[10px] tracking-widest flex items-center gap-1"><Activity size={10} /> Foco Evolutivo</div>
                {p.attributes.stamina < 12 && <div className="text-red-400 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Físico (Resistência)</div>}
                {p.attributes.decisions < 11 && <div className="text-yellow-400 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Mental (Decisões)</div>}
                {p.attributes.stamina >= 12 && p.attributes.decisions >= 11 && <div className="text-green-400 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Polimento Técnico</div>}
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(p);
                  }}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all w-full border ${compareList.find(c => c.id === p.id)
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'}`}
                >
                  {compareList.find(c => c.id === p.id) ? 'Selecionado para Comparar' : 'Comparar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CompareModal = () => {
    if (!showCompareModal || compareList.length !== 2) return null;
    const [p1, p2] = compareList;

    const getData = (player: Player) => [
      { subject: 'Stretching', A: player.scores.stretching, fullMark: 20 },
      { subject: 'Linking', A: player.scores.linking, fullMark: 20 },
      { subject: 'Dynamic', A: player.scores.dynamic, fullMark: 20 },
      { subject: 'Engaged', A: player.scores.engaged, fullMark: 20 },
      { subject: 'Tracking', A: player.scores.tracking, fullMark: 20 },
      { subject: 'Outlet', A: player.scores.outlet, fullMark: 20 },
    ];

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity animate-in fade-in duration-200">
        <div className="bg-slate-900/90 w-full max-w-4xl h-[90vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col backdrop-blur-xl relative top-0" onClick={(e) => e.stopPropagation()}>
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="text-white font-black uppercase tracking-wider flex items-center gap-3 text-lg"><ArrowRightLeft className="text-blue-500" /> Comparação Tática</h3>
            <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
            <div className="col-span-1 md:col-span-2 h-72 flex justify-center py-4 bg-white/5 rounded-xl border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getData(p1).map((d, i) => ({ ...d, B: getData(p2)[i].A }))}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  {/* @ts-ignore */}
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                  <Radar name={p1.name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Radar name={p2.name} dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-900/10 p-5 rounded-xl border border-blue-500/20 relative overflow-hidden group hover:bg-blue-900/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                <h4 className="text-blue-400 font-black text-2xl mb-1 tracking-tight">{p1.name}</h4>
                <div className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">{p1.age} anos • {p1.nat}</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-400 font-medium">Nota Geral</span>
                    <span className="font-bold text-white text-lg bg-blue-600/20 px-3 py-0.5 rounded border border-blue-500/30">{p1.mainScore.toFixed(1)}</span>
                  </div>
                  <div className="h-px bg-white/5 my-2"></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Físico Média</span> <span className="font-bold text-slate-200">{((p1.attributes.pace + p1.attributes.strength) / 2).toFixed(1)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Técnico Média</span> <span className="font-bold text-slate-200">{((p1.attributes.technique + p1.attributes.passing) / 2).toFixed(1)}</span></div>
                </div>
              </div>

              <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20 relative overflow-hidden group hover:bg-purple-900/20 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                <h4 className="text-purple-400 font-black text-2xl mb-1 tracking-tight">{p2.name}</h4>
                <div className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">{p2.age} anos • {p2.nat}</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-400 font-medium">Nota Geral</span>
                    <span className="font-bold text-white text-lg bg-purple-600/20 px-3 py-0.5 rounded border border-purple-500/30">{p2.mainScore.toFixed(1)}</span>
                  </div>
                  <div className="h-px bg-white/5 my-2"></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Físico Média</span> <span className="font-bold text-slate-200">{((p2.attributes.pace + p2.attributes.strength) / 2).toFixed(1)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Técnico Média</span> <span className="font-bold text-slate-200">{((p2.attributes.technique + p2.attributes.passing) / 2).toFixed(1)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PlayerDetailModal = () => {
    if (!showPlayerModal || !selectedPlayer) return null;
    const p = selectedPlayer;

    // DEFINIÇÃO DE ATRIBUTOS CHAVE POR POSIÇÃO (SIMPLIFICADO)
    const KEY_ATTRIBUTES: Record<string, string[]> = {
      'gk': ['reflexes', 'handling', 'kicking', 'positioning', 'oneOnOne'],
      'dc': ['tackling', 'marking', 'heading', 'positioning', 'jumping', 'strength'],
      'dl': ['tackling', 'marking', 'positioning', 'pace', 'stamina', 'crossing'],
      'dr': ['tackling', 'marking', 'positioning', 'pace', 'stamina', 'crossing'],
      'dmc': ['tackling', 'marking', 'positioning', 'passing', 'stamina', 'workRate'],
      'mc': ['passing', 'vision', 'firstTouch', 'decisions', 'technique', 'stamina'],
      'ml': ['crossing', 'dribbling', 'acceleration', 'pace', 'technique', 'passing'],
      'mr': ['crossing', 'dribbling', 'acceleration', 'pace', 'technique', 'passing'],
      'aml': ['dribbling', 'finishing', 'acceleration', 'pace', 'flair', 'agility'],
      'amr': ['dribbling', 'finishing', 'acceleration', 'pace', 'flair', 'agility'],
      'amc': ['passing', 'vision', 'technique', 'dribbling', 'finishing', 'flair'],
      'st': ['finishing', 'anticipation', 'composure', 'acceleration', 'heading', 'pace']
    };

    // Identificar posição principal para contexto (usar estado se disponível ou fallback para primária)
    const mainPos = modalPositionContext || p.positions.primary[0] || 'mc';
    const keyAttrs = KEY_ATTRIBUTES[mainPos] || [];

    // Calcular pontos fortes e fracos INTELIGENTES
    const allAttributes = [
      { name: 'Aceleração', value: p.attributes.acceleration, type: 'Físico', key: 'acceleration' },
      { name: 'Agilidade', value: p.attributes.agility, type: 'Físico', key: 'agility' },
      { name: 'Equilíbrio', value: p.attributes.balance, type: 'Físico', key: 'balance' },
      { name: 'Pulo', value: p.attributes.jumping, type: 'Físico', key: 'jumping' },
      { name: 'Velocidade', value: p.attributes.pace, type: 'Físico', key: 'pace' },
      { name: 'Resistência', value: p.attributes.stamina, type: 'Físico', key: 'stamina' },
      { name: 'Força', value: p.attributes.strength, type: 'Físico', key: 'strength' },
      { name: 'Agressão', value: p.attributes.aggression, type: 'Mental', key: 'aggression' },
      { name: 'Antecipação', value: p.attributes.anticipation, type: 'Mental', key: 'anticipation' },
      { name: 'Bravura', value: p.attributes.bravery, type: 'Mental', key: 'bravery' },
      { name: 'Frieza', value: p.attributes.composure, type: 'Mental', key: 'composure' },
      { name: 'Concentração', value: p.attributes.concentration, type: 'Mental', key: 'concentration' },
      { name: 'Decisões', value: p.attributes.decisions, type: 'Mental', key: 'decisions' },
      { name: 'Determinação', value: p.attributes.determination, type: 'Mental', key: 'determination' },
      { name: 'Visão', value: p.attributes.vision, type: 'Mental', key: 'vision' },
      { name: 'Trabalho em Equipe', value: p.attributes.teamwork, type: 'Mental', key: 'teamwork' },
      { name: 'Posicionamento', value: p.attributes.positioning, type: 'Mental', key: 'positioning' },
      { name: 'Improviso', value: p.attributes.flair, type: 'Mental', key: 'flair' },
      { name: 'Cruzamento', value: p.attributes.crossing, type: 'Técnico', key: 'crossing' },
      { name: 'Drible', value: p.attributes.dribbling, type: 'Técnico', key: 'dribbling' },
      { name: 'Finalização', value: p.attributes.finishing, type: 'Técnico', key: 'finishing' },
      { name: 'Prim. Toque', value: p.attributes.firstTouch, type: 'Técnico', key: 'firstTouch' },
      { name: 'Cabeceio', value: p.attributes.heading, type: 'Técnico', key: 'heading' },
      { name: 'Chute Longe', value: p.attributes.longShots, type: 'Técnico', key: 'longShots' },
      { name: 'Marcação', value: p.attributes.marking, type: 'Técnico', key: 'marking' },
      { name: 'Passe', value: p.attributes.passing, type: 'Técnico', key: 'passing' },
      { name: 'Desarme', value: p.attributes.tackling, type: 'Técnico', key: 'tackling' },
      { name: 'Técnica', value: p.attributes.technique, type: 'Técnico', key: 'technique' }
    ].sort((a, b) => b.value - a.value);

    // Strengths: Absolutos (>14)
    const strengths = allAttributes.filter(a => a.value >= 14).slice(0, 6);

    // Weaknesses (TREINO): Apenas atributos IMPORTANTES para a posição que estão abaixo do ideal
    // OU atributos importantes medianos que podem evoluir.
    const trainingSuggestions = allAttributes
      .filter(a => keyAttrs.includes(a.key)) // Só atributos chave
      .filter(a => a.value < 13) // Que tem espaço pra melhorar
      .sort((a, b) => a.value - b.value) // Do pior pro melhor
      .slice(0, 4);

    // Calcular melhores posições baseado nas posições do FM
    const positionRatings = [
      { pos: 'GK', label: 'Goleiro', rating: p.scores.gk > 10 ? 20 : 0 },
      { pos: 'DC', label: 'Zagueiro', rating: p.positions.primary.includes('dc') ? 20 : p.positions.secondary.includes('dc') ? 12 : 0 },
      { pos: 'DL', label: 'Lat. Esq.', rating: p.positions.primary.includes('dl') ? 20 : p.positions.secondary.includes('dl') ? 12 : 0 },
      { pos: 'DR', label: 'Lat. Dir.', rating: p.positions.primary.includes('dr') ? 20 : p.positions.secondary.includes('dr') ? 12 : 0 },
      { pos: 'DMC', label: 'Volante', rating: p.positions.primary.includes('dmc') ? 20 : p.positions.secondary.includes('dmc') ? 12 : 0 },
      { pos: 'MC', label: 'Meio-Campo', rating: p.positions.primary.includes('mc') ? 20 : p.positions.secondary.includes('mc') ? 12 : 0 },
      { pos: 'AML', label: 'Ponta Esquerda', rating: p.positions.primary.includes('aml') ? 20 : p.positions.secondary.includes('aml') ? 12 : 0 },
      { pos: 'AMR', label: 'Ponta Direita', rating: p.positions.primary.includes('amr') ? 20 : p.positions.secondary.includes('amr') ? 12 : 0 },
      { pos: 'ST', label: 'Atacante', rating: p.positions.primary.includes('st') ? 20 : p.positions.secondary.includes('st') ? 12 : 0 }
    ].filter(pr => pr.rating > 0).sort((a, b) => b.rating - a.rating);

    const getAttributeColor = (val: number) => {
      if (val >= 16) return 'bg-green-500 text-black font-bold';
      if (val >= 13) return 'bg-green-800 text-green-100 font-bold'; // Verde escuro
      if (val >= 10) return 'bg-slate-700 text-white'; // Normal
      if (val >= 6) return 'bg-slate-800 text-slate-400'; // Baixo
      return 'bg-red-900 text-red-200'; // Muito baixo
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-[100] p-6 pt-20 transition-all animate-in fade-in zoom-in-95 duration-200" onClick={() => setShowPlayerModal(false)}>
        <div className="bg-slate-900/95 w-full max-w-5xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col backdrop-blur-xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>

          {/* HEADER */}
          <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-black text-3xl tracking-tight">{p.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest border ${p.category === 'elite' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                  p.category === 'titular' ? 'border-green-500 text-green-500 bg-green-500/10' :
                    p.category === 'promessa' ? 'border-purple-500 text-purple-500 bg-purple-500/10' :
                      'border-slate-500 text-slate-500'
                  }`}>{p.category}</span>
              </div>
              <p className="text-slate-400 font-medium text-sm flex items-center gap-2"><span className="text-slate-500">ID: {p.id.slice(0, 8)}</span> • {p.age} anos • {p.nat}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-lg text-center">
                <div className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-0.5">Nota Geral</div>
                <div className="text-2xl font-black text-white leading-none">{p.mainScore.toFixed(1)}</div>
              </div>
              <button onClick={() => setShowPlayerModal(false)} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"><X size={24} /></button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-white/5 bg-black/20 px-6 gap-8">
            <button
              onClick={() => setModalTab('overview')}
              className={`py-4 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${modalTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setModalTab('attributes')}
              className={`py-4 text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${modalTab === 'attributes' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Atributos Completos
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-transparent to-black/20 custom-scrollbar">

            {/* CONTEÚDO: VISÃO GERAL */}
            {modalTab === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                {/* Cards TOPO */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5 hover:border-white/10 transition-all">
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-2">Físico Média</div>
                    <div className="text-3xl font-black text-white">{((p.attributes.pace + p.attributes.stamina + p.attributes.strength) / 3).toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5 hover:border-white/10 transition-all">
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-2">Técnico Média</div>
                    <div className="text-3xl font-black text-white">{((p.attributes.technique + p.attributes.passing + p.attributes.dribbling) / 3).toFixed(1)}</div>
                  </div>
                  <div className="bg-white/5 p-5 rounded-xl text-center border border-white/5 hover:border-white/10 transition-all">
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-2">Mental Média</div>
                    <div className="text-3xl font-black text-white">{((p.attributes.decisions + p.attributes.vision + p.attributes.workRate) / 3).toFixed(1)}</div>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Esquerda: Posições e Recomendação */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-yellow-500 pl-3">
                        Melhores Posições
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {positionRatings.map((pr, idx) => (
                          <div
                            key={pr.pos}
                            onClick={() => setModalPositionContext(pr.pos.toLowerCase())}
                            className={`p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden ${modalPositionContext === pr.pos.toLowerCase()
                              ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40 ring-1 ring-white/20'
                              : pr.rating === 20
                                ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                              }`}
                          >
                            <div className="flex items-center justify-between relative z-10">
                              <span className={`font-bold text-sm ${modalPositionContext === pr.pos.toLowerCase() ? 'text-white' : 'text-slate-300'}`}>{pr.label}</span>
                              {idx === 0 && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold shadow-lg">1ª</span>}
                              {idx === 1 && <span className="text-[10px] bg-slate-600 text-white px-2 py-0.5 rounded font-bold">2ª</span>}
                            </div>
                            <div className={`text-[10px] uppercase tracking-wider mt-2 font-bold ${modalPositionContext === pr.pos.toLowerCase() ? 'text-blue-200' : 'text-slate-500'}`}>
                              {pr.rating === 20 ? 'Natural' : 'Competente'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FM26 Roles Analysis */}
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-blue-500 pl-3">Melhores Funções (FM26)</h4>
                      
                      <div className="space-y-4">
                        {/* IP Role */}
                        <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-xl">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Activity size={12}/> Com a Posse (IP)</span>
                              <span className="text-white font-bold text-lg">{p.bestIPRole}</span>
                           </div>
                           <div className="w-full bg-black/40 rounded-full h-2 mb-1">
                              {/* @ts-ignore */}
                              <div className="bg-blue-500 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(p.fm26Scores.ip[p.bestIPRole] / 20) * 100}%` }}></div>
                           </div>
                           <div className="text-right text-[10px] text-slate-400 font-bold">Nota: {(p.fm26Scores.ip[p.bestIPRole] || 0).toFixed(1)}</div>
                        </div>

                        {/* OOP Role */}
                        <div className="bg-red-900/10 border border-red-500/20 p-3 rounded-xl">
                           <div className="flex justify-between items-center mb-2">
                              <span className="text-red-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Shield size={12}/> Sem a Posse (OOP)</span>
                              <span className="text-white font-bold text-lg">{p.bestOOPRole}</span>
                           </div>
                           <div className="w-full bg-black/40 rounded-full h-2 mb-1">
                              {/* @ts-ignore */}
                              <div className="bg-red-500 h-2 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${(p.fm26Scores.oop[p.bestOOPRole] / 20) * 100}%` }}></div>
                           </div>
                           <div className="text-right text-[10px] text-slate-400 font-bold">Nota: {(p.fm26Scores.oop[p.bestOOPRole] || 0).toFixed(1)}</div>
                        </div>
                      </div>

                      {/* Legacy DNA (Collapsed/Smaller) */}
                      <div className="mt-6 pt-4 border-t border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                        <h5 className="text-slate-500 font-bold mb-3 text-[10px] uppercase tracking-widest">DNA Tático (Legado)</h5>
                        <div className="space-y-2">
                          {Object.entries(p.scores).filter(([key]) => key !== 'gk').sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{key}</span>
                              <span className="text-slate-300 font-bold text-[10px]">{value.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direita: Fortes e Fracos */}
                  <div className="space-y-8">
                    {/* Fortes */}
                    <div>
                      <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-green-500 pl-3">Pontos Fortes</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {strengths.map(s => (
                          <div key={s.name} className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex justify-between items-center hover:bg-green-500/20 transition-colors">
                            <span className="text-green-200 text-xs font-medium">{s.name}</span>
                            <span className="text-green-400 font-bold text-sm bg-green-900/40 px-2 py-0.5 rounded">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sugestão de Treino INTELIGENTE */}
                    <div>
                      <h4 className="text-orange-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-widest border-l-4 border-orange-500 pl-3">Foco de Treino</h4>
                      {trainingSuggestions.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wide font-bold">Para evoluir como <span className="text-white">{mainPos.toUpperCase()}</span>:</p>
                          <div className="grid grid-cols-2 gap-3">
                            {trainingSuggestions.map(w => (
                              <div key={w.name} className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg flex justify-between items-center hover:bg-orange-500/20 transition-colors">
                                <span className="text-orange-200 text-xs font-medium">{w.name}</span>
                                <span className="text-orange-400 font-bold text-sm bg-orange-900/40 px-2 py-0.5 rounded">{w.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 p-4 rounded-lg text-slate-400 text-xs border border-white/5 italic">
                          Jogador completo para a função. Focar em manutenção física e atributos mentais.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTEÚDO: ATRIBUTOS COMPLETOS */}
            {modalTab === 'attributes' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {['Físico', 'Mental', 'Técnico'].map(type => (
                    <div key={type} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h4 className="text-blue-400 font-black mb-4 border-b border-white/10 pb-3 text-sm uppercase tracking-widest">{type}</h4>
                      <div className="space-y-1.5">
                        {allAttributes.filter(a => a.type === type).sort((a, b) => a.name.localeCompare(b.name)).map(attr => (
                          <div key={attr.name} className={`flex justify-between items-center p-1.5 px-3 rounded-lg transition-colors ${keyAttrs.includes(attr.key) ? 'bg-white/10 border border-white/10 shadow-sm' : 'hover:bg-white/5'}`}>
                            <span className={`text-xs uppercase tracking-wide font-bold ${keyAttrs.includes(attr.key) ? 'text-white' : 'text-slate-500'}`}>
                              {attr.name}
                            </span>
                            <span className={`text-xs w-8 h-6 flex items-center justify-center rounded font-bold shadow-sm ${getAttributeColor(attr.value)}`}>
                              {attr.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 text-xs text-blue-200 flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span><strong className="text-white uppercase tracking-wider">Modo de Análise:</strong> Os atributos destacados em branco são essenciais para a posição de <strong>{mainPos.toUpperCase()}</strong>.</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  const Guide = () => {
    const categories = [
      { name: 'Elite', desc: 'Jogadores de classe mundial (Nota ≥ 14)', color: 'text-yellow-400' },
      { name: 'Titular', desc: 'Jogadores prontos para o time principal (Nota ≥ 12.5)', color: 'text-green-400' },
      { name: 'Promessa', desc: 'Jovens com alto potencial (≤ 21 anos, Nota ≥ 10.5)', color: 'text-purple-400' },
      { name: 'Rotação', desc: 'Opções úteis para compor elenco', color: 'text-slate-400' },
      { name: 'Nível Baixo', desc: 'Jogadores abaixo do nível exigido (Nota < 10)', color: 'text-orange-400' },
      { name: 'Vender', desc: 'Veteranos sem rendimento ou excedentes (≥ 29 anos, Nota < 10)', color: 'text-red-400' }
    ];

    const methodologies = [
      { name: 'Stretching (Amplitude)', desc: 'Capacidade de alargar o campo ofensivamente', attr: 'Velocidade, Aceleração, Cruzamento', role: 'Pontas, Alas' },
      { name: 'Linking (Ligação)', desc: 'Conectar defesa e ataque, ditar ritmo', attr: 'Passe, Visão, Decisões, Técnica', role: 'Playmakers' },
      { name: 'Dynamic (Dinâmica)', desc: 'Movimentação e infiltração constante', attr: 'Sem Bola, Antecipação, Físico', role: 'Box-to-Box, Atacantes' },
      { name: 'Engaged (Combate)', desc: 'Intensidade na recuperação de bola', attr: 'Desarme, Agressão, Bravura, Trabalho em Equipe', role: 'Volantes, Zagueiros' },
      { name: 'Tracking (Cobertura)', desc: 'Acompanhar adversários e fechar espaços', attr: 'Marcação, Concentração, Posicionamento', role: 'Laterais Defensivos' },
      { name: 'Outlet (Referência)', desc: 'Segurar a bola e aliviar pressão (Pivô)', attr: 'Força, Equilíbrio, Controle de Bola', role: 'Pivôs, Zagueiros Rebatedores' },
      { name: 'GK (Goleiro)', desc: 'Proteção da meta e distribuição', attr: 'Reflexos, Posicionamento, Agilidade', role: 'Goleiros' }
    ];

    const positions = [
      { id: 'GK', name: 'Goleiro', desc: 'Última linha de defesa' },
      { id: 'DC', name: 'Zagueiro Central', desc: 'Protege a área central' },
      { id: 'DL/DR', name: 'Laterais', desc: 'Protegem os flancos defensivos' },
      { id: 'WBL/WBR', name: 'Alas', desc: 'Apoiam ataque e defesa pelos lados' },
      { id: 'DMC', name: 'Volante', desc: 'Protege a defesa e inicia jogadas' },
      { id: 'MC', name: 'Meio-Campo', desc: 'Controla o ritmo e conecta setores' },
      { id: 'ML/MR', name: 'Meias Laterais', desc: 'Armação e apoio pelos lados' },
      { id: 'AMC', name: 'Meia Atacante', desc: 'Criação ofensiva final' },
      { id: 'AML/AMR', name: 'Pontas', desc: 'Ataque pelos flancos, corte para dentro' },
      { id: 'ST', name: 'Atacante', desc: 'Finalização e referência ofensiva' }
    ];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Dicas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "PRÉ-TEMPORADA", items: ["Importar elenco atualizado", "Identificar contratos expirando", "Definir tática primária", "Vender excedentes (Categoria: Vender)"] },
            { title: "TREINAMENTO", items: ["Promessas: Foco físico até 21 anos", "Titulares: Foco na função tática", "Veteranos: Gestão de carga (Resistência)"] },
            { title: "GESTÃO DE ELENCO", items: ["Mantenha 2 jogadores por posição", "Evite mais de 3 jogadores 'Elite' no banco (insatisfação)", "Empreste jovens com nota < 10"] }
          ].map((g, i) => (
            <div key={i} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-xl border border-white/5 hover:bg-slate-900/80 transition-all shadow-lg group">
              <h3 className="text-white font-black mb-4 flex items-center gap-3 text-sm uppercase tracking-widest"><CheckCircle size={16} className="text-green-500" /> {g.title}</h3>
              <ul className="space-y-3">
                {g.items.map((item, idx) => (
                  <li key={idx} className="text-slate-400 text-xs font-medium flex items-start gap-3 leading-relaxed group-hover:text-slate-300 transition-colors">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Metodologias */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-8 flex items-center gap-3 text-lg uppercase tracking-wider"><Activity size={24} className="text-blue-500" /> Metodologias Táticas (DNA)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methodologies.map(m => (
              <div key={m.name} className="bg-black/20 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 hover:bg-black/40 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                  <div className="text-blue-400 font-bold text-sm uppercase tracking-wider">{m.name}</div>
                </div>
                <div className="text-slate-300 text-xs mb-4 font-medium leading-relaxed border-b border-white/5 pb-4">{m.desc}</div>
                <div className="space-y-1">
                  <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Atributos Chave</div>
                  <div className="text-white text-xs">{m.attr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-xl">
          <h3 className="text-white font-black mb-8 flex items-center gap-3 text-lg uppercase tracking-wider"><Users size={24} className="text-yellow-500" /> Hierarquia do Elenco</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <div key={c.name} className="bg-black/20 p-5 rounded-xl border border-white/5 hover:bg-black/40 transition-all">
                <div className={`${c.color} font-black text-lg mb-2 uppercase tracking-tight`}>{c.name}</div>
                <div className="text-slate-400 text-xs font-medium leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black/60 text-slate-100 p-6 font-sans backdrop-blur-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Glassmórfico */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex items-center gap-5 z-10">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-3.5 rounded-xl shadow-lg shadow-blue-900/30 ring-1 ring-white/10">
              <Activity size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase drop-shadow-sm">FM26 Analyzer <span className="text-blue-500">PRO</span></h1>
              <p className="text-slate-400 font-medium text-xs tracking-widest uppercase">Central de Inteligência Tática</p>
            </div>
          </div>

          <div className="flex gap-4 z-10 mt-4 md:mt-0">
            <label className="flex items-center gap-2 bg-white/5 hover:bg-blue-600 hover:border-blue-500 border border-white/10 text-white px-6 py-3 rounded-xl cursor-pointer font-bold transition-all shadow-lg hover:shadow-blue-500/25 group/btn">
              <Upload size={18} className="text-slate-400 group-hover/btn:text-white transition-colors" />
              <span className="uppercase text-xs tracking-wider">Importar Elenco</span>
              <input type="file" accept=".html,.htm,.csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </header>

        {/* Navigation Glassmórfica */}
        <nav className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 backdrop-blur-md overflow-x-auto shadow-inner">
          {[
            { id: 'dashboard', label: 'VISÃO GERAL', icon: BarChart3 },
            { id: 'squad', label: 'ELENCO', icon: Users },
            { id: 'tactics', label: 'TÁTICAS', icon: Shield },
            { id: 'guide', label: 'MANUAL', icon: CheckCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-bold text-xs tracking-wider transition-all duration-300 ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <main className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {players.length === 0 ? (
            <div className="text-center py-32 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center">
              <div className="bg-slate-800/50 p-6 rounded-full mb-6 ring-1 ring-white/10">
                <Upload size={48} className="text-slate-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Sua Temporada Começa Aqui</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">Importe a visualização "All Attributes" do Football Manager para desbloquear análises profundas de elenco e tática.</p>
              <label className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold cursor-pointer transition-all shadow-xl shadow-blue-900/30 inline-flex items-center gap-3 transform hover:scale-105 duration-200">
                <Upload size={20} /> <span className="uppercase tracking-widest text-xs">Selecionar Arquivo</span>
                <input type="file" accept=".html,.htm,.csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'squad' && <SquadList />}
              {activeTab === 'tactics' && <TacticsBoard />}
              {activeTab === 'guide' && <Guide />}
            </>
          )}
        </main>

        {/* Modals */}
        <CompareModal />
        <PlayerDetailModal />
      </div>
    </div>
  );
};

export default FMAnalyzer;