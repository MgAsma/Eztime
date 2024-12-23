import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialSuccessComponent } from '../trial-success/trial-success.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trial-alert',
  templateUrl: './trial-alert.component.html',
  styleUrls: ['./trial-alert.component.scss']
})
export class TrialAlertComponent implements OnInit {
  @Output() status: EventEmitter<any> = new EventEmitter<any>();
  @Input()title:any;
  @Input()message:any;
    modalStatus(data){
      if(data === 'ok'){
        this.openDialogue()
      }
    this.status.emit(data)
    }
  constructor(private modalService:NgbModal,
    private router:Router
  ) { }

  ngOnInit(): void {
  }
  openDialogue() {
    const modelRef = this.modalService.open(TrialSuccessComponent, {
      size: <any>'sm',
      backdrop: true,
      centered: true
    });
    modelRef.componentInstance.title = `Your free trial plan is activated successfully!`;
    modelRef.componentInstance.message = `Successful`;
    modelRef.componentInstance.status.subscribe(resp => {
      if (resp == "ok") {
        this.router.navigate(['transaction-history'])
        modelRef.close();
      }
      else {
        modelRef.close();
      }
    })
  }
}


