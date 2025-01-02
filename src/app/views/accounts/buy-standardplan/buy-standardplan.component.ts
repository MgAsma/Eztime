import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RazorpayService } from '../../../service/razorpay.service'
import { TrialSuccessComponent } from '../trial-success/trial-success.component';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-standardplan',
  templateUrl: './buy-standardplan.component.html',
  styleUrls: ['./buy-standardplan.component.scss']
})
export class BuyStandardplanComponent implements OnInit {
  monthly: boolean = true;

  state: any = [];
  userForm!: FormGroup
  monthlyAmount: any;
  monthlyName: any;
  yearlyAmount: any;
  yearlyName: any;
  selectedTypeName: any;
  igst: number;
  subscriptionData: any = [];
  selectedAmount: number
  selectedType: string = '1';
  orderId: any;
  orgId: any;
  igstPercentage:number;
  sgstPercentage:number;
  cgstPercentage:number;
  discount:number;

  constructor(
    private api: ApiserviceService,
    private fb: FormBuilder,
    private dialogue: MatDialog,
    private router: Router,
    private razorpay: RazorpayService,
    private modalService: NgbModal,
    private ngZone: NgZone,
  ) {


  }
  payment() {
    const RazorpayOptions: any = {
      description: 'Sample Rozarpay demo',
      currency: 'INR',
      amount: 1000,
      name: 'Asma',
      key: 'rzp_test_GxaJhvoS78ZpIz',
      //key:'rzp_test_Z6PoT6HRL71TiC',
      image: '../assets/images/logo.png',
      order_id: this.orderId,
      prefill: {
        name: 'Asma M',
        email: 'asma@ekfrazo.in',
        phone: '6230752181'
      },
      handler: function (response: any): any {
        if (response) {

          //console.log(response)
          successCallback(response)
        }
      },

      theme: {
        color: '#f37254'
      },
      modal: {
        ondismiss: () => {
          //console.log('dismissed')
        }
      }

    }
    const successCallback = (response: any) => {
      console.log("SUCCESS CALLBACK", response)
      // this.postPaymentDetails(response)

    }
    const failureCallback = (e: any) => {
      // //console.log(e)
      if (e) {
        // this.btnEnable = false
      }
    }

    Razorpay.open(RazorpayOptions, successCallback)


  }


  ngOnInit(): void {
    this.orgId = sessionStorage.getItem('organization_id');
    this.initForm()
    this.getState()
    this.getSubscription()
  }

