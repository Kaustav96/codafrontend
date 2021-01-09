import { Component, OnInit } from '@angular/core';
import { isObservable } from 'rxjs';
import {  DataService} from '../service/data.service';
import * as $ from 'jquery';
import * as t from 'thenby';
@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.css']
})
export class Page1Component implements OnInit {

  bets: any = [];
  searchText
  randomNumber: number;
  selectedPlayers: any[] = []; //only 9
  player: any;
  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.service.getAllBets().subscribe(data=>{
      this.bets = data.map(e=>{
        return{
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          price: e.payload.doc.data()['price'],
          bet: e.payload.doc.data()['bet'],
          wins: e.payload.doc.data()['wins'],
          loss: e.payload.doc.data()['loss'],
          photo: e.payload.doc.data()['photo']
        }
      });
      this.bets = this.sortBet(this.bets)
    })
    // console.log(this.bets)
  }
  sortBet(teams): any {
    teams = teams.sort(
      t.firstBy("price","asc")
      .thenBy("wins","desc")
      .thenBy("bet","desc")
    )
    return teams;
  }
  getSelectedName(name:string, value: string){
    // console.log(value)
    if(value=="off"){
      value="on";
      if(this.selectedPlayers.length != 9){
        this.selectedPlayers.push(name);
      }
      else{
        $('input').attr('disabled', true)
      }
    }

    // console.log(value)
  }
  genRndNum(){
    this.randomNumber= Math.floor(Math.random() * 10);
    if(this.randomNumber==0){
      this.randomNumber=1
    }
    this.getResult(this.randomNumber,this.selectedPlayers)
  }
  getResult(num: number, selectedPlayers: any[]) {
    
    for(let f of this.selectedPlayers){
      if(f['bet']==num){
        f['wins']=f['wins']+1;
        f['price']=f['price']*2;
        console.log(f['name'])
        this.service.updatebet(f['id'],f)
      }
      else{
        f['loss']=f['loss']+1;
        this.service.updatebet(f['id'],f)
      }
    }
  }
  DeletePlayer(id){
    for(let f of this.selectedPlayers){
      if(f['id']==id){

        this.player = f;
        break;
      }
    }
    const idx = this.selectedPlayers.indexOf(this.player);
    if(idx>-1){
      this.selectedPlayers.splice(idx,1);
    }
  }
}

