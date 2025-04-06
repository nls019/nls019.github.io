[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/pcoSEEt2)
# Quest 10: The Shape Shifter's Trial

## Objectives
Welcome, Adept!

You have mastered the interplay of light and shadow, and now it is time to command the transformation of shapes themselves. In this quest, you will breathe life into static geometry, morphing forms seamlessly and rendering them with the speed of light using real-time ray tracing techniques.

By the end of this journey, you will wield the power to:

- Implement triangle mesh interpolation using both linear and Laplacian methods.
- Optimize shape transitions to preserve structure and avoid distortions.
- Implement real-time ray tracing acceleration using AABB, 3D grids, and BVH.
- Construct efficient data structures for GPU-based ray tracing.

## Quest Overview
This quest consists of two parts: Mesh Interpolation and Realtime Ray Tracing.

1. Shaping the World – Learn to morph triangle meshes using keyframe animation and interpolation techniques.
2. Speed of Light – Optimize ray tracing performance through spatial acceleration structures.

**Note**: For the second part, ensure you have completed Quest 9 before proceeding.

## Feature Points
Earn feature point listed below is worth **1 point**(except area weights, 3D Grid, BVH, and real-time ray tracing). The total possible points for this quest are **10+** for the entire quest. You only need 60 points from 10 quests. Do as many as you want. On average, you should get 6 points per quest.

### Shape Interpolation
- **1 point**: Apply linear vertex-wise interpolation to a different shape (other than the provided cats).
- **1 point**: Implement a shading model (instead of the provided normal coloring, color the mesh using a shading model.)
- **1 point**: Implement and demonstrate Laplacian interpolation with uniform weights
- **1 point**: Implement and demonstrate Laplacian interpolation with edge length weights.
- **2 points**: Implement and demonstrate Laplacian interpolation with area weights.
- **1 point**: Create a shape morphing animation with at least three distinct keyframes.

### Realtime Ray Tracing Acceleration
- **1 point**: Implement AABB (Axis-Aligned Bounding Box) acceleration for ray-mesh intersection.
- **2 points**: Implement a 3D grid (voxelization) to optimize ray traversal.
- **3 points**: Implement a BVH (Bounding Volume Hierarchy) with Surface Area Heuristic (SAH)-based splitting to optimize ray traversal.


### Advanced Challenges
- **1 point**: Render a scene where interpolated meshes interact dynamically with lighting. (e.g. shadow changes)
- **2 poitns**: Implement an interactive real-time **ray-traced scene** featuring at least one mesh, and at least three distinct primitive objects.
- **5 points**: Implement an interactive real-time **ray-traced scene** featuring a **morphing object**.

### Others
- **1 point**: Win the weekly quest contest. On Monday, in class, you will vote for the best craft of the week. **If you win, you earn an extra point!**
- **? points**: Anything that impresses me (e.g. [implement the Pixar lamp](https://www.youtube.com/watch?v=PGKmexNTHNE)). **Write them clearly in your description to convince me they are impressive!**

### Submission Instructions
- Fork this quest repository to begin your quest and ensure you commit your code there before the due date.
- Ensure your Arcane Portal is public and contains all relevant and **obfuscated** code. I recommend you update the Arcane Portal every time you complete a quest.
- Your Arcane Portal site should display the visual effect(s) and include any required descriptions.

### Resources
- Refer to **[Scroll 26](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll26.php)** for shape interpolation.
- Consult **[Scroll 27](https://eg.bucknell.edu/~scl019/Courses/CGSP25/scroll27.php)** for ray tracing acceleration.
- [WGSL documentation](https://www.w3.org/TR/WGSL/).
- Reach out and ask questions on [Piazza](https://piazza.com/bucknell/spring2025/csci379) if you are stuck!
