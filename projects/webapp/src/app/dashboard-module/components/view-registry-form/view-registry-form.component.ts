import { Component, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SigCanvasComponent } from "../sig-canvas/sig-canvas.component";

@Component({
  selector: "sgm-view-registry-form",
  templateUrl: "./view-registry-form.component.html"
})
export class ViewRegistryFormComponent {
  constructor(private router: Router) {}

  private mentorId: string;

  @Input("mentorId")
  set setMentorId(id: string) {
    this.mentorId = id;
  }

  private studentId: string;

  @Input("studentId")
  set setStudentId(id: string) {
    this.studentId = id;
  }

  @ViewChild(SigCanvasComponent)
  private sigCanvas: SigCanvasComponent;

  export(semesterId: string) {
    const url =
      "https://us-central1-sgmentores.cloudfunctions.net/exportToPdf?" +
      `mentorId=${this.mentorId}&` +
      `studentId=${this.studentId}&` +
      `semesterId=${encodeURIComponent(semesterId)}&` +
      `signature=${encodeURIComponent(this.sigCanvas.getDataURL())}`;

    window.open(url, "_blank");
  }

  navigate(semesterId: string) {
    if (this.sigCanvas.isCanvasBlank()) {
      alert("Debe ingresar una firma.");
      return;
    }

    this.router.navigate(
      [
        "/panel-control",
        "ficha-acompañamiento",
        this.mentorId,
        this.studentId,
        semesterId
      ],
      {
        queryParams: {
          signature: this.sigCanvas.getDataURL()
        }
      }
    );
  }

  resetSignature() {
    this.sigCanvas.clearCanvas();
  }
}
