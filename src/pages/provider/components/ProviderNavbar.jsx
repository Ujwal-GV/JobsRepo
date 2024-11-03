import React, { useEffect, useState } from "react";
import { PiSealCheckFill } from "react-icons/pi";
import { BiSolidUserCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import { ConfigProvider, Drawer, Modal } from "antd";
import { RiArrowLeftSFill } from "react-icons/ri";
import { FaBars } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";

const ProviderNavbar = () => {
  const menuItem = [
    { title: "Home", nav: "/provider", label: "home" },
    { title: "Post Job", nav: "/provider/post-job", label: "postJob" },
    { title: "Profile", nav: "/provider/profile", label: "profile" },
  ];
  const [selectedMenu, setSelectedMenu] = useState(
    sessionStorage.getItem("location") || "home"
  );
  const [open, setOpen] = useState(false); //for drawer
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const authToken = localStorage.getItem("authToken");

  const navigate = useNavigate();
  const location = useLocation();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleNavigate = (nav, label) => {
    sessionStorage.setItem("location", label);
    // console.log("Set location in sessionStorage:", label);
    setSelectedMenu(label);
    navigate(nav);
  };

  useEffect (() => {
    const lastLocation = sessionStorage.getItem("location") || "home";
    // console.log("Initial location from sessionStorage:", lastLocation);
    setSelectedMenu(lastLocation);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItem.find((item) => item.nav === currentPath);
    if(currentMenuItem) {
      setSelectedMenu(currentMenuItem.label);
    } else {
      setSelectedMenu(null);
    }
  }, [location.pathname]);

  return (
    <div className="w-full h-20 p-5 px-2 md:px-7 lg:px-10 flex justify-between items-center sticky top-0 left-0 z-50 bg-white overflow-hidden">
      <div className="lg:-ml-[4rem] -ml-8 center cursor-pointer" onClick={() => navigate("/provider")}>
        {/* <img src={`${import.meta.env.BASE_URL}/EmploezLogo.png`} alt="Logo" /> */}
        <img src="/EmploezLogo.png" alt="Logo" className="text-sm ml-0 lg:w-[8rem] w-[6rem]" />
        <span className="-ml-[1rem] mt-1 font-bold text-2xl md:text-3xl">
          <span className="font-emploez text-orange-600">Emploez</span>
          <span>.in</span>
        </span>
      </div>

      {/* <div className="center gap-1 cursor-pointer" onClick={() => navigate("/provider")}>
        <PiSealCheckFill className="text-2xl text-orange-500" />
        <span className="font-bold text-2xl md:text-3xl">
          <span className="font-emploez text-orange-600">Emploez</span>
          <span>.in</span>
        </span>
      </div> */}

        <div className="flex justify-center items-center gap-2 p-1 hidden md:flex bg-black rounded-full text-white relative">
        {authToken ? (
            menuItem.map((d, idx) => (
            <motion.div
                key={idx}
                  className={`cursor-pointer titleBg px-4 py-2 relative rounded-full ${
                  selectedMenu === d.label ? "bg-black shadow-lg" : ""
                }`}
                onClick={() => {
                  // console.log(d.nav, d.label);
                  handleNavigate(d.nav, d.label);
                }}
            >
                <span
                className={`titleNav transition-opacity duration-300 relative z-10 ${
                    selectedMenu === d.label ? "text-black opacity-100" : "opacity-70"
                }`}
                >
                {d.title}
                </span>
                <AnimatePresence>
                {selectedMenu === d.label && (
                    <motion.div
                    layoutId="underline"
                    className="absolute inset-0 bg-white rounded-full shadow-md z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    />
                )}
                </AnimatePresence>
            </motion.div>
            ))
        ) : (
            <div className="flex gap-2">
            {/* Sign In Button */}
              <div className="relative cursor-pointer">
                <button
                  className="px-4 py-2 bg-white text-black rounded-full relative overflow-hidden"
                  onClick={() => navigate("/login")}
                >
                  <span className="titleNav transition-opacity duration-300 relative z-10 opacity-100">Sign In</span>
                </button>
              </div>
              
              {/* Sign Up Button */}
              <div className="relative cursor-pointer">
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded-full relative overflow-hidden"
                  onClick={() => navigate("/signup")}
                >
                  <span className="titleNav transition-opacity duration-300 relative z-10 opacity-100">Sign Up</span>
                </button>
              </div>
            </div>
        )}
        </div>

        <div className="flex justify-center items-center gap-2">
        {authToken && (
          <button
            className="px-4 py-2 bg-black text-white rounded-full relative overflow-hidden"
            onClick={() => {
              setLogoutModalOpen(true);
            }}
          >
            Logout
          </button>
        )}
        <FaBars className="md:hidden w-6 h-6" onClick={() => showDrawer()} />
      </div>

      {/* Logout Button */}
      {/* {authToken && (
        <button
        className="px-4 py-2 bg-black text-white rounded-full relative overflow-hidden"
          onClick={() => setLogoutModalOpen(true)}
        >
          Logout
        </button>
      )} */}

      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={onClose}
        open={open}
        key="menu"
        width={"300px"}
      >
        <MobileNavBar
          menuItem={menuItem}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          onClick={onClose}
          authToken={authToken}
        />
      </Drawer>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={
          <div className="flex justify-end items-start gap-2">
            <button
              className="border border-black rounded-lg px-2 py-1"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="border bg-black text-white rounded-lg px-2 py-1"
              onClick={() => {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("location");
                toast.success("Logout Successful!");
                navigate("/login");
              }}
            >
              OK
            </button>
          </div>
        }
      >
        Are you sure you want to logout?
      </Modal>
    </div>
  );
};

export default ProviderNavbar;

const MobileNavBar = ({
  menuItem = [],
  selectedMenu = 0,
  setSelectedMenu = () => {},
  onClick = () => {},
}) => {
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");

  return (
    <div className="w-full">
      {menuItem.map((d, idx) => {
         if (
          (
            d.title === "Logout" 
            || d.title == "Post Job" 
            || d.title == "Profile") 
            && !authToken) 
            return null;
            
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
            {d.title === "Profile" ? (
              <>
                {!authToken ? (
                  <></>
                ) : (
                  <>
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
                  </>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        );
      })}
      {/* Show SignIn if no token is present */}
      {!authToken && (
        <div
          className="p-1 cursor-pointer relative flex center h-10 hover:bg-orange-100 rounded-md duration-700"
          onClick={() => {
            setSelectedMenu(null);
            navigate("/login");
            onClick();
          }}
        >
          Sign In
        </div>
      )}
    </div>
  );
};
