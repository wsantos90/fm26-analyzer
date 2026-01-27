# ⚽ FM26 Analyzer

App de análise tática para Football Manager 2026, criado com [Create React App](https://github.com/facebook/create-react-app).

---

## 🚀 Como Abrir o Projeto

No diretório do projeto, você pode executar:

### `npm start`

Executa o app em modo de desenvolvimento.  

Abra http://localhost:3000 para visualizar no navegador.

A página será recarregada automaticamente quando você fizer edições.  

Você também verá erros de lint no console.

### `npm test`

Inicia o executor de testes em modo interativo.  

Veja mais sobre [execução de testes](https://facebook.github.io/create-react-app/docs/running-tests).

### `npm run build`

Compila o app para produção na pasta `build`.  

Empacota o React corretamente em modo de produção e otimiza para melhor performance.

O build é minificado e os nomes dos arquivos incluem hashes.  

Seu app está pronto para deploy!

Veja mais sobre [deployment](https://facebook.github.io/create-react-app/docs/deployment).

### `npm run eject`

⚠️ **Atenção: esta é uma operação irreversível. Uma vez que você executar `eject`, não há como voltar!**

Se você não estiver satisfeito com as configurações de build, pode executar `eject` a qualquer momento. Este comando removerá a dependência única de build do seu projeto e copiará todos os arquivos de configuração (webpack, Babel, ESLint, etc) diretamente para o projeto, dando controle total sobre eles.

---
![WhatsApp Image 2026-01-26 at 09 59 49 (4)](https://github.com/user-attachments/assets/97976dfe-547c-4701-93d4-b3d8ab28e700)

## ✅ Funcionalidades Implementadas

### 🎯 Ranking de Formações Inteligente

- Analisa o elenco em **9 formações disponíveis**
- Recomenda as 3 melhores formações para seu time
- Clique na formação sugerida para carregá-la instantaneamente

### 📱 Comparador Lateral (Sidebar)

- Barra lateral à direita para comparar jogadores
- Não bloqueia a tela, permitindo interação simultânea
- Mais espaço para gráficos de radar

### ⚙️ Gestão de Histórico

- Botão de Reset para limpar dados antigos
- Confirmação de segurança contra cliques acidentais
![WhatsApp Image 2026-01-26 at 09 59 49](https://github.com/user-attachments/assets/6c3d894e-631a-48ed-bca2-67f6fea8fc7f)

### 🔍 Análise Profunda de Atributos

- Modal com abas: **Visão Geral** e **Atributos Completos**
- Destaque inteligente de atributos essenciais para cada posição
- Grade com todos os números (Físico, Mental, Técnico)
![WhatsApp Image 2026-01-26 at 09 59 49 (3)](https://github.com/user-attachments/assets/31dae2db-79ed-4805-8388-5c751e394d76)

### 🔄 Contexto Dinâmico (Multifunção)

- Analise jogadores polivalentes em diferentes posições
- Recálculo instantâneo de pontos fortes, treino e destaques
- Clique nas "Melhores Posições" para mudar o contexto

### 🧠 Treinamento Inteligente (Smart Training)

- Sugestão de pontos fracos contextual à posição selecionada
- Foca em atributos que precisam evoluir (< 13)
- Ignora atributos irrelevantes para a função
![WhatsApp Image 2026-01-26 at 09 59 49 (2)](https://github.com/user-attachments/assets/a263b857-86f7-4a24-8275-6a91e93976c6)

### 🏷️ Categorias de Jogadores (PT-BR)

| Categoria | Cor | Critério |
| --- | --- | --- |
| **Elite** | 🟡 Amarelo | Nota ≥ 14 |
| **Titular** | 🟢 Verde | Nota ≥ 12.5 |
| **Promessa** | 🟣 Roxo | ≤ 21 anos e Nota ≥ 10.5 |
| **Nível Baixo** | 🟠 Laranja | Nota < 10 (não veterano) |
| **Rotação** | ⚪ Cinza | Nota intermediária |
| **Vender** | 🔴 Vermelho | ≥ 29 anos e Nota < 10 |
![WhatsApp Image 2026-01-26 at 09 59 49 (1)](https://github.com/user-attachments/assets/3953bcb7-b7f6-4aa1-9057-80314b48a43e)

### 🛡️ Filtros Hierárquicos

**Nível 1 - Times:**

- Todos os Times
- Time Principal (Azul)
- Sub-19/20 (Roxo)
- Time 2 (Cinza)
- Emprestados (Laranja)

**Nível 2 - Categorias:**

- Elite, Titular, Promessa, Rotação, Nível Baixo, Vender

### ⚽ 9 Formações Táticas

- 4-3-3
- 3-5-2
- 4-2-3-1
- 4-4-2 Diamond
- 4-1-2-3
- 5-4-1
- 3-4-3
- 4-3-1-2
- 3-4-2-1

### 🖱️ Melhorias de Usabilidade

- Modal detalhado acessível de qualquer card
- Comparar sem interrupção (não abre o perfil)
- Badges coloridos de time nos cards
- Cursor pointer indicando interatividade

---

## 📊 Mapeamento CSV

⚠️ **IMPORTANTE**: 
- O CSV **NÃO TEM CABEÇALHO** - os dados começam diretamente na primeira linha
- A coluna "Time" deve ser a PRIMEIRA coluna (índice 0)

```
0: Time
1: Nome
2: Nacionalidades
3: Idade
4-6: Pés/Altura
7-14: Físicos
15-27: Mentais
28-37: Técnicos
38-47: Goleiro
48-51: Salário/Contrato
52-65: Posições
```
Time
Nome
Nacionalidades
Idade
Pé Esquerdo
Pé Direito
Altura
Aceleração
Agilidade
Equilíbrio
Pulo
Cond. Física Natural
Velocidade
Resistência
Força
Agressão
Antecipação
Bravura
Frieza
Concentração
Decisões
Determinação
Talento
Sem a Bola
Posicionamento
Trabalho em Equipe
Visão
Índice de Trabalho
Cruzamento
Drible
Finalização
Toque de Primeira
Cabeçada
Chutes de Longe
Marcação
Passe
Desarme
Técnica
Habilidade Aérea
Comando de Área
Comunicação
Excentricidade
Jogo de Mãos
Pontapé
Um para Um
Reflexos
Saídas
Lançamentos
Salário
Data Expira
Situação de Transferência
Preço Exigido
Meia-Atacante Central
Meia-Atacante Esquerdo
Meia-Atacante Direito
Zagueiro
Lateral Esquerdo
Lateral Direita
Volante
Goleiro
Meio-Campo
Meia-Esquerda
Meia-Direita
Ponta-de-lança
Ala Esquerda
Ala Direita




**Exemplo (SEM CABEÇALHO - dados direto):**

```
FC Schalke 04,Yassin Ben Balla,France,Morocco,29,6,20,...
FC Schalke 04 S19,Zaid Tchibara,Togo,Germany,19,9,20,...
```

**Nota**: O sistema detecta automaticamente o tipo de time baseado no nome:
- `S19`, `S20`, etc. → Sub-19/20 (roxo)
- Contém `EMP` → Emprestados (laranja)
- Termina com espaço + número → Reserva (cinza)
- Outros → Principal (azul)

![WhatsApp Image 2026-01-26 at 09 59 49 (6)](https://github.com/user-attachments/assets/77b252f3-156e-402f-a384-20b3904dac94)



