import { Component, EventEmitter,Input,OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generic-delete',
  templateUrl: './generic-delete.component.html',
  styleUrls: ['./generic-delete.component.scss']
})
export class GenericDeleteComponent implements OnInit {
@Output() status: EventEmitter<any> = new EventEmitter<any>();
@Output() comments: EventEmitter<any> = new EventEmitter<any>();
@Input()title:string;
@Input()message:string;
@Input()bulkAction:string;
declineForm:FormGroup;
constructor(private fb:FormBuilder){}
  modalStatus(data){
    if(data === 'ok' && this.message === 'Decline' && this.declineForm.invalid){
      this.declineForm.markAllAsTouched()
    }else{
      
      if(data === 'ok' && this.message === 'Decline'){
        this.comments.emit(this.declineForm.value.comments)
      }
      this.status.emit(data)
    }

  }
  get f(){
    return this.declineForm.controls
  }

  ngOnInit(): void {
    this.initForm()
  }
 initForm(){
  this.declineForm = this.fb.group({
    comments:['',[Validators.required,Validators.pattern(/^\S.*/)]]
  })
 }
}
