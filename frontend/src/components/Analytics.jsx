import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = ({ data }) => {
  const [minValue, setMinValue] = React.useState('');

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    return numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Filtrar dados baseado no valor mínimo
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    let filtered = [...data];

    if (minValue && minValue !== '') {
      const minValueNum = parseFloat(minValue);
      if (!isNaN(minValueNum)) {
        filtered = filtered.filter(item => {
          const valorGeral = parseFloat(item.valorGeral);
          return valorGeral >= minValueNum;
        });
      }
    }

    return filtered;
  }, [data, minValue]);

  // Top 10 por Itens Promocionais
  const top10ItensAcao = React.useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.itensAcao - a.itensAcao)
      .slice(0, 10)
      .map(item => ({
        nome: item.nomeRevendedora.length > 15
          ? item.nomeRevendedora.substring(0, 15) + '...'
          : item.nomeRevendedora,
        nomeCompleto: item.nomeRevendedora,
        itens: item.itensAcao,
        valor: parseFloat(item.valorAcao)
      }));
  }, [filteredData]);

  // Top 10 por Itens Gerais
  const top10ItensGerais = React.useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.itensGerais - a.itensGerais)
      .slice(0, 10)
      .map(item => ({
        nome: item.nomeRevendedora.length > 15
          ? item.nomeRevendedora.substring(0, 15) + '...'
          : item.nomeRevendedora,
        nomeCompleto: item.nomeRevendedora,
        itens: item.itensGerais,
        valor: parseFloat(item.valorGeral)
      }));
  }, [filteredData]);

  // Top 10 por Valor da Ação
  const top10ValorAcao = React.useMemo(() => {
    return [...filteredData]
      .sort((a, b) => parseFloat(b.valorAcao) - parseFloat(a.valorAcao))
      .slice(0, 10)
      .map(item => ({
        nome: item.nomeRevendedora.length > 15
          ? item.nomeRevendedora.substring(0, 15) + '...'
          : item.nomeRevendedora,
        nomeCompleto: item.nomeRevendedora,
        valor: parseFloat(item.valorAcao),
        itens: item.itensAcao
      }));
  }, [filteredData]);

  // Top 10 por Valor Geral
  const top10ValorGeral = React.useMemo(() => {
    return [...filteredData]
      .sort((a, b) => parseFloat(b.valorGeral) - parseFloat(a.valorGeral))
      .slice(0, 10)
      .map(item => ({
        nome: item.nomeRevendedora.length > 15
          ? item.nomeRevendedora.substring(0, 15) + '...'
          : item.nomeRevendedora,
        nomeCompleto: item.nomeRevendedora,
        valor: parseFloat(item.valorGeral),
        itens: item.itensGerais
      }));
  }, [filteredData]);

  // Tooltip customizado para melhor visualização
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.nomeCompleto}</p>
          {data.itens !== undefined && (
            <p className="text-sm text-gray-600">
              Itens: <span className="font-bold text-blue-600">{data.itens}</span>
            </p>
          )}
          {data.valor !== undefined && (
            <p className="text-sm text-gray-600">
              Valor: <span className="font-bold text-green-600">R$ {formatCurrency(data.valor)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-lg text-gray-500">
          Faça uma análise primeiro para visualizar os gráficos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filtro */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Filtros de Análise
          </h2>
          <p className="text-sm text-gray-600">
            Ajuste os filtros para refinar a visualização dos gráficos
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Geral Mínimo
            </label>
            <input
              type="number"
              placeholder="Ex: 500"
              value={minValue}
              onChange={(e) => setMinValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          {minValue && (
            <div className="flex items-end">
              <button
                onClick={() => setMinValue('')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Limpar Filtro
              </button>
            </div>
          )}
        </div>
        {filteredData.length < data.length && (
          <p className="mt-3 text-sm text-blue-600">
            Mostrando {filteredData.length} de {data.length} revendedores
          </p>
        )}
      </div>

      {/* Gráficos de Itens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Itens Promocionais */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top 10 - Itens Promocionais
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Revendedores que compraram mais itens da ação
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={top10ItensAcao}
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nome"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="itens" fill="#ec4899" name="Quantidade de Itens" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Itens Gerais */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top 10 - Itens Gerais
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Revendedores que compraram mais itens no total
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={top10ItensGerais}
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nome"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="itens" fill="#10b981" name="Quantidade de Itens" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos de Valor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Valor Ação */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top 10 - Valor da Ação
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Revendedores com maior valor em itens promocionais
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={top10ValorAcao}
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nome"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="valor" fill="#f59e0b" name="Valor (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Valor Geral */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top 10 - Valor Geral
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Revendedores com maior valor total de compras
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={top10ValorGeral}
              margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="nome"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="valor" fill="#3b82f6" name="Valor (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
