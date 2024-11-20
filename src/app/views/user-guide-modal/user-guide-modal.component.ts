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
  imageSlides: any = []
  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.carouselImages();
  }
  carouselImages() {
    if (sessionStorage.getItem('user_role_name') === 'Admin') {
      this.imageSlides = [
        { image: '../../../assets/images/Screenshots/1.png' },
        { image: '../../../assets/images/Screenshots/2.png' },
        { image: '../../../assets/images/Screenshots/3.png' },
        { image: '../../../assets/images/Screenshots/4.png' },
        { image: '../../../assets/images/Screenshots/5.png' },
        { image: '../../../assets/images/Screenshots/6.png' },
        { image: '../../../assets/images/Screenshots/7.png' },
        { image: '../../../assets/images/Screenshots/8.png' },
        { image: '../../../assets/images/Screenshots/9.png' },
        { image: '../../../assets/images/Screenshots/10.png' },
        { image: '../../../assets/images/Screenshots/12.png' },
        { image: '../../../assets/images/Screenshots/13.png' },
        { image: '../../../assets/images/Screenshots/14.png' },
        { image: '../../../assets/images/Screenshots/15.png' },
        { image: '../../../assets/images/Screenshots/16.png' },
        { image: '../../../assets/images/Screenshots/17.png' },
        { image: '../../../assets/images/Screenshots/18-1.png' },
        { image: '../../../assets/images/Screenshots/18.png' },
        { image: '../../../assets/images/Screenshots/19.png' },
        { image: '../../../assets/images/Screenshots/20.png' },
        { image: '../../../assets/images/Screenshots/21.png' },
        { image: '../../../assets/images/Screenshots/22.png' }
      ];
    } else if (sessionStorage.getItem('user_role_name') === 'SuperAdmin') {
      this.imageSlides = [];
    }
    else if (sessionStorage.getItem('user_role_name') === 'Employee') {
      this.imageSlides = [
        { image: '../../../assets/images/Screenshots/9.png' },
        { image: '../../../assets/images/Screenshots/10.png' },
        { image: '../../../assets/images/Screenshots/12.png' },
        { image: '../../../assets/images/Screenshots/13.png' },
        { image: '../../../assets/images/Screenshots/14.png' },
        { image: '../../../assets/images/Screenshots/15.png' },
        { image: '../../../assets/images/Screenshots/16.png' },
        { image: '../../../assets/images/Screenshots/17.png' },
        { image: '../../../assets/images/Screenshots/18-1.png' },
      ]
    }
  }

  close(): void {
    this.bsModalRef.hide();
  }

}
