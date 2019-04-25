import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DjangoService {

  API_URL = 'http://localhost:8081'
  constructor(private httpClient : HttpClient) { }


  // ###############################################################################//
  // <--                             GET Methods                             -->   //
  // ###############################################################################//

  getLookupValues(){
    return this.httpClient.get('http://localhost:8000/RMP/lookup_table_data')
  }

  getNewData(){
    return this.httpClient.get('http://localhost:8000/RMP/lookup_data')
  }

  division_selected(user_id){
    return this.httpClient.get("http://localhost:8000/RMP/user_selection/?ddm_rmp_user_info_id="+user_id)
  }

  get_report_details(user_id, report_id){
    return this.httpClient.get("http://localhost:8000/RMP/get_report_detail/",{
      params:{
        user_info_id : user_id,
        report_id : report_id
      }
    })
  }

  list_of_reports(obj){
    return this.httpClient.get("http://localhost:8000/RMP/user_market_selection/",{
      params:{
        user_info_id : obj.user_info_id,
        sort_by : obj.sort_by,
        per_page: obj.per_page,
        page_no :obj.page_no
      }

    })
  }

  get_report_description(report_id){
    return this.httpClient.get("http://localhost:8000/RMP/get_report_description/?report_id="+report_id)
  }

  get_report_comments(report_id){
    return this.httpClient.get("http://localhost:8000/RMP/report_comments/?report_id="+report_id)
  }

  get_report_list(){
    return this.httpClient.get("http://localhost:8000/RMP/get_report_list/")
  }

  get_report_matrix(){
    return this.httpClient.get("http://localhost:8000/RMP/get_report_matrix/")
  }

  // ###############################################################################//
  // <--                             POST Methods                             -->   //
  // ###############################################################################//

  ddm_rmp_landing_page_desc_text_post(description_text){
    return this.httpClient.post('http://localhost:8000/RMP/rmp_description_text/',description_text)
  }

  ddm_rmp_user_profile_market_selections(saved_settings) {
    return this.httpClient.post("http://localhost:8000/RMP/user_market_selection/", saved_settings)
  }

  ddm_rmp_reference_documents_post(document_object){
    return this.httpClient.post("http://localhost:8000/RMP/reference_document/",document_object)
  }

  ddm_rmp_admin_documents_post(document_object){
    return this.httpClient.post("http://localhost:8000/RMP/admin_document/",document_object)
  }

  ddm_rmp_dealer_allocation_post(dealer_allocation_for_report){
    return this.httpClient.post("http://localhost:8000/RMP/dealer_allocation_report/",dealer_allocation_for_report)
  }

//File upload functionality
  ddm_rmp_file_data(filedata){
    // console.log("FD :"+JSON.stringify(filedata));
      return this.httpClient.post("http://localhost:8000/RMP/upload_file/", filedata)
  }


  ddm_rmp_order_to_sales_post(order_to_sales_report){
    // console.log(order_to_sales_report)
    return this.httpClient.post("http://localhost:8000/RMP/order_to_sales_report/",order_to_sales_report)
  }

  ddm_rmp_report_market_selection(report_market_selection){
    return this.httpClient.post("http://localhost:8000/RMP/user_market_selection/",report_market_selection)
  }

  cancel_report(obj){
    return this.httpClient.post("http://localhost:8000/RMP/report_status_cancel/",obj)
  }

  accept_report(obj){
    return this.httpClient.post("http://localhost:8000/RMP/report_status_accept/",obj)
  }

  post_link(obj){
    return this.httpClient.post("http://localhost:8000/RMP/report_status_postLink/",obj)
  }

  post_report_comments(comment_data){
    return this.httpClient.post("http://localhost:8000/RMP/report_comments/",comment_data)
  }

  ddm_rmp_main_menu_description_text_post(content){
    return this.httpClient.post("http://localhost:8000/RMP/main_menu_description_text/",content)
  }


  // ###############################################################################//
  // <--                             PUT Methods                             -->   //
  // ###############################################################################//

  user_info_save_setting(user_settings){
    return this.httpClient.put("http://localhost:8000/RMP/user_info_save_setting/",user_settings)
  }

  user_info_disclaimer(user_settings){
    return this.httpClient.put("http://localhost:8000/RMP/user_info_disclaimer/",user_settings)
  }

  ddm_rmp_admin_notes(admin_notes) {
    return this.httpClient.put("http://localhost:8000/RMP/admin_notes/",admin_notes)
  }

  ddm_rmp_user_market_selections_post_data(user_market_selection){
    return this.httpClient.put("http://localhost:8000/RMP/user_selection/",user_market_selection)
  }

  ddm_rmp_landing_page_desc_text_put(description_texts){
    return this.httpClient.put('http://localhost:8000/RMP/rmp_description_text/',description_texts)
  }

  ddm_rmp_reference_documents_put(document_object){
    return this.httpClient.put("http://localhost:8000/RMP/reference_document/",document_object);
  }

  ddm_rmp_admin_documents_put(document_object){
    return this.httpClient.put("http://localhost:8000/RMP/admin_document/",document_object);
  }

  ddm_rmp_main_menu_description_text_put(content){
    return this.httpClient.put("http://localhost:8000/RMP/main_menu_description_text/",content)
  }

  text_notifications_put(contact){
    return this.httpClient.put("http://localhost:8000/RMP/user_info_contact/", contact)
  }


  // ###############################################################################//
  // <--                             DELETE Methods                             -->   //
  // ###############################################################################//

  ddm_rmp_reference_documents_delete(id){
    return this.httpClient.delete("http://localhost:8000/RMP/reference_document/?ddm_rmp_desc_text_reference_documents_id="+id)
  }

  ddm_rmp_admin_documents_delete(id){
    return this.httpClient.delete("http://localhost:8000/RMP/admin_document/?ddm_rmp_desc_text_admin_documents_id="+id)
  } 
  ddm_rmp_main_menu_description_text_delete(id){
    return this.httpClient.delete("http://localhost:8000/RMP/main_menu_description_text/?ddm_rmp_main_menu_description_text_id="+id)
  }
}
