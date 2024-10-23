import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const ProfileAvatar = ({ url = "" ,onChange=()=>{} }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);

 
  useEffect(()=>{
    setImageUrl(url)
  },[url])
   

  const handleCustomRequest = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axiosInstance.post("/uploader/image", formData);
      onSuccess(res.data);
      setImageUrl(res.data.url)
      onChange(res.data.url)
      setLoading(false);
    } catch (err) {
      onError(err);
      console.log(err)
      message.error("Upload failed.");
      setLoading(false);
    }
  };


  const ProfileImgDeleteHandler = async () => {
    const  public_id  = extractProfilePath(imageUrl);
    setLoading(true);
    if(public_id)
    {
      try {
        const res = await axiosInstance.delete("/uploader/image", {
          data: { id: public_id },
        });
        if (res.status) {
          setImageUrl("");
          onChange("")
        } else {
          message.error("Failed to delete");
        }
      } catch (error) {
        message.error("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    }else{
      setImageUrl("")
      onChange("")
    }
    setLoading(false)
  };


  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
  };


  const uploadButton = (
    <div>
      {loading && !imageUrl ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {loading ? "Uploading profile" : "Upload Profile photo"}
      </div>
    </div>
  );

  function extractProfilePath(url) {
    const parts = url.split("/"); 
    const profilesIndex = parts.indexOf("profiles"); 
    
    if (profilesIndex !== -1 && parts[profilesIndex + 1]) {
      // Remove the file extension (if present)
      const profileId = parts[profilesIndex + 1].split(".")[0];
      return `profiles/${profileId}`; // Return the path without the extension
    }
    
    return null; 
  }

  return (
    <>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader font-outfit"
        showUploadList={false}
        customRequest={handleCustomRequest}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        disabled={loading}
        style={{ width: "100%", height: "100%" }}
      >
        {imageUrl ? (
          <div className="w-full h-full relative flex center">
            {loading && <LoadingOutlined className="absolute text-3xl" />}
            <img
              src={imageUrl || ""}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
      {imageUrl && (
        <MdDelete
          onClick={ProfileImgDeleteHandler}
          className={
            "absolute bottom-5 right-5 bg-orange-600 p-1 text-white rounded-full  text-2xl " +
            (loading ? "cursor-not-allowed" : "cursor-pointer")
          }
        />
      )}
    </>
  );
};

export default ProfileAvatar;
