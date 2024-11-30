import { Outlet } from "react-router-dom";
import Header from "../Components/Header";

const MainLayout = () => {
  return (
    <div>
      <Header>
        <Outlet></Outlet>
      </Header>
    </div>
    // <div
    //   className="min-h-screen"
    //   style={{
    //     backgroundImage:
    //       'url("https://themeforest.wprealizer.com/html-educoda-preview/educoda/assets/images/shape/hero.png")',
    //     backgroundRepeat: "no-repeat",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     // backgroundColor: "rgba(0, 0, 0, 0.6)",
    //     // backgroundBlendMode: "overlay",
    //   }}
    // >
    //   hi
    // </div>
  );
};

export default MainLayout;
