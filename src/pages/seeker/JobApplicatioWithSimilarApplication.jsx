import React, { useState } from "react";
import MainContext from "../../components/MainContext";
import { FaCheckCircle } from "react-icons/fa";
import JobSuggestionCard from "../../components/JobSuggestionCard";
import { jobData } from "../../../assets/dummyDatas/Data";
import KeyHighlightsListItem from "../../components/KeyHighlightsListItem";
import { IoIosPeople, IoIosBriefcase } from "react-icons/io";
import { LiaRupeeSignSolid } from "react-icons/lia";
import ReadMore from "../../components/ReadMore";

const VerticalBar = () => {
  return <div className="w-0 h-5 border-r border-black"></div>;
};

const JobApplicatioWithSimilarApplication = () => {
  const [saved, setSaved] = useState(false);

  const handleSaveClick = () => {
    setSaved((prev) => !prev);
  };

  const description =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis ipsum, officia animi iste, porro quos totam quas officiis cupiditate quae et expedita debitis. Fugit dolores possimus sequi illo odio aut quos perferendis neque quod voluptatum, eaque consequuntur, quisquam impedit delectus vel, in nisi nostrum. Hic reiciendis neque iure aliquid voluptatibus ipsa maiores ipsum distinctio, totam esse nesciunt. Aut assumenda quos provident cum quidem blanditiis repellat. Labore aliquid doloribus repellendus, corporis minima totam sit corrupti, tempora aliquam id temporibus molestiae veritatis expedita consectetur a suscipit. Modi aut nisi sequi error temporibus eum, ipsam tempora qui voluptas quasi autem aspernatur magnam reiciendis.";

  return (
    <MainContext>
      <div className="w-full min-h-screen bg-gray-100 py-5 px-3 md:py-20 md:px-6 lg:px-10  !pb-2 ">
        <div className="bg-white p-1 flex justify-between md:gap-3 lg:gap-10 flex-col lg:flex-row">
          <div className="w-full  lg:w-[55%] job-apply-section">
            <div className="w-full rounded-xl  h-fit bg-white p-2 md:p-10 font-outfit relative">
              <img
                className="bg-red-500 absolute top-2 right-2 md:top-10 md:right-10 w-16 h-16 rounded-lg"
                src="https://vakilsearch.com/blog/wp-content/uploads/2022/06/What-is-meant-by-Pvt-Ltd-company_-.jpg"
              />
              <h1 className="text-[1.3rem] md:text-2xl font-semibold max-w-[80%] overflow-hidden text-ellipsis text-nowrap">
                React JS Developer{" "}
              </h1>
              <h3 className="font-light mt-5">Company Name</h3>
              <div className="flex gap-2 text-sm">
                <span className="flex center gap-1 text-sm ">
                  <IoIosBriefcase /> Salary
                </span>
                <VerticalBar />
                <span className="text-sm">Experinece</span>
              </div>
              <div className="mt-1 text-sm">
                <span>Vancancies 5</span>
              </div>
              <hr className="mt-3 mb-2" />
              <div className="flex justify-between items-center">
                <div>
                  <span className="flex center gap-1">
                    {" "}
                    <IoIosPeople /> Applicants : 22323
                  </span>
                </div>
                <div className="flex center gap-3">
                  <button className="btn-orange px-3 py-1 tracking-widest">
                    Apply
                  </button>
                  <button
                    className="btn-orange-outline px-3 py-1 flex center gap-1"
                    onClick={handleSaveClick}
                  >
                    {saved ? (
                      <>
                        <FaCheckCircle className="text-orange-600" />
                        Saved
                      </>
                    ) : (
                      <>Save</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-xl mt-8  h-fit bg-slate-50  p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                Key Highlights
              </h1>
              <div className="high-light-content font-outfit">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
                  praesentium eveniet ratione saepe aliquid illo exercitationem,
                  porro commodi ipsum asperiores omnis quisquam accusamus
                  distinctio ipsa, facere, nisi laudantium. Optio hic veritatis
                  quam recusandae reiciendis sequi deleniti voluptatibus magni
                  eos soluta error quae, provident assumenda est? Excepturi,
                  voluptas. Enim, eligendi, pariatur quos dolores ipsa quas
                  recusandae perferendis deserunt dolorem ratione molestiae
                  repellat aut iure ad numquam sed reprehenderit? Quam quia
                  maiores, deleniti aliquam dolore reiciendis minus molestiae
                  consequatur numquam. Nobis consequatur impedit cupiditate
                  dolorem, earum laudantium exercitationem delectus a enim saepe
                  soluta rem sequi fugiat nulla quos est corporis, nemo eveniet!
                </p>
                <ul className="mt-3">
                  <KeyHighlightsListItem
                    key={"1"}
                    title="Qualification"
                    value="B.E / B.Tech"
                  />
                  <KeyHighlightsListItem
                    key={"1-1"}
                    title="Skills"
                    value="Compueter Sci"
                  />
                  <KeyHighlightsListItem
                    key={"1-2"}
                    title="Type"
                    value="Full Time"
                  />
                  <KeyHighlightsListItem
                    key={"1-3"}
                    title="Qualification"
                    value="B.E / B.Tech"
                  />
                </ul>
              </div>
            </div>
            <div className="w-full rounded-xl mt-8  h-fit bg-white p-2 md:p-10">
              <h1 className="text-xl md:text-2xl font-semibold mb-4">
                About Company
              </h1>
              <p className="font-outfit">
                <ReadMore content={description} maxLength={550}/>
              </p>
            </div>
          </div>
          <div className="w-full  lg:w-[45%] mt-5 md:mt-0 flex-1 flex flex-col gap-2  h-fit job-apply-suggestion-section bg-white rounded-lg p-2 md:p-5">
            <h1 className="text-xl md:text-2xl font-outfit text-orange-600">
              Similar jobs you might like :
            </h1>
            {jobData.map((data) => (
              <JobSuggestionCard data={data} key={data.id} />
            ))}
          </div>
        </div>
      </div>
    </MainContext>
  );
};

export default JobApplicatioWithSimilarApplication;
