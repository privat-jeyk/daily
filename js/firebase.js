import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "DEIN_KEY",
  authDomain: "DEIN_APP.firebaseapp.com",
  projectId: "DEIN_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveCloud(data){
  await setDoc(doc(db, "planner", "data"), data);
}

export async function loadCloud(){
  const snap = await getDoc(doc(db, "planner", "data"));
  return snap.exists() ? snap.data() : null;
}
