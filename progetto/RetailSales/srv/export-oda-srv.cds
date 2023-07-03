service ExportOdaService {
    action   format_excel(lineItems : many LineItem) returns String;
    function getCSRFToken()                          returns String;

    // type LineItem {
    //     immagine: String;
    //     sku :      String;
    //     quantita_e_taglie : many quantita_e_taglie;
    //     brand: String;
    //     prodotto: String;
    //     colore: String;
    //     categoria: String;
    //     composizione: String;
    //     stagione: String;
    //     genere: String;
    //     madeIn: String;
    //     prezzo_vendita: String;
    //     prezzo_costo: String;
    // }
    type LineItem {
        BRAND:      String;
        BRAND_ID:      String;
        BUSINESSPARTNER:      String;
        BUSINESSPARTNEREMAIL:      String;
        BUSINESSPARTNERID:      String;
        DOCUMENTPOSSALESPERSONID:   String;
        DOCUMENTPOSSALESPERSON :    String;
        DOCUMENTDATESTRING :    String;
        COMPANY:      String;
        COMPANYID:      String;
        CURRENCY:      String;
        DISCOUNT_APPLIED:      String;
        DISCOUNT_PERCENTAGE:      String;
        DOCUMENTDATE:     String;
        DOCUMENTENTRY:      String;
        DOCUMENTTYPE:      String;
        FAMILY:      String;
        FAMILY_ID:      String;
        GENDER:      String;
        IMAGE_URL:      String;
        MATERIAL:      String;
        MATERIAL_ID:      String;
        PIECES_SOLD:      String;
        REFERENCE_MATERIAL:      String;
        REFERENCE_MATERIAL_ID:      String;
        RETAIL_FULL_PRICE:      String;
        SELL_OUT_PRICE:      String;
        SKU_SEASON:         String;
        STORE:          String;
        STOREID:        String;
        UM_WHOLESALE_PRICE:   String;
        WHOLESALE_PRICE:     String;
    }
}