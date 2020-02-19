
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { SecurityModalService } from "./security-modal.service"
import { ToastrService } from "ngx-toastr";
import Utils from "../../utils";
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: "app-security-modal",
  templateUrl: "./security-modal.component.html",
  styleUrls: ["./security-modal.component.css"]
})
export class SecurityModalComponent implements OnInit {

  public userToSemantic:any = {};
  public semanticToUser:any = {};
  public userTabSelected:boolean = true;
  userId:any;
  allSemUserList:any[] = [];
  // origAllUserList:any[] = [];

  // @Input() allUserList;

  allUserList = [];
  @Input() allSemanticList;
  origAllSemanticList:any = [];

  userTabSelectedControl = new FormControl();
  semanticTabSelectedControl = new FormControl();
  semUserSearchControl = new FormControl();

  constructor(
    private toasterService: ToastrService,
    private securityModalService: SecurityModalService,
    private authentication: AuthenticationService
  ) {}

  ngOnInit() {
    
    this.userTabSelectedControl.valueChanges.pipe(
    debounceTime(800),
    distinctUntilChanged(),)
    .subscribe(value => {
      this.allUserList = [];
      // if((value || '').trim())
        this.getUserList(value);
    });

    this.semanticTabSelectedControl.valueChanges.pipe(
    debounceTime(800),
    distinctUntilChanged(),)
    .subscribe(value => {
      this.allSemanticList = this.getSemanticList(value);
    });

    this.semUserSearchControl.valueChanges.pipe(
    debounceTime(800),
    distinctUntilChanged(),)
    .subscribe(value => {
      this.allSemUserList = [];
      // if((value || '').trim())
        this.getUserList(value);
    });

  }

  // semUserSearchControl

  ngOnChanges() {
    // this.origAllUserList = JSON.parse(JSON.stringify(this.allUserList));
    this.origAllSemanticList = JSON.parse(JSON.stringify(this.allSemanticList));
  }

  getSemanticList(value) {
    return this.origAllSemanticList.filter(element => {   
      return element['sl_name'].toLowerCase().includes(value.toLowerCase())
    });
  }

