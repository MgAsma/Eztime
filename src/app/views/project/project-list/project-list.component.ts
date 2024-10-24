import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  BreadCrumbsTitle: any = 'Project list';
  currentIndex: any;
  allProjectList: any = [];
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];

  term: any = '';
  slno: any;
  project: any;
  client: any;
  reporter: any;
  approver: any;
  start_date: any;
  end_date: any;
  status: any;
  task: any;
  action: any;
  selectedId: any;
  enabled: boolean = true;
  permissions: any = [];
  user_id: string;
  orgId: any;


  constructor(
    private modalService: NgbModal,
    private api: ApiserviceService,
    private router: Router,
    private location: Location,
    private common_service: CommonServiceService
  ) { }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('organization_id')
    this.user_id = sessionStorage.getItem('user_id');
    this.enabled = true;
    this.getProject();
    // this.getUserControls()
  }
  filterSearch() {
    this.api.getData(`${environment.live_url}/${environment.project_list}?user_id=${this.user_id}&search_key=${this.term}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&organization_id=${this.orgId}`).subscribe((data: any) => {
      if (data.result) {
        this.allProjectList = data.result.data;
        //console.log( this.allProjectList,"ALL")
        const noOfPages: number = data['result'].pagination.number_of_pages
        this.count = noOfPages * this.tableSize;
        this.page = data['result'].pagination.current_page;
      }

    }, ((error: any) => {
      this.api.showError(error.error.error.message)

    })

    )
  }
  getUserControls() {
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res: any) => {
      if (res.status_code !== '401') {
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else {
        this.api.showError("ERROR !")
      }
      //console.log(res,'resp from yet');

    }, (error => {
      this.api.showError(error.error.error.message)
    })

    )

    this.common_service.permission.subscribe(res => {
      const accessArr = res
      if (accessArr.length > 0) {
        accessArr.forEach(element => {
          if (element['PROJECTS']) {
            this.permissions = element['PROJECTS']
          }

        });

      }

    })
  }

  getProject() {
    let params = {
      page_number: this.page,
      data_per_page: this.tableSize,
      organization_id: this.orgId,
      // search_key: this.term,
      user_id: this.user_id
    }

    this.api.getProjectDetails(`${'organization'}=${this.orgId}`).subscribe((data: any) => {
      this.allProjectList = data;
      console.log( data,"ALL")
      // const noOfPages: number = data['result'].pagination.number_of_pages
      // this.count = noOfPages * this.tableSize;
      // this.page = data['result'].pagination.current_page;
    }, ((error: any) => {
      this.api.showError(error.error.error.message)

    })

    )
  }

  delete(id: any) {
    this.api.deleteProjectDetails(id).subscribe((data: any) => {
      // if (data) {
        this.allProjectList = []
        this.ngOnInit()
        this.api.showWarning('Project deleted successfully!')
      // }
    }, (error => {
      this.api.showError(error.error.error.message)
    })
    )
  }

  deleteCard(id) {
    this.delete(id)
    this.enabled = true;
  }
  editCard(id) {
    this.router.navigate([`/project/update/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.getProject();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize

    if (calculatedPageNo < this.page) {
      this.page = 1
    }
    this.getProject();
  }
  open(content) {
    if (content) {
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm',
        backdrop: true,
        centered: true
      });

      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          this.delete(content);
          modelRef.close();
        }
        else {
          modelRef.close();
        }
      })

    }
  }


  arrow: boolean = false
  directionValue: any = 'desc'

  sortValue: any = 'p_name'
  sort(direction: any, value: any) {
    if (direction == 'asc') {
      this.arrow = true
      this.directionValue = direction
      this.sortValue = value
    }
    else {
      this.arrow = false
      this.directionValue = direction
      this.sortValue = value
    }
  }

  getContinuousIndex(index: number): number {
    return (this.page - 1) * this.tableSize + index + 1;
  }
}
