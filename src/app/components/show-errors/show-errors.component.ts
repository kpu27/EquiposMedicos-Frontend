
// show-errors.component.ts
import { Component, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
import { trigger,style,transition,animate,keyframes,query,stagger,group, state, animateChild } from '@angular/animations';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'show-errors',
    animations: [
        trigger(
          'enterAnimation', [
            transition(':enter', [
              style({transform: 'translateX(100%)', opacity: 0}),
              animate('300ms', style({transform: 'translateX(0)', opacity: 1}))
            ]),
            transition(':leave', [
              style({transform: 'translateX(0)', opacity: 1}),
              animate('300ms', style({transform: 'translateX(100%)', opacity: 0}))
            ])
          ]
        )
      ],
    template: `
    <div *ngIf="shouldShowErrors() || (!shouldShowErrors() && submited)" [@enterAnimation]> 
     <div style="position: relative;
     padding: 0.4rem 0.6rem !important;
     margin-bottom: 1rem;
     border: 1px solid transparent;
     transition: all .3s;
     border-radius: 0.375rem;" class="alert alert-danger" role="alert" *ngFor="let error of listOfErrors()">{{error}}</div>
   </div>
 `,
})
export class ShowErrorsDirective {

    private static readonly errorMessages = {
        'required': () => 'Este campo es requerido',
        'minlength': (params) => 'El numero minimo de caracteres es ' + params.requiredLength,
        'maxlength': (params) => 'El numero maximo de caracteres es ' + params.requiredLength,
        'pattern': (params) => 'El patron requerido acepta los siguientes caracteres: ' + params.requiredPattern,
        'maximoExedido' : (maximoExedido) => 'El campo no debe superar los ' + maximoExedido.prms.max + ' digitos',
        'minimoExedido' : (minimoExedido) => 'El campo no debe ser inferior a los ' + minimoExedido.prms.min + ' digitos',
        'years': (params) => params.message,
        'countryCity': (params) => params.message,
        'uniqueName': (params) => params.message,
        'telephoneNumbers': (params) => params.message,
        'telephoneNumber': (params) => params.message,
        'invalidEmail' : () => 'Debe insertar un correo valido',
        'mismatchedPasswords' : () => 'Las contraseñas deben coincidir',
        'isntPdf' :() => 'El tipo no es soportado'

    };

    @Input()
    private control: AbstractControlDirective | AbstractControl;
    @Input()
    public submited: Boolean;

    shouldShowErrors(): boolean {
        return this.control && 
            this.control.errors &&
            (this.control.dirty || this.control.touched);
    }

    listOfErrors(): string[] {
        if (this.control.errors != null) {
            return Object.keys(this.control.errors)
                .map(field => this.getMessage(field, this.control.errors[field]));
        } else { return []; }
    }

    private getMessage(type: string, params: any) {
        return ShowErrorsDirective.errorMessages[type](params);
    }

}
