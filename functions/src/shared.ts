// functions/src/shared.ts
import * as admin from "firebase-admin";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

admin.initializeApp();

export const db = admin.firestore();
export const ttsClient = new TextToSpeechClient();
export { admin };
