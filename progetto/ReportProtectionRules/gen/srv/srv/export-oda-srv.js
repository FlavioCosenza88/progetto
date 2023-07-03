const fs = require('fs');
const path = require('path');
const excel = require('excel4node');
const axios = require('axios');
const { debug } = require('console');
const fse = require('fs-extra');
const os = require('os')
const sharp = require("sharp");

module.exports = cds.service.impl(function () {
    this.on('getCSRFToken', () => {
        return "Token"
    });

    this.on('format_excel', async (req) => {
       
        let lineItems = req.data.lineItems
        // Creazione di un nuovo foglio di lavoro
        const workbook = new excel.Workbook();

        const worksheetOptions = { sheetView: { showGridLines: false }, sheetFormat: { baseColWidth: 20, defaultRowHeight: 30 }, }
        const worksheet = workbook.addWorksheet('Dati', worksheetOptions);

        const style = workbook.createStyle({
            font: {
                name: 'Calibri'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
                
            },
            height: '80px',
            border: { left: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } }
        });

        const headerStyle = workbook.createStyle({
            font: {
                name: 'Calibri',
                bold: true,
                color: '#FFFFFF'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            }, border: {
                left: {
                    style: 'thin',
                    color: {
                        argb: 'FF000000'
                    }
                },
                right: {
                    style: 'thin',
                    color: {
                        argb: 'FF000000'
                    }
                },
                top: {
                    style: 'thin',
                    color: {
                        argb: 'FF000000'
                    }
                },
                bottom: {
                    style: 'thin',
                    color: {
                        argb: 'FF000000'
                    }
                }
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#043E50'
            }
        })

        const lowerBorderStyle = workbook.createStyle({ border: { bottom: { style: 'thin', color: { argb: 'FF000000' } }, left: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } } })
        const defaultBorderStyle = workbook.createStyle({ border: { left: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } } })
        
       
        // Definizione del nome delle colonne uguale al nome delle proprietà degli oggetti
       // const header = ['BRAND','BRAND_ID','BUSINESS PARTNER','BUSINESSPARTNEREMAIL','BUSINESSPARTNERID','DOCUMENTPOSSALESPERSONID','COMPANY','COMPANYID','DISCOUNT_APPLIED','DISCOUNT_PERCENTAGE','DOCUMENTENTRY','DOCUMENTTYPE','FAMILY','FAMILY_ID','GENDER','IMAGE_URL','MATERIAL','MATERIAL_ID','PIECES_SOLD','REFERENCE_MATERIAL','REFERENCE_MATERIAL_ID','RETAIL_FULL_PRICE','SELL_OUT_PRICE','SKU_SEASON','STORE','STOREID','WHOLESALE_PRICE'];
       const header = [
        'ARTICLE_DESCR',
        'ARTICLE_ID',
        'ARTICLE_IMG',
        'BRAND',
        'BRANDBRAND_ID',
        'FAMILY',
        'FAMILY_ID',
        'GENDER',
        'ID_REGOLA',
        'PRODUCT_GROUP',
        'QUANTITA_PROTETTA',
        'QUANTITA_STOCK',
        'RETAIL_PRICE',
        'SALES_CHANNEL',
        'SALES_CHANNEL_ID',
        'SEASON',
        'SEASON_YEAR',
        'STORE_POINT',
        'STORE_POINT_ID',
        'VALIDO_A',
        'VALIDO_DA',
        'VALORE_STOCK_PROTETTO',
        'WHOLESALE'];
             
      
        for (let i = 0; i < header.length; i++) {
            const element = header[i];
            worksheet.cell(1, i + 1).string(element).style(headerStyle);
        }

        // Definizione della colonna "Quantità_per_taglia" con il comportamento speciale
        let rowQT = 2;
        let row = 1;
        for (let i = 0; i < lineItems.length; i++) {
           
            const item = lineItems[i];

            

            // Write taglia and quantità data for each item
            let col = header.length;
            //let disponibilitaTotale = 0
            //worksheet.cell(rowQT - 2, col).string("Taglia").style({ font: { name: 'Calibri', bold: true, color: '#FFFFFF' }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { type: 'pattern', patternType: 'solid', fgColor: '#043E50' } });
            //worksheet.cell(rowQT - 2, col).string("DISPONIBILITA'").style({ font: { bold: true }, border: { bottom: { style: 'thin', color: { argb: 'FF000000' } }, left: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } } });
            //worksheet.cell(rowQT - 1, col).string("ORDINATO").style(lowerBorderStyle);
           
            // Write other data for each item
            worksheet.cell(row + 1, 1).string(item.ARTICLE_DESCR ? item.ARTICLE_DESCR : "").style(style);
            worksheet.cell(row + 1, 2).string(item.ARTICLE_ID ? item.ARTICLE_ID : "").style(style);
            worksheet.cell(row + 1, 3).string().style(style);
            worksheet.cell(row + 1, 4).string(item.BRAND ? item.BRAND : "").style(style);
            worksheet.cell(row + 1, 5).string(item.BRAND_ID ? item.BRAND_ID : "").style(style);
            worksheet.cell(row + 1, 6).string(item.FAMILY ? item.FAMILY : "" ).style(style);
            worksheet.cell(row + 1, 7).string(item.FAMILY_ID ? item.FAMILY_ID : "" ).style(style);
            worksheet.cell(row + 1, 8).string(item.GENDER ? item.GENDER : "").style(style);
            worksheet.cell(row + 1, 9).string(item.ID_REGOLA ? item.ID_REGOLA : "").style(style);
            worksheet.cell(row + 1, 10).string(item.PRODUCT_GROUP ? item.PRODUCT_GROUP : "").style(style);
            worksheet.cell(row + 1, 11).string(item.QUANTITA_PROTETTA ? item.QUANTITA_PROTETTA : "").style(style);
            worksheet.cell(row + 1, 12).string(item.QUANTITA_STOCK ? item.QUANTITA_STOCK : "").style(style);
            worksheet.cell(row + 1, 13).string(item.RETAIL_PRICE ? item.RETAIL_PRICE : "").style(style);
            worksheet.cell(row + 1, 14).string(item.SALES_CHANNEL ? item.SALES_CHANNEL : "").style(style);
            worksheet.cell(row + 1, 15).string(item.SALES_CHANNEL_ID ? item.SALES_CHANNEL_ID : "").style(style);
            worksheet.cell(row + 1, 16).string(item.SEASON ? item.SEASON : "").style(style);
            worksheet.cell(row + 1, 17).string(item.SEASON_YEAR ? item.SEASON_YEAR : "").style(style);
            worksheet.cell(row + 1, 18).string(item.STORE_POINT ? item.STORE_POINT : "").style(style);
            worksheet.cell(row + 1, 19).string(item.STORE_POINT_ID ? item.STORE_POINT_ID : "").style(style);
            worksheet.cell(row + 1, 20).string(item.VALIDO_A ? item.VALIDO_A : "").style(style);
            worksheet.cell(row + 1, 21).string(item.VALIDO_DA ? item.VALIDO_DA : "").style(style);
            worksheet.cell(row + 1, 22).string(item.VALORE_STOCK_PROTETTO ? item.VALORE_STOCK_PROTETTO : "").style(style);
            worksheet.cell(row + 1, 23).string(item.WHOLESALE ? item.WHOLESALE : "").style(style);
            worksheet.row(row+1).setHeight(80);
            row += 1;
           
        }

        let imgRow = 2;
            
        //Override colonne
        worksheet.column(1).setWidth(20);
        worksheet.column(2).setWidth(25);
        worksheet.column(3).setWidth(15);
        worksheet.column(4).setWidth(25);
        worksheet.column(6).setWidth(25);
        worksheet.column(7).setWidth(25);
        worksheet.column(8).setWidth(10);
        worksheet.column(9).setWidth(25);
        worksheet.column(10).setWidth(25);
        worksheet.column(11).setWidth(15);
        worksheet.column(12).setWidth(20);
        worksheet.column(13).setWidth(25);
        worksheet.column(14).setWidth(15);
        worksheet.column(15).setWidth(25);
        worksheet.column(16).setWidth(25);
        worksheet.column(17).setWidth(25);
        worksheet.column(18).setWidth(25);
        worksheet.column(19).setWidth(25);
        worksheet.column(20).setWidth(25);
        worksheet.column(21).setWidth(25);
        worksheet.column(22).setWidth(25);
        worksheet.column(23).setWidth(25);
      
        let rowPos = 1

        for (let i = 0; i < lineItems.length; i++) {
            
            rowPos += 1;

            const element = lineItems[i].ARTICLE_IMG;
            if (!element) {
                // Skip this iteration if immagine is null or undefined
                continue;
            }

            try {
                const image = await axios.get(element, { responseType: "arraybuffer" });
                const resizedImage = await sharp(image.data)
                    .resize(80, 80)
                    .toBuffer();
                const imageData = Buffer.from(resizedImage, "binary");
                const imageId = worksheet.addImage({
                    image: imageData,
                    type: "picture",
                    position: {
                        type: "oneCellAnchor",
                        from: {
                            col: 3,
                            colOff: "10mm",
                            row: rowPos,
                            rowOff: "5mm",
                        },
                    },
                });
            } catch (error) {
                // Handle any errors that occur while processing the image
                console.error(`Error processing image for line item ${i}: ${error}`);
            }
        }

        // Salvataggio del file Excel
        const buffer = await workbook.writeToBuffer();
        const fileExcel = buffer.toString('base64');
    
        return fileExcel;
    })
})

