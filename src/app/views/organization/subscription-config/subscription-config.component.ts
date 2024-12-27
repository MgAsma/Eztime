import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscription-config',
  templateUrl: './subscription-config.component.html',
  styleUrls: ['./subscription-config.component.scss']
})
export class SubscriptionConfigComponent implements OnInit {

  pricingForm: FormGroup;

  constructor(private fb: FormBuilder) {
   
  }
  initializeForm(){
    this.pricingForm = this.fb.group({
      // Free Trial
      freeTrialUsers: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],
      freeTrialDuration: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],

      // Standard Plan - Monthly
      monthlyUsers: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],
      monthlyDuration: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
      ],

      // Standard Plan - Yearly
      yearlyUsers: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(3)],
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
    this.initializeForm()
  }
get f (){
  return this.pricingForm.controls;
}
  onSubmit(): void {
    if (this.pricingForm.valid) {
      console.log(this.pricingForm.value);
    }
  }

}
