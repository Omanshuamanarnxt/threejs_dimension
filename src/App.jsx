import React, { useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const modelViewerRef = useRef(null);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;

    modelViewer.querySelector("#src").addEventListener("input", (event) => {
      modelViewer.src = event.target.value;
    });

    const checkbox = modelViewer.querySelector("#show-dimensions");

    function setVisibility(element) {
      if (checkbox.checked) {
        element.classList.remove("hide");
      } else {
        element.classList.add("hide");
      }
    }

    checkbox.addEventListener("change", () => {
      setVisibility(modelViewer.querySelector("#dimLines"));
      modelViewer.querySelectorAll("button").forEach((hotspot) => {
        setVisibility(hotspot);
      });
    });

    // update svg
    function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
      if (dotHotspot1 && dotHotspot2) {
        svgLine.setAttribute("x1", dotHotspot1.canvasPosition.x);
        svgLine.setAttribute("y1", dotHotspot1.canvasPosition.y);
        svgLine.setAttribute("x2", dotHotspot2.canvasPosition.x);
        svgLine.setAttribute("y2", dotHotspot2.canvasPosition.y);

        // use provided optional hotspot to tie visibility of this svg line to
        if (dimensionHotspot && !dimensionHotspot.facingCamera) {
          svgLine.classList.add("hide");
        } else {
          svgLine.classList.remove("hide");
        }
      }
    }

    const dimLines = modelViewer.querySelectorAll("line");

    const renderSVG = () => {
      drawLine(
        dimLines[0],
        modelViewer.queryHotspot("hotspot-dot+X-Y+Z"),
        modelViewer.queryHotspot("hotspot-dot+X-Y-Z"),
        modelViewer.queryHotspot("hotspot-dim+X-Y")
      );
      drawLine(
        dimLines[1],
        modelViewer.queryHotspot("hotspot-dot+X-Y-Z"),
        modelViewer.queryHotspot("hotspot-dot+X+Y-Z"),
        modelViewer.queryHotspot("hotspot-dim+X-Z")
      );
      drawLine(
        dimLines[2],
        modelViewer.queryHotspot("hotspot-dot+X+Y-Z"),
        modelViewer.queryHotspot("hotspot-dot-X+Y-Z")
      ); // always visible
      drawLine(
        dimLines[3],
        modelViewer.queryHotspot("hotspot-dot-X+Y-Z"),
        modelViewer.queryHotspot("hotspot-dot-X-Y-Z"),
        modelViewer.queryHotspot("hotspot-dim-X-Z")
      );
      drawLine(
        dimLines[4],
        modelViewer.queryHotspot("hotspot-dot-X-Y-Z"),
        modelViewer.queryHotspot("hotspot-dot-X-Y+Z"),
        modelViewer.queryHotspot("hotspot-dim-X-Y")
      );
    };

    modelViewer.addEventListener("camera-change", renderSVG);

    modelViewer.addEventListener("load", () => {
      const center = modelViewer.getBoundingBoxCenter();
      const size = modelViewer.getDimensions();
      const x2 = size.x / 2;
      const y2 = size.y / 2;
      const z2 = size.z / 2;

      modelViewer.updateHotspot({
        name: "hotspot-dot+X-Y+Z",
        position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
      });

      modelViewer.updateHotspot({
        name: "hotspot-dim+X-Y",
        position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
      });
      modelViewer.querySelector(
        'button[slot="hotspot-dim+X-Y"]'
      ).textContent = `${(size.z * 100).toFixed(0)} cm`;

      modelViewer.updateHotspot({
        name: "hotspot-dot+X-Y-Z",
        position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
      });

      modelViewer.updateHotspot({
        name: "hotspot-dim+X-Z",
        position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
      });
      modelViewer.querySelector(
        'button[slot="hotspot-dim+X-Z"]'
      ).textContent = `${(size.y * 100).toFixed(0)} cm`;

      modelViewer.updateHotspot({
        name: "hotspot-dot+X+Y-Z",
        position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
      });

      modelViewer.updateHotspot({
        name: "hotspot-dim+Y-Z",
        position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`,
      });
      modelViewer.querySelector(
        'button[slot="hotspot-dim+Y-Z"]'
      ).textContent = `${(size.x * 100).toFixed(0)} cm`;

      modelViewer.updateHotspot({
        name: "hotspot-dot-X+Y-Z",
        position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
      });

      modelViewer.updateHotspot({
        name: "hotspot-dim-X-Z",
        position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
      });
      modelViewer.querySelector(
        'button[slot="hotspot-dim-X-Z"]'
      ).textContent = `${(size.y * 100).toFixed(0)} cm`;

      modelViewer.updateHotspot({
        name: "hotspot-dot-X-Y-Z",
        position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
      });

      modelViewer.updateHotspot({
        name: "hotspot-dim-X-Y",
        position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
      });
      modelViewer.querySelector(
        'button[slot="hotspot-dim-X-Y"]'
      ).textContent = `${(size.z * 100).toFixed(0)} cm`;

      modelViewer.updateHotspot({
        name: "hotspot-dot-X-Y+Z",
        position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
      });

      renderSVG();
    });
  }, []);
  useEffect(() => {
    const modelViewer = modelViewerRef.current;

    const arButton = document.getElementById("ar-button");
    const arPrompt = document.getElementById("ar-prompt");
    const arFailure = document.getElementById("ar-failure");

    arButton.addEventListener("click", () => {
      modelViewer.enterAR();
    });

    modelViewer.addEventListener("ar-status", (event) => {
      if (event.detail.status === "session-started") {
        arPrompt.style.display = "none";
        arFailure.style.display = "none";
      } else if (event.detail.status === "not-supported") {
        arButton.style.display = "none";
        arPrompt.style.display = "none";
        arFailure.style.display = "block";
      } else if (event.detail.status === "session-failed") {
        arButton.style.display = "none";
        arPrompt.style.display = "none";
        arFailure.style.display = "block";
      }
    });
  }, []);

  const switchSrc = (event) => {
    const selectedValue = event.target.value;
    const modelViewer = modelViewerRef.current;

    if (selectedValue === "chair") {
      modelViewer.src =
        "https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb";
    } else if (selectedValue === "mixer") {
      modelViewer.src =
        "https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb";
    } else if (selectedValue === "cactus") {
      modelViewer.src =
        "https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb";
    }
  };

  return (
    <div>
      <model-viewer
        ref={modelViewerRef}
        id="dimension-demo"
        ar
        ar-modes="webxr"
        ar-scale="fixed"
        camera-orbit="-30deg auto auto"
        max-camera-orbit="auto 100deg auto"
        shadow-intensity="1"
        camera-controls
        touch-action="pan-y"
        src="https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb"
        alt="A 3D model of an armchair.">
        <button slot="ar-button" id="ar-button">
          View in your space
        </button>

        <div id="ar-prompt">
          <img src="../../assets/hand.png" alt="AR Prompt" />
        </div>

        <button id="ar-failure">AR is not tracking!</button>
        <button
          slot="hotspot-dot+X-Y+Z"
          className="dot"
          data-position="1 -1 1"
          data-normal="1 0 0"></button>
        <button
          slot="hotspot-dim+X-Y"
          className="dim"
          data-position="1 -1 0"
          data-normal="1 0 0"></button>
        <button
          slot="hotspot-dot+X-Y-Z"
          className="dot"
          data-position="1 -1 -1"
          data-normal="1 0 0"></button>
        <button
          slot="hotspot-dim+X-Z"
          className="dim"
          data-position="1 0 -1"
          data-normal="1 0 0"></button>
        <button
          slot="hotspot-dot+X+Y-Z"
          className="dot"
          data-position="1 1 -1"
          data-normal="0 1 0"></button>
        <button
          slot="hotspot-dim+Y-Z"
          className="dim"
          data-position="0 -1 -1"
          data-normal="0 1 0"></button>
        <button
          slot="hotspot-dot-X+Y-Z"
          className="dot"
          data-position="-1 1 -1"
          data-normal="0 1 0"></button>
        <button
          slot="hotspot-dim-X-Z"
          className="dim"
          data-position="-1 0 -1"
          data-normal="-1 0 0"></button>
        <button
          slot="hotspot-dot-X-Y-Z"
          className="dot"
          data-position="-1 -1 -1"
          data-normal="-1 0 0"></button>
        <button
          slot="hotspot-dim-X-Y"
          className="dim"
          data-position="-1 -1 0"
          data-normal="-1 0 0"></button>
        <button
          slot="hotspot-dot-X-Y+Z"
          className="dot"
          data-position="-1 -1 1"
          data-normal="-1 0 0"></button>
        <svg
          id="dimLines"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="dimensionLineContainer">
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
          <line className="dimensionLine"></line>
        </svg>

        <div id="controls" className="dim">
          <label htmlFor="src">Product:</label>
          <select id="src">
            <option value="https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb">
              Chair
            </option>
            <option
              value="https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb"
              disabled>
              Mixer
            </option>
            <option
              value="https://arnxt-models-webar.s3.ap-south-1.amazonaws.com/curtain.glb"
              disabled>
              Cactus
            </option>
          </select>
          <br />

          <label htmlFor="show-dimensions">Show Dimensions:</label>
          <input id="show-dimensions" type="checkbox" defaultChecked={true} />
        </div>
      </model-viewer>
    </div>
  );
};

export default App;
