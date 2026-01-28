import { Player } from '../types';
import { calculatePlayerScores, calculateFM26Scores } from './scoring';
import { determinePlayerCategory, determineTeamType } from './classification';
import {
  augmentPositionsWithAnalysis,
  determineBestRole,
  determineBestIPRole,
  determineBestOOPRole,
  calculateBestPositionAndScore,
} from './roles';

export const processFixedFormatData = (rawData: any[]): Player[] => {
  console.log('Processing fixed format data:', rawData);

  return rawData
    .map((row: any, index: number) => {
      // Se row é um array, usa índices, se é objeto com uma chave, pega o primeiro valor
      const data = Array.isArray(row)
        ? row
        : row && typeof row === 'object'
          ? Object.values(row)[0]
          : row;

      if (!Array.isArray(data) || data.length < 4) {
        console.log('Invalid row format:', row);
        return null;
      }

      // Mapeamento baseado no documento Mapeamento Importação.txt
      const team = data[0] || 'Unknown';
      const name = data[1] || 'Unknown Player';
      const nationality = data[2] || 'Unknown';
      const age = parseInt(data[3]) || 25;

      // Atributos Físicos (7-14)
      const attributes = {
        acceleration: parseInt(data[7]) || 1,
        agility: parseInt(data[8]) || 1,
        balance: parseInt(data[9]) || 1,
        jumping: parseInt(data[10]) || 1,
        naturalFitness: parseInt(data[11]) || 1,
        pace: parseInt(data[12]) || 1,
        stamina: parseInt(data[13]) || 1,
        strength: parseInt(data[14]) || 1,

        // Atributos Mentais (15-27)
        aggression: parseInt(data[15]) || 1,
        anticipation: parseInt(data[16]) || 1,
        bravery: parseInt(data[17]) || 1,
        composure: parseInt(data[18]) || 1,
        concentration: parseInt(data[19]) || 1,
        decisions: parseInt(data[20]) || 1,
        determination: parseInt(data[21]) || 1,
        flair: parseInt(data[22]) || 1,
        offTheBall: parseInt(data[23]) || 1,
        positioning: parseInt(data[24]) || 1,
        teamwork: parseInt(data[25]) || 1,
        vision: parseInt(data[26]) || 1,
        workRate: parseInt(data[27]) || 1,

        // Atributos Técnicos (28-37)
        crossing: parseInt(data[28]) || 1,
        dribbling: parseInt(data[29]) || 1,
        finishing: parseInt(data[30]) || 1,
        firstTouch: parseInt(data[31]) || 1,
        heading: parseInt(data[32]) || 1,
        longShots: parseInt(data[33]) || 1,
        marking: parseInt(data[34]) || 1,
        passing: parseInt(data[35]) || 1,
        tackling: parseInt(data[36]) || 1,
        technique: parseInt(data[37]) || 1,

        // Atributos de Goleiro (38-47)
        aerial: parseInt(data[38]) || 1,
        command: parseInt(data[39]) || 1,
        communication: parseInt(data[40]) || 1,
        eccentricity: parseInt(data[41]) || 1,
        handling: parseInt(data[42]) || 1, // Jogo de Mãos maps to Handling usually? Or Throwing? Standard mapping: Handling.
        kicking: parseInt(data[43]) || 1,
        oneOnOne: parseInt(data[44]) || 1,
        reflexes: parseInt(data[45]) || 1,
        rushing: parseInt(data[46]) || 1, // Saídas maps to Rushing Out
        throwing: parseInt(data[47]) || 1, // Lançamentos maps to Throwing
      };

      const scores = calculatePlayerScores(attributes);
      const fm26Scores = calculateFM26Scores(attributes);

      const { mainScore, bestPosition } =
        calculateBestPositionAndScore(attributes);

      const category = determinePlayerCategory(
        { score: mainScore },
        age
      ) as Player['category'];

      // Parse positions from columns 52-65
      const positionMap: { [key: number]: string } = {
        52: 'MAC', // AMC -> Meia Atacante Central
        53: 'MAE', // AML -> Meia Atacante Esquerdo
        54: 'MAD', // AMR -> Meia Atacante Direito
        55: 'ZAG', // DC -> Zagueiro
        56: 'LE', // DL -> Lateral Esquerdo
        57: 'LD', // DR -> Lateral Direito
        58: 'VOL', // DMC -> Volante
        59: 'GOL', // GK -> Goleiro
        60: 'MEI', // MC -> Meia Central
        61: 'ME', // ML -> Meia Esquerda
        62: 'MD', // MR -> Meia Direita
        63: 'ATA', // ST -> Atacante
        64: 'ALE', // WBL -> Ala Esquerdo
        65: 'ALD', // WBR -> Ala Direito
      };

      const primaryPositions: string[] = [];
      const secondaryPositions: string[] = [];

      Object.entries(positionMap).forEach(([index, posCode]) => {
        const rating = parseInt(data[parseInt(index)]) || 0;
        if (rating >= 15) {
          primaryPositions.push(posCode);
        } else if (rating >= 10) {
          secondaryPositions.push(posCode);
        }
      });

      // Fallback if no positions found
      if (primaryPositions.length === 0 && secondaryPositions.length === 0) {
        primaryPositions.push('ATA'); // Default
      } else if (
        primaryPositions.length === 0 &&
        secondaryPositions.length > 0
      ) {
        // Promote best secondary to primary if no primary exists
        // For simplicity, just take the first secondary
        const bestSec = secondaryPositions.shift();
        if (bestSec) primaryPositions.push(bestSec);
      }

      // Augment positions with analysis based on attributes
      augmentPositionsWithAnalysis(
        attributes,
        primaryPositions,
        secondaryPositions
      );

      return {
        id: `player-${index}-${Date.now()}`,
        team,
        teamType: determineTeamType(team),
        name,
        age,
        nat: nationality,
        positions: {
          primary: primaryPositions,
          secondary: secondaryPositions,
        },
        attributes,
        scores,
        fm26Scores,
        mainScore,
        category,
        bestPosition,
        bestRole: determineBestRole(attributes, scores),
        bestIPRole: determineBestIPRole(attributes),
        bestOOPRole: determineBestOOPRole(attributes),
      };
    })
    .filter(player => player !== null) as Player[];
};

export const processPlayerData = (rawData: any[]): Player[] => {
  return rawData.map((row, index) => {
    // Helper function to get value from different possible column names
    const getValue = (...possibleNames: string[]) => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
          return row[name];
        }
      }
      return 10; // Default value
    };

    const attributes = {
      pace: parseInt(getValue('pace', 'Pace', 'PACE')) || 10,
      acceleration:
        parseInt(getValue('acceleration', 'Acceleration', 'ACCELERATION')) ||
        10,
      stamina: parseInt(getValue('stamina', 'Stamina', 'STAMINA')) || 10,
      strength: parseInt(getValue('strength', 'Strength', 'STRENGTH')) || 10,
      balance: parseInt(getValue('balance', 'Balance', 'BALANCE')) || 10,
      agility: parseInt(getValue('agility', 'Agility', 'AGILITY')) || 10,
      jumping: parseInt(getValue('jumping', 'Jumping', 'JUMPING')) || 10,
      naturalFitness:
        parseInt(
          getValue('naturalFitness', 'Natural Fitness', 'NATURAL_FITNESS')
        ) || 10,
      workRate: parseInt(getValue('workRate', 'Work Rate', 'WORK_RATE')) || 10,
      teamwork: parseInt(getValue('teamwork', 'Teamwork', 'TEAMWORK')) || 10,
      aggression:
        parseInt(getValue('aggression', 'Aggression', 'AGGRESSION')) || 10,
      bravery: parseInt(getValue('bravery', 'Bravery', 'BRAVERY')) || 10,
      decisions:
        parseInt(getValue('decisions', 'Decisions', 'DECISIONS')) || 10,
      composure:
        parseInt(getValue('composure', 'Composure', 'COMPOSURE')) || 10,
      concentration:
        parseInt(getValue('concentration', 'Concentration', 'CONCENTRATION')) ||
        10,
      anticipation:
        parseInt(getValue('anticipation', 'Anticipation', 'ANTICIPATION')) ||
        10,
      vision: parseInt(getValue('vision', 'Vision', 'VISION')) || 10,
      flair: parseInt(getValue('flair', 'Flair', 'FLAIR')) || 10,
      determination:
        parseInt(getValue('determination', 'Determination', 'DETERMINATION')) ||
        10,
      offTheBall:
        parseInt(getValue('offTheBall', 'Off The Ball', 'OFF_THE_BALL')) || 10,
      passing: parseInt(getValue('passing', 'Passing', 'PASSING')) || 10,
      crossing: parseInt(getValue('crossing', 'Crossing', 'CROSSING')) || 10,
      dribbling:
        parseInt(getValue('dribbling', 'Dribbling', 'DRIBBLING')) || 10,
      firstTouch:
        parseInt(getValue('firstTouch', 'First Touch', 'FIRST_TOUCH')) || 10,
      finishing:
        parseInt(getValue('finishing', 'Finishing', 'FINISHING')) || 10,
      heading: parseInt(getValue('heading', 'Heading', 'HEADING')) || 10,
      longShots:
        parseInt(getValue('longShots', 'Long Shots', 'LONG_SHOTS')) || 10,
      technique:
        parseInt(getValue('technique', 'Technique', 'TECHNIQUE')) || 10,
      tackling: parseInt(getValue('tackling', 'Tackling', 'TACKLING')) || 10,
      marking: parseInt(getValue('marking', 'Marking', 'MARKING')) || 10,
      positioning:
        parseInt(getValue('positioning', 'Positioning', 'POSITIONING')) || 10,
      reflexes: parseInt(getValue('reflexes', 'Reflexes', 'REFLEXES')) || 10,
      handling: parseInt(getValue('handling', 'Handling', 'HANDLING')) || 10,
      command: parseInt(getValue('command', 'Command', 'COMMAND')) || 10,
      aerial: parseInt(getValue('aerial', 'Aerial', 'AERIAL')) || 10,
      oneOnOne:
        parseInt(getValue('oneOnOne', 'One On One', 'ONE_ON_ONE')) || 10,
      kicking: parseInt(getValue('kicking', 'Kicking', 'KICKING')) || 10,
      rushing: parseInt(getValue('rushing', 'Rushing', 'RUSHING')) || 10,
      eccentricity:
        parseInt(getValue('eccentricity', 'Eccentricity', 'ECCENTRICITY')) ||
        10,
      communication:
        parseInt(getValue('communication', 'Communication', 'COMMUNICATION')) ||
        10,
      throwing: parseInt(getValue('throwing', 'Throwing', 'THROWING')) || 10,
    };

    const scores = calculatePlayerScores(attributes);
    const fm26Scores = calculateFM26Scores(attributes);

    const { mainScore, bestPosition } =
      calculateBestPositionAndScore(attributes);

    const category = determinePlayerCategory(
      { score: mainScore },
      parseInt(getValue('age', 'Age', 'AGE')) || 25
    ) as Player['category'];

    // Parse positions
    const primaryPositionsStr =
      getValue('primaryPositions', 'Primary Positions', 'PRIMARY_POSITIONS') ||
      '';
    const secondaryPositionsStr =
      getValue(
        'secondaryPositions',
        'Secondary Positions',
        'SECONDARY_POSITIONS'
      ) || '';

    const primaryPositions = primaryPositionsStr
      .split(',')
      .map((p: string) => p.trim())
      .filter((p: string) => p);

    const secondaryPositions = secondaryPositionsStr
      .split(',')
      .map((p: string) => p.trim())
      .filter((p: string) => p);

    // Augment with analysis
    augmentPositionsWithAnalysis(
      attributes,
      primaryPositions,
      secondaryPositions
    );

    return {
      id: `player-${index}-${Date.now()}`,
      team: getValue('team', 'Team', 'TIME') || 'Unknown',
      teamType: determineTeamType(getValue('team', 'Team', 'TIME') || ''),
      name: getValue('name', 'Name', 'NAME') || 'Unknown Player',
      age: parseInt(getValue('age', 'Age', 'AGE')) || 25,
      nat: getValue('nat', 'Nationality', 'NAT') || 'Unknown',
      positions: {
        primary: primaryPositions,
        secondary: secondaryPositions,
      },
      attributes,
      scores,
      fm26Scores,
      mainScore,
      category,
      bestPosition,
      bestRole: determineBestRole(attributes, scores),
      bestIPRole: determineBestIPRole(attributes),
      bestOOPRole: determineBestOOPRole(attributes),
    };
  });
};
