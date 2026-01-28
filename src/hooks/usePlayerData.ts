import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Player, CSVValidationResult } from '../types';
import { FM26_ROLES } from '../data/roles';
import {
  calculatePositionScore,
  SUPPORTED_POSITIONS,
} from '../utils/positionAnalysis';

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapping from Analysis (English) keys to CSV (Portuguese) codes
  const ENGLISH_TO_PT_CODE: Record<string, string> = {
    GK: 'GOL',
    DC: 'ZAG',
    DL: 'LE',
    DR: 'LD',
    WBL: 'ALE',
    WBR: 'ALD',
    DM: 'VOL',
    MC: 'MEI',
    ML: 'ME',
    MR: 'MD',
    AML: 'MAE',
    AMR: 'MAD',
    AMC: 'MAC',
    ST: 'ATA',
  };

  const augmentPositionsWithAnalysis = (
    attributes: any,
    primary: string[],
    secondary: string[]
  ) => {
    const scores = SUPPORTED_POSITIONS.map(pos => ({
      position: pos,
      score: calculatePositionScore(attributes, pos),
    }));

    // Get top 3 positions with score >= 10 (minimum threshold for relevance)
    const bestPositions = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(p => p.score >= 10);

    bestPositions.forEach(p => {
      const ptCode = ENGLISH_TO_PT_CODE[p.position];
      if (ptCode && !primary.includes(ptCode) && !secondary.includes(ptCode)) {
        secondary.push(ptCode);
      }
    });
  };

  const validateCSVData = (data: any[]): CSVValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data || data.length === 0) {
      errors.push('Arquivo vazio ou inválido');
      return { isValid: false, errors, warnings };
    }

    const firstRow = data[0];
    console.log('First row data:', firstRow);

    // Check for essential fields with more flexible validation
    const hasName = firstRow.name || firstRow.Name || firstRow.NAME;
    const hasAge = firstRow.age || firstRow.Age || firstRow.IDADE;
    const hasTeam = firstRow.team || firstRow.Team || firstRow.TIME;

    if (!hasName) {
      errors.push('Campo obrigatório ausente: name (nome do jogador)');
    }
    if (!hasAge) {
      errors.push('Campo obrigatório ausente: age (idade do jogador)');
    }
    if (!hasTeam) {
      errors.push('Campo obrigatório ausente: team (time do jogador)');
    }

    // Check if we have at least some attribute columns
    const attributeColumns = [
      'pace',
      'acceleration',
      'stamina',
      'passing',
      'dribbling',
      'finishing',
    ];
    const hasAttributes = attributeColumns.some(
      attr =>
        firstRow[attr] || firstRow[attr.charAt(0).toUpperCase() + attr.slice(1)]
    );

    if (!hasAttributes) {
      warnings.push(
        'Nenhum atributo de jogador encontrado. Verifique se o arquivo contém colunas como pace, acceleration, etc.'
      );
    }

    if (data.length < 5) {
      warnings.push('Poucos jogadores encontrados no arquivo');
    }

    console.log('Validation result:', {
      errors,
      warnings,
      hasName,
      hasAge,
      hasTeam,
      hasAttributes,
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  const processFixedFormatData = (rawData: any[]): Player[] => {
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

        let maxScore = 0;
        let bestPos = '';
        SUPPORTED_POSITIONS.forEach(pos => {
          const score = calculatePositionScore(attributes, pos);
          if (score > maxScore) {
            maxScore = score;
            bestPos = pos;
          }
        });
        const mainScore = maxScore;
        const bestPosition = bestPos;

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

  const processPlayerData = (rawData: any[]): Player[] => {
    return rawData.map((row, index) => {
      // Helper function to get value from different possible column names
      const getValue = (...possibleNames: string[]) => {
        for (const name of possibleNames) {
          if (
            row[name] !== undefined &&
            row[name] !== null &&
            row[name] !== ''
          ) {
            return row[name];
          }
        }
        return 1; // Default value
      };

      const attributes = {
        pace: parseInt(getValue('pace', 'Pace', 'PACE')) || 1,
        acceleration:
          parseInt(getValue('acceleration', 'Acceleration', 'ACCELERATION')) ||
          1,
        stamina: parseInt(getValue('stamina', 'Stamina', 'STAMINA')) || 1,
        strength: parseInt(getValue('strength', 'Strength', 'STRENGTH')) || 1,
        balance: parseInt(getValue('balance', 'Balance', 'BALANCE')) || 1,
        agility: parseInt(getValue('agility', 'Agility', 'AGILITY')) || 1,
        jumping: parseInt(getValue('jumping', 'Jumping', 'JUMPING')) || 1,
        naturalFitness:
          parseInt(
            getValue('naturalFitness', 'Natural Fitness', 'NATURAL_FITNESS')
          ) || 1,
        workRate: parseInt(getValue('workRate', 'Work Rate', 'WORK_RATE')) || 1,
        teamwork: parseInt(getValue('teamwork', 'Teamwork', 'TEAMWORK')) || 1,
        aggression:
          parseInt(getValue('aggression', 'Aggression', 'AGGRESSION')) || 1,
        bravery: parseInt(getValue('bravery', 'Bravery', 'BRAVERY')) || 1,
        decisions:
          parseInt(getValue('decisions', 'Decisions', 'DECISIONS')) || 1,
        composure:
          parseInt(getValue('composure', 'Composure', 'COMPOSURE')) || 1,
        concentration:
          parseInt(
            getValue('concentration', 'Concentration', 'CONCENTRATION')
          ) || 1,
        anticipation:
          parseInt(getValue('anticipation', 'Anticipation', 'ANTICIPATION')) ||
          1,
        vision: parseInt(getValue('vision', 'Vision', 'VISION')) || 1,
        flair: parseInt(getValue('flair', 'Flair', 'FLAIR')) || 1,
        determination:
          parseInt(
            getValue('determination', 'Determination', 'DETERMINATION')
          ) || 1,
        offTheBall:
          parseInt(getValue('offTheBall', 'Off The Ball', 'OFF_THE_BALL')) || 1,
        passing: parseInt(getValue('passing', 'Passing', 'PASSING')) || 1,
        crossing: parseInt(getValue('crossing', 'Crossing', 'CROSSING')) || 1,
        dribbling:
          parseInt(getValue('dribbling', 'Dribbling', 'DRIBBLING')) || 1,
        firstTouch:
          parseInt(getValue('firstTouch', 'First Touch', 'FIRST_TOUCH')) || 1,
        finishing:
          parseInt(getValue('finishing', 'Finishing', 'FINISHING')) || 1,
        heading: parseInt(getValue('heading', 'Heading', 'HEADING')) || 1,
        longShots:
          parseInt(getValue('longShots', 'Long Shots', 'LONG_SHOTS')) || 1,
        technique:
          parseInt(getValue('technique', 'Technique', 'TECHNIQUE')) || 1,
        tackling: parseInt(getValue('tackling', 'Tackling', 'TACKLING')) || 1,
        marking: parseInt(getValue('marking', 'Marking', 'MARKING')) || 1,
        positioning:
          parseInt(getValue('positioning', 'Positioning', 'POSITIONING')) || 1,
        reflexes: parseInt(getValue('reflexes', 'Reflexes', 'REFLEXES')) || 1,
        handling: parseInt(getValue('handling', 'Handling', 'HANDLING')) || 1,
        command: parseInt(getValue('command', 'Command', 'COMMAND')) || 1,
        aerial: parseInt(getValue('aerial', 'Aerial', 'AERIAL')) || 1,
        oneOnOne:
          parseInt(getValue('oneOnOne', 'One On One', 'ONE_ON_ONE')) || 1,
        kicking: parseInt(getValue('kicking', 'Kicking', 'KICKING')) || 1,
        rushing: parseInt(getValue('rushing', 'Rushing', 'RUSHING')) || 1,
        eccentricity:
          parseInt(getValue('eccentricity', 'Eccentricity', 'ECCENTRICITY')) ||
          1,
        communication:
          parseInt(
            getValue('communication', 'Communication', 'COMMUNICATION')
          ) || 1,
        throwing: parseInt(getValue('throwing', 'Throwing', 'THROWING')) || 1,
      };

      const scores = calculatePlayerScores(attributes);
      const fm26Scores = calculateFM26Scores(attributes);

      let maxScore = 0;
      let bestPos = '';
      SUPPORTED_POSITIONS.forEach(pos => {
        const score = calculatePositionScore(attributes, pos);
        if (score > maxScore) {
          maxScore = score;
          bestPos = pos;
        }
      });
      const mainScore = maxScore;
      const bestPosition = bestPos;

      const category = determinePlayerCategory(
        { score: mainScore },
        parseInt(getValue('age', 'Age', 'AGE')) || 25
      ) as Player['category'];

      // Parse positions
      const primaryPositionsStr =
        getValue(
          'primaryPositions',
          'Primary Positions',
          'PRIMARY_POSITIONS'
        ) || '';
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

  const calculatePlayerScores = (attributes: any) => {
    const gk =
      (attributes.reflexes +
        attributes.handling +
        attributes.command +
        attributes.aerial +
        attributes.oneOnOne +
        attributes.kicking) /
      6;

    const stretching =
      (attributes.pace + attributes.acceleration + attributes.stamina) / 3;
    const linking =
      (attributes.passing +
        attributes.vision +
        attributes.decisions +
        attributes.technique) /
      4;
    const dynamic =
      (attributes.offTheBall + attributes.anticipation + attributes.stamina) /
      3;
    const engaged =
      (attributes.tackling +
        attributes.aggression +
        attributes.bravery +
        attributes.teamwork) /
      4;
    const tracking =
      (attributes.marking + attributes.concentration + attributes.positioning) /
      3;
    const outlet =
      (attributes.strength + attributes.balance + attributes.firstTouch) / 3;

    return { gk, stretching, linking, dynamic, engaged, tracking, outlet };
  };

  const determinePlayerCategory = (
    scores: Record<string, number>,
    age: number
  ) => {
    const mainScore = Math.max(...Object.values(scores));

    if (mainScore >= 14) return 'elite';
    if (mainScore >= 12.5) return 'titular';
    if (age <= 21 && mainScore >= 10.5) return 'promessa';
    if (mainScore >= 10) return 'rotacao';
    if (age >= 29 && mainScore < 10) return 'vender';
    return 'baixo_nivel';
  };

  const determineTeamType = (
    team: string
  ): 'main' | 'youth' | 'reserve' | 'loan' => {
    if (!team) return 'main';
    const teamUpper = team.toUpperCase();

    // Regra 1: S19, S20, etc. ou variações de Sub/Youth -> youth
    if (
      /S(1[8-9]|2[0-3])/.test(teamUpper) || // S18, S19, S20, S21, S22, S23
      teamUpper.includes('SUB') ||
      teamUpper.includes('U19') ||
      teamUpper.includes('U20') ||
      teamUpper.includes('U21') ||
      teamUpper.includes('U23') ||
      teamUpper.includes('YOUTH') ||
      teamUpper.includes('JUNIORES')
    ) {
      return 'youth';
    }

    // Regra 2: Contém EMP ou LOAN -> loan
    if (teamUpper.includes('EMP') || teamUpper.includes('LOAN')) {
      return 'loan';
    }

    // Regra 3: Termina com " B", " II", " 2" ou contém "RESERVA"
    // Atenção: O espaço antes do número é crucial para não pegar "Schalke 04"
    if (
      teamUpper.includes('RESERVA') ||
      teamUpper.includes('RESERVE') ||
      teamUpper.endsWith(' B') ||
      teamUpper.endsWith(' II') ||
      teamUpper.endsWith(' 2') // Adicionado para capturar "Schalke 04 2"
    ) {
      return 'reserve';
    }

    // Regra 4: Outros -> main
    return 'main';
  };

  const calculateFM26Scores = (attributes: any) => {
    const scores: {
      ip: Record<string, number>;
      oop: Record<string, number>;
      gk: Record<string, number>;
    } = {
      ip: {},
      oop: {},
      gk: {},
    };

    // Calculate GK scores
    if (FM26_ROLES.gk) {
      Object.entries(FM26_ROLES.gk).forEach(([role, weights]) => {
        let score = 0;
        let weightSum = 0;
        Object.entries(weights).forEach(([attr, weight]) => {
          // @ts-ignore
          const attrValue = attributes[attr] || 0;
          score += attrValue * weight;
          weightSum += weight;
        });
        scores.gk[role] = weightSum > 0 ? score / weightSum : 0;
      });
    }

    // Calculate IP scores
    Object.entries(FM26_ROLES.ip).forEach(([role, weights]) => {
      let score = 0;
      let weightSum = 0;
      Object.entries(weights).forEach(([attr, weight]) => {
        // @ts-ignore
        const attrValue = attributes[attr] || 0;
        score += attrValue * weight;
        weightSum += weight;
      });
      scores.ip[role] = weightSum > 0 ? score / weightSum : 0;
    });

    // Calculate OOP scores
    Object.entries(FM26_ROLES.oop).forEach(([role, weights]) => {
      let score = 0;
      let weightSum = 0;
      Object.entries(weights).forEach(([attr, weight]) => {
        // @ts-ignore
        const attrValue = attributes[attr] || 0;
        score += attrValue * weight;
        weightSum += weight;
      });
      scores.oop[role] = weightSum > 0 ? score / weightSum : 0;
    });

    return scores;
  };

  const determineBestRole = (attributes: any, scores: any) => {
    const roleScores = [
      { role: 'GK', score: attributes.reflexes },
      { role: 'DC', score: attributes.tackling + attributes.marking },
      { role: 'DL', score: attributes.tackling + attributes.pace },
      { role: 'DR', score: attributes.tackling + attributes.pace },
      { role: 'DMC', score: attributes.tackling + attributes.passing },
      { role: 'MC', score: attributes.passing + attributes.vision },
      { role: 'ML', score: attributes.crossing + attributes.dribbling },
      { role: 'MR', score: attributes.crossing + attributes.dribbling },
      { role: 'AML', score: attributes.dribbling + attributes.finishing },
      { role: 'AMR', score: attributes.dribbling + attributes.finishing },
      { role: 'AMC', score: attributes.passing + attributes.vision },
      { role: 'ST', score: attributes.finishing + attributes.anticipation },
    ];

    return roleScores.reduce((best, current) =>
      current.score > best.score ? current : best
    ).role;
  };

  const determineBestIPRole = (attributes: any) => {
    const scores = calculateFM26Scores(attributes);
    let bestRole = '';
    let bestScore = -1;

    Object.entries(scores.ip).forEach(([role, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestRole = role;
      }
    });

    return bestRole;
  };

  const determineBestOOPRole = (attributes: any) => {
    const scores = calculateFM26Scores(attributes);
    let bestRole = '';
    let bestScore = -1;

    Object.entries(scores.oop).forEach(([role, score]) => {
      if (score > bestScore) {
        bestScore = score;
        bestRole = role;
      }
    });

    return bestRole;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);

    if (!file) {
      console.log('No file selected');
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Starting file parse...');

    Papa.parse(file, {
      complete: results => {
        console.log('Parse complete:', results);
        try {
          // Verifica se é formato fixo (array de arrays) ou CSV com cabeçalho
          if (
            results.data &&
            results.data.length > 0 &&
            Array.isArray(results.data[0])
          ) {
            console.log('Processing as fixed format CSV...');
            const processedPlayers = processFixedFormatData(results.data);
            setPlayers(processedPlayers);
          } else {
            const validation = validateCSVData(results.data);
            console.log('Validation:', validation);

            if (!validation.isValid) {
              setError(`Erro de validação: ${validation.errors.join(', ')}`);
              setIsLoading(false);
              return;
            }

            const processedPlayers = processPlayerData(results.data);
            console.log('Processed players:', processedPlayers.length);
            setPlayers(processedPlayers);
          }
          setIsLoading(false);
        } catch (err) {
          console.error('Processing error:', err);
          setError(`Erro ao processar arquivo: ${err}`);
          setIsLoading(false);
        }
      },
      header: false, // Mudado para false para processar sem cabeçalho
      skipEmptyLines: true,
      error: err => {
        console.error('Parse error:', err);
        setError(`Erro ao ler arquivo: ${err.message}`);
        setIsLoading(false);
      },
    });
  };

  const statistics = useMemo(() => {
    if (players.length === 0) {
      return {
        total: 0,
        byCategory: {},
        byTeamType: {},
        averageAge: 0,
        averageScore: 0,
      };
    }

    const byCategory = players.reduce(
      (acc, player) => {
        acc[player.category] = (acc[player.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byTeamType = players.reduce(
      (acc, player) => {
        acc[player.teamType] = (acc[player.teamType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const averageAge =
      players.reduce((sum, player) => sum + player.age, 0) / players.length;
    const averageScore =
      players.reduce((sum, player) => sum + player.mainScore, 0) /
      players.length;

    return {
      total: players.length,
      byCategory,
      byTeamType,
      averageAge,
      averageScore,
    };
  }, [players]);

  return {
    players,
    statistics,
    isLoading,
    error,
    handleFileUpload,
    setPlayers,
    resetData: () => setPlayers([]),
  };
};
