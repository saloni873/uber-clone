import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
export { SocketContext };

const socket = io(`${import.meta.env.VITE_BASE_URL}`); 

const SocketProvider = ({ children }) => {

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Cleanup on unmount
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    // Helper function to identify user to backend
    const sendMessage = (eventName, message) => {
        socket.emit(eventName, message);
    };

    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);
    };

    return (
        <SocketContext.Provider value={{ socket, sendMessage, receiveMessage }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;