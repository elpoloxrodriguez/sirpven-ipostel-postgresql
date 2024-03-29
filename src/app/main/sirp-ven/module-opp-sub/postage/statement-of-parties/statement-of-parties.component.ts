import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { Router, RouterLink } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal, NgbActiveModal, NgbModalConfig, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { IPOSTEL_C_MovilizacionPiezas, IPOSTEL_C_PagosDeclaracionOPP_SUB, IPOSTEL_U_ActualizarMovilizacionPiezas, IPOSTEL_U_MovilizacionPiezasIdFactura } from '@core/services/empresa/form-opp.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { MobilizationPartsService } from '../mobilization-parts.service';



@Component({
  selector: 'app-statement-of-parties',
  templateUrl: './statement-of-parties.component.html',
  styleUrls: ['./statement-of-parties.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class StatementOfPartiesComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public InsertarMovilizacionPiezas: IPOSTEL_C_MovilizacionPiezas = {
    id_opp: undefined,
    id_servicio_franqueo: undefined,
    id_peso_envio: undefined,
    tarifa_servicio: '',
    porcentaje_tarifa: 0,
    monto_fpo: '',
    mes: '',
    cantidad_piezas: 0,
    monto_causado: '',
    user_created: undefined
  }

  public prueba = {
    id_opp: undefined,
    id_servicio_franqueo: undefined,
    id_peso_envio: undefined,
    tarifa_servicio: undefined,
    porcentaje_tarifa: 0,
    monto_fpo: 0,
    mes: '',
    nombre_peso_envio: '',
    nombre_servicios_franqueo: '',
    cantidad_piezas: 0,
    monto_causado: 0,
    user_created: undefined
  }

  public IidFacturaMovilizacionPiezas: IPOSTEL_U_MovilizacionPiezasIdFactura = {
    id_factura: 0,
    id_movilizacion_piezas: 0
  }

  public IpagarRecaudacion: IPOSTEL_C_PagosDeclaracionOPP_SUB = {
    id_opp: 0,
    status_pc: 0,
    tipo_pago_pc: 0,
    declaracion: 0,
    monto_pc: '',
    monto_pagar: '',
    dolar_dia: '',
    petro_dia: '',
    archivo_adjunto: undefined,
    user_created: 0,
    fecha_pc: '',
    mantenimiento: ''
  }

  public IUpdateMovilizacionPiezas: IPOSTEL_U_ActualizarMovilizacionPiezas = {
    id_opp: 0,
    id_servicio_franqueo: 0,
    id_peso_envio: 0,
    tarifa_servicio: '',
    porcentaje_tarifa: 0,
    monto_fpo: '',
    mes: '',
    cantidad_piezas: 0,
    monto_causado: '',
    user_updatede: 0,
    id_movilizacion_piezas: 0,
    id_factura: 0
  }

  public btnShowDatePayment = false
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public uri
  public token
  public idOPP
  public fechax
  public fecha = new Date();
  public dia = this.fecha.getDate();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();
  public mesEncode64 = btoa(this.anio + '-' + this.mes)
  public mesDecode64 = this.anio + '-' + this.mes

  public fechaUri

  public MontoPetro

  public PrecioMantenimiento
  public PrecioMantenimientoX
  public PrecioMantenimientoXT
  public PrecioMantenimientoXTF: number = 0
  public MontoPetroTotalSumaServicio
  public MantenimientoYSeguridad = []

  public DolarDia
  public PetroDia

  public cantidadMovilidad: number


  public MontoCausadoYMantenimiento

  miArray: any[];

  public montoPagar
  public fechaActual
  public montoIVA = 0
  public montoTASA
  public montoTASAnombre
  public ServicioFranqueoID = 1

  public DeclaracionPiezas = []
  public rowsDeclaracionPiezas
  public tempDataDeclaracionPiezas = []

  public idFactura

  public montoFranqueo = []

  public nuevoCalculo = []

  public DeclaracionPiezasLength
  public selected = 0
  public TotalPiezas
  public MontoCausado
  public MontoCausadoX
  public itemsSelectPesoEnvio = []
  public itemsSelectTipoServicio = []
  public items = [];
  public item = {
    id_opp: '', // ID DE LA OPP
    id_servicio_franqueo: '', // ID DEL TIPO DE SERVICIO DE FRANQUEO
    id_peso_envio: '', // ID TIPO DE PESO DE ENVIO
    tarifa_servicio: '', // MONTO DEL PESO DE ENVIO 
    porcentaje_tarifa: '', // PORCENTAJE DE TARIFA SEGUN TIPOLOGIA_EMPRESA
    monto_fpo: '', // MONTO DE FPD
    mes: '', // MES DE DECLARACION
    cantidad_piezas: '', // CANTIDAD DE PIEZAS DECLARADAS
    monto_causado: '', // MONTO TOTAL A PAGAR
    user_created: ''
  };

  public UpdateMovilizacionPiezasDeclaracion = []

  public rowsUtilidadCierreFiscal = []

  public archivos = []
  public hashcontrol = ''
  public numControl: string = ''

  public idMantenimiento
  public iniciales
  public nombre
  public precio
  public ConvertirTasaPetro
  public PetroConvertidoBolivares
  public PetroConvertidoBolivaresx

  public totalPetros // Total de la Tabla de Mantenimiento
  public totalBolivares
  public convertirTotalBolivares


  public servicio_franqueo = undefined
  public cantidad_piezas = ''
  public peso_envio = undefined

  public rows = []

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private movilizacionPiezas: MobilizationPartsService
  ) { }

  async ngOnInit() {
    this.movilizacionPiezas.listaActualizada.subscribe(() => {
      // Vuelve a cargar la lista de registros desde sessionStorage
      this.cargarRegistros();
    });

    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token)
    if (this.token.Usuario[0].iva_exento == 1) {
      this.montoIVA = 0
    }
    this.idOPP = this.token.Usuario[0].id_opp
    this.fechaUri = atob(this.rutaActiva.snapshot.params.id);


    this.Precio_Dolar_Petro()
    this.ListaMantenimientoSeguidad()
    await this.BloqueoBtnDeclaracion()
    await this.ListaDeclaracionMovilizacionPiezas()
    await this.TasaPostal(this.token.Usuario[0].tipologia_empresa, this.idOPP)
    await this.ListaServicioFranqueo()
    this.ListaDeclaracionMovilizacionPiezasDECLARAR()
    await this.MantenimientoSIRPVEN()
  }

  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDeclaracionPiezas.filter(function (d) {
      return d.nombre_peso_envio.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDeclaracionPiezas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  fileSelected(e) {
    this.archivos.push(e.target.files[0])
    // console.log(this.archivos)
  }


  async TasaPostal(tipologia, id_opp) {
    this.xAPI.funcion = "IPOSTEL_R_TasaPostal"
    this.xAPI.parametros = tipologia + ',' + id_opp
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.montoTASA = e.tasa_postal
          this.montoTASAnombre = e.nombre_tasa_postal
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  addItem() {
    this.items.push({
      id_opp: this.idOPP, // ID DE LA OPP
      id_servicio_franqueo: null, // ID DEL TIPO DE SERVICIO DE FRANQUEO
      id_peso_envio: null, // ID TIPO DE PESO DE ENVIO
      tarifa_servicio: null, // MONTO DEL PESO DE ENVIO 
      porcentaje_tarifa: null, // PORCENTAJE DE TARIFA SEGUN TIPOLOGIA_EMPRESA
      monto_fpo: null, // MONTO DE FPD
      mes: null, // MES DE DECLARACION
      cantidad_piezas: null, // CANTIDAD DE PIEZAS DECLARADAS
      monto_causado: null, // MONTO TOTAL A PAGAR
      user_created: this.idOPP
    });
  }

  cargarRegistros() {
    this.miArray = JSON.parse(sessionStorage.getItem('movilizacion') || '[]');
    let i = 0
    this.rows = []
    if (this.miArray !== null) {
      this.miArray.map(element => {
        element.index = i++
        this.rows.push(element)
      });
    }
  }


  registro(row1: any, row2: any, row3: any) {
    this.prueba.id_opp = this.idOPP
    this.prueba.id_servicio_franqueo = row1
    this.prueba.id_peso_envio = row3.id_peso_envio
    this.prueba.tarifa_servicio = row3.pmvp
    this.prueba.nombre_peso_envio = row3.nombre_peso_envio
    this.prueba.nombre_servicios_franqueo = row3.nombre_servicios_franqueo
    this.prueba.porcentaje_tarifa = this.montoTASA
    const MontoFPO = this.prueba.tarifa_servicio * this.prueba.porcentaje_tarifa / 100
    this.prueba.monto_fpo = parseFloat(MontoFPO.toFixed(2))
    this.prueba.mes = this.fechax
    this.prueba.cantidad_piezas = row2
    const MontoCusado = this.prueba.monto_fpo * row2
    this.prueba.monto_causado = parseFloat(MontoCusado.toFixed(2))
    this.prueba.user_created = this.idOPP
    this.movilizacionPiezas.agregarRegistro(this.prueba);
    this.cargarRegistros()
    this.servicio_franqueo = undefined
    this.cantidad_piezas = ''
    this.peso_envio = undefined

  }



  borrarRegistro(index: number) {
    this.movilizacionPiezas.borrarRegistro(index);
  }




  LimpiarSelects() {
    // this.itemsSelectTipoServicio = []
    this.itemsSelectPesoEnvio = []
  }
  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  async BloqueoBtnDeclaracion() {
    this.xAPI.funcion = "IPOSTEL_R_Settings_Initials"
    this.xAPI.parametros = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        data.Cuerpo.map(e => {
          if (this.dia <= e.declaration_button_by_date) {
            this.btnShowDatePayment = true
          } else {
            this.btnShowDatePayment = false
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async RegistrarDeclaracionPiezas() {
    // let valor = this.items
    let valor = this.miArray
    for (let i = 0; i < valor.length; i++) {
      const element = valor[i];
      this.InsertarMovilizacionPiezas.id_opp = this.idOPP
      this.InsertarMovilizacionPiezas.id_servicio_franqueo = element.id_servicio_franqueo
      this.InsertarMovilizacionPiezas.id_peso_envio = element.id_peso_envio
      this.InsertarMovilizacionPiezas.tarifa_servicio = element.tarifa_servicio
      this.InsertarMovilizacionPiezas.cantidad_piezas = element.cantidad_piezas
      // const MontoCusado = this.InsertarMovilizacionPiezas.monto_fpo * element.cantidad_piezas
      this.InsertarMovilizacionPiezas.porcentaje_tarifa = element.porcentaje_tarifa
      // const MontoFPO = this.InsertarMovilizacionPiezas.tarifa_servicio * this.InsertarMovilizacionPiezas.porcentaje_tarifa / 100
      this.InsertarMovilizacionPiezas.monto_fpo = element.monto_fpo
      this.InsertarMovilizacionPiezas.mes = element.mes
      this.InsertarMovilizacionPiezas.monto_causado = element.monto_causado
      this.InsertarMovilizacionPiezas.user_created = this.idOPP


      this.sectionBlockUI.start('Guardando Piezas, por favor Espere!!!');
      await this.movilizacionPiezas.AgregarMovilizacionPiezas(this.InsertarMovilizacionPiezas)
        .then((resultado) => {
          this.DeclaracionPiezas = []
          this.rowsDeclaracionPiezas = []
          this.cantidadMovilidad = 0
          this.tempDataDeclaracionPiezas = []
          sessionStorage.removeItem('movilizacion')
          this.utilService.alertConfirmMini('success', 'Piezas Registradas Exitosamente!')
          this.ListaDeclaracionMovilizacionPiezas()
          this.modalService.dismissAll('Close')
        })
        .catch((error) => {
          this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
        })
        .finally(() => {
          this.ListaDeclaracionMovilizacionPiezasDECLARAR()
          this.sectionBlockUI.stop()
        });





      // this.xAPI.funcion = 'IPOSTEL_C_MovilizacionPiezas'
      // this.xAPI.parametros = ''
      // this.xAPI.valores = JSON.stringify(this.InsertarMovilizacionPiezas)
      // await this.apiService.Ejecutar(this.xAPI).subscribe(
      //   (data) => {
      //     this.sectionBlockUI.start('Guardando Declaración de Piezas, por favor Espere!!!');
      //     this.rowsDeclaracionPiezas.push(this.DeclaracionPiezas)
      //     if (data.tipo === 1) {
      //       this.ListaDeclaracionMovilizacionPiezasDECLARAR()
      //       this.DeclaracionPiezas = []
      //       this.ListaDeclaracionMovilizacionPiezas()
      //       this.modalService.dismissAll('Close')
      //       this.sectionBlockUI.stop()
      //       this.utilService.alertConfirmMini('success', 'Declaración Registrada Exitosamente!')
      //     } else {
      //       this.ListaDeclaracionMovilizacionPiezasDECLARAR()
      //       this.sectionBlockUI.stop();
      //       this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
      //     }
      //   },
      //   (error) => {
      //     console.error(error)
      //   }
      // )
    }
  }

  async ListaPesoEnvio(id: any) {
    // console.log(id)
    // this.itemsSelectPesoEnvio = []
    if (id != null || this.fechaUri != '') {
      this.xAPI.funcion = "IPOSTEL_R_ListarTablaPesoEnvio_ID"
      this.xAPI.parametros = id + ',' + this.fechaUri + ',' + 1 + ',' + this.idOPP
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.itemsSelectPesoEnvio = data.Cuerpo.map(e => {
            e.name = e.descripcion + ' (' + this.utilService.ConvertirMoneda(e.pmvp) + ') ' + e.nombre_peso_envio
            e.id = e.id_peso_envio
            // console.log(e)
            return e
          });
        },
        (error) => {
          console.log(error)
        }
      )
    } else {
      this.itemsSelectPesoEnvio = []
    }
  }

  async CapturarNav(event) {
    // console.log(event.target.id)
    switch (event.target.id) {
      case 'ngb-nav-0':
        this.DeclaracionPiezas = []
        this.rowsDeclaracionPiezas = []
        // this.itemsSelectTipoServicio = []
        this.ServicioFranqueoID = 1
        // await this.ListaServicioFranqueo()
        await this.ListaDeclaracionMovilizacionPiezas()
        break;
      case 'ngb-nav-1':
        this.DeclaracionPiezas = []
        this.rowsDeclaracionPiezas = []
        // this.itemsSelectTipoServicio = []
        this.ServicioFranqueoID = 2
        // await this.ListaServicioFranqueo()
        await this.ListaDeclaracionMovilizacionPiezas()
        break;
      case 'ngb-nav-2':
        this.DeclaracionPiezas = []
        this.rowsDeclaracionPiezas = []
        this.itemsSelectTipoServicio = []
        this.ServicioFranqueoID = 3
        //  await this.ListaServicioFranqueo()
        await this.ListaDeclaracionMovilizacionPiezas()
        break;
      case 'ngb-nav-3':
        this.DeclaracionPiezas = []
        this.rowsDeclaracionPiezas = []
        // this.itemsSelectTipoServicio = []
        this.ServicioFranqueoID = 4
        // await this.ListaServicioFranqueo()
        await this.ListaDeclaracionMovilizacionPiezas()
        break;
      case 'ngb-nav-4':
        this.DeclaracionPiezas = []
        this.rowsDeclaracionPiezas = []
        // this.itemsSelectTipoServicio = []
        this.ServicioFranqueoID = 5
        //  await this.ListaServicioFranqueo()
        await this.ListaDeclaracionMovilizacionPiezas()
        break;
      case 'ngb-nav-5':
        this.DeclaracionPiezas = []
        this.rowsDeclaracionPiezas = []
        // this.itemsSelectTipoServicio = []
        this.ServicioFranqueoID = 6
        // await this.ListaServicioFranqueo()
        await this.ListaDeclaracionMovilizacionPiezas()
        break;
      default:
        break;
    }
  }

  async MantenimientoSIRPVEN() {
    this.xAPI.funcion = "IPOSTEL_R_MantenimientoSIRPVEN";
    this.xAPI.parametros = '7'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.idMantenimiento = e.id_tipo_pago
          this.iniciales = e.iniciales_tipo_pagos
          this.nombre = e.nombre_tipo_pagos
          this.precio = e.tasa_petro
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  RegresarAtras() {
    this.router.navigate(['/postage/postage-per-month']);
  }

  ListaMantenimientoSeguidad() {
    this.xAPI.funcion = "IPOSTEL_R_MantenimientoSeguridad"
    this.xAPI.parametros = '1'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.MantenimientoYSeguridad = data.Cuerpo.map(e => {
          e.bolivares = e.tasa_petro * this.DolarDia ? this.DolarDia : 0
          var valor = e.tasa_petro * this.DolarDia
          e.valor = valor
          e.bolivaresx = this.utilService.ConvertirMoneda(valor)
          return e
        });
        // console.log(this.MantenimientoYSeguridad)
        //Calculamos el TOTAL 
        this.totalPetros = this.MantenimientoYSeguridad.reduce((
          acc,
          obj,
        ) => acc + (parseFloat(obj.tasa_petro)),
          0);
        this.totalBolivares = this.MantenimientoYSeguridad.reduce((
          acc,
          objx,
        ) => acc + (objx.tasa_petro * parseFloat(this.DolarDia)),
          0);
        this.convertirTotalBolivares = this.utilService.ConvertirMoneda(this.totalBolivares ? this.totalBolivares : 0)
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
          this.DolarDia = e.dolar
          this.PetroDia = e.petro_bolivares ? e.petro_bolivares : 0
          this.PrecioMantenimientoX = e.petro_bolivares
          // this.PrecioMantenimiento = this.utilService.ConvertirMoneda(e.petro_bolivares)
          this.PrecioMantenimiento = 0
          this.PetroConvertidoBolivares = e.petro_bolivares
          return e
        });
        // alert(this.DolarDia)
        this.IpagarRecaudacion.dolar_dia = this.DolarDia
        // this.IpagarRecaudacion.petro_dia = this.PetroDia

        // console.log(this.PrecioMantenimientoX)
      },
      (error) => {
        console.log(error)
      }
    )
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

  async ListaDeclaracionMovilizacionPiezas() {
    // const date = this.anio + '-' + this.mes
    this.DeclaracionPiezas = []
    this.rowsDeclaracionPiezas = []
    this.cantidadMovilidad = 0
    const id = this.ServicioFranqueoID
    // this.xAPI.funcion = "IPOSTEL_R_MovilizacionPiezas_date_id"
    // this.xAPI.parametros = this.idOPP + ',' + atob(this.rutaActiva.snapshot.params.id) + ',' + id + ',' + 0
    this.xAPI.funcion = "IPOSTEL_R_MovilizacionPiezas_date"
    this.xAPI.parametros = this.idOPP + ',' + atob(this.rutaActiva.snapshot.params.id) + ',' + 0
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.mes = this.transform(e.mes)
          e.tarifa_servicio = this.utilService.ConvertirMoneda(e.tarifa_servicio);
          e.monto_fpo = this.utilService.ConvertirMoneda(e.monto_fpo);
          e.monto_causado = this.utilService.ConvertirMoneda(e.monto_causado);
          this.DeclaracionPiezas.push(e)
        });
        // console.log( atob(this.rutaActiva.snapshot.params.id))
        this.rowsDeclaracionPiezas = this.DeclaracionPiezas;
        this.cantidadMovilidad = this.rowsDeclaracionPiezas.length
        this.tempDataDeclaracionPiezas = this.rowsDeclaracionPiezas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  ListaDeclaracionMovilizacionPiezasDECLARAR() {
    this.DeclaracionPiezasLength = []
    this.selected = 0
    this.xAPI.funcion = "IPOSTEL_R_MovilizacionPiezas_date_id_Declarar"
    this.xAPI.parametros = this.idOPP + ',' + atob(this.rutaActiva.snapshot.params.id) + ',' + 0
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.monto_causado = parseFloat(e.monto_causado)
          e.cantidad_piezas = parseFloat(e.cantidad_piezas)
          this.DeclaracionPiezasLength.push(e)
          this.selected = this.DeclaracionPiezasLength.length
        })
        const SumaMontos = this.DeclaracionPiezasLength.map(item => item.monto_causado).reduce((prev, curr) => prev + curr, 0);
        this.IpagarRecaudacion.petro_dia = SumaMontos
        this.MontoCausadoX = this.utilService.ConvertirMoneda(SumaMontos)
        this.MontoCausado = SumaMontos
        this.MontoCausadoYMantenimiento = SumaMontos
        var montoPagar = this.MontoCausado
        var montoMant = this.totalBolivares
        var TotalMontoPagar = montoPagar
        var TotalMontoPagar = montoPagar + this.totalBolivares  //completo y mantenimiento 
        var TotalMontoPagarConvertido = parseFloat(TotalMontoPagar.toFixed(2))
        // this.PrecioMantenimientoXTF = this.utilService.ConvertirMoneda(TotalMontoPagarConvertido)
        var TotalMante = TotalMontoPagarConvertido
        this.PrecioMantenimientoXTF = TotalMontoPagarConvertido
        var ok = parseFloat(SumaMontos) / parseFloat(this.PetroDia)
        var val = ok.toFixed(8)
        this.MontoPetro = 'P ' + val
        this.MontoCausado = TotalMontoPagarConvertido
        const SumarPiezas = this.DeclaracionPiezasLength.map(item => item.cantidad_piezas).reduce((prev, curr) => prev + curr, 0);
        this.TotalPiezas = SumarPiezas
        let ConversionPetroDiaSumaTotalBs = TotalMontoPagarConvertido / this.PetroDia
        this.MontoPetroTotalSumaServicio = ConversionPetroDiaSumaTotalBs.toFixed(8)
      },

      (error) => {
        console.log(error)
      }
    )
  }

  async ListaServicioFranqueo() {
    this.xAPI.funcion = "IPOSTEL_R_ServicioFranqueo";
    this.xAPI.parametros = ''
    // this.xAPI.funcion = "IPOSTEL_R_ServicioFranqueo_ID";
    // this.xAPI.parametros = `${this.ServicioFranqueoID}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.itemsSelectTipoServicio = data.Cuerpo.map(e => {
          e.name = e.nombre_servicios_franqueo
          e.id = e.id_servicios_franqueo
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  AddMovilizacionPiezas(modal) {
    this.miArray = JSON.parse(sessionStorage.getItem('movilizacion'));
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
    this.fechax = this.fechaUri
    this.cargarRegistros()
    this.items.splice(0);
    this.items.push([{
      id_opp: this.idOPP, // ID DE LA OPP
      id_servicio_franqueo: '', // ID DEL TIPO DE SERVICIO DE FRANQUEO
      id_peso_envio: '', // ID TIPO DE PESO DE ENVIO
      tarifa_servicio: '', // MONTO DEL PESO DE ENVIO 
      porcentaje_tarifa: '', // PORCENTAJE DE TARIFA SEGUN TIPOLOGIA_EMPRESA
      monto_fpo: '', // MONTO DE FPD
      mes: '', // MES DE DECLARACION
      cantidad_piezas: '', // CANTIDAD DE PIEZAS DECLARADAS
      monto_causado: '', // MONTO TOTAL A PAGAR
      user_created: this.idOPP
    }]);
  }

  async InsertMontoPeso(event: any) {
    // console.log(event);
    // console.log(event.pmvp);
    this.item.tarifa_servicio = event.pmvp
  }

  async DeletePiezas(data: any) {
    await Swal.fire({
      title: 'Esta Seguro?',
      text: "De Eliminar Este Registro!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectionBlockUI.start('Eliminando Piezas, por favor Espere!!!');
        this.movilizacionPiezas.EliminarMovilizacionPiezas(data.id_movilizacion_piezas)
          .then((resultado) => {
            // Manejar el resolve
            // console.log('Operación exitosa:', resultado);
            this.DeclaracionPiezas = []
            this.utilService.alertConfirmMini('success', 'Pieza Eliminada Exitosamente!')
            this.ListaDeclaracionMovilizacionPiezas()
            this.modalService.dismissAll('Close')
          })
          .catch((error) => {
            // Manejar el reject
            // console.error('Error en la operación:', error);
            this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
          })
          .finally(() => {
            // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
            // console.log('Procesamiento finalizado');
            this.ListaDeclaracionMovilizacionPiezasDECLARAR()
            this.sectionBlockUI.stop()
          });
        // this.xAPI.funcion = "IPOSTEL_D_DeclaracionPiezas";
        // this.xAPI.parametros = `${data.id_movilizacion_piezas}`
        // this.xAPI.valores = ''
        // this.apiService.Ejecutar(this.xAPI).subscribe(
        //   (data) => {
        //     this.rowsDeclaracionPiezas.push(this.DeclaracionPiezas)
        //     if (data.tipo === 1) {
        //       this.ListaDeclaracionMovilizacionPiezasDECLARAR()
        //       this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
        //       this.DeclaracionPiezas = []
        //       this.ListaDeclaracionMovilizacionPiezas()
        //     } else {
        //       this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
        //     }
        //   },
        //   (error) => {
        //     console.log(error)
        //   }
        // )
      }
    })
  }

  async MezclarPiezasFactura(data: any) {
    await this.movilizacionPiezas.UpdateMovilizacionPiezas(data)
      .then((resultado) => {
        this.rowsDeclaracionPiezas = []
        this.modalService.dismissAll('Close')
        this.utilService.alertConfirmMini('success', 'Declaración Registrada Exitosamente!')
        this.router.navigate(['/postage/postage-per-month'])
      })
      .catch((error) => {
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        this.sectionBlockUI.stop()
        this.ListaDeclaracionMovilizacionPiezas()
      })
  }


  async RegistrarSIDeclaracionPiezas() {
    await Swal.fire({
      title: 'Esta seguro de declarar?',
      html: "Estimado <strong><font color=red>Operador Postal Privado</font></strong> <br> tenga en cuenta que una vez realice la declaración de piezas no podra revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Declarar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.IpagarRecaudacion.id_opp = this.idOPP
        this.IpagarRecaudacion.status_pc = 4
        this.IpagarRecaudacion.tipo_pago_pc = 1
        this.IpagarRecaudacion.declaracion = 1
        this.IpagarRecaudacion.monto_pc = '0'
        this.IpagarRecaudacion.mantenimiento = JSON.stringify(this.MantenimientoYSeguridad)
        this.IpagarRecaudacion.monto_pagar = this.PrecioMantenimientoXTF.toString()
        this.IpagarRecaudacion.monto_pagar = this.MontoCausado
        // this.IpagarRecaudacion.dolar_dia = this.DolarDia
        // this.IpagarRecaudacion.petro_dia = this.PetroDia
        this.IpagarRecaudacion.fecha_pc = this.fechaActual
        // this.IpagarRecaudacion.archivo_adjunto = ''
        this.IpagarRecaudacion.user_created = this.idOPP

        this.sectionBlockUI.start('Guardando Declaración, por favor Espere!!!');

        this.movilizacionPiezas.DeclararMovilizacionPiezas(this.IpagarRecaudacion)
          .then((resultado) => {
            this.idFactura = resultado

            let ok = {
              id_factura: this.idFactura,
              id_opp: this.idOPP,
              mes: this.fechaUri
            }
            this.MezclarPiezasFactura(ok)
            this.utilService.alertConfirmMini('success', 'Liquidación Generada Satisfactoriamente')


          })
          .catch((error) => {
            // Manejar el reject
            this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
            this.sectionBlockUI.stop()
          })
          .finally(() => {
            // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
            // this.ListaDeclaracionMovilizacionPiezasDECLARAR()
            // this.sectionBlockUI.stop()
          });

      }
    })
  }

  async SIDeclararPiezasIPOSTEL(modal) {
    this.ListaDeclaracionMovilizacionPiezasDECLARAR()
    this.PetroConvertidoBolivares = this.PetroConvertidoBolivaresx
    Swal.fire({
      title: 'Visualizar Resumen de Declaración?',
      html: "Estimado <strong><font color=red>Operador Postal Privado</font></strong> <br> se recopilara todas las movilizaciones de piezas que tengas en las tablas de los diferentes tipos de franqueo, tenga en cuenta que una vez realice la declaración de piezas no podra revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Visualizarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Precio_Dolar_Petro()
        this.ListaMantenimientoSeguidad()
        this.modalService.open(modal, {
          centered: true,
          size: 'xl',
          backdrop: false,
          keyboard: false,
          windowClass: 'fondo-modal',
        });
      }
    })
  }

  async NODeclararPiezasIPOSTEL(modal) {
    Swal.fire({
      title: 'Esta seguro de declarar?',
      html: "Estimado <strong><font color=red>Operador Postal Privado</font></strong> <br> tenga en cuenta que una vez realice la declaración de piezas no podra revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Declarar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.Precio_Dolar_Petro()
        this.ListaMantenimientoSeguidad()
        this.token = jwt_decode(sessionStorage.getItem('token'));
        this.numControl = this.token.Usuario[0].rif
        this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos    
        // this.montoPagar = this.utilService.ConvertirMoneda(0)
        let mon = this.totalBolivares.toFixed(2)
        this.montoPagar = this.totalBolivares.toFixed(2)
        this.fechaActual = this.utilService.FechaActual()
        this.modalService.open(modal, {
          centered: true,
          size: 'xl',
          backdrop: false,
          keyboard: false,
          windowClass: 'fondo-modal',
        });
      }
    })
  }

  async RegistrarNoDeclaracionPiezas() {
    Swal.fire({
      title: 'Esta seguro de declarar?',
      html: "Estimado <strong><font color=red>Operador Postal Privado</font></strong> <br> tenga en cuenta que una vez realice la declaración de piezas no podra revertir los cambios!",
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo Declarar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        var frm = new FormData(document.forms.namedItem("forma"))
        this.IpagarRecaudacion.id_opp = this.idOPP
        this.IpagarRecaudacion.status_pc = 4
        this.IpagarRecaudacion.tipo_pago_pc = 1
        this.IpagarRecaudacion.monto_pc = '0'
        this.IpagarRecaudacion.monto_pagar = this.montoPagar
        // this.IpagarRecaudacion.dolar_dia = '0'
        // this.IpagarRecaudacion.petro_dia = '0'
        this.IpagarRecaudacion.fecha_pc = this.fechaActual
        this.IpagarRecaudacion.mantenimiento = JSON.stringify(this.MantenimientoYSeguridad)
        this.IpagarRecaudacion.archivo_adjunto = this.archivos[0].name
        this.IpagarRecaudacion.user_created = this.idOPP
        // console.log(this.MantenimientoYSeguridad)
        // console.log(this.IpagarRecaudacion)
        this.xAPI.funcion = "IPOSTEL_C_PagosDeclaracionOPP_SUB";
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IpagarRecaudacion)
        this.sectionBlockUI.start('Guardando Declaración, por favor Espere!!!');
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo === 1) {
              try {
                this.apiService.EnviarArchivos(frm).subscribe(
                  (data) => {
                    this.modalService.dismissAll('Close')
                    this.sectionBlockUI.stop()
                    this.utilService.alertConfirmMini('success', 'Declaración Registrada Exitosamente!')
                    this.router.navigate(['payments/payments-list']).then(() => { window.location.reload() });
                  },
                  (err) => {
                    this.sectionBlockUI.stop();
                    this.utilService.alertConfirmMini('error', 'Algo salio mal al cargar el archivo! <br> Verifique e intente de nuevo')
                  })
              } catch (err) {
                this.sectionBlockUI.stop();
                this.utilService.alertConfirmMini('error', 'Algo salio mal al cargar el archivo! <br> Verifique e intente de nuevo')
              }
            } else {
              this.sectionBlockUI.stop();
              this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      } else {
        this.modalService.dismissAll('Close')
        this.sectionBlockUI.stop();
      }
    })
  }

}
