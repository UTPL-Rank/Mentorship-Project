import { Component, Input } from "@angular/core";
import { SGMAccompaniment } from "@utpl-rank/sgm-helpers";
import { Observable, of, Subscription } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { AccompanimentsService } from "src/app/core/services/accompaniments.service";

@Component({
  selector: "sgm-accompaniments-table",
  templateUrl: "./accompaniments-table.component.html",
})
export class AccompanimentsTableComponent {
  public accompaniments!: Array<SGMAccompaniment.readDTO>;
  public importantSwitchText: string = "Marcar como NO importante";
  public readSwitchText: string = "Marcar como leído";
  private updatingSubscription: Subscription | null = null;

  constructor(private readonly accompanimentsService: AccompanimentsService) {}

  @Input("accompaniments")
  public set setAccompaniments(
    accompaniments: Array<SGMAccompaniment.readDTO>
  ) {
    this.accompaniments = accompaniments;
  }

  @Input()
  public showMentorName = false;

  @Input()
  public showStudentName = false;

  @Input()
  public showValidate = false;

  @Input()
  public showView = false;

  changeImportant(accompanimentID: string): void {
    console.log(accompanimentID);
    if (!!this.updatingSubscription) return;

    const updateTask = this.accompanimentsService
      .accompanimentStream(accompanimentID)
      .pipe(
        take(1),
        switchMap((acc) =>
          !!acc
            ? this.accompanimentsService.changeImportant$(
                acc.id,
                !acc.important
              )
            : of(false)
        )
      );

    this.accompanimentsService
      .accompanimentStream(accompanimentID)
      .subscribe((acc) => {
        if (acc?.important) {
          this.importantSwitchText = "Marcar como NO importante";
        } else {
          this.importantSwitchText = "Marcar como importante";
        }
      });

    this.updatingSubscription = updateTask.subscribe((updated) => {
      const message = updated
        ? "Se actualizo correctamente"
        : "Ocurrió un error, vuelve a intentarlo";
      alert(message);
      this.updatingSubscription?.unsubscribe();
      this.updatingSubscription = null;
    });
  }

  changeRead(accompanimentID: string): void {
    if (!!this.updatingSubscription) return;

    const updateTask = this.accompanimentsService.accompanimentStream(accompanimentID).pipe(
      take(1),
      switchMap((acc) =>
        !!acc
          ? this.accompanimentsService.changeRead$(acc.id, !acc.read)
          : of(false)
      )
    );

    this.accompanimentsService
      .accompanimentStream(accompanimentID)
      .subscribe((acc) => {
        if (acc?.read) {
          this.readSwitchText = "Marcar como NO leído";
        } else {
          this.readSwitchText = "Marcar como leído";
        }
      });


    this.updatingSubscription = updateTask.subscribe((updated) => {
      const message = updated
        ? "Se actualizo correctamente"
        : "Ocurrió un error, vuelve a intentarlo";
      alert(message);
      this.updatingSubscription?.unsubscribe();
      this.updatingSubscription = null;
    });
  }

   
}
