import React, { useState } from 'react';
import axios from 'axios';
import AdminImage from '../../assets/admin_image.png'
const AudioChatApp = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [botResponse, setBotResponse] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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

  
  const playBotResponse = () => {
    // Code to play the bot response audio
    // Assuming botResponse is the audio URL received from the backend
    // You can use <audio> element to play the audio
    setIsPlaying(true);
    const audioElement = new Audio(botResponse);
    audioElement.addEventListener('ended', () => setIsPlaying(false));
    audioElement.play();
  };

  const sendAudioToBackend = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post('https://your-backend-api.com/upload-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle response
      console.log('Audio sent successfully:', response.data);
      // Assuming the backend returns bot response audio URL
      setBotResponse(response.data); // Update bot response state with audio URL


      /////

      setIsPlaying(true);
        const audioElement = new Audio(response.data);
        audioElement.addEventListener('ended', () => setIsPlaying(false));
        audioElement.play();

    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative">
        <div className="absolute w-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        
          <img src={AdminImage} alt="Bot" className="w-48 h-48 rounded-full" />
          {/* Circular waves animation */}
          {isPlaying && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="h-52 w-52 absolute top-0 left-0 bg-blue-500/80 rounded-full animate-pulse" style={{ animationDuration: '1s', animationIterationCount: 'infinite' }}></div>
              <div className="h-56 w-56 absolute top-0 left-0 bg-blue-500/80 rounded-full animate-pulse" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
              <div className="h-60 w-60 absolute top-0 left-0 bg-blue-500/80 rounded-full animate-pulse" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center mt-8">
        {recording ? (
          <button onClick={stopRecording} className="mr-2 px-4 py-2 bg-red-500 text-white rounded-md">Stop Recording</button>
        ) : (
          <button onClick={startRecording} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md">Start Recording</button>
        )}
        <button onClick={sendAudioToBackend} className="px-4 py-2 bg-green-500 text-white rounded-md">Send Audio</button>
      </div>
      {/* <div className="mt-4">
        <button onClick={playBotResponse} className="px-4 py-2 bg-blue-500 text-white rounded-md">Play Bot Response</button>
      </div> */}
    </div>
  );
};

export default AudioChatApp;
