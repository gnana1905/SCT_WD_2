# Stopwatch Web Application

A clean, modern, and high-precision stopwatch web application built with vanilla HTML5, CSS3, and JavaScript.

## Features

- **Accurate Timing Engine**: Uses `performance.now()` and `requestAnimationFrame` for sub-millisecond precision without interval drift.
- **Minimal Light Design**: Polished, professional card layout with soft neutral backgrounds, rounded corners, and clear hierarchy.
- **Monospaced Digits**: Tabular monospaced time readout formatted as `HH:MM:SS.mmm`.
- **Lap Tracking**: Record lap times seamlessly while the timer continues running.
- **Fastest & Slowest Lap Highlighting**: Automatically detects and highlights the fastest lap in green and the slowest lap in red when 2 or more laps are recorded.
- **Keyboard Shortcuts**:
  - <kbd>Space</kbd> : Start / Pause toggle
  - <kbd>L</kbd> : Record Lap
  - <kbd>R</kbd> : Reset Timer & Laps
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.
- **Zero Dependencies**: Pure vanilla HTML, CSS, and JavaScript.
