import { Injectable } from "@angular/core";

@Injectable()
export class ButtonsService {
    private _add  = new ButtonService('הוסף', false);
    private _edit = new ButtonService('ערוך', false);
    private _remove = new ButtonService('הסר', false);
    private _save = new ButtonService('שמור', false);
    private _cancel = new ButtonService('בטל', false);

    public filter : BtnFilter = BtnFilter.NONE;

    public get add() : ButtonService {
        return this._add;
    }

    public get edit() : ButtonService {
        return this._edit;
    }

    public get remove() : ButtonService {
        return this._remove;
    }

    public get save() : ButtonService {
        return this._save;
    }

    public get cancel() : ButtonService {
        return this._cancel;
    }

 }

export class ButtonService {
    constructor(public text: string, public visible: boolean) {
    }

    private _onClick : () => void = null as never;

    public onClick( callback : () => void) {
        this._onClick = callback;
    }

    public click() {
        if ( this._onClick ) {
            this._onClick();
        }
    }
}

export enum BtnFilter {
    NONE = 0,
    ADD = 1,
    EDIT = 2,
    REMOVE = 4,
    SAVE = 8,
    CANCEL = 16
}