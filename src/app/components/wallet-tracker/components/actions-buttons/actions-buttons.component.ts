import { Component } from '@angular/core';
import { ButtonsService, BtnFilter } from '../../services/buttons.service';


@Component({
             selector: 'actions-buttons',
             templateUrl: './actions-buttons.component.html',
             styleUrls: ['./actions-buttons.component.scss']
           })
export class ActionsButtonsComponent  {

  constructor(public buttonService: ButtonsService) {
  }

  public get showAdd() : boolean {
    return this.buttonService.add.visible && !!(this.buttonService.filter & BtnFilter.ADD);
  }

  public get showEdit() : boolean {
    return this.buttonService.edit.visible && !!(this.buttonService.filter & BtnFilter.EDIT);
  }

  public get showRemove() : boolean {
    return this.buttonService.remove.visible && !!(this.buttonService.filter & BtnFilter.REMOVE);
  }

  public get showSave() : boolean {
    return this.buttonService.save.visible && !!(this.buttonService.filter & BtnFilter.SAVE);
  }

  public get showCancel() : boolean {
    return this.buttonService.cancel.visible && !!(this.buttonService.filter & BtnFilter.CANCEL);
  }

}
