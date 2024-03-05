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
import { FilateliaCrear, FranqueoPostalPrevio, GuardarQRs, QrContenido } from '@core/services/empresa/form-opp.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class AcquisitionComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };


  public IFranqueoPostalPrevio: FranqueoPostalPrevio = {
    id_opp: undefined,
    tipo: undefined,
    cantidad: undefined,
    status: undefined,
    observacion: ''
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

  public rowsFPP = []
  public tempDataFPP = []

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

  public showBtn: boolean = false

  public tokenUser
  public idUser

  public token

  public CantidadQrtiraje = []

  public TokenTiraje: string

  public CantidadQrTipoEstampilla



  public ListaFPP = []




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
    // console.log(this.tokenUser)
    this.idUser = this.tokenUser.Usuario[0].id_opp
    this.ListarFPP()
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
    const temp = this.tempDataFPP.filter(function (d) {
      return d.tiraje.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsFPP = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  async ListarFPP() {
    this.ListaFPP = []
    this.xAPI.funcion = "IPOSTEL_Listar_FPP_IDOPP";
    this.xAPI.parametros = `${this.idUser}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data == null) return
        data.Cuerpo.map(e => {
          switch (e.tipo) {
            case 1:
              e.tipox = 'A1'
              break;
            case 2:
              e.tipox = 'A'
              break;
            case 3:
              e.tipox = 'B'
              break;
            case 4:
              e.tipox = 'C'
              break;
            case 5:
              e.tipox = 'D'
              break;
            default:
              break;
          }
          this.ListaFPP.push(e)
        });
        this.rowsFPP = this.ListaFPP
        this.tempDataFPP = this.rowsFPP
      },
      (err) => {
        console.log(err)
        this.utilService.alertConfirmMini('error', `Oops!!! algo salio mal, ${err} `)
      }
    )
  }

  Guardar() {
    this.IFranqueoPostalPrevio.id_opp = this.idUser
    this.IFranqueoPostalPrevio.status = 0
    this.IFranqueoPostalPrevio.tipo = this.IFranqueoPostalPrevio.tipo.id
    this.IFranqueoPostalPrevio.created_user = this.idUser
    // console.info(this.IFranqueoPostalPrevio)
    this.xAPI.funcion = "IPOSTEL_C_AdquisicionFPP";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IFranqueoPostalPrevio)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.rowsFPP = []
          this.utilService.alertConfirmMini('success', `Solicitud Registrada Exitosamente!`)
          this.ListarFPP()
          this.limpiarForm()
          this.modalService.dismissAll('cerrar')
        } else {
          this.utilService.alertConfirmMini('error', `Oops!!! algo salio mal`)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  Delete(row: any) {
    Swal.fire({
      title: "Esta Seguro?",
      text: "Desea Eliminar Este Registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminarlo!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = "IPOSTEL_D_AdquisicionFPP";
        this.xAPI.parametros = `${row.id}`
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo == 1) {
              this.rowsFPP = []
              this.utilService.alertConfirmMini('success', `Solicitud Eliminada Exitosamente!`)
              this.ListarFPP()
              this.modalService.dismissAll('cerrar')
            } else {
              this.utilService.alertConfirmMini('error', `Oops!!! algo salio mal`)
            }
          },
          (err) => {
            console.log(err)
          }
        )
      }
    });
  }

  Modificar() {
    this.IFranqueoPostalPrevio.tipo = this.IFranqueoPostalPrevio.tipo.id
    this.xAPI.funcion = "IPOSTEL_U_AdquisicionFPP";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IFranqueoPostalPrevio)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.rowsFPP = []
          this.utilService.alertConfirmMini('success', `Solicitud Actualizada Exitosamente!`)
          this.ListarFPP()
          this.CerrarModal()
        } else {
          this.utilService.alertConfirmMini('error', `Oops!!! algo salio mal`)
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  CerrarModal() {
    this.IFranqueoPostalPrevio = {
      id_opp: this.idUser,
      tipo: undefined,
      cantidad: undefined,
      status: undefined,
      observacion: ''
    }
    this.modalService.dismissAll('cerrar')
  }

  limpiarForm() {
    this.IFranqueoPostalPrevio = {
      id_opp: this.idUser,
      tipo: undefined,
      cantidad: undefined,
      status: undefined,
      observacion: ''
    }
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

  AdquisicionAdd(modal) {
    this.showBtn = false
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalModificar(modal, row) {
    this.IFranqueoPostalPrevio.id = row.id
    this.IFranqueoPostalPrevio.id_opp = row.id_opp
    this.IFranqueoPostalPrevio.status = row.status
    this.IFranqueoPostalPrevio.tipo = row.tipox
    this.IFranqueoPostalPrevio.cantidad = row.cantidad
    this.IFranqueoPostalPrevio.observacion = row.observacion
    this.IFranqueoPostalPrevio.created_user = row.created_user
    this.IFranqueoPostalPrevio.created_date = row.created_date
    this.IFranqueoPostalPrevio.updated_user = this.idUser

    this.showBtn = true
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

