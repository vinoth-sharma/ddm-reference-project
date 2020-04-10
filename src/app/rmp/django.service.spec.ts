import { TestBed, async, getTestBed } from '@angular/core/testing';

import { DjangoService } from './django.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
// import { environment } from ".../../../environments/environment";

describe('DjangoService', () => {
  let injector: TestBed;
  let service : DjangoService;
  let httpMock : HttpTestingController;
  let data = {data:"data"}
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule],
    providers:[DjangoService]
  }));

  beforeEach(()=>{
    injector = getTestBed();
    service = injector.inject(DjangoService);
    httpMock = injector.inject(HttpTestingController);
  })

  afterEach(()=>{
    httpMock.verify();
  })

  it('should be created', () => {
    const service: DjangoService = TestBed.get(DjangoService);
    expect(service).toBeTruthy();
  });

  it('should get getLookupValues from the server',async(()=>{
   
    let serviceUrl = `${environment.baseUrl}RMP/lookup_table_data`
    service.getLookupValues().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should get NewData from the server',async(()=>{
    let serviceUrl = `${environment.baseUrl}RMP/lookup_data`
    service.getNewData().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should get division_selected from the server',async(()=>{
    let serviceUrl = `${environment.baseUrl}RMP/user_selection/`
    service.division_selected().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_details from the server',async(()=>{
    let serviceUrl = `${environment.baseUrl}RMP/get_report_detail/?report_id=1`;
    let rId = 1
    service.get_report_details(rId).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should get list_of_reports from the server',async(()=>{
    let serviceUrl = `${environment.baseUrl}RMP/user_market_selection/?sort_by=1&per_page=2&page_no=3`;
    let obj = {
      sort_by:1,
      per_page:2,
      page_no:3
    }
    service.list_of_reports(obj).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should get_report_description from the server',async(()=>{
    let serviceUrl = `${environment.baseUrl}RMP/get_report_description/?report_id=1`;
    let rId = 1
    service.get_report_description(rId).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_comments from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/report_comments/?report_id=` + report_id;
    service.get_report_comments(report_id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_list from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/get_report_list/`;
    service.get_report_list().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_matrix from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/get_report_matrix/`;
    service.get_report_matrix().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_admin_notes from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/admin_notes/`;
    service.get_admin_notes().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_bac_data from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/get_bac_data/`;
    service.get_bac_data().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_notifications from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/read_comments/`;
    service.get_notifications().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_id from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/get_report_id/?request_id=`+report_id
    service.get_report_id(report_id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_file from the server',async(()=>{
    let report_id = 1;
    let reportlist = [{key:"value"}]
    let serviceUrl = `${environment.baseUrl}reports/export_excel/`;
    service.get_report_file(report_id,reportlist).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('should  get_files from the server',async(()=>{
    let report_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/get_files/`
    service.get_files().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))


  it('should  get_doc_link from the server',async(()=>{
    let file_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/upload_documents/?file_id=`+file_id
    service.get_doc_link(file_id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  get_report_link from the server',async(()=>{
    let request_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/upload_documents/?request_id=`+request_id
    service.get_report_link(request_id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  getDoc from the server',async(()=>{
    let url = "abcd"
    service.getDoc(url).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('should  getAllAdmins from the server',async(()=>{
    let request_id = 1
    let serviceUrl = `${environment.baseUrl}RMP/get_all_admin/`
    service.getAllAdmins().subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  it('ddm_rmp_landing_page_desc_text_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/rmp_description_text/`
    service.ddm_rmp_landing_page_desc_text_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_user_profile_market_selections',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_market_selection/`
    service.ddm_rmp_user_profile_market_selections(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_reference_documents_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/reference_document/`
    service.ddm_rmp_reference_documents_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_admin_documents_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/admin_document/`
    service.ddm_rmp_admin_documents_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_dealer_allocation_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/dealer_allocation_report/`
    service.ddm_rmp_dealer_allocation_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  // it('ddm_rmp_frequency_update',async(()=>{
  //   let postData = {};
  //   let serviceUrl = `${environment.baseUrl}RMP/frequency_action/`
  //   service.ddm_rmp_frequency_update(postData).subscribe(res =>{
  //     expect(res).toEqual(data)
  //   })

  //   const req = httpMock.expectOne(serviceUrl);
  //   expect(req.request.method).toBe('POST');
  //   req.flush(data)
  // }))

  it('ddm_rmp_frequency_update',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/frequency_action/`
    service.ddm_rmp_frequency_update(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_file_data',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/upload_documents/`
    service.ddm_rmp_file_data(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_order_to_sales_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/order_to_sales_report/`
    service.ddm_rmp_order_to_sales_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_report_market_selection',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_market_selection/`
    service.ddm_rmp_report_market_selection(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_report_market_selection',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_market_selection/`
    service.ddm_rmp_report_market_selection(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('cancel_report',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/report_status_cancel/`
    service.cancel_report(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('accept_report',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/report_status_accept/`
    service.accept_report(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('post_link',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/report_status_postLink/`
    service.post_link(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('post_report_comments',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/report_comments/`
    service.post_report_comments(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('ddm_rmp_main_menu_description_text_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/main_menu_description_text/`
    service.ddm_rmp_main_menu_description_text_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))
  
  it('ddm_rmp_favourite',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/add_to_favorite/`
    service.ddm_rmp_favourite(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_admin_notes',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/admin_notes/`
    service.ddm_rmp_admin_notes(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('assign_owner_post',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/request_action/`
    service.assign_owner_post(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('POST');
    req.flush(data)
  }))

  it('user_info_save_setting',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_info_save_setting/`
    service.user_info_save_setting(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('report_distribution_list',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/dl_list_action/`
    service.report_distribution_list(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('user_info_disclaimer',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_info_disclaimer/`
    service.user_info_disclaimer(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_user_market_selections_post_data',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_selection/`
    service.ddm_rmp_user_market_selections_post_data(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_landing_page_desc_text_put',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/rmp_description_text/`
    service.ddm_rmp_landing_page_desc_text_put(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_reference_documents_put',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/reference_document/`
    service.ddm_rmp_reference_documents_put(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))
  
  it('ddm_rmp_admin_documents_put',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/admin_document/`
    service.ddm_rmp_admin_documents_put(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_main_menu_description_text_put',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/main_menu_description_text/`
    service.ddm_rmp_main_menu_description_text_put(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('text_notifications_put',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/user_info_contact/`
    service.text_notifications_put(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('update_comment_flags',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/read_comments/`
    service.update_comment_flags(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_tbd_req_put',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/request_action/`
    service.ddm_rmp_tbd_req_put(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_assign_to',async(()=>{
    let postData = {};
    let serviceUrl = `${environment.baseUrl}RMP/owner_assign/`
    service.ddm_rmp_assign_to(postData).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(data)
  }))

  it('ddm_rmp_reference_documents_delete',async(()=>{
    let id = {};
    let serviceUrl = `${environment.baseUrl}RMP/reference_document/?ddm_rmp_desc_text_reference_documents_id=` + id
    service.ddm_rmp_reference_documents_delete(id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(data)
  }))

  it('delete_upload_doc',async(()=>{
    let id = {};
    let serviceUrl = `${environment.baseUrl}RMP/upload_documents/?file_id=` +id
    service.delete_upload_doc(id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(data)
  }))

  it('ddm_rmp_admin_documents_delete',async(()=>{
    let id = {};
    let serviceUrl = `${environment.baseUrl}RMP/admin_document/?ddm_rmp_desc_text_admin_documents_id=` + id
    service.ddm_rmp_admin_documents_delete(id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(data)
  }))

  it('ddm_rmp_main_menu_description_text_delete',async(()=>{
    let id = {};
    let serviceUrl = `${environment.baseUrl}RMP/main_menu_description_text/?ddm_rmp_main_menu_description_text_id=` + id
    service.ddm_rmp_main_menu_description_text_delete(id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(data)
  }))

  it('metrics_aggregate',async(()=>{
    let id = {start_date:"1",end_date:"1",users_table_id:"2",role_id:"2"};
    let serviceUrl = `${environment.baseUrl}RMP/matrix_of_report/`
    service.metrics_aggregate(id).subscribe(res =>{
      expect(res).toEqual(data)
    })

    const req = httpMock.expectOne(serviceUrl+"?start_date=1&end_date=1&users_table_id=2&role_id=2");
    expect(req.request.method).toBe('GET');
    req.flush(data)
  }))

  



  
});


