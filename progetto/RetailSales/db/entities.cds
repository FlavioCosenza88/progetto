@cds.persistence.exists 
@cds.persistence.calcview
@cds.query.limit: {default :50000, max:50000}
entity CV_RETAIL_SALES (IP_DATE_FROM : Date, IP_DATE_TO : Date) {
key     COMPANYID: String(5000)  @title: 'COMPANYID: COMPANY ID' ; 
key     COMPANY: String(25)  @title: 'COMPANY: COMPANY' ; 
key     DOCUMENTDATE: Date  @title: 'DOCUMENTDATE: DOCUMENT DATE' ; 
key     DOCUMENTTYPE: String(5000)  @title: 'DOCUMENTTYPE: DOCUMENT TYPE' ; 
key     DOCUMENTENTRY: String(5000)  @title: 'DOCUMENTENTRY: DOCUMENT ENTRY' ; 
key     STOREID: String(5000)  @title: 'STOREID: STORE ID' ; 
key     STORE: String(25)  @title: 'STORE: STORE' ; 
key     REFERENCE_MATERIAL_ID: String(40)  @title: 'REFERENCE_MATERIAL_ID: REFERENCE MATERIAL_ID' ; 
key     REFERENCE_MATERIAL: String(40)  @title: 'REFERENCE_MATERIAL: REFERENCE MATERIAL' ; 
key     MATERIAL_ID: String(5000)  @title: 'MATERIAL_ID: MATERIAL ID' ; 
key     MATERIAL: String(40)  @title: 'MATERIAL: MATERIAL' ; 
key     SKU_SEASON: String(5000)  @title: 'SKU_SEASON: SEASON' ; 
key     BRAND_ID: String(4)  @title: 'BRAND_ID: BRAND ID' ; 
key     BRAND: String(30)  @title: 'BRAND: BRAND' ; 
key     FAMILY_ID: String(3)  @title: 'FAMILY_ID: FAMILY ID' ; 
key     FAMILY: String(30)  @title: 'FAMILY: FAMILY' ; 
key     GENDER: String(18)  @title: 'GENDER: GENDER' ; 
key     IMAGE_URL: String(5000)  @title: 'IMAGE_URL: IMAGE URL' ; 
key     BUSINESSPARTNERID: String(5000)  @title: 'BUSINESSPARTNERID: BUSINESS PARTNER ID' ; 
key     BUSINESSPARTNER: String(5000)  @title: 'BUSINESSPARTNER: BUSINESS PARTNER' ; 
key     BUSINESSPARTNEREMAIL: String(5000)  @title: 'BUSINESSPARTNEREMAIL: BUSINESS PARTNER EMAIL' ; 
key     DOCUMENTPOSSALESPERSONID: String(5000)  @title: 'DOCUMENTPOSSALESPERSONID: DOCUMENT SALES PERSON ID' ; 
        PIECES_SOLD: Integer64  @title: 'PIECES_SOLD: PIECES SOLD' ; 
        WHOLESALE_PRICE: Decimal(11)  @title: 'WHOLESALE_PRICE: WHOLESALE PRICE' ; 
key     UM_WHOLESALE_PRICE: String(5)  @title: 'UM_WHOLESALE_PRICE: UM WHOLESALE PRICE' ; 
        RETAIL_FULL_PRICE: Decimal(13)  @title: 'RETAIL_FULL_PRICE: RETAIL FULL PRICE' ; 
        SELL_OUT_PRICE: Decimal(13)  @title: 'SELL_OUT_PRICE: SELL OUT PRICE' ; 
        DISCOUNT_APPLIED: Decimal(11)  @title: 'DISCOUNT_APPLIED: DISCOUNT_APPLIED' ; 
        DISCOUNT_PERCENTAGE: Decimal(11)  @title: 'DISCOUNT_PERCENTAGE: DISCOUNT PERCENTAGE' ; 
key     CURRENCY: String(5000)  @title: 'CURRENCY: CURRENCY' ; 
key     DOCUMENTPOSSALESPERSON: String(5000)  @title: 'DOCUMENTPOSSALESPERSON: DOCUMENT SALES PERSON' ;
key     DOCUMENTDATESTRING: String(10)  @title: 'DOCUMENTDATESTRING: DOCUMENT DATE STRING' ; 
}