import { useEffect, useState } from "react"
import ChatBox from "./ChatSection/Chat"
import RegisterForm from "./RegisterForm"
import AdminImage from '../assets/admin_image.png'
import LoadingComponent from "./ChatSection/Loading"
import ReactLoading from 'react-loading'


const MainComp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const handleLogOut = () => {
        setEmail("")
        setName("")
        localStorage.clear()
        setIsLoggedIn(false)
    }

    useEffect(() => {
        // const interval = setInterval(() => {
        //   if (loadPercentage < 100) {
        //     setLoadPercentage(prevPercentage => prevPercentage + 10);
        //   } else {
        //     clearInterval(interval);
        //   }
        // }, 1000);
    
        // return () => clearInterval(interval);
        if(isLoggedIn){

        

        const timeout = setTimeout(() => {
            setIsLoading(false)
        }, 3000);

    

        return () => clearTimeout(timeout)

        }
      }, [isLoggedIn]);


    useEffect(() => {
        try {
            if (localStorage.getItem("name") && localStorage.getItem("email")) {
                setEmail(localStorage.getItem("email"))
                setName(localStorage.getItem("name"))
                setIsLoggedIn(true)
                setIsLoading(true)
            }
        } catch (error) {
            localStorage.clear()
        }

    }, [isLoggedIn])


    return (
        <main className={`w-full flex justify-center ${isLoggedIn ? "bg-blue-50" : ""}`}>
            {!isLoggedIn && <div className="relative max-w-[50%] flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        
                    <img src={AdminImage} alt="" srcset="" className="h-full"/>
                <div
                    className="absolute inset-0 my-auto h-[500px]"
                    style={{
                        background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)", filter: "blur(118px)"
                    }}
                >

                </div>
            </div>}

            {!isLoggedIn ?
                <RegisterForm name={name} email={email} setEmail={setEmail} setName={setName} setIsLoggedIn={setIsLoggedIn} />
                :
                // loadPercentage === 100 ?
                !isLoading ?
                
                <ChatBox name={name} email={email} handleLogOut={handleLogOut} />
            
            
:
<div className="">
                <ReactLoading className="absolute top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2" type="bubbles" color="rgb(59 130 246)" height='5px' width={'100px'} />
                <div className="absolute top-1/2 -translate-y-1/2  -translate-x-1/2 left-1/2">Connecting to Kristen......</div>
</div>
                
                

            } 

        </main>
    )
}

export default MainComp