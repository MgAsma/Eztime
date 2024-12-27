import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-standardplan',
  templateUrl: './buy-standardplan.component.html',
  styleUrls: ['./buy-standardplan.component.scss']
})
export class BuyStandardplanComponent implements OnInit {
  monthly: boolean = true;
  state:any = [];
  userForm!:FormGroup
  constructor(
    private api:ApiserviceService,
    private fb:FormBuilder,
    private dialogue:MatDialog,
    private router:Router
  ) { }
  

  ngOnInit(): void {
    this.initForm()
    this.getState() 
  }
  initForm(){
    this.userForm = this.fb.group({
      noOfUsers: [
        '', 
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10000),
          Validators.pattern(/^[1-9][0-9]*$/) // Regex for no spaces, no leading zeros, and only digits
        ]
      ],
      state:['']
    })
  }
  noOfUsers: number = 0;
  subtotal: number = 0;
  cgst: number = 0;
  sgst: number = 0;
  totalPayable: number = 0;
  selectedState: string = 'Karnataka';

  calculateTotal(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.subtotal = 0;
      this.cgst = 0;
      this.sgst = 0;
      this.totalPayable = 0;
    } else {
      const pricePerUser = 30; // Monthly price per user
      const noOfUsers = this.userForm.value.noOfUsers;
  
        // Calculate values when noOfUsers is valid
        this.subtotal = noOfUsers * pricePerUser;
        this.cgst = parseFloat((this.subtotal * 0.09).toFixed(2)); // CGST with 2 decimal places
        this.sgst = parseFloat((this.subtotal * 0.09).toFixed(2)); // SGST with 2 decimal places
        this.totalPayable = parseFloat((this.subtotal + this.cgst + this.sgst).toFixed(2)); // Total payable with 2 decimal places
      }
    
  }
  

  onCancel(): void {
   this.dialogue.closeAll()
  }

  onMakePayment(): void {
    console.log('Proceeding to payment...');
    this.dialogue.closeAll()
    this.router.navigate(['/accounts/standardplan-history'])
  }
  setPaymentOption(option: boolean): void {
    this.monthly = option;
  }
   getState() {
      
      this.api.getData(`${environment.live_url}/${environment.state}/?country_id=${101}`).subscribe((res: any) => {
        if(res){
        this.state = res
        }
      }, ((error) => {
        this.api.showError(error?.error.message)
      }))
    
    }
}
