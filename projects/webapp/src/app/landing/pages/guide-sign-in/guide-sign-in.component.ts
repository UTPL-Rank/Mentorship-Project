import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../core/services/title.service';

@Component({
    selector: 'sgm-guide-sign-in',
    templateUrl: './guide-sign-in.component.html'
})

export class GuideSignInComponent implements OnInit {
    constructor(
        private readonly title: TitleService,
    ) { }

    ngOnInit() {
        this.title.setTitle('Registrar nuevo acompañamiento');
    }
}