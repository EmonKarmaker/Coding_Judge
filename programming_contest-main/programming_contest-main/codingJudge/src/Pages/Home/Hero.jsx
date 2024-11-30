import Container from "../../Layout/Container";
import hero_bg from "../../../public/hero-bg.jpg";
import { AiOutlinePlus } from "react-icons/ai";

const Hero = () => {
  return (
    <section>
      <div
        className="min-h-screen -mt-[68px] py-20 z-10"
        style={{
          // backgroundImage:
          // 'url("https://themeforest.wprealizer.com/html-educoda-preview/educoda/assets/images/shape/hero.png")',
          background: `url(${hero_bg})
          
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "overlay",
        }}
      >
        <Container>
          <div className="text-center">
            <p className="text-lg md:text-2xl text-white mb-6 mt-20">
              Where skills are tested, and{" "}
              <span className="text-active-color font-semibold">champions</span>{" "}
              are made.
            </p>
            <h2 className="text-5xl md:text-6xl font-medium text-white w-5/6 mx-auto tracking-widest">
              <span className="bg-gradient-to-r from-white to-active-color text-transparent bg-clip-text">
                Code. Compete. Conquer. <br />
              </span>{" "}
              Join the ultimate programming challenge today!
            </h2>
            <a href="#flow" className="btn normal-case mt-10 text-lg btn-lg btn-wide bg-secondary-color border-none text-white hover:bg-active-color hover:text-black duration-500">
              Read More
              <AiOutlinePlus className="text-xl"></AiOutlinePlus>
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
