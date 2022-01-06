import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getNotifications(){
    return this.afs.collection('SegMedico/peregrino/usuarios/3OTornDjlxRGTOlFjn7wTMWGoVz1/notificaciones',
      ref=>ref.where('leido','==',false)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          var band = data['leido'];
          return band;
        }))
      );
  }

  updateNotification(){
    return new Promise<void>((resolve) => {

    })
  }
}
