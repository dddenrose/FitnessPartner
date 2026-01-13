# Pose Drawing Overlay

## ADDED Requirements

### Requirement: Orientation Alignment

The skeleton overlay MUST align with the user's video feed in all device orientations.

#### Scenario: Mobile Portrait

Given the user is on a mobile device held vertically
When the video feed is active
Then the skeleton overlay is drawn upright and aligned with the body (Rotation 90 logic).

#### Scenario: Mobile Landscape Primary

Given the user is on a mobile device held in landscape primary (usually rotated 90 deg clockwise)
When the video feed is active
Then the skeleton overlay is drawn upright (requiring 180 degree correction if feed is inverted).

#### Scenario: Mobile Landscape Secondary

Given the user is on a mobile device held in landscape secondary (usually rotated 270 deg clockwise)
When the video feed is active
Then the skeleton overlay is drawn upright (Standard 0 degree logic).
