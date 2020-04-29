// migrated by Bharath.s
import {map, catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {
  constructor(private httpClient: HttpClient) { }


  // ###############################################################################//
  // <--                             GET Methods                             -->   //
  // ###############################################################################//

  getLookupValues() {
    return this.httpClient.get(`${environment.baseUrl}RMP/lookup_table_data`);
  }

  getDistributionList(user): Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}reports/getldap_emailids/?user_to_search=` + user).pipe(
    map(res=>{
      console.log(res['data']);
      
      if(res['data']){
        return res['data'].filter(v => v.toLowerCase().indexOf(user.toLowerCase()) > -1)
      }
      else return [];
    }),catchError(error =>{
      return []
    }))
  }

  getNewData() {
    return this.httpClient.get(`${environment.baseUrl}RMP/lookup_data`);
  }

  division_selected() {
    return this.httpClient.get(`${environment.baseUrl}RMP/user_selection/`)
  }

  get_report_details(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_detail/`, {
      params: {
        report_id: report_id
      }
    })
  }

  list_of_reports(obj) {
    return this.httpClient.get(`${environment.baseUrl}RMP/user_market_selection/`, {
      params: {
        sort_by: obj.sort_by,
        per_page: obj.per_page,
        page_no: obj.page_no
      }

    })
  }

  get_report_description(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_description/`, {
      params: {
        report_id: report_id,
      }
    })
  }

  get_report_comments(report_id) {
    return this.httpClient.get(`${environment.baseUrl}RMP/report_comments/?report_id=` + report_id)
  }

  get_report_list() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_list/`)
  }

  get_report_matrix() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_matrix/`)
  }

  get_admin_notes(){
    return this.httpClient.get(`${environment.baseUrl}RMP/admin_notes/`)
  }

  get_bac_data(){
    return this.httpClient.get(`${environment.baseUrl}RMP/get_bac_data/`)
  }

  get_notifications(){
    return this.httpClient.get(`${environment.baseUrl}RMP/read_comments/`)
  }

  get_report_id(report_id){
    return this.httpClient.get(`${environment.baseUrl}RMP/get_report_id/?request_id=`+report_id)
  }

  get_report_file(request,report_list){
    let query_data = {
      request_id : request,
      report_list_id : report_list
    }
    return this.httpClient.post(`${environment.baseUrl}reports/export_excel/`,query_data)
  }

  get_files(){
    return this.httpClient.get(`${environment.baseUrl}RMP/get_files/`)
  }

  get_doc_link(file_id){
    return this.httpClient.get(`${environment.baseUrl}RMP/upload_documents/?file_id=`+file_id)
  }

  get_report_link(request_id){
    return this.httpClient.get(`${environment.baseUrl}RMP/upload_documents/?request_id=`+request_id)
  }

  getDoc(url){
    return this.httpClient.get(url);
  }

  getAllAdmins() {
    return this.httpClient.get(`${environment.baseUrl}RMP/get_all_admin/`)
  }

  // ###############################################################################//
  // <--                             POST Methods                             -->   //
  // ###############################################################################//

  ddm_rmp_landing_page_desc_text_post(description_text) {
    return this.httpClient.post(`${environment.baseUrl}RMP/rmp_description_text/`, description_text)
  }

  ddm_rmp_user_profile_market_selections(saved_settings) {
    return this.httpClient.post(`${environment.baseUrl}RMP/user_market_selection/`, saved_settings)
  }

  ddm_rmp_reference_documents_post(document_object) {
    return this.httpClient.post(`${environment.baseUrl}RMP/reference_document/`, document_object)
  }

  ddm_rmp_admin_documents_post(document_object) {
    return this.httpClient.post(`${environment.baseUrl}RMP/admin_document/`, document_object)
  }

  ddm_rmp_dealer_allocation_post(dealer_allocation_for_report) {
    return this.httpClient.post(`${environment.baseUrl}RMP/dealer_allocation_report/`, dealer_allocation_for_report)
  }

  ddm_rmp_frequency_update(freq){
    return this.httpClient.put(`${environment.baseUrl}RMP/frequency_action/`, freq)
  }

 

  //File upload functionality
  ddm_rmp_file_data(filedata) {
    return this.httpClient.post(`${environment.baseUrl}RMP/upload_documents/`, filedata)
  }


  ddm_rmp_order_to_sales_post(order_to_sales_report) {
    return this.httpClient.post(`${environment.baseUrl}RMP/order_to_sales_report/`, order_to_sales_report)
  }

  ddm_rmp_report_market_selection(report_market_selection) {
    return this.httpClient.post(`${environment.baseUrl}RMP/user_market_selection/`, report_market_selection)
  }

  cancel_report(obj) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_status_cancel/`, obj)
  }

  accept_report(obj) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_status_accept/`, obj)
  }

  post_link(obj) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_status_postLink/`, obj)
  }

  post_report_comments(comment_data) {
    return this.httpClient.post(`${environment.baseUrl}RMP/report_comments/`, comment_data)
  }

  ddm_rmp_main_menu_description_text_post(content) {
    return this.httpClient.post(`${environment.baseUrl}RMP/main_menu_description_text/`, content)
  }
  
  ddm_rmp_favourite(obj){
    return this.httpClient.put(`${environment.baseUrl}RMP/add_to_favorite/`, obj)
  }

  ddm_rmp_admin_notes(admin_notes) {
    return this.httpClient.post(`${environment.baseUrl}RMP/admin_notes/`, admin_notes)
  }

  assign_owner_post(assign){
    return this.httpClient.post(`${environment.baseUrl}RMP/request_action/`, assign)
  }

  // ###############################################################################//
  // <--                             PUT Methods                             -->   //
  // ###############################################################################//

  user_info_save_setting(user_settings) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_info_save_setting/`, user_settings)
  }

  report_distribution_list(dist_list) {
    console.log(dist_list)
    return this.httpClient.put(`${environment.baseUrl}RMP/dl_list_action/`, dist_list)
  }

  user_info_disclaimer(user_settings) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_info_disclaimer/`, user_settings)
  }

  ddm_rmp_user_market_selections_post_data(user_market_selection) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_selection/`, user_market_selection)
  }

  ddm_rmp_landing_page_desc_text_put(description_texts) {
    return this.httpClient.put(`${environment.baseUrl}RMP/rmp_description_text/`, description_texts)
  }

  ddm_rmp_reference_documents_put(document_object) {
    return this.httpClient.put(`${environment.baseUrl}RMP/reference_document/`, document_object);
  }

  ddm_rmp_admin_documents_put(document_object) {
    return this.httpClient.put(`${environment.baseUrl}RMP/admin_document/`, document_object);
  }

  ddm_rmp_main_menu_description_text_put(content) {
    return this.httpClient.put(`${environment.baseUrl}RMP/main_menu_description_text/`, content)
  }

  text_notifications_put(contact) {
    return this.httpClient.put(`${environment.baseUrl}RMP/user_info_contact/`, contact)
  }

  update_comment_flags(report_info){
    return this.httpClient.put(`${environment.baseUrl}RMP/read_comments/`,report_info)
  }

  ddm_rmp_tbd_req_put(tbd){
    return this.httpClient.put(`${environment.baseUrl}RMP/request_action/`, tbd)
  }

  ddm_rmp_assign_to(assign){
    return this.httpClient.put(`${environment.baseUrl}RMP/owner_assign/`, assign)
  }

  add_link_to_url(assign){
    return this.httpClient.put(`${environment.baseUrl}RMP/update_link_to_results_or_status/`, assign)
  }

  update_report_status(assign){
    return this.httpClient.put(`${environment.baseUrl}RMP/update_link_to_results_or_status/`, assign)
  }


  // ###############################################################################//
  // <--                             DELETE Methods                             --> //
  // ###############################################################################//

  ddm_rmp_reference_documents_delete(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/reference_document/?ddm_rmp_desc_text_reference_documents_id=` + id)
  }

  delete_upload_doc(id){
    return this.httpClient.delete(`${environment.baseUrl}RMP/upload_documents/?file_id=` +id)
  }

  ddm_rmp_admin_documents_delete(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/admin_document/?ddm_rmp_desc_text_admin_documents_id=` + id)
  }
  ddm_rmp_main_menu_description_text_delete(id) {
    return this.httpClient.delete(`${environment.baseUrl}RMP/main_menu_description_text/?ddm_rmp_main_menu_description_text_id=` + id)
  }
  update_rmpReports_DDMName(changedNameObject){
    return this.httpClient.put(`${environment.baseUrl}RMP/update_ddm_name/`,changedNameObject)
  }
}

