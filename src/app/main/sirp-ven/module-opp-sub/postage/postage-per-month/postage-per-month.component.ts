import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-postage-per-month',
  templateUrl: './postage-per-month.component.html',
  styleUrls: ['./postage-per-month.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostagePerMonthComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';

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


  public rowsDeclaracionPiezas = []
  public DeclaracionPiezas = []


  public BtnPago: boolean = false

  public mesActual = new Date().getMonth()

  public nuevafechaActual = new Date().getFullYear()

  public meses = []

  public anios: number[] = [];

  public idOpp

  public token

  public color = ''

  public MontoCausadoX
  public selected: number = 0
  public TotalPiezas: number = 0
  public MontoPetroTotalSumaServicio: number = 0


  // Private

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOpp = this.token.Usuario[0].id_opp
    this.generarListaAños();
    await this.ConsultarDeclaracion(this.token.Usuario[0].id_opp)
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
    this.sectionBlockUI.start('Cargando datos, por favor Espere!!!');
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
          { name: "MARZO", fecha: anioAnterior, btn: this.BtnPago, mesx: 2, value: anioAnterior + '-' + '03', mes: btoa(anioAnterior + '-' + '03') },
          { name: "ABRIL", fecha: anioAnterior, btn: this.BtnPago, mesx: 3, value: anioAnterior + '-' + '04', mes: btoa(anioAnterior + '-' + '04') },
          { name: "MAYO", fecha: anioAnterior, btn: this.BtnPago, mesx: 4, value: anioAnterior + '-' + '05', mes: btoa(anioAnterior + '-' + '05') },
          { name: "JUNIO", fecha: anioAnterior, btn: this.BtnPago, mesx: 5, value: anioAnterior + '-' + '06', mes: btoa(anioAnterior + '-' + '06') },
          { name: "JULIO", fecha: anioAnterior, btn: this.BtnPago, mesx: 6, value: anioAnterior + '-' + '07', mes: btoa(anioAnterior + '-' + '07') },
          { name: "AGOSTO", fecha: anioAnterior, btn: this.BtnPago, mesx: 7, value: anioAnterior + '-' + '08', mes: btoa(anioAnterior + '-' + '08') },
          { name: "SEPTIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 8, value: anioAnterior + '-' + '09', mes: btoa(anioAnterior + '-' + '09') },
          { name: "OCTUBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 9, value: anioAnterior + '-' + '10', mes: btoa(anioAnterior + '-' + '10') },
          { name: "NOVIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 10, value: anioAnterior + '-' + '11', mes: btoa(anioAnterior + '-' + '11') },
          { name: "DICIEMBRE", fecha: anioAnterior, btn: this.BtnPago, mesx: 11, value: anioAnterior + '-' + '12', mes: btoa(anioAnterior + '-' + '12') }
        ]

        for (let i = 0; i <= mesAnterior; i++) {
          this.Xdata.push(this.meses[i])
        }
        this.meses.map(e => {
          e.monto = 0
          e.montox = 0
          e.piezas = 0
          if (e.mesx == mesAnterior) {
            e.btn = true
          } else {
            e.btn = false
          }
          data.Cuerpo.map(ex => {
            if (ex.mes == e.value) {
              e.monto = this.utilService.ConvertirMoneda(ex.total_monto_causado)
              e.montox = parseFloat(ex.total_monto_causado)
              e.piezas = ex.total_piezas
            }
            return e
          });
        });
        this.sectionBlockUI.stop()
      },
      (error) => {
        console.log(error)
      })
  }

  rutaDeclarar(mes: any) {
    this.router.navigate([`/postage/movement-of-parts/${mes}`]);
  }


  async rutaVisualizar(modal: any, mes: any) {
    await this.consultarMovilizacion(mes)
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  transform(fecha: string): string {
    const partesFecha = fecha.split('-');
    const year = parseInt(partesFecha[0], 10);
    const month = parseInt(partesFecha[1], 10) - 1; // Restar 1 porque en JavaScript los meses van de 0 a 11
    const date = new Date(year, month, 1);
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[date.getMonth()];
  }

  async consultarMovilizacion(mes: any) {
    this.DeclaracionPiezas = []
    this.rowsDeclaracionPiezas = []
    this.xAPI.funcion = "IPOSTEL_R_MovilizacionPiezas_visualizar"
    this.xAPI.parametros = this.idOpp + ',' + mes
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.mes = this.transform(e.mes)
          e.montox = parseFloat(e.monto_causado)
          e.tarifa_servicio = this.utilService.ConvertirMoneda(e.tarifa_servicio);
          e.monto_fpo = this.utilService.ConvertirMoneda(e.monto_fpo);
          e.monto_causado = this.utilService.ConvertirMoneda(e.monto_causado);
          this.DeclaracionPiezas.push(e)
        });
        this.rowsDeclaracionPiezas = this.DeclaracionPiezas;
         let piezas = this.DeclaracionPiezas.map(item => item.cantidad_piezas ? item.cantidad_piezas : 0).reduce((prev, curr) => prev + curr, 0);
         this.TotalPiezas = piezas.toLocaleString()
        this.selected = this.DeclaracionPiezas.length
        let montopiezas = this.DeclaracionPiezas.map(item => item.montox ? item.montox : 0).reduce((prev, curr) => prev + curr, 0);
        this.MontoCausadoX = this.utilService.ConvertirMoneda(montopiezas);
      },
      (error) => {
        console.log(error)
      }
    )

  }


}


