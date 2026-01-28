import { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { Player } from '../types';
import { validateCSVData } from '../services/validation';
import { processFixedFormatData, processPlayerData } from '../services/parsing';

export const usePlayerData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      header: false, // Mudado para false para processar sem cabeçalho, mas processPlayerData espera nomes de colunas... wait.
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
