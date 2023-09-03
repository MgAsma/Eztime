import { Component, EventEmitter,Input,OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-generic-delete',
  templateUrl: './generic-delete.component.html',
  styleUrls: ['./generic-delete.component.scss']
})
export class GenericDeleteComponent implements OnInit {
@Output() status: EventEmitter<any> = new EventEmitter<any>();
@Input()title:any;
@Input()message:any;
  modalStatus(data){
  this.status.emit(data)
  }

  ngOnInit(): void {
   
  }

}
