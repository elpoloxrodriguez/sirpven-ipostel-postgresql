import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { UtilService } from '@core/services/util/util.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PdfService } from '@core/services/pdf/pdf.service';
import { FilateliaService } from '@core/services/pdf/filatelia.service';
import { FilateliaCrear, GuardarQRs, QrContenido } from '@core/services/empresa/form-opp.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale-fpp',
  templateUrl: './sale-fpp.component.html',
  styleUrls: ['./sale-fpp.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class SaleFppComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public xFilatelida: FilateliaCrear = {
    TipoEstampilla: undefined,
    ValorEstampilla: undefined,
    CostoEstampilla: 0,
    ReceptorEstampilla: undefined,
    ObservacionEstampilla: undefined,
    TipoReceptorEstampilla: undefined,
    TokenTiraje: '',
    status: 0,
    Qr: ''
  }

  public ListaTiraje: GuardarQRs = {
    tipo: 0,
    valor: 0,
    tipoReceptor: 0,
    receptor: 0,
    costo: 0,
    correlativo: 0,
    observacion: '',
    tiraje: '',
    QR: [],
    userCreated: 0,
    dateCreated: ''
  }

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public searchValue = '';
  public searchValueViewTiraje = ''
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public rowsEmpresas;
  private tempDataEmpresas = [];

  public rowsTiraje = []
  public tempDataTiraje = []

  public rowsViewTirajeQR = []
  public tempDataViewTirajeQR = []

  public titleModalTiraje


  public SelectTipoEstampilla = [
    { id: 1, name: 'A1', valor: 1, texto: '1 Bs' },
    { id: 2, name: 'A', valor: 10, texto: '10 Bs' },
    { id: 3, name: 'B', valor: 50, texto: '50 Bs' },
    { id: 4, name: 'C', valor: 100, texto: '100 Bs' },
    { id: 5, name: 'D', valor: 500, texto: '500 Bs' },
  ]

  public SelectTipoReceptorEstampilla = [
    { id: 1, name: 'Operador Postal Privado' },
    { id: 2, name: 'Oficina Postal Telegrafico' },
    { id: 3, name: 'Coleccionista' },
    // { id: 4, name: 'Persona Natural' },
  ]

  public SelectValorEstampilla = [
    { id: 1, name: '1 Bs' },
    { id: 2, name: '10 Bs' },
    { id: 3, name: '20 Bs' },
    { id: 4, name: '50 Bs' },
    { id: 5, name: '100 Bs' },
    { id: 6, name: '500 Bs' },
  ]

  public SelectOPP
  public SelectReceptores

  public resultado

  public TotalTirajesQR = 0
  public valorQR = 0

  public tokenUser
  public idUser

  public Qr = []
  public token
  public CantidadQr

  public CantidadQrtiraje = []

  public TokenTiraje: string

  public CantidadQrTipoEstampilla

  public i = 0
  public arregloQR = []

  public miArreglo = []

  public ListaTirajesQR = []

  public VerTirajeQR = []

  public BtnShowTiraje = false

  public showOPP = false
  public showCOL = false
  public showOPT = false

  public loginForm: FormGroup

  constructor(
    private router: Router,
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private filatelia: FilateliaService,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.tokenUser = jwt_decode(sessionStorage.getItem('token'));
    this.idUser = this.tokenUser.Usuario[0].id_user
    this.ListaTirajes()
    this.TokenTiraje = this.utilService.TokenAleatorio(10);
    this.ListaOpp()
    this.ListaReceptores()
    // this.sectionBlockUI.start('No Inicializado!!!');
    // this.sectionBlockUI.stop()
  }

  filterUpdate(event) {
    // console.log(event)
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataTiraje.filter(function (d) {
      return d.tiraje.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsTiraje = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateTirajeQR(event) {
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataViewTirajeQR.filter(function (d) {
      return d[1].toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsViewTirajeQR = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;

  }


  async ListaTirajes() {
    this.xAPI.funcion = "IPOSTEL_Lista_TirajeQR";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data == null) return
        data.map(e => {
          e.costo = this.utilService.ConvertirMoneda(e.costo)
          e.cantidadQR = e.QR.length
          this.CantidadQrtiraje.push(e.cantidadQR)
          // e.valor = e.valor
          e.tipo = e.tipo
          switch (e.tipo) {
            case 1:
              e.xtipo = 'A1'
              break;
            case 2:
              e.xtipo = 'A'
              break;
            case 3:
              e.xtipo = 'B'
              break;
            case 4:
              e.xtipo = 'C'
              break;
            case 5:
              e.xtipo = 'D'
              break;

            default:
              break;
          }
          switch (e.tipoReceptor) {
            case 1:
              e.xtipoReceptor = 'Operador Postal Privado'
              break;
            case 2:
              e.xtipoReceptor = 'Oficina Postal Privada'
              break;
            case 3:
              e.xtipoReceptor = 'Coleccionista'
              break;

            default:
              break;
          }
          this.ListaTirajesQR.push(e)
        });
        this.rowsTiraje = this.ListaTirajesQR
        this.tempDataTiraje = this.rowsTiraje
        this.TotalTirajesQR = this.CantidadQrtiraje.reduce((total, numero) => total + numero, 0);
        this.ChequearCantidadQR(this.TotalTirajesQR)
      },
      (err) => {
        console.log(err)
        this.utilService.alertConfirmMini('error', `Oops!!! algo salio mal, ${err} `)
      }
    )
  }

  async miFuncionRecursiva(contador: number) {
    var token: string = this.utilService.TokenAleatorio(8);
    let ruta: string = btoa('https://sirp.ipostel.gob.ve/app/#/philately');
    this.apiService.GenQR(token, ruta).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.miArreglo.push(token);

          contador += 1

          this.xFilatelida.TokenTiraje = this.TokenTiraje
          this.xFilatelida.Qr = token



          if (contador == this.CantidadQrTipoEstampilla) {
            this.imprimirQR()
          } else {
            this.miFuncionRecursiva(contador)
          }

        } else {
          this.utilService.alertConfirmMini('error', 'Oops!!! algo salio mal, intente de nuevo')
          this.sectionBlockUI.stop()
        }
      }
    )

    return this.miArreglo;
  }

  async imprimirQR() {
    this.modalService.dismissAll('Close');
    // this.filatelia.GenerarCabecera('', this.xFilatelida.TipoEstampilla, this.TokenTiraje)
    this.ObtenerQR(0)
  }

  async Generar() {
    // console.log(this.xFilatelida)
    // this.filatelia.GenerarFranqueoPostalPrevio()
    // this.sectionBlockUI.start('Generando Tiraje Qr, por favor Espere!!!');
    if (this.xFilatelida.TipoEstampilla == 1) {
      this.CantidadQrTipoEstampilla = 127
    } else {
      this.CantidadQrTipoEstampilla = 64
    }
    this.miFuncionRecursiva(1);
  }

  async ObtenerQR(contador: number) {
    let token = this.miArreglo[contador]
    // console.log(token)
    this.apiService.LoadQR(token).subscribe(
      (data) => {
        if (data.tipo == 1) {
          if (contador == this.CantidadQrTipoEstampilla - 2) {
            // this.filatelia.GenerarFilatelia(data.contenido, this.xFilatelida.TipoEstampilla, this.TokenTiraje, contador, '');
            // this.filatelia.GenerarPie(this.TokenTiraje);
            // Guardar Tiraje
            this.ListaTiraje.QR = this.miArreglo;
            this.ListaTiraje.costo = this.xFilatelida.CostoEstampilla;
            this.ListaTiraje.correlativo = 999
            this.ListaTiraje.receptor = this.xFilatelida.ReceptorEstampilla
            this.ListaTiraje.observacion = this.xFilatelida.ObservacionEstampilla
            this.ListaTiraje.tiraje = this.TokenTiraje
            this.ListaTiraje.tipo = this.xFilatelida.TipoEstampilla
            this.ListaTiraje.valor = this.xFilatelida.ValorEstampilla
            this.ListaTiraje.tipoReceptor = this.xFilatelida.TipoReceptorEstampilla
            this.ListaTiraje.userCreated = this.idUser
            this.ListaTiraje.dateCreated = this.utilService.FechaActual()

            var obj = {
              "coleccion": "tirajes",
              "objeto": this.ListaTiraje,
              "donde": "{\"tiraje\": \" ${this.ListaTiraje.tiraje}\"}",
              "driver": "MGDBA",
              "upset": true
            }

            // this.apiService.ExecColeccion(obj).subscribe(
            //   (data) => {
            //     this.utilService.alertConfirmMini('success', 'Tiraje QR Generados Existosamente');
            //     this.sectionBlockUI.stop();
            //     this.router.navigate(['philately/sale-of-philately']).then(() => {
            //       window.location.reload();
            //     })
            //   }, (error) => {
            //     console.log(error)
            //     this.utilService.alertConfirmMini('error', 'Oops!!! algo salio mal, intente de nuevo');
            //     this.sectionBlockUI.stop();
            //   }
            // )
            // Guardar Tiraje

          } else {
            this.rowsTiraje.push(this.ListaTiraje)
            console.log(this.rowsTiraje)
            // this.filatelia.GenerarFilatelia(data.contenido, this.xFilatelida.TipoEstampilla, this.TokenTiraje, contador, this.miArreglo[contador]);
            this.ObtenerQR(contador + 1);
          }
        } else {
          this.utilService.alertConfirmMini('error', 'Oops!!! algo salio mal, intente de nuevo');
          this.sectionBlockUI.stop();
        }
      }
    )
  }

  SelectTipoReceptor(id: any) {
    switch (id) {
      case 1:
        this.showOPP = true
        this.showCOL = false
        this.showOPT = false
        break;
      case 2:
        this.showOPP = false
        this.showCOL = false
        this.showOPT = true
        break;
      case 3:
        this.showOPP = false
        this.showCOL = true
        this.showOPT = false
        break;

      default:
        this.showOPP = false
        this.showCOL = false
        this.showOPT = false
        break;
    }
  }

  ChequearCantidadQR(total: number) {
    if (total >= 6000) {
      this.utilService.alertMessageAutoCloseTimer(5000, 'Alerta', `Estimado Usuario la cantidad de QR Generados, esta llegando a su limite (${this.TotalTirajesQR}/ 9.999), le sugerimos recargar`)
    }
    if (total >= 9999) {
      this.BtnShowTiraje = true
    } else {
      this.BtnShowTiraje = false
    }
  }


  FilateliaModalAdd(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalVerTiraje(modal, data) {
    this.titleModalTiraje = data.tiraje
    const array = Object.entries(data.QR);

    array.map(e => {
      // console.log(e)
      this.VerTirajeQR.push(e)
    });
    this.rowsViewTirajeQR = this.VerTirajeQR
    this.tempDataViewTirajeQR = this.rowsViewTirajeQR

    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ListaOpp() {
    this.xAPI.funcion = "IPOSTEL_R_OPP";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectOPP = data.Cuerpo.map(e => {
          e.id = e.id_opp
          e.name = e.nombre_empresa
          return e
        });
      },
      (err) => {
        console.log(err)
      }
    )
  }

  ListaReceptores() {
    this.xAPI.funcion = "IPOSTEL_R_OPP";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectReceptores = data.Cuerpo.map(e => {
          e.id = e.id_opp
          e.name = e.nombre_empresa
          return e
        });
      },
      (err) => {
        console.log(err)
      }
    )
  }


}
