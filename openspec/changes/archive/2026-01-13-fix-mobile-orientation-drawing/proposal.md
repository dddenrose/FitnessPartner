# Fix Mobile Skeleton Drawing Orientation

## Summary

Correct the skeletal drawing orientation on mobile devices for landscape modes (both clockwise and counter-clockwise) to ensure the drawing aligns correctly with the user's pose.

## Problem

Currently, the skeletal drawing is inverted (upside down) when the device is in landscape orientation (both primary and secondary modes). While portrait mode and desktop landscape mode work correctly, mobile landscape modes interpret the coordinate system incorrectly, resulting in disjointed or inverted overlays.

## Solution

1.  Analyze the correlation between `screen.orientation.type`, `window.orientation`, and the video feed coordinate system provided by MoveNet.
2.  Refine the `calculateRotationAngle` logic to correctly map device orientation to the required canvas rotation.
3.  Update `BpmDetector` canvas transformation logic to handle the refined rotation angles (specifically distinguishing between mirroring, 180-degree rotation, and 180-degree rotation + mirroring).
4.  Remove assumptions that confuse `landscape-primary` with "always correct" if evidence suggests otherwise on target devices.

## Impact

- **Users**: Mobile users will see the skeleton overlay correctly aligned with their body in all orientations.
- **Devs**: Clearer logic in `canvasRotation.ts` for handling device orientations.
