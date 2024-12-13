// Import necessary dependencies
import { useState } from "react"; // React hook to manage state
import Container from "../../Layout/Container"; // Layout component to wrap the content

const Faq = () => {
  // State to toggle between open and closed FAQ sections
  const [open, setOpen] = useState(false);

  // Function to handle the opening and closing of FAQ sections
  const handleFAQ = (id) => {
    setOpen(!open); // Toggle the open state
    const element = document.getElementById(id); // Get the HTML element by its id
    if (open) {
      // If the section is open, close it by removing 'collapse-open' and adding 'collapse-close'
      element.classList.remove("collapse-open");
      element.classList.add("collapse-close");
    } else {
      // If the section is closed, open it by removing 'collapse-close' and adding 'collapse-open'
      element.classList.remove("collapse-close");
      element.classList.add("collapse-open");
    }
  };

  return (
    <div className="bg-white py-20"> {/* Container for the whole FAQ section */}
      <Container> {/* Wrap the content inside a layout container */}
        <section>
          {/* Section for FAQ header */}
          <div className="text-center mb-10 space-y-4">
            <p className="tracking-widest font-bold text-secondary-color">
              OUR FAQ
            </p>
            <h2 className="text-4xl text-active-color font-semibold">
              Frequency And Questions
            </h2>
          </div>

          {/* FAQ content area with two columns: one for questions and one for image */}
          <div className="flex flex-col-reverse lg:flex-row gap-10 items-center">
            <div className="lg:w-1/2">
              {/* Each FAQ item is represented by a collapsible section */}
              {/** The structure for each FAQ item is similar */}
              <div
                id="accordion1"
                className="collapse collapse-arrow cursor-pointer" // Tailwind CSS classes for styling and collapse behavior
                onClick={() => handleFAQ("accordion1")} // Trigger handleFAQ on click
              >
                {/* Input radio button for toggle functionality (useful for accordion behavior) */}
                <input
                  className="cursor-pointer"
                  type="radio"
                  name="my-accordion" // Group all radios in the same accordion
                />
                {/* FAQ question title */}
                <div className="collapse-title text-xl font-medium text-black">
                  What is the purpose of this website?
                </div>
                {/* FAQ answer content, collapsible */}
                <div className="collapse-content">
                  <p className="text-gray-700">
                    This website is an online platform where coders from around
                    the world compete in programming challenges to test and
                    improve their skills.
                  </p>
                </div>
              </div>

              {/* Repeat the same structure for other FAQ items */}
              <div
                id="accordion2"
                className="collapse collapse-arrow cursor-pointer"
                onClick={() => handleFAQ("accordion2")}
              >
                <input
                  className="cursor-pointer"
                  type="radio"
                  name="my-accordion"
                />
                <div className="collapse-title text-xl font-medium text-black">
                  How do I participate in a contest?
                </div>
                <div className="collapse-content">
                  <p className="text-gray-700">
                    Simply log in, navigate to the &#34;Contests&#34; section, and
                    register for any ongoing or upcoming contest.
                  </p>
                </div>
              </div>

              <div
                id="accordion3"
                className="collapse collapse-arrow cursor-pointer"
                onClick={() => handleFAQ("accordion3")}
              >
                <input
                  className="cursor-pointer"
                  type="radio"
                  name="my-accordion"
                />
                <div className="collapse-title text-xl font-medium text-black">
                  What programming languages are supported?
                </div>
                <div className="collapse-content">
                  <p className="text-gray-700">
                    We support popular languages like Python, JavaScript, Java,
                    C++, and more.
                  </p>
                </div>
              </div>

              {/* Additional FAQ items */}
              <div
                id="accordion4"
                className="collapse collapse-arrow cursor-pointer"
                onClick={() => handleFAQ("accordion4")}
              >
                <input
                  className="cursor-pointer"
                  type="radio"
                  name="my-accordion"
                />
                <div className="collapse-title text-xl font-medium text-black">
                  Can I participate in multiple contests?
                </div>
                <div className="collapse-content">
                  <p className="text-gray-700">
                    Absolutely! You can join as many contests as you&#39;d like.
                  </p>
                </div>
              </div>

              <div
                id="accordion5"
                className="collapse collapse-arrow cursor-pointer"
                onClick={() => handleFAQ("accordion5")}
              >
                <input
                  className="cursor-pointer"
                  type="radio"
                  name="my-accordion"
                />
                <div className="collapse-title text-xl font-medium text-black">
                  How do I submit my code?
                </div>
                <div className="collapse-content">
                  <p className="text-gray-700">
                    Use the built-in code editor to write your solution, then
                    click &#34;Submit&#34; to run and evaluate your code.
                  </p>
                </div>
              </div>

              <div
                id="accordion6"
                className="collapse collapse-arrow cursor-pointer"
                onClick={() => handleFAQ("accordion6")}
              >
                <input
                  className="cursor-pointer"
                  type="radio"
                  name="my-accordion"
                />
                <div className="collapse-title text-xl font-medium text-black">
                  How is the leaderboard calculated?
                </div>
                <div className="collapse-content">
                  <p className="text-gray-700">
                    Points are awarded based on problem difficulty, accuracy,
                    and submission time. The leaderboard reflects the top
                    performers.
                  </p>
                </div>
              </div>
            </div>

            {/* Image section */}
            <div className="lg:w-1/2">
              <img
                className="w-full"
                src="https://themeforest.wprealizer.com/html-educoda-preview/educoda/assets/images/faq-img.png"
                alt="FAQ illustration"
              />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Faq;
