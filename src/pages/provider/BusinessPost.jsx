import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Upload } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { IoMdClose } from 'react-icons/io';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import { axiosInstance } from "../../utils/axiosInstance";

const BusinessCardPost = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitBusinessCard = async (formData) => {
    const response = await axios.post('', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: submitBusinessCard,
    onSuccess: () => {
      message.success('Business card posted successfully!');
      navigate('/provider');
    },
    onError: () => {
      message.error("Something went wrong. Please try again.");
    },
  });

  const handleTagInputChange = (e) => {
    setInputTag(e.target.value);
  };

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag("");
    }
  };

  const handleDeleteTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !image) {
      message.error("Please fill in all fields and upload an image.");
      return;
    }

    const formData = {
      title,
      description,
      tags,
      image,
    };

    mutation.mutate(formData);
  };

  const handleImageChange = async (options) => {
    const { file, onSuccess, onError } = options;

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return onError(new Error('Invalid file type'));
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return onError(new Error('File too large'));
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await axiosInstance.post("/uploader/image", {
          image: reader.result
        });
        setImage(res.data.url);
        onSuccess(res.data);
      } catch (err) {
        onError(err);
        message.error("Upload failed.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const ProfileImgDeleteHandler = async () => {
    if (image) {
      setLoading(true);
      try {
        const public_id = extractProfilePath(image);
        if (public_id) {
          const res = await axiosInstance.delete("/uploader/image", {
            data: { id: public_id },
          });
          if (res.status) {
            setImage(null);
          } else {
            message.error("Failed to delete");
          }
        } else {
          setImage(null);
        }
      } catch (error) {
        message.error("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  function extractProfilePath(url) {
    const parts = url.split("/");
    const profilesIndex = parts.indexOf("profiles");
    if (profilesIndex !== -1 && parts[profilesIndex + 1]) {
      const profileId = parts[profilesIndex + 1].split(".")[0];
      return `profiles/${profileId}`;
    }
    return null;
  }

  return (
    <div className="w-full mx-auto min-h-screen bg-gray-100 py-5 px -3 flex flex-col gap-10">
      <form onSubmit={handleSubmit} className="w-full lg:w-[55%] mx-auto bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Post a Business Card</h1>

        {/* Image Upload */}
        <div className="mb-4 relative">
          <div
            className="border-dotted border-2 border-gray-300 w-full h-full p-4 rounded-lg flex justify-center items-center"
          >
            <Upload
              name="avatar"
              listType="picture"
              className="avatar-uploader font-outfit"
              showUploadList={false}
              customRequest={handleImageChange}
              beforeUpload={(file) => beforeUpload(file)}
              onChange={(info) => {
                if (info.file.status === "uploading") {
                  setLoading(true);
                  return;
                }
              }}
              disabled={loading}
              style={{ width: "100%", height: "100%" }}
            >
              {image ? (
                <div className="w-full h-full relative flex center">
                  {loading && <LoadingOutlined className="absolute text-3xl" />}
                  <img
                    src={image || ""}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>
                    {loading ? "Uploading profile" : "Upload Profile photo"}
                  </div>
                </div>
              )}
            </Upload>
          </div>
          {image && (
            <MdDelete
              onClick={ProfileImgDeleteHandler}
              className={
                "absolute bottom-5 right-5 bg-orange-600 p-1 text-white rounded-full  text-2xl " +
                (loading ? "cursor-not-allowed" : "cursor-pointer")
              }
            />
          )}
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
          required
        />

        {/* Description Input */}
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-lg p-2 w-full mb-4"
          rows="4"
          required
        />

        {/* Tags Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Add a tag"
            value={inputTag}
            onChange={handleTagInputChange}
            className="border rounded-lg p-2 w-full mb-2"
          />
          <button 
            type="button" 
            onClick={handleAddTag} 
            className="btn-orange-outline p-2"
          > 
            Add Tag 
          </button>
          <div className="flex flex-wrap mt-2">
            {tags.map((tag) => {
                const formattedTag = tag.startsWith("#") ? tag : `#${tag}`;
                
                return (
                <span key={tag} className="bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2 flex items-center">
                    {formattedTag}
                    <IoMdClose
                    className="cursor-pointer ml-1"
                    onClick={() => handleDeleteTag(tag)}
                    />
                </span>
                );
            })}
            </div>
        </div>

        <button type="submit" className="btn-orange flex center mx-auto w-1/2 p-2 rounded-lg">
          Post Business Card
        </button>
      </form >
    </div>
  );
};

export default BusinessCardPost;