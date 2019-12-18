import React, { Component } from "react";
import Slider from "react-slick";

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000
    };
    return (
      <center>
        <div style={{ width: "50%" }}>
          <br></br>
          <h2 style={{ color: "white" }}> Movies</h2>
          <br></br>
          <Slider {...settings}>
            <div>
              <img
                alt=""
                src="https://media.21cineplex.com/webcontent/gallery/pictures/157422945871583_287x421.jpg"
              />
            </div>
            <div>
              <img
                alt=""
                src="https://media.21cineplex.com/webcontent/gallery/pictures/157250534676979_287x421.jpg"
              />
            </div>
            <div>
              <img
                alt=""
                src="https://media.21cineplex.com/webcontent/gallery/pictures/157018191975549_287x421.jpg"
              />
            </div>
            <div>
              <img
                alt=""
                src="https://media.21cineplex.com/webcontent/gallery/pictures/157416306567553_287x421.jpg"
              />
            </div>
            <div>
              <img
                alt=""
                src="https://media.21cineplex.com/webcontent/gallery/pictures/157492651970791_287x421.jpg"
              />
            </div>
          </Slider>
        </div>
      </center>
    );
  }
}
