import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-access-to-modules',
  templateUrl: './access-to-modules.component.html',
  styleUrls: ['./access-to-modules.component.scss']
})
export class AccessToModulesComponent implements OnInit {
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() SaveData: EventEmitter<object> = new EventEmitter<object>();
  @Input() data: any;
  designation_id: any;
  organization_id: any;
  buttonName: String;
  itemId: any;
  accessibility: any = [];
  tempData:any = []
  constructor(
    private activeRoute: ActivatedRoute,
    private api: ApiserviceService
  ) {
    this.designation_id = this.activeRoute.snapshot.paramMap.get('id')
  }

  ngOnChanges(): void {
    if (this.data?.access?.length > 0) {
      // console.log('this.data',this.data)
      this.getAccessForDesignation(this.designation_id);
    }
  }
  ngOnInit(): void {
    this.organization_id = sessionStorage.getItem('organization_id')

  }

  testRazorpay(){

  }


  getAccessForDesignation(id: any) {
    this.api.getAccessByDesignationId(`?designation=${this.designation_id}&organization=${this.organization_id}`).subscribe(
      (res: any) => {
        console.log(res, 'designation id');
         if (res.length > 0) {
          this.itemId = res[0].id;
          this.buttonName = 'Update';
          this.dataEmitter.emit(res[0]);
          if (res?.[0]?.access_list?.length > 0) {
            this.accessibility = [];
            const accessList = res[0].access_list;
            accessList.forEach((element_list) => {
              let isMatched = false;
              element_list.access.forEach((accessItem: any) => {
                const matchedModule = this.data.access.find((module_name: any) => module_name.name === accessItem.name);
                if (matchedModule) {
                  matchedModule['operations'] = accessItem.operations;
                  isMatched = true;
                }
              });
              if (!isMatched) {
                this.accessibility.push(element_list);
              }
            });
  
            // console.log(this.data, 'Updated accessibility');
            // console.log(this.accessibility, 'Not matching');
          }
        } else{
          this.buttonName = 'Add';
        }
      }
    );
  }
  
  // getAccessForDesignation(id: any) {
  //   this.api.getAccessByDesignationId(`?${'designation'}=${this.designation_id}&${'organization'}=${this.organization_id}`).subscribe(
  //     (res: any) => {
  //       console.log(res, 'designation id');
  //       if (res.length > 0) {
  //         this.itemId = res[0].id
  //         this.buttonName = 'Update'
  //         if (res?.[0]?.access_list?.length > 0) {
  //           this.accessibility = []
  //           const accessList = res[0].access_list;
  //           accessList.forEach((element_list) => {
  //             element_list.access.forEach((accessItem: any) => {
  //                 this.data.access.forEach((module_name: any) => {
  //                 if (module_name.name === accessItem.name) {
  //                   module_name['operations'] = accessItem.operations;
  //                 } else {
  //                   console.log('not match',element_list);
  //                   this.accessibility.push(element_list);
  //                 }
  //               });
  //             });

  //           });

  //           console.log(this.data, 'Updated accessibility');
  //           console.log(this.accessibility, 'not matching')
  //         }
  //       } else {
  //         this.buttonName = 'Add';
  //       }
  //     }
  //   )
  // }

  modifyAccess(event: any, sub_module_name, access_name) {
    this.data.access.forEach((element_sub_module: any) => {
      if (sub_module_name === element_sub_module.name) {
        if(access_name==='create' || access_name==='update' || access_name==='delete'){
          element_sub_module['operations'][0]['view'] = event.target.checked 
          element_sub_module['operations'][0][access_name] = event.target.checked 
        } else{
          if(event.target.checked==false && access_name=='view'){
            element_sub_module['operations'][0]['create'] = event.target.checked 
            element_sub_module['operations'][0]['update'] = event.target.checked 
            element_sub_module['operations'][0]['delete'] = event.target.checked 
            element_sub_module['operations'][0][access_name] = event.target.checked
          }
          element_sub_module['operations'][0][access_name] = event.target.checked 
        }
        // element_sub_module['operations'][0][access_name] = event.target.checked
      }
    });
  }

  selectAll(event) {
    this.data?.access.forEach(item => {
      item.operations[0]['create'] = event.target.checked;
      item.operations[0]['view'] = event.target.checked;
      item.operations[0]['update'] = event.target.checked;
      item.operations[0]['delete'] = event.target.checked;
    });
  }
  get allSelected(): boolean {
    return this.data.access.every((item: any) =>
      Object.values(item.operations[0]).every((value: boolean) => value)
    );
  }

  
  
  

  addOrUpdate(text: any) {
    this.data.access.forEach(item => {
      delete item.icon;
      delete item.is_show;
    });
    const combinedData = this.accessibility.concat(this.data); 
    let updated_access = {
      'designation': this.designation_id,
      'organization': this.organization_id,
      'access_list': this.filterAccessList(combinedData)
    }
    // console.log('updated code', updated_access);
    this.SaveData.emit({'text':text,'data':updated_access})
    if (text === 'Add') {
      this.addSubModuleAccess(updated_access);
    } else {
      this.updateSubModuleAccess(updated_access);
    }
  }

  
  filterAccessList(response: any[]): any[] {
  
    const filteredResponse = response
      .map((item) => {
        const filteredAccess = item.access.filter((accessItem: any) => {
          const hasValidOperation = accessItem.operations.some((operation: any) => {
            return operation.view || operation.create || operation.delete || operation.update;
          });
          return hasValidOperation;
        });
  
        if (filteredAccess.length > 0) {
          return { ...item, access: filteredAccess };
        }
        return null;
      })
      .filter((item) => item !== null); // Remove null entries
  
    return filteredResponse;
  }
  
  




  
  addSubModuleAccess(updated_access: any) {
    this.api.postdesignationRoleAccess(updated_access).subscribe(
      (res) => {
        this.api.showSuccess(res['message']);
        setTimeout(() => {
          this.getAccessForDesignation(this.designation_id);
        }, 1000);
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    )
  }
  updateSubModuleAccess(updated_access: any) {
    this.api.putdesignationRoleAccess(updated_access, this.itemId).subscribe(
      (res) => {
        this.api.showSuccess(res['message']);
        setTimeout(() => {
          this.getAccessForDesignation(this.designation_id);
        }, 1000);
      },
      (error: any) => {
        this.api.showError(error.error.message);
      }
    )
  }


}
