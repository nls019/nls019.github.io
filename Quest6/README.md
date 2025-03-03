[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/QbIe8FRt)
# Quest 6: The Arcane Path of Rays

## Objectives
The time has come to master another foundational spell of Computer Graphics Wizards: Ray Tracing. In this quest, you will construct the core mechanisms of a ray tracer using WebGPU. Your goal is to generate rays, detect their intersections with primitive objects, and visualize the results. This will serve as the groundwork for more advanced magic in future quests.

## Quest Overview
This quest focuses on the fundamentals of ray tracing: 

1. Ray Generation: Generate rays from the camera, mapping each pixel on the screen to a ray in the scene.
2. Camera/Object Control: Implement camera/object control to move and adjust the camear/object model using 3D PGA.
3. Ray-Object Intersection: Implement efficient intersection algorithms for primitive objects (e.g., spheres, planes, boxes).
   
## Feature Points
Earn feature point listed below is worth **1 point**. The total possible points for this quest are **6+** for the entire quest. You only need 60 points from 10 quests. Do as many as you want. On average, you should get 6 points per quest.

### Ray Generation
- **1 point**: Implement ray generation logic using a pin-hole camera model and show correct projective camera result.

### Camera/Object Control
- **1 point**: Implement camera translation control and show correct interaction results
- **1 point**: Implement camera rotation control and show correct interaction results
- **1 point**: For projective camera, implement camera focal change and show correct interaction results
- **1 point**: Implement at one object translation control and show correct interaction results
- **1 point**: Implement at one object rotation control and show correct interaction results

### Ray-Object Intersection
- **1 point**: Color the intersection results using the hit-value (e.g. smaller as red, larger as blue, no hit as black), so that we can perceive the depth.
- **1 point**: Show the intersection results with at least three different shapes.
- **1 point**: Implement a ray-cube intersection and display the intersection results on screen.
- **1 point**: Implement a ray-sphere intersection and display the intersection results on screen.
- **1 point**: Implement a ray-cylinder intersection and display the intersection results on screen.
- **1 point**: Implement a ray-cone intersection and display the intersection results on screen.
- **1 point**: Implement a ray-ellipsoid intersection and display the intersection results on screen.
- **1 point**: Implement a ray-torus intersection and display the intersection results on screen.

### Others
- **1 point**: Win the weekly quest contest. On Monday, in class, you will vote for the best craft of the week. **If you win, you earn an extra point!**
- **? points**: Anything that impresses me (fishball camera model, a composite shape). **Write them clearly in your description to convince me they are impressive!**

### Submission Instructions
- Fork this quest repository to begin your quest and ensure you commit your code there before the due date.
- Ensure your Arcane Portal is public and contains all relevant and **obfuscated** code. I recommend you update the Arcane Portal every time you complete a quest.
- Your Arcane Portal site should display the visual effect(s) and include any required descriptions.

### Resources
- Refer to **[Scroll 15](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll15.php)** for 3D PGA.
- Consult **[Scroll 16](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll16.php)** for ray generations and ray-object intersection.
- [WGSL documentation](https://www.w3.org/TR/WGSL/).
- Reach out and ask questions on [Piazza](https://piazza.com/bucknell/spring2025/csci379) if you are stuck!
