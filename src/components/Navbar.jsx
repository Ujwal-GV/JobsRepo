import React, { useContext, useEffect, useState } from "react";
import { PiSealCheckFill } from "react-icons/pi";
import { BiSolidUserCircle } from "react-icons/bi";
import { motion } from "framer-motion";
import { ConfigProvider, Drawer, Dropdown, Menu, Modal } from "antd";
import { RiArrowLeftSFill } from "react-icons/ri";
import { FaBars, FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CiLogout } from "react-icons/ci";
import { LuLoader2 } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const queryClient = useQueryClient();

  const menuItem = [
    { title: "Home", nav: "/", label: "home" },
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
      <div className="lg:-ml-[4rem] -ml-8 center cursor-pointer" onClick={() => navigate("/")}>
        {/* <img src={`${import.meta.env.BASE_URL}/EmploezLogo.png`} alt="Logo" /> */}
        <img src="/EmploezLogo.png" alt="Logo" className="text-sm ml-0 lg:w-[8rem] w-[6rem]" />
        <span className="-ml-[1rem] mt-1 font-bold text-2xl md:text-3xl">
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
            <a href="/user/signup">
              <button className="btn-dark px-3 py-1 rounded-lg hidden md:flex">
                SignUp
              </button>
            </a>
            <a href="/user/login">
              <button className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg">
                SignIn
              </button>{" "}
            </a>
          </>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <Notification />
            <button
              className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg flex center"
              onClick={() => {
                setLogoutModalOpen(true);
              }}
            >
              <span className="flex center ">Logout</span>
              <CiLogout className="flex" />
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
          <a href="/user/login">
            <button className="bg-white shadow-sm shadow-black px-3 py-1 rounded-lg">
              SignIn
            </button>
          </a>
        ) : (
          <>
            <button
              className="bg-white shadow-sm shadow-black px-1 py-[2px] rounded-lg flex center"
              onClick={() => {
                setLogoutModalOpen(true);
              }}
            >
              <CiLogout className="flex text-[1rem] sm:text-[1.1rem] " />
            </button>
          </>
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
                queryClient.clear();
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("location");
                toast.success("Logout Successfully!!");
              navigate("/user/login",{ replace: true });
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

const Notification = () => {
  const { profileData } = useContext(AuthContext);

  const [openNotification, setOpenNotiication] = useState(false);
  const [unRead, setUnread] = useState(0);
  const [user_id, setuser_id] = useState(null);
  const [notifications, setNotitifcations] = useState([]);

  // Dummy delay to simulate data loading (useEffect to clear loader)

  useEffect(() => {
    if (profileData && profileData != null) {
      setuser_id(profileData?.user_id);
    }
  }, [profileData]);

  const notificationLoader = () => (
    <div className="w-[400px] h-[300px] flex justify-center items-center">
      <LuLoader2 className="animate-spin-slow" />
    </div>
  );

  const fetchNotification = async () => {
    const res = await axiosInstance.get("/notifications", {
      params: { receiver_id: user_id },
    });
    const sortedData = res.data?.sort((a, b) => {
      return a.read === b.read ? 0 : a.read ? 1 : -1;
    });
    const unreadCount = res.data?.reduce((count, noti) => {
      return noti?.read === false ? count + 1 : count;
    }, 0);

    setUnread(unreadCount);
    setNotitifcations(sortedData);
    return sortedData;
  };

  const { isLoading, isFetching, data, isSuccess } = useQuery({
    queryKey: ["notifications", user_id],
    queryFn: fetchNotification,
    staleTime: 5 * 60 * 1000,
    gcTime: Infinity,
    enabled: user_id !== null ? true : false,
  });

  const handleNotificationSort = ({
    notification_id,
    readNotification = false,
    deleteNotitification = false,
  }) => {
    let modifyNotifications = [];

    if (readNotification) {
      modifyNotifications = notifications.map((noti) => {
        if (noti.notification_id !== notification_id) {
          return noti;
        } else {
          const readedNotification = { ...noti, read: true };
          return readedNotification;
        }
      });
    }
    if (deleteNotitification) {
      modifyNotifications = notifications?.filter(
        (noti) => noti?.notification_id !== notification_id
      );
    }
    const sortedData = modifyNotifications?.sort((a, b) => {
      return a.read === b.read ? 0 : a.read ? 1 : -1;
    });

    const unreadCount = sortedData?.reduce((count, noti) => {
      return noti?.read === false ? count + 1 : count;
    }, 0);

    setUnread(unreadCount);

    setNotitifcations((prev) => [...sortedData]);
  };

  // Dropdown menu render
  const dropdownMenu = (
    <div className="w-[280px] md:w-[400px] h-fit max-h-[400px] custom-scroll-nowidth overflow-y-auto bg-white border border-gray-300 rounded-xl ">
      {isLoading || isFetching ? (
        notificationLoader()
      ) : (
        <Menu>
          {notifications?.length === 0 ? (
            <>
              <Menu.Item key={"NoNotification"}>
                <div className="p-4 text-gray-500 text-[0.9rem]  w-full h-[380px] flex center">
                  No Notification
                </div>
              </Menu.Item>
            </>
          ) : (
            notifications?.map((item) => (
              <NotificationCard
                item={item}
                key={item.notification_id}
                onRead={handleNotificationSort}
              />
            ))
          )}
        </Menu>
      )}
    </div>
  );

  return (
    <Dropdown
      className="cursor-pointer me-2"
      open={openNotification}
      dropdownRender={() => dropdownMenu}
      trigger={["click"]}
      placement="top"
      onOpenChange={(val) => setOpenNotiication(val)}
    >
      <a onClick={(e) => setOpenNotiication(true)}>
        <span className="relative flex center">
          <span className="absolute -top-2 -right-2">
            {isLoading || isFetching ? (
              <NotificationBadge
                text={"..."}
                bgcolor="white"
                text_color="red"
              />
            ) : (
              unRead !== 0 && (
                <NotificationBadge
                  text={unRead}
                  bgcolor="white"
                  text_color="red"
                />
              )
            )}
          </span>
          <FaBell className="text-[1rem] sm:text-[1.2rem]" />
        </span>
      </a>
    </Dropdown>
  );
};

const NotificationBadge = ({
  text = "",
  bg_color = "white",
  text_color = "black",
}) => {
  return (
    <div className="w-[17px] h-[17px] bg-white rounded-full relative">
      <div
        className="w-full h-full absolute top-0 left-0 rounded-full text-[0.7rem] bg-red-600 flex center"
        style={{
          backgroundColor: bg_color,
          color: text_color,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: text_color,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const NotificationCard = ({ item, onRead = () => {} }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(item);

  const markAsRead = async () => {
    const res = await axiosInstance.put("/notifications/read", {
      notification_id: data?.notification_id,
    });
    return res.data;
  };

  const readMutation = useMutation({
    mutationFn: () => markAsRead(),
    mutationKey: ["read-notification", data?.notification_id],
    onSuccess: () => {
      // handleMarkAsRead();
      onRead({
        notification_id: data?.notification_id,
        readNotification: true,
      });
    },
    onError: (error) => {
      toast.error("Something Went Wrong");
    },
  });

  const deleteNotitification = async () => {
    const res = await axiosInstance.delete("/notifications", {
      params: {
        notification_id: data?.notification_id,
      },
    });
    return res.data;
  };

  const deleteMutation = useMutation({
    mutationFn: () => deleteNotitification(),
    mutationKey: ["delete-notification", data?.notification_id],
    onSuccess: () => {
      // handleMarkAsRead();
      onRead({
        notification_id: data?.notification_id,
        deleteNotitification: true,
      });
    },
    onError: (error) => {
      toast.error("Something Went Wrong");
    },
  });

  const formatDateOrDaysDifference = (dateString) => {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    // Normalize dates to only consider the date part (ignoring time)
    const inputDateString = inputDate.toISOString().split("T")[0];
    const currentDateString = currentDate.toISOString().split("T")[0];

    // Calculate difference in milliseconds
    const differenceInTime = currentDate - inputDate;
    const differenceInDays = Math.floor(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    // Check if the input date is today
    if (inputDateString === currentDateString) {
      const differenceInMinutes = Math.floor(differenceInTime / (1000 * 60));
      if (differenceInMinutes === 0) {
        return "Just now";
      } else if (differenceInMinutes === 1) {
        return "1 minute ago";
      } else {
        return `${differenceInMinutes} minutes ago`;
      }
    }
    // Check if the input date is yesterday
    else if (differenceInDays === 1) {
      return "Yesterday";
    }
    // If within 10 days
    else if (differenceInDays <= 10) {
      return `${differenceInDays} day(s) ago`;
    }
    // If more than 10 days
    else {
      const day = String(inputDate.getDate()).padStart(2, "0");
      const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = String(inputDate.getFullYear()).slice(-2); // Get last two digits of the year
      return `${day}/${month}/${year}`;
    }
  };

  return (
    <Menu.Item key={data?.createdAt} className="!p-[2px] md:!p-2">
      <div
        className="p-1 md:px-4 md:py-1  border-b border-gray-200 w-full relative bg-white rounded-lg"
        onClick={(e) => {
          // e.stopPropagation();
          readMutation.mutate();
          if (data?.navigate_link) {
            navigate(data?.navigate_link);
          }
        }}
      >
        <span className="text-gray-400 text-[0.6rem] absolute top-1 right-1">
          {formatDateOrDaysDifference(data?.createdAt)}
        </span>
        <div className="flex justify-start items-center gap-2">
          <img src={data?.img} alt="noti" className="w-[15px] h-full" />
          <h4 className="text-lg font-medium mb-0 !text-[0.8rem] md:!text-[0.95rem]">
            {data?.title}
          </h4>
        </div>
        <p className="text-gray-600 text-[0.67rem] md:text-[0.9rem]">
          {data?.description?.length > 50
            ? new String(data?.description).substring(0, 50) + "..."
            : data?.description}
        </p>
        <div className="w-full flex justify-end items-center gap-2">
          {!data?.read && (
            <button
              className="text-[0.7rem] md:text-[0.8rem] bg-white text-orange-600 border-none hover:text-orange-700 rounded-lg flex center gap-[2px]"
              onClick={(e) => {
                e.stopPropagation();
                readMutation.mutate();
              }}
            >
              Mark as read{" "}
              {readMutation.isPending ? (
                <LuLoader2 className="animate-spin-slow" />
              ) : (
                <></>
              )}
            </button>
          )}
          <button
            className="text-[0.7rem] md:text-[0.8rem] bg-white text-orange-700 border-none hover:text-orange-700 rounded-lg flex center gap-[2px]"
            onClick={(e) => {
              e.stopPropagation();
              deleteMutation.mutate();
            }}
          >
            Delete
            {deleteMutation.isPending ? (
              <LuLoader2 className="animate-spin-slow" />
            ) : (
              <></>
            )}
          </button>
        </div>
      </div>
    </Menu.Item>
  );
};
