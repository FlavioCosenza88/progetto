using T_RECEIPTS_INVOICES_CCO from '../db/RECEIPTS_INVOICES_CCO';
using T_STORE_EMAIL from '../db/StoreEmail';

using CV_RETAIL_SALES from '../db/entities';

service RetailSalesService{

    entity ReceiptsInvoicesCCO as projection on T_RECEIPTS_INVOICES_CCO;

    entity StoreEmail as projection on T_STORE_EMAIL;
    
    entity RetailSales(InDateFrom : Date, InDateTo : Date) as select from CV_RETAIL_SALES(IP_DATE_FROM : :InDateFrom , IP_DATE_TO : :InDateTo) {*} ;
    
}