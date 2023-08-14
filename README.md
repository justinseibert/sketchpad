# Light Rings

A prototype tool for animating LED lights in the shape of a concentric rings.
Assumes the lights are connected in a chain, and that the first light in the
chain on the outermost ring of the circle.

[_starPattern.ts_](src/patterns/starPattern.ts) and its base class ([_pattern.ts_](src/patterns/pattern.ts)) is intended for translation to C++ to be run on a [Trinket M0](https://www.adafruit.com/product/3500) microcontroller aided by the [FastLED](https://github.com/FastLED/FastLED) library.

The `loop()` should call `starPattern.update()` for animation.