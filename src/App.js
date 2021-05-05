
import React, { useEffect, useState } from "react";
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

if (!firebase.apps.length) {
   firebase.initializeApp({
     apiKey: "AIzaSyD1GDCZi29UVcfj7yMVh7-6QtgAs6FZG1M",
     authDomain: "chat-e5c95.firebaseapp.com",
     projectId: "chat-e5c95",
     storageBucket: "chat-e5c95.appspot.com",
     messagingSenderId: "334888117557",
     appId: "1:334888117557:web:52d8c80d67d3d35d69d87c",
     measurementId: "G-W42C6RM14K"
   });
}else {
   firebase.app(); // if already initialized, use that one
}


const  auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <h1>Message App</h1>
      <h2>By: Rob Drehmann</h2>

      {user ? <ChatRoom />: <SignIn /> }

    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(


    <button onClick={signInWithGoogle}>Sign in with Google</button>


  )
}
function SignOut() {
  return (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault();
    const{uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }
  return (

    <>
    <div>
      <SignOut />
    </div>

      <div>
        {messages && messages.map(msg => <ChatMessage key ={msg.id} message={msg} />)}
        </div>
        <form onSubmit ={sendMessage}>
          <input value ={formValue} onChange={(e) => setFormValue(e.target.value)}/>
          <button type="submit">Send</button>
        </form>




        </>
  )
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
