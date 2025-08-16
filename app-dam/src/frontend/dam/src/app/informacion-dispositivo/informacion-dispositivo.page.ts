import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { interval, Observable, Subscription, fromEvent } from 'rxjs';
import { DispositivoService } from '../services/dispositivo.service';
import { RouterLink } from '@angular/router';
import { Medicion } from '../models/medicion.interface';
import { HttpClient } from '@angular/common/http'; 
import { PersonalizarFechaPipe } from '../pipe/personalizar-fecha.pipe';

@Component({
  selector: 'app-informacion-dispositivo',
  templateUrl: './informacion-dispositivo.page.html',
  styleUrls: ['./informacion-dispositivo.page.scss'],
  standalone: true,
  imports: [PersonalizarFechaPipe,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonList, IonItem, IonLabel, IonCard, IonCardContent, RouterLink ]
})
export class InformacionDispositivoPage implements OnInit, OnDestroy {

  @Input()
  id='0';
  @Input()
  nombre="";
  fecha=""
  ultima_medicion: number=0;
  valvulaActiva: boolean = false;
  estado_valvula=1;

  constructor(public dispositivoService: DispositivoService, private http: HttpClient) {

  }

  async ngOnInit() {
    console.log(this.nombre)
    await this.dispositivoService.getUltimaMedicion(Number(this.id))
      .then((res) => {
        if (res.length > 0) {
          this.ultima_medicion = Number(res[0].valor);
          this.fecha=res[0].fecha          
        } else {
          this.ultima_medicion = 0;
        }
        console.log(this.ultima_medicion)
      })
      .catch((error) => {
        console.error(error);
      });
    
      await this.dispositivoService.getEstadoValvula(Number(this.id))
  .then((res: any) => {
    // Si lo que recibís es un string "0" o "1"
    this.estado_valvula = Number(res); 
    console.log("Estado válvula:", this.estado_valvula);
  })
  .catch((error) => {
    console.error(error);
  });
    console.log("Ejecución fuera de la promesa")
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe()
  }
  

  async toggleValvula() {
    console.log('Se hizo clic en la válvula');
  
    this.estado_valvula = this.estado_valvula === 0 ? 1 : 0;
  
    try {
      const res = await this.dispositivoService.getActualizarValvula(
        Number(this.id),
        Math.floor(Math.random() * 101), // humedad aleatoria
        this.estado_valvula
      );
      console.log(res);

      await this.dispositivoService.getUltimaMedicion(Number(this.id))
      .then((res) => {
        if (res.length > 0) {
          this.ultima_medicion = Number(res[0].valor);
          this.fecha=res[0].fecha          
        } else {
          this.ultima_medicion = 0;
        }
        console.log(this.ultima_medicion)
      })
      .catch((error) => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  }


}