  getUserList(value:string) {
    // this.allUserList = this.origAllUserList.filter(item => {
    //   return (item["user_id"].toLowerCase().indexOf(value.toLowerCase()) > -1) ;
    // });
    this.securityModalService.getUserList(value).subscribe (response => {
      // let res = [{'uid': '', 'displayName': 'Sergio De'}, {'uid': '', 'displayName': 'Jeferson L De'}, {'uid': '', 'displayName': 'Marco A De'}, {'uid': '', 'displayName': 'Sergio De'}, {'uid': '', 'displayName': 'Joao-Fern De-Carvalho-Pereira'}, {'uid': 'zzh4jk', 'displayName': 'Rocio A De-Cruz'}, {'uid': '', 'displayName': 'Lindsay De-Roo'}, {'uid': '', 'displayName': 'Lindsay De-Roo'}, {'uid': '', 'displayName': 'CRISTOFER ALEXIS DE AGUERO MONTOYA'}, {'uid': 'sz4y09', 'displayName': 'Juan Luis De Alba Dominguez'}, {'uid': 'dzdwvx', 'displayName': 'Perla Gabriela De Alba Esquivel'}, {'uid': 'lz4dfs', 'displayName': 'Alma Georgina De Alejo Orocio'}, {'uid': 'qznbz1', 'displayName': 'Ludovico De Amicis'}, {'uid': '', 'displayName': 'Jose De Anda (C)'}, {'uid': 'fz562y', 'displayName': 'Alejandro De Anda Fajardo (C)'}, {'uid': 'xzh2rt', 'displayName': 'Alejandro De Anda Fajardo'}, {'uid': 'szz8wv', 'displayName': 'Antonio De Anda'}, {'uid': '', 'displayName': 'Salvador De Anda Razo'}, {'uid': 'wzz9hh', 'displayName': 'Raul De Anda Razo'}, {'uid': '', 'displayName': 'JOSE FRANCISCO DE ANDA RODRIGUEZ'}, {'uid': 'kzbvt7', 'displayName': 'Steve De Andy'}, {'uid': 'fzzmqs', 'displayName': 'Kyle DeAndy'}, {'uid': '', 'displayName': 'Juan Benito De Aro Corona'}, {'uid': '', 'displayName': 'Angel De Aro Corona'}, {'uid': 'wzzkmp', 'displayName': 'Joao Paulo Avelar'}, {'uid': 'dzk7pq', 'displayName': 'Victor Manuel De Avila Ascarcio'}, {'uid': 'hz4zxb', 'displayName': 'Alonso DeAvila'}, {'uid': '', 'displayName': 'Arthur De Barros (C)'}, {'uid': 'kz0vdb', 'displayName': 'Robert A De Bartolo'}, {'uid': '', 'displayName': 'Hamilton De Beer (C)'}, {'uid': '', 'displayName': 'Ruben De Belie (C)'}, {'uid': '', 'displayName': 'Jan de Bie (C)'}, {'uid': '', 'displayName': 'Brenda de Blas Aranda (C)'}, {'uid': 'gzyb74', 'displayName': 'Luis Fernando De Blas De Blas'}, {'uid': 'gzw84n', 'displayName': 'Marbella De Blas Flores'}, {'uid': '', 'displayName': 'RICARDO DE BLAS GARCIA'}, {'uid': 'szwt24', 'displayName': 'Ma De Los Angeles De Blas Gomez'}, {'uid': 'nz7148', 'displayName': 'Carlos Alberto De Blas Gonzalez'}, {'uid': 'nzslbp', 'displayName': 'Juan Antonio De Blas Grimaldo'}, {'uid': 'rz366r', 'displayName': 'Samuel De Blas Huerta'}, {'uid': '', 'displayName': 'Miguel Eduardo De Blas Martinez'}, {'uid': 'dzydtd', 'displayName': 'Cristina De Blas Melchor'}, {'uid': '', 'displayName': 'Missael Alejandro De Blas Mendoza'}, {'uid': '', 'displayName': 'KAREN ALICIA DE BLAS REYNA (C)'}, {'uid': 'pzsxtk', 'displayName': 'Jose Yovani De Blas Saldana'}, {'uid': 'gzhnnq', 'displayName': 'Cristian Roberto De Blas Saldana'}, {'uid': 'dz4gmx', 'displayName': 'Francisco De Blas Silva'}, {'uid': '', 'displayName': 'Danny De Block'}, {'uid': '', 'displayName': 'Danny De Block (C)'}, {'uid': 'gzzy22', 'displayName': 'Yvan De Blois'}, {'uid': '', 'displayName': 'Jeroen De Boelpaep (C)'}, {'uid': 'sztpbz', 'displayName': 'Leslie A De Boer'}, {'uid': 'jz3n00', 'displayName': 'Philippe De Bolle (C)'}, {'uid': 'mzq7rg', 'displayName': 'Samuel S De Borba'}, {'uid': '', 'displayName': 'Carlos de Boyrie'}, {'uid': 'xzp8wd', 'displayName': 'Carlos A De Boyrie'}, {'uid': '', 'displayName': 'Carlos De Boyrie'}, {'uid': '', 'displayName': 'ANJANETTE DE BRUIN (C)'}, {'uid': 'kzxq91', 'displayName': 'Paulo Estevam Simoes'}, {'uid': 'pzmnfr', 'displayName': 'Riza De Castro (C)'}, {'uid': 'lz0yrf', 'displayName': 'Felipe De Castro'}, {'uid': 'zzql5t', 'displayName': 'Evenys D De Castro Rojas (C)'}, {'uid': '', 'displayName': 'Diogo Ricardo De Castro Tome (C)'}, {'uid': 'hzqpkk', 'displayName': 'Kenneth A De Ceuninck'}, {'uid': '', 'displayName': 'Don Declerck'}, {'uid': '', 'displayName': 'Gerald A De Clercq'}, {'uid': '', 'displayName': 'Diego De Concepcion Gil (C)'}, {'uid': 'hzxcqp', 'displayName': 'Michael J. DeCook'}, {'uid': 'vz9260', 'displayName': 'James De Corse'}, {'uid': '', 'displayName': ''}, {'uid': '', 'displayName': 'ALBERTO DE DIEGO JIMENEZ'}, {'uid': '', 'displayName': 'Esther De Diego Lopez (C)'}, {'uid': 'bzjkdx', 'displayName': 'Edgar De Dios (C)'}, {'uid': 'yzr24l', 'displayName': 'Greta Alyssa de Dios (C)'}, {'uid': 'zz412s', 'displayName': 'Mikee Dominador De Dios III (C)'}];
      if(this.userTabSelected) {
        this.allUserList = response['data'];
        // this.allUserList = [...response['data'],...this.allUserList];
      } else {
        this.allSemUserList = response['data'];
      }
    });  
    
  }

