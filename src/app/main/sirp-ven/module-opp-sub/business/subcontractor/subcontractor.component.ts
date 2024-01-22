import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_DATA_DELEGADOP_ID, IPOSTEL_DATA_EMPRESA_ID, IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID, IPOSTEL_U_Status_Opp_Sub } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BusinessService } from '../business.service';
import { GenerarPagoService } from '@core/services/generar-pago.service';


@Component({
  selector: 'app-subcontractor',
  templateUrl: './subcontractor.component.html',
  styleUrls: ['./subcontractor.component.scss']
})
export class SubcontractorComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IpagarRecaudacion: IPOSTEL_C_PagosDeclaracionOPP_SUB = {
    id_opp: 0,
    status_pc: 0,
    tipo_pago_pc: 0,
    monto_pc: '',
    monto_pagar: '',
    dolar_dia: '',
    petro_dia: '',
    archivo_adjunto: undefined,
    user_created: 0,
    fecha_pc: '',
    mantenimiento: ''
  }

  public DataEmpresa: IPOSTEL_DATA_EMPRESA_ID = {
    id_opp: undefined,
    nombre_empresa: undefined,
    rif: undefined,
    role: undefined,
    status_empresa: undefined,
    tipo_registro: undefined,
    opp: undefined,
    direccion_empresa: undefined,
    estado_empresa: undefined,
    ciudad_empresa: undefined,
    parroquia_empresa: undefined,
    correo_electronico: undefined,
    empresa_facebook: undefined,
    empresa_instagram: undefined,
    empresa_twitter: undefined,
    tipo_agencia: undefined,
    nombre_tipo_agencia: undefined,
    sucursales: undefined,
    subcontrataciones: undefined,
    tipologia_empresa: undefined,
    nombre_tipologia: undefined,
    tipo_servicio: undefined,
    especificacion_servicio: undefined,
    licencia_actividades_economicas_municipales: undefined,
    actividades_economicas_seniat: undefined,
    certificado_rupdae: undefined,
    patronal_ivss: undefined,
    matricula_inces: undefined,
    identificacion_laboral_ministerio_trabajo: undefined,
    certificado_eomic: undefined,
    permiso_bomberos: undefined,
    registro_sapi: undefined,
    registro_nacional_contratista: undefined,
    flota_utilizada: undefined,
    cantidad_trabajadores: undefined,
    cantidad_subcontratados: undefined,
    municipio_empresa: undefined
  }

  public DataRepresentanteLegal: IPOSTEL_DATA_REPRESENTANTE_LEGAL_ID = {
    apellidos_representante_legal: undefined,
    cargo_representante_legal: undefined,
    cedula_representante_legal: undefined,
    direccion_representante_legal: undefined,
    email_representante_legal: undefined,
    facebook_representante_legal: undefined,
    fecha_registro: undefined,
    id_opp: undefined,
    id_representante_legal: undefined,
    instagram_representante_legal: undefined,
    n_registro: undefined,
    nombres_representante_legal: undefined,
    telefono_movil_representante_legal: undefined,
    telefono_residencial_representante_legal: undefined,
    tomo: undefined,
    twitter_representante_legal: undefined,
    fecha_registro_contrato: undefined,
    tomo_contrato: undefined,
    n_registro_contrato: undefined
  }

  public DataDelegado: IPOSTEL_DATA_DELEGADOP_ID = {
    apellidos_delegado: undefined,
    cargo_delegado: undefined,
    cedula_delegado: undefined,
    email_delegado: undefined,
    facebook_delegado: undefined,
    id_delegado: undefined,
    id_opp: undefined,
    instagram_delegado: undefined,
    nombres_delegado: undefined,
    telefono_delegado: undefined,
    twitter_delegado: undefined
  }

  public CambiarStatus: IPOSTEL_U_Status_Opp_Sub = {
    id_suc: 0,
    status_agencia: undefined,
    observacion: ''
  }

  public items =
    {
      id_opp: undefined,
      nombre_empresa: undefined,
      rif: undefined,
      nombre_tipologia: undefined,
      correo_electronico: undefined,
      status_empresa: undefined,
      observacion: undefined,
      actividades_economicas_seniat: undefined,
      cantidad_subcontratados: undefined,
      cantidad_trabajadores: undefined,
      certificado_eomic: undefined,
      certificado_rupdae: undefined,
      ciudad_empresa: undefined,
      direccion_empresa: undefined,
      empresa_facebook: undefined,
      empresa_instagram: undefined,
      empresa_twitter: undefined,
      especificacion_servicio: undefined,
      estado_empresa: undefined,
      flota_utilizada: undefined,
      id_tipologia: undefined,
      identificacion_laboral_ministerio_trabajo: undefined,
      licencia_actividades_economicas_municipales: undefined,
      matricula_inces: undefined,
      municipio_empresa: undefined,
      opp: undefined,
      parroquia_empresa: undefined,
      password: undefined,
      patronal_ivss: undefined,
      permiso_bomberos: undefined,
      registro_nacional_contratista: undefined,
      registro_sapi: undefined,
      role: undefined,
      subcontrataciones: undefined,
      sucursales: undefined,
      tipo_agencia: undefined,
      tipo_registro: undefined,
      tipo_servicio: undefined,
      tipologia_empresa: undefined,
    }

  public dolar
  public petro
  public bolivares

  public Subcontratista = []
  public token
  public TipoRegistro
  public IdOPP
  public CargarSub

  public title_modal
  public idOPPSelected
  public ConfirmNewPassword
  public NewPassword

  public SelectStatusSubcontratista = [
    { id: 0, name: 'En Espera' },
    { id: 1, name: 'Aprobado' },
    { id: 2, name: 'Rechazado' }
  ]

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public rowsSubcontratistas
  public tempDataSubcontratas = []

  public TitleModal

  public DolarPetroDia
  public pDolar
  public pPetro

  public MontoObligacionUsoContratoSub = 0
  public nombreObligacionUsoContratoSub
  public tipoStatus

  public ListaTipoObligacion

  public idRealSUB = 0

  public item = []
  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private subContratista : BusinessService,
    private generarConciliacion: GenerarPagoService
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'))
    await this.Precio_Dolar_Petro()
    await this.LstObligaciones()
    this.TipoRegistro = this.token.Usuario[0].tipo_registro
    this.IdOPP = this.token.Usuario[0].id_opp
    await this.Subcontratistas(this.IdOPP)
  }


  async LstObligaciones() {
    this.xAPI.funcion = "IPOSTEL_R_Tipo_Pagos_Obligaciones";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ListaTipoObligacion = data.Cuerpo.map(e => {
         if (e.id_tipo_pagos == 5) {
          this.nombreObligacionUsoContratoSub = e.nombre_tipo_pagos
          this.MontoObligacionUsoContratoSub = e.tasa_petro
         }
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async Precio_Dolar_Petro() {
    this.xAPI.funcion = "IPOSTEL_R_PRECIO_PETRO_DOLAR";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DolarPetroDia = data.Cuerpo.map(e => {
          this.pDolar = e.dolar
          this.pPetro = e.petro_bolivares
          // console.log(e)
          return e
        });
        // console.log(this.pDolar,this.pPetro)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async Subcontratistas(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_Subcontratista_ID"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.Subcontratista.push(e)
        });
        this.rowsSubcontratistas = this.Subcontratista;
        this.tempDataSubcontratas = this.rowsSubcontratistas
        // console.log( this.rowsSubcontratistas)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async filterUpdateSubcontratistas(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataSubcontratas.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsSubcontratistas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  capturarSelect(evento : any){
      this.tipoStatus = evento
  }

  async RegistrarCambiarStatus() {
    this.sectionBlockUI.start('Cambiando Estatus, por favor Espere!!!');
      this.subContratista.CambiarEstatusSubcontratista(this.CambiarStatus)
      .then((resultado) => {
        if (this.tipoStatus == 1) {
          this.ProcesarOblicacion()
        }
        this.Subcontratista = []
        this.Subcontratistas(this.IdOPP)
        this.modalService.dismissAll('Cerrar Modal')
        this.utilService.alertConfirmMini('success', 'Estatus Actualizado Exitosamente')
      })
      .catch((error) => {
        // Manejar el reject
        // console.error('Error en la operación:', error);
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
        // console.log('Procesamiento finalizado');
        this.Subcontratista = []
        this.sectionBlockUI.stop()
      });
  }

  async CambiarStatusSubcontratista(modal, data) {
    // console.log(data)
    this.idRealSUB = data.id_real_sub
    this.CambiarStatus.id_suc = data.id_tabla_agencia
    this.CambiarStatus.status_agencia = data.status_agencia
    this.CambiarStatus.observacion = data.observacion
    this.TitleModal = data.nombre_empresa
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


  async ProcesarOblicacion() {
    this.IpagarRecaudacion.id_opp = this.idRealSUB
    this.IpagarRecaudacion.status_pc = 0
    this.IpagarRecaudacion.tipo_pago_pc = 5
    this.IpagarRecaudacion.monto_pc = '0'
    this.IpagarRecaudacion.monto_pagar = this.MontoObligacionUsoContratoSub.toString()
    this.IpagarRecaudacion.dolar_dia = this.pDolar.toString()
    this.IpagarRecaudacion.petro_dia = this.pPetro.toString()
    this.IpagarRecaudacion.observacion_pc = this.nombreObligacionUsoContratoSub
    this.IpagarRecaudacion.fecha_pc = this.utilService.FechaActual()
    this.IpagarRecaudacion.user_created = this.IdOPP
    this.sectionBlockUI.start('Generando Recibo, Por favor Espere!!!');
    await this.generarConciliacion.GuardarCreacionRecaudacionIndividual(this.IpagarRecaudacion)
      .then((resultado) => {
        console.log(resultado)
        this.utilService.alertConfirmMini('success', 'Recibo Guardado Exitosamente')
      })
      .catch((error) => {
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // this.ListaPagosObligaciones()
        this.sectionBlockUI.stop()
      });
  }


}
