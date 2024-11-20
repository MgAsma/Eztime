import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-guide-modal',
  templateUrl: './user-guide-modal.component.html',
  styleUrls: ['./user-guide-modal.component.scss']
})
export class UserGuideModalComponent implements OnInit {
  showIndicator = true;
  noWrapSlides = true;
  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }
  close(): void {
    this.bsModalRef.hide();
  }

}
