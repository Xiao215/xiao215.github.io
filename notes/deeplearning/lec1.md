---
title: "Chapter 2: Linear Algebra"
---

### Scalars, Vectors, Matrices and Tensors2

- Scalars: Single number. Write in _italics_ and **lowercase variable names**. E.g. $s \in \mathbb{R}$ or $s \in \mathbb{N}$
- Vectors: Array of numbers. Write in **bold** and **lowercase variable names**. E.g. $\mathbf{x} \in \mathbb{R}^n$ or $\mathbf{x} \in \mathbb{N}^n$.

  $$
  \mathbf{x} =
  \begin{bmatrix}
      x_1 \\
      x_2 \\
      \vdots \\
      x_n
  \end{bmatrix}
  $$

  $$
  $$

- Matrices: 2D arrays of numbers. Write in **bold** and **uppercase variable names**. E.g. $\mathbf{A} \in \mathbb{R}^{m \times n}$ or $\mathbf{A} \in \mathbb{N}^{m \times n}$ (**Height** $m$ \& **Width** $n$).

  $$
  \mathbf{A} =
  \begin{bmatrix}
      a_{11} & a_{12} & \cdots & a_{1n} \\
      a_{21} & a_{22} & \cdots & a_{2n} \\
      \vdots & \vdots & \ddots & \vdots \\
      a_{m1} & a_{m2} & \cdots & a_{mn}
  \end{bmatrix}
  $$

- Tensors: Arrays with more than 2 axes. Write in **bold** and **uppercase variable names**. E.g. $\mathbf{A} \in \mathbb{R}^{m \times n \times p}$ or $\mathbf{A} \in \mathbb{N}^{m \times n \times p}$ (**Height** $m$, **Width** $n$ & **Depth** $p$).

### Transpose

The transpose of a matrix is the mirror image of the matrix across a diagonal line, called the **main diagonal**. The transpose of a matrix is denoted as $\mathbf{A}^T$.

$$(A^T)_{i,j}=A_{j,i}$$

- Vector: $\mathbf{x}= [x_1, x_2, x_3]^T$
- Scalar: $s = s^T$

### Mutiplying Matrices and Vectors

$$
\mathbf{C} = \mathbf{A}\mathbf{B}\\
C_{i,j} = \sum_k A_{i,k}B_{k,j}
$$

- $\mathbf{A}$ has shape $m \times n$ and $\mathbf{B}$ has shape $n \times p$, then $\mathbf{C}$ has shape $m \times p$.
- $C_{i,j}$ is the dot product of the $i$-th row of $\mathbf{A}$ and the $j$-th column of $\mathbf{B}$.
- **Properties**
  - $\mathbf{A}\mathbf{B} \neq \mathbf{B}\mathbf{A} \qquad \mathbf{x}^T\mathbf{y} = \mathbf{y}^T\mathbf{x}\ (\text{vectors})$
  - $\mathbf{A}(\mathbf{B}\mathbf{C}) = (\mathbf{A}\mathbf{B})\mathbf{C}$
  - $\mathbf{A}(\mathbf{B}+\mathbf{C}) = \mathbf{A}\mathbf{B} + \mathbf{A}\mathbf{C}$
  - $\mathbf{A}\mathbf{I} = \mathbf{I}\mathbf{A} = \mathbf{A}$
  - $(\mathbf{A}\mathbf{B})^T = \mathbf{B}^T\mathbf{A}^T$

### System of Linear Equations

$$
\mathbf{A}\mathbf{x} = \mathbf{b}\\
\mathbf{A}^{-1}\mathbf{A}\mathbf{x} = \mathbf{A}^{-1}\mathbf{b}\\
\mathbf{x} = \mathbf{A}^{-1}\mathbf{b}
$$

Where $\mathbf{A} \in \mathbb{R}^{m \times n}$ is a known matrix and $\mathbf{b} \in \mathbb{R}^m$ is a known vector.

### Identity and Inverse Matrices

- Identity Matrix: $\mathbf{I} \in \mathbb{R}^{n \times n}$

  $$
  \mathbf{I} =
  \begin{bmatrix}
      1 & 0 & \cdots & 0 \\
      0 & 1 & \cdots & 0 \\
      \vdots & \vdots & \ddots & \vdots \\
      0 & 0 & \cdots & 1
  \end{bmatrix}\\
    \mathbf{I}\mathbf{A} = \mathbf{A}\mathbf{I} = \mathbf{A}\\
    \mathbf{A}^{-1}\mathbf{A}=\mathbf{I}
  $$

### Linear Dependence and Span

- Linearly Dependent: A set of vectors $\mathbf{v}_1, \mathbf{v}_2, \cdots, \mathbf{v}_n$ is linearly dependent if at least one vector in the set can be defined as a linear combination of the others.
- Linear Combination: A linear combination of some vectors $\mathbf{v}_1, \mathbf{v}_2, \cdots, \mathbf{v}_n$ is the vector obtained by summing them together after multiplying each one by a scalar.

  $$
    \sum_{i=1}^n c_i \mathbf{v}_i
  $$

- Span: The span of a set of vectors is the set of all points obtainable by linear combination of the original vectors.
