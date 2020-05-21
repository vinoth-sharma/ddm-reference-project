// migrated by Bharath.s
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {
  constructor(private httpClient: HttpClient) { }

  public defaultUploadMessage: string = 'Please upload a file of CSV/WORD/EXCEL format!';

  // ###############################################################################//
  // <--                             GET Methods                             -->   //
  // ###############################################################################//

  public getLookupValues() {
    return this.httpClient.get(`${environment.baseUrl}RMP/lookup_table_data`);
  }

  // http://localhost:8000/RMP/getldap_emailids/?user_to_search=ASD
  public getDistributionList(user): Observable<any> {
    // let url = "https://ddm-dev-temp.apps.pcfepg3mi.gm.com/"

    return this.httpClient.get(`${environment.baseUrl}RMP/getldap_emailids/?user_to_search=` + user).pipe(
      map(res => {
        if (res['data']) {
          return res['data'].filter(v => v.toLowerCase().indexOf(user.toLowerCase()) > -1)
        } else {
          return [];
        }
      }), catchError(error => {
        return [];
      }));
  }

  public getNewData() {
    return this.httpClient.get(`${environment.baseUrl}RMP/lookup_data`);
  }

  public division_selected() {
    return this.httpClient.get(`${environment.baseUrl}RMP/user_selection/`)
  }

  public get_report_details(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_detail/`, {
      params: {
        report_id: report_id
      }
    })
  }

  public list_of_reports(obj) {
    return this.httpClient.get(`${environment.baseUrl}RMP/user_market_selection/`, {
      params: {
        sort_by: obj.sort_by,
        per_page: obj.per_page,
        page_no: obj.page_no
      }

    })
  }

  public get_report_description(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_description/`, {
      params: {
        report_id: report_id,
      }
    })
  }

  public get_report_comments(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/report_comments/?report_id=` + report_id)
  }

  public get_report_list() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_list/`)
  }

  public get_report_matrix() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_matrix/`)
  }

  public get_admin_notes() {
    return this.httpClient.get(`${environment.baseUrl}RMP/admin_notes/`)
  }

  public get_bac_data() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_bac_data/`)
  }

  public get_notifications() {
    return this.httpClient.get(`${environment.baseUrl}RMP/read_comments/`)
  }

  public get_report_id(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_id/?request_id=` + report_id)
  }

  public get_report_file(request, report_list) {
    let query_data = {
      request_id: request,
      report_list_id: report_list
    }
    return this.httpClient.post(`${environment.baseUrl}reports/export_excel/`, query_data)
  }

  public get_files() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_files/`)
  }

  public get_doc_link(file_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/upload_documents/?file_id=` + file_id)
  }

  public get_report_link(request_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/upload_documents/?request_id=` + request_id)
  }

  public getDoc(url) {
    return this.httpClient.get(url);
  }

  public getAllAdmins() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_all_admin/`)
  }

  // ###############################################################################//
  // <--                             POST Methods                             -->   //
  // ###############################################################################//

  public ddm_rmp_landing_page_desc_text_post(description_text) {
    return this.httpClient.post(`${environment.baseUrl}RMP/rmp_description_text/`, description_text)
  }

  public ddm_rmp_user_profile_market_selections(saved_settings) {
    return this.httpClient.post(`${environment.baseUrl}RMP/user_market_selection/`, saved_settings)
  }

  public ddm_rmp_reference_documents_post(document_object) {
    return this.httpClient.post(`${environment.baseUrl}RMP/reference_document/`, document_object)
  }

  public ddm_rmp_admin_documents_post(document_object) {
    return this.httpClient.post(`${environment.baseUrl}RMP/admin_document/`, document_object)
  }

  public ddm_rmp_dealer_allocation_post(dealer_allocation_for_report) {
    return this.httpClient.post(`${environment.baseUrl}RMP/dealer_allocation_report/`, dealer_allocation_for_report)
  }

  public ddm_rmp_frequency_update(freq) {
    return this.httpClient.put(`${environment.baseUrl}RMP/frequency_action/`, freq)
  }

  //File upload functionality
  public ddm_rmp_file_data(filedata) {
    return this.httpClient.post(`${environment.baseUrl}RMP/upload_documents/`, filedata)
  }


  public ddm_rmp_order_to_sales_post(order_to_sales_report) {
    return this.httpClient.post(`${environment.baseUrl}RMP/order_to_sales_report/`, order_to_sales_report)
  }

  public ddm_rmp_report_market_selection(report_market_selection) {
    return this.httpClient.post(`${environment.baseUrl}RMP/user_market_selection/`, report_market_selection)
  }

  public cancel_report(obj) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_status_cancel/`, obj)
  }

  public accept_report(obj) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_status_accept/`, obj)
  }

  public post_link(obj) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_status_postLink/`, obj)
  }

  public post_report_comments(comment_data) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_comments/`, comment_data)
  }

  public ddm_rmp_main_menu_description_text_post(content) {
    return this.httpClient.post(`${environment.baseUrl}RMP/main_menu_description_text/`, content)
  }

  public ddm_rmp_favourite(obj) {
    return this.httpClient.put(`${environment.baseUrl}RMP/add_to_favorite/`, obj)
  }

  public ddm_rmp_admin_notes(admin_notes) {
    return this.httpClient.post(`${environment.baseUrl}RMP/admin_notes/`, admin_notes)
  }

  public assign_owner_post(assign) {
    return this.httpClient.post(`${environment.baseUrl}RMP/request_action/`, assign)
  }

  // ###############################################################################//
  // <--                             PUT Methods                             -->   //
  // ###############################################################################//

  public user_info_save_setting(user_settings) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_info_save_setting/`, user_settings)
  }

  public report_distribution_list(dist_list) {
    return this.httpClient.put(`${environment.baseUrl}RMP/dl_list_action/`, dist_list)
  }

  public user_info_disclaimer(user_settings) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_info_disclaimer/`, user_settings)
  }

  public ddm_rmp_user_market_selections_post_data(user_market_selection) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_selection/`, user_market_selection)
  }

  public ddm_rmp_landing_page_desc_text_put(description_texts) {
    return this.httpClient.put(`${environment.baseUrl}RMP/rmp_description_text/`, description_texts)
  }

  public ddm_rmp_reference_documents_put(document_object) {
    return this.httpClient.put(`${environment.baseUrl}RMP/reference_document/`, document_object);
  }

  public ddm_rmp_admin_documents_put(document_object) {
    return this.httpClient.put(`${environment.baseUrl}RMP/admin_document/`, document_object);
  }

  public ddm_rmp_main_menu_description_text_put(content) {
    return this.httpClient.put(`${environment.baseUrl}RMP/main_menu_description_text/`, content)
  }

  public text_notifications_put(contact) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_info_contact/`, contact)
  }

  public update_comment_flags(report_info) {
    return this.httpClient.put(`${environment.baseUrl}RMP/read_comments/`, report_info)
  }

  public ddm_rmp_tbd_req_put(tbd) {
    return this.httpClient.put(`${environment.baseUrl}RMP/request_action/`, tbd)
  }

  public ddm_rmp_assign_to(assign) {
    return this.httpClient.put(`${environment.baseUrl}RMP/owner_assign/`, assign)
  }

  public add_link_to_url(assign) {
    return this.httpClient.put(`${environment.baseUrl}RMP/update_link_to_results_or_status/`, assign)
  }

  public update_report_status(assign) {
    return this.httpClient.put(`${environment.baseUrl}RMP/update_link_to_results_or_status/`, assign)
  }


  // ###############################################################################//
  // <--                             DELETE Methods                             --> //
  // ###############################################################################//

  public ddm_rmp_reference_documents_delete(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/reference_document/?ddm_rmp_desc_text_reference_documents_id=` + id)
  }

  public delete_upload_doc(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/upload_documents/?file_id=` + id)
  }

  public ddm_rmp_admin_documents_delete(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/admin_document/?ddm_rmp_desc_text_admin_documents_id=` + id)
  }

  public ddm_rmp_main_menu_description_text_delete(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/main_menu_description_text/?ddm_rmp_main_menu_description_text_id=` + id)
  }

  public update_rmpReports_DDMName(changedNameObject) {
    return this.httpClient.put(`${environment.baseUrl}RMP/update_ddm_name/`, changedNameObject)
  }
}

