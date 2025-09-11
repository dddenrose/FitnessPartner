import React from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import * as reactSpring from "@react-spring/three";

const TimerBg = () => {
  return (
    <ShaderGradientCanvas
      style={{
        position: "absolute",
        zIndex: -1,
      }}
    >
      <ShaderGradient
        color1="#606080"
        color2="#8d7dca"
        color3="#212121"
        animate="on"
        brightness={0.9}
        cAzimuthAngle={180}
        cDistance={2}
        cPolarAngle={115}
        cameraZoom={1.2}
        envPreset="city"
        grain="on"
        lightType="3d"
        positionX={-0.5}
        positionY={0.1}
        positionZ={0}
        reflection={0.1}
        rotationX={0}
        rotationY={0}
        rotationZ={235}
        shader="defaults"
        toggleAxis={false}
        type="waterPlane"
        uAmplitude={0}
        uDensity={1}
        uFrequency={5.5}
        uSpeed={0.1}
        uStrength={2}
        uTime={0.2}
        wireframe={false}
        zoomOut={false}
      />
    </ShaderGradientCanvas>
  );
};

export default TimerBg;
