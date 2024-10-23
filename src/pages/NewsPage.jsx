import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { capitalizeWords } from "../utils/CommonUtils";
import toast from "react-hot-toast";
const  newsAPIkey = import.meta.env.VITE_NEWS_API_KEY 

const NewsPage = () => {
  const newCategories = [
    "general",
    "business",
    "technology",
    "entertainment",
    "health",
    "science",
    "sports",
  ];
  const [selectedNewsCategory, setNewCategory] = useState(newCategories[0]);

  const handleNewsCategoryChange = (val) => {
    setNewCategory(val);
  };

  const getNews = async (category) => {
    const res = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=20&apiKey=${newsAPIkey}`
    );
    return res.data.articles;
  };

  const { data, isLoading, refetch, isFetching, isError, error } = useQuery({
    queryKey: ["News"],
    queryFn: () => getNews(selectedNewsCategory),
    refetchOnMount: false,
    staleTime: 500000,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [selectedNewsCategory]);

  console.log(isLoading, isFetching);

  if (isError) {
    const { message } = error;
    toast.error(message);
    return <></>;
  }

  return (
    <div className="w-full min-h-screen relative">
      <div className="w-full flex justify-between gap-2 items-center px-2 sticky top-0">
        <div className="flex flex-1  gap-3 overflow-x-auto">
          {newCategories.map((category, idx) => (
            <div
              onClick={() => handleNewsCategoryChange(category)}
              className={
                `px-4 py-1 flex-shrink-0 cursor-pointer border border-gray-600 rounded-full hover:!border-orange-600 ` +
                (selectedNewsCategory === category
                  ? "text-orange-600 border-orange-600"
                  : "")
              }
              key={idx}
            >
              {capitalizeWords(category)}
            </div>
          ))}
        </div>
        <button
          className="py-1 px-2 rounded-md bg-orange-600 text-white me-2"
          type="button"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>
      {isLoading || isFetching ? (
        <Loading />
      ) : (
        <div className="p-3 md:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4">
          {data?.map(
            (d) => d.title !== "[Removed]" && <NewsCard newdata={d} />
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;

const NewsCard = ({ newdata = {} }) => {
  const { urlToImage, title, description, url } = newdata;

  return (
    <div className="w-full sm:w-[90%] mx-auto md:w-full  bg-white primary-shadow flex items-start justify-between flex-shrink-0 rounded-md p-2 md:p-6 flex-col relative ">
      <div>
        <div className="rounded-lg overflow-hidden w-full h-[150px] md:h-[300px]">
          <img
            loading="lazy"
            className="w-full object-cover h-full "
            src={urlToImage}
            alt=""
          />
        </div>
        <h6 className="mt-2 font-semibold text-[1rem] md:text-xl">{title}</h6>
        <p className="mt-3 text-sm">Description : {description}</p>
      </div>
      <a
        href={url}
        target="_blank"
        className="w-[80%] mx-auto py-2 bg-orange-600 rounded-lg flex center hover:text-white "
      >
        Read More
      </a>
    </div>
  );
};