  /**
   * getAllUserAndSemanticListCallback
   */
  public getAllUserAndSemanticListCallback(res, err) {
    // this.allUserList = res.data["users list"];
    this.allSemanticList = res.data["semantic_layers"];
  }

  /**
   * getListByOption
   */
  public getListByOption(e) {
    // e.preventDefault();
    let options = {};

    if (this.userTabSelected) {
      // options["user_id"] = this.userToSemantic['inputKey'];
      if(!this.userTabSelectedControl.value.user_id) {
        this.userToSemantic['isSearchData'] = false;
        this.userToSemantic.data = [];
        return;
      }
      
      options['user_id'] = this.userTabSelectedControl.value.user_id;
      this.userToSemantic['readOnly'] = true;
      this.userToSemantic['isAvailable'] = false;
      this.userToSemantic['isLoading'] = true;
      this.userToSemantic.isSearchData = true;
    } else {
      // options["sl_name"] = this.semanticToUser['inputKey'];
      options["sl_name"] = this.semanticTabSelectedControl.value;
      this.semanticToUser['readOnly'] = true;
      this.semanticToUser['isAvailable'] = false;
      this.semanticToUser['isLoading'] = true;
    }
// console.log(this.userToSemantic,"userToSemantic");

    this.securityModalService
      .getListByOption(options)
      .subscribe(
        res => {
          if(!(JSON.stringify(res['data']) == "{}"))
            this.getListByOptionCallback(res, null)
          else{
            if (this.userTabSelected) {
            this.userToSemantic['data'] = [];
            this.userToSemantic['isAvailable'] = true;
            this.userToSemantic['isLoading'] = false;
            this.userToSemantic['readOnly'] = false;
            }else{
            this.semanticToUser['data'] = [];
            this.semanticToUser['isAvailable'] = true;
            this.semanticToUser['isLoading'] = false;
            this.semanticToUser['readOnly'] = false;
            }
          }
        },
        err => this.getListByOptionCallback(null, err)
      );     
  }

  displayFn(user) {
    // console.log(user,"user");
    // this.userId = user ? user.user_id : '';
    // console.log(this.userId,"this.userId");
    return user ? user.user_name : '';
  }

  userSelected(eve){
    this.userId = eve.option.value.user_id;
  }

  displaySemFn(user) {
    // this.userId = user ? user.user_id : '';
    return user ? user.user_name : '';
  }

  onSelectionChanged(user) {
    this.userId = user.option.value.user_id;
    const option = {'user_id':user.option.value.user_id}
    this.securityModalService.storeUserDetails(option).subscribe(response =>{
      this.getListByOption(user);
    }, 
    err => {

    }
  )
  // return user ? user.user_name : '';
  }

