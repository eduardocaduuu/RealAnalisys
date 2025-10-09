import React from 'react';

const UploadSection = ({ onAnalyze, loading }) => {
  const [step, setStep] = React.useState(1);

  // Dados das perguntas
  const [temRecepcao, setTemRecepcao] = React.useState(null);
  const [gastosRecepcao, setGastosRecepcao] = React.useState([]);
  const [temMeta, setTemMeta] = React.useState(null);
  const [valorMeta, setValorMeta] = React.useState('');

  // Planilhas
  const [planilhaBase, setPlanilhaBase] = React.useState(null);
  const [planilhaComparacao, setPlanilhaComparacao] = React.useState(null);

  const adicionarGasto = () => {
    setGastosRecepcao([...gastosRecepcao, { item: '', valor: '' }]);
  };

  const removerGasto = (index) => {
    setGastosRecepcao(gastosRecepcao.filter((_, i) => i !== index));
  };

  const atualizarGasto = (index, campo, valor) => {
    const novosGastos = [...gastosRecepcao];
    novosGastos[index][campo] = valor;
    setGastosRecepcao(novosGastos);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (temRecepcao === true && gastosRecepcao.length === 0) {
        adicionarGasto();
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (planilhaBase && planilhaComparacao) {
      const dadosExtras = {
        recepcao: temRecepcao ? {
          gastos: gastosRecepcao.filter(g => g.item && g.valor)
        } : null,
        meta: temMeta ? parseFloat(valorMeta) : null
      };

      onAnalyze(planilhaBase, planilhaComparacao, dadosExtras);
    }
  };

  const calcularTotalRecepcao = () => {
    return gastosRecepcao.reduce((total, gasto) => {
      return total + (parseFloat(gasto.valor) || 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="card max-w-3xl mx-auto">
      {/* Indicador de Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            1. Recepção
          </span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            2. Meta
          </span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            3. Planilhas
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Etapa 1: Recepção */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Gastos com Recepção
          </h2>
          <p className="text-gray-600 text-center">
            Você teve gastos com recepção no dia da ação? (lanches, bebidas, ornamentação)
          </p>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setTemRecepcao(true)}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                temRecepcao === true
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => {
                setTemRecepcao(false);
                setGastosRecepcao([]);
              }}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                temRecepcao === false
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Não
            </button>
          </div>

          {temRecepcao === true && (
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-gray-700">Adicione os gastos:</h3>

              {gastosRecepcao.map((gasto, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Item (ex: Lanches)"
                    value={gasto.item}
                    onChange={(e) => atualizarGasto(index, 'item', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    placeholder="Valor (R$)"
                    value={gasto.valor}
                    onChange={(e) => atualizarGasto(index, 'valor', e.target.value)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    step="0.01"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => removerGasto(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={adicionarGasto}
                className="w-full px-4 py-2 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
              >
                + Adicionar outro gasto
              </button>

              {gastosRecepcao.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 font-semibold">
                    Total Recepção: R$ {calcularTotalRecepcao()}
                  </p>
                </div>
              )}
            </div>
          )}

          {temRecepcao !== null && (
            <button
              onClick={handleNextStep}
              className="btn-primary w-full mt-6"
            >
              Próximo
            </button>
          )}
        </div>
      )}

      {/* Etapa 2: Meta */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Meta do Período
          </h2>
          <p className="text-gray-600 text-center">
            Quer colocar o valor da meta do período atual para análise?
          </p>

          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setTemMeta(true)}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                temMeta === true
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => {
                setTemMeta(false);
                setValorMeta('');
              }}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                temMeta === false
                  ? 'bg-red-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Não
            </button>
          </div>

          {temMeta === true && (
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Valor da Meta (R$)
              </label>
              <input
                type="number"
                placeholder="Ex: 50000.00"
                value={valorMeta}
                onChange={(e) => setValorMeta(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
                step="0.01"
                min="0"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handlePrevStep}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
            >
              Voltar
            </button>
            {temMeta !== null && (
              <button
                onClick={handleNextStep}
                className="flex-1 btn-primary"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Etapa 3: Upload de Planilhas */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
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

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading || !planilhaBase || !planilhaComparacao}
                className="flex-1 btn-primary"
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
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
