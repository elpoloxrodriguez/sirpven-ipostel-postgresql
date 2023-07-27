import { Injectable, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { ApiService, IAPICore } from '../apicore/api.service';
import { UtilService } from '../util/util.service';
import html2canvas from 'html2canvas';


@Injectable({
  providedIn: 'root'
})




export class FilateliaService {

 public rectWidth
 public rectHeight
 public spacingX
 public spacingY
 public cantidad
 public diametroX
 public diametroY
 public imageX
 public imageY


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };




  GenerarFilatelia(Qr: any, Tipo: number) {
    // Crear documento jsPDF
    var doc = new jsPDF({
      orientation: 'landscape',
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
    // Establecer color del borde del rectángulo
    doc.setDrawColor(255, 0, 0); // Rojo
    // doc.rect(0.75, 0.75, 46.5, 31.5);
    doc.setDrawColor(0, 0, 0); // Rojo

 

    if (Tipo === 1) {
    // Definir medidas de rectángulo
     this.rectWidth = 3;
     this.rectHeight = 3;
     this.spacingX = 0.2;
     this.spacingY = 0.2;
     this.cantidad = 126
     this.diametroX = 1
     this.diametroY = 1
     this.imageX = 1.2
     this.imageY = 1.2
    } else {
      // Definir medidas de rectángulo
     this.rectWidth = 5;
     this.rectHeight = 4.3;
     this.spacingX = 0.2;
     this.spacingY = 0.2;
     this.cantidad = 63
     this.diametroX = 1.5
     this.diametroY = 1.5
     this.imageX = 1.8
     this.imageY = 1.8
    }

    // Generar letra aleatoria
    var letter = String.fromCharCode(65 + Qr * 26); // Letra mayúscula aleatoria

    // Calcular número máximo de rectángulos que caben en la página
    var maxCols = Math.floor((doc.internal.pageSize.width - this.spacingX) / (this.rectWidth + this.spacingX));
    var maxRows = Math.floor((doc.internal.pageSize.height - this.spacingY) / (this.rectHeight + this.spacingY));
    var maxRectangles = maxCols * maxRows;

    // Calcular posición para centrar los rectángulos
    var totalWidth = maxCols * this.rectWidth + (maxCols - 1) * this.spacingX;
    var totalHeight = maxRows * this.rectHeight + (maxRows - 1) * this.spacingY;
    var startX = (doc.internal.pageSize.width - totalWidth) / 2;
    var startY = (doc.internal.pageSize.height - totalHeight) / 2;


    // Crear rectángulos
    for (var i = 0; i < maxRectangles && i < this.cantidad; i++) {
      // Calcular posición del rectángulo
      var colIndex = i % maxCols;
      var rowIndex = Math.floor(i / maxCols);
      var x = startX + colIndex * (this.rectWidth + this.spacingX);
      var y = startY + rowIndex * (this.rectHeight + this.spacingY);

      // Generar número alfanumérico aleatorio
      var alphanumeric = Math.random().toString(36).substring(2, 10);

      var imageX = x + this.rectWidth - this.imageX;
      var imageY = y + this.rectHeight - this.imageY;

      // Dibujar rectángulo si cabe dentro de la página
      if (x + this.rectWidth <= doc.internal.pageSize.width && y + this.rectHeight <= doc.internal.pageSize.height) {
        doc.rect(x, y, this.rectWidth, this.rectHeight);
        // Agregar imagen al rectángulo si cabe dentro de la página
        // console.log(Qr[i])
        doc.addImage(Qr[i], 'PNG', imageX, imageY, this.diametroX, this.diametroY);
        // Agregar número alfanumérico al rectángulo
      }
    }




    // doc.save("Filatelia IPOSTEL.pdf");
    // doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: 'Filatelia IPOSTEL.pdf' });


  }



}