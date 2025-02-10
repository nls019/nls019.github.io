[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/8LCU8vFF)
# Quest 3: The Alchemist's Canvas

## Objectives
In this quest, you will channel your skills as an apprentice of the Computer Graphics Wizard Academy to craft a living, interactive canvas imbued with the laws of life and chemistry. By combining your understanding of user interactions, buffer objects, and shader programming, you will bring Conway's Game of Life (or its variation using Reaction-Diffusion) to life. Along the way, you will master the art of manipulating textures, implementing camera systems, and processing complex simulation in real time.

## Quest Overview
1. Interactive Magics: design a user-friendly interface that responds to keybaord and mouse inputs to alter and influence the simulation.
2. Arcane Simulation: implement either Conway's Game of Life or a Reaction-Diffusion system or a combination of both to demonstrate your grasp of computational thinking.
3. Shader Sorcery: use computer shaders for efficient updates and rendering of the simulation grid.
4. Camera Wizardry: integrate a camera system that allows panning and zooming to explore your alchemical creations.
5. Performance Enchantment: optimize the simulation to run smoothly, even with large grids or high-resolution outputs.
   
## Feature Points
Earn feature point listed below is worth **1 point** except reaction-diffusion. The total possible points for this quest are **10+** for the entire quest. You only need 60 points from 10 quests. Do as many as you want. On average, you should get 6 points per quest.
- **1 point**: Implement the [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) grid using a compute shader to update the cells. The grid should be at least 256 $\times$ 256 and the cells should be randomly initialized.
- **1 point**: Render the cell using a fragment shader with distinct colors for alive and dead cells.
- **1 point**: Use keyboard input to pause/resume and reset the simulation. When reset, the cells should be randomly reinitialized.
- **1 point**: Use keyboard input to speedup/slowdown the simulation.
- **1 point**: Implement a 2D camera and use the keyboard to move left/right/botton/down.
- **1 point**: Implement a 2D camera and use the keyboard to zoom in/out.
- **1 point**: If zoom in/out is implemented, add a boundary checking to disallow interaction that causes out-of-view (i.e. the screen always shows the simulation area.)
- **1 point**: Use mouse input to toggle cells (i.e. to turn alive cell to dead and vice-versa).
- **1 point**: If there is camera interaction (e.g. after zoomed in), the mouse toggle cells still work perfectly.
- **1 point**: Add a never dead / ever alive cell. Render them with distinct colors.
- **1 point**: If there is a never dead / ever alive cell, use mosue input to drag and drop it.
- **1 point**: Integrate touchpad interactions, so it interacts with touch screens as well.
- **1 point**: Integrate game pad interactions to demonstrate it interacts with a game pad.
- **1 point**: Render at least one text object to provide interaction instructions.
- **1 point**: Run at real time even with a large grid (e.g. 2048 $\times$ 2048).
- **2 points**: Implement a [reaction-diffusion system](https://en.wikipedia.org/wiki/Reaction%E2%80%93diffusion_system) (e.g. Gray-Scott model) instead using compute shaders. Use gradient colors to render the chemical concentrations.
- **2 points**: Integrate a reaction-diffusion system into game of life. Each cell has its concentration of two substances - A and B. Revise the game of life rules based on the concentration of the two substances. 
- **1 point**: Win the weekly quest contest. On Monday, in class, you will vote for the best craft of the week. **If you win, you earn an extra point!**
- **? points**: Anything that impresses me (advanced interactions such as a scrollbar, funny simulations etc). **Write them clearly in your description to convince me they are impressive!**

### Submission Instructions
- Fork this quest repository to begin your quest and ensure you commit your code there before the due date.
- Ensure your Arcane Portal is public and contains all relevant and **obfuscated** code. I recommend you update the Arcane Portal every time you complete a quest.
- Your Arcane Portal site should display the simulation and include any required descriptions.

### Resources
- Refer to **[Scroll 6](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll6.php)** for camera models and keyboard interactions.
- Consult **[Scroll 7](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll7.php)** for text objects and computer shaders and WGSL compilation.
- Check **[Scroll 8](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll8.php)** for drag and drop, and mouse interactions.
- [WGSL documentation](https://www.w3.org/TR/WGSL/).
- Reach out and ask questions on [Piazza](https://piazza.com/bucknell/spring2025/csci379) if you are stuck!
