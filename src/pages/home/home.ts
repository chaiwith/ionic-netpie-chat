import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import microgear from 'microgear';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;
  APPID  = "armytest1";
  KEY    = "z7SLJkrQg2kkCmE";
  SECRET = "8EW7dSNZBQcS6CRpgKSHbgqIh";
  alias : string;
  microgear : any;
  messages : any = [];
  text : string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

  }

  scrolldown(){
    this.content.scrollToBottom(0)
  }

  ionViewDidEnter() {
  	this.connectPrompt();
  }

  connectPrompt() {
  	const alert = this.alertCtrl.create({
	    title: 'enter your name',
	    inputs: [
	      {
	        name: 'name',
	        placeholder: 'name'
	      }
	    ],
	    buttons: [
	      {
	        text: 'Connect',
	        handler: data => {
	          this.alias = data.name
	          this.connect();
	        }
	      }
    	]
  	});
  	alert.present();
  }

  connect(){
  	let that = this;
  	this.microgear = microgear.create({
	  key : this.KEY,
	  secret : this.SECRET
	});
  	this.microgear.connect(this.APPID);
  	this.microgear.on('connected', function() {
      console.log('Connected...');
      that.microgear.setalias(that.alias);
      that.microgear.subscribe("/chatroom");
    });

    this.microgear.on('message', function(topic,body) {
	  console.log('incoming : '+topic+' : '+body);
	  let data = ('' + body).split(":");
	  if(data[0]!=that.alias){
	  	that.messages.push({from : data[0]+" : ",text : data[1],align : "left",classtext:"message-other"});
	  }
    });
  
    this.microgear.on('closed', function() {
	  console.log('Closed...');
    });
  }

  send(){
  	this.microgear.publish("/chatroom",this.alias+":"+this.text);
  	this.messages.push({from : "",text : this.text,align : "right",classtext:"message-me"});
  	this.text = "";
  }

}
