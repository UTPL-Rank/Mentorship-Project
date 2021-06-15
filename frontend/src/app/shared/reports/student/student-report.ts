import { StudentReportData } from './student-report-data';

export class StudentReport {

  public constructor(
    public readonly data: StudentReportData,
  ) { }

  public html(): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
</head>
<body>

<h2>HTML Table</h2>

<table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>${this.data.mentor}</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
  <tr>
    <td>Ernst Handel</td>
    <td>Roland Mendel</td>
    <td>Austria</td>
  </tr>
  <tr>
    <td>Island Trading</td>
    <td>Helen Bennett</td>
    <td>UK</td>
  </tr>
  <tr>
    <td>Laughing Bacchus Winecellars</td>
    <td>Yoshi Tannamuri</td>
    <td>Canada</td>
  </tr>
  <tr>
    <td>Magazzini Alimentari Riuniti</td>
    <td>Giovanni Rovelli</td>
    <td>Italy</td>
  </tr>
</table>

</body>
</html>

<!--    <div class="text-print">-->
<!--  <div class="container mt-5">-->
<!--    <img src="assets/logo_vicerrectorado_academico.jpg" style="width: 40vw;" />-->

    <!--  -->
    <!--  -->
    <!--  -->

<!--    <header class="mt-3 d-flex align-items-center flex-column">-->
<!--      <h3 class="font-weight-bold">-->
<!--        FICHA DE ACOMPAÑAMIENTO MENTORIAL-->
<!--      </h3>-->
<!--    </header>-->

    <!--  -->
    <!--  -->
    <!--  -->

<!--    <table class="table mt-3 ml-auto text-center table-bordered table-sm" style="width: auto;">-->
<!--      <thead>-->
<!--        <tr>-->
<!--          <th>PROYECTO</th>-->
<!--        </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--        <tr>-->
<!--          <td>-->
<!--            Estudiantes Mentores para alumnos de nuevo ingreso-->
<!--            <br />-->
<!--            Modalidad Presencial-->
<!--          </td>-->
<!--        </tr>-->
<!--      </tbody>-->
<!--    </table>-->

    <!--  -->
    <!--  -->
    <!--  -->

<!--    <table class="table table-bordered table-sm text-nowrap">-->
<!--      <tbody>-->
<!--        <tr>-->
<!--          <th>Estudiante Mentor:</th>-->
<!--          <td colspan="3">{{ mentor.displayName | titlecase }}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <th>Área del Mentor:</th>-->
<!--          <td colspan="3">{{ mentor.area.name | titlecase }}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <th>Titulación del Mentor:</th>-->
<!--          <td colspan="3">{{ mentor.degree.name | titlecase }}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <th>Nombres del estudiante de nuevo ingreso:</th>-->
<!--          <td colspan="3">{{ student.displayName | titlecase }}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <th>Titulación del estudiante:</th>-->
<!--          <td>{{ student.degree.name | titlecase }}</td>-->
<!--          <th>Area del estudiante:</th>-->
<!--          <td>{{ student.area.name | titlecase }}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <th rowspan="2" class="align-middle">Periodo Académico:</th>-->
<!--          <td rowspan="2" class="align-middle">-->
<!--            {{ academicPeriod | titlecase }}-->
<!--          </td>-->
<!--          <th>Estudiante de primer ciclo:</th>-->
<!--          <td class="font-weight-bold">-->
<!--            <span *ngIf="student.cycle === 'sgm#first'">x</span>-->
<!--          </td>-->
<!--        </tr>-->

<!--        <tr>-->
<!--          <th>Estudiante de segundo ciclo:</th>-->
<!--          <td class="font-weight-bold">-->
<!--            <span *ngIf="student.cycle === 'sgm#second'">x</span>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </tbody>-->
<!--    </table>-->

    <!--  -->
    <!--  -->
    <!--  -->

<!--    <div class="my-4 d-flex align-items-center flex-column">-->
<!--      <h4 class="font-weight-bold text-uppercase">-->
<!--        ACOMPAÑAMIENTO DURANTE EL {{ semesterKind | semesterName }}-->
<!--      </h4>-->
<!--    </div>-->
<!--  </div>-->

