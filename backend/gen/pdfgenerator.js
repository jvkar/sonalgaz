const puppeteer = require('puppeteer');
const fs = require('fs').promises;  // Use promise-based fs methods
const path = require('path');

async function generateClientListPDF(coupureResult,retablissementResult, clients, totalClients,nomAgence,nomCadre) {
    const imageFilePath = path.join(__dirname, '../public/myImage.png');
    const image = await fs.readFile(imageFilePath, { encoding: 'base64' });
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;


    const generateHTML = (coupureResult,retablissementResult,clients, totalClients,nomAgence,nomCadre) => {
        return `
        <html>
        <head>
        <title>Client List</title>
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px 12px; border: 1px solid #ccc; }
            th { background-color: #f4f4f4; }
            img { width: 50%; height: 70px; }
            .image {
                display: flex;
                justify-content: center;            
            }
        </style>
        </head>
        <body>
            <div class="image">
                <img src="data:image/png;base64,${image}" alt="image">
            </div>
            <p style="font-size: 15px;">Date et lieu : le ${formattedDate} à Blida</p> 
            <p style="font-size: 15px;">Nom Agence : ${nomAgence}</p>
            <p style="font-size: 15px;">Par Monsieur : ${nomCadre}</p>

            <h1 style="margin-top: 20px;">Rapport Mensuel</h1>
            <table style="margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Le total des clients</th>
                        <th>Le total des clients validées</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${totalClients}</td>
                        <td>${clients}</td>
                    </tr>
                </tbody>
            </table>
            <h1 style="margin-top: 70px;">Détail</h1>
            <h1 style="margin-top: 20px;">Liste des coupures</h1>
            <table>
                <thead>
                    <tr>
                        <th>Code Client</th>
                        <th>Référence Client</th>
                        <th>Numéro Compteur</th>
                        <th>Nom Client</th>
                        <th>Adresse Client</th>
                        <th>État</th>
                        <th>Date signalé</th>
                        <th>Cause</th>
                    </tr>
                </thead>
                <tbody>
                    ${coupureResult.map(coupure => {
                        let formattedDateSignale = '';

                        if (coupure.date_signale) {
                            const dateSignale = new Date(coupure.date_signale);
                            formattedDateSignale = `${dateSignale.getFullYear()}-${String(dateSignale.getMonth() + 1).padStart(2, '0')}-${String(dateSignale.getDate()).padStart(2, '0')}`;
                        }
                    return`
                    
                        <tr>
                            <td>${coupure.codeClient}</td>
                            <td>${coupure.referenceClient}</td>
                            <td>${coupure.numeroCompteur}</td>
                            <td>${coupure.nomClient}</td>
                            <td>${coupure.adresseClient}</td>
                            <td>${coupure.etat}</td>
                            <td>${formattedDateSignale}</td>
                            <td>${coupure.cause!==null ? coupure.cause : "/"}</td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
            <h1 style="margin-top: 10px;">Liste des retablissements</h1>

            <table>
            <thead>
                <tr>
                    <th>Code Client</th>
                    <th>Référence Client</th>
                    <th>Numéro Compteur</th>
                    <th>Nom Client</th>
                    <th>Adresse Client</th>
                    <th>État</th>
                    <th>Date signalé</th>
                    <th>Cause</th>
                </tr>
            </thead>
            <tbody>
            ${retablissementResult.map(retablissement => {
                let formattedDateSignale = '';

                if (retablissement.date_signale) {
                    const dateSignale = new Date(retablissement.date_signale);
                    formattedDateSignale = `${dateSignale.getFullYear()}-${String(dateSignale.getMonth() + 1).padStart(2, '0')}-${String(dateSignale.getDate()).padStart(2, '0')}`;
                }

                return`
            
                <tr>
                    <td>${retablissement.codeClient}</td>
                    <td>${retablissement.referenceClient}</td>
                    <td>${retablissement.numeroCompteur}</td>
                    <td>${retablissement.nomClient}</td>
                    <td>${retablissement.adresseClient}</td>
                    <td>${retablissement.etat}</td>
                    <td>${formattedDateSignale}</td>
                    <td>${retablissement.cause!==null ? retablissement.cause : "/"}</td>
                </tr>
            `}).join('')}
            </tbody>
        </table>
        </body>
        </html>
    `;
};

    try {
        console.log("Starting PDF generation process...");

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        console.log("Browser launched successfully.");

        await page.setContent(generateHTML(coupureResult,retablissementResult, clients, totalClients,nomAgence,nomCadre));

        console.log("Content set successfully.");

        const pdfDirectory = path.resolve(__dirname, '../pdfs');
        const pdfPath = path.join(pdfDirectory, 'mypdf.pdf');

        try {
            await fs.mkdir(pdfDirectory, { recursive: true });
            console.log("PDF directory ensured:", pdfDirectory);
        } catch (dirError) {
            console.error(`Error ensuring directory ${pdfDirectory}:`, dirError);
            throw dirError;
        }

        await page.pdf({ format: 'A4', path: pdfPath, printBackground: true });

        console.log("PDF generated successfully at", pdfPath);

        await browser.close();

        return pdfPath;
    } catch (error) {
        console.log('Error generating PDF:', error);
        return null;
    }
}

module.exports = { generateClientListPDF };
