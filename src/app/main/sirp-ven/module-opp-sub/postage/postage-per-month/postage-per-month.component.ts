import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";

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

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  /*
  este es el nuevo metodo
  */
  // Obtener la fecha actual
  public fechaActual = new Date();


  public mesEncode64
  public mesDecode64

  public contentHeader: object;
  public copyCodeStatus: boolean = false;
  public searchText;
  public Xdata = []

  public BtnPago = false

  public mesActual = new Date().getMonth()

  public nuevafechaActual = new Date().getFullYear()
  
  public meses = []

  anios: number[] = [];

  public token

  // Private

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.generarListaAños();
    await this.ConsultarDeclaracion(this.token.Usuario[0].id_opp)

    // this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
    // // Obtener el mes y año resultantes
    // var mesAnterior = this.fechaActual.getMonth(); // Ten en cuenta que los meses en JavaScript comienzan desde 0 (enero) hasta 11 (diciembre)
    // var anioAnterior = this.fechaActual.getFullYear()
    // // console.log("Mes anterior:", mesAnterior, "Año anterior:", anioAnterior);
    // this.mesEncode64 = btoa(anioAnterior+'-'+mesAnterior)
    // this.mesDecode64 = anioAnterior+'-'+mesAnterior


    //  this.meses = [
    //   { name: "ENERO", fecha: anioAnterior, btn: this.BtnPago, mesx: 0, concepto: 'Declaraciones de Movilización de Piezas (Enero)', value: anioAnterior+'-'+'01' , mes: btoa(anioAnterior+'-'+'01')}, 
    //   { name: "FEBRERO", fecha: anioAnterior, btn: this.BtnPago, mesx: 1, concepto: 'Declaraciones de Movilización de Piezas (Febrero)', value: anioAnterior+'-'+'02' , mes: btoa(anioAnterior+'-'+'02')},
    //   { name: "MARZO", fecha: anioAnterior, btn: this.BtnPago, mesx: 2, concepto: 'Declaraciones de Movilización de Piezas (Marzo)',  value: anioAnterior+'-'+'03' ,mes: btoa(anioAnterior+'-'+'03')},
    //   { name: "ABRIL", fecha: anioAnterior, btn: this.BtnPago, mesx: 3, concepto: 'Declaraciones de Movilización de Piezas (Abril)', value: anioAnterior+'-'+'04' , mes: btoa(anioAnterior+'-'+'04')},
    //   { name: "MAYO", fecha: anioAnterior, btn: this.BtnPago, mesx: 4, concepto: 'Declaraciones de Movilización de Piezas (Mayo)', value: anioAnterior+'-'+'05' , mes: btoa(anioAnterior+'-'+'05')},
    //   { name: "JUNIO", fecha: anioAnterior, btn: this.BtnPago, mesx: 5, concepto: 'Declaraciones de Movilización de Piezas (Junio)', value: anioAnterior+'-'+'6' , mes: btoa(anioAnterior+'-'+'06')},
    //   { name: "JULO", fecha: anioAnterior, btn: this.BtnPago, mesx: 6, concepto: 'Declaraciones de Movilización de Piezas (Julio)', value: anioAnterior+'-'+'7' , mes: btoa(anioAnterior+'-'+'07')},
    //   { name: "AGOSTO", fecha: anioAnterior, btn: this.BtnPago, mesx: 7, concepto: 'Declaraciones de Movilización de Piezas (Agosto)', value: anioAnterior+'-'+'8' , mes: btoa(anioAnterior+'-'+'08')},
    //   { name: "SEPTIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 8, concepto: 'Declaraciones de Movilización de Piezas (Septiembre)', value: anioAnterior+'-'+'9' , mes: btoa(anioAnterior+'-'+'09')},
    //   { name: "OCTUBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 9, concepto: 'Declaraciones de Movilización de Piezas (Octubre)', value: anioAnterior+'-'+'10' , mes: btoa(anioAnterior+'-'+'10')},
    //   { name: "NOVIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 10, concepto: 'Declaraciones de Movilización de Piezas (Noviembre)', value: anioAnterior+'-'+'11' , mes: btoa(anioAnterior+'-'+'11')},
    //   { name: "DICIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 11, concepto: 'Declaraciones de Movilización de Piezas (Diciembre)', value: anioAnterior+'-'+'12' , mes: btoa(anioAnterior+'-'+'12')}
    //   ]

    // // for (let i = 0; i <= mesAnterior; i++) {
    // //   this.data.push(this.meses[i])
    // // }

    // let array = [
    //   { fecha: '2023-12', monto:500}
    // ]


    // this.meses.map(e => {
    //   e.monto = 0
    //  if (e.mesx == mesAnterior) {
    //   e.btn = true
    //  } else {
    //   e.btn = false
    //  }
    //  array.map(ex => {
    //   if (ex.fecha == e.value){
    //     e.monto = ex.monto
    //   }
    //   return e
    //  });
    // });



  }

  generarListaAños() {
    const añoActual = new Date().getFullYear();
    for (let año = 2023; año <= añoActual; año++) {
      this.anios.push(año);
    }
  }

  validar(event: any) {
    console.log(event)
  }

  async ConsultarDeclaracion(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_MovimientosPiezasMeses"
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        this.fechaActual.setMonth(this.fechaActual.getMonth() - 1);
        var mesAnterior = this.fechaActual.getMonth(); // Ten en cuenta que los meses en JavaScript comienzan desde 0 (enero) hasta 11 (diciembre)
        var anioAnterior = this.fechaActual.getFullYear()
        this.mesEncode64 = btoa(anioAnterior + '-' + mesAnterior)
        this.mesDecode64 = anioAnterior + '-' + mesAnterior


        this.meses = [
          { name: "ENERO", fecha: anioAnterior, btn: this.BtnPago, mesx: 0, value: anioAnterior + '-' + '01', mes: btoa(anioAnterior + '-' + '01') },
          { name: "FEBRERO", fecha: anioAnterior, btn: this.BtnPago, mesx: 1, value: anioAnterior + '-' + '02', mes: btoa(anioAnterior + '-' + '02') },
          { name: "MARZO", fecha: anioAnterior, btn: this.BtnPago, mesx: 2,  value: anioAnterior + '-' + '03', mes: btoa(anioAnterior + '-' + '03') },
          { name: "ABRIL", fecha: anioAnterior, btn: this.BtnPago, mesx: 3, value: anioAnterior + '-' + '04', mes: btoa(anioAnterior + '-' + '04') },
          { name: "MAYO", fecha: anioAnterior, btn: this.BtnPago, mesx: 4,  value: anioAnterior + '-' + '05', mes: btoa(anioAnterior + '-' + '05') },
          { name: "JUNIO", fecha: anioAnterior, btn: this.BtnPago, mesx: 5,  value: anioAnterior + '-' + '6', mes: btoa(anioAnterior + '-' + '06') },
          { name: "JULO", fecha: anioAnterior, btn: this.BtnPago, mesx: 6, value: anioAnterior + '-' + '7', mes: btoa(anioAnterior + '-' + '07') },
          { name: "AGOSTO", fecha: anioAnterior, btn: this.BtnPago, mesx: 7,  value: anioAnterior + '-' + '8', mes: btoa(anioAnterior + '-' + '08') },
          { name: "SEPTIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 8, value: anioAnterior + '-' + '9', mes: btoa(anioAnterior + '-' + '09') },
          { name: "OCTUBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 9, value: anioAnterior + '-' + '10', mes: btoa(anioAnterior + '-' + '10') },
          { name: "NOVIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 10,  value: anioAnterior + '-' + '11', mes: btoa(anioAnterior + '-' + '11') },
          { name: "DICIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 11, value: anioAnterior + '-' + '12', mes: btoa(anioAnterior + '-' + '12') }
        ]

        for (let i = 0; i <= mesAnterior; i++) {
          this.Xdata.push(this.meses[i])
        }

        let array = data.Cuerpo

        this.meses.map(e => {
          e.monto = 0
          e.piezas = 0
          if (e.mesx == mesAnterior) {
            e.btn = true
          } else {
            e.btn = false
          }
          array.map(ex => {
            if (ex.mes == e.value) {
              e.monto = this.utilService.ConvertirMoneda(ex.total_monto_causado)
              e.piezas = ex.total_piezas
            }
            return e
          });
        });
        console.log(this.meses)
      },
      (error) => {
        console.log(error)
      })
  }


}


