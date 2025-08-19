import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { DispositivoService } from '../services/dispositivo.service';
import { RouterLink } from '@angular/router';
import { PersonalizarFechaPipe } from '../pipe/personalizar-fecha.pipe';
@Component({
  selector: 'app-historial-dispositivo',
  templateUrl: './historial-dispositivo.page.html',
  styleUrls: ['./historial-dispositivo.page.scss'],
  standalone: true,
  imports: [PersonalizarFechaPipe,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonList, IonItem, IonLabel, IonCard, IonCardContent, RouterLink ]
})
export class HistorialDispositivoPage implements OnInit, OnDestroy {

  @Input()
  id='2';
  mediciones: any[] = [];
  
  constructor(public dispositivoService: DispositivoService) {


  }

  async ngOnInit() {
    
    await this.dispositivoService.getMediciones(Number(this.id))
      .then((res) => {
        this.mediciones=res;

      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Ejecución fuera de la promesa")
  }

  ngOnDestroy() {
 
  }
}
