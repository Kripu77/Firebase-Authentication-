import React from 'react'
import { FiAlignCenter } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useLoginContext } from '../context/LoginInContext';
const Nav = () => {

    const{currentUser, logOut} = useLoginContext();
    return (
      <nav>
        <section className="flex justify-between">
          <section className=" flex flex-row justify-between">
            <h1>
              {" "}
              Crytpo<span className="text-yellow-300">Info</span>
            </h1>
            <button className="hidden">
              {" "}
              <FiAlignCenter />{" "}
            </button>
          </section>
          <section className="flex space-x-7 text-lg ">
           {!currentUser && <button className="hover:text-gray-200">
              <Link to="/"> Sign In</Link>
            </button>}
            {!currentUser &&<button className="hover:text-gray-200">
              <Link to="/signup"> Sign up</Link>
            </button>}
           { currentUser && <button className="hover:text-gray-200">
              <Link to="/home"> Home</Link>
            </button>}

            { currentUser &&  <button className="hover:text-gray-200" onClick={()=>logOut()}>
                Sign Out
            </button> }
          </section>
        </section>
      </nav>
    );
}

export default Nav