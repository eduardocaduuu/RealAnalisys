# PromoAnalyzer

Aplicação web completa para análise comparativa de planilhas de ações promocionais.

## Descrição

PromoAnalyzer é uma ferramenta que permite comparar duas planilhas Excel:
- **Planilha Base**: Contém apenas revendedores que participaram de uma ação promocional
- **Planilha Comparação**: Contém todas as vendas do dia

A aplicação cruza os dados e mostra métricas detalhadas de cada revendedor.

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Multer (upload de arquivos)
- xlsx (processamento de planilhas Excel)
- CORS

### Frontend
- React
- Vite
- TailwindCSS
- Axios

## Funcionalidades

- Upload de duas planilhas Excel (.xlsx)
- Comparação automática entre dados promocionais e gerais
- Tabela interativa com ordenação e busca
- Estatísticas resumidas (total de revendedores, médias, percentuais)
- Exportação de resultados em CSV
- Design responsivo com tema pastel

## Estrutura do Projeto

```
promo-analyzer/
├── backend/
│   ├── routes/
│   │   └── analisar.js
│   ├── utils/
│   │   └── excelParser.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadSection.jsx
│   │   │   └── ResultsTable.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado

### 1. Clone o repositório
```bash
git clone https://github.com/eduardocaduuu/RealAnalisys.git
cd RealAnalisys
```

### 2. Instale as dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Execute a aplicação

#### Terminal 1 - Backend
```bash
cd backend
npm start
```
O servidor backend estará rodando em `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
O frontend estará acessível em `http://localhost:3000`

## Deploy no Render (Plano Gratuito)

### Passo 1: Preparar o Repositório

O projeto já está configurado para deploy no Render. Certifique-se de que todos os arquivos foram commitados e enviados para o GitHub.

### Passo 2: Criar Web Service no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório GitHub: `eduardocaduuu/RealAnalisys`
4. Configure o serviço:

   **Configurações Básicas:**
   - **Name**: `promo-analyzer` (ou o nome que preferir)
   - **Region**: Escolha a região mais próxima
   - **Branch**: `main` (ou `master`, conforme seu repositório)
   - **Root Directory**: (deixe em branco)
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

   **Configurações Avançadas:**
   - **Plan**: Selecione **Free**
   - **Environment Variables**: Nenhuma necessária por padrão

5. Clique em "Create Web Service"

### Passo 3: Aguarde o Deploy

O Render irá:
1. Instalar as dependências do frontend
2. Fazer o build do frontend (criar os arquivos estáticos)
3. Instalar as dependências do backend
4. Iniciar o servidor

O processo pode levar alguns minutos. Você pode acompanhar os logs em tempo real.

### Passo 4: Acesse sua Aplicação

Após o deploy ser concluído com sucesso, o Render fornecerá uma URL pública, algo como:
```
https://promo-analyzer.onrender.com
```

## Notas Importantes sobre o Plano Gratuito do Render

- **Spin Down**: Após 15 minutos de inatividade, o serviço entra em "sleep mode"
- **Spin Up**: A primeira requisição após o sleep pode levar 30-60 segundos
- **Limitações**: 750 horas gratuitas por mês (suficiente para um serviço)

## Formato das Planilhas Excel

### Planilha Base (Ação Promocional)
Deve conter as colunas:
- `NomeRevendedora`: Nome do revendedor
- `QuantidadeItens`: Quantidade de itens da ação
- `ValorPraticado`: Valor total dos itens da ação

### Planilha Comparação (Vendas Gerais)
Deve conter as colunas:
- `NomeRevendedora`: Nome do revendedor
- `QuantidadeItens`: Quantidade total de itens comprados
- `ValorPraticado`: Valor total das compras

## Suporte

Para problemas ou dúvidas, abra uma issue no GitHub.

## Licença

ISC
