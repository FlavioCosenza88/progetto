using {managed} from '@sap/cds/common';

entity T_RECEIPTS_INVOICES_CCO : managed {
    key CashDeskID                                 : String;
    key CompanyID                                  : String;
        StoreID                                    : String;
        BusinessPartnerID                          : String;
        BusinessPartnerFirstName                   : String;
        BusinessPartnerLastName                    : String;
        BusinessPartnerCategory                    : String;
        BusinessPartnerFidelity                    : String;
        BusinessPartnerEMail                       : String;
    key DocumentEntry                              : String;
        DocumentType                               : String;
        DocumentDate                               : Date;
        DocumentSalesPersonId                      : String;
    key DocumentPosNr                              : String;
        DocumentPosSkuSeason                       : String;
        DocumentPosItemCode                        : String;
        DocumentPosBarcode                         : String;
        DocumentPosVatCode                         : String;
        DocumentPosQuantity                        : String;
        DocumentPosPaymentGrossAfterHeaderDiscount : Decimal(13, 2);
        DocumentPosPaymentGrossAmount              : Decimal(13, 2);
        DocumentPosSalesPersonId                   : String;
        DocumentPosDiscounts                       : String;
        PaymentsCurrency                           : String;
        PaymentsTypesCode                          : String;
        PaymentsTypesValue                         : Decimal(13, 2);
};

entity T_SALES_AGENT : managed {
    key ID_CCO         : String;
        NOME           : String;
        COGNOME        : String;
        SALES_AGENT_ID : String;
}
