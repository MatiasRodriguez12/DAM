import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personalizarFecha',
  standalone: true
})
export class PersonalizarFechaPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return 'Sin fecha';
    
    const fecha = new Date(value);
    if (isNaN(fecha.getTime())) return 'Fecha inválida';


    return fecha.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

}
