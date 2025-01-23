import React from 'react'
import bell from '../../assets/bell.png'
import menu from '../../assets/menu.png'
const Navbar = () => {
  return (
    <>
    <div className="navBar w-full h-14 flex justify-between items-center px-2">
      <div className="logo text-lg font-bold">Logo</div>
      <div className="menu flex w-1/12 h-full">
        <div className="notification w-6 h-6">
            <img src={bell} alt="bell" />
        </div>
        <div className="menu w-12 h-12">
            <img src={menu} alt="menu" />
        </div>
      </div>
    </div>
  </> )
}

export default Navbar