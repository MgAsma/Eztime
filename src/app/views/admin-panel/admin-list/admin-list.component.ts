import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {

  breadCrumbsTitle: string = 'Manage Admins';
  searchTerm: string = '';
  sortState: { [key: string]: boolean } = {};
  sortColumn: string = '';
  sortDirection: string = '';
  currentPage: number = 1;
  totalRecords: number = 0;
  pageSize: number = 5;
  tableSizes = [5, 10, 25, 50, 100];
  organizationData: any[] = [];
  userId: string;
  orgId: string;
  page: any;
  tableSize: any;
 
  constructor(
    private api: ApiserviceService,
    private modalService: NgbModal,
    private router: Router,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle(this.breadCrumbsTitle);
    this.userId = sessionStorage.getItem('user_id') || '';
    this.orgId = sessionStorage.getItem('org_id') || '';
    this.loadOrganizations({ page: 1, page_size: this.pageSize });
  }

  // onSort(column: string, direction: string): void {
  //   this.sortState = { [column]: direction === 'asc' };
  //   this.sortColumn = column;
  //   this.sortDirection = direction;
  //   this.loadOrganizations({
  //     page: this.currentPage,
  //     page_size: this.pageSize,
  //     sort: `${direction}:${column}`,
  //   });
  // }
  onSort(event): void {
    // this.sortState = { [column]: direction === 'asc' };
    // this.sortColumn = column;
    // this.sortDirection = direction;
    // this.loadOrganizations({
    //   page: this.currentPage,
    //   page_size: this.pageSize,
    //   sort: `${direction}:${column}`,
    // });
  }

  loadOrganizations(params: any): void {
    const queryParams = new URLSearchParams(params).toString();
    this.api
      .getData(`${environment.live_url}/${environment.organization}/?${queryParams}`)
      .subscribe(
        (res) => {
          if (res) {
            this.organizationData = res?.['results'] || [];
            this.totalRecords = res?.['total_no_of_record'] || 0;
            this.currentPage = res?.['current_page'] || 1;
          }
        },
        (error) => {
          this.api.showError(error?.error?.message);
        }
      );
  }

  searchOrganizations(event: Event): void {
    const input = (event.target as HTMLInputElement)?.value.trim();
    this.searchTerm = input || '';
    if (this.searchTerm.length >= 3 || !this.searchTerm) {
      this.loadOrganizations({
        page: 1,
        page_size: this.pageSize,
        search: this.searchTerm,
      });
    }
  }

  handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadOrganizations({
      page,
      page_size: this.pageSize,
      search: this.searchTerm,
    });
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = Number(event.value);
    this.loadOrganizations({
      page: 1,
      page_size: this.pageSize,
      search: this.searchTerm,
    });
  }

  confirmDelete(id: any): void {
    const modalRef = this.modalService.open(GenericDeleteComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.status.subscribe((response: string) => {
      if (response === 'ok') {
        this.onDelete(id);
        modalRef.close();
      } else {
        modalRef.close();
      }
    });
  }
  onItemsPerPageChange(event){}
  onPageChange(event){}
  onDelete(id: any): void {
    this.api
      .delete(`${environment.live_url}/${environment.organization}/${id}/`)
      .subscribe(
        () => {
          this.api.showWarning('Organization deleted successfully!');
          this.loadOrganizations({
            page: 1,
            page_size: this.pageSize,
            search: this.searchTerm,
          });
        },
        (error) => {
          this.api.showError(error?.error?.message);
        }
      );
  }

  onEdit(id: any): void {
    this.router.navigate([`/organization/updateOrg/${id}`]);
  }

  getContinuousIndex(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onSearch(event){
    const input = event?.target?.value?.trim() || ''; // Fallback to empty string if undefined
    if (input && input.length >= 3) {
      let term = input;
      const query = `?page=1&page_size=${this.tableSize}&search=${term}`;
      this.loadOrganizations(query)
    } if(!input) {
      const query = `?page=${this.page}&page_size=${this.tableSize}`;
      this.loadOrganizations(query)
    }
  }
}
