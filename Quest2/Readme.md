[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xZDLMbdM)
# Quest 2: Animating the Cosmos

## Objectives
Welcome back, apprentices! Your journey into the arcane arts of Computer Graphics continues. This week, you will venture into the realm of the cosmos, using transformations and interpolation spells to simulate a 2D solar system. In addition, you'll unlock the power of compute shaders to perform basic image processing magic.

## Quest Overview
There are two parts to this quest.
1. Solar System Simulation: animate celestial bodies using transformations and interpolations. **This is a suggested animation. You are free to do your own animation using the techniques you have learned.** If you do so, make sure you describe what features you implemented and how they are equivalent to those described below.
2. Image Processing with Compute Shaders: apply basic image manipulation using WebGPU.
   
## Feature Points
Earn feature point listed below is worth **1 point** except pointillism. The total possible points for this quest are **10+** for the entire quest. You only need 60 points from 10 quests. Do as many as you can. On average, you should get 6 points per quest.
- **1 point**: Use simple shapes (circles) and colors to present celestial bodies and orbits.
- **1 point**: At least one animated object using interpolation with at least *three* poses.
- **1 point**: At least one planet orbits around the sun. 
- **1 point**: At least one moon orbits around a planet.
- **1 point**: At least one orbit is elliptical.
- **1 point**: A complete solar system animation (i.e. the sun and the eight planets).
- **1 point**: A space-like background using an image texture.
- **1 point**: An animated spaceship or any animated object composed of at least *three* simple shapes.
- **1 point**: A planetary rotation (i.e. showing the planet is rotating itself).
- **1 point**: Apply grayscale filter using any one of the formulas [here](https://en.wikipedia.org/wiki/Grayscale).
- **1 point**: Apply blurring effect, e.g. Gaussian blur using the formula [here](https://en.wikipedia.org/wiki/Gaussian_blur).
- **2 points**: Apply Pointillism similar to [here](https://en.wikipedia.org/wiki/Pointillism). You would like to apply a pointilism-like effect to an input image. In order to accomplish this, You randomly select a small set (3%) of the pixels in the input image and apply the effect to them. To do so, imagine that each randomly selected pixel is at the center of a circle with a random radius of between 1 and 10% of the maximum of the image width and height. Now, applying the pointilism effect comes down to coloring all the pixels that reside in that circle with the same color as the color of the randomly selected pixel which is at the center of the circle. This gives the input image a cool ``painting-like" look by creating a set of small filled circles (i.e., dots) across the image, where each dot is uniformly colored with the color of the randomly selected pixel which is located at the center of that dot. Note that if a randomly selected pixel is near or at a boundary, then you do not need to apply the effect to the parts that may extend past the borders of the image.
- **1 point**: Win the weekly quest contest. On Monday, in class, you will vote for the best craft of the week. **If you win, you earn an extra point!**
- **? points**: Anything that impresses me (funny animations, funny filters etc). **Write them clearly in your description to convince me they are impressive!**

### Submission Instructions
- Fork this quest repository to begin your quest and ensure you commit your code there before the due date.
- Ensure your Arcane Portal is public and contains all relevant and **obfuscated** code. I recommend you update the Arcane Portal every time you complete a quest.
- Your Arcane Portal site should display the animated solar system scene (or your own animation scene) and include any required descriptions.

### Resources
- Refer to **[Scroll 3](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll3.php)** for transformation.
- Consult **[Scroll 4](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll4.php)** for interpolation.
- Check **[Scroll 5](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll5.php)** for image processing algorithms.
- You may want to check the planet ratio tables [here](https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html).
- [WGSL documentation](https://www.w3.org/TR/WGSL/).
- Reach out and ask questions on [Piazza](https://piazza.com/bucknell/spring2025/csci379) if you are stuck!

