import XLSX from 'xlsx';

export const parseExcel = (buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    throw new Error('Erro ao processar planilha Excel: ' + error.message);
  }
};

export const filterColumns = (data, columns) => {
  return data.map(row => {
    const filtered = {};
    columns.forEach(col => {
      filtered[col] = row[col] || 0;
    });
    return filtered;
  });
};

export const compareData = (baseData, comparisonData) => {
  const results = [];

  baseData.forEach(baseRow => {
    const nome = baseRow.NomeRevendedora;
    const comparisonRow = comparisonData.find(
      row => row.NomeRevendedora === nome
    );

    if (comparisonRow) {
      const itensAcao = Number(baseRow.QuantidadeItens) || 0;
      const valorAcao = Number(baseRow.ValorPraticado) || 0;
      const itensGerais = Number(comparisonRow.QuantidadeItens) || 0;
      const valorGeral = Number(comparisonRow.ValorPraticado) || 0;

      results.push({
        nomeRevendedora: nome,
        itensAcao: itensAcao,
        valorAcao: valorAcao.toFixed(2),
        itensGerais: itensGerais,
        valorGeral: valorGeral.toFixed(2),
        diferencaItens: itensGerais - itensAcao,
        diferencaValor: (valorGeral - valorAcao).toFixed(2)
      });
    }
  });

  return results;
};

export const calculateStatistics = (results, totalRevendedoresGeral = 0, dadosExtras = null) => {
  if (results.length === 0) {
    return {
      totalRevendedores: 0,
      totalRevendedoresGeral: totalRevendedoresGeral,
      percentualRevendedoresAcao: 0,
      valorTotalAcao: 0,
      valorTotalGeral: 0,
      mediaDiferencaValor: 0,
      percentualItensAcao: 0,
      totalRecepcao: null,
      gastos: null,
      valorMeta: null,
      percentualMeta: null
    };
  }

  const totalRevendedores = results.length;

  const percentualRevendedoresAcao = totalRevendedoresGeral > 0
    ? ((totalRevendedores / totalRevendedoresGeral) * 100).toFixed(2)
    : 0;

  const valorTotalAcao = results.reduce(
    (sum, r) => sum + parseFloat(r.valorAcao),
    0
  );

  const valorTotalGeral = results.reduce(
    (sum, r) => sum + parseFloat(r.valorGeral),
    0
  );

  const somaDiferencaValor = results.reduce(
    (sum, r) => sum + parseFloat(r.diferencaValor),
    0
  );
  const mediaDiferencaValor = (somaDiferencaValor / totalRevendedores).toFixed(2);

  const totalItensAcao = results.reduce((sum, r) => sum + r.itensAcao, 0);
  const totalItensGerais = results.reduce((sum, r) => sum + r.itensGerais, 0);
  const percentualItensAcao = totalItensGerais > 0
    ? ((totalItensAcao / totalItensGerais) * 100).toFixed(2)
    : 0;

  // Processar dados de recepção
  let totalRecepcao = null;
  let gastos = null;
  if (dadosExtras?.recepcao?.gastos) {
    gastos = dadosExtras.recepcao.gastos;
    totalRecepcao = gastos.reduce((sum, g) => sum + parseFloat(g.valor || 0), 0).toFixed(2);
  }

  // Processar meta
  let valorMeta = null;
  let percentualMeta = null;
  if (dadosExtras?.meta) {
    valorMeta = dadosExtras.meta.toFixed(2);
    percentualMeta = ((valorTotalGeral / dadosExtras.meta) * 100).toFixed(2);
  }

  return {
    totalRevendedores,
    totalRevendedoresGeral,
    percentualRevendedoresAcao,
    valorTotalAcao: valorTotalAcao.toFixed(2),
    valorTotalGeral: valorTotalGeral.toFixed(2),
    mediaDiferencaValor,
    percentualItensAcao,
    totalRecepcao,
    gastos,
    valorMeta,
    percentualMeta
  };
};
