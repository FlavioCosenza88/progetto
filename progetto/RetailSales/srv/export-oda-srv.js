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
        console.log("dentro")
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
        const header = ['COMPANY','ORDER DATA','SALE TYPE','STORE','RECEIPT NUMBER','ID CLIENT ADVISOR','CLIENT ADVISOR','SEASON','BRAND','FAMILY','GENDER','IMAGE','SKU PARENT','SKU CHILDREN','PIECES SOLD/RETURN','WHOLESALE PRICE','RETAIL FULL PRICE','SELL OUT PRICE','DISCOUNT APPLIED','DISOUNT PERCENTAGE APPLIED','CUSTOMER ID','CUSTOMER DESCRIPTION','CUSTOMER EMAIL',];
        for (let i = 0; i < header.length; i++) {
            const element = header[i];
            worksheet.cell(1, i + 1).string(element).style(headerStyle);
        }

        // Definizione della colonna "Quantità_per_taglia" con il comportamento speciale
        let rowQT = 2;
        let row = 1;
        let rows=0;
        let sommaPIECES_SOLD=0;
        for (let i = 0; i < lineItems.length; i++) {
            let parseIntsomma=parseInt(lineItems[i].PIECES_SOLD)
            sommaPIECES_SOLD=sommaPIECES_SOLD+parseIntsomma        
        }
        let sommaRETAIL_FULL_PRICE=0;
        for (let i = 0; i < lineItems.length; i++) {
            let parseIntsomma=parseInt(lineItems[i].RETAIL_FULL_PRICE)
            sommaRETAIL_FULL_PRICE=sommaRETAIL_FULL_PRICE+parseIntsomma        
        }
        let sommaSELL_OUT_PRICE=0;
        for (let i = 0; i < lineItems.length; i++) {
            let parseIntsomma=parseInt(lineItems[i].SELL_OUT_PRICE)
            sommaSELL_OUT_PRICE=sommaSELL_OUT_PRICE+parseIntsomma        
        }
        rows=lineItems.length;
        worksheet.cell(rows + 2, 15).string(sommaPIECES_SOLD+" PZ").style(style);
        worksheet.cell(rows + 2, 17).string(sommaRETAIL_FULL_PRICE+" Euro").style(style);
        worksheet.cell(rows + 2, 18).string(sommaSELL_OUT_PRICE+" Euro").style(style);
        for (let i = 0; i < lineItems.length; i++) {
           
            const item = lineItems[i];

            

            // Write taglia and quantità data for each item
            let col = header.length;
            //let disponibilitaTotale = 0
            //worksheet.cell(rowQT - 2, col).string("Taglia").style({ font: { name: 'Calibri', bold: true, color: '#FFFFFF' }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { type: 'pattern', patternType: 'solid', fgColor: '#043E50' } });
            //worksheet.cell(rowQT - 2, col).string("DISPONIBILITA'").style({ font: { bold: true }, border: { bottom: { style: 'thin', color: { argb: 'FF000000' } }, left: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } } });
            //worksheet.cell(rowQT - 1, col).string("ORDINATO").style(lowerBorderStyle);
           

            // Write other data for each item
            worksheet.cell(row + 1, 1).string(item.COMPANY ? item.COMPANY : "").style(style);
            worksheet.cell(row + 1, 2).string(item.DOCUMENTDATESTRING ? item.DOCUMENTDATESTRING : "").style(style);
            worksheet.cell(row + 1, 3).string(item.DOCUMENTTYPE ? item.DOCUMENTTYPE : "").style(style);
            worksheet.cell(row + 1, 4).string((item.STOREID ? item.STOREID : "")+" "+(item.STORE ? item.STORE : "")).style(style);
            worksheet.cell(row + 1, 5).string(item.DOCUMENTENTRY ? item.DOCUMENTENTRY : "" + item.CURRENCY ? item.CURRENCY : "").style(style);
            worksheet.cell(row + 1, 6).string(item.DOCUMENTPOSSALESPERSONID ? item.DOCUMENTPOSSALESPERSONID : "").style(style);
            worksheet.cell(row + 1, 7).string(item.DOCUMENTPOSSALESPERSON ? item.DOCUMENTPOSSALESPERSON : "").style(style);
            worksheet.cell(row + 1, 8).string(item.SKU_SEASON ? item.SKU_SEASON : "").style(style);
            worksheet.cell(row + 1, 9).string(item.BRAND ? item.BRAND : "").style(style);
            worksheet.cell(row + 1, 10).string(item.FAMILY ? item.FAMILY : "").style(style);
            worksheet.cell(row + 1, 11).string(item.GENDER ? item.GENDER : "").style(style);
            worksheet.cell(row + 1, 12).string().style(style);
            worksheet.cell(row + 1, 13).string(item.REFERENCE_MATERIAL_ID ? item.REFERENCE_MATERIAL_ID : "").style(style);
            worksheet.cell(row + 1, 14).string(item.MATERIAL_ID ? item.MATERIAL_ID : "").style(style);
            worksheet.cell(row + 1, 15).string((item.PIECES_SOLD ? item.PIECES_SOLD : "")+" PZ").style(style);
            worksheet.cell(row + 1, 16).string((item.WHOLESALE_PRICE ? item.WHOLESALE_PRICE : "") + " "+ (item.UM_WHOLESALE_PRICE ? item.UM_WHOLESALE_PRICE : "")).style(style);
            worksheet.cell(row + 1, 17).string((item.RETAIL_FULL_PRICE ? item.RETAIL_FULL_PRICE : "")+ " "+ (item.CURRENCY ? item.CURRENCY : "")).style(style);
            worksheet.cell(row + 1, 18).string((item.SELL_OUT_PRICE ? item.SELL_OUT_PRICE : "")+ " "+ (item.CURRENCY ? item.CURRENCY : "")).style(style);
            worksheet.cell(row + 1, 19).string((item.DISCOUNT_APPLIED ? item.DISCOUNT_APPLIED: "")+ " "+ (item.CURRENCY ? item.CURRENCY : "")).style(style);
            worksheet.cell(row + 1, 20).string((item.DISCOUNT_PERCENTAGE ? item.DISCOUNT_PERCENTAGE : "")+" % ").style(style);
            worksheet.cell(row + 1, 21).string(item.BUSINESSPARTNERID ? item.BUSINESSPARTNERID : "").style(style);
            worksheet.cell(row + 1, 22).string(item.BUSINESSPARTNER ? item.BUSINESSPARTNER : "").style(style);
            worksheet.cell(row + 1, 23).string(item.BUSINESSPARTNEREMAIL ? item.BUSINESSPARTNEREMAIL : "").style(style);
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
        worksheet.column(18).setWidth(10);
        worksheet.column(19).setWidth(25);
        worksheet.column(20).setWidth(25);
        worksheet.column(21).setWidth(25);
        worksheet.column(22).setWidth(10);
        worksheet.column(23).setWidth(25);
        worksheet.column(23).setWidth(25);
      
       
       

        let rowPos = 1

        for (let i = 0; i < lineItems.length; i++) {
            
            rowPos += 1;

            const element = lineItems[i].IMAGE_URL;
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
                            col: 12,
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