  <!--  -->
  <!--  -->
  <!--  -->

<!--  <div class="container-fluid">-->
<!--    <table class="table table-bordered">-->
<!--      <ng-container *ngFor="let accompaniment of accompaniments; let i = index">-->
<!--        <thead class="text-center text-nowrap">-->
<!--          <tr class="table-secondary">-->
<!--            <th colspan="2">Fecha</th>-->
<!--            <th colspan="2">Problemas encontrados</th>-->
<!--            <th>Temas desarrollados</th>-->
<!--            <th>Descripción</th>-->
<!--            <th>Soluciones</th>-->
<!--            <th>Confirmación</th>-->
<!--          </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--          <tr>-->
<!--            <td colspan="2" rowspan="3" class="text-nowrap font-weight-bold">-->
<!--              {{ accompaniment.timeCreated.toMillis() | date }}-->
<!--            </td>-->
<!--            <td class="align-middle ">-->
<!--              Académicos-->
<!--            </td>-->
<!--            <td class="align-middle font-weight-bold ">-->
<!--              {{ accompaniment.problems.academic ? "X" : "" }}-->
<!--            </td>-->
<!--            <td rowspan="5" style="white-space:pre-wrap;">-->
<!--              <span>{{ accompaniment.topicDescription }}</span>-->
<!--            </td>-->
<!--            <td rowspan="5" style="white-space:pre-wrap;">-->
<!--              <span>{{ accompaniment.problemDescription }}</span>-->
<!--            </td>-->
<!--            <td rowspan="5" style="white-space:pre-wrap;">-->
<!--              <span>{{ accompaniment.solutionDescription }}</span>-->
<!--            </td>-->
<!--            <td rowspan="5" *ngIf="!accompaniment.confirmation">-->
<!--              Seguimiento sin Validar.-->
<!--            </td>-->
<!--            <td rowspan="1" class="text-nowrap" *ngIf="!!accompaniment.confirmation">-->
<!--              {{ accompaniment.confirmation.qualification | qualificationValue-->
<!--              }}-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="align-middle">Administrativos</td>-->
<!--            <td class="align-middle font-weight-bold">-->
<!--              {{ accompaniment.problems.academic ? "X" : "" }}-->
<!--            </td>-->
<!--            <td rowspan="4" *ngIf="!!accompaniment.confirmation">-->
<!--              <img [src]="accompaniment.confirmation.digitalSignature" alt="digital-signature"-->
<!--                class="border-secondary border-bottom" />-->
<!--              <br />-->
<!--              <small class="mt-3 font-weight-bold">-->
<!--                Firma: {{ accompaniment.student.displayName | titlecase }}-->
<!--              </small>-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="align-middle">Económicos</td>-->
<!--            <td class="align-middle font-weight-bold">-->
<!--              {{ accompaniment.problems.economic ? "X" : "" }}-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="align-middle">-->
<!--              Virtual-->
<!--            </td>-->
<!--            <td class="align-middle font-weight-bold">-->
<!--              {{ accompaniment.followingKind === "sgm#virtual" ? "X" : "" }}-->
<!--            </td>-->
<!--            <td class="align-middle">-->
<!--              Psicosociales-->
<!--            </td>-->
<!--            <td class="align-middle font-weight-bold">-->
<!--              {{ accompaniment.problems.psychosocial ? "X" : "" }}-->
<!--            </td>-->
<!--          </tr>-->
<!--          <tr>-->
<!--            <td class="align-middle">-->
<!--              Presencial-->
<!--            </td>-->
<!--            <td class="align-middle font-weight-bold">-->
<!--              {{ accompaniment.followingKind === "sgm#presencial" ? "X" : "" }}-->
<!--            </td>-->
<!--            <td *ngIf="!!accompaniment.problems.other && !accompaniment.problems.none">-->
<!--              {{ accompaniment.problems.otherDescription | titlecase }}-->
<!--            </td>-->
<!--            <td *ngIf="!accompaniment.problems.other || !!accompaniment.problems.none">-->
<!--              Ninguno-->
<!--            </td>-->
<!--            <td class="align-middle font-weight-bold">-->
<!--              {{ (!!accompaniment.problems.other || !!accompaniment.problems.none) ? "X" : "" }}-->
<!--            </td>-->
<!--          </tr>-->
<!--        </tbody>-->
<!--      </ng-container>-->
<!--    </table>-->

<!--    <div class="mb-5 d-flex flex-column align-items-start">-->
<!--      <img [src]="signature" alt="Firma del Mentor" class="border-secondary border-bottom" />-->
<!--      <strong class="mt-3"> Firma: {{ mentor.displayName | titlecase }}</strong>-->
<!--    </div>-->
<!--  </div>-->
<!--</div>-->
    `;
  }
}
