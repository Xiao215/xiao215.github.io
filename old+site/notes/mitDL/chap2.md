---
title: "Chapter 2: Supervised Learning"
---

A _supervised learning model_ defines a mapping from one or more inputs to one or more outputs. The model is essentially a **mathematical equation** that computes the output(s) given the input(s). A learning algorithm takes a training set of input/output pairs and adjusts the parameters until the inputs predict their corresponding outputs as closely as possible.

### Supervised Learning Overview

To make the prediction, we need a model $\mathbf{f[\cdot]}$ that takes input $\mathbf{x}$ and produces output $\mathbf{y}$:

$$\mathbf{y} = \mathbf{f}[\mathbf{x}]$$

- Computing the prediction $\mathbf{y}$ from the input $\mathbf{x}$ is called **inference**.

- The model also contains _parameters_ $\phi$. The choice of parameters determines the specific relationship between input and output.

$$\mathbf{y} = \mathbf{f}[\mathbf{x}; \phi]$$

- _Learning_ or _training_ a model means finding the best possible choice of parameters $\phi$ given a training set of input/output pairs.

- _Loss L_ quantifies the degree of mismatch between the prediction $\mathbf{y}$ and the actual output $\mathbf{y}^*$. It summarizes **how poorly** the model predicts the training output from corresponding inputs for parameters $\phi$.

- $L[\phi]$ describes the loss of the model for a particular choice of parameters $\phi$. We seek parameter $\hat{\phi}$ that minimizes the loss function:

$$\hat{\phi} = \underset{\phi}{\arg\min}[L[\{\mathbf{x}_i, \mathbf{y}_i\}, \phi]]$$

<!-- ### Linear regression -->

### Loss Functions vs. Cost Functions

- A _Loss function_ calculates the error for a single training example.

- A _Cost function_ is the average of the loss functions of the entire training set.

### Generative vs. Discriminative Models

- _Discriminative models_: These models use real-world measurements $\mathbf{x}$ to compute the output prediction $\mathbf{y}$:

$$\mathbf{y} = \mathbf{f}[\mathbf{x}, \phi]$$

- _Generative models_: Real-world measurements $\mathbf{x}$ are computed as a function of the output $\mathbf{y}$:

  $$\mathbf{x} = \mathbf{g}[\mathbf{y}, \phi]$$

  - **Disadvantage**: To compute the output $\mathbf{y}$, we must invert the generative model as $\mathbf{y}=\mathbf{g}^{-1}[\mathbf{x}, \phi]$.
  - **Advantage**: We can incorporate prior knowledge about how the data were created. For example, if we wanted to predict the 3D position and orientation $\mathbf{y}$ of a car in an image $\mathbf{x}$, we could use a generative model, $\mathbf{x}=\mathbf{g[y, \phi]}$ that incorporates knowledge of the camera's position and orientation.
  - **NOTE**: Discriminative models dominate modern machine learning; the advantage gained from exploiting prior knowledge in generative models is usually overshadowed by learning highly flexible discriminative models with large amounts of training data.
