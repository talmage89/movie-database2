import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './modules/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';

// material
import { MaterialModule } from './modules/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { UserSelectionsComponent } from './components/user-selections/user-selections.component';

// custom pipes
import { HoursPipe } from './pipes/hours-pipe';
import { CurrencyShortPipe } from './pipes/currency-short-pipe';

// firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from "@angular/fire/compat/auth";
import { getApp, initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  initializeFirestore,
  provideFirestore,
  connectFirestoreEmulator,
  getFirestore,
  Firestore,
} from '@angular/fire/firestore';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MovieSearchComponent,
    MovieDetailsComponent,
    UserSelectionsComponent,
    HoursPipe,
    CurrencyShortPipe,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
