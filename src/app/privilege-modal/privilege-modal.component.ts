import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PrivilegeModalService } from "./privilege-modal.service";
import Utils from "../../utils";

@Component({
  selector: "app-privilege-modal",
  templateUrl: "./privilege-modal.component.html",
  styleUrls: ["./privilege-modal.component.css"]
})
export class PrivilegeModalComponent implements OnInit {
  public allUserList = [];
  public privilegesByUser: any = [];
  public originalPrivilegesByUser = [];
  public originalUsersByPrivilege = [];
  public userName: string;
  public privilegeName: string;
  public allPrivilegeList = [];
  public userToPrivilege: boolean = true;
  public isUserReadOnly: boolean = false;
  public isPrivilegeReadOnly: boolean = false;
  public disabledForUser: boolean = true;
  public disabledForPrivilege: boolean = true;
  public usersByPrivilege = [];
  public isAvailablePrivilegesByUser: boolean = false;
  public isAvailableUsersByPrivilege: boolean = false;
  public allUserPrivileges = [];
  public allPrivilegesUser = [];
  public isUserSelectDisabled:boolean = true;
  public jsonOption = [];
  public privilegeAll: boolean = false;
  public userAll: boolean = false;

  constructor(
    private privilegeModalService: PrivilegeModalService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllUserAndPrivilegeList();
  }

  /**
   * getAllUserAndPrivilegeList
   */
  public getAllUserAndPrivilegeList() {
    this.privilegeModalService
      .getAllUserandPrivilegeList()
      .subscribe(
        res => this.getAllUserAndPrivilegeListCallback(res, null),
        err => this.getAllUserAndPrivilegeListCallback(null, err)
      );
  }

