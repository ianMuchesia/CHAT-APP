
import './App.css'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000'); 
type message = string

interface Messages{
  name: string
  message: string
}
function App() {

  const [name, setName] = useState('');
  const [message, setMessage] = useState<message>('');
  const [messages, setMessages] = useState<Messages[]>([]);

   useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    }); 
    socket.on("connect", () => {
      console.log(socket.connected); // true
    });
   
  }, []);
 

  const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name && message) {
     socket.emit('sendMessage', { name, message }); 
      setName('');
      setMessage('');
    }

  };


  return (
   <div>
    
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} placeholder="Your name" onChange={(event) => setName(event.target.value)} />
        <input type="text" value={message} placeholder="Your message" onChange={(event) => setMessage(event.target.value)} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.name}: {message.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
