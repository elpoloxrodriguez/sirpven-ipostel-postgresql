import { Component, OnInit, ViewEncapsulation, ViewChild, Injectable } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ICrearCertificados, IPOSTEL_U_PRECIO_PETRO_DOLAR } from '@core/services/empresa/form-opp.service';
import { PdfService } from '@core/services/pdf/pdf.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import puppeteer from 'puppeteer';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public urlPetro: string = 'https://www.petro.gob.ve/es/'
  public urlBcv: string = 'https://www.bcv.org.ve/'

  public I_UpdateMontosPetroDolar: IPOSTEL_U_PRECIO_PETRO_DOLAR = {
    petro: '',
    dolar: '',
    petro_bolivares: '',
    id_pd: 0
  }

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }
  public title

  public DataEmpresa
  public token
  public empresa = false
  public usuario = false
  public n_curp
  public statusEmpresaOPP = false
  public statusEmpresaSUB = false


  public empresaOPP = false
  public empresaSUB = false

  public fecha = new Date('yyyy-MM-dd HH:mm:ss');
  public fechax = new Date();
  public aniox = this.fechax.getFullYear();
  public anio = this.fecha.getFullYear();
  public mes = this.fechax.getMonth();
  public hora
  public fecha_Actual_convert
  public hora_Actual_convert
  public role

  public MesAnio

  public bolivares
  public dolar
  public petro
  public bolivaresx
  public dolarx
  public petrox

  public DatosSub_OPP = []


  constructor(
    private modalService: NgbModal,
    private _router: ActivatedRoute,
    private apiService: ApiService,
    private utilService: UtilService,
    private pdf: PdfService,
    private httpClient: HttpClient
  ) { }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.EmpresaOppSub(this.token.Usuario[0].id_opp)
    await this.Precio_Dolar_Petro()
    await this.Meses()
    this.fecha_Actual_convert = this.utilService.FechaMomentActual()
    this.role = this.token.Usuario[0].role
    this.EmpresaRIF(this.token.Usuario[0].id_opp)
    switch (this.token.Usuario[0].tipo_registro) {
      case undefined:
        this.title = 'Administrador IPOSTEL'
        this.usuario = false
        this.empresa = true
        break;
      case 1:
        this.title = 'Operador Postal Privado'
        this.empresaSUB = false
        this.empresaOPP = true
        this.usuario = true
        this.empresa = false
        break;
      case 2:
        this.title = 'Sub Contratista'
        this.empresaSUB = true
        this.empresaOPP = false
        this.usuario = true
        this.empresa = false
        break;
      default:
        break;
    }


    if (this.token.Usuario[0].status_curp === 1) {
      this.statusEmpresaOPP = true
      this.statusEmpresaSUB = true
    } else {
      this.statusEmpresaSUB = false
      this.statusEmpresaOPP = false
    }

  }

  Meses() {
    // console.log(this.mes)
    switch (this.mes) {
      case 0:
        this.MesAnio = 'Enero ' + this.aniox
        break;
      case 1:
        this.MesAnio = 'Febrero ' + this.aniox
        break;
      case 2:
        this.MesAnio = 'Marzo ' + this.aniox
        break;
      case 3:
        this.MesAnio = 'Abril ' + this.aniox
        break;
      case 4:
        this.MesAnio = 'Mayo ' + this.aniox
        break;
      case 5:
        this.MesAnio = 'Junio ' + this.aniox
        break;
      case 6:
        this.MesAnio = 'Julio ' + this.aniox
        break;
      case 7:
        this.MesAnio = 'Agosto ' + this.aniox
        break;
      case 8:
        this.MesAnio = 'Septiembre ' + this.aniox
        break;
      case 9:
        this.MesAnio = 'Octubre ' + this.aniox
        break;
      case 10:
        this.MesAnio = 'Noviembre ' + this.aniox
        break;
      case 11:
        this.MesAnio = 'Diciembre ' + this.aniox
        break;

      default:
        break;
    }
  }

  ModalCambiarMontos(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  EmpresaOppSub(id: any){
    this.xAPI.funcion = "IPOSTEL_R_EmpresaOppSub";
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
     this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       if (data.length >= 0) {
        this.DatosSub_OPP = data.Cuerpo.map(e => {
          this.DatosSub_OPP.push(e)
        });
       } else {
        this.DatosSub_OPP = []
       }
        // console.log(this.DatosSub_OPP)
      },
      (err) => {
        console.log(err)
      }
     )
  }

  GenerarReporteLiquidacionFPO() {
    this.sectionBlockUI.start('Generando Reporte de Liquidación P.F.O, Porfavor Espere!!!');
    setTimeout(() => {
      this.sectionBlockUI.stop()
      this.utilService.alertConfirmMini('success', 'Reporte de Liquidacion P.P.O Descagado Exitosamente')
    }, 2000);
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_empresa_id";
    this.xAPI.parametros = `${id}`
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DataEmpresa.push(data.Cuerpo);
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
        data.Cuerpo.map(e => {
          this.I_UpdateMontosPetroDolar.petro = e.petro
          this.I_UpdateMontosPetroDolar.dolar = e.dolar
          this.I_UpdateMontosPetroDolar.petro_bolivares = e.petro_bolivares
          // this.dolarx = e.dolar
          // this.petrox = e.petro
          // this.bolivaresx = e.petro_bolivares
          this.dolar = this.utilService.ConvertirMoneda(e.dolar)
          this.petro = this.utilService.ConvertirMoneda$(e.petro)
          this.bolivares = this.utilService.ConvertirMoneda(e.petro_bolivares)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async UpdateMontos() {
    this.I_UpdateMontosPetroDolar.id_pd = 1
    // this.I_UpdateMontosPetroDolar.petro = this.petrox
    // this.I_UpdateMontosPetroDolar.dolar = this.dolarx
    // this.I_UpdateMontosPetroDolar.petro_bolivares = this.bolivaresx

    this.xAPI.funcion = "IPOSTEL_U_PRECIO_PETRO_DOLAR";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.I_UpdateMontosPetroDolar)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.utilService.alertConfirmMini('success', 'Montos Actualizados Exitosamente!')
          this.modalService.dismissAll('Close')
          this.Precio_Dolar_Petro()
        } else {
          this.utilService.alertConfirmMini('error', 'Oops lo sentimos, algo salio mal!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async GenerarCertificadoInscripcion() {
    // console.log(this.anio)
    this.CrearCert.usuario = this.token.Usuario[0].id_opp
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 1,
      // this.CrearCert.created_user = this.utilService.FechaActual()
      // 1 CERTIFICADO UNICO OPP
      // 2 AUTORIZACION UNICA  SUB
      this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.xAPI.funcion = "IPOSTEL_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Certificado, Porfavor Espere!!!');
        this.n_curp = data.msj + '-IP' + this.aniox
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://sirp.ipostel.gob.ve');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  // console.log(sdata)
                  this.pdf.CertificadoInscripcion(sdata[0], xdata.contenido, this.CrearCert.token, this.n_curp)
                  this.sectionBlockUI.stop()
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarAutorizacionInscripcion() {
    this.CrearCert.usuario = this.token.Usuario[0].id_opp
    this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 2,
      // 1 CERTIFICADO UNICO OPP
      // 2 AUTORIZACION UNICA  SUB
      this.CrearCert.created_user = this.token.Usuario[0].id_opp
    this.xAPI.funcion = "IPOSTEL_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Generando Autorización, Porfavor Espere!!!');
        this.n_curp = data.msj + '-IP' + this.aniox
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://sirp.ipostel.gob.ve');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DatosSub_OPP
                  this.pdf.AutorizacionInscripcion(sdata[0], xdata.contenido, this.CrearCert.token, this.n_curp)
                  this.sectionBlockUI.stop()
                  this.utilService.alertConfirmMini('success', 'Autorización Descagada Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


}
