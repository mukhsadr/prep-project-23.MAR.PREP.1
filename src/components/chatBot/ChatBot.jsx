import React, { useEffect } from 'react'
import alanBtn from "@alan-ai/alan-sdk-web";
function ChatBot() {
    useEffect(() => {
        alanBtn({
            key: process.env.REACT_APP_ALAN_AI,
            onCommand: (commandData) => {
                if (commandData.command === "go:back") {
                    // Call the client code that will react to the received command
                }
            },
        });
    }, []);
    return (
        <></>
    )
}

export default ChatBot