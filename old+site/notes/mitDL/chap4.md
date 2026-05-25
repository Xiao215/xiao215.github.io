---
title: "Chapter 4: Deep Neural Networks"
---

As the number of hidden units increases, shallow neural networks improve their descriptive power. Indeed, with enough hidden units, shallow networks can describe arbitrarily complex functions in high dimensions. However, it turns out that for some functions, the required number of hidden units is impractically large. **Deep networks can produce many more linear regions than shallow networks for a given number of parameters.** Hence, from a practical standpoint, they can be used to describe a broader family of functions.

<p align="center">
  <img src="https://media.discordapp.net/attachments/1094676554652602419/1105841289443938344/image.png?width=1249&height=1227" width="full">
</p>
The above figure shows that a deep network with two hidden layers can represent a piecewise linear function with three pieces. A shallow network with the same number of hidden units can only represent a piecewise linear function with two pieces. The deep network can represent a function with fewer pieces, using fewer hidden units per piece. This is because the first hidden layer can learn one piece, and the second hidden layer can learn to combine pieces into different arrangements. The shallow network must represent each piece using a hidden unit, and thus needs more hidden units to represent the same function.

### Composing networks

We could create complex functions by passing the output of one shallow neural network into a second network. This is called **composing network**.

<p align="center">
  <img src="https://media.discordapp.net/attachments/1094676554652602419/1105845685175201852/image.png?width=2268&height=512" width="full">
</p>

<p align="center">
  <img src="https://media.discordapp.net/attachments/1094676554652602419/1105846614196756490/image.png?width=2268&height=796" width="full">
</p>

However, this approach is not very practical. It is difficult to train the first network to produce outputs that are suitable for the second network to process. It is also difficult to train the second network to use the outputs of the first network in a meaningful way. **Deep networks allow us to learn a hierarchy of representations, with each successive layer using the output of the previous layer as input.**

### Deep neural networks

A deep neural network is a neural network with multiple hidden layers. The term "deep" refers to the number of hidden layers in the network. The input and output layers are not counted as hidden layers. The equation below is an example of a deep neural network with two hidden layers, each layer with three hidden units.:

- First layer:

  $$
  h_1 = \sigma(\theta_{11}x + \theta_{10})\\
  h_2 = \sigma(\theta_{21}x + \theta_{20})\\
  h_3 = \sigma(\theta_{31}x + \theta_{30})
  $$

- Second layer:

  $$
  h_1' = \sigma(\psi_{11}h_1+ \psi_{12}h_2 + \psi_{13}h_3 + \psi_{10})\\
    h_2' = \sigma(\psi_{21}h_1+ \psi_{22}h_2 + \psi_{23}h_3 + \psi_{20})\\
    h_3' = \sigma(\psi_{31}h_1+ \psi_{32}h_2 + \psi_{33}h_3 + \psi{30})
  $$

- the output:
  $$
  y = \sigma(\omega_1h_1' + \omega_2h_2' + \omega_3h_3' + \omega_0)
  $$

### Hyperparameters

- The number of hidden units in each layer is reffered to as the _width_ of the network.
- The number of hidden layers is reffered to as the _depth_ of the network.
- The total number of hidden units is a measure of the network's _capacity_.
- _Hyperparameters_ are quantities chosen before we learn the model parameters
  - The number of layers $K$
  - The number of hidden units per layer $D_1, D_2, \dots, D_K$
  - For fix hyperparameters (same $K$ and $D_i$), the model describes a family of functions and the parameters determine the particular function.

### Number of Linear Regions

- Shallow network (1 input, 1 output and $D>2$ hidden units) can represent $D+1$ linear regions, and is defined by $3D+1$ parameters.
- Deep network (1 input, 1 output and $K$ layers of $D>2$ hidden units) can represent $(D+1)^K$ linear regions, and is defined by $3D+1+(K-1)D(D+1)$ parameters.

### Depth efficiency

Several results show that there are functions that can be realized by deep netowkrs but not by any shallow network whose capacity is bounded above exponentially. In other words, it woudl take an exponentially large number of units in a shallow network to describe these functions accurately.

### Shallow vs Deep neural networks

1. both networks can approximate any function given enough hidden units
2. deep networks can often be exponentially more efficient than shallow networks, produce many more linear regions for a given number of parameters
3. some function can be approximated more easily with deep networks than with shallow networks
4. large, structured inputs like images are best processed in multiple stages using convolutional neural networks
5. in practical, the best results for most tasks are obtained using deep networks with many layers
