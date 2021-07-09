import {Component, Input, OnInit} from '@angular/core';
import {SGMMentor} from '@utpl-rank/sgm-helpers';

@Component({
  selector: 'sgm-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent {

  titleCover!: string;
  typeCover!: string;

  @Input('titleCover')
  set setTitleCover(titleCover: string) {
    this.titleCover = titleCover;
  }

  @Input('typeCover')
  set setTypeCover(typeCover: string) {
    this.typeCover = typeCover;
  }


}
