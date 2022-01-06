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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  subscription: Subscription;
  clickSub: any;
  noNotificaciones: number = 0;
  checkNotificacion: boolean;
  logueado: boolean;

  constructor(
    private localNotifications: LocalNotifications,
    private auth: AuthService,
    private afs: AngularFirestore,
    private cita: CitaService,
    public alertCtrl: AlertController,
    private router: Router,
    private notification: NotificacionService
  )
  {

    /* if((this.auth.isLoggedIn == true) && (this.checkNotificacion == false))
    {
      this.getNotifications();
      console.log('Si está logueado desde el constructor');
    } */
    /* if(this.auth.isLoggedIn == true){
      console.log('Si está logueado desde el constructor')
    }
    else{
      console.log('Si está logueado desde el constructor')
    } */
  }

  ngOnInit(){
    /* if(this.auth.isLoggedIn == true){
      this.logueado = true;
      console.log('Estado logueado en onInit', this.logueado)
      this.subscription = this.cita.obtenNotificaciones(this.auth.currentUserId, 'por revisar').subscribe(citas => {
        this.clickSub = this.localNotifications.on('click').subscribe(data1 => {
          console.log('Info cita', citas)
          this.presentAlert();
        });
        if(citas.length>0){
          this.multi_notification(citas);
        }else{
          console.log('sin citas')
        }
      })
    }
    else{
      console.log('No esta logueado')
    } */
  }

  single_notification() {
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      sound: 'file://sound.mp3',
      data: { secret: 'key_data' }
    });
  }

  multi_notification(cita: any) {
      console.log('Length Citas', cita.length)
      console.log('Citas', cita[0].extendedProps)
    for(var i = 0; i < cita.length; i++){
      this.localNotifications.schedule([{
        id: i,
        text: 'Revisar cita para el día ' + moment(cita[i].extendedProps.currentCita.f_cita.seconds*1000).format('YYYY-MM-DD'),
        sound: 'file://sound.mp3',
        data: { secret: 'key_data' }
      },
      ]);
    }
  }

  getNotifications(){
    this.subscription = this.cita.obtenNotificaciones(this.auth.currentUserId).subscribe(citas => {
      //console.log(citas);
      this.noNotificaciones = citas.length;
      this.clickSub = this.localNotifications.on('click').subscribe(data1 => {
        console.log('Numero de notificaciones', this.noNotificaciones)
        //this.noNotificaciones = this.noNotificaciones - 1;
        console.log('Numero de notificaciones despues del click', this.noNotificaciones)
        console.log('Has dado click', citas);
        //this.checkNotificacion = true;
        this.presentAlert();
        if(citas.length > 0){
          this.localNotifications.schedule({
            id: 1,
            text: 'Tienes ' + citas.length + ' pendientes',
            sound: 'file://sound.mp3',
            data: { secret: 'key_data' }
          });
        }

        /* console.log(data);
        console.log('vamos a notificaciones 2'); */
        this.unsub();
      });
      if(citas.length>0){
        this.localNotifications.schedule({
          id: 1,
          text: 'Tienes  '+ citas.length +' citas pendientes de aceptar',
          data: { secret: 'secret' }
        });
      }else{
        console.log('sin citas')
      }
    })
    /* this.afs.collection('SegMedico/peregrino/usuarios/3OTornDjlxRGTOlFjn7wTMWGoVz1/notificaciones',
    ref=>ref.where('leido','==',false)).valueChanges().subscribe(data => {

    }) */
  }


  unsub() {
    this.clickSub.unsubscribe();
  }

  async presentAlert() {
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
    console.log('onDidDismiss resolved with role', role);
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

  ngOnDestroy(){
    console.log('Auth', this.auth.isLoggedIn);
  }



  goToCitas(){
    this.router.navigate(['/citas-asignadas']);
    //this.subscription.unsubscribe();
    this.logueado = false;
    console.log('Estado logueado en goToCitas', this.logueado)
  }

  goToCitasAceptadas(){
    this.router.navigate(['/citas-aceptadas'])
    this.logueado = false;
    console.log('Estado logueado en goToCitasAceptadas', this.logueado)
  }

  logout(){
    this.auth.signOut();
    this.logueado = false
    console.log('logout', this.logueado);
  }

  ionViewWillLeave(){
    //this.localNotifications.clearAll();
  }

  ionViewWillEnter(){
    this.logueado = true;
    console.log('Estado logueado en ionViewWillEnter', this.logueado)
  }

}
