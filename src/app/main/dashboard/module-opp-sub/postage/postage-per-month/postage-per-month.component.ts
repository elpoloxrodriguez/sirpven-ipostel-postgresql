import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { cloneDeep } from 'lodash';
import { GlobalConfig, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-postage-per-month',
  templateUrl: './postage-per-month.component.html',
  styleUrls: ['./postage-per-month.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostagePerMonthComponent implements OnInit {

  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();


  public mesEncode64 = btoa(this.anio+'-'+this.mes)
  public mesDecode64 = this.anio+'-'+this.mes

  public contentHeader: object;
  public copyCodeStatus: boolean = false;
  public searchText;
  public data = []

  public BtnPago = false

  public  mesActual = new Date().getMonth()
   public meses = [
    { name: "ENERO", fecha: this.anio, btn: this.BtnPago, mesx: 0, concepto: 'Declaraciones de Movilización de Piezas (Enero)', mes: btoa(this.anio+'-'+'01')}, 
    { name: "FEBRERO", fecha: this.anio, btn: this.BtnPago, mesx: 1, concepto: 'Declaraciones de Movilización de Piezas (Febrero)', mes: btoa(this.anio+'-'+'02')},
    { name: "MARZO", fecha: this.anio, btn: this.BtnPago, mesx: 2, concepto: 'Declaraciones de Movilización de Piezas (Marzo)', mes: btoa(this.anio+'-'+'03')},
    { name: "ABRIL", fecha: this.anio, btn: this.BtnPago, mesx: 3, concepto: 'Declaraciones de Movilización de Piezas (Abril)', mes: btoa(this.anio+'-'+'04')},
    { name: "MAYO", fecha: this.anio, btn: this.BtnPago, mesx: 4, concepto: 'Declaraciones de Movilización de Piezas (Mayo)', mes: btoa(this.anio+'-'+'05')},
    { name: "JUNIO", fecha: this.anio, btn: this.BtnPago, mesx: 5, concepto: 'Declaraciones de Movilización de Piezas (Junio)', mes: btoa(this.anio+'-'+'06')},
    { name: "JULO", fecha: this.anio, btn: this.BtnPago, mesx: 6, concepto: 'Declaraciones de Movilización de Piezas (Julio)', mes: btoa(this.anio+'-'+'07')},
    { name: "AGOSTO", fecha: this.anio, btn: this.BtnPago, mesx: 7, concepto: 'Declaraciones de Movilización de Piezas (Agosto)', mes: btoa(this.anio+'-'+'08')},
    { name: "SEPTIEMBRE", fecha: this.anio, btn: this.BtnPago, mesx: 8, concepto: 'Declaraciones de Movilización de Piezas (Septiembre)', mes: btoa(this.anio+'-'+'09')},
    { name: "OCTUBRE", fecha: this.anio, btn: this.BtnPago, mesx: 9, concepto: 'Declaraciones de Movilización de Piezas (Octubre)', mes: btoa(this.anio+'-'+'10')},
    { name: "NOVIEMBRE", fecha: this.anio, btn: this.BtnPago, mesx: 10, concepto: 'Declaraciones de Movilización de Piezas (Noviembre)', mes: btoa(this.anio+'-'+'11')},
    { name: "DICIEMBRE", fecha: this.anio, btn: this.BtnPago, mesx: 11, concepto: 'Declaraciones de Movilización de Piezas (Diciembre)', mes: btoa(this.anio+'-'+'12')}
    ]

  // Private

  constructor() { }

  async ngOnInit() {
   
    // console.log(mesActual)
    // console.log(this.anio)

    
    for (let i = 0; i <= this.mesActual; i++) {
      this.data.push(this.meses[i])
    }
    
    this.data.map(e => {
     if (e.mesx === this.mesActual) {
      e.btn = true
     } else {
      e.btn = false
     }
    });

  }

  async ConsultarDeclaracion(){
 
  }


}
