import React, { useState, useRef } from 'react';
// import axios from 'axios';
import {Upload, Play} from 'react-feather'
const Chats = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [receivedAudioUrl, setReceivedAudioUrl] = useState(null);

  const audioElementRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.ondataavailable = (e) => {
          setAudioChunks((prevChunks) => [...prevChunks, e.data]);
        };
        recorder.start();
        setRecording(true);
      })
      .catch(error => console.error('Error accessing microphone:', error));
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    setAudioFile(audioBlob);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const sendAudioToBackend = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

    //   const response = await axios.post('https://your-backend-api.com/upload-audio', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });

      // Handle response
      console.log('Audio sent successfully:');
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const handleReceivedAudioChange = (event) => {
    const file = event.target.files[0];
    setReceivedAudioUrl(URL.createObjectURL(file));
    console.log(URL.createObjectURL(file))
  };

  const playReceivedAudio = () => {
    audioElementRef.current.play();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-96 p-4 border border-gray-300 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Audio Chat App</h1>
        </div>
        <div className="mb-4">
          <div className="mb-2">
            <label htmlFor="audioFile" className="block font-medium text-gray-700 cursor-pointer"><Upload/></label>
            <input
              type="file"
              id="audioFile"
              accept="audio/*"
              onChange={handleFileInputChange}
              className="mt-1 hidden"
            
            />
          </div>
          <div className="flex items-center">
            {recording ? (
              <button onClick={stopRecording} className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md">Stop Recording</button>
            ) : (
              <button onClick={startRecording} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md">Start Recording</button>
            )}
            <button onClick={sendAudioToBackend} className="px-4 py-2 bg-green-500 text-white rounded-md">Send Audio</button>
          </div>
          
        </div>
      </div>

      <div className="w-96 p-4 mt-8 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Received Audio</h2>
        <label htmlFor="received" className="block font-medium text-gray-700 cursor-pointer"><Upload/></label>

        <input id='received' type="file" accept="audio/*" onChange={handleReceivedAudioChange} className="mb-4 hidden" />
        {receivedAudioUrl && (
          <div>
            <audio ref={audioElementRef} controls src={receivedAudioUrl} className="mb-4" />
            <button onClick={playReceivedAudio} className="px-4 py-2 bg-blue-500 text-white rounded-md"><Play/>Play Received Audio</button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Chats;
