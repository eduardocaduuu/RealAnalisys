import React from 'react';

const UploadSection = ({ onAnalyze, loading }) => {
  const [planilhaBase, setPlanilhaBase] = React.useState(null);
  const [planilhaComparacao, setPlanilhaComparacao] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (planilhaBase && planilhaComparacao) {
      onAnalyze(planilhaBase, planilhaComparacao);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Upload das Planilhas
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Planilha Base (Ação Promocional)
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setPlanilhaBase(e.target.files[0])}
            className="input-file"
            required
          />
          {planilhaBase && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {planilhaBase.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Planilha Comparação (Vendas Gerais)
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setPlanilhaComparacao(e.target.files[0])}
            className="input-file"
            required
          />
          {planilhaComparacao && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {planilhaComparacao.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !planilhaBase || !planilhaComparacao}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analisando...
            </span>
          ) : (
            'Analisar Ação'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadSection;
