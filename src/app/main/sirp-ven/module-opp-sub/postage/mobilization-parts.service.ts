import { Injectable, EventEmitter } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';

@Injectable({
    providedIn: 'root'
})

export class MobilizationPartsService {
    
    listaActualizada: EventEmitter<void> = new EventEmitter<void>();


    public xAPI: IAPICore = {
        funcion: '',
        parametros: '',
        valores: {},
    };

    constructor(
        private apiService: ApiService,
        private utilService: UtilService,
    ) { }


    borrarRegistro(index: number) {
        let registros = JSON.parse(sessionStorage.getItem('movilizacion') || '[]');
        registros.splice(index, 1);
        sessionStorage.setItem('movilizacion', JSON.stringify(registros));
        this.listaActualizada.emit();
      }
    
      agregarRegistro(nuevoRegistro: any) {
        let registros = JSON.parse(sessionStorage.getItem('movilizacion') || '[]');
        registros.push(nuevoRegistro);
        sessionStorage.setItem('movilizacion', JSON.stringify(registros));
        this.listaActualizada.emit();
      }

    /*
        Este servicio se encarga de Agregar Agencia
        a la OPP que tenga la sesion iniciada
    */
    async AgregarMovilizacionPiezas(piezas: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_MovilizacionPiezas";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(piezas)
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                },
                (error) => {
                    console.log(error)
                    reject(error)
                }
            )
        });
    }

    async EliminarMovilizacionPiezas(id: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_D_DeclaracionPiezas";
            this.xAPI.parametros = `${id}`
            this.xAPI.valores = ''
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                },
                (error) => {
                    console.log(error)
                    reject(error)
                }
            )
        });
    }



    async DeclararMovilizacionPiezas(declarar: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_C_PagosDeclaracionOPP_SUB";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(declarar)
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data.msj)
                    } else {
                        reject(data)
                    }
                },
                (error) => {
                    console.log(error)
                    reject(error)
                }
            )
        });
    }

    async UpdateMovilizacionPiezas(declarar: any): Promise<string> {
        return new Promise((resolve, reject) => {
            this.xAPI.funcion = "IPOSTEL_U_MovilizacionPiezasIdFactura";
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(declarar)
            this.apiService.Ejecutar(this.xAPI).subscribe(
                (data) => {
                    if (data.tipo == 1) {
                        resolve(data)
                    } else {
                        reject(data)
                    }
                },
                (error) => {
                    console.log(error)
                    reject(error)
                }
            )
        });
    }

}
