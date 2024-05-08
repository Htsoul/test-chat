// App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Launcher } from 'react-chat-window';
import { v4 as uuidV4 } from 'uuid';
const socket = io('ws://127.0.0.1:3001');

const App = () => {
    const [messageList, setMessageList] = useState([]);
    const [userId, setUserId] = useState(uuidV4());
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        console.log('与服务器端的连接已建立');

        socket.on('receiveMessage', message => {
            setMessageList(message);
            setLastMessageTime(null);
        });
    }, []);


    const sendMessage = (msg) => {
        const message = {
            userId,
            text: msg,
        };
        socket.emit('sendMessage', message);
        setLastMessageTime(Date.now());
    };

    useEffect(() => {

        if (lastMessageTime && messageList.length > 0) {

          const timeout = setTimeout(() => {
            const botMessage = {
              userId: 'bot',
              text: "你好，我是机器人，对方现在不在，请稍等!"
            };
            socket.emit('sendMessage', botMessage); 
          }, 5000);
      
          setTimeoutId(timeout); 
        }
      
        return () => {
          clearTimeout(timeoutId);
        };
      }, [lastMessageTime, messageList]);

  return (
    <div>
        <Launcher
            agentProfile={{
                teamName: 'Customer Service',
                imageUrl: 'https://placeimg.com/150/150/any',
            }}
            onMessageWasSent={(message) => sendMessage(message.data.text)}
            messageList={ messageList.map((message, index) => ({
                author: message.userId === userId ? 'me' : 'them',
                type: 'text',
                data: { text: message.text },
                key: index,
              })
            )}
            showEmoji
        />
    </div>
  );
};

export default App;
