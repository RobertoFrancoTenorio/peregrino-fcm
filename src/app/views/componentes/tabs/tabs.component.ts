import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CitaService } from 'src/app/services/cita/cita.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  subscription: Subscription;
  clickSub: any;
  noNotificaciones: number = 0;
  checkNotificacion: boolean;
  logueado: boolean;
  mostradas: boolean;
  subCita: Subscription;
  isInHome: boolean;

  constructor(
    private localNotifications: LocalNotifications,
    private auth: AuthService,
    private afs: AngularFirestore,
    private cita: CitaService,
    public alertCtrl: AlertController,
    private router: Router,
    private notification: NotificacionService
  ){
    if(this.auth.isLoggedIn == true){
      this.logueado = true;
      console.log('Estado logueado en onInit', this.logueado)
      this.subscription = this.cita.getCitasEstatus(this.auth.currentUserId, 'asignada').subscribe(citas => {
        console.log('cita', citas.length)
        if(citas.length>0){
          this.singleNotification(citas)
        }else{
          console.log('sin citas')
        }
      })
    }
    else{
      console.log('No esta logueado')
    }
  }

  ngOnInit() {

  }

  singleNotification(citas: any){
    console.log('Notificaciones', citas);
    for(var i = 0; i < citas.length; i++){
      this.localNotifications.schedule([{
        id: i,
        text: 'Revisar cita para el día ' + moment(citas[i].extendedProps.currentCita.f_cita.seconds*1000).format('YYYY-MM-DD'),
        sound: 'file://sound.mp3',
        data: citas[i].extendedProps.currentCita,
      },

    ]);

    }

    this.localNotifications.on('click').subscribe(data => {
      console.log('Data',data);
      this.goToCitas();
      /* this.presentAlert(data.data)
      let estado = 'si';
      let post = data.data;
      post['estado_notificacion'] = estado;
      console.log('Post', post) */
    })
    /* this.localNotifications.on('click').subscribe(data => {
      this.presentAlert(data);
      let estado = 'si';
      console.log('cita', cita)
      //cita.extendedProps.currentCita.estado_notificacion = 'si'
      //let post = cita.extendedProps.currentCita;
      //console.log('post', cita.extendedProps.currentCita)
      //this.cita.updateCita(post)
      //
    }); */
    /* this.localNotifications.schedule([{
      text: 'Revisar cita para el día ' + moment(cita.extendedProps.currentCita.f_cita.seconds*1000).format('YYYY-MM-DD'),
      sound: 'file://sound.mp3',
      data: { secret: 'key_data' }
    },
  ]); */
  }

  sweetAlert(){
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    )
  }

  async presentAlert(cita: any) {
    console.log('Data cita', cita)
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Desea ver sus citas asignadas?',
      subHeader: 'Click en aceptar para ir a las citas',
      //message: 'This is an alert message.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => {
            console.log('Confirm Ok');
            if(this.logueado){
              console.log('Está logueado')
              this.router.navigate(['/citas-asignadas'])
            }
            else{
              console.log('No Está logueado')
              this.presentLogin();
            }
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async presentLogin() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'No puedo mostrar sus citas',
      subHeader: 'Inicie sesión para ver sus consultas',
      //message: 'This is an alert message.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Aceptar',
          role: 'accept',
          handler: () => {
            console.log('Confirm Ok');
            if(this.logueado){
              console.log('Está logueado')
              this.router.navigate(['/login'])
            }
            else{
              console.log('No Está logueado')
            }
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  goToHome(){
    this.router.navigate(['/home']);
    console.log('isInHome', this.isInHome);
  }

  goToCitas(){
    this.isInHome = false;
    console.log('isInHome', this.isInHome);
    this.router.navigate(['/citas-asignadas']);
    this.localNotifications.clearAll();
    //this.subscription.unsubscribe();
  }

  goToCitasAceptadas(){
    this.isInHome = false;
    console.log('isInHome', this.isInHome);
    this.router.navigate(['/citas-aceptadas'])
    this.localNotifications.clearAll();
    //.subscription.unsubscribe();
  }

  logout(){
    /* if(this.isInHome){
      this.auth.signOut();
      this.localNotifications.clearAll();
      this.subscription.unsubscribe();
    }else{
      this.router.navigate(['/home']);
      this.auth.signOut();
      this.localNotifications.clearAll();
      this.subscription.unsubscribe();
    } */
    if(this.isInHome == true){
      this.auth.signOut();
    }
    else{
      this.goToHome2();
    }
  }

  goToHome2(){
    this.router.navigate(['/home']);
    this.auth.signOut();
  }

  ngOnDestroy(){
    this.localNotifications.clearAll();
    this.subscription.unsubscribe();
  }

}
