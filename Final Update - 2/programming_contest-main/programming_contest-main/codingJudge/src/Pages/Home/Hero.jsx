// Importing necessary dependencies
import Container from "../../Layout/Container"; // Custom layout component for wrapping content
import hero_bg from "/hero-bg.jpg"; // Background image for the hero section
import { AiOutlinePlus } from "react-icons/ai"; // Importing the 'plus' icon from react-icons

const Hero = () => {
  return (
    <section>
      {/* Hero Section: Full height with background and overlay */}
      <div
        className="min-h-screen -mt-[68px] py-20 z-10" // Ensuring the hero section takes full screen height
        style={{
          // Uncommented background URL for an alternate background image
          // backgroundImage: 'url("https://themeforest.wprealizer.com/html-educoda-preview/educoda/assets/images/shape/hero.png")',
          background: `url(${hero_bg})`, // Background image of the hero section
          backgroundRepeat: "no-repeat", // Ensuring the background image does not repeat
          backgroundSize: "cover", // Covering the entire section with the background image
          backgroundPosition: "center", // Positioning the image at the center of the section
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Applying a semi-transparent black background color overlay
          backgroundBlendMode: "overlay", // Blending the overlay with the image
        }}
      >
        {/* Container that centers the content */}
        <Container>
          <div className="text-center">
            {" "}
            {/* Centering the text */}
            {/* Tagline at the top of the hero section */}
            <p className="text-lg md:text-2xl text-white mb-6 mt-20">
              Where skills are tested, and{" "}
              <span className="text-active-color font-semibold">champions</span>{" "}
              are made.
            </p>
            {/* Main heading with gradient text */}
            <h2 className="text-5xl md:text-6xl font-medium text-white w-5/6 mx-auto tracking-widest">
              <span className="bg-gradient-to-r from-white to-active-color text-transparent bg-clip-text">
                Code. Compete. Conquer. <br />
              </span>{" "}
              Join the ultimate programming challenge today!
            </h2>
            {/* Call-to-action button linking to the "flow" section */}
            <a
              href="#flow"
              className="btn normal-case mt-10 text-lg btn-lg btn-wide bg-active-color border-none text-black hover:bg-secondary-color hover:text-white duration-500"
            >
              Read More
              <AiOutlinePlus className="text-xl" />{" "}
              {/* Plus icon from react-icons */}
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
