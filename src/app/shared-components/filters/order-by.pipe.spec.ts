import { OrderByPipe } from './order-by.pipe';

// Angular Pipe unit test cases developed by Deepak Urs G V 

describe('OrderByPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByPipe();
    expect(pipe).toBeTruthy();
  });

  it('pipe should return the simple sorted data based on "column" field', () => {
    const pipe = new OrderByPipe();

    let testData = [ { column: "NAMEPLT_CD_34", mapped_column_name: "NAMEPLT_CD_34", original_column_name: "NAMEPLT_CD", data_type: "VARCHAR2", column_view_to_admins: true },
    { column: "EPLT_CD_34", mapped_column_name: "EPLT_CD", original_column_name: "NAMEPLT_CD_35", data_type: "VARCHAR2", column_view_to_admins: true }
    ];
    let testField = 'column';
    let testType = undefined;
    let resultData = [ { column: "EPLT_CD_34", mapped_column_name: "EPLT_CD", original_column_name: "NAMEPLT_CD_35", data_type: "VARCHAR2", column_view_to_admins: true },
    { column: "NAMEPLT_CD_34", mapped_column_name: "NAMEPLT_CD_34", original_column_name: "NAMEPLT_CD", data_type: "VARCHAR2", column_view_to_admins: true }
    ];

    expect(pipe.transform(testData, testField, testType)).toEqual(resultData);
  })

  it('pipe should return the simple sorted data based on "custom_table_name" field', () => {
    const pipe = new OrderByPipe();

    let testData = [ { table_name: "CD_34", custom_table_name: "NAMEPLT_CD_34", data_type: "VARCHAR2" },
    { table_name: "CD_35", custom_table_name: "EPLT_CD", data_type: "VARCHAR2" },
    { table_name: "CD_22", custom_table_name: "LT_CD22", data_type: "VARCHAR2" }
    ];
    let testField = 'custom_table_name';
    let testType = undefined;
    let resultData = [ { table_name: "CD_35", custom_table_name: "EPLT_CD", data_type: "VARCHAR2" },
    { table_name: "CD_22", custom_table_name: "LT_CD22", data_type: "VARCHAR2" },
    { table_name: "CD_34", custom_table_name: "NAMEPLT_CD_34", data_type: "VARCHAR2" }
    ];

    expect(pipe.transform(testData, testField, testType)).toEqual(resultData);
  })


  it('pipe should return the simple sorted data based on "mapped_table_name" field', () => {
    const pipe = new OrderByPipe();

    let testData = [ { table: "VID_VOD", mapped_table_name: "CADI-SALES", original_table_name: "VID_VOD", data_type: "VARCHAR2", table_view_to_admins: true },
    { table: "ALT_DESC", mapped_table_name: "CHEV-TOTAL", original_table_name: "ALT_DESC", data_type: "VARCHAR2", table_view_to_admins: true },
    { table: "BFP_REGION", mapped_table_name: "BUICK-SUM", original_table_name: "BFP_REGION", data_type: "VARCHAR2", table_view_to_admins: true }
    ];
    let testField = 'mapped_table_name';
    let testType = undefined;
    let resultData = [ { table: "BFP_REGION", mapped_table_name: "BUICK-SUM", original_table_name: "BFP_REGION", data_type: "VARCHAR2", table_view_to_admins: true },
    { table: "VID_VOD", mapped_table_name: "CADI-SALES", original_table_name: "VID_VOD", data_type: "VARCHAR2", table_view_to_admins: true },
    { table: "ALT_DESC", mapped_table_name: "CHEV-TOTAL", original_table_name: "ALT_DESC", data_type: "VARCHAR2", table_view_to_admins: true }
    ];

    expect(pipe.transform(testData, testField, testType)).toEqual(resultData);
  })


});
