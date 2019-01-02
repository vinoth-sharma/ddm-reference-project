import { Component, OnInit } from "@angular/core";
import { SecurityModalService } from "./security-modal.service";
import { WithoutPipe } from "angular-pipes";
import { forEach } from "@angular/router/src/utils/collection";
import { ToastrService } from "ngx-toastr";
import Utils from "../../utils";


@Component({
  selector: "app-security-modal",
  templateUrl: "./security-modal.component.html",
  styleUrls: ["./security-modal.component.css"]
})

export class SecurityModalComponent implements OnInit {
  public allUserList = [];
  public semanticsByUser: any = [];
  public originalSemanticsByUser = [];
  public originalUsersBySemantic = [];
  public userName: string;
  public semanticName: string;
  public allSemanticList = [];
  public userTosemantic: boolean = true;
  public isUserReadOnly: boolean = false;
  public isSemanticReadOnly: boolean = false;
  public isApplyDisabledForUser: boolean = true;
  public isApplyDisabledForSemantic: boolean = true;
  public usersBySemantic = [];
  public isAvailableSemanticsByUser: boolean = false;
  public isLoadingSemantics: boolean = false;
  public isLoadingUsers: boolean = false;
  public isAvailableUsersBySemantic: boolean = false;
  // private spinner; 

  constructor(
    private semanticModalService: SecurityModalService,
    private toasterService: ToastrService
  ) {
    //  this.spinner = new NgxSpinnerService;
  }

  ngOnInit() {
    this.getAllUserAndSemanticList();
  }

  /**
   * getAllUserAndSemanticList
   */
  public getAllUserAndSemanticList() {
    this.semanticModalService
      .getAllUserandSemanticList()
      .subscribe(
        res => this.getAllUserAndSemanticListCallback(res, null),
        err => this.getAllUserAndSemanticListCallback(null, err)
      );
  }

  /**
   * getAllUserAndSemanticListCallback
   */
  public getAllUserAndSemanticListCallback(res, err) {
    this.allUserList = res.data["users list"];
    this.allSemanticList = res.data["semantic_layers"];
  }

  /**
   * getListByOption
   */
  public getListByOption(e, name, type) {
    e.preventDefault();
    let options = {};

    if (type == "user") {
      options["user_id"] = name;
      this.isUserReadOnly = true;
      this.isAvailableSemanticsByUser = false;
      this.isLoadingSemantics = true;
    } else {
      options["sl_name"] = name;
      this.isSemanticReadOnly = true;
      this.isLoadingUsers = true;
      this.isAvailableUsersBySemantic = false;
    }

    this.semanticModalService
      .getListByOption(options)
      .subscribe(
        res => this.getListByOptionCallback(res, null),
        err => this.getListByOptionCallback(null, err)
      );
  }

  /**
   * getListByOptionCallback
   */
  public getListByOptionCallback(res, err) {
    let access_list = [];
    let unaccess_list = [];
    let access_key = Object.keys(res.data)[0];
    let unaccess_key = Object.keys(res.data)[1];
    res.data[access_key].forEach(function (el, key) {
      access_list.push({ name: el, checked: true });
    });
    res.data[unaccess_key].forEach(function (el, key) {
      unaccess_list.push({ name: el, checked: false });
    });
    Array.prototype.push.apply(access_list, unaccess_list);
    if (access_key == "List with access" || access_key == "List with no access") {
      this.isAvailableSemanticsByUser = true;
      this.isLoadingSemantics = false;
      this.semanticsByUser = access_list;
      this.originalSemanticsByUser = JSON.parse(
        JSON.stringify(this.semanticsByUser)
      );
    } else {
      this.isAvailableUsersBySemantic = true;
      this.isLoadingUsers = false;
      this.usersBySemantic = access_list;
      this.originalUsersBySemantic = JSON.parse(
        JSON.stringify(this.usersBySemantic)
      );
    }
  }

