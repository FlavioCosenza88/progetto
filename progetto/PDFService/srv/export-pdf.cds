@protocol: 'rest'
service ExportPDFService {
     @open
    type object {};
    action   format_PDF(results :  object  ) returns String;
   
}