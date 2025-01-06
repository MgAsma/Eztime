import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonServiceService } from '../../../service/common-service.service';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-subscription-config',
  templateUrl: './subscription-config.component.html',
  styleUrls: ['./subscription-config.component.scss']
})
export class SubscriptionConfigComponent implements OnInit {
  BreadCrumbsTitle:any='Subscription Configuration';
  pricingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private common_service: CommonServiceService,
    private api: ApiserviceService) {
   
  }
  initializeForm(){
    this.pricingForm = this.fb.group({
      // Free Trial
      freeTrialUsers: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)],
      ],
      freeTrialDuration: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)],
      ],

      // Standard Plan - Monthly
      monthlyUsers: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)],
      ],
      monthlyDuration: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],

      // Standard Plan - Yearly
      yearlyUsers: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)],
      ],
      yearlyDuration: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],
      yearlyDiscount: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],

      // GST Details
      cgstKarnataka: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],
      sgstKarnataka: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],
      igstOtherStates: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],
    });
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.initializeForm()
  }
get f (){
  return this.pricingForm.controls;
}
  // On form submission
  onSubmit() {
    if (this.pricingForm.invalid) {
      return;
    }

    const payload = this.preparePayload();
    this.api.postData(`${environment.live_url}/${environment.configure_subscription}/`,payload).subscribe(
      (response) => {
        this.api.showSuccess('Subscription details saved successfully');
      },
      (error) => {
        this.api.showError(error?.error?.message);
      }
    );
  }

  // Map the form data to the payload structure
  preparePayload() {
    const formValues = this.pricingForm.value;

    return {
      subscription_details: [
        {
          name: 'Free Trials',
          plan_details: [
            {
              plan_type: 3,
              max_users: formValues.freeTrialUsers,
              no_of_days: formValues.freeTrialDuration,
              amount: 0
            }
          ]
        },
        {
          name: 'Standard Plans',
          plan_details: [
            {
              plan_type: 1,
              max_users: formValues.monthlyUsers,
              no_of_days: formValues.monthlyDuration,
              amount: 30  // Assuming amount is 30 for monthly
            },
            {
              plan_type: 2,
              max_users: formValues.yearlyUsers,
              no_of_days: formValues.yearlyDuration,
              amount: 25  // Assuming amount is 25 for yearly
            }
          ]
        }
      ],
      csgst: formValues.cgstKarnataka,
      igst: null,  // Assuming IGST is null based on your structure
      sgst: formValues.sgstKarnataka
    };
  }

}
