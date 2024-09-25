import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TimesheetService } from 'src/app/service/timesheet.service';

@Component({
  selector: 'app-yet-approve',
  templateUrl: './yet-approve.component.html',
  styleUrls: ['./yet-approve.component.scss']
})
export class YetApproveComponent implements OnInit {
  @Output() buttonClick = new EventEmitter<any>();
  @Output() filter: any = new EventEmitter<any>();
  slno: any;
  date: any;
  people: any;
  timesheet: any;
  time: any;
  savedon: any;
  status: any;
  action: any;
  term: any = '';
  yetToApproveAll: any = [];
  page: any = 1;
  count: any = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  entryPoint: any;
  user_id: string;
  accessConfig: any = [];
  orgId: any;
  @Input() data: any;
  @Input() totalCount: { 'pageCount': any, 'currentPage': any };

  paginationConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  }
 
  constructor(private api: ApiserviceService, private _timeSheetService: TimesheetService, private modalService: NgbModal,
    private _timesheet: TimesheetService, private cdref: ChangeDetectorRef, private common_service: CommonServiceService) { }


  ngOnInit(): void {
    // this.entryPoint = JSON.parse(sessionStorage.getItem('entryPoint'))
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'));
    this.orgId = sessionStorage.getItem('org_id')
    this.getUserControls()
  }


  ngOnChanges(changes: SimpleChange): void {
    if (changes['data'].currentValue) {
      this.yetToApproveAll = changes['data'].currentValue;
    }
    if (changes['totalCount'].currentValue) {
      this.paginationConfig.totalItems = changes['totalCount'].currentValue.pageCount * changes['totalCount'].currentValue.itemsPerPage;
      this.paginationConfig.currentPage = changes['totalCount'].currentValue.currentPage;
      this.paginationConfig.itemsPerPage = changes['totalCount'].currentValue.itemsPerPage;
      this.tableSize = changes['totalCount'].currentValue.itemsPerPage;
      this.page = changes['totalCount'].currentValue.currentPage;
      this.count = changes['totalCount'].currentValue.pageCount * changes['totalCount'].currentValue.itemsPerPage;
    }
    this.cdref.detectChanges();
  }
  getUserControls() {
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&organization_id=${this.orgId}&pagination=TRUE`).subscribe((res: any) => {
      if (res.status_code !== '401') {
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else {
        this.api.showError("ERROR !")
      }

    }

    )
    this.common_service.permission.subscribe(res => {
      const accessArr = res
      if (accessArr.length > 0) {
        accessArr.forEach((element, i) => {
          if (element['TODAY_APPROVAL_TIMESHEET']) {
            this.accessConfig = element['TODAY_APPROVAL_TIMESHEET']
          }

        });
      }

    })

  }

  delete(item: any) {
    let params = {
      module: "TIMESHEET",
      menu: "TODAY_APPROVAL_TIMESHEET",
      method: "DELETE",
      user_id: this.user_id
    }
    this._timeSheetService.deleteTodaysApproval(item.id, params).subscribe((data: any) => {
      this.api.showWarning('Deleted successfully')
      let tableData = {
        search_key: this.term,
        page: this.page,
        tableSize: this.tableSize
      }
      this.buttonClick.emit(tableData)
    }, error => {
      //console.log(error);

    })

  }

  filterSearch() {
    let tableData = {
      search_key: this.term,
      page: this.page,
      tableSize: this.tableSize
    }
    this.buttonClick.emit(tableData)
  }
  onTableDataChange(event: any) {
    this.page = event;
    let tableData = {
      search_key: this.term,
      page: this.page,
      tableSize: this.tableSize
    }
    this.buttonClick.emit(tableData)
  }
  onTableSizeChange(event: any): void {
    if(event){
    this.count = 0
    const calculatedPageNo = this.count / this.tableSize
    if (calculatedPageNo < this.page) {
      this.page = 1
    }
    let tableData = {
      search_key: this.term,
      page: this.page,
      tableSize: this.tableSize
    }
    alert(tableData.tableSize)
    this.buttonClick.emit(tableData)
  }
  }
  open(content) {
    if (content) {
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'md',
        backdrop: true,
        centered: true
      });

      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          //console.log(content,"ID")
          this.delete(content);
          modelRef.close();
        }
        else {
          modelRef.close();
        }
      })

    }



  }
  openDialogue(content, status) {
    if (content) {
      const selectedStatus = status === 'APPROVED' ? 'approve' : 'decline'
      const confirmText = status === 'APPROVED' ? 'Approve' : 'Decline'
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
        ,
        backdrop: true,
        centered: true
      });
      modelRef.componentInstance.title = `Are you sure do you want to ${selectedStatus}`;
      modelRef.componentInstance.message = `${confirmText}`;
      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          this.updateStatus(content, status);
          modelRef.close();
        }
        else {
          modelRef.close();
        }
      })

    }
  }
  updateStatus(content, status) {
    //let currStatus =  status === 'Approved'?  "APPROVED": "DECLINED";
    let currMethod = status === 'DECLINED' ? 'REJECT' : 'ACCEPT'

    let data = {
      user_id: this.user_id,
      update: "TRUE",
      approved_by_manager_id: this.user_id,
      module: "TIMESHEET",
      menu: "TODAY_APPROVAL_TIMESHEET",
      method: currMethod,
      time_sheet_id_list: [],
      time_sheet_id: content,
      approved_state: status
    }
    this._timesheet.updateStatus(data).subscribe(res => {
      if (res) {
        const toastText = status === 'DECLINED' ? 'declined' : 'approved'
        this.api.showSuccess(`Timesheet ${toastText} successfully`)
        let tableData = {
          search_key: this.term,
          page: this.page,
          tableSize: this.tableSize
        }
        this.buttonClick.emit(tableData)
      }

    })
  }
  getContinuousIndex(index: number): number {
    return (this.page - 1) * this.tableSize + index + 1;
  }
}
