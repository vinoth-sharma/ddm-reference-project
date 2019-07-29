import { environment } from 'src/environments/environment';


export const report_creation = `${environment.baseUrl}reports/report_creation/`
export const get_report_list = `${environment.baseUrl}reports/get_report_list?`
export const get_report_sheet_data = `${environment.baseUrl}reports/get_report_sheet_data`
export const uploadFile = `${environment.baseUrl}reports/upload_sheet_to_ecs/`
export const deleteReportOrSheet = `${environment.baseUrl}reports/delete_report_or_sheet/`
export const renameSheet = `${environment.baseUrl}reports/rename_report_sheet`