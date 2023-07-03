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

    this.on('format_excelAggregato', async (req) => {
        console.log("dentro")
        let lineItems = req.data.lineItems
        console.log(lineItems)
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
       const header = ['SEASON ACQUISTO',
       'SEASON VENDITA UNO',
       'SEASON VENDITA DUE',
       'BRAND',
       'GENDER',
       'FAMILY GROUP',
       'VALUTA ',
       'TOT QTY ORDERED (PZ)',
       'TOT VALUE ORDERED',
       'QTY ORDERED WHOLESALE',
       'VALUE ORDERED WHOLESALE',
       'QTY ORDERED NO WHOLESALE',
       'VALUE ORDERED NO WHOLESALE',
       'TOT QTY RECEIVED (PZ)',
       'TOT VALUE RECEIVED',
       'QTY RECEIVED (PZ) WHOLESALE',
       'VALUE RECEIVED WHOLESALE',
       'QTY RECEIVED NO WHOLESALE',
       ' VALUE RECEIVED NO WHOLESALE',
       'QTY UM (PZ) WHOLESALE',
       'VALUE UM WHOLESALE',
       'QTY UM (PZ) FARFETCH STAGIONE UNO',
       'VALUE UM FARFETCH STAGIONE UNO',
       'QTY UM (PZ) FARFETCH STAGIONE DUE',
       'VALUE UM FARFETCH STAGIONE DUE',
       'QTY UM (PZ) MODES.COM STAGIONE UNO',
       ' VALUE UM MODES COM STAGIONE UNO',
       'QTY UM (PZ) MODES COM STAGIONE DUE',
       'VALUE UM MODES COM STAGIONE DUE',
       'QTY UM  (PZ) CONCIERGE STAGIONE UNO',
       'VALUE UM CONCIERGE STAGIONE UNO',
       'QTY UM (PZ) CONCIERGE STAGIONE DUE',
       'VALUE UM CONCIERGE STAGIONE DUE',
       'QTY UM (PZ) MARKETPLACE STAGIONE UNO',
       'VALUE UM MARKETPLACE STAGIONE UNO',
       'QTY UM (PZ) MARKETPLACE STAGIONE DUE',
       'VALUE UM MARKETPLACE STAGIONE DUE',
       'QTY UM (PZ) LISTE STAGIONE UNO',
       'VALUE UM LISTE STAGIONE UNO',
       'QTY UM (PZ) LISTE STAGIONE DUE',
       'VALUE UM LISTE STAGIONE DUE',
       'QTY UM RETAIL STAGIONE UNO',
       'VALUE UM RETAIL STAGIONE UNO',
       'QTY UM RETAIL STAGIONE DUE',
       'VALUE UM RETAIL STAGIONE DUE',
       'TOT QTY UM (PZ) STAGIONE UNO',
       'TOT VALUE UM STAGIONE UNO',
       'TOT QTY UM (PZ) STAGIONE DUE',
       'TOT VALUE UM STAGIONE DUE',
       'SELL-THROUGH SU QTY ORDERED WH % (STAGIONE ODA/ODV)',
       'SELL-THROUGH SU QTY RECEIVED WH % (STAGIONE ODA/ODV)',
       'SELL-THROUGH SU VALUE ORDERED WH % (STAGIONE ODA/ODV)',
       'SELL-THROUGH SU VALUE RECEIVED WH % (STAGIONE ODA/ODV)',
       'SELL-THROUGH SU QTY ORDERED NO WH % STAGIONE UNO',
       'SELL-THROUGH SU QTY RECEIVED NO WH % STAGIONE UNO',
       'SELL-THROUGH SU VALUE ORDERED NO WH % STAGIONE UNO',
       'SELL-THROUGH SU VALUE RECEIVED NO WH % STAGIONE UNO',
       'SELL-THROUGH SU QTY ORDERED NO WH % STAGIONE DUE',
       'SELL-THROUGH SU QTY RECEIVED NO WH % STAGIONE DUE',
       'SELL-THROUGH SU VALUE ORDERED NO WH % STAGIONE DUE',
       'SELL-THROUGH SU VALUE RECEIVED NO WH % STAGIONE DUE']; for (let i = 0; i < header.length; i++) {
            const element = header[i];
            worksheet.cell(1, i + 1).string(element).style(headerStyle);
        }

        // Definizione della colonna "Quantità_per_taglia" con il comportamento speciale
        let rowQT = 2;
        let row = 1;
        let rows=0;
        
        rows=lineItems.length;
        
        for (let i = 0; i < lineItems.length; i++) {
           
            const item = lineItems[i];
            console.log(item)

            

            // Write taglia and quantità data for each item
            let col = header.length;
            //let disponibilitaTotale = 0
            //worksheet.cell(rowQT - 2, col).string("Taglia").style({ font: { name: 'Calibri', bold: true, color: '#FFFFFF' }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { type: 'pattern', patternType: 'solid', fgColor: '#043E50' } });
            //worksheet.cell(rowQT - 2, col).string("DISPONIBILITA'").style({ font: { bold: true }, border: { bottom: { style: 'thin', color: { argb: 'FF000000' } }, left: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } } });
            //worksheet.cell(rowQT - 1, col).string("ORDINATO").style(lowerBorderStyle);
           

            // Write other data for each item
            worksheet.cell(row + 1, 1).string(item.SEASON_ACQUISTO ? item.SEASON_ACQUISTO : "").style(style);
            worksheet.cell(row + 1, 2).string(item.SEASON_VENDITA_S1 ? item.SEASON_VENDITA_S1 : "").style(style);
            worksheet.cell(row + 1, 3).string(item.SEASON_VENDITA_S2 ? item.SEASON_VENDITA_S2 : "").style(style);
            worksheet.cell(row + 1, 4).string(item.BRAND ? item.BRAND : "").style(style);
            worksheet.cell(row + 1, 5).string(item.GENDER ? item.GENDER : "" ).style(style);
            worksheet.cell(row + 1, 6).string(item.FAMILY_GROUP ? item.FAMILY_GROUP : "").style(style);
            worksheet.cell(row + 1, 7).string((item.VALUTA_VALUE_ORDERED_WHOLESALE_UN ? item.VALUTA_VALUE_ORDERED_WHOLESALE_UN : "")).style(style);
            worksheet.cell(row + 1, 8).number(item.TOT_QTY_ORDERED).style(style);
            worksheet.cell(row + 1, 9).string(item.CC_TOT_VALUE_ORDERED ? item.CC_TOT_VALUE_ORDERED : "").style(style);
            worksheet.cell(row + 1, 10).number(item.QTY_ORDERED_WHOLESALE).style(style);
            worksheet.cell(row + 1, 11).string(item.CC_VALUE_ORDERED_WHOLESALE ? item.CC_VALUE_ORDERED_WHOLESALE : "").style(style);
            worksheet.cell(row + 1, 12).number(item.CC_QTY_ORDERED_NO_WHOLESALE).style(style);
            worksheet.cell(row + 1, 13).string(item.CC_VALUE_ORDERED_NO_WHOLESALE ? item.CC_VALUE_ORDERED_NO_WHOLESALE: "").style(style);
            worksheet.cell(row + 1, 14).number(item.TOT_QTY_RECEIVED).style(style);
            worksheet.cell(row + 1, 15).string(item.CC_TOT_VALUE_RECEIVED ? item.CC_TOT_VALUE_RECEIVED : "").style(style);
            worksheet.cell(row + 1, 16).number(item.QTY_RECEIVED_WHOLESALE).style(style);
            worksheet.cell(row + 1, 17).string(item.CC_VALUE_RECEIVED_WHOLESALE ? item.CC_VALUE_RECEIVED_WHOLESALE : "").style(style);
            worksheet.cell(row + 1, 18).number(item.CC_QTY_RECEIVED_NO_WHOLESALE).style(style);
            worksheet.cell(row + 1, 19).string(item.CC_VALUE_RECEIVED_NO_WHOLESALE ? item.CC_VALUE_RECEIVED_NO_WHOLESALE : "").style(style);
            worksheet.cell(row + 1, 20).number(item.QTY_UM_WHOLESALE).style(style);
            worksheet.cell(row + 1, 21).string((item.CC_VALUE_UM_WHOLESALE ? item.CC_VALUE_UM_WHOLESALE : "")).style(style);
            worksheet.cell(row + 1, 22).number(item.QTY_UM_FARFETCH_S1).style(style);
            worksheet.cell(row + 1, 23).string(item.CC_VALUE_UM_FARFETCH_S1 ? item.CC_VALUE_UM_FARFETCH_S1 : "").style(style);
            worksheet.cell(row + 1, 24).number((item.QTY_UM_FARFETCH_S2)).style(style);
            worksheet.cell(row + 1, 25).string((item.CC_VALUE_UM_FARFETCH_S2 ? item.CC_VALUE_UM_FARFETCH_S2 : "")).style(style);
            worksheet.cell(row + 1, 26).number(item.QTY_UM_MODES_COM_S1).style(style);
            worksheet.cell(row + 1, 27).string(item.CC_VALUE_UM_MODES_COM_S1 ? item.CC_VALUE_UM_MODES_COM_S1 : "").style(style);
            worksheet.cell(row + 1, 28).number((item.QTY_UM_MODES_COM_S2)).style(style);
            worksheet.cell(row + 1, 29).string((item.CC_VALUE_UM_MODES_COM_S2 ? item.CC_VALUE_UM_MODES_COM_S2 : "")).style(style);
            worksheet.cell(row + 1, 30).number(item.QTY_UM_CONCIERGE_S1).style(style);
            worksheet.cell(row + 1, 31).string(item.CC_VALUE_UM_CONCIERGE_S1 ? item.CC_VALUE_UM_CONCIERGE_S1 : "").style(style);
            worksheet.cell(row + 1, 32).number(item.QTY_UM_CONCIERGE_S2).style(style);
            worksheet.cell(row + 1, 33).string(item.CC_VALUE_UM_CONCIERGE_S2 ? item.CC_VALUE_UM_CONCIERGE_S2 : "").style(style);
            worksheet.cell(row + 1, 34).number(item.QTY_UM_MARKETPLACE_S1).style(style);
            worksheet.cell(row + 1, 35).string(item.CC_VALUE_UM_MARKETPLACE_S1 ? item.CC_VALUE_UM_MARKETPLACE_S1 : "").style(style);
            worksheet.cell(row + 1, 36).number(item.QTY_UM_MARKETPLACE_S2).style(style);
            worksheet.cell(row + 1, 37).string(item.CC_VALUE_UM_MARKETPLACE_S2 ? item.CC_VALUE_UM_MARKETPLACE_S2 : "").style(style);
            worksheet.cell(row + 1, 38).number(item.QTY_UM_LISTE_S1).style(style);
            worksheet.cell(row + 1, 39).number(item.QTY_UM_LISTE_S2).style(style);
            worksheet.cell(row + 1, 40).string(item.CC_VALUE_UM_LISTE_S1 ? item.CC_VALUE_UM_LISTE_S1 : "").style(style);
            worksheet.cell(row + 1, 41).string(item.CC_VALUE_UM_LISTE_S2 ? item.CC_VALUE_UM_LISTE_S2 : "").style(style);
            worksheet.cell(row + 1, 42).number(item.QTY_UM_RETAIL_S1).style(style);
            worksheet.cell(row + 1, 43).string((item.CC_VALUE_UM_RETAIL_S1 ? item.CC_VALUE_UM_RETAIL_S1 : "")).style(style);
            worksheet.cell(row + 1, 44).number((item.QTY_UM_RETAIL_S2)).style(style);
            worksheet.cell(row + 1, 45).string(item.CC_VALUE_UM_RETAIL_S2 ? item.CC_VALUE_UM_RETAIL_S2 : "" ).style(style);
            worksheet.cell(row + 1, 46).number(item.CC_TOT_QTY_UM_S1 ).style(style);
            worksheet.cell(row + 1, 47).string(item.CC_TOT_VALUE_UM_S1 ? item.CC_TOT_VALUE_UM_S1 : "").style(style);
            worksheet.cell(row + 1, 48).number(item.CC_TOT_QTY_UM_S2 ).style(style);
            worksheet.cell(row + 1, 49).string(item.CC_TOT_VALUE_UM_S2 ? item.CC_TOT_VALUE_UM_S2 : "").style(style);
            worksheet.cell(row + 1, 50).string(item.CC_SELLTHROUGH_QTY_ORDERED_WH ? item.CC_SELLTHROUGH_QTY_ORDERED_WH : "").style(style);
            worksheet.cell(row + 1, 51).string(item.CC_SELLTHROUGH_QTY_RECEIVED_WH ? item.CC_SELLTHROUGH_QTY_RECEIVED_WH : "").style(style);
            worksheet.cell(row + 1, 52).string(item.CC_SELLTHROUGH_VALUE_ORDERED_WH ? item.CC_SELLTHROUGH_VALUE_ORDERED_WH : "").style(style);
            worksheet.cell(row + 1, 53).string((item.CC_SELLTHROUGH_VALUE_RECEIVED_WH ? item.CC_SELLTHROUGH_VALUE_RECEIVED_WH : "")).style(style);
            worksheet.cell(row + 1, 54).string((item.CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S1 ? item.CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S1 : "") ).style(style);
            worksheet.cell(row + 1, 55).string((item.CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S1 ? item.CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S1 : "")).style(style);
            worksheet.cell(row + 1, 56).string((item.CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S1 ? item.CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S1 : "")).style(style);
            worksheet.cell(row + 1, 57).string((item.CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S1 ? item.CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S1: "")).style(style);
            worksheet.cell(row + 1, 58).string((item.CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S2 ? item.CC_SELLTHROUGH_QTY_ORDERED_NO_WH_S2 : "")).style(style);
            worksheet.cell(row + 1, 59).string(item.CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S2 ? item.CC_SELLTHROUGH_QTY_RECEIVED_NO_WH_S2 : "").style(style);
            worksheet.cell(row + 1, 60).string(item.CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S2 ? item.CC_SELLTHROUGH_VALUE_ORDERED_NO_WH_S2 : "").style(style);
            worksheet.cell(row + 1, 61).string(item.CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S2 ? item.CC_SELLTHROUGH_VALUE_RECEIVED_NO_WH_S2 : "").style(style);
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
        worksheet.column(24).setWidth(20);
        worksheet.column(25).setWidth(25);
        worksheet.column(26).setWidth(15);
        worksheet.column(27).setWidth(25);
        worksheet.column(28).setWidth(25);
        worksheet.column(29).setWidth(25);
        worksheet.column(30).setWidth(10);
        worksheet.column(31).setWidth(25);
        worksheet.column(32).setWidth(25);
        worksheet.column(33).setWidth(15);
        worksheet.column(34).setWidth(20);
        worksheet.column(35).setWidth(25);
        worksheet.column(36).setWidth(15);
        worksheet.column(37).setWidth(25);
        worksheet.column(38).setWidth(25);
        worksheet.column(39).setWidth(25);
        worksheet.column(40).setWidth(10);
        worksheet.column(41).setWidth(25);
        worksheet.column(42).setWidth(25);
        worksheet.column(43).setWidth(25);
        worksheet.column(44).setWidth(10);
        worksheet.column(45).setWidth(25);
        worksheet.column(46).setWidth(25);
        worksheet.column(47).setWidth(20);
        worksheet.column(48).setWidth(25);
        worksheet.column(49).setWidth(15);
        worksheet.column(50).setWidth(25);
        worksheet.column(51).setWidth(25);
        worksheet.column(52).setWidth(25);
        worksheet.column(53).setWidth(10);
        worksheet.column(54).setWidth(25);
        worksheet.column(55).setWidth(25);
        worksheet.column(56).setWidth(15);
        worksheet.column(57).setWidth(20);
        worksheet.column(58).setWidth(25);
        worksheet.column(59).setWidth(15);
        worksheet.column(60).setWidth(25);
        worksheet.column(61).setWidth(25);
        
       
     
      
       
       

        let rowPos = 1
        // Salvataggio del file Excel
        const buffer = await workbook.writeToBuffer();
        const fileExcel = buffer.toString('base64');
    
        return fileExcel;
    })
})

