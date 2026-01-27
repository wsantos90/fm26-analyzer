import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Player, CSVValidationResult } from '../types';

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        // Mapeamento básico baseado no exemplo fornecido
        // 0: Team, 1: Name, 2: Nationality, 3: Age, depois vários atributos
        const team = data[0] || 'Unknown';
        const name = data[1] || 'Unknown Player';
        const nationality = data[2] || 'Unknown';
        const age = parseInt(data[3]) || 25;

        // Atributos básicos (posicionados aproximadamente baseado no exemplo)
        const attributes = {
          pace: parseInt(data[8]) || 10,
          acceleration: parseInt(data[9]) || 10,
          stamina: parseInt(data[10]) || 10,
          strength: parseInt(data[11]) || 10,
          balance: parseInt(data[12]) || 10,
          agility: parseInt(data[13]) || 10,
          jumping: parseInt(data[14]) || 10,
          naturalFitness: parseInt(data[15]) || 10,
          workRate: parseInt(data[16]) || 10,
          teamwork: parseInt(data[17]) || 10,
          aggression: parseInt(data[18]) || 10,
          bravery: parseInt(data[19]) || 10,
          decisions: parseInt(data[20]) || 10,
          composure: parseInt(data[21]) || 10,
          concentration: parseInt(data[22]) || 10,
          anticipation: parseInt(data[23]) || 10,
          vision: parseInt(data[24]) || 10,
          flair: parseInt(data[25]) || 10,
          determination: parseInt(data[26]) || 10,
          offTheBall: parseInt(data[27]) || 10,
          passing: parseInt(data[28]) || 10,
          crossing: parseInt(data[29]) || 10,
          dribbling: parseInt(data[30]) || 10,
          firstTouch: parseInt(data[31]) || 10,
          finishing: parseInt(data[32]) || 10,
          heading: parseInt(data[33]) || 10,
          longShots: parseInt(data[34]) || 10,
          technique: parseInt(data[35]) || 10,
          tackling: parseInt(data[36]) || 10,
          marking: parseInt(data[37]) || 10,
          positioning: parseInt(data[38]) || 10,
          reflexes: parseInt(data[39]) || 10,
          handling: parseInt(data[40]) || 10,
          command: parseInt(data[41]) || 10,
          aerial: parseInt(data[42]) || 10,
          oneOnOne: parseInt(data[43]) || 10,
          kicking: parseInt(data[44]) || 10,
          rushing: parseInt(data[45]) || 10,
          eccentricity: parseInt(data[46]) || 10,
          communication: parseInt(data[47]) || 10,
          throwing: parseInt(data[48]) || 10,
        };

        const scores = calculatePlayerScores(attributes);
        const category = determinePlayerCategory(
          scores,
          age
        ) as Player['category'];

        return {
          id: `player-${index}-${Date.now()}`,
          team,
          teamType: determineTeamType(team),
          name,
          age,
          nat: nationality,
          positions: {
            primary: ['ST'], // Posição padrão
            secondary: [],
          },
          attributes,
          scores,
          fm26Scores: calculateFM26Scores(attributes),
          mainScore: Math.max(...Object.values(scores)),
          category,
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
        workRate:
          parseInt(getValue('workRate', 'Work Rate', 'WORK_RATE')) || 10,
        teamwork: parseInt(getValue('teamwork', 'Teamwork', 'TEAMWORK')) || 10,
        aggression:
          parseInt(getValue('aggression', 'Aggression', 'AGGRESSION')) || 10,
        bravery: parseInt(getValue('bravery', 'Bravery', 'BRAVERY')) || 10,
        decisions:
          parseInt(getValue('decisions', 'Decisions', 'DECISIONS')) || 10,
        composure:
          parseInt(getValue('composure', 'Composure', 'COMPOSURE')) || 10,
        concentration:
          parseInt(
            getValue('concentration', 'Concentration', 'CONCENTRATION')
          ) || 10,
        anticipation:
          parseInt(getValue('anticipation', 'Anticipation', 'ANTICIPATION')) ||
          10,
        vision: parseInt(getValue('vision', 'Vision', 'VISION')) || 10,
        flair: parseInt(getValue('flair', 'Flair', 'FLAIR')) || 10,
        determination:
          parseInt(
            getValue('determination', 'Determination', 'DETERMINATION')
          ) || 10,
        offTheBall:
          parseInt(getValue('offTheBall', 'Off The Ball', 'OFF_THE_BALL')) ||
          10,
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
          parseInt(
            getValue('communication', 'Communication', 'COMMUNICATION')
          ) || 10,
        throwing: parseInt(getValue('throwing', 'Throwing', 'THROWING')) || 10,
      };

      const scores = calculatePlayerScores(attributes);
      const category = determinePlayerCategory(
        scores,
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

      return {
        id: `player-${index}-${Date.now()}`,
        team: getValue('team', 'Team', 'TIME') || 'Unknown',
        teamType: determineTeamType(getValue('team', 'Team', 'TIME') || ''),
        name: getValue('name', 'Name', 'NAME') || 'Unknown Player',
        age: parseInt(getValue('age', 'Age', 'AGE')) || 25,
        nat: getValue('nat', 'Nationality', 'NAT') || 'Unknown',
        positions: {
          primary: primaryPositionsStr
            .split(',')
            .map((p: string) => p.trim())
            .filter((p: string) => p),
          secondary: secondaryPositionsStr
            .split(',')
            .map((p: string) => p.trim())
            .filter((p: string) => p),
        },
        attributes,
        scores,
        fm26Scores: calculateFM26Scores(attributes),
        mainScore: Math.max(...Object.values(scores)),
        category,
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
    const teamLower = team.toLowerCase();
    if (
      teamLower.includes('sub') ||
      teamLower.includes('u19') ||
      teamLower.includes('u20')
    ) {
      return 'youth';
    }
    if (teamLower.includes('b') || teamLower.includes('reserve')) {
      return 'reserve';
    }
    if (teamLower.includes('loan') || teamLower.includes('emprest')) {
      return 'loan';
    }
    return 'main';
  };

  const calculateFM26Scores = (attributes: any) => {
    return {
      ip: {
        GK: attributes.reflexes * 0.8 + attributes.handling * 0.2,
        DC:
          attributes.tackling * 0.4 +
          attributes.marking * 0.3 +
          attributes.heading * 0.3,
        DL:
          attributes.tackling * 0.3 +
          attributes.pace * 0.4 +
          attributes.crossing * 0.3,
        DR:
          attributes.tackling * 0.3 +
          attributes.pace * 0.4 +
          attributes.crossing * 0.3,
        DMC:
          attributes.tackling * 0.4 +
          attributes.passing * 0.3 +
          attributes.positioning * 0.3,
        MC:
          attributes.passing * 0.3 +
          attributes.vision * 0.3 +
          attributes.stamina * 0.4,
        ML:
          attributes.crossing * 0.3 +
          attributes.dribbling * 0.4 +
          attributes.pace * 0.3,
        MR:
          attributes.crossing * 0.3 +
          attributes.dribbling * 0.4 +
          attributes.pace * 0.3,
        AML:
          attributes.dribbling * 0.4 +
          attributes.finishing * 0.3 +
          attributes.pace * 0.3,
        AMR:
          attributes.dribbling * 0.4 +
          attributes.finishing * 0.3 +
          attributes.pace * 0.3,
        AMC:
          attributes.passing * 0.3 +
          attributes.vision * 0.4 +
          attributes.technique * 0.3,
        ST:
          attributes.finishing * 0.4 +
          attributes.anticipation * 0.3 +
          attributes.pace * 0.3,
      },
      oop: {
        GK: attributes.reflexes * 0.7 + attributes.command * 0.3,
        DC: attributes.tackling * 0.5 + attributes.strength * 0.5,
        DL:
          attributes.tackling * 0.4 +
          attributes.stamina * 0.3 +
          attributes.crossing * 0.3,
        DR:
          attributes.tackling * 0.4 +
          attributes.stamina * 0.3 +
          attributes.crossing * 0.3,
        DMC: attributes.tackling * 0.5 + attributes.workRate * 0.5,
        MC:
          attributes.passing * 0.4 +
          attributes.workRate * 0.3 +
          attributes.technique * 0.3,
        ML:
          attributes.dribbling * 0.4 +
          attributes.technique * 0.3 +
          attributes.crossing * 0.3,
        MR:
          attributes.dribbling * 0.4 +
          attributes.technique * 0.3 +
          attributes.crossing * 0.3,
        AML: attributes.dribbling * 0.5 + attributes.finishing * 0.5,
        AMR: attributes.dribbling * 0.5 + attributes.finishing * 0.5,
        AMC:
          attributes.vision * 0.4 +
          attributes.passing * 0.3 +
          attributes.technique * 0.3,
        ST:
          attributes.finishing * 0.5 +
          attributes.strength * 0.3 +
          attributes.anticipation * 0.2,
      },
    };
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
    return determineBestRole(attributes, {});
  };

  const determineBestOOPRole = (attributes: any) => {
    return determineBestRole(attributes, {});
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

  const filteredPlayers = useMemo(() => {
    return players;
  }, [players]);

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
    filteredPlayers,
    statistics,
    isLoading,
    error,
    handleFileUpload,
    setPlayers,
  };
};
