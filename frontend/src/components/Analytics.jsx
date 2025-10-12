import React from 'react';
import html2canvas from 'html2canvas';

const Analytics = ({ data }) => {
  const [minValue, setMinValue] = React.useState('');

  // Refs para cada gráfico
  const chart1Ref = React.useRef(null);
  const chart2Ref = React.useRef(null);
  const chart3Ref = React.useRef(null);
  const chart4Ref = React.useRef(null);
  const allChartsRef = React.useRef(null);

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    return numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para baixar um gráfico individual em PNG
  const downloadChartAsPNG = async (ref, fileName) => {
    if (!ref.current) return;

    try {
      const canvas = await html2canvas(ref.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}_${timestamp}.png`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Por favor, tente novamente.');
    }
  };

  // Função para baixar todos os gráficos juntos
  const downloadAllChartsAsPNG = async () => {
    if (!allChartsRef.current) return;

    try {
      const canvas = await html2canvas(allChartsRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb',
        logging: false,
        windowWidth: allChartsRef.current.scrollWidth,
        windowHeight: allChartsRef.current.scrollHeight,
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `analytics_completo_${timestamp}.png`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Por favor, tente novamente.');
    }
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
      .map((item, index) => ({
        posicao: index + 1,
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
      .map((item, index) => ({
        posicao: index + 1,
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
      .map((item, index) => ({
        posicao: index + 1,
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
      .map((item, index) => ({
        posicao: index + 1,
        nomeCompleto: item.nomeRevendedora,
        valor: parseFloat(item.valorGeral),
        itens: item.itensGerais
      }));
  }, [filteredData]);

  // Componente de Ranking Visual
  const RankingCard = ({ data, title, subtitle, valueLabel, itemsLabel, color, chartRef, fileName }) => {
    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.valor || d.itens)) : 1;

    return (
      <div ref={chartRef} className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={() => downloadChartAsPNG(chartRef, fileName)}
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            PNG
          </button>
        </div>

        <div className="space-y-3">
          {data.map((item) => {
            const percentage = ((item.valor || item.itens) / maxValue) * 100;

            return (
              <div key={item.posicao} className="group">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {item.posicao}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate" title={item.nomeCompleto}>
                      {item.nomeCompleto}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {item.valor !== undefined && (
                      <p className="text-sm font-bold text-gray-900">
                        R$ {formatCurrency(item.valor)}
                      </p>
                    )}
                    {item.itens !== undefined && (
                      <p className="text-sm font-bold text-gray-900">
                        {item.itens} {itemsLabel}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-11 mr-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${color} transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
      {/* Filtro e Botão de Download Global */}
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Filtros de Análise
            </h2>
            <p className="text-sm text-gray-600">
              Ajuste os filtros para refinar a visualização dos rankings
            </p>
          </div>
          <button
            onClick={downloadAllChartsAsPNG}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar Todos em PNG
          </button>
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

      {/* Container para todos os gráficos */}
      <div ref={allChartsRef} className="space-y-6 bg-gray-50 p-6 rounded-lg">
        {/* Rankings de Itens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RankingCard
            data={top10ItensAcao}
            title="Top 10 - Itens Promocionais"
            subtitle="Revendedores que compraram mais itens da ação"
            itemsLabel="itens"
            color="bg-gradient-to-r from-pink-500 to-rose-500"
            chartRef={chart1Ref}
            fileName="top10_itens_promocionais"
          />

          <RankingCard
            data={top10ItensGerais}
            title="Top 10 - Itens Gerais"
            subtitle="Revendedores que compraram mais itens no total"
            itemsLabel="itens"
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            chartRef={chart2Ref}
            fileName="top10_itens_gerais"
          />
        </div>

        {/* Rankings de Valor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RankingCard
            data={top10ValorAcao}
            title="Top 10 - Valor da Ação"
            subtitle="Revendedores com maior valor em itens promocionais"
            valueLabel="R$"
            color="bg-gradient-to-r from-amber-500 to-orange-500"
            chartRef={chart3Ref}
            fileName="top10_valor_acao"
          />

          <RankingCard
            data={top10ValorGeral}
            title="Top 10 - Valor Geral"
            subtitle="Revendedores com maior valor total de compras"
            valueLabel="R$"
            color="bg-gradient-to-r from-blue-500 to-indigo-500"
            chartRef={chart4Ref}
            fileName="top10_valor_geral"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
