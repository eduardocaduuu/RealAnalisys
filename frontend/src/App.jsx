import React from 'react';
import axios from 'axios';
import UploadSection from './components/UploadSection';
import ResultsTable from './components/ResultsTable';
import Analytics from './components/Analytics';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [statistics, setStatistics] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [currentTab, setCurrentTab] = React.useState('home'); // 'home' ou 'analytics'

  const handleAnalyze = async (planilhaBase, planilhaComparacao, dadosExtras) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('planilhaBase', planilhaBase);
    formData.append('planilhaComparacao', planilhaComparacao);

    // Adicionar dados extras ao FormData
    if (dadosExtras) {
      formData.append('dadosExtras', JSON.stringify(dadosExtras));
    }

    try {
      const apiUrl = import.meta.env.PROD
        ? '/api/analisar'
        : 'http://localhost:5000/api/analisar';

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResults(response.data.data);
        setStatistics(response.data.statistics);
      } else {
        setError(response.data.message || 'Erro ao processar planilhas');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Erro ao conectar com o servidor. Verifique se o backend está rodando.'
      );
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Análise de Ações
          </h1>
          <p className="text-gray-600 text-lg">
            Análise Inteligente de Ações Promocionais
          </p>
        </header>

        {/* Navegação por Abas */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </div>
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currentTab === 'analytics'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </div>
            </button>
          </div>
        </div>

        {/* Conteúdo da Aba Home */}
        {currentTab === 'home' && (
          <>
            <UploadSection onAnalyze={handleAnalyze} loading={loading} />

            {error && (
              <div className="card mt-8 bg-red-50 border border-red-200">
                <p className="text-red-700 text-center">
                  <strong>Erro:</strong> {error}
                </p>
              </div>
            )}

            {results && (
              <ResultsTable data={results} statistics={statistics} />
            )}

            {!results && !error && !loading && (
              <div className="text-center mt-12 text-gray-500">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg">Faça upload das planilhas para começar a análise</p>
              </div>
            )}
          </>
        )}

        {/* Conteúdo da Aba Analytics */}
        {currentTab === 'analytics' && (
          <Analytics data={results} />
        )}
      </div>
    </div>
  );
}

export default App;