  getSubscription() {
    this.api.getData(`${environment.live_url}/${environment.subscription_list}/`).subscribe((res) => {
      if (res) {
        console.log('selected plan', res)
        this.subscriptionData = res;
        this.subscriptionData?.forEach((item: any, i) => {
          if (item.name == 'Standard') {
            this.igstPercentage = item.igst
            this.sgstPercentage = item.sgst
            this.cgstPercentage = item.cgst
            item['plan_details'].forEach((item: any, i) => {
              if (item.yearly_or_monthly_name === 'Monthly') {
                this.monthlyAmount = item.amount;
                this.selectedAmount = item.amount;
                this.selectedTypeName = item.yearly_or_monthly_name
                this.monthlyName = item.yearly_or_monthly_name;
              } else if (item.yearly_or_monthly_name === 'Yearly') {
                // this.yearlyAmount = item.amount;
                this.yearlyName = item.yearly_or_monthly_name;
                this.discount = item.discount;
                let temp:any;
                this.yearlyAmount = temp = item.amount-(this.discount/100)*item.amount
                console.log(temp)
              }
            })

          }
        })
      }
    })

  }
  initForm() {
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
      state: ['', Validators.required]
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
      const amount = this.selectedAmount || this.monthlyAmount; // Monthly/Yearly price per user
      const noOfUsers = this.userForm.value.noOfUsers;

      // Calculate values when noOfUsers is valid
      this.subtotal = noOfUsers * amount;
      if (this.userForm.get('state')?.value === 4026) {
        this.cgst = parseFloat((this.subtotal * 0.09).toFixed(2)); // CGST with 2 decimal places
        this.sgst = parseFloat((this.subtotal * 0.09).toFixed(2)); // SGST with 2 decimal places
        this.totalPayable = parseFloat((this.subtotal + this.cgst + this.sgst).toFixed(2)); // Total payable with 2 decimal places
      } else {
        this.igst = parseFloat((this.subtotal * 0.18).toFixed(2)); // IGST with 2 decimal places
        this.totalPayable = parseFloat((this.subtotal + this.igst).toFixed(2)); // Total payable with 2 decimal places
      }
    }

  }


  onCancel(): void {
    this.dialogue.closeAll()
  }

  onMakePayment(): void {
    // console.log('Proceeding to payment...');
    // this.dialogue.closeAll()
    this.payment()
    //this.router.navigate(['/accounts/standardplan-history'])
  }
  setPaymentOption(option: boolean, amount: number, type: string, typeName: string): void {
    this.monthly = option;
    this.selectedAmount = amount
    this.selectedType = type;
    this.selectedTypeName = typeName;
    this.calculateTotal()
  }
  getState() {

    this.api.getData(`${environment.live_url}/${environment.state}/?country_id=${101}`).subscribe((res: any) => {
      if (res) {
        this.state = res
      }
    }, ((error) => {
      this.api.showError(error?.error.message)
    }))

  }

  razorpayTest() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      let data = {
        'total_amount': this.totalPayable
      }
      this.api.getRazorpayFromData(data).subscribe(
        (res: any) => {
          console.log(res)
          if (res) {
            this.openRazorpay(res);
          }
        },
        (error: any) => {
          console.log('error', error)
        }
      )
    }
  }

  openRazorpay(data: any) {
    console.log(data, 'data')
    const RazorpayOptions: any = {
      description: 'Sample Rozarpay demo',
      currency: 'INR',
      amount: data.amount * 100,
      name: 'Project Ace',
      key: environment.Razorpay_test_key,
      //key:'rzp_test_Z6PoT6HRL71TiC',
      image: '../assets/images/logo.png',
      order_id: data.razor_pay_order_id,
      prefill: {
        name: 'Asma M',
        email: 'asma@ekfrazo.in',
        phone: '6230752181'
      },
      handler: function (response: any): any {
        if (response) {
          //console.log(response)
          successCallback(response)
        }
      },

      theme: {
        color: '#f37254'
      },
      modal: {
        ondismiss: () => {
          //console.log('dismissed')
        }
      }

    }
    const successCallback = (response: any) => {
      console.log("SUCCESS CALLBACK", response)
      const reqData: any = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      };
      // this.postPaymentDetails(response)
      this.buySubscription(reqData)

    }
    const failureCallback = (e: any) => {
      if (e) {
        // this.btnEnable = false
      }
    }

    Razorpay.open(RazorpayOptions, successCallback)
  }

  buySubscription(datas: any) {
    let subscription_type: number;
    let plan_type: number;
    this.subscriptionData?.forEach((item1: any, i) => {
      if (item1.name == 'Standard') {
        subscription_type = item1.id;
        item1['plan_details'].forEach((item2: any, i) => {
          if (item2.yearly_or_monthly_name === this.selectedTypeName) {
            console.log(item2)
            plan_type = item2.id;
          }
        })

      }
    })
    let data = {
      "organization": this.orgId,
      "subscription_type": subscription_type,
      "plan_type": plan_type,
      "razorpay_payment_id": datas.razorpay_payment_id,
      "razorpay_order_id": datas.razorpay_order_id,
      "razorpay_signature": datas.razorpay_signature,
      "total_amount": this.totalPayable,
      "initial_amount": this.subtotal,
      "cgst": this.cgst != 0 ? this.cgst : null,
      "igst": this.igst != 0 ? this.igst : null,
      "sgst": this.sgst != 0 ? this.sgst : null,
      "added_users": this.userForm.value.noOfUsers
    }
    console.log(data)
    this.api.postStandardPlan(data).subscribe(
      (res: any) => {
        if (res) {
          setTimeout(() => {
            this.dialogue.closeAll()
            this.ngZone.run(() => {
              this.openDialogue()
            });
          }, 1000);
        }
      }, 
      (error:any)=>{
        console.log(error);
        this.api.showError(error);
      }
    )
  }

  openDialogue() {
    const modelRef = this.modalService.open(TrialSuccessComponent, {
      size: <any>'sm',
      backdrop: true,
      centered: true
    });
    modelRef.componentInstance.title = `Your Standard Plan has been activated successfully!`;
    modelRef.componentInstance.message = `Transaction Successful!`;
    modelRef.componentInstance.status.subscribe(resp => {
      if (resp == "ok") {
       this.router.navigate(['/accounts/standardplan-history'])
        modelRef.close();
      }
      else {
        modelRef.close();
      }
    })
  }


}
