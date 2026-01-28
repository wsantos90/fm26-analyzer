import { CSVValidationResult } from '../types';

export const validateCSVData = (data: any[]): CSVValidationResult => {
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
