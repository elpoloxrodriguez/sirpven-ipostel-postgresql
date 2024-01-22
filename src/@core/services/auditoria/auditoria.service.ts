import { Injectable } from "@angular/core";
import { ApiService } from "../apicore/api.service";

export interface Auditoria {
    id: string,
    usuario: string,
    ip: string,
    mac: string,
    funcion ?: string,
    parametro?: string,
    valoresN?: {},
    valoresV?: {},
    metodo ?: string,
    fecha: string,
}



@Injectable({
    providedIn: 'root'
})


export class InterfaceService {


    constructor(
        private apiService: ApiService,
      ) { }

      

    async InsertarInformacionAuditoria(info: any) {
        var obj = {
          "coleccion": "auditoria-sirpven",
          "objeto": info,
          "donde": `{\"id\":\"${info.id}\"}`,
          "driver": "MGDBA",
          "upsert": true
        }
        await this.apiService.ExecColeccion(obj).subscribe(
          (data) => {
            // this.utilservice.AlertMini('top-start','success',`La Auditoria ha sido registrada codigo: ${data.UpsertedID}`,3000)
          }, (error) => {
            // this.utilservice.AlertMini('top-end','error','Error al Guardadar los Datos de Auditoria',3000)
          }
        )
      }

}



