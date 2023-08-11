import React from 'react';
import { useEffect, useState } from 'react';
import { getAPICall, postAPICall } from './APICall';

export function ChatComponent() {
  const [messages, setMessages] = useState<object[]>([]);
  const [username, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    getAPICall("/api/chat/log", (result :any) => {
      setMessages(result);
    });
  }, []);
  const handleClick = () => {
    var name = username;
    if( message === "") return;
    if( name === "") name ="名無し";
    postAPICall("/api/chat/add", {name, message}, (result :any) => {
      setMessages(result);
      setUserName("");
      setMessage("");
    });
  }
  const handlekeydown = (e :any) => {
    if(e.key === "Enter") {
      handleClick();
    }
  }
  return (
    <div onKeyDown={handlekeydown}>
      <div className='chat-view'>
      {messages.map((message :any, index) => {
        return (<div key={index}>{message.name} : {message.message}</div>);
      })}
      </div>
      <div className='chat-input'>
        <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} placeholder='name' />
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='message'/>
        <button onClick={handleClick}>  post!</button>
      </div>
    </div>
  );
}