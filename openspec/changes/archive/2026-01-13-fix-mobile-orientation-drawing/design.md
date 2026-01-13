# Orientation Logic Design

## Orientation Analysis

Based on user feedback (device: Mobile, likely Android or iOS based on logs), the video feed orientation relative to the MoveNet coordinate system behaves as follows:

### Current State (Buggy)

| Orientation | Type                  | Angle | Logic Applied | Transformation | User Result                |
| ----------- | --------------------- | ----- | ------------- | -------------- | -------------------------- |
| Portrait    | -                     | -     | 90            | -              | **Correct**                |
| Landscape   | `landscape-primary`   | 90    | 0             | Mirror X       | **Inverted** (Upside down) |
| Landscape   | `landscape-secondary` | 270   | 180           | Rotate 180     | **Inverted** (Upside down) |

### Deduction

1. **Landscape Primary (90°)**:

   - Logic `0` (Mirror X) produced an Upside Down image.
   - implication: The source video feed is Upside Down.
   - **Fix**: Apply `180` logic (Rotate 180 / Flip X+Y from original, or Flip Y from mirrored).

2. **Landscape Secondary (270°)**:
   - Logic `180` (Rotate 180) produced an Upside Down image.
   - Implication: The source video feed was actually Right Side Up (or Mirrored correctly) _before_ we applied the 180 rotation.
   - **Fix**: Apply `0` logic (Mirror X).

### Proposed Logic Matrix

| Device Orientation      | `videoWidth` vs `Height` | Action              | Return Angle |
| ----------------------- | ------------------------ | ------------------- | ------------ |
| **Portrait**            | H > W                    | Keep existing logic | `90`         |
| **Landscape Primary**   | W > H                    | Force Rotate 180    | `180`        |
| **Landscape Secondary** | W > H                    | Force Standard (0)  | `0`          |
| **Desktop/Unknown**     | W > H                    | Force Standard (0)  | `0`          |

### Technical Implementation

- Update `calculateRotationAngle` in `canvasRotation.ts`
- Detect `landscape-primary` (or angle 90) -> Return 180.
- Detect `landscape-secondary` (or angle 270/-90) -> Return 0.
- Default -> 0.

_Note: This reverses the previous assumption that Secondary was the "weird" one. On this specific device setup, Primary seems to be the one delivering inverted coordinates relative to the canvas draw space._
