import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { SortPipe } from 'src/app/sort/sort.pipe';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
  providers: [
    SortPipe
  ]
})
export class DepartmentListComponent implements OnInit {
  BreadCrumbsTitle: any = 'Departments';
  public searchText: any;
  allDepartmentList = [];
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5, 10, 25, 50, 100];
  currentIndex: any;
  term: any = '';
  selectedId: any;
  enabled: boolean = true;
  // @Input() selectedSortValue1:Subject<any> = new Subject<any>();
  // @Input() selectedDirection1:Subject<any> = new Subject<any>()
  sortValue: string = '';
  directionValue: string = '';
  arrowState: { [key: string]: boolean } = {
    department_name: false,
    created_datetime: false,
  };
  params: { page_number: number; data_per_page: number; };
  permissions: any = [];
  user_id: string;
  org_id: string;
  filterBaseUrl: any;
  constructor(private api: ApiserviceService, private router: Router,
    private modalService: NgbModal,
    private location: Location,
    private common_service: CommonServiceService,
  ) { }


  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.org_id = sessionStorage.getItem('organization_id');
    this.getAllDepartmentList(`?organization_id=${this.org_id}&page=${1}&page_size=${5}`);
    // this.filterBaseUrl = `${environment.live_url}/department/?organization_id=${this.org_id}&page=${this.page}&page_size=${this.tableSize}`
    // this.getDepartment(`search_key=${this.term}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&org_ref_id=${this.org_id}`); 
    this.enabled = true;
  }
  getFilterBaseUrl(): string {
    return `?organization_id=${this.org_id}&page=${this.page}&page_size=${this.tableSize}`;
  }

  getAllDepartmentList(params: any) {
    this.api.getData(`${environment.live_url}/${environment.department}/${params}`).subscribe(
      (res: any) => {
        this.allDepartmentList = res.results;
        const noOfPages: number = res?.['total_pages']
        this.count = noOfPages * this.tableSize;
        this.count = res?.['total_no_of_record']
        this.page = res?.['current_page'];
      }
    )
  }
  
  delete(id: any) {
    this.api.deleteDepartmentList(id).subscribe((data: any) => {
      this.ngOnInit();
      this.api.showWarning('Department deleted successfully!')
      this.ngOnInit()
    }, ((error) => {
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
    this.router.navigate([`/department/update/${id}/${this.page}/${this.tableSize}`])
  }

  filterSearch() {
    // console.log('this.term.trim()',this.term.trim())
    if (this.term) {
      if (this.term.length >= 3) {
        console.log(this.term.length);
        let query = this.getFilterBaseUrl()
        query += `&search=${this.term}`
        this.getAllDepartmentList(query);
      }

    } else {
      this.getAllDepartmentList(this.getFilterBaseUrl());
    }
  }

  onTableDataChange(event: any) {
    this.page = event;
    if (this.term) {
      let query = this.getFilterBaseUrl()
      query += `&search=${this.term}`
      // console.log(this.term)
      this.getAllDepartmentList(query);
    } else {
      // console.log(this.term,'no')
      this.getAllDepartmentList(this.getFilterBaseUrl());
    }
  }

  onTableSizeChange(event: any): void {
    if (event) {
      this.page = 1;
      this.tableSize = Number(event.value);
      if (this.term) {
        let query = this.getFilterBaseUrl()
        query += `&search=${this.term}`
        // console.log(this.term)
        this.getAllDepartmentList(query);
      } else {
        // console.log(this.term,'no')
        this.getAllDepartmentList(this.getFilterBaseUrl());
      }
    }
  }

  arrow: boolean = false
  sort(direction: string, column: string) {
    Object.keys(this.arrowState).forEach(key => {
      this.arrowState[key] = false;
    });
    this.arrowState[column] = direction === 'asc';
    this.directionValue = direction;
    this.sortValue = column;
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
  getContinuousIndex(index: number): number {
    return (this.page - 1) * this.tableSize + index + 1;
  }

}
