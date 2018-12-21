import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PrivilegeModalService } from "./privilege-modal.service";

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
  public isApplyDisabledForUser: boolean = true;
  public isApplyDisabledForPrivilege: boolean = true;
  public usersByPrivilege = [];
  public isAvailablePrivilegesByUser: boolean = false;
  public isLoadingPrivileges: boolean = false;
  public isLoadingUsers: boolean = false;
  public isAvailableUsersByPrivilege: boolean = false;
  public allUserPrivileges = [];
  public allPrivilegesUser = [];

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
    let privilege_users = [];
    this.allPrivilegeList.forEach(function(allValue, i) {
      privilege_users.push({ privilege_name: allValue, user_id: [] });
      res.data["user_privileges"].forEach(function(data, k) {
        data.privileges_name.forEach(function(value, d) {
          if (value.toLowerCase() == allValue.toLowerCase()) {
            privilege_users[i]["user_id"].push(data.user_id);
          }
        });
      });
    });
    this.allPrivilegesUser = privilege_users;
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
      this.isLoadingPrivileges = true;
      this.getListByOptionCallback(type, name, this.allUserPrivileges);
    } else {
      options["sl_name"] = name;
      this.isPrivilegeReadOnly = true;
      this.isLoadingUsers = true;
      this.isAvailableUsersByPrivilege = false;
      this.getListByOptionCallback(type, name, this.allPrivilegesUser);
    }
  }

  /**
   * getListByOptionCallback
   */
  public getListByOptionCallback(type, name, data) {
    let access_list = [];
    let unaccess_list = [];
    let access_arr =
      type == "user"
        ? ["privileges_name", "user_id"]
        : ["user_id", "privilege_name"];
    let unaccess_arr =
      type == "user" ? this.allPrivilegeList : this.allUserList;
    let isFound = false;

    data.forEach(function(data, i) {
      if (name == data[access_arr[1]])
        data[access_arr[0]].forEach(function(pname, k) {
          access_list.push({ name: pname, checked: true });
        });
    });
    unaccess_arr.forEach(function(value, k) {
      isFound = false;
      access_list.forEach(function(alValue, k) {
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
      if (isFound == false)
        unaccess_list.push({
          name: type == "user" ? value : value["user_id"],
          checked: false
        });
    });
    Array.prototype.push.apply(access_list, unaccess_list);
    if (type == "user") {
      this.isAvailablePrivilegesByUser = true;
      this.isLoadingPrivileges = false;
      this.privilegesByUser = access_list;
      this.originalPrivilegesByUser = JSON.parse(
        JSON.stringify(this.privilegesByUser)
      );
    } else {
      this.isAvailableUsersByPrivilege = true;
      this.isLoadingUsers = false;
      this.usersByPrivilege = access_list;
      this.originalUsersByPrivilege = JSON.parse(
        JSON.stringify(this.usersByPrivilege)
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
      var dataList = document.getElementById("privilege-datalist");
      var input = document.getElementById("privilegeAjax");
      dataList.innerHTML = "";
      var jsonOption = this.allPrivilegeList.filter(item => {
        return item.toLowerCase().match(key.toLowerCase());
      });
      jsonOption.forEach(item => {
        var option = document.createElement("option");
        option.value = item;
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
      changedData = this.privilegesByUser;
      originalData = this.originalPrivilegesByUser;
    } else {
      changedData = this.usersByPrivilege;
      originalData = this.originalUsersByPrivilege;
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
    if (isEqual)
      type == "user"
        ? (this.isApplyDisabledForUser = true)
        : (this.isApplyDisabledForPrivilege = true);
    else
      type == "user"
        ? (this.isApplyDisabledForUser = false)
        : (this.isApplyDisabledForPrivilege = false);
  }

  /**
   * updateSelectedList
   */
  public updateSelectedList(type) {
    let options = {};
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
        res => this.updateSelectedListCallback(res, null, type),
        err => this.updateSelectedListCallback(null, err, type)
      );
  }

  /**
   * updateSelectedListCallback
   */
  public updateSelectedListCallback(res, err, type) {
    if (type == "user" && res.message.toLowerCase() == "success") {
      this.isApplyDisabledForUser = true;
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
      this.toasterService.success("Privilege List updated successfully");
    } else if (type == "privilege" && res.message.toLowerCase() == "success") {
      this.isApplyDisabledForPrivilege = true;
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
      this.toasterService.success("User List updated successfully");
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
      this.privilegesByUser = [];
      this.originalPrivilegesByUser = [];
      this.isAvailablePrivilegesByUser = false;
    } else if ("privilege") {
      this.isApplyDisabledForPrivilege = true;
      this.privilegeName = "";
      this.isPrivilegeReadOnly = false;
      this.usersByPrivilege = [];
      this.originalUsersByPrivilege = [];
      this.isAvailableUsersByPrivilege = false;
    }
  }

  public resetAll() {
    this.userToPrivilege = true;
    this.isApplyDisabledForUser = true;
    this.userName = "";
    this.isUserReadOnly = false;
    this.privilegesByUser = [];
    this.originalPrivilegesByUser = [];
    this.isAvailablePrivilegesByUser = false;
    this.isApplyDisabledForPrivilege = true;
    this.privilegeName = "";
    this.isPrivilegeReadOnly = false;
    this.usersByPrivilege = [];
    this.originalUsersByPrivilege = [];
    this.isAvailableUsersByPrivilege = false;
    this.isLoadingPrivileges = false;
    this.isLoadingUsers = false;
  }
}