  /**
   * getAllUserAndPrivilegeListCallback
   */
  public getAllUserAndPrivilegeListCallback(res, err) {
    this.allUserList = res.data["all_users"];
    this.allPrivilegeList = res.data["all_privileges"];
    this.allUserPrivileges = res.data["user_privileges"];
    let privilegeUsers = [];
    this.allPrivilegeList.forEach(function(allValue, i) {
      privilegeUsers.push({ privilege_name: allValue, user_id: [] });
      res.data["user_privileges"].forEach(function(data, k) {
        data.privileges_name.forEach(function(value, d) {
          if (value.toLowerCase() == allValue.toLowerCase()) {
            privilegeUsers[i]["user_id"].push(data.user_id);
          }
        });
      });
    });
    this.allPrivilegesUser = privilegeUsers;
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
      this.isAvailablePrivilegesByUser = false;
      this.isUserSelectDisabled = true;
      this.getListByOptionCallback(type, name, this.allUserPrivileges);
    } else {
      options["sl_name"] = name;
      this.isPrivilegeReadOnly = true;
      this.isAvailableUsersByPrivilege = false;
      this.getListByOptionCallback(type, name, this.allPrivilegesUser);
    }
  }

  /**
   * getListByOptionCallback
   */
  public getListByOptionCallback(type, name, data) {
    let accessList = [];
    let unaccessList = [];
    let accessArr =
      type == "user"
        ? ["privileges_name", "user_id"]
        : ["user_id", "privilege_name"];
    let unaccessArr =
      type == "user" ? this.allPrivilegeList : this.allUserList;
    let isFound = false;

    data.forEach(function(data, i) {
      if (name == data[accessArr[1]])
        data[accessArr[0]].forEach(function(pname, k) {
          accessList.push({ name: pname, checked: true });
        });
    });
    unaccessArr.forEach(function(value, k) {
      isFound = false;
      accessList.forEach(function(alValue, k) {
        if (type == "user") {
          if (alValue.name.toLowerCase() == value.toLowerCase()) {
            isFound = true;
          }
        } else {
          if (alValue.name == value.user_id) {
            isFound = true;
          }
        }
      });
      if (!isFound)
        unaccessList.push({
          name: type == "user" ? value : value["user_id"],
          checked: false
        });
    });
    Array.prototype.push.apply(accessList, unaccessList);
    if (type == "user") {
      this.isAvailablePrivilegesByUser = true;
      this.privilegesByUser = accessList;
      this.privilegeAll = this.isAllChecked(this.privilegesByUser); 
      this.originalPrivilegesByUser = JSON.parse(
        JSON.stringify(this.privilegesByUser)
      );
    } else {
      this.isAvailableUsersByPrivilege = true;
      this.usersByPrivilege = accessList;
      this.userAll = this.isAllChecked(this.usersByPrivilege);
      this.originalUsersByPrivilege = JSON.parse(
        JSON.stringify(this.usersByPrivilege)
      );
    }
  }

  /**
   * getItemFromList
   */
  public getItemFromList(key, type) {
    this.jsonOption = [];
    if (type == "user") {
      this.jsonOption = this.allUserList.filter(item => {
       return (item["user_id"].toLowerCase().indexOf(key.toLowerCase()) > -1);
     });
   } else {
     this.jsonOption = this.allPrivilegeList.filter(item => {
       return (item.toLowerCase().indexOf(key.toLowerCase()) > -1);
     });
   }
  }

  /**
   * isAllChecked
   */
  public isAllChecked(changedData) {
    return changedData.every((data) => data["checked"]);
  }

  /**
   * checkedList
   */
  public checkedList(e, type, isAll, isAllChecked) {
    this.disabledForUser = true;
    this.disabledForPrivilege = true;
    let isEqual = true;
    let changedData;
    let originalData;
    if (type == "user") {
      changedData = this.privilegesByUser;
      originalData = this.originalPrivilegesByUser;
      if (isAll) {
        changedData.forEach(function(data, key) { 
          data["checked"] = isAllChecked;
        });
      } else {
        this.privilegeAll = this.isAllChecked(changedData);
      }
    } else {
      changedData = this.usersByPrivilege;
      originalData = this.originalUsersByPrivilege;
      if (isAll) {
        changedData.forEach(function(data, key) {
          data["checked"] = isAllChecked;
        });
      } else {
        this.userAll = this.isAllChecked(changedData);
      }
    }

    originalData.forEach(function(data, key) {
      if (
        !(
          changedData[key]["name"] == data["name"] &&
          changedData[key]["checked"] == data["checked"]
        )
      )
        isEqual = false;
    });
    if (!isEqual)
      type == "user"
        ? (this.disabledForUser = false)
        : (this.disabledForPrivilege = false);
  }

  /**
   * updateSelectedList
   */
  public updateSelectedList(type) {
    let options = {};
    Utils.showSpinner(); 
    options["privileges"] = [];
    options["user_id"] = [];
    if (type == "user") {
      options["user_id"].push(this.userName);
      this.privilegesByUser.forEach(function(data) {
        if (data.checked) options["privileges"].push(data.name);
      });
    } else {
      options["privileges"].push(this.privilegeName);
      this.usersByPrivilege.forEach(function(data) {
        if (data.checked) options["user_id"].push(data.name);
      });
    }

    this.privilegeModalService
      .updateSelectedList(options)
      .subscribe(
        res => {
          this.toasterService.success(res['message']);
          this.updateSelectedListCallback(res, null, type)
        },
        err => this.updateSelectedListCallback(null, err, type)
      );
  }

  /**
   * updateSelectedListCallback
   */
  public updateSelectedListCallback(res, err, type) {
    if (type == "user" && res) {
      this.disabledForUser = true;
      this.originalPrivilegesByUser = JSON.parse(
        JSON.stringify(this.privilegesByUser)
      );
      let origPrivilegesByUser = this.privilegesByUser;
      let name = this.userName;
      this.allUserPrivileges.forEach(function(data, k) {
        if (data.user_id == name) {
          data.privileges_name = [];
          origPrivilegesByUser.forEach(function(value, i) {
            if (value.checked) data.privileges_name.push(value.name);
          });
        }
      });
      Utils.hideSpinner();
      Utils.closeModals();
    } else if (type == "privilege" && res) {
      this.disabledForPrivilege = true;
      this.originalUsersByPrivilege = JSON.parse(
        JSON.stringify(this.usersByPrivilege)
      );
      let origlUsersByPrivilege = this.usersByPrivilege;
      let name = this.privilegeName;
      this.allPrivilegesUser.forEach(function(data, k) {
        if (data.privilege_name == name) {
          data.user_id = [];
          origlUsersByPrivilege.forEach(function(value, i) {
            if (value.checked) data.user_id.push(value.name);
          });
        }
      });
      Utils.hideSpinner();
      Utils.closeModals();
    } else {
      this.toasterService.error(res.message['error']);
      Utils.hideSpinner();
    }
  }

  /**
   * resetList
   */
  public resetList(type?) {
    if (this.userToPrivilege) {
      this.disabledForUser = true;
      this.userName = "";
      this.isUserReadOnly = false;
      this.privilegesByUser = [];
      this.originalPrivilegesByUser = [];
      this.isAvailablePrivilegesByUser = false;
      this.isUserSelectDisabled = false;
    } else  {
      this.disabledForPrivilege = true;
      this.privilegeName = "";
      this.isPrivilegeReadOnly = false;
      this.usersByPrivilege = [];
      this.originalUsersByPrivilege = [];
      this.isAvailableUsersByPrivilege = false;
    }
  }

  public resetAll() {
    this.userToPrivilege = true;
    this.disabledForUser = true;
    this.userName = "";
    this.isUserReadOnly = false;
    this.privilegesByUser = [];
    this.originalPrivilegesByUser = [];
    this.isAvailablePrivilegesByUser = false;
    this.disabledForPrivilege = true;
    this.privilegeName = "";
    this.isPrivilegeReadOnly = false;
    this.usersByPrivilege = [];
    this.originalUsersByPrivilege = [];
    this.isAvailableUsersByPrivilege = false;
    this.isUserSelectDisabled = false;
  }

}
