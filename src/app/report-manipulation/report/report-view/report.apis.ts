import { environment } from 'src/environments/environment';

// method - GET/POST
export const report_creation = `${environment.baseUrl}reports/report_creation/`
//method - GET
export const get_report_list = `${environment.baseUrl}reports/get_report_list/`
// export const get_report_list = `assets/report.json`
//method - GET
// export const get_report_sheet_data = `${environment.baseUrl}reports/get_report_sheet_data`
export const get_report_sheet_data = `https://ddm1.apps.pcfepg2wi.gm.com/reports/get_report_sheet_data`
//method - POST
// export const uploadFile = `${environment.baseUrl}reports/upload_sheet_to_ecs/`
export const uploadFile = `https://ddm1.apps.pcfepg2wi.gm.com/reports/upload_sheet_to_ecs/`
//method - DELETE
export const deleteReportOrSheet = `${environment.baseUrl}reports/delete_report_or_sheet/`
//method - PUT
export const renameSheet = `${environment.baseUrl}reports/rename_report_sheet`;
//method - POST
export const downloadReportFileApi = `${environment.baseUrl}reports/export_excel/`;
//method put
export const save_page_json_api = `${environment.baseUrl}reports/save_page_json/`;