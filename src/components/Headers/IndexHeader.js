/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/header.jpg") + ")"
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div class="content-center brand">
            <img
              alt="..."
              className="n-logo rounded"
              class="rounded-full w-60 h-auto max-w-lg mx-auto"
              src={require("assets/img/read1.jpeg")}
            ></img>
            <h1 className="h1-seo">Daily bible Reader</h1>
            <img class="w-20 h-20 rounded mx-auto" src={require("assets/img/down1.png")} alt="Large avatar"></img>
          </div>

          
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
