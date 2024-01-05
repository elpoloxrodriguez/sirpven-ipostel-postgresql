import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { cloneDeep } from 'lodash';


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

  /*
  este es el nuevo metodo
  */
     // Obtener la fecha actual
     public  fechaActual = new Date();
 

  public mesEncode64
  public mesDecode64

  public contentHeader: object;
  public copyCodeStatus: boolean = false;
  public searchText;
  public data = []

  public BtnPago = false

  public  mesActual = new Date().getMonth()
   public meses = []

  // Private

  constructor() { }

  async ngOnInit() {
   
    this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
    // Obtener el mes y año resultantes
    var mesAnterior = this.fechaActual.getMonth(); // Ten en cuenta que los meses en JavaScript comienzan desde 0 (enero) hasta 11 (diciembre)
    var anioAnterior = this.fechaActual.getFullYear();
    console.log("Mes anterior:", mesAnterior, "Año anterior:", anioAnterior);
    this.mesEncode64 = btoa(anioAnterior+'-'+mesAnterior)
    this.mesDecode64 = anioAnterior+'-'+mesAnterior
  

     this.meses = [
      { name: "ENERO", fecha: anioAnterior, btn: this.BtnPago, mesx: 0, concepto: 'Declaraciones de Movilización de Piezas (Enero)', mes: btoa(anioAnterior+'-'+'01')}, 
      { name: "FEBRERO", fecha: anioAnterior, btn: this.BtnPago, mesx: 1, concepto: 'Declaraciones de Movilización de Piezas (Febrero)', mes: btoa(anioAnterior+'-'+'02')},
      { name: "MARZO", fecha: anioAnterior, btn: this.BtnPago, mesx: 2, concepto: 'Declaraciones de Movilización de Piezas (Marzo)', mes: btoa(anioAnterior+'-'+'03')},
      { name: "ABRIL", fecha: anioAnterior, btn: this.BtnPago, mesx: 3, concepto: 'Declaraciones de Movilización de Piezas (Abril)', mes: btoa(anioAnterior+'-'+'04')},
      { name: "MAYO", fecha: anioAnterior, btn: this.BtnPago, mesx: 4, concepto: 'Declaraciones de Movilización de Piezas (Mayo)', mes: btoa(anioAnterior+'-'+'05')},
      { name: "JUNIO", fecha: anioAnterior, btn: this.BtnPago, mesx: 5, concepto: 'Declaraciones de Movilización de Piezas (Junio)', mes: btoa(anioAnterior+'-'+'06')},
      { name: "JULO", fecha: anioAnterior, btn: this.BtnPago, mesx: 6, concepto: 'Declaraciones de Movilización de Piezas (Julio)', mes: btoa(anioAnterior+'-'+'07')},
      { name: "AGOSTO", fecha: anioAnterior, btn: this.BtnPago, mesx: 7, concepto: 'Declaraciones de Movilización de Piezas (Agosto)', mes: btoa(anioAnterior+'-'+'08')},
      { name: "SEPTIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 8, concepto: 'Declaraciones de Movilización de Piezas (Septiembre)', mes: btoa(anioAnterior+'-'+'09')},
      { name: "OCTUBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 9, concepto: 'Declaraciones de Movilización de Piezas (Octubre)', mes: btoa(anioAnterior+'-'+'10')},
      { name: "NOVIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 10, concepto: 'Declaraciones de Movilización de Piezas (Noviembre)', mes: btoa(anioAnterior+'-'+'11')},
      { name: "DICIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 11, concepto: 'Declaraciones de Movilización de Piezas (Diciembre)', mes: btoa(anioAnterior+'-'+'12')}
      ]
  
    for (let i = 0; i <= mesAnterior; i++) {
      this.data.push(this.meses[i])
    }
    
    this.data.map(e => {
     if (e.mesx == mesAnterior) {
      e.btn = true
     } else {
      e.btn = false
     }
    });



  }

  async ConsultarDeclaracion(){
    
  }


}
