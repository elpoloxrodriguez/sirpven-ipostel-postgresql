import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPOSTEL_RegistrarSucursalSUB, TablaMatrixSUBCONTRATO } from '@core/services/empresa/form-opp.service';
import { UtilService } from '@core/services/util/util.service';
import { Router } from '@angular/router';
import { AddAgencyService } from '../add-agency.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.scss']
})
export class BranchOfficesComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public tablaMatrixSubcontrato: TablaMatrixSUBCONTRATO = {
    id_sub: 0,
    id_opp: 0
  }

  public SubSucursales = []
  public token
  public TipoRegistro
  public IdOPP
  public CargarSub

  public tipoSucursal = [
    { id: 0, name: 'Principal' },
    { id: 1, name: 'Agencia' }
  ]

  public SelectEstado
  public SelectCiudad
  public SelectMunicipio
  public SelectParroquia

  public ICrearSucursalSUB: IPOSTEL_RegistrarSucursalSUB = {
    id_sub: 0,
    estado_empresa: undefined,
    ciudad_empresa: undefined,
    municipio_empresa: undefined,
    parroquia_empresa: undefined,
    zona_empresa: '',
    tipo_sub: undefined,
  }

  public ListaCompletaOPP = [];

  public idSUB
  public SelectOPP = []
  public idOPPSubcontrato: []
  public idcontrato

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public searchValue = '';
  public rowsSucursales
  public tempDataSucursales = []

  public TitleModal

  public item = []
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private router: Router,
    private agregarAgencia: AddAgencyService
  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token)
    this.TipoRegistro = this.token.Usuario[0].tipo_registro
    this.IdOPP = this.token.Usuario[0].id_opp
    this.ICrearSucursalSUB.nombre_empresa = this.token.Usuario[0].nombre_empresa
    this.ICrearSucursalSUB.rif_empresa = this.token.Usuario[0].rif
    await this.Sucursales(this.IdOPP)
    await this.Select_Estados()
    await this.EmpresaOppSub()
  }

  async Select_Estados() {
    this.xAPI.funcion = 'ListarEstados'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.SelectEstado = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectEstado = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Ciudad(id: any) {
    this.ICrearSucursalSUB.estado_empresa = id.estado
    this.xAPI.funcion = 'ListarCiudad'
    this.xAPI.parametros = id.id_estado
    this.xAPI.valores = ''
    this.SelectCiudad = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectCiudad = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Municipo(id: any) {
    this.ICrearSucursalSUB.ciudad_empresa = id.ciudad
    this.xAPI.funcion = 'ListarMunicipio'
    this.xAPI.parametros = id.id_estado
    this.xAPI.valores = ''
    this.SelectMunicipio = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectMunicipio = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }
  async Select_Parroquia(id: any) {
    this.ICrearSucursalSUB.municipio_empresa = id.municipio
    this.xAPI.funcion = 'ListarParroquia'
    this.xAPI.parametros = id.id_municipio
    this.xAPI.valores = ''
    this.SelectParroquia = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectParroquia = data.Cuerpo.map(e => {
          return e
        })
      },
      (error) => {
        console.error(error)
      }
    )
  }

  CapParroquia(id: any) {
    this.ICrearSucursalSUB.parroquia_empresa = id.parroquia
  }

  async Sucursales(id: any) {
    this.xAPI.funcion = "IPOSTEL_R_Sucursales_SUB"
    this.xAPI.parametros = `${id}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.SubSucursales.push(e)
        });
        this.rowsSucursales = this.SubSucursales;
        this.tempDataSucursales = this.rowsSucursales
        // console.log( this.rowsSucursales)
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
    const temp = this.tempDataSucursales.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsSucursales = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  ModalAgregarSucursal(modal) {
    this.ICrearSucursalSUB.nombre_empresa = this.token.Usuario[0].nombre_empresa
    this.ICrearSucursalSUB.rif_empresa = this.token.Usuario[0].rif
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });

  }

  async GuardarSucursal() {
    this.sectionBlockUI.start('Registrando Sucursal, por favor Espere!!!');
    this.ICrearSucursalSUB.id_sub = this.IdOPP
    await this.agregarAgencia.AgregarAgencia(this.ICrearSucursalSUB)
      .then((resultado) => {
        // Manejar el resolve
        // console.log('Operación exitosa:', resultado);
        this.SubSucursales = []
        this.Limpiar()
        this.modalService.dismissAll('Cerrar Modal')
        this.utilService.alertConfirmMini('success', 'Agencia Registrada Exitosamente')
      })
      .catch((error) => {
        // Manejar el reject
        // console.error('Error en la operación:', error);
        this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
      })
      .finally(() => {
        // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
        // console.log('Procesamiento finalizado');
        this.Sucursales(this.IdOPP)
        this.sectionBlockUI.stop()
      });
  }

  Limpiar() {
    this.ICrearSucursalSUB = {
      id_sub: 0,
      estado_empresa: undefined,
      ciudad_empresa: undefined,
      municipio_empresa: undefined,
      parroquia_empresa: undefined,
      zona_empresa: '',
      tipo_sub: undefined,
      // nombre_empresa: '',
      // rif_empresa: ''
    }
  }

  async GuardarSubcontrato() {
    for (let i = 0; i < this.ListaCompletaOPP.length; i++) {
      const element = this.ListaCompletaOPP[i];
    await this.servicioGuardarSubcontrato(element)
    }
  }

  servicioGuardarSubcontrato(subcontrato : any){
    this.sectionBlockUI.start('Agregando Subcontrato, por favor Espere!!!');
    this.agregarAgencia.AgregarSubcontrato(subcontrato)
    .then((resultado) => {
      // Manejar el resolve
      // console.log('Operación exitosa:', resultado);
      this.SubSucursales = []
      this.idcontrato = undefined
      this.modalService.dismissAll('Cerrar Modal')
      this.utilService.alertConfirmMini('success', 'Subcontrato Registrado Exitosamente')
    })
    .catch((error) => {
      // Manejar el reject
      // console.error('Error en la operación:', error);
      this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
    })
    .finally(() => {
      // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
      // console.log('Procesamiento finalizado');
      this.Sucursales(this.IdOPP)
      this.sectionBlockUI.stop()
    });
  }

  onSelectChange(selectedItems: any[]) {
    this.ListaCompletaOPP = selectedItems.map(item => {
      return { opp: item.id, sub: this.idSUB };
    });
  }


  EmpresaOppSub() {
    this.xAPI.funcion = "IPOSTEL_R_OPP_SUB";
    this.xAPI.parametros = '1'
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          e.id = e.id_opp,
            e.name = e.nombre_empresa.toUpperCase()
          this.SelectOPP.push(e)
        });
        // console.log(this.SelectOPP)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  async EliminarContrato(row: any){
    // console.log(row.id_suc)
    await Swal.fire({
      title: "Esta seguro?",
      text: "Desea eliminar esta agencia ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarla!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sectionBlockUI.start('Eliminando Agencia, por favor Espere!!!');
        this.agregarAgencia.EliminarAgencia(row.id_suc)
        .then((resultado) => {
          // Manejar el resolve
          // console.log('Operación exitosa:', resultado);
          this.SubSucursales = []
          this.Limpiar()
          this.modalService.dismissAll('Cerrar Modal')
          this.utilService.alertConfirmMini('success', 'Agencia Eliminada Exitosamente')
        })
        .catch((error) => {
          // Manejar el reject
          // console.error('Error en la operación:', error);
          this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal!')
        })
        .finally(() => {
          // Este bloque se ejecutará después de que la promesa se resuelva o se rechace
          // console.log('Procesamiento finalizado');
          this.Sucursales(this.IdOPP)
          this.sectionBlockUI.stop()
        });
      }
    });
  }


  AgregarContrato(modal: any, row: any) {
    this.idSUB = row.id_suc
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

}

