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
import { FilateliaCrear, QrContenido } from '@core/services/empresa/form-opp.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-philately-admin',
  templateUrl: './philately-admin.component.html',
  styleUrls: ['./philately-admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class PhilatelyAdminComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public xFilatelida: FilateliaCrear = {
    TipoEstampilla: undefined,
    ValorEstampilla: undefined,
    CostoEstampilla: undefined,
    ReceptorEstampilla: undefined,
    ObservacionEstampilla: undefined,
    TipoReceptorEstampilla: undefined
  }

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public searchValue = '';
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public rowsEmpresas;
  private tempDataEmpresas = [];

  public SelectTipoEstampilla = [
    { id: 1, name: 'A1' },
    { id: 2, name: 'A' },
    { id: 3, name: 'B' },
    { id: 4, name: 'C' },
    { id: 5, name: 'D' },
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
  ]

  public SelectOPP
  public SelectReceptores

  public resultado

  public Qr = []
  public token
  public CantidadQr

  public CantidadQrTipoEstampilla

  public i = 0
  public arregloQR: any[] = []

  public miArreglo: any[] = []


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
    // this.ChequearCantidadQR()
    this.ListaOpp()
    this.ListaReceptores()
    // this.sectionBlockUI.start('Cargando..., Porfavor Espere!!!');
    // this.sectionBlockUI.stop()
  }

  filterUpdate(event) {
    // console.log(event)
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataEmpresas.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsEmpresas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  async miFuncionRecursiva(contador: number) {
    this.sectionBlockUI.start('Generando Qr, Porfavor Espere!!!');
    if (this.xFilatelida.TipoEstampilla === 1) {
      this.CantidadQrTipoEstampilla = 126
    } else {
      this.CantidadQrTipoEstampilla = 63
    }
    if (contador === this.CantidadQrTipoEstampilla) {
      return this.miArreglo;
    }
    this.miArreglo =  await this.miFuncionRecursiva(contador + 1);
    // console.log(contador)
    // this.miArreglo.push(contador);
    var token: string = Math.random().toString(36).substring(2, 10);
    let ruta: string = btoa('https://sirp.ipostel.gob.ve');
     this.apiService.GenQR(token, ruta).subscribe(
       (data) => {
        if (data.tipo === 1) {          
          this.miArreglo.push(token);
            this.ObtenerQR(token)
            this.utilService.alertConfirmMini('success', 'QR Generados Existosamente')
            this.sectionBlockUI.stop()
            this.modalService.dismissAll('Close')    

        } else {
          this.utilService.alertConfirmMini('error', 'Oops!!! algo salio mal, intente de nuevo')
          this.sectionBlockUI.stop()
        }
      }
    )

    return this.miArreglo;
  }

  async Generar() {
    let resultado = this.miFuncionRecursiva(0);
    // this.ObtenerQR(resultado)
    // this.filatelia.Qr(this.miArreglo)
    // console.log(resultado)

    // this.sectionBlockUI.start('Generando Qr, Porfavor Espere!!!');
    // if (this.xFilatelida.TipoEstampilla === 1) {
    //   this.CantidadQrTipoEstampilla = 126
    // } else {
    //   this.CantidadQrTipoEstampilla = 63
    // }

    // var token: string = Math.random().toString(36).substring(2, 10);
    // let ruta: string = btoa('https://sirp.ipostel.gob.ve');
    // await this.apiService.GenQR(token, ruta).subscribe(
    //    (data) => {
    //     if (data.tipo === 1) {          
    //       if (this.i < this.CantidadQrTipoEstampilla) {
    //         this.Generar()
    //         this.i++
    //         this.ObtenerQR(token)
    //         this.utilService.alertConfirmMini('success', 'QR Generados Existosamente')
    //         this.sectionBlockUI.stop()
    //         this.modalService.dismissAll('Close')    
    //       }
    //     } else {
    //       this.utilService.alertConfirmMini('error', 'Oops!!! algo salio mal, intente de nuevo')
    //       this.sectionBlockUI.stop()
    //     }
    //   }
    // )
  }

    async ObtenerQR(token) {
       await this.apiService.LoadQR(token).subscribe(
       (data) => {
        if (data.tipo === 1) {
          this.arregloQR.push(data.contenido)
          this.utilService.alertConfirmMini('success', 'Tiraje QR Generados Existosamente')
          this.sectionBlockUI.stop()
          this.modalService.dismissAll('Close')
          this.filatelia.GenerarFilatelia(this.arregloQR, this.xFilatelida.TipoEstampilla)
          this.router.navigate(['philately/sale-of-philately']).then(() => {window.location.reload()});
        } else {
          this.utilService.alertConfirmMini('error', 'Oops!!! algo salio mal, intente de nuevo')
          this.sectionBlockUI.stop()
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

  async ChequearCantidadQR() {
    this.utilService.alertMessageAutoCloseTimer(5000, 'Alerta', 'Estimado Usuario la cantidad de QR Generados, esta llegando a su limite, le sugerimos recargar')
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
