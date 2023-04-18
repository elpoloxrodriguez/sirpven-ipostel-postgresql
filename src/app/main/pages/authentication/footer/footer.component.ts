import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }
  public Version

  ngOnInit(): void {
    this.Version = VERSION.full
  }

}
