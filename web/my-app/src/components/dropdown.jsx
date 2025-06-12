import  { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import {Link} from 'react-router-dom';

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className=" flex size-11 bg-gray-300 justify-center items-center" onClick={toggleDropdown}>
        <RxHamburgerMenu className='size-9' />
      </button>
      {isOpen && (
        <div className="fixed top-20 right-0 flex w-54 justify-center items-center">
          <div
            id="dropdownLeftEnd"
            className="z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-80 h-80 dark:bg-gray-700 relative"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownLeftEndButton"
            >
              <li>
                <button
                  className="top-0 left-0 m-4 bg-gray-300"
                  onClick={toggleDropdown}
                >
                  <IoCloseSharp className='size-4' />
                </button>
              </li>
              <li>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Earnings
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
