import { Injectable } from '@angular/core';
function _window(): any {
  return window;
}
declare var Razorpay: any;
@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  initiatePayment(options: any): void {
    const rzp = new Razorpay(options);
    rzp.open();
  }
}
