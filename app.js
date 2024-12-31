// app.js
const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

let currentPdfPath = null;

// Configuração do multer para uploads
const upload = multer({ dest: 'uploads/' });

// Rota para visualizar PDF
app.post('/preview', upload.single('pdf'), (req, res) => {
    const filePath = req.file.path;
    const outputPath = path.join(__dirname, 'public', 'preview.pdf');
    fs.renameSync(filePath, outputPath);
    currentPdfPath = outputPath; // Salva o caminho do PDF carregado
    res.json({ url: '/preview.pdf' });
});

// Rota para dividir PDF
app.post('/split', async (req, res) => {
    try {
        if (!currentPdfPath) {
            return res.status(400).json({ message: 'Nenhum PDF carregado.' });
        }

        const pdfBytes = fs.readFileSync(currentPdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        for (let i = 0; i < totalPages; i++) {
            const newPdfDoc = await PDFDocument.create();
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(copiedPage);

            const newPdfBytes = await newPdfDoc.save();
            fs.writeFileSync(path.join(outputDir, `page-${i + 1}.pdf`), newPdfBytes);
        }

        res.json({ message: 'PDF dividido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao dividir PDF.' });
    }
});

// Rota para mesclar PDFs
app.post('/merge', upload.single('pdf'), async (req, res) => {
    try {
        if (!currentPdfPath) {
            return res.status(400).json({ message: 'Nenhum PDF base carregado.' });
        }

        const basePdfBytes = fs.readFileSync(currentPdfPath);
        const pdfDoc = await PDFDocument.load(basePdfBytes);

        const newPdfBytes = fs.readFileSync(req.file.path);
        const loadedPdf = await PDFDocument.load(newPdfBytes);

        const copiedPages = await pdfDoc.copyPages(loadedPdf, loadedPdf.getPageIndices());
        copiedPages.forEach((page) => pdfDoc.addPage(page));

        const mergedPdfBytes = await pdfDoc.save();
        const outputPath = path.join(__dirname, 'output', 'merged.pdf');
        fs.writeFileSync(outputPath, mergedPdfBytes);

        res.json({ message: 'PDFs mesclados com sucesso!' });
    } catch (error) {
        res.status(500).send('Erro ao mesclar PDFs.');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Criação do front-end
// public/index.html
const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manipulador de PDFs</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .container {
            max-width: 600px;
            width: 100%;
        }
        form {
            margin: 20px 0;
        }
        iframe {
            width: 100%;
            height: 500px;
            border: 1px solid #ddd;
        }
        #result {
            margin-top: 20px;
            color: green;
        }
    </style>
</head>
<body>
    <h1>Manipulador de PDFs</h1>
    <div class="container">
        <h2>Visualizar, Dividir e Mesclar PDFs</h2>
        <form id="pdfForm" enctype="multipart/form-data">
            <input type="file" name="pdf" id="pdfUpload" required>
            <button type="submit">Visualizar</button> <button id="splitButton">Dividir PDF</button>
        </form>
        <iframe id="previewFrame" src=""></iframe>
        <form id="mergeForm" enctype="multipart/form-data">
            <input type="file" name="pdf" id="mergeUpload">
            <button type="submit">Mesclar com o PDF atual</button>
        </form>
        <div id="result"></div>
    </div>

    <script>
        document.getElementById('pdfForm').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const response = await fetch('/preview', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            document.getElementById('previewFrame').src = data.url;
        };

        document.getElementById('splitButton').onclick = async () => {
            const response = await fetch('/split', { method: 'POST' });
            const data = await response.json();
            document.getElementById('result').textContent = data.message;
        };

        document.getElementById('mergeForm').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const response = await fetch('/merge', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            document.getElementById('result').textContent = data.message;
        };
    </script>
</body>
</html>
`;

if (!fs.existsSync('public')) fs.mkdirSync('public');
fs.writeFileSync('public/index.html', htmlContent);
