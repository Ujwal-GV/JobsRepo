import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";

function OptionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (role) => {
    setLoading(true);
    if (role === "freelancer") {
      navigate("/freelancer");
    } else if (role === "jobPoster") {
      navigate("/provider/post-job");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Formik
        initialValues={{ selectedRole: "" }}
        onSubmit={() => {}}
      >
        {({ isValid }) => (
          <Form className="bg-white w-[90%] md:w-[400px] shadow-lg shadow-black rounded-lg p-2 px-4 md:px-6">
            <div className="mt-4 flex justify-center items-center">
              <span className="text-2xl md:text-2xl font-bold">Choose an Option</span>
            </div>
            <hr className="m-4" />
            <div className="mb-6 flex flex-col items-center gap-4">
              <button
                type="button"
                className={"mb-4 flex mx-auto w-[80%] p-3 bg-black text-white rounded-lg text-base center" + 
                  (loading ? "cursor-not-allowed" : "")}
                disabled={loading}
                onClick={() => handleOptionSelect("freelancer")}
              >
                {loading ? "Loading..." : "I am a Freelancer"}
              </button>
              <button
                type="button"
                className={"mb-4 flex mx-auto w-[80%] p-3 bg-black text-white rounded-lg text-base center" + 
                  (loading ? "cursor-not-allowed" : "")}
                disabled={loading}
                onClick={() => handleOptionSelect("jobPoster")}
              >
                {loading ? "Loading..." : "I want to Post a Job"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default OptionPage;
