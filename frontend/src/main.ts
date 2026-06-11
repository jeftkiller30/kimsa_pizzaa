import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular/standalone';

import { provideHttpClient } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// 🔥 FIREBASE
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

// 🔥 ICONOS
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDKUzUG-oLia4hnm8Pk0HsafYKsu8Xh7_Q",
  authDomain: "kimsa-d7c8e.firebaseapp.com",
  projectId: "kimsa-d7c8e",
  storageBucket: "kimsa-d7c8e.firebasestorage.app",
  messagingSenderId: "329140969495",
  appId: "1:329140969495:web:0cbee4d541e76b09433c52"
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // 🔥 HTTP CLIENT
    provideHttpClient(),

    // 🔥 FIREBASE
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
}).then(() => {
  addIcons({
    'location-outline': locationOutline,
  });
});