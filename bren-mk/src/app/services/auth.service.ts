import { Injectable, NgZone } from '@angular/core';
import { User } from "../utils/models/user";
import auth from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  constructor(public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone
  ) {    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')  || '{}');
      } else {
        localStorage.setItem('user', '{}');
        JSON.parse(localStorage.getItem('user')  || '{}');
      }
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')  || '{}');
    return (user !== null && user.uid) ? true : false;
  }

  get isAnonymous(): boolean {
    const user = JSON.parse(localStorage.getItem('user')  || '{}');
    return (user !== null && user.uid != null && user.uid != 'undefined' && !user.email ) ? true : false;
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });
  }

  anonymousLogin() {
    return this.afAuth.signInAnonymously()
      .then((user) => {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      })
      .catch(error => console.log(error));
  }

}