# 📊 Estrutura do CSV - FM26 Analyzer

## ⚠️ IMPORTANTE
**O CSV NÃO TEM CABEÇALHO** - Os dados começam diretamente na primeira linha.

---

## 📋 Sequência de Colunas (66 colunas total)

### Informações Básicas (0-3)
- **0**: Time
- **1**: Nome
- **2**: Nacionalidades
- **3**: Idade

### Características Físicas (4-6)
- **4**: Pé Esquerdo
- **5**: Pé Direito
- **6**: Altura

### Atributos Físicos (7-14)
- **7**: Aceleração
- **8**: Agilidade
- **9**: Equilíbrio
- **10**: Pulo
- **11**: Cond. Física Natural
- **12**: Velocidade
- **13**: Resistência
- **14**: Força

### Atributos Mentais (15-27)
- **15**: Agressão
- **16**: Antecipação
- **17**: Bravura
- **18**: Frieza
- **19**: Concentração
- **20**: Decisões
- **21**: Determinação
- **22**: Talento
- **23**: Sem a Bola ⚠️ (offTheBall)
- **24**: Posicionamento
- **25**: Trabalho em Equipe
- **26**: Visão
- **27**: Índice de Trabalho (workRate)

### Atributos Técnicos (28-37)
- **28**: Cruzamento
- **29**: Drible
- **30**: Finalização
- **31**: Toque de Primeira
- **32**: Cabeçada
- **33**: Chutes de Longe
- **34**: Marcação
- **35**: Passe
- **36**: Desarme
- **37**: Técnica

### Atributos de Goleiro (38-47)
- **38**: Habilidade Aérea (aerial)
- **39**: Comando de Área (command)
- **40**: Comunicação
- **41**: Excentricidade
- **42**: Jogo de Mãos (handling)
- **43**: Pontapé (kicking)
- **44**: Um para Um (oneOnOne)
- **45**: Reflexos
- **46**: Saídas (rushing)
- **47**: Lançamentos (throwing)

### Informações de Contrato (48-51)
- **48**: Salário
- **49**: Data Expira
- **50**: Situação de Transferência
- **51**: Preço Exigido

### Posições (52-65)
- **52**: Meia-Atacante Central (amc)
- **53**: Meia-Atacante Esquerdo (aml)
- **54**: Meia-Atacante Direito (amr)
- **55**: Zagueiro (dc)
- **56**: Lateral Esquerdo (dl)
- **57**: Lateral Direita (dr)
- **58**: Volante (dmc)
- **59**: Goleiro (gk)
- **60**: Meio-Campo (mc)
- **61**: Meia-Esquerda (ml)
- **62**: Meia-Direita (mr)
- **63**: Ponta-de-lança (st)
- **64**: Ala Esquerda (wbl)
- **65**: Ala Direita (wbr)

---

## 🔍 Validação

O sistema valida:
- ✅ Mínimo de 66 colunas
- ✅ Time não vazio (coluna 0)
- ✅ Nome não vazio (coluna 1)
- ✅ Idade válida (14-50 anos, coluna 3)

---

## 📝 Notas

- Todas as posições são valores numéricos (0-20)
- Posições primárias: valor > 14
- Posições secundárias: valor entre 10 e 14
- Goleiro: valor > 15 na coluna 59

---

*Última atualização: 27/01/2026*
