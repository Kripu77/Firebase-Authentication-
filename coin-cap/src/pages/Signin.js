import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useLoginContext } from "../context/LoginInContext";
import "react-toastify/dist/ReactToastify.css";
const Signin = () => {
  //useNavigate from react-router v6 has replaced useHistory with useNavigate

  const navigate = useNavigate();
  //manage state

  const [inputData, setInputData] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  console.log(useLoginContext());
  // context functions
  const { login, google, github } = useLoginContext();

  //to handle change in input
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInputData({ ...inputData, [name]: value });
  };

  //to handle submit

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputData && inputData.password) {
      toast.error("Please enter credentials");
    }

    if (inputData.email && inputData.password) {
      if (inputData.password.length < 6) {
        toast.error("Please enter the correct password");
      } else {
        setLoading(true);
        login(inputData.email, inputData.password)
          .then((resp) => {
            console.log(resp);
            toast.success("Hang In directing you to Homepage")
            sessionStorage.setItem('Auth Token', resp._tokenResponse.refreshToken )
            //   navigate will push the user to home page once logged in
            navigate("/home");
          })

          .catch((err) => {
            if (err.code === "auth/user-not-found") {
              toast.error(`User not found`);
            }

            if (err.code === "auth/wrong-password") {
              toast.error("Please enter the correct password");
            }
            console.log(err);
          });
      }
    }
  };
  //useffect to prevent infinite loading state

  React.useEffect(() => {
    const loadingState = setTimeout(() => {
      setLoading(false);
    }, 1000);

    //clean up function

    return () => {
      clearInterval(loadingState);
    };
  }, [loading]);


//useffect for private route for logged in user
React.useEffect(()=>{
const authToken = sessionStorage.getItem('Auth Token')
if(authToken){
  navigate('/home')
}
if(!authToken){
  navigate('/')
}
},[])
  return (
    <section className="mt-20 ml-auto mr-auto max-w-md mb-40 ">
      <h1 className="text-2xl text-center"> Sign In</h1>
      <form className="mt-5 text-lg" onSubmit={handleSubmit}>
        <div className="flex flex-col ">
          <label htmlFor="email"> Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="p-3 rounded focus:outline-none focus:ring border"
            value={inputData.email}
            onChange={handleChange}
          ></input>
        </div>
        <br />
        <ToastContainer />
        <div className="flex flex-col">
          <label htmlFor="password"> Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="p-3 rounded  focus:outline-none focus:ring border"
            value={inputData.password}
            onChange={handleChange}
          ></input>
        </div>
        <div className="flex flex-col ">
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white uppercase text-md mx-auto p-2 m-8 rounded text-center w-60"
            type="submit"
          >
            {loading ? (
              <svg
                className=" animate-spin
      rounded-full
      h-7
      w-7
      ml-auto
      mr-auto
      border-t-2 border-b-2 border-purple-500..."
                viewBox="0 0 24 24"
              >
                {" "}
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
          <div className="flex justify-between ">
            <h1> Not registered yet?</h1>
            <button className="text-black hover:text-gray-600">
              <Link to="/signup"> Click here to register</Link>
            </button>
          </div>
        </div>
        <div className=" mt-8 text-center">
          <h1> Or</h1>
          <div className="flex flex-col p-2  ">
            <button
              className="bg-yellow-600 hover:bg-yellow-500 w-60 ml-auto mr-auto text-white rounded p-2"
              onClick={() => {
                google()
                  .then((resp) => {
                    console.log(resp);
                    navigate("/home");
                  })
                  .catch((err) => {
                    if (err.code === "auth/popup-closed-by-user") {
                      toast.error(
                        "You closed the sigin method your preferred, please choose your prefer signin method to continue."
                      );
                    }
                  });
              }}
            >
              {" "}
              Continue with Google
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-500 w-60 ml-auto mr-auto mt-4 text-white p-2 rounded"
              onClick={() =>
                github()
                  .then((resp) => {
                    navigate("/home");
                  })
                  .catch((err) => {
                    if (err.code === "auth/popup-closed-by-user") {
                      toast.error(
                        "You closed the sigin method your preferred, please choose your prefer signin method to continue."
                      );
                    }
                    console.error(err);
                  })
              }
            >
              {" "}
              Continue with GitHub
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Signin;
