import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";

interface MousePosition {
  x: number;
  y: number;
}

@Component({
  selector: "sgm-sig-canvas",
  templateUrl: "./sig-canvas.component.html"
})
export class SigCanvasComponent implements OnInit, AfterViewInit {
  constructor() {}

  @ViewChild("sigCanvas")
  private canvasRef: ElementRef;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private requestAnimFrame;

  private drawing = false;
  private mousePos: MousePosition = {
    x: 0,
    y: 0
  };
  private lastPos: MousePosition = this.mousePos;

  ngOnInit() {
    this.requestAnimFrame =
      (window as any).requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).oRequestAnimationFrame ||
      (window as any).msRequestAnimaitonFrame;
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.strokeStyle = "#222222";

    // ---------------------------------------------
    // add event listeners
    // ---------------------------------------------
    const self = this;
    this.canvas.addEventListener(
      "mousedown",
      (event: MouseEvent) => {
        self.drawing = true;
        self.lastPos = self.getMousePos(event);
      },
      false
    );
    this.canvas.addEventListener(
      "mouseup",
      (event: MouseEvent) => {
        self.drawing = false;
      },
      false
    );
    this.canvas.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        self.mousePos = self.getMousePos(event);
      },
      false
    );

    // ---------------------------------------------
    // Add touch event support for mobile
    // ---------------------------------------------
    this.canvas.addEventListener(
      "touchstart",
      (event: TouchEvent) => {},
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        const { clientX, clientY } = event.touches.item(0);
        const me = new MouseEvent("mousemove", { clientX, clientY });
        self.canvas.dispatchEvent(me);
      },
      false
    );
    this.canvas.addEventListener(
      "touchstart",
      (event: TouchEvent) => {
        self.mousePos = self.getTouchPos(event);
        const { clientX, clientY } = event.touches.item(0);
        const me = new MouseEvent("mousedown", { clientX, clientY });
        self.canvas.dispatchEvent(me);
      },
      false
    );
    this.canvas.addEventListener(
      "touchend",
      (event: TouchEvent) => {
        const me = new MouseEvent("mouseup", {});
        self.canvas.dispatchEvent(me);
      },
      false
    );

    // ---------------------------------------------
    // Prevent scrolling when touching the canvas
    // ---------------------------------------------
    document.body.addEventListener(
      "touchstart",
      (event: TouchEvent) => {
        if (event.target === self.canvas) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchend",
      (event: TouchEvent) => {
        if (event.target === self.canvas) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
    document.body.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        if (event.target === self.canvas) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
    // DrawLoop
    (function drawLoop() {
      self.requestAnimFrame(drawLoop);
      self.renderCanvas();
    })();
  }

  private getMousePos({ clientX, clientY }: MouseEvent): MousePosition {
    const { left, top } = this.canvas.getBoundingClientRect();
    return {
      x: clientX - left,
      y: clientY - top
    };
  }

  private getTouchPos(event: TouchEvent) {
    const { left, top } = this.canvas.getBoundingClientRect();
    const { clientX, clientY } = event.touches.item(0);
    return {
      x: clientX - left,
      y: clientY - top
    };
  }

  private renderCanvas() {
    if (this.drawing) {
      this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
      this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
      this.ctx.stroke();
      this.lastPos = this.mousePos;
    }
  }

  clearCanvas() {
    this.canvas.width = this.canvas.width;
  }

  public getDataURL() {
    return this.canvas.toDataURL();
  }

  isCanvasBlank() {
    const pixelBuffer = new Uint32Array(
      this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      ).data.buffer
    );

    return !pixelBuffer.some(color => color !== 0);
  }
}
