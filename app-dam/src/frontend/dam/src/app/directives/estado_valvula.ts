import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[estadoValvula]'
})
export class EstadoValvulaDirective implements OnChanges {

  @Input('estadoValvula') estadoValvula!: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadoValvula']) {
      this.actualizarColor();
    }
  }

  private actualizarColor(): void {
    // limpiar clases previas
    this.renderer.removeClass(this.el.nativeElement, 'btn-verde');
    this.renderer.removeClass(this.el.nativeElement, 'btn-rojo');

    // aplicar clase según estado
    if (this.estadoValvula) {
      this.renderer.addClass(this.el.nativeElement, 'btn-verde');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'btn-rojo');
    }
  }
}

