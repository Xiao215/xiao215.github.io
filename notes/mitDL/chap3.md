---
title: "Chapter 3: Supervised Learning"
---

### Shallow Neural Networks

- A _neural network_ is a function that maps an input $\mathbf{x}$ to an output $\mathbf{y}$.

- A _shallow neural network_ has only **one layer** of weights between the input and output. They are functions $\mathbf{y=f[x,\phi]}$ with parameters $\phi$ that maps multivariate input $\mathbf{x}$ to multivariate output $\mathbf{y}$.

#### Steps:

1. Compute the weighted sum (linear function) of the inputs to each node in the hidden layer.
2. Apply a nonlinear activation function to the weighted sum of the inputs to each node in the hidden layer.
3. Compute the weighted sum (linear function) of the activations to each node in the output layer.

### Universal approximation theorem

The _universal approximation theorem_ states that a neural network with a single hidden layer containing a finite number of neurons can approximate any continuous function on compact subsets of $\mathbb{R}^n$, under mild assumptions on the activation function.

### Activation Functions

- The _activation function_ $\sigma$ is a nonlinear function that is applied to the weighted sum of the inputs to a node in a neural network.

- The activation function is applied to the weighted sum of the inputs to a node in a neural network:

  $$\mathbf{y} = \sigma(\mathbf{w}^T\mathbf{x} + b)$$

  - $\mathbf{w}$ is a vector of weights.
  - $b$ is a bias term.
  - $\sigma$ is the activation function.

<p align="center">
<img src="https://cdn.discordapp.com/attachments/1094676554652602419/1105831330673078354/image.png" width="full" alt="image" />
</p>

a: **Sigmoid function** $(0, 1)$ and **tanh functoin** $(-1, 1)$

b: **Leaky ReLU (LReLU)** $(-\infty, \infty)$ and **Parametric ReLU (PReLU)** $(-\infty, \infty)$. Note: PReLU is a generalization of LReLU. Slope in LReLU is fixed hyperparameter (usually between 0.01 and 0.3), while in PReLU it is a learnable parameter.

c: **Softplus function**, **Gaussian error linear unit (GELU)** and **Sigmoid linear unit (SiLU)**.

d: **Exponential linear unit (ELU)**, represented as $ELU[z, \alpha]$ which $\alpha = 0.5$ and $\alpha = 1.0$ in the example.

$$ ELU[z, \alpha] = \begin{cases} z & \text{if } z > 0 \\ \alpha(e^z - 1) & \text{otherwise} \end{cases} $$

e: **Scaled exponential linear unit (SELU)**, represented as $SELU[z, \alpha, \lambda]$

f: **Swish function** with $\beta$ as learnable parameters and **Hard swish function**, similar shape with faster to compute than Swish function.

$$
Swish[x, \beta] = \frac{x}{1 + e^{-\beta x}}\\
HardSwish[x] = \begin{cases} 0 & \text{if } x \leq -3 \\ x(x+3)/6 & \text{if } -3 < x < 3 \\ 3 & \text{if } x \geq 3 \end{cases}
$$

### ReLU

- The _rectified linear unit_ (ReLU) is a popular activation function:

  $$\sigma(z) = \max(0, z) = \begin{cases} z & \text{if } z > 0 \\ 0 & \text{otherwise} \end{cases}$$

  - The ReLU is a piecewise linear function that outputs the input directly if it is positive, otherwise it outputs zero.

### Hidden Units (neurons)

- The _hidden units_ of a neural network are the nodes between the input and output layers.

Each hidden unit computes a nonlinear function of the weighted sum of its inputs:

$$
\mathbf{h} = \sigma\left[\mathbf{W}^T\mathbf{x} + \mathbf{b}\right]\\
= \sigma\left[\sum_{i=1}^{D_i}\theta_{di}x_i+\theta_{d0}\right]
$$

$$\mathbf{y} = \mathbf{V}^T\mathbf{h} + \mathbf{c}\\ = \sum_{j=1}^{D}\phi_{jd} h_d + \phi_{j0}$$

**The activation function permits the model to describe nonlinear relations between
input and the output, and as such, it must be nonlinear itself; with no activation function,
or a linear activation function, the overall mapping from input to output would be
restricted to be linear.**

### Multilayer-layer Perceptron (MLP)

- Any neural network with more than one layer of weights is called a _multilayer perceptron_ (MLP).
- Networks with one hidden layer are sometimes called _shallow neural networks_
- Networks with more than one hidden layer are sometimes called _deep neural networks_.
- Neural networks in which the connections form an acyclic graph (a graph with no loops) are called _feedforward neural networks_. Feedforward neural networks are the most common type of neural network.
- If every element in one later connects to every element in the next layer, the network is _fully connected_.
- Each connection represent the slope parameters in the equation and are reffered to as _network weights ($W$)_.
<p align="center">
<img src="https://media.discordapp.net/attachments/1094676554652602419/1105829215145840701/image.png?width=1947&height=1119" width="500" alt="image" />
</p>

### Dyinng neuron problem

- The _dying ReLU_ problem is when a ReLU unit always outputs zero due to having a weight vector that is pointing in the negative direction for all inputs.
