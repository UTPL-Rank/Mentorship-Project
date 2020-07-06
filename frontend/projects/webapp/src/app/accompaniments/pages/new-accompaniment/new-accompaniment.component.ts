import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccompanimentsService } from '../../../core/services/accompaniments.service';
import { AcademicPeriod, Mentor, Student } from '../../../models/models';
import { AccompanimentFormValue } from '../../components/accompaniment-form/accompaniment-form.component';

@Component({
  selector: 'sgm-new-accompaniment',
  templateUrl: './new-accompaniment.component.html'
})
export class NewAccompanimentComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly accompanimentsService: AccompanimentsService,
  ) { }

  // TODO: add disabled property for the child
  public isSaving = false;
  public students: Student[];
  public mentor: Mentor;
  public period: AcademicPeriod;
  public selectedStudentId: string;

  ngOnInit() {
    const { students, mentor, activePeriod } = this.route.snapshot.data;
    const { selectedStudentId } = this.route.snapshot.queryParams;

    this.students = students;
    this.mentor = mentor;
    this.period = activePeriod;

    this.selectedStudentId = selectedStudentId;
  }


  async save(data: AccompanimentFormValue) {
    if (this.isSaving) return;

    try {
      this.isSaving = true;

      const accompaniment = await this.accompanimentsService.saveAccompaniment(this.mentor.id, data);

      alert('Todos los cambios están guardados');
      await this.router.navigate([
        'panel-control',
        accompaniment.period.reference.id,
        'ver-acompañamiento',
        accompaniment.mentor.reference.id,
        accompaniment.id
      ]);
    } catch (error) {
      alert('Ocurrió un error al guardar, vuelve a intentarlo.');
      console.log(error);

      this.isSaving = false;
    }
  }
}
