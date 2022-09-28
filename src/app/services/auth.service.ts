import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, getDocs } from '@firebase/firestore';
import { firebase } from 'firebaseui-angular'
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { ListType } from '../enums/list-type';
import { Movie } from '../interfaces/movie';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  watchedMovies = new BehaviorSubject<Movie[]>([]);
  wishListMovies = new BehaviorSubject<Movie[]>([]);

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private firestore: Firestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    )
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user)
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    this.router.navigate(['/search']);
    return userRef.set(data, { merge: true })
  }

  async saveMovie(user: User, movie: Movie, listType: ListType) {
    const dbInstance = collection(this.firestore, 'users');
    getDocs(dbInstance)
      .then(response => {
        let users = response.docs.map(item => {
          return { ...item.data(), id: item.id }
        });
        let selectedUser = users[users.findIndex(el => el.id == user.uid)];
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
        if (listType === ListType.WATCHEDLIST) {
          let list = selectedUser[ListType.WATCHEDLIST];
          if (!list) list = [movie];
          else list = [...list, movie];
          let data = {
            ...user,
            watchedMovies: list,
          };
          userRef.set(data, { merge: true });
          this.watchedMovies.next(list);
        } else {
          let list = selectedUser[ListType.WISHLIST];
          if (!list) list = [movie];
          else list = [...list, movie];
          let data = {
            ...user,
            wishListMovies: list,
          };
          userRef.set(data, { merge: true });
          this.wishListMovies.next(list);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  deleteMovie(user: User, movie: Movie, listType: ListType) {
    const dbInstance = collection(this.firestore, 'users');
    getDocs(dbInstance)
      .then(response => {
        let users = response.docs.map(item => {
          return { ...item.data(), id: item.id }
        });
        let selectedUser = users[users.findIndex(el => el.id == user.uid)];
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
        if (listType === ListType.WATCHEDLIST) {
          let list = selectedUser[ListType.WATCHEDLIST];
          const index = list.findIndex(elem => elem.id === movie.id);
          if (index > -1) {
            list.splice(index, 1);
            let data = {
              ...user,
              watchedMovies: list
            };
            userRef.set(data, { merge: true });
          }
          this.watchedMovies.next(list.length > 0 ? list : []);
        } else {
          let list = selectedUser[ListType.WISHLIST];
          const index = list.findIndex(elem => elem.id === movie.id);
          if (index > -1) {
            list.splice(index, 1);
            let data = {
              ...user,
              wishListMovies: list
            };
            userRef.set(data, { merge: true });
          }
          this.wishListMovies.next(list.length > 0 ? list : []);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  getUserData(user: User, listType: ListType) {
    if (user) {
      const doc = this.afs.doc(`users/${user.uid}`);
      const watchedList = doc[ListType.WATCHEDLIST];
      const wishList = doc[ListType.WISHLIST];

      if (listType === ListType.WATCHEDLIST) {
        this.watchedMovies.next(!watchedList ? [] : watchedList);
      }

      if (listType === ListType.WISHLIST) {
        this.wishListMovies.next(!wishList ? [] : wishList);
      }
    }
  }
}