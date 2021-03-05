import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../core/services/title.service';

@Component({
    selector: 'sgm-guide-register-accompaniment',
    templateUrl: './guide-register-accompaniment.component.html'
})

export class GuideRegisterAccompanimentComponent implements OnInit {
    constructor(
        private readonly title: TitleService,
    ) { }

    ngOnInit() {
        this.title.setTitle('Registrar nuevo acompañamiento');
    }
}