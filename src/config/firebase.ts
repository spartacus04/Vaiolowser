import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { FIREBASE_KEY } from '.';

const options : FirebaseOptions = {
	apiKey: FIREBASE_KEY,
	authDomain: 'prosciutthanos-events.firebaseapp.com',
	projectId: 'prosciutthanos-events',
	storageBucket: 'prosciutthanos-events.appspot.com',
	messagingSenderId: '256859147490',
	appId: '1:256859147490:web:6e5ac97b4bd69de936a2bb',
	measurementId: 'G-4CCNXP5VF5',
};

let app : FirebaseApp;

export const getApp = () : FirebaseApp => {
	if(!app) app = initializeApp(options);
	return app;
};