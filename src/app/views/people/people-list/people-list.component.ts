import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  BreadCrumbsTitle: any = 'Employees list';
  allPeople = [];
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5, 10, 25, 50, 100];
  currentIndex: any;
  pNav: boolean = true;
  term: any = '';
  slno: any;
  people_name: any;
  designation: any;
  doj: any;
  role: any;
  center: any;
  photo: any;
  status: any;
  action: any;

  startDate: any
  selectedId: any;
  enabled: boolean = true;
  permissions: any = [];
  allRoleList: any = [];
  organizationList: any = [];
  user_id: any;
  params: any = {};
  org_id: any;
  sortValue: string = '';
  directionValue: string = '';
  arrowState: { [key: string]: boolean } = {
    first_name: false,
    designation_name: false,
    is_active: false,
  };
  arrow: boolean = false
  constructor(
    private api: ApiserviceService,
    private router: Router,
    private modalService: NgbModal,
    private location: Location,
    private common_service: CommonServiceService
  ) { }

  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();
  }
  ngOnInit(): void {
    this.term = '';
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.org_id = sessionStorage.getItem('organization_id')
    localStorage.removeItem('employee_id');
    this.getPeople(`?organization_id=${this.org_id}&page=${1}&page_size=${5}`);
    this.enabled = true;
    //  this.getUserControls()
  }

  changeYearStartDate(event: any) {
    //console.log(event.target.value)
    this.startDate = event.target.value
  }
  isDate(value: any): boolean {
    // Convert the value to a Date object
    const date = new Date(value);
    // Check if the converted date is valid and not NaN
    return date instanceof Date && !isNaN(date.getTime());
  }

  getFilterBaseUrl(): string {
    return `?organization_id=${this.org_id}&page=${this.page}&page_size=${this.tableSize}`;
  }

  getPeople(params:any) {
    this.api.getData(`${environment.live_url}/${environment.allEmployee}/${params}`).subscribe((data: any) => {
      const transformedData = data.results.map(item => {
        return Object.assign({}, item, item.user, { user: '' });
      });

      this.allPeople = transformedData;
      // console.log('all employees', this.allPeople)
      const noOfPages: number = data?.['total_pages']
      this.count = noOfPages * this.tableSize;
      this.count = data?.['total_no_of_record']
      this.page = data?.['current_page'];

    }, ((error) => {
      this.api.showError(error.error.error.message)
    })
    )
  }

  flattenUserData(data: any): any {
    return {
      ...data, // Main object properties
      ...data.user // Spread the user properties
    };
  }
  filterSearch() {
    if (this.term) {
      let query = this.getFilterBaseUrl()
      query += `&search=${this.term}`
      // console.log(this.term)
      this.getPeople(query);
    } else {
      // console.log(this.term,'no')
      this.getPeople(this.getFilterBaseUrl());
    }
  }
  delete(id: any) {
    this.api.deleteEmployees(id).subscribe((data: any) => {
      // if(data){
      this.api.showWarning('Employee deleted successfully!')
      this.allPeople = []
      this.ngOnInit()
      // }

    }, ((error: any) => {
      this.api.showError(error.error.error.message)
    }))
  }
  cardId(selected): any {
    this.selectedId = selected.id;
  }
  deleteCard(id) {
    this.delete(id)

  }
  editCard(id) {
    this.router.navigate([`/people/updatePeople/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event: any) {
    this.page = event;
    if (this.term) {
      let query = this.getFilterBaseUrl()
      query += `&search=${this.term}`
      // console.log(this.term)
      this.getPeople(query);
    } else {
      // console.log(this.term,'no')
      this.getPeople(this.getFilterBaseUrl());
    }
  }

  onTableSizeChange(event: any): void {
    if (event) {
      this.page =1;
      this.tableSize = Number(event.value);
      if (this.term) {
        let query = this.getFilterBaseUrl()
        query += `&search=${this.term}`
        // console.log(this.term)
        this.getPeople(query);
      } else {
        // console.log(this.term,'no')
        this.getPeople(this.getFilterBaseUrl());
      }
    }
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

  sort(direction: string, column: string) {
    Object.keys(this.arrowState).forEach(key => {
      this.arrowState[key] = false;
    });
    this.arrowState[column] = direction === 'asc';
    this.directionValue = direction;
    this.sortValue = column;
  }
  getContinuousIndex(index: number): number {
    return (this.page - 1) * this.tableSize + index + 1;
  }

  openUpdatePeople(id) {
    localStorage.removeItem('employee_id');
    localStorage.setItem('employee_id', id);
    this.router.navigate(['/people/updatePeople']);
  }
}
