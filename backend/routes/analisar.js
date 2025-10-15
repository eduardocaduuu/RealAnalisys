import express from 'express';
import multer from 'multer';
import { parseExcel, filterColumns, compareData, calculateStatistics } from '../utils/excelParser.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos Excel (.xlsx, .xls) são permitidos!'), false);
    }
  }
});

router.post('/', upload.fields([
  { name: 'planilhaBase', maxCount: 1 },
  { name: 'planilhaComparacao', maxCount: 1 }
]), (req, res) => {
  try {
    if (!req.files || !req.files.planilhaBase || !req.files.planilhaComparacao) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, envie ambas as planilhas (Base e Comparação)'
      });
    }

    const planilhaBaseBuffer = req.files.planilhaBase[0].buffer;
    const planilhaComparacaoBuffer = req.files.planilhaComparacao[0].buffer;

    // Parsear dados extras (se existirem)
    let dadosExtras = null;
    if (req.body.dadosExtras) {
      try {
        dadosExtras = JSON.parse(req.body.dadosExtras);
      } catch (e) {
        console.error('Erro ao parsear dadosExtras:', e);
      }
    }

    const baseData = parseExcel(planilhaBaseBuffer);
    const comparisonData = parseExcel(planilhaComparacaoBuffer);

    const baseColumns = ['NomeRevendedora', 'QuantidadeItens', 'ValorPraticado'];
    const comparisonColumns = ['NomeRevendedora', 'QuantidadeItens', 'ValorPraticado'];

    const filteredBase = filterColumns(baseData, baseColumns);
    const filteredComparison = filterColumns(comparisonData, comparisonColumns);

    const results = compareData(filteredBase, filteredComparison);

    // Contar total de revendedores únicos na planilha de comparação
    const totalRevendedoresGeral = new Set(
      filteredComparison.map(r => r.NomeRevendedora).filter(nome => nome)
    ).size;

    const statistics = calculateStatistics(results, totalRevendedoresGeral, dadosExtras, filteredComparison);

    res.json({
      success: true,
      data: results,
      statistics: statistics,
      dadosExtras: dadosExtras
    });

  } catch (error) {
    console.error('Erro ao processar planilhas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar planilhas: ' + error.message
    });
  }
});

export default router;
