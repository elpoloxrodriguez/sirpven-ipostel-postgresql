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

  public maxCols
  public maxRows
  public maxRectangles
  public totalWidth
  public totalHeight
  public startX
  public startY

  public i = 0

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public  doc = new jsPDF({
    orientation: 'landscape',
    unit: 'cm',
    // Primer dato Ancho 
    // Segundo dato Alto
    format: [33, 48]
  });


GenerarCabecera(Qr: any, Tipo: number, TokenTiraje: string){

  const pageHeight = this.doc.internal.pageSize.height || this.doc.internal.pageSize.getHeight();
  const pageWidth = this.doc.internal.pageSize.width || this.doc.internal.pageSize.getWidth();
  this.doc.setProperties({
    title: "CERTIFICADO DE FILATELIA SIRP-IPOSTEL",
    subject: "https://github.com/elpoloxrodriguez",
    author: "SIRP-IPOSTEL",
    keywords: "generated, javascript, web 2.0, ajax",
    creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
  });

  this.doc.setLineWidth(0.1);
  // Establecer color del borde del rectángulo
  this.doc.setDrawColor(255, 0, 0); // Rojo
  // this.doc.rect(0.75, 0.75, 46.5, 31.5);
  this.doc.setDrawColor(0, 0, 0); // Rojo



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
  this.maxCols = Math.floor((this.doc.internal.pageSize.width - this.spacingX) / (this.rectWidth + this.spacingX));
  this.maxRows = Math.floor((this.doc.internal.pageSize.height - this.spacingY) / (this.rectHeight + this.spacingY));
  this.maxRectangles = this.maxCols * this.maxRows;

  // Calcular posición para centrar los rectángulos
  this.totalWidth = this.maxCols * this.rectWidth + (this.maxCols - 1) * this.spacingX;
  this.totalHeight = this.maxRows * this.rectHeight + (this.maxRows - 1) * this.spacingY;
  this.startX = (this.doc.internal.pageSize.width - this.totalWidth) / 2;
  this.startY = (this.doc.internal.pageSize.height - this.totalHeight) / 2;

}

  GenerarFilatelia(Qr: any, Tipo: number, TokenTiraje: string, posicion: number, listaTokenQR: string) {
    // Crear this.documento jsPDF
   
    // console.log(posicion)
    // Crear rectángulos
    // for (var i = 0; i < this.maxRectangles && i < this.cantidad; i++) {
      // Calcular posición del rectángulo
      var colIndex = posicion % this.maxCols;
      var rowIndex = Math.floor(posicion / this.maxCols);
      var x = this.startX + colIndex * (this.rectWidth + this.spacingX);
      var y = this.startY + rowIndex * (this.rectHeight + this.spacingY);

      // Generar número alfanumérico aleatorio
      var alphanumeric = Math.random().toString(36).substring(2, 10);

      var imageX = x + this.rectWidth - this.imageX;
      var imageY = y + this.rectHeight - this.imageY;

      // Dibujar rectángulo si cabe dentro de la página
      if (x + this.rectWidth <= this.doc.internal.pageSize.width && y + this.rectHeight <= this.doc.internal.pageSize.height) {
        this.doc.rect(x, y, this.rectWidth, this.rectHeight);
        // Agregar imagen al rectángulo si cabe dentro de la página
        this.doc.addImage(Qr, 'PNG', imageX, imageY, this.diametroX, this.diametroY);
        // Agregar número alfanumérico al rectángulo
        this.doc.setFontSize(8);
        this.doc.setFont(undefined, "bold");
        this.doc.text(listaTokenQR,
        imageX, imageY + 1.6, this.diametroX, this.diametroY
        );
      }
    // }




  }

  GenerarPie(TokenTiraje){
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, "bold");
    this.doc.text(`Tiraje N#: ${TokenTiraje}`,
      1,
      0.5,
    );

    this.doc.save(`TIRAJE #${TokenTiraje} FILATELIA IPOSTEL.pdf`);
    // this.doc.autoPrint();
    // this.doc.output("dataurlnewwindow", { filename: 'Filatelia IPOSTEL.pdf' });

  }


}