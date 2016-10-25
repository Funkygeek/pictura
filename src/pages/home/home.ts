import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Camera } from 'ionic-native';


import {Transfer} from 'ionic-native';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public base64Image: string;

  // To show the results of full, and thumb
  public cloudinaryImageUri:string;
  public cloudinaryThumbUri:string;


  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController) {

    // Set the location where we are going to dump the picture.
    // Docs.: https://github.com/apache/cordova-plugin-camera#module_Camera.DestinationType


  }

  takePhoto() {
    this.cloudinaryImageUri="";
    this.cloudinaryThumbUri="";

    console.log('button pressed');
   
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imagedata) => {
      // this is the location of the file....
      this.base64Image = "data:image/jpeg;base64," + imagedata;
    }, (err) => {
      // Handle error
      console.error(err);
    });
  }

  savePhoto() {
        let ft = new Transfer();
        let filename = "test-for-Rhi" + ".jpg";
        this.cloudinaryImageUri="";
        this.cloudinaryThumbUri="";

         let CLOUDINARY_CONFIGS =
         {
              UPLOAD_PRESET: "t8innunp",
              API_URL:"https://api.cloudinary.com/v1_1/lwve0xa7a/image/upload"
        }
        let options = {
            fileName: filename,
            params: {
                fileName: filename,
                'upload_preset': CLOUDINARY_CONFIGS.UPLOAD_PRESET
            }
        }; 
        
        let loader = this.loadingCtrl.create({
      content: "Uploading Photo...",
    });
    loader.present();


        ft.upload(this.base64Image, CLOUDINARY_CONFIGS.API_URL, options, true)
        .then((result) => {
          let response = JSON.parse(result.response);
          loader.dismissAll();
          
            this.base64Image=""; // reset so it doesn't show on the page
            this.cloudinaryImageUri=response.url; // could use secure_url if we want https
             this.cloudinaryThumbUri=response.eager[0].url; 

        }).catch((err) => {
            console.error(err);
            loader.dismissAll();
        }); 
    

  }

}