  /**
   * getListByOptionCallback
   */
  public getListByOptionCallback(res, err) {
    let access_list = [];
    let unaccess_list = [];
    let access_key =
      this.userTabSelected ? "List with access" : "users_having_access";
    let unaccess_key =
      this.userTabSelected? "List with no access" : "users_not_having_access";
      // console.log(access_key,"unaccess_key" );   
      // console.log( res.data[unaccess_key],"unaccess_key");    
    if (
      access_key == "List with access" ||
      access_key == "List with no access"
    ) {
      res.data[access_key].forEach(function (el, key) {
        access_list.push({ name: el, checked: true });
      });
      res.data[unaccess_key].forEach(function (el, key) {
        unaccess_list.push({ name: el, checked: false });
      });
      Array.prototype.push.apply(access_list, unaccess_list);
      this.userToSemantic['isAvailable'] = true;
      this.userToSemantic['isLoading'] = false;
      this.userToSemantic['data'] = access_list;
      this.userToSemantic['isSearchData'] = false;
      this.userToSemantic['cachedData'] = this.userToSemantic['data'];
      this.userToSemantic['selectAll'] = this.isAllChecked(this.userToSemantic['data']);
      this.userToSemantic['originalData'] = JSON.parse(
        JSON.stringify(this.userToSemantic['data'])
      ); 

    } else {
      res.data[access_key].forEach(function(el, key) {
        access_list.push({ name: el.user_name, checked: true, id: el.user_id, role : el.role });
      }); 
      res.data[unaccess_key].forEach(function(el, key) {
        unaccess_list.push({ name: el.user_name, checked: false, id: el.user_id, role : el.role });
      });
      Array.prototype.push.apply(access_list, unaccess_list);
      this.semanticToUser['isAvailable'] = true;
      this.semanticToUser['isLoading'] = false;
      this.semanticToUser['data'] = access_list;
      this.semanticToUser['isSearchData'] = false;
      this.semanticToUser['cachedData'] = this.semanticToUser['data'];
      this.semanticToUser['selectAll'] = this.isAllChecked(this.semanticToUser['data']);
      this.semUserSearchControl.setValue('');
      this.semanticToUser['originalData'] = JSON.parse(
        JSON.stringify(this.semanticToUser['data'])
      );
    }
  }

  /**
   * getItemFromList
   */
  // public getItemFromList(event,key) {
  //   event.preventDefault();
  //   if (this.userTabSelected) {
  //     var dataList = document.getElementById("user-datalist");
  //     var input = document.getElementById("userAjax");
  //     dataList.innerHTML = "";
  //     var jsonOption = this.allUserList.filter(item => {
  //       return (item["user_id"].toLowerCase().indexOf(key.toLowerCase()) > -1) ;
  //     });
  //     jsonOption.forEach(item => {
  //       var option = document.createElement("option");
  //       option.value = item["user_id"];
  //       dataList.appendChild(option);
  //     });
  //   } else {
  //     var dataList = document.getElementById("semantic-datalist");
  //     var input = document.getElementById("semanticAjax");
  //     dataList.innerHTML = "";
  //     var jsonOption = this.allSemanticList.filter(item => {
  //       return (item["sl_name"].toLowerCase().indexOf(key.toLowerCase()) > -1);
  //     });
  //     jsonOption.forEach(item => {
  //       var option = document.createElement("option");
  //       option.value = item["sl_name"];
  //       dataList.appendChild(option);
  //     });
  //   }
  // }

  /**
   * isAllChecked
   */
  public isAllChecked(changedData) {
    return changedData.every((data) => data["checked"]);
  }

  /**
   * checkedList
   */
  public checkedList(e, isAll, isAllChecked) {
    let isEqual = true;
    let changedData;
    let originalData;
    if (this.userTabSelected) {

      changedData = this.userToSemantic['cachedData'];
      originalData = this.userToSemantic['originalData'];

      if (isAll) {
        this.userToSemantic['data'].forEach(function(data, key) { 
          data["checked"] = isAllChecked;
        });
      } else {
        this.userToSemantic['selectAll'] = this.isAllChecked(changedData);
      }


    } else {
      changedData = this.semanticToUser['cachedData'];
      originalData = this.semanticToUser['originalData'];
      if (isAll) {
        this.semanticToUser['data'].forEach(function(data, key) {
          data["checked"] = isAllChecked;
        });
      } else {
        this.semanticToUser['selectAll'] = this.isAllChecked(changedData);
      }
    }

    originalData.forEach(function(data, key) {
      if (!(
          changedData[key]["name"] == data["name"] &&
          changedData[key]["checked"] == data["checked"]
        )
      )
        isEqual = false;
    });
    if (isEqual)
      this.userTabSelected ? (this.userToSemantic['isApply'] = false) : (this.semanticToUser['isApply'] = false);
    else
      this.userTabSelected ? (this.userToSemantic['isApply'] = true) : (this.semanticToUser['isApply'] = true);
  }

