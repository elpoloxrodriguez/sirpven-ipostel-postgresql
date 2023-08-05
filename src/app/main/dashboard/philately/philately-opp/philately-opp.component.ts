import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { UtilService } from '@core/services/util/util.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-philately-opp',
  templateUrl: './philately-opp.component.html',
  styleUrls: ['./philately-opp.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class PhilatelyOppComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public token
  public idOPP

  public searchValue = '';
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public rowsTirajes;
  private tempDataTirajes = [];
  public ListaTirajesQR = []

  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.idOPP = this.token.Usuario[0].id_opp
    this.ListaTirajesOPP(this.idOPP)
    // this.sectionBlockUI.start('Cargando..., Porfavor Espere!!!');
    // this.sectionBlockUI.stop()
  }

  filterUpdate(event) {
    // console.log(event)
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataTirajes.filter(function (d) {
      return d.tiraje.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsTirajes = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  ListaTirajesOPP(id: number) {
    this.xAPI.funcion = "IPOSTEL_Lista_TirajeQR_IDOPP";
    this.xAPI.parametros = `${id}`
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data == null ) return 
        data.map(e => {
          e.costo = this.utilService.ConvertirMoneda(e.costo)
          e.cantidadQR = e.QR.length
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
          e.valor = e.valor.name
          console.log(e)
          this.ListaTirajesQR.push(e)
        });
        this.rowsTirajes = this.ListaTirajesQR
        this.tempDataTirajes = this.rowsTirajes
      },
      (err) => {
        console.log(err)
      }
    )
  }

}