  /**
   * getItemFromList
   */
  public getItemFromList(key, type) {
    if (type == "user") {
      var dataList = document.getElementById("user-datalist");
      var input = document.getElementById("userAjax");
      dataList.innerHTML = "";
      var jsonOption = this.allUserList.filter(item => {
        return item["user_id"].toLowerCase().match(key.toLowerCase());
      });
      jsonOption.forEach(item => {
        var option = document.createElement("option");
        option.value = item["user_id"];
        dataList.appendChild(option);
      });
    } else {
      var dataList = document.getElementById("semantic-datalist");
      var input = document.getElementById("semanticAjax");
      dataList.innerHTML = "";
      var jsonOption = this.allSemanticList.filter(item => {
        return item["sl_name"].toLowerCase().match(key.toLowerCase());
      });
      jsonOption.forEach(item => {
        var option = document.createElement("option");
        option.value = item["sl_name"];
        dataList.appendChild(option);
      });
    }
  }

  /**
   * checkedList
   */
  public checkedList(e, type) {
    let isEqual = true;
    let changedData;
    let originalData;
    if (type == "user") {
      changedData = this.semanticsByUser;
      originalData = this.originalSemanticsByUser;
    } else {
      changedData = this.usersBySemantic;
      originalData = this.originalUsersBySemantic;
    }

    originalData.forEach(function (data, key) {
      if (!(changedData[key]["name"] == data["name"] && changedData[key]["checked"] == data["checked"]))
        isEqual = false;
    });
    if (isEqual)
      type == "user"
        ? (this.isApplyDisabledForUser = true)
        : (this.isApplyDisabledForSemantic = true);
    else
      type == "user"
        ? (this.isApplyDisabledForUser = false)
        : (this.isApplyDisabledForSemantic = false);
  }

  /**
   * updateSelectedList
   */
  public updateSelectedList(type) {
    Utils.showSpinner();     
    // this.spinner.show(); 
    
    let options = {};
    options["sl_name"] = [];
    options["user_id"] = [];
    if (type == "user") {
      options["user_id"].push(this.userName);
      this.semanticsByUser.forEach(function (data) {
        if (data.checked) options["sl_name"].push(data.name);
      });
    } else {
      options["sl_name"].push(this.semanticName);
      this.usersBySemantic.forEach(function (data) {
        if (data.checked) options["user_id"].push(data.name);
      });
    }

    this.semanticModalService
      .updateSelectedList(options)
      .subscribe(
        res => this.updateSelectedListCallback(res, null, type),
        err => this.updateSelectedListCallback(null, err, type)
      );
  }

  /**
   * updateSelectedListCallback
   */
  public updateSelectedListCallback(res, err, type) {
    if (type == "user" && res.message.toLowerCase() == "success") {
      this.toasterService.success("Semantic List updated successfully"); 
      Utils.hideSpinner();
      this.isApplyDisabledForUser = true;
      this.originalSemanticsByUser = JSON.parse(
        JSON.stringify(this.semanticsByUser)
      );
     
      Utils.closeModals();
    } else if (type == "semantic" && res.message.toLowerCase() == "success") {
      this.toasterService.success("User List updated successfully");
      Utils.hideSpinner();
      this.isApplyDisabledForSemantic = true;
      this.originalUsersBySemantic = JSON.parse(
        JSON.stringify(this.usersBySemantic)
      );
      Utils.closeModals();
    } else {
      this.toasterService.error(res.message);
    }
  }

  /**
   * resetList
   */
  public resetList(type) {
    if (type == "user") {
      this.isApplyDisabledForUser = true;
      this.userName = "";
      this.isUserReadOnly = false;
      this.semanticsByUser = [];
      this.originalSemanticsByUser = [];
      this.isAvailableSemanticsByUser = false;
    } else if ("semantic") {
      this.isApplyDisabledForSemantic = true;
      this.semanticName = "";
      this.isSemanticReadOnly = false;
      this.usersBySemantic = [];
      this.originalUsersBySemantic = [];
      this.isAvailableUsersBySemantic = false;
    }
  }

  public resetAll() {
    this.userTosemantic = true;
    this.isApplyDisabledForUser = true;
    this.userName = "";
    this.isUserReadOnly = false;
    this.semanticsByUser = [];
    this.originalSemanticsByUser = [];
    this.isAvailableSemanticsByUser = false;
    this.isApplyDisabledForSemantic = true;
    this.semanticName = "";
    this.isSemanticReadOnly = false;
    this.usersBySemantic = [];
    this.originalUsersBySemantic = [];
    this.isAvailableUsersBySemantic = false;
    this.isLoadingSemantics = false;
    this.isLoadingUsers = false;
  }

}
