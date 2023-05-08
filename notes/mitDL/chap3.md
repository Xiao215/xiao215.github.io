---
title: "Chapter 3: Supervised Learning"
---

### Shallow Neural Networks

- A _neural network_ is a function that maps an input $\mathbf{x}$ to an output $\mathbf{y}$.

- A _shallow neural network_ has only one layer of weights between the input and output. They are functions $\mathbf{y=f[x,\phi]}$ with parameters $\phi$ that maps multivariate input $\mathbf{x}$ to multivariate output $\mathbf{y}$.

### Activation Functions

- The _activation function_ $\sigma$ is a nonlinear function that is applied to the weighted sum of the inputs to a node in a neural network.

- The activation function is applied to the weighted sum of the inputs to a node in a neural network:

  $$\mathbf{y} = \sigma(\mathbf{w}^T\mathbf{x} + b)$$

  - $\mathbf{w}$ is a vector of weights.
  - $b$ is a bias term.
  - $\sigma$ is the activation function.

### ReLU

- The _rectified linear unit_ (ReLU) is a popular activation function:

  $$\sigma(z) = \max(0, z) = \begin{cases} z & \text{if } z > 0 \\ 0 & \text{otherwise} \end{cases}$$

  - The ReLU is a piecewise linear function that outputs the input directly if it is positive, otherwise it outputs zero.

### Hidden Units

- The _hidden units_ of a neural network are the nodes between the input and output layers.
