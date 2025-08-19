import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { interval, Observable, Subscription, fromEvent } from 'rxjs';
import { DispositivoService } from '../services/dispositivo.service';
import { RouterLink } from '@angular/router';
import { Colorear } from '../directives/colorear';

@Component({
  selector: 'app-listado-dispositivos',
  templateUrl: './listado-dispositivos.page.html',
  styleUrls: ['./listado-dispositivos.page.scss'],
  standalone: true,
  imports: [Colorear,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonList, IonItem, IonLabel, IonCard, IonCardContent, RouterLink ]
})
export class ListadoDispositivosPage implements OnInit, OnDestroy {
  dispositivos: any = []

  mouseMove$ = fromEvent(document, 'mousemove')

  constructor(public dispositivoService: DispositivoService) {
    
  }


  async ngOnInit() {
    await this.dispositivoService.getDispositivos()
      .then((res) => {
        this.dispositivos = res
        console.log(this.dispositivos)
        console.log("La promesa resolvió")
      })
      .catch((error) => {
        console.log(error)
      })
    console.log("Ejecución fuera de la promesa")
  }

  ngOnDestroy() {
  
  }
}
