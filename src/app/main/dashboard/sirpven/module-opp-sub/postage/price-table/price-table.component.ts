import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal, NgbActiveModal, NgbModalConfig, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { IPOSTEL_C_Peso_Envio_Franqueo, IPOSTEL_U_TarifasFranqueo } from '@core/services/empresa/form-opp.service';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';


export const repeaterAnimation = trigger('heightIn', [
  transition(':enter', [
    style({ opacity: '0', height: '0px' }),
    animate('.2s ease-out', style({ opacity: '1', height: '*' }))
  ])
]);

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
  animations: [repeaterAnimation]
})
export class PriceTableComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public PesoEnvioFranqueo: IPOSTEL_C_Peso_Envio_Franqueo = {
    id_opp: 0,
    pmvp: '',
    descripcion: '',
    iva: '',
    tasa_postal: '',
    total_pagar: '',
    mes: '',
    id_servicio_franqueo: 0,
    user_created: 0,
    status_pef: 0
  }

  public IupdateTarifaFranqueo : IPOSTEL_U_TarifasFranqueo = {
    status_pef: 0,
    id_peso_envio: 0,
    pmvp: '',
    iva: '',
    tasa_postal: '',
    total_pagar: '',
    mes: '',
    id_servicio_franqueo: 0,
    user_updated: 0,
    id_pef: undefined,
  }

  public itemsSelectMes = [
    {
      id: '0',
      name: 'Enero'
    },
    {
      id: '1',
      name: 'Febrero'
    },
    {
      id: '2',
      name: 'Marzo'
    },
    {
      id: '3',
      name: 'Abril'
    },
    {
      id: '4',
      name: 'Mayo'
    },
    {
      id: '5',
      name: 'Junio'
    },
    {
      id: '6',
      name: 'Julio'
    },
    {
      id: '7',
      name: 'Agosto'
    },
    {
      id: '8',
      name: 'Septiembre'
    },
    {
      id: '9',
      name: 'Ocubre'
    },
    {
      id: '10',
      name: 'Noviembre'
    },
    {
      id: '11',
      name: 'Diciembre'
    }
  ];

  public token
  public idOPP
  public fechax
  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public mesx = this.fecha.getMonth();
  public anio = this.fecha.getFullYear();

  public itemsSelectTipoServicio = []

  public items = [];
  public item = {
    id_opp: '',
    id_peso_envio: '',
    descripcion: '',
    pmvp: '',
    iva: '',
    tasa_postal: '',
    total_pagar: '',
    mes: '',
    id_servicio_franqueo: '',
    user_created: '',
  };

  public selectAnio = [
    { name: '2020' },
    { name: '2021' },
    { name: '2022' },
  ]

  public Xnombre_peso_envio
  public Xpmvp
  public Xiva
  public Xtasa_postal
  public Xtotal_pagar

public NombreTipoFranqueo
  public loginForm: FormGroup;

  public selectServicioFranqueo = []
  public itemsSelectPesoEnvio = []
  public rowsTarifaNacionalAereo
  public tempDataTarifasFranqueo = []
  public TarifasFranqueo = []

  public TarifasFranqueoAll = []
  public rowsTarifaFranqueoAll
  public tempDataTarifasFranqueoAll = []


  public montoIVA = 0
  public montoTASA
  public montoTASAnombre

  public ServicioFranqueoID = 1

  public selectedMes
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];

  public tempFecha = '';
  public tempServicio = '';
  public tempPeso = '';
  public tempStatus = '';

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = '';
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  public itemsSelectStatus = [
    { id: '0', name: 'No Autorizado'},
    { id: '1', name: 'Autorizado'}
  ]
  
  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token)
    if ( this.token.Usuario[0].iva_exento == 1) {
      this.montoIVA = 0
    }
    this.idOPP = this.token.Usuario[0].id_opp
    await this.TasaPostal(parseInt(this.token.Usuario[0].tipologia_empresa), this.idOPP)
    await this.ListaTarifaNacionalAereo()
    await this.fechaF()
    await this.ListaPesoEnvio()
    await this.ListaServicioFranqueo()
    await this.ListaTarifasFranqueoAll()
    await this.ModalListaServicioFranqueo(1)
  }

  addItem() {
    this.items.push({
      id_opp: null,
      id_peso_envio: null,
      descripcion: null,
      pmvp: null,
      iva: null,
      tasa_postal: null,
      total_pagar: null,
      mes: null,
      id_servicio_franqueo: null,
      user_created: null,
    });
  }
  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  async TasaPostal(tipologia, id_opp){
    this.xAPI.funcion = "IPOSTEL_R_TasaPostal"
    this.xAPI.parametros = tipologia+','+id_opp
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          this.montoTASA = e.tasa_postal ? e.tasa_postal : 0
          this.montoTASAnombre = e.nombre_tasa_postal ? e.nombre_tasa_postal : 0
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async CapturarNav(event: any) {
    // console.log(event.target.id);
    switch (event.target.id) {
      case 'ngb-nav-0':
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 1
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
      case 'ngb-nav-1':
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 2
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
      case 'ngb-nav-2':
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 3
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
      case 'ngb-nav-3':
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 4
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
      case 'ngb-nav-4':
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 5
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
      case 'ngb-nav-5':
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 6
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
      default:
        this.TarifasFranqueo = []
        this.TarifasFranqueoAll = []
        this.ServicioFranqueoID = 1
        await this.ListaTarifaNacionalAereo()
        await this.ModalListaServicioFranqueo(this.ServicioFranqueoID)
        break;
    }
  }

  async fechaF(){
    const date = this.anio + '-' + this.mes
    return date
  }

  async ListaTarifaNacionalAereo() {
    this.TarifasFranqueo = []
    const date = this.anio + '-' + '0'+this.mes
    const id = this.ServicioFranqueoID
    // console.log(id)
    this.xAPI.funcion = "IPOSTEL_R_TarifasFranqueo_date_id"
    this.xAPI.parametros = this.idOPP + ',' + date + ',' + id
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.pmvpx = e.pmvp
          e.ivax = e.iva
          e.tasa_postalx = e.tasa_postal
          e.total_pagarx = e.total_pagar
          e.pmvp = this.utilService.ConvertirMoneda(e.pmvp);
          e.iva = this.utilService.ConvertirMoneda(e.iva);
          e.tasa_postal = this.utilService.ConvertirMoneda(e.tasa_postal);
          e.total_pagar = this.utilService.ConvertirMoneda(e.total_pagar);
          this.TarifasFranqueo.push(e)
        });
        // console.log(this.TarifasFranqueo)
        this.rowsTarifaNacionalAereo = this.TarifasFranqueo;
        this.tempDataTarifasFranqueo = this.rowsTarifaNacionalAereo
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaTarifasFranqueoAll() {
    this.xAPI.funcion = "IPOSTEL_R_TarifasFranqueo"
    this.xAPI.parametros = `${this.idOPP}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.TarifasFranqueoAll = []
        data.Cuerpo.map(e => {
          if (e.status_pef == 1) {
            e.status = 'Autorizado' 
          } else {
            e.status = 'No Autorizado' 
          }
          e.pmvp = this.utilService.ConvertirMoneda(e.pmvp);
          e.iva = this.utilService.ConvertirMoneda(e.iva);
          e.tasa_postal = this.utilService.ConvertirMoneda(e.tasa_postal);
          e.total_pagar = this.utilService.ConvertirMoneda(e.total_pagar);
          this.TarifasFranqueoAll.push(e)
        });
        // console.log(this.TarifasFranqueoAll)
        this.rows = this.TarifasFranqueoAll
        this.tempData = this.rows
        // this.rowsTarifaFranqueoAll = this.TarifasFranqueoAll;
        // this.tempDataTarifasFranqueoAll = this.rowsTarifaFranqueoAll
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaServicioFranqueo() {
    this.xAPI.funcion = "IPOSTEL_R_ServicioFranqueo";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectServicioFranqueo = data.Cuerpo.map(e => {
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

  async ModalListaServicioFranqueo(TipoFranqueoId : any) { //Mostrar el Tipo de Franqueo en el Modal
    this.xAPI.funcion = "IPOSTEL_R_ServicioFranqueo";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.id_servicios_franqueo == TipoFranqueoId) {
            this.NombreTipoFranqueo = e.nombre_servicios_franqueo
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaPesoEnvio() {
    this.xAPI.funcion = "IPOSTEL_R_PesoEnvio";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.itemsSelectPesoEnvio = data.Cuerpo.map(e => {
          e.name = e.nombre_peso_envio
          e.id = e.id_peso_envio
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }
  
  async ModalRegistrarTarifaEnvio(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
    this.fechax = this.anio+'-0'+this.mes
    this.items.splice(0);
    this.items.push([{
      id_opp: '',
      id_peso_envio: '',
      descripcion: '',
      pmvp: '',
      iva: '',
      tasa_postal: '',
      total_pagar: '',
      mes: '',
      id_servicio_franqueo: '',
      user_created: ''
    }]);
  }

  async EditTarifa(modal, data){
    // console.log(data);
    this.Xnombre_peso_envio = data.nombre_peso_envio
    this.Xpmvp = data.pmvpx
    this.Xiva = data.ivax
    this.Xtasa_postal = data.tasa_postalx
    this.Xtotal_pagar = data.total_pagarx

    this.IupdateTarifaFranqueo.status_pef = 0
    this.IupdateTarifaFranqueo.id_peso_envio = data.id_peso_envio
    this.IupdateTarifaFranqueo.mes = data.mes
    this.IupdateTarifaFranqueo.id_servicio_franqueo = parseInt(data.id_servicio_franqueo)
    this.IupdateTarifaFranqueo.user_updated = this.idOPP
    this.IupdateTarifaFranqueo.id_pef = data.id_pef


    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  CambiarMontos(data: any){
    var ivaq = data * this.montoIVA  / 100
    var tasaq = data * this.montoTASA / 100
    var suma = (ivaq + tasaq)
    var totalq = parseFloat(data) + suma

    this.Xiva = parseFloat(ivaq.toFixed(2))
    this.Xtasa_postal = parseFloat(tasaq.toFixed(2))
    this.Xtotal_pagar = totalq

    this.IupdateTarifaFranqueo.pmvp = data
    this.IupdateTarifaFranqueo.iva = this.Xiva
    this.IupdateTarifaFranqueo.tasa_postal = this.Xtasa_postal
    this.IupdateTarifaFranqueo.total_pagar = this.Xtotal_pagar
  }

  async UpdateTarifa(){
    await Swal.fire({
      title: 'Esta Seguro?',
      html: "De Actualizar el Monto de este Registro! <br> Tenga en cuenta que una vez modifique el monto tendra que esperar la autorización del mismo por parte de <font color='red'><strong>IPOSTEL</strong</font>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
    this.xAPI.funcion = "IPOSTEL_U_TarifasFranqueo"
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IupdateTarifaFranqueo)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.sectionBlockUI.start('Actualizando Registros, Porfavor Espere!!!');
        this.rowsTarifaNacionalAereo.push(this.TarifasFranqueo)
        if (data.tipo === 1) {
          this.TarifasFranqueo = []
          this.TarifasFranqueoAll = []
          this.ListaTarifaNacionalAereo()
          this.ListaTarifasFranqueoAll()
          this.modalService.dismissAll('Close')
          this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Tarifas Actualizadas Exitosamente!')
        } else {
          this.sectionBlockUI.stop();
          this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
    })
  }


  async RegistrarTarifaNacionalAereo() {
    for (let index = 0; index < this.items.length; index++) {
      const element = this.items[index];
      const iva = element.pmvp * this.montoIVA / 100
      const tasa = element.pmvp * this.montoTASA / 100
      const total = element.pmvp + iva + tasa
      this.PesoEnvioFranqueo.id_opp = this.idOPP
      this.PesoEnvioFranqueo.pmvp = element.pmvp
      this.PesoEnvioFranqueo.id_peso_envio = parseInt(element.id_peso_envio)
      this.PesoEnvioFranqueo.descripcion = element.descripcion
      this.PesoEnvioFranqueo.iva = parseFloat(iva.toFixed(2))
      this.PesoEnvioFranqueo.tasa_postal = parseFloat(tasa.toFixed(2))
      this.PesoEnvioFranqueo.total_pagar = parseFloat(total.toFixed(2))
      this.PesoEnvioFranqueo.mes = this.fechax
      this.PesoEnvioFranqueo.id_servicio_franqueo = parseInt(element.id_servicio_franqueo)
      this.PesoEnvioFranqueo.user_created = this.idOPP
      this.xAPI.funcion = "IPOSTEL_C_Peso_Envio_Franqueo"
      this.xAPI.parametros = ''
      this.xAPI.valores = JSON.stringify(this.PesoEnvioFranqueo)
      // console.log(this.PesoEnvioFranqueo )
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.sectionBlockUI.start('Guardando Registros, Porfavor Espere!!!');
          this.rowsTarifaNacionalAereo.push(this.TarifasFranqueo)
          if (data.tipo === 1) {
            this.TarifasFranqueo = []
            this.TarifasFranqueoAll = []
            this.ListaTarifaNacionalAereo()
            this.ListaTarifasFranqueoAll()
            this.modalService.dismissAll('Close')
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('success', 'Tarifas Registradas Exitosamente!')
          } else {
            this.sectionBlockUI.stop();
            this.utilService.alertConfirmMini('error', 'Algo salio mal! <br> Verifique e intente de nuevo')
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  async DeleteTarifaNacionalAereo(data: any) {
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
        this.xAPI.funcion = "IPOSTEL_D_TarifasFranqueo";
        this.xAPI.parametros = `${data.id_pef}`
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rowsTarifaNacionalAereo.push(this.TarifasFranqueo)
            if (data.tipo === 1) {
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
              this.TarifasFranqueo = []
              this.TarifasFranqueoAll = []
              this.ListaTarifaNacionalAereo()
              this.ListaTarifasFranqueoAll()  
            } else {
              this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }

  filterUpdateTarifaNacionalAereo(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataTarifasFranqueo.filter(function (d) {
      return d.nombre_peso_envio.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsTarifaNacionalAereo = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }




  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterByFecha(event) {
    // console.log(event)
    const filter = event ? event : '';
    this.tempFecha = filter;
    this.temp = this.filterRows(filter, this.tempServicio, this.tempPeso, this.tempStatus);
    this.rows = this.temp;
  }

  filterByServicio(event) {
    // console.log(event.name)
    const filter = event ? event.name : '';
    this.tempServicio = filter;
    this.temp = this.filterRows(this.tempFecha, filter, this.tempPeso, this.tempStatus);
    this.rows = this.temp;
  }

  filterByPeso(event) {
    // console.log(event)
    const filter = event ? event.name : '';
    this.tempPeso = filter;
    this.temp = this.filterRows(this.tempFecha, this.tempServicio, filter, this.tempStatus);
    this.rows = this.temp;
  }

  filterByStatus(event) {
    // console.log(event.name)
    const filter = event ? event.name : '';
    this.tempStatus = filter;
    this.temp = this.filterRows(this.tempFecha, this.tempServicio, this.tempPeso,  filter);
    this.rows = this.temp;
  }

  filterRows(fecha: string, servicio: string, peso: string, status: string): any[] {
    // this.searchValue = '';
    servicio = servicio.toLowerCase();
    peso = peso.toLowerCase();
    status = status.toLowerCase();
    return this.tempData.filter(row => {                            
      let tempFecha = fecha == '' ? true : row.mes.indexOf(fecha) !== -1;
      let tempServicio = servicio == '' ? true : row.nombre_servicios_franqueo.toLowerCase().toString().indexOf(servicio) !== -1;
      let tempPeso = peso == '' ? true : row.nombre_peso_envio.toLowerCase().toString().indexOf(peso) !== -1 ;
      let tempStatus = status == '' ? true : row.status.toLowerCase().toString().indexOf(status) !== -1 ;
      return tempFecha && tempServicio && tempPeso && tempStatus;
    });
  }



}

