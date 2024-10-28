import React, { useState } from "react";
import { PiSealCheckFill } from "react-icons/pi";
import { BiSolidUserCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import { ConfigProvider, Drawer, Modal } from "antd";
import { RiArrowLeftSFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Navbar = () => {
  const menuItem = [
    { title: "Home", nav: "/user", label: "home" },
    { title: "News", nav: "/user/news", label: "news" },
    { title: "Profile", nav: "/user/profile", label: "profile" },
  ];
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [open, setOpen] = useState(false); //for drawer
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full h-20 p-5 px-2 md:px-7 lg:px-10 flex justify-between items-center sticky top-0 left-0 z-50 bg-white overflow-hidden">
      <div
        className="center gap-1 cursor-pointer"
        onClick={() => navigate("/user")}
      >
        <PiSealCheckFill className="text-2xl text-orange-500" />
        <span className="font-bold text-2xl md:text-3xl">
          <span className="font-emploez text-orange-600">Emploez</span>
          <span>.in</span>
        </span>
      </div>

      <div className="justify-center items-center gap-1 hidden md:flex ">
        {menuItem.map(
          (d, idx) =>
            d.title !== "Profile" && (
              <div
                key={idx}
                className="p-1 cursor-pointer relative flex center "
                onClick={() => {
                  setSelectedMenu(d.label);
                  navigate(d.nav);
                }}
              >
                {d.title}
                {selectedMenu === d.label && (
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
                // localStorage.removeItem("authToken");
                // navigate("/login");
                setLogoutModalOpen(true);
              }}
            >
              Logout
            </button>
            <div
              className={
                "flex center gap-1 text-[1rem] cursor-pointer p-1 primary-shadow rounded-md " +
                (selectedMenu === "profile" ? " text-orange-600" : "")
              }
              onClick={() => {
                navigate("/user/profile");
                setSelectedMenu("profile");
              }}
            >
              <BiSolidUserCircle className="w-6 h-6 md:w-8 md:h-8 hover:text-orange-600" />
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
            className="bg-white shadow-sm shadow-black px-3 py-[1px] rounded-lg"
            onClick={() => {
              setLogoutModalOpen(true);
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

      {/* logout confirm modal */}

      <Modal
        title="Comfirm Logout"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={
          <div className="flex justify-end items-start gap-2">
            <button
              className="border border-orange-600 rounded-lg px-1"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="border bg-orange-600 text-white rounded-lg px-1"
              onClick={() => {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("location");
                toast.success("Logout Successfully!!");
                navigate("/login");
              }}
            >
              OK
            </button>
          </div>
        }
      >
        Are you sure want to logout ?
      </Modal>
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
        if (d.title !== "Profile") {
          return (
            <div
              key={idx}
              className="p-1 cursor-pointer relative flex center h-10 hover:bg-orange-100 rounded-md duration-700"
              onClick={() => {
                setSelectedMenu(d.label);
                setTimeout(() => {
                  navigate(d.nav);
                }, 500);
                onClick();
              }}
            >
              {d.title}
              {selectedMenu === d.label && (
                <motion.div
                  layoutId="underline_mobile_nav"
                  className={
                    "absolute top-0 right-0 rounded-md h-full  w-fit bg-orange-600 flex center  "
                  }
                >
                  <RiArrowLeftSFill className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          );
        } else {
          {
            if (!localStorage.getItem("authToken")) {
              return <></>;
            } else {
              return (
                <div
                  key={idx}
                  className="p-1 cursor-pointer relative flex center h-10 hover:bg-orange-100 rounded-md duration-700"
                  onClick={() => {
                    setSelectedMenu(d.label);
                    setTimeout(() => {
                      navigate(d.nav);
                    }, 500);
                    onClick();
                  }}
                >
                  {d.title}
                  {selectedMenu === d.label && (
                    <motion.div
                      layoutId="underline_mobile_nav"
                      className={
                        "absolute top-0 right-0 rounded-md h-full  w-fit bg-orange-600 flex center  "
                      }
                    >
                      <RiArrowLeftSFill className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>
              );
            }
          }
        }
      })}
    </div>
  );
};
