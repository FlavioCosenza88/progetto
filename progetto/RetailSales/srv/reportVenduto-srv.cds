using 
    CV_REPORT_VENDUTO_PER_CANALE
 from '../db/reportVendutoEntities';

service VendutoPerCanaleServices {
    entity VendutoPerCanale as projection on CV_REPORT_VENDUTO_PER_CANALE;
}
