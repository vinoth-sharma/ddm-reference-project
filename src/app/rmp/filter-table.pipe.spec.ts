import { FilterTablePipe } from './filter-table.pipe';
import { pipe } from 'rxjs';

describe('FilterTablePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterTablePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return simple data : global search', () => {
    let testData = [{ ddm_rmp_post_report_id: 1009, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1009forlink", report_list_id: 683, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]
    let testFilter = { global: "1010", ddm_rmp_post_report_id: "", ddm_rmp_status_date: "", report_name: "", title: "", frequency: "", frequency_data_filtered: "" }
    let defaultFilter = undefined;
    let result = [{ ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }]

    const pipe = new FilterTablePipe();
    expect(pipe.transform(testData, testFilter, defaultFilter)).toEqual(result)
  })

  it('should return simple data : report_name search', () => {
    let testData = [{ ddm_rmp_post_report_id: 1009, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1009forlink", report_list_id: 683, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 685, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 686, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]
    let testFilter = { global: "", ddm_rmp_post_report_id: "", ddm_rmp_status_date: "", report_name: "1010forlink", title: "", frequency: "", frequency_data_filtered: "" }
    let defaultFilter = undefined;
    let result = [{ ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }]

    const pipe = new FilterTablePipe();
    expect(pipe.transform(testData, testFilter, defaultFilter)).toEqual(result)
  })

  it('should return simple data : frequency search', () => {
    let testData = [{ ddm_rmp_post_report_id: 1009, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1009forlink", report_list_id: 683, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 685, status: "Completed", favorites: true, description: null, frequency: "On Demand", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 686, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]
    let testFilter = { global: "", ddm_rmp_post_report_id: "", ddm_rmp_status_date: "", report_name: "", title: "", frequency: "On Demand", frequency_data_filtered: "" }
    let defaultFilter = undefined;
    let result = [{ ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 685, status: "Completed", favorites: true, description: null, frequency: "On Demand", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }]

    const pipe = new FilterTablePipe();
    expect(pipe.transform(testData, testFilter, defaultFilter)).toEqual(result)
  })

  it('should return all data back as no filters given :: similar to empty search', () => {
    let testData = [{ ddm_rmp_post_report_id: 1009, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1009forlink", report_list_id: 683, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]
    let testFilter = { global: " ", ddm_rmp_post_report_id: "", ddm_rmp_status_date: "", report_name: "", title: "", frequency: "", frequency_data_filtered: "" }
    let defaultFilter = undefined;
    let result = [{ ddm_rmp_post_report_id: 1009, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1009forlink", report_list_id: 683, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]

    const pipe = new FilterTablePipe();
    expect(pipe.transform(testData, testFilter, defaultFilter)).toEqual(result)
  })

  it('should return multiple data back as no multiple matching search given', () => {
    let testData = [{ ddm_rmp_post_report_id: 1009, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1009forlink", report_list_id: 683, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]
    let testFilter = { global: "101", ddm_rmp_post_report_id: "", ddm_rmp_status_date: "", report_name: "", title: "", frequency: "", frequency_data_filtered: "" }
    let defaultFilter = undefined;
    let result = [{ ddm_rmp_post_report_id: 1010, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1010forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1011, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1011forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false },
    { ddm_rmp_post_report_id: 1012, ddm_rmp_status_date: "21-Oct-2019", title: "test 2019-09-26 16:54:47.759", report_name: "1012forlink", report_list_id: 684, status: "Completed", favorites: true, description: null, frequency: "One Time", frequency_data: ["One Time"], undefinedFrequency: "Y", frequency_data_filtered: "One Time", changeFreqReq: false }
    ]

    const pipe = new FilterTablePipe();
    expect(pipe.transform(testData, testFilter, defaultFilter)).toEqual(result)
  })

});
