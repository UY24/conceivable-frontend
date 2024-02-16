import React, { useState , useRef, useEffect} from 'react'
import {Pause, Play, StopCircle, Upload} from 'react-feather'


const AudioMsg = ({isUser, audio, idx}) => {

    const [isPlaying, setIsPlaying] = useState(false)
    const [receivedAudioUrl, setReceivedAudioUrl] = useState(null);

    const audioElementRef = useRef(null);


    const handleReceivedAudioChange = (file) => {
        // const file = event.target.files[0];
        setReceivedAudioUrl(URL.createObjectURL(file));
        console.log(URL.createObjectURL(file))
      };
    
      const playReceivedAudio = () => {
        audioElementRef.current.play();
      };


    const PlayAudio = () => {
        console.log("Playing.....")
        audioElementRef.current.play();
        setIsPlaying(true)
    }

    const StopAudio = () => {
        console.log("Stopped.....")
        audioElementRef.current.pause();
        setIsPlaying(false)

    }

    useEffect(() => {
        handleReceivedAudioChange(audio)
    }, [audio])
    

  return (
    <div className={`absolute  flex gap-2 mr-2 bottom-${24+idx*16} right-4 bg-blue-300 border rounded-b-lg rounded-l-lg`}  >
        <span  className='bg-green-500  rounded-l-lg cursor-pointer '>
            {
                !isPlaying ?
                <Play className='mx-2 my-1' 
                onClick={PlayAudio}
                />
                :
                <StopCircle  className='mx-2 my-1'
                 onClick={StopAudio}
                 />
            }
        </span>

        <span className='mx-2 my-1'>
        <audio ref={audioElementRef} controls src={receivedAudioUrl} className="mb-4 hidden" />

        {audio?.name}
        </span>

                    {/* <div className="w-96 p-4 mt-8 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Received Audio</h2>
        <label htmlFor="received" className="block font-medium text-gray-700 cursor-pointer"><Upload/></label>

        <input id='received' type="file" accept="audio/*" onChange={handleReceivedAudioChange} className="mb-4 hidden" /> */}
        {/* {receivedAudioUrl && (
          <div>
            <audio ref={audioElementRef} controls src={receivedAudioUrl} className="mb-4 hidden" />
            <button onClick={playReceivedAudio} className="px-4 py-2 bg-blue-500 text-white rounded-md"><Play/>Play Received Audio</button>
          </div>
        )} */}
        
      {/* </div> */}
    </div>
  )
}

export default AudioMsg