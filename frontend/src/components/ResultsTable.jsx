import React from 'react';

const ResultsTable = ({ data, statistics }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [minValue, setMinValue] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];

    if (searchTerm) {
      sortableData = sortableData.filter(item =>
        item.nomeRevendedora.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minValue && minValue !== '') {
      const minValueNum = parseFloat(minValue);
      if (!isNaN(minValueNum)) {
        sortableData = sortableData.filter(item => {
          const valorGeral = parseFloat(item.valorGeral);
          return valorGeral >= minValueNum;
        });
      }
    }

    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortConfig.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal;
      });
    }

    return sortableData;
  }, [data, searchTerm, minValue, sortConfig]);

  const exportToCSV = () => {
    const headers = [
      'Nome Revendedora',
      'Itens Ação',
      'Valor Ação',
      'Itens Gerais',
      'Valor Geral',
      'Diferença Itens',
      'Diferença Valor'
    ];

    const csvContent = [
      headers.join(','),
      ...sortedData.map(row =>
        [
          `"${row.nomeRevendedora}"`,
          row.itensAcao,
          row.valorAcao,
          row.itensGerais,
          row.valorGeral,
          row.diferencaItens,
          row.diferencaValor
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'analise_promocional.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="card mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Resultados da Análise
        </h2>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-pastel-blue rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 font-medium mb-1">Total de Revendedores</p>
              <p className="text-3xl font-bold text-blue-700">
                {statistics.totalRevendedores}
              </p>
              <p className="text-xs text-gray-500 mt-1">da ação promocional</p>
            </div>
            <div className="bg-pastel-pink rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 font-medium mb-1">Valor Total da Ação</p>
              <p className="text-2xl font-bold text-pink-700">
                R$ {statistics.valorTotalAcao}
              </p>
              <p className="text-xs text-gray-500 mt-1">itens promocionais</p>
            </div>
            <div className="bg-pastel-green rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 font-medium mb-1">Valor Total Geral</p>
              <p className="text-2xl font-bold text-green-700">
                R$ {statistics.valorTotalGeral}
              </p>
              <p className="text-xs text-gray-500 mt-1">vendas do dia</p>
            </div>
            <div className="bg-pastel-purple rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 font-medium mb-1">% Itens da Ação</p>
              <p className="text-2xl font-bold text-purple-700">
                {statistics.percentualItensAcao}%
              </p>
              <p className="text-xs text-gray-500 mt-1">do total de itens</p>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-600 font-medium mb-1">% Revendedores da Ação</p>
              <p className="text-2xl font-bold text-orange-700">
                {statistics.percentualRevendedoresAcao}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{statistics.totalRevendedores} de {statistics.totalRevendedoresGeral} revendedores</p>
            </div>
          </div>
        )}

        {/* Cards de Análise de Recepção e Meta */}
        {statistics && (statistics.totalRecepcao || statistics.valorMeta) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-6">
            {/* Card de Gastos com Recepção */}
            {statistics.totalRecepcao && (
              <>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-400">
                  <p className="text-sm text-gray-600 font-medium mb-1">Gastos com Recepção</p>
                  <p className="text-2xl font-bold text-red-700">
                    R$ {statistics.totalRecepcao}
                  </p>
                  {statistics.gastos && statistics.gastos.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {statistics.gastos.map((g, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{g.item}</span>
                          <span>R$ {parseFloat(g.valor).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-cyan-400">
                  <p className="text-sm text-gray-600 font-medium mb-1">Lucro Líquido da Ação</p>
                  <p className="text-2xl font-bold text-cyan-700">
                    R$ {(parseFloat(statistics.valorTotalAcao) - parseFloat(statistics.totalRecepcao)).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    após custos de recepção
                  </p>
                  <div className="mt-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Valor Ação:</span>
                      <span className="text-green-600">+R$ {statistics.valorTotalAcao}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Recepção:</span>
                      <span className="text-red-600">-R$ {statistics.totalRecepcao}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-400">
                  <p className="text-sm text-gray-600 font-medium mb-1">% Custo Recepção</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {((parseFloat(statistics.totalRecepcao) / parseFloat(statistics.valorTotalAcao)) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    do valor total da ação
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {parseFloat(statistics.totalRecepcao) < parseFloat(statistics.valorTotalAcao) * 0.1
                      ? '✓ Custo baixo e eficiente'
                      : parseFloat(statistics.totalRecepcao) < parseFloat(statistics.valorTotalAcao) * 0.2
                      ? '⚠ Custo moderado'
                      : '⚠ Custo elevado, considere otimizar'}
                  </p>
                </div>
              </>
            )}

            {/* Cards de Meta */}
            {statistics.valorMeta && (
              <>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-emerald-400">
                  <p className="text-sm text-gray-600 font-medium mb-1">Meta do Período</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    R$ {statistics.valorMeta}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">valor objetivo</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-amber-400">
                  <p className="text-sm text-gray-600 font-medium mb-1">% da Meta Atingido</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {statistics.percentualMeta}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {parseFloat(statistics.percentualMeta) >= 100
                      ? '🎉 Meta superada!'
                      : parseFloat(statistics.percentualMeta) >= 80
                      ? '✓ Próximo da meta'
                      : '⚠ Abaixo da meta'}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        parseFloat(statistics.percentualMeta) >= 100
                          ? 'bg-green-500'
                          : parseFloat(statistics.percentualMeta) >= 80
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(parseFloat(statistics.percentualMeta), 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border-l-4 border-teal-400">
                  <p className="text-sm text-gray-600 font-medium mb-1">Impacto da Ação na Meta</p>
                  <p className="text-2xl font-bold text-teal-700">
                    {((parseFloat(statistics.valorTotalAcao) / parseFloat(statistics.valorMeta)) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    da meta foi a ação promocional
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    R$ {statistics.valorTotalAcao} de R$ {statistics.valorMeta}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Valor Geral mínimo (ex: 500)"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={exportToCSV}
            className="btn-primary whitespace-nowrap"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('nomeRevendedora')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Nome Revendedora {sortConfig.key === 'nomeRevendedora' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('itensAcao')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Itens Ação {sortConfig.key === 'itensAcao' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('valorAcao')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Valor Ação {sortConfig.key === 'valorAcao' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('itensGerais')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Itens Gerais {sortConfig.key === 'itensGerais' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('valorGeral')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Valor Geral {sortConfig.key === 'valorGeral' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('diferencaItens')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Dif. Itens {sortConfig.key === 'diferencaItens' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('diferencaValor')}
                className="table-header cursor-pointer hover:bg-blue-100"
              >
                Dif. Valor {sortConfig.key === 'diferencaValor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-pastel-blue transition-colors duration-150"
              >
                <td className="table-cell font-medium">{row.nomeRevendedora}</td>
                <td className="table-cell text-center">{row.itensAcao}</td>
                <td className="table-cell text-right">R$ {row.valorAcao}</td>
                <td className="table-cell text-center">{row.itensGerais}</td>
                <td className="table-cell text-right">R$ {row.valorGeral}</td>
                <td className="table-cell text-center">
                  <span className={row.diferencaItens > 0 ? 'text-green-600' : 'text-gray-600'}>
                    {row.diferencaItens > 0 ? '+' : ''}{row.diferencaItens}
                  </span>
                </td>
                <td className="table-cell text-right">
                  <span className={row.diferencaValor > 0 ? 'text-green-600' : 'text-gray-600'}>
                    R$ {row.diferencaValor > 0 ? '+' : ''}{row.diferencaValor}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (searchTerm || minValue) && (
        <p className="text-center text-gray-500 py-8">
          Nenhum resultado encontrado com os filtros aplicados
          {searchTerm && ` (Nome: "${searchTerm}")`}
          {minValue && ` (Valor mínimo: R$ ${minValue})`}
        </p>
      )}
    </div>
  );
};

export default ResultsTable;
