import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private fire: AngularFirestore) { }
  getAllBets(){
    return this.fire.collection('bets').snapshotChanges();
  }
  updatebet(betid,bet){
    this.fire.doc('bets/'+betid).update(bet);
  }
}
