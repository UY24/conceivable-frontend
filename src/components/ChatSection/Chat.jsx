import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Upload, Send, MicOff, Mic, User } from 'react-feather'
import AdminImage from '../../assets/admin_image.png'
import Logo from '../../assets/logo.avif'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';
import ReactLoading from 'react-loading'

const ChatBox = ({ name, email, handleLogOut }) => {

    const backendURL = 'https://utkarsh1704.pythonanywhere.com'
    const [allAudios, setAllAudios] = useState([])
    const [audioFile, setAudioFile] = useState(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [receivedAudioUrl, setReceivedAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false)

    const audioElementRef = useRef(null);

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleCanPlay = () => {
        if (!isPlaying) {
            console.log("first")
            audioElementRef.current.play();
            setIsPlaying(true)
        }
    };

    useEffect(() => {
        if (audioElementRef.current) {
            audioElementRef.current.addEventListener('canplay', handleCanPlay);
            // setIsPlaying(true);
        }
        return () => {
            if (audioElementRef.current) {
                audioElementRef.current.removeEventListener('canplay', handleCanPlay);
                setIsPlaying(false);
            }
        };

    }, [receivedAudioUrl, audioElementRef])



    let chunks = []

    const sendAudioToBackend = async (audioBlob_user) => {
        try {
            setIsWaiting(true)
            const formData = new FormData();
            // formData.append('audio', audioFile);
            formData.append('audio', audioBlob_user);
            formData.append('name', name);
            formData.append('email', email);
            // setAllAudios([...allAudios, audioFile])
            console.log([...allAudios, audioFile])
            setAudioFile(null)
            // setAudioFile(null);

            const response = await axios.post(`${backendURL}/upload-audio`,

                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob'
            }
            );

            // Handle response
            const audioBlob = new Blob([response.data], { type: 'audio/wav' });
            // const audioUrl = URL.createObjectURL(audioBlob);
            audioBlob["name"] = `Res_${Date.now()}`
            // setAudioFile(audioBlob);
            // setAudioFile(audioUrl);
            setAllAudios([...allAudios, audioFile, audioBlob])

            console.log('Audio sent successfully:', response);
            setIsWaiting(false)
            try {
                // const audioElement = new Audio((response.data));
                // console.log("Music Stopped! 2")
                // await audioElement.play();
                // console.log("Music Stopped! 3")
                // audioElement.addEventListener('ended', () => setIsPlaying(false));

                setReceivedAudioUrl(URL.createObjectURL(response.data));
                console.log(URL.createObjectURL(response.data))
                // audioElementRef.current.src = URL.createObjectURL(response.data)
                audioElementRef.current.src = URL.createObjectURL(response.data)
                console.log("Music Stopped! 3")


                if (audioElementRef.current) {
                    audioElementRef.current.addEventListener('canplay', handleCanPlay);
                    // setIsPlaying(true);

                    audioElementRef.current.addEventListener('ended', () => {
                        setIsPlaying(false)
                    });
                }


                // try {
                //     audioElementRef.current.play();

                // } catch (error) {
                //     audioElementRef.current.pause();
                //     console.log(error)

                // }
                console.log("Music Stopped! 2")

                console.log("Music Stopped! 1")

                // audioElementRef.current.onended = (e) => {
                //     setIsPlaying(false);
                //     console.log("Music Stopped!")

                // }
                // audioElementRef.current.addEventListener('ended', (e) => {setIsPlaying(false); console.log("Music stopped")});

            } catch (error) {
                console.log(error)
                setIsPlaying(false)
                setIsWaiting(false)
                // toast.error("Error: "+ error, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     // draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     transition: Bounce,
                //     });


            }



        } catch (error) {
            console.error('Error sending audio:', error);
            setIsWaiting(false)
            // toast.error("Error: "+ error, {
            //     position: "top-right",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     // draggable: true,
            //     progress: undefined,
            //     theme: "light",
            //     transition: Bounce,
            //     });
        }
    };


    const startRecording = () => {
        //
        // setAudioChunks([])
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                chunks = []
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                console.log(stream)
                setMediaRecorder(recorder);
                // recorder.ondataavailable =  async (e) => {
                //     console.log(e.data)
                //     // setAudioChunks((prevChunks) => [...prevChunks, e.data]);
                //      setAudioChunks([...audioChunks, e.data])
                // };
                recorder.start();
                setRecording(true);
                recorder.ondataavailable = async (e) => {
                    console.log(e.data)
                    chunks.push(e.data)
                    // setAudioChunks((prevChunks) => [...prevChunks, e.data]);
                    // setAudioChunks([...audioChunks, e.data])
                };
                recorder.onstop = e => {
                    console.log(chunks.length);
                    const audioBlob = new Blob(chunks, { type: recorder.mimeType });
                    audioBlob["name"] = `Audio_${Date.now()}`
                    setAudioFile(audioBlob);
                    sendAudioToBackend(audioBlob);
                }
            })
            .catch(error => {
                console.error('Error accessing microphone:', error)
                // toast.error("Error accessing microphone: "+ error, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     // draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     transition: Bounce,
                //     });

            });
    };


    const stopRecording = () => {
        // mediaRecorder.ondataavailable = async (e) => {
        //     console.log(e.data)
        //     // setAudioChunks((prevChunks) => [...prevChunks, e.data]);
        //     setAudioChunks([...audioChunks, e.data])
        // };
        mediaRecorder.stop();

        setRecording(false);
        // mediaRecorder.stream.getTracks().forEach(track => track.stop());
        // console.log(mediaRecorder.stream.getTracks())
        // console.log(audioChunks.length);
        // const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
        // audioBlob["name"] = `Audio_${Date.now()}`
        // setAudioFile(audioBlob);
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setAudioFile(file);
        console.log(file)
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
        // <div className=" min-w-96 relative p-4 border border-gray-300 rounded-lg shadow-lg   bg-white items-center  " >
        <div className="lg:w-[50%] w-screen relative m-4    bg-white items-center  min-h-screen flex flex-col justify-between" >
            <div className="flex items-center w-[100%] justify-between mb-4 bg-blue-500">
                {/* <h1 className="text-xl font-semibold">Audio Chat App</h1> */}
                <h1 className="text-xl font-semibold"><img src={Logo} alt='Conceivable' /></h1>
                <div className='relative cursor-pointer max-sm:mr-2  mr-5' onMouseEnter={() => setShowUserDetails(true)} onMouseLeave={() => setShowUserDetails(false)} >
                    <User className='text-white' onClick={() => setShowUserDetails(!showUserDetails)} />
                    {showUserDetails && <div className='absolute -bottom-[90px] right-0 rounded-xl bg-blue-100 w-max text-sm font-semibold ' >
                        <ul>
                            <li className=' mx-2 my-2'>👤 {name}</li>
                            <li className='my-1 mx-2'>📧 {email}</li>
                            <hr />
                            <div className='bg-blue-300 px-2 py-1 cursor-pointer rounded-b-xl' onClick={() => { handleLogOut() }}>🔑 LogOut</div>
                        </ul>
                    </div>}
                </div>

            </div>

            <div className="relative h-max">
                <audio ref={audioElementRef} controls src={receivedAudioUrl} className="mb-4 hidden" />
                <img src={AdminImage} alt="Bot" className="w-48 h-48 rounded-full z-20 relative" />
                {isPlaying && (
                    <>
                        <div className="h-52 w-52 absolute top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2  bg-blue-500/70 rounded-full animate-pulse" style={{ animationDuration: '1s', animationIterationCount: 'infinite' }}></div>
                        <div className="h-60 w-60 absolute top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2 bg-blue-500/70 rounded-full animate-pulse" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                        <div className="h-72 w-72 absolute top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2 bg-blue-500/70 rounded-full animate-pulse" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
                    </>
                )}

                {isWaiting && (
                    <>
                        <div className="h-52 w-52 absolute transform top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2  bg-yellow-500/70 rounded-full animate-pulse" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
                        <div className="h-60 w-60 absolute transform top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2 bg-yellow-500/70 rounded-full animate-pulse" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                        <div className="h-72 w-72 absolute transform top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2 bg-yellow-500/70 rounded-full animate-pulse" style={{ animationDuration: '1s', animationIterationCount: 'infinite' }}></div>
                        {/* <div className=""> */}
                        {/* <ReactLoading className="" type="bubbles" color="rgb(59 130 246)" height='5px' width={'100px'} /> */}
                        {/* <div className="">Kristen is Thinking......</div> */}
                        {/* </div> */}
                    </>
                )}
            </div>
            <div className="mb-4  bottom-6 w-5/6
              px-10 py-2 rounded-xl">
                <div className="flex items-center justify-center gap-3 sm:gap-2 ">
                    {/* <div className="">
                        <label
                            className="block  rounded-full cursor-pointer px-4 py-2 bg-red-500 text-white " onClick={handleButtonClick}>
                            <span>
                                <Upload />
                            </span>
                        </label>
                        <input
                            type="file"
                            id="audioFile"
                            accept="audio/*"
                            onChange={handleFileInputChange}
                            ref={fileInputRef}
                            className="hidden "
                        />
                    </div> */}

                    {
                        // audioFile ?
                        //     <div>{audioFile.name}</div>
                        //     :
                        recording ? (
                            <>
                                <button onClick={stopRecording} className="mr-2 px-4 relative py-2 bg-red-500 text-white rounded-full flex justify-center items-center h-[75px] w-[75px] "><Mic />

                                    <div>
                                        <div className="h-10 w-10 absolute transform top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2  bg-red-100/70 rounded-full animate-pulse" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}></div>
                                        <div className="h-16 w-16 absolute transform top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2 bg-red-100/70 rounded-full animate-pulse" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }}></div>
                                        <div className="h-20 w-20 absolute transform top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2 bg-red-100/70 rounded-full animate-pulse" style={{ animationDuration: '1s', animationIterationCount: 'infinite' }}></div>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <button onClick={startRecording} className="flex justify-center items-center h-[75px] w-[75px] mr-2 px-4 py-2 bg-blue-500 text-white rounded-full">
                                <MicOff />
                            </button>
                        )
                    }
                    {/* <button onClick={sendAudioToBackend} className=" px-4 py-2 bg-green-500 text-white rounded-full" disabled={audioFile == null || undefined ? true : false} >
                        <Send />
                    </button> */}
                </div>
                {/* <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    // draggable
                    pauseOnHover
                    theme="light"
                // transition: Bounce,
                />
                <ToastContainer /> */}
            </div>
        </div>
    );
};

export default ChatBox;
