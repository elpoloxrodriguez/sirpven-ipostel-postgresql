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


@Component({
  selector: 'app-philately-admin',
  templateUrl: './philately-admin.component.html',
  styleUrls: ['./philately-admin.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class PhilatelyAdminComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

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
    {id: 1, name:'A1'},
    {id: 2, name:'A'},
    {id: 3, name:'B'},
    {id: 4, name:'C'},
    {id: 5, name:'D'},
  ]

  public SelectValorEstampilla = [
    {id: 1, name:'1 Bs'},
    {id: 2, name:'10 Bs'},
    {id: 3, name:'20 Bs'},
    {id: 4, name:'50 Bs'},
    {id: 5, name:'100 Bs'},
  ]

  public SelectOPP

  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private filatelia: FilateliaService,
  ) { }

  ngOnInit(): void {
    this.ListaOpp()
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


  Generar(){
    this.sectionBlockUI.start('Generando Filatelia..., Porfavor Espere!!!');
    let id : string = 'ewcjnkjnwecew'
    let ruta: string = btoa('https://sirp.ipostel.gob.ve');
    // this.apiService.GenQR(id, ruta).subscribe(
      this.apiService.LoadQR(id).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.filatelia.GenerarFilatelia(data.contenido)
          this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')      
        } else {
          this.sectionBlockUI.stop()
          this.utilService.alertConfirmMini('error', 'Oops!!! Algo salio mal, verifique eh intente de nuevo')                
        }
      },
      (error) => {
        console.log(error)
      }
    )

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

  ListaOpp(){
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


}
