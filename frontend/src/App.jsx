import React from 'react';
import axios from 'axios';
import UploadSection from './components/UploadSection';
import ResultsTable from './components/ResultsTable';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(null);
  const [statistics, setStatistics] = React.useState(null);
  const [error, setError] = React.useState(null);

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
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Análise de Ações
          </h1>
          <p className="text-gray-600 text-lg">
            Análise Inteligente de Ações Promocionais
          </p>
        </header>

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
      </div>
    </div>
  );
}

export default App;
