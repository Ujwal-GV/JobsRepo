import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import axios from "axios";
import { MdDelete } from "react-icons/md";

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

const ProfileAvatar = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadFileData,setUploadFileData] = useState(null);

  const handleCustomRequest = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:5001/uploader/upload",
        formData,
      );
      onSuccess(res.data);
     setUploadFileData(res.data);
      getBase64(file, (url) => setImageUrl(url));
      setLoading(false);
    } catch (err) {
      onError(err);
      message.error("Upload failed.");
      setLoading(false);
    }
  };

  const ProfileImgDeleteHandler = async () => {
    const {public_id} = uploadFileData;
    setLoading(true)
    try {
        const res= await axios.delete("http://localhost:5001/uploader/delete",{data:{"id":public_id}});
        if(res.success)
        {
            alert("done");
            setImageUrl(null)
        }else{
            message.error("Failed to delete");
        }
    } catch (error) {
        message.error("Something Went Wrong");
    }
    finally{
        setLoading(false)
    }
    
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
      <div style={{ marginTop: 8 }}>{loading ? "Uploading profile" :"Upload Profile photo"}</div>
    </div>
  );

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
            {
                loading && <LoadingOutlined  className="absolute text-3xl"/>
            }
            <img
              src={imageUrl}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
      {imageUrl && (
          <MdDelete  onClick={ProfileImgDeleteHandler} className={"absolute bottom-5 right-5 bg-orange-600 p-1 text-white rounded-full  text-2xl " + (loading ? "cursor-not-allowed" :"cursor-pointer")} />
      )}
    </>
  );
};

export default ProfileAvatar;
