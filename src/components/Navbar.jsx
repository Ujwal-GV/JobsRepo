import React, { useState } from "react";
import { PiSealCheckFill } from "react-icons/pi";
import { BiSolidUserCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import { Drawer } from "antd";
import { RiArrowLeftSFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
const Navbar = () => {
  const menuItem = [
    { title: "Home", nav: "/user" },
    { title: "News", nav: "/user/news" },
    { title: "Profile", nav: "/user/profile" },
  ];
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [open, setOpen] = useState(false); //for drawer

  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full h-20 p-5 px-2 md:px-7 lg:px-10 flex justify-between items-center sticky top-0 left-0 z-50 bg-white overflow-hidden">
      <div className="center gap-1 ">
        <PiSealCheckFill className="text-2xl text-orange-500" />
        <span className="font-bold text-2xl md:text-3xl">JOB SHINE</span>
      </div>

      <div className="justify-center items-center gap-1 hidden md:flex ">
        {menuItem.map(
          (d, idx) =>
            d.title !== "Profile" && (
              <div
                key={idx}
                className="p-1 cursor-pointer relative flex center "
                onClick={() => {
                  setSelectedMenu(idx);
                  navigate(d.nav);
                }}
              >
                {d.title}
                {selectedMenu === idx && (
                  <motion.div
                    layoutId="underline_nav"
                    className={"absolute -bottom-1 h-1 w-full bg-orange-600  "}
                  />
                )}
              </div>
            )
        )}
      </div>
      <div className="hidden md:flex gap-2 items-center justify-center font-outfit">
        {!localStorage.getItem("authToken") ? (
          <>
            <a href="/signup">
              <button className="btn-dark px-3 py-1 rounded-lg hidden md:flex">
                SignUp
              </button>
            </a>
            <a href="/login">
              <button className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg">
                SignIn
              </button>{" "}
            </a>
          </>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <button
          className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg"
          onClick={() => {
            localStorage.removeItem("authToken");
            navigate("/login");
          }}
        >
          Logout
        </button>
          <div
            className="flex center gap-1 text-[1rem] cursor-pointer p-1 primary-shadow rounded-md"
            onClick={() => navigate("/user/profile")}
          >
            <BiSolidUserCircle className="w-6 h-6 md:w-8 md:h-8 hover:text-orange-600" />{" "}
            Profile
          </div>
          </div>
        )}
      </div>

      <div className="flex md:hidden justify-center items-center gap-2">
        {!localStorage.getItem("authToken") ? (
          <a href="/login">
            <button className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg">
              SignIn
            </button>
          </a>
        ) : (
          <button
            className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg"
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
        <FaBars className="w-6 h-6" onClick={() => showDrawer()} />
      </div>

      <Drawer
        title="Menu"
        placement={"left"}
        closable={true}
        onClose={onClose}
        open={open}
        key={"menu"}
        width={"300px"}
      >
        <MobileNavBar
          menuItem={menuItem}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          onClick={onClose}
        />
      </Drawer>
    </div>
  );
};

export default Navbar;

const MobileNavBar = ({
  menuItem = [],
  selectedMenu = 0,
  setSelectedMenu = () => {},
  onClick = () => {},
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {menuItem.map((d, idx) => {
        return (
          <div
            key={idx}
            className="p-1 cursor-pointer relative flex center h-10 hover:bg-orange-100 rounded-md duration-700"
            onClick={() => {
              setSelectedMenu(idx);
              setTimeout(() => {
                navigate(d.nav);
              }, 500);
              onClick();
            }}
          >
            {d.title === "Profile" ? (
              <>
                {!localStorage.getItem("authToken") ? (
                  <></>
                ) : (
                  <>
                    {d.title}
                    {selectedMenu === idx && (
                      <motion.div
                        layoutId="underline_mobile_nav"
                        className={
                          "absolute top-0 right-0 rounded-md h-full  w-fit bg-orange-600 flex center  "
                        }
                      >
                        <RiArrowLeftSFill className="w-5 h-5" />
                      </motion.div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {d.title}
                {selectedMenu === idx && (
                  <motion.div
                    layoutId="underline_mobile_nav"
                    className={
                      "absolute top-0 right-0 rounded-md h-full  w-fit bg-orange-600 flex center  "
                    }
                  >
                    <RiArrowLeftSFill className="w-5 h-5" />
                  </motion.div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
