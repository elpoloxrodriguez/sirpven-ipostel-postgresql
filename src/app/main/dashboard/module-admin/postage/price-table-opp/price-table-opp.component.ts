import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal, NgbActiveModal, NgbModalConfig, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { IPOSTEL_C_Peso_Envio_Franqueo, IPOSTEL_U_ListaTarifasOppAutorizacion } from '@core/services/empresa/form-opp.service';
import jwt_decode from "jwt-decode";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { stringify } from 'querystring';


@Component({
  selector: 'app-price-table-opp',
  templateUrl: './price-table-opp.component.html',
  styleUrls: ['./price-table-opp.component.scss']
})
export class PriceTableOppComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public chkBoxSelected = [];

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IUpdateListaTablaTarifasFranqueo : IPOSTEL_U_ListaTarifasOppAutorizacion = {
    status_pef: 0,
    id_peso_envio: 0,
    descripcion: '',
    pmvp: '',
    iva: '',
    tasa_postal: '',
    total_pagar: '',
    mes: '',
    id_servicio_franqueo: 0,
    user_updated: 0,
    id_pef: 0
  }

  public itemsSelectStatus = [
    { id: '0', name: 'No Autorizado'},
    { id: '1', name: 'Autorizado'}
  ]

  public token
  public idOPP
  public fechax
  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();

  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public RowsLengthConciliacion

  public SelectionType = SelectionType;

  public loginForm: FormGroup;

  public selectServicioFranqueo = []
  public itemsSelectPesoEnvio = []
  public itemsSelectListaOPP = []
  public rowsTarifaNacionalAereo
  public tempDataTarifasFranqueo = []
  public TarifasFranqueo = []

  public TarifasFranqueoAll = []
  public rowsTarifaFranqueoAll
  public tempDataTarifasFranqueoAll = []

  public BashElem = []

  public montoIVA = 16
  public montoTASA
  public montoTASAnombre

  public ServicioFranqueoID = 1
  public selected = [];

public SelectidOPP

  public selectedMes
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';
  public previousStatusAutorizadoFilter = '';
  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public selectedStatusAutorizado;
  public searchValue = '';
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  public ListaSeleccionada = []

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private modalService: NgbModal,
    private router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOPP = this.token.Usuario[0].id_user
    // console.log(this.idOPP)
    await this.ListaOPP()
    await this.ListaPesoEnvio()
    await this.ListaServicioFranqueo()
    // await this.ListaTarifasFranqueoAll()
  }

  customChkboxOnSelect({ selected }) {
    this.chkBoxSelected.splice(0, this.chkBoxSelected.length);
    this.chkBoxSelected.push(...selected);
  }

  onSelect({ selected }) {
    this.ListaSeleccionada = []
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    for (let i = 0; i < selected.length; i++) {
      const element = selected[i];
      this.ListaSeleccionada.push(element)
    }
    // console.log(this.BashElem)
  }
  onActivate(event) {
    // console.log('Activate Event', event.row);
  }

  ItemSeleccionados(){
    this.sectionBlockUI.start('Rechazando Tarifas, Porfavor Espere!!!');
    let parametros = '0'
    this.ListaSeleccionada.map(e => {
      parametros += ','+e.id_pef
      this.BashElem.push(e.id_pef)
   });
   this.xAPI.funcion = "IPOSTEL_U_TarifasRechazo"
   this.xAPI.parametros = 'id_pef##'+ parametros
   this.xAPI.valores = ''
   this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      this.sectionBlockUI.stop()
      this.utilService.alertConfirmMini('success', 'Tarifa Rechazada Exitosamente')
    },
    (error) => {
      console.log(error)
    }
   )
  //  console.log(parametros)
  }

  async AprobarSelectTableTarifas(){
    this.RowsLengthConciliacion = []
    for (let i = 0; i < this.ListaSeleccionada.length; i++) {
      const element = this.ListaSeleccionada[i];
      this.IUpdateListaTablaTarifasFranqueo.status_pef = 1
      this.IUpdateListaTablaTarifasFranqueo.id_peso_envio = element.id_peso_envio
      this.IUpdateListaTablaTarifasFranqueo.pmvp = element.pmvp
      this.IUpdateListaTablaTarifasFranqueo.iva = element.iva
      this.IUpdateListaTablaTarifasFranqueo.tasa_postal = element.tasa_postal
      this.IUpdateListaTablaTarifasFranqueo.total_pagar = element.total_pagar
      this.IUpdateListaTablaTarifasFranqueo.mes = element.mes
      this.IUpdateListaTablaTarifasFranqueo.descripcion = element.descripcion
      this.IUpdateListaTablaTarifasFranqueo.id_servicio_franqueo = element.id_servicio_franqueo 
      this.IUpdateListaTablaTarifasFranqueo.user_updated = this.idOPP
      this.IUpdateListaTablaTarifasFranqueo.id_pef = element.id_pef
       // 
      this.xAPI.funcion = 'IPOSTEL_U_ListaTarifasOppAutorizacion'
      this.xAPI.parametros = ''
      this.xAPI.valores = JSON.stringify(this.IUpdateListaTablaTarifasFranqueo)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.sectionBlockUI.start('Autorizando Tarifas, Porfavor Espere!!!');
          this.rows.push(this.TarifasFranqueoAll)
          if (data.tipo === 1) {
            this.selected = []
            this.TarifasFranqueoAll = []
            this.RowsLengthConciliacion = []
            this.ListaTarifasFranqueoAll(this.SelectidOPP)
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('success', 'Tarifa Autorizada Exitosamente')
          } else {
            this.sectionBlockUI.stop()
            this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
    }
  
    async RechazarSelectTableTarifas(){
      this.selected = []
      this.RowsLengthConciliacion = []
      for (let i = 0; i < this.ListaSeleccionada.length; i++) {
        const element = this.ListaSeleccionada[i];
        this.IUpdateListaTablaTarifasFranqueo.status_pef = 0
        this.IUpdateListaTablaTarifasFranqueo.id_peso_envio = element.id_peso_envio
        this.IUpdateListaTablaTarifasFranqueo.pmvp = element.pmvp
        this.IUpdateListaTablaTarifasFranqueo.iva = element.iva
        this.IUpdateListaTablaTarifasFranqueo.tasa_postal = element.tasa_postal
        this.IUpdateListaTablaTarifasFranqueo.total_pagar = element.total_pagar
        this.IUpdateListaTablaTarifasFranqueo.mes = element.mes
        this.IUpdateListaTablaTarifasFranqueo.descripcion = element.descripcion
        this.IUpdateListaTablaTarifasFranqueo.id_servicio_franqueo = element.id_servicio_franqueo 
        this.IUpdateListaTablaTarifasFranqueo.user_updated = this.idOPP
        this.IUpdateListaTablaTarifasFranqueo.id_pef = element.id_pef
         // 
        this.xAPI.funcion = 'IPOSTEL_U_ListaTarifasOppAutorizacion'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IUpdateListaTablaTarifasFranqueo)
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.sectionBlockUI.start('Rechazando Tarifas, Porfavor Espere!!!');
            this.rows.push(this.TarifasFranqueoAll)
            if (data.tipo === 1) {
              this.TarifasFranqueoAll = []
              this.RowsLengthConciliacion = []
              this.ListaTarifasFranqueoAll(this.SelectidOPP)
              this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('success', 'Tarifa Rechazada Exitosamente')
            } else {
              this.sectionBlockUI.stop()
              this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
      }

  async ListaTarifasFranqueoAll(IDOPP) {
    this.TarifasFranqueoAll = []
    if (this.SelectidOPP != null) {
    this.xAPI.funcion = "IPOSTEL_R_TarifasFranqueo"
    this.xAPI.parametros = `${IDOPP}`
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.pmvpx = this.utilService.ConvertirMoneda(e.pmvp);
          e.ivax = this.utilService.ConvertirMoneda(e.iva);
          e.tasa_postalx = this.utilService.ConvertirMoneda(e.tasa_postal);
          e.total_pagarx = this.utilService.ConvertirMoneda(e.total_pagar);
          this.TarifasFranqueoAll.push(e)
        });
        // console.log(this.TarifasFranqueoAll)
        this.rows = this.TarifasFranqueoAll
        this.RowsLengthConciliacion = this.rows.length
        this.tempData = this.rows
      },
      (error) => {
        console.log(error)
      }
    )
    } else {
      this.TarifasFranqueoAll = []
    }
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

  async ListaOPP() {
    this.xAPI.funcion = "IPOSTEL_R_OPP_SUB";
    this.xAPI.parametros = '1'
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.itemsSelectListaOPP = data.Cuerpo.map(e => {
          e.id = e.id_opp
          e.name = e.nombre_empresa+' | ('+e.rif+')'
          return e
        });
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


  async DeleteTarifaOpp(data: any) {
    let OPP = data.id_opp
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
            this.rows.push(this.TarifasFranqueoAll)
            if (data.tipo === 1) {
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
              this.TarifasFranqueoAll = []
              this.ListaTarifasFranqueoAll(OPP)  
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

  filterUpdate(event) {
    this.selectedRole = this.selectedMes[0];
    this.selectedPlan = this.selectServicioFranqueo[0];
    this.selectedStatus = this.itemsSelectPesoEnvio[0];
    this.selectedStatusAutorizado = this.itemsSelectStatus[0];
    const val = event.target.value != null ? event.target.value.toLowerCase() : '';
    const temp = this.tempData.filter(function (d) {
      return d.status_pef.toLowerCase().indexOf(val) != -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }
  

  filterByFecha(event) {
    const filter = event ? event : '';
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(filter, this.previousPlanFilter, this.previousStatusFilter, this.previousStatusAutorizadoFilter);
    this.rows = this.temp;
  }

  filterByServicio(event) {
    const filter = event ? event.nombre_servicios_franqueo : '';
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, filter, this.previousStatusFilter, this.previousStatusAutorizadoFilter);
    this.rows = this.temp;
  }

  filterByPeso(event) {
    const filter = event ? event.nombre_peso_envio : '';
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, filter, this.previousStatusAutorizadoFilter);
    this.rows = this.temp;
  }

  filterByStatus(event) {
    const filter = event ? event.id : '';
    this.previousStatusAutorizadoFilter = filter;
    this.temp = this.filterRows(this.previousRoleFilter, this.previousPlanFilter, this.previousStatusFilter,  filter);
    this.rows = this.temp;
  }

  filterRows(roleFilter, planFilter, statusFilter, statusAutorizadoFilter): any[] {
    this.searchValue = '';
    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();
    statusAutorizadoFilter = statusAutorizadoFilter.toLowerCase();
    return this.tempData.filter(row => {
      const isPartialNameMatch = row.mes.indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch = row.nombre_servicios_franqueo.toLowerCase().toString().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch = row.nombre_peso_envio.toLowerCase().toString().indexOf(statusFilter) !== -1 || !statusFilter;
      const isPartialStatusAutorizadoMatch = row.status_pef.toString().indexOf(statusAutorizadoFilter) !== -1 || !statusAutorizadoFilter;
      return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch && isPartialStatusAutorizadoMatch;
    });
  }

}
