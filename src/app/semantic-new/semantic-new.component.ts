  import { Component } from "@angular/core";
  import { Router} from "@angular/router";
  import { AuthenticationService } from "../authentication.service";
  import { SemdetailsService } from "../semdetails.service";
  import { ObjectExplorerSidebarService } from "../shared-components/sidebars/object-explorer-sidebar/object-explorer-sidebar.service";
  import { ToastrService } from "ngx-toastr";
  import Utils from "../../utils";

  @Component({
    selector: 'app-semantic-new',
    templateUrl: './semantic-new.component.html',
    styleUrls: ['./semantic-new.component.css']
  })
  export class SemanticNewComponent {
    public sem : any;
    public sls : number;
    public semanticNames : any;
    public sel : string;
    public selectedItemsExistingTables = [];
    public selectedItemsNonExistingTables = [];
    public inputSemanticValue : string;
    public dropdownSettingsExistingTables = {};
    public dropdownSettingsNonExistingTables = {};
    public columns = [];
    public semanticId : any;
    public tables=[];
    public confHeader: string = "Save as";
    public confText : string = "Save Semantic Layer as:";
    public userId : any;
    public defaultError = "There seems to be an error. Please try again later.";
    public isDivDisabled: boolean;
    public checkedValue : string;

    constructor(private router: Router, private user: AuthenticationService, private toasterService: ToastrService, private se: SemdetailsService, private objectExplorerSidebarService: ObjectExplorerSidebarService) {
      this.user.myMethod$.subscribe((res) =>{
        this.sem = res['sls'];
        this.getSemanticId();
      });
    }

    ngOnInit() {
      this.selectedItemsExistingTables = [];
      this.selectedItemsNonExistingTables = [];
      this.user.errorMethod$.subscribe((userId) =>
      this.userId = userId);
      this.user.fun(this.userId).subscribe(res => {
        this.semanticNames = res["sls"];
      });
      this.dropdownSettingsNonExistingTables = {  
        singleSelection: false,
        idField: 'table_name',
        textField: 'table_name',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 4,
        allowSearchFilter: true,
        enableCheckAll : false
      };
      this.dropdownSettingsExistingTables = {
        singleSelection: false,
        idField: 'sl_tables_id',
        textField: 'mapped_table_name',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 4,
        allowSearchFilter: true,
        enableCheckAll : false
      };
    }
    
      //use this to add tables to array
    public onItemSelect(item: any) {
      
    }

    //use this to delete tables to array
    public onItemDeselect(items: any) {
      
    }

    public getSemanticId(){
      this.router.config.forEach(element => {
        if (element.path == "semantic") {
          this.semanticId = element.data["semantic_id"];
        }
      });
    }

    public fetchSemantic(event: any) {
      let isValid =  this.sem.map(el => el.sl_name).includes(this.inputSemanticValue);
      if(isValid || !this.inputSemanticValue.length){
        Utils.showSpinner();
        this.sel = event.target.value;
        this.sls = this.semanticNames.find(x => x.sl_name == this.sel).sl_id;
        this.se.fetchsem(this.sls).subscribe(res => {  ///////////// SemdetailsService.fetchsem
          this.columns = res["data"]["sl_table"];
        });
        this.objectExplorerSidebarService.getAllTables(this.sls).subscribe(response => {
          this.tables = response['data'];
        }, error => {
          this.toasterService.error(error.message || this.defaultError);
        })
        Utils.hideSpinner();
      }
    };

    public checkEmpty(){ //Validation of all the the 3 inputs in 'Copy existing Semantic layer:' div  
    if(!this.inputSemanticValue || !this.selectedItemsExistingTables.length || !this.selectedItemsNonExistingTables.length){
      this.toasterService.error("All fields should be mandatorily filled!!");
      // return false;
    }
    else{
       //To check whether 'Copy existing Semantic layer' input box is having duplicate(Existing) values only
      if(this.sem.find(ele=>ele.sl_name == this.inputSemanticValue)){ 
        document.getElementById("open-modal-btn").click();
      }
      else{
        this.toasterService.error("Please enter existing SL value!");
      }
    
    }
  }

    public saveSemantic(value : string) {
      let pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\/';,/{}|\\":<>\?]/);
      if (pattern.test(value)) {
            this.toasterService.error("Please do not enter SPECIAL CHARACTER(s) in the SL name!");
            // this.reset();
          }
          else{
            if(this.sem.find(ele=>ele.sl_name == value.trim() || value.trim().length == 0)){ 
              //To check whether 'Save as' modal input box is unique(new) values only
              this.toasterService.error("Please enter UNIQUE NAME to the saving SL!");
            }
            else{
              this.toasterService.success("SL has been copied successfully!");
              // this.reset();
              // document.getElementById("inpSemanticValue").remove;
              this.selectedItemsExistingTables = [];
              this.selectedItemsNonExistingTables = [];
            }
          }
    }

  }
