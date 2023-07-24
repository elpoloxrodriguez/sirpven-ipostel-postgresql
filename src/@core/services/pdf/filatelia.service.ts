import { Injectable, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { ApiService, IAPICore } from '../apicore/api.service';
import { UtilService } from '../util/util.service';


@Injectable({
  providedIn: 'root'
})


export class FilateliaService {


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };



  GenerarFilatelia(Qr : any){
    // const doc = new jsPDF();
    var doc = new jsPDF({
        unit: 'cm',
        // Primer dato Ancho 
        // Segundo dato Alto
        format: [33, 48]
      });
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE FILATELIA SIRP-IPOSTEL",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SIRP-IPOSTEL",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.setLineWidth(0.1);
    // doc.rect(0.75, 0.75, 31.5, 46.5);
    

    // Definir una matriz de letras
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Calcular la cantidad de rectángulos que caben en la página
var rectWidth = Math.floor((doc.internal.pageSize.width - 1) / 5);
var rectHeight = Math.floor((doc.internal.pageSize.height - 1) / 4);

// Calcular el espacio horizontal y vertical vacío
var emptyWidth = (doc.internal.pageSize.width - rectWidth * 5) / 2;
var emptyHeight = (doc.internal.pageSize.height - rectHeight * 4) / 2;

// Dibujar los rectángulos y las letras
for (var x = 0; x < rectWidth; x++) {
  for (var y = 0; y < rectHeight; y++) {
    doc.rect(emptyWidth + x * 5, emptyHeight + y * 4, 5, 4);
    doc.text(letters[x + y ],emptyWidth + x * 5 + 2.25, emptyHeight + y * 4 + 2.5);
    // doc.addImage(Qr, "PNG", 5.1, 4.6, 1, 1);
    doc.addImage(Qr[x + y ], "PNG", emptyWidth + x * 5 + 3.8, emptyHeight + y * 4 + 2.8, 1, 1);
  }
}



    // doc.save("Filatelia IPOSTEL.pdf");
    // doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: 'Filatelia IPOSTEL.pdf' });


  }

}