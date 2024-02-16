

const RegisterForm = ({name, email, setEmail, setName, setIsLoggedIn}) => {

    const handleLogIn = (e) => {
        e.preventDefault()

        localStorage.setItem("name", name)
        localStorage.setItem("email", email)

        setIsLoggedIn(true)
        console.log("loggedIn")
    }


    return (
    
        <div className="flex-1 flex items-center justify-center h-screen">
            <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
                <div className="">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Sign up</h3>
                    </div>
                </div>
        
                <form
                    onSubmit={(e) => handleLogIn(e)}
                    className="space-y-5"
                >
                    <div>
                        <label className="font-medium">
                            Name
                        </label>
                        <input
                        name="name"
                            type="text"
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-blue-600 shadow-sm rounded-lg"
                            onChange={(e)=>{setName(e.target.value)}}
                        />
                    </div>
                    <div>
                        <label className="font-medium">
                            Email
                        </label>
                        <input
                        name="email"
                            type="email"
                            required
                            className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-blue-600 shadow-sm rounded-lg"
                            onChange={(e)=>{setEmail(e.target.value)}}
                        />
                    </div>
                    <button
                        className="w-full px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-600 rounded-lg duration-150"
                    >
                        Start Talking
                    </button>
                </form>
            </div>
        </div>
        // </main>
    )
}

export default RegisterForm