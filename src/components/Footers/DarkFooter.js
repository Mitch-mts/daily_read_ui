/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function DarkFooter(props) {
  return (
    <footer className="footer" data-background-color="black">
    <Container fluid={props.fluid}>
        <nav>
          <ul>
            <li>
                <i>BigMitch Innovations</i>
            </li>
          </ul>
        </nav>
        <div className="copyright">
        &copy; {1900 + new Date().getYear()}, Designed with &#128149; by{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            BigMitch Innovations
          </a>
        </div>
      </Container>
    </footer>
  );
}

DarkFooter.defaultProps = {
  default: false,
  fluid: false,
};

export default DarkFooter;