  /**
   * updateSelectedList
   */
  public updateSelectedList() {
    
    Utils.showSpinner();
    let options = {};
    options["sl_name"] = [];
    options["user_id"] = [];
    if (this.userTabSelected) {
      console.log("userId here",this.userId);   
      // options["user_id"].push(this.userToSemantic['inputKey']);
      options["user_id"].push(this.userId);
      this.userToSemantic['cachedData'].forEach(function(data) {
        if (data.checked) options["sl_name"].push(data.name);
      });
    } else {
      // options["sl_name"].push(this.semanticToUser['inputKey']);
      options["sl_name"].push(this.semanticTabSelectedControl.value);
      this.semanticToUser['cachedData'].forEach(function(data) {
        if (data.checked) options["user_id"].push(data.id);
      });
    }
    if(options['user_id'].length == 1 && options['sl_name'].length == 1 )
        options['case_id'] = this.userTabSelected ? 1 : 2;
        console.log("options",options);        
    this.securityModalService.updateSelectedList(options).subscribe(
      res => {
        this.updateSelectedListCallback(res, null);
        this.toasterService.success("Please wait a moment for refreshing of security values!");
        this.authentication.getUser();
        // Utils.showSpinner(); 
        Utils.hideSpinner();
        // this.updateSecurity.emit();
      },
      err => {
        Utils.hideSpinner();
        this.updateSelectedListCallback(null, err);
      }
    );
  }

  /**
   * updateSelectedListCallback
   */
  public updateSelectedListCallback(res, err) {
    if (this.userTabSelected && res) {
      Utils.hideSpinner();
      this.userToSemantic['isApply'] = false;
      this.userToSemantic['originalData'] = JSON.parse(
        JSON.stringify(this.userToSemantic['data'])
      );
      Utils.closeModals();
    } else if (this.userTabSelected == false && res) {
      Utils.hideSpinner();
      this.semanticToUser['isApply'] = false;
      this.semanticToUser['originalData'] = JSON.parse(
        JSON.stringify(this.semanticToUser['data'])
      );
      Utils.closeModals();
    } else {
      this.toasterService.error(err.message["error"]);
      Utils.hideSpinner();
    }
  }

  /**
   * resetList
   */
  public resetList() {
    if(this.userTabSelected) {
      this.userTabSelectedControl.setValue(''); 
      this.userToSemantic = {};
    }
    else {
      this.semanticTabSelectedControl.setValue(''); 
      this.semanticToUser = {};
    }
  }

  public resetAll() {
    this.userTabSelected = true;
    this.userToSemantic = {};
    this.semanticToUser = {};
    this.userTabSelectedControl.setValue('');
    this.semanticTabSelectedControl.setValue('');
    this.semUserSearchControl.setValue('');
  }

  filterList(input: string, type: string) {
  
    if(type === 'user') {
      this.userToSemantic['data']  = this.userToSemantic['cachedData'];
      if(input) {
        this.userToSemantic['data']  = this.userToSemantic['data'].filter(ele => {
          if ((ele['name'].toLowerCase().indexOf(input.toLowerCase())) > -1) {
            return ele;
          }
        });
        this.userToSemantic['isSearchData'] =  this.userToSemantic['data'].length == 0 ? true : false;
      }
      this.isAllChecked(this.userToSemantic['data']);
    }else {
      this.semanticToUser['data']  = this.semanticToUser['cachedData'];
      if(input) {
        this.semanticToUser['data']  = this.semanticToUser['data'].filter(ele => {
          if ((ele['name'].toLowerCase().indexOf(input.toLowerCase())) > -1) {
            return ele;
          }
        });
        this.semanticToUser['isSearchData'] =  this.semanticToUser['data'].length == 0 ? true : false
      }
      this.isAllChecked(this.semanticToUser['data'])
    }
  }

}
