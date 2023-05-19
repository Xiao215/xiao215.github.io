---
title: "Chapter 6: Fitting models"
---

This chapter is about learning the parameters of a model from data or simply training or fitting the model. We will see how to train models to minimize a loss function. The process is to choose initial parameter values and then iterative the following two steps:

1. compute the derivatives (gradients) of the loss function with respect to the parameters
2. adjust the parameters in a direction that reduces the loss

After many iterations, we hope to reach the minimum of the loss function.

### Gradient descent

To fit a model, we have a training set $\mathbf{\{x_i, y_i}\}$ of input and output pairs. We seek parameters $\mathbf{\phi}$ for the model $f\mathbf{[x_i, \phi]}$ that minimize the loss function $L[\phi]$. The goal of an _optimization algorithm_ is to find parameter $\hat{\mathbf{\phi}}$ that minimizes the loss.

$$\hat{\mathbf{\phi}} = \underset{\mathbf{\phi}}{\arg\min} [L[\mathbf{\phi}]]$$

The simplest method is _gradient descent_. It is an iterative algorithm that starts with an initial guess $\mathbf{\phi_0}$ for the parameters and repeatedly moves toward a set of parameter values that achieve lower loss. Each iteration performs the following update:

**Step 1**: Compute the gradient of the loss function with respect to the parameters $\mathbf{\phi}$.

$$ \frac{\partial L}{\partial \phi} = \left[ \frac{\partial L}{\partial \phi_1}, \frac{\partial L}{\partial \phi_2}, \dots, \frac{\partial L}{\partial \phi_m} \right]^T $$

**Step 2**: Update the parameters in the opposite direction from the gradient:

$$ \mathbf{\phi} \leftarrow \mathbf{\phi} - \alpha \frac{\partial L}{\partial \phi} $$

where $\alpha$ is the _learning rate_.

<p align="center">
  <img src="https://media.discordapp.net/attachments/1094676554652602419/1106605299483287674/image.png?width=1089&height=1119" width="400">
</p>

### Local minima and Saddle points

- Local minima: There could be numerous _local minima_ for a loss function. Each of them have a zero gradient and loss increases if we move in any direction, but they are not at the overall minimum of the function. There is no guarantee that we will wind up at the global mnimum and find the best parameters.

- Saddle points: A _saddle point_ is a point where the gradient is zero but the point is neither a maximum nor a minimum. The gradient is zero in all directions, but the function increases in some direction and decreses in others.

### Gradient descent vs Stoachastic gradient descent (SGD)

<p align="center">
  <img src="https://media.discordapp.net/attachments/1094676554652602419/1106650943132540928/image.png?width=1997&height=1119" width="full">
</p>

- Gradient descent: As long as the gradient descent algorithm is initialized in the right "valley" of the loss function, the parameters will converge to the global minimum. However, if the algorithm is initialized outside the valley, it may converge to a local minimum or a saddle point.

- Stochastic gradient descent: adds noise to the optimization process, so it is possible to escape from the wrong valley and still reach the global minimum.

### Stochastic gradient descent

_Stochastic Gradient Descent_ attempts to solve the problem of gradient descent by adding noise to the optimization process. Instead of choosing the steepest downhill direction, SGD chooses a random direction. **Indeed, it might not be downhill at all**, the SGD algorithm has the possibility of **moving temporarily uphill** and hence jump from one "valley" of the loss function to another. The noise in the gradient helps the algorithm jump out of any local minima or saddle points.

### Batches and epochs

**Batches** are the number of training examples used in one iteration of gradient descent. The number of batches is equal to the number of iterations for one epoch. The number of epoch is the number of times the entire training set is used to train the model. Batch introduces a trade-off between the accuracy of the parameter update and the time it takes to perform the update. The larger the batch, the more accurate the gradient estimate will be, but the longer it will take to compute the gradient. The smaller the batch, the noisier the gradient estimate will be, but the less time it will take to compute the gradient.

$$\mathbf{\phi}_{t+1} \leftarrow \mathbf{\phi}_t - \alpha  \sum_{\mathbf{x_i, y_i} \in \mathcal{B}} \frac{\partial L[\mathbf{x_i, y_i, \phi_t}]}{\partial\phi}$$

where $\mathcal{B}$ is a batch of training examples.

The batches are usually drawn from the dataset without replacement. The algorithm works through the training examples until it has used all the data. A single pass through the entire training dataset is referred to as an _epoch_. Therefore, one epoch consists of one full cycle through the training set. A batch may be as small as a single example or as large as the whole dataset (full batch gradient descent, identical to regular gradient descent).

### Property of SGD

1. Although it adds noise to the trajectory, it still improves the fit to a subset of data at each iteration. The noise is averaged out over many iterations, so SGD is still guaranteed to converge to the global minimum if the learning rate is sufficiently small and the number of iterations is sufficiently large.
2. SGD is much faster than gradient descent because it uses a small batch of data to compute the gradient. It is also more robust to noisy gradients than gradient descent.
3. The training examples all contribute equally because it draws training examples without replacement and iterate through the dataset.
4. Less computationally expensive than gradient descent because it uses a small batch of data to compute the gradient.
5. It can escape local minima and reduces the chances of getting stuck near saddle points.

In practice, SGD is often applied with a _learning rate schedule_, where the learning rate $\alpha$ starts at a high value and is decreased by a constant factor every $N$ epochs. The logic is that **in the early stages of training, we want the algorithm to explore the parameter space, jump from valley to valley to find a sensible region. In later stages, we are roughly in the right place and are more concerned with fine-tuning the parameters**.

### Momentum

SGD is slow to start because it makes very small updates to the parameters. It is also noisy because it uses a small batch of data to compute the gradient. **Momentum** is a method that accelerates SGD in the relevant direction and dampens oscillations.

$$
\mathbf{m}_{t+1} \leftarrow \beta \mathbf{m}_t + (1 - \beta) \sum_{\mathbf{x_i, y_i} \in \mathcal{B}} \frac{\partial L[\mathbf{x_i, y_i, \phi_t}]}{\partial\phi}\\
\mathbf{\phi}_{t+1} \leftarrow \mathbf{\phi}_t - \alpha \mathbf{m}_{t+1}
$$

where $\mathbf{m}_{t}$ is the momentum, $\beta$ is the momentum parameter. The momentum parameter $\beta \in[0,1)$ controls the amount of momentum to apply. A typical value for $\beta$ is 0.9. The momentum term $\mathbf{m}_t$ is a running average of the gradient. It is initialized to zero and updated at each iteration. The momentum term is a weighted average of the gradients from the past. The effective learning rate **increases** if all these gradients are aligned over multiple iterations but **decreases** if the gradient direction repeatedly changes as the terms in the sum cancel out.

<p align="center">
  <img src="https://media.discordapp.net/attachments/1094676554652602419/1108002588990902374/image.png?width=1993&height=1119" width="full">
</p>

a) shows the normal SGD update. The gradient is noisy and the updates are small. b) shows the momentum SGD update. The momentum term is a running average of the gradient. The effective learning rate increases if all these gradients are aligned over multiple iterations but decreases if the gradient direction repeatedly changes as the terms in the sum cancel out.

For simplicity in the further notes, I will represent the momentum SGD with the following equation:

$$
\mathbf{v}_{t+1} \leftarrow \rho \mathbf{v}_t + \eta\mathbf{g}(\mathbf{\theta}_t)\\
\mathbf{\theta}_{t+1} \leftarrow \mathbf{\theta}_t + \mathbf{v}_{t+1}
$$

where $\mathbf{v}_t$ is the momentum, $\rho$ is the momentum parameter, $\eta$ is the learning rate, $\mathbf{g}(\mathbf{w}_t) = \frac{\partial L}{\partial \mathbf{w}_t}$ is the gradient and $\mathbf{w}_t$ is the parameter.

### Nesterov momentum

_Nesterov momentum_ is a modification of momentum that improves the convergence rate of SGD. It is also known as _Nesterov accelerated gradient_ or _Nesterov accelerated gradient descent_. It is a way to give our momentum term a "look ahead". Instead of evaluating the gradient at the current parameters, we evaluate the gradient at the parameters that our momentum term would cause us to reach at the next step.

$$
\mathbf{v}_{t+1} \leftarrow \rho \mathbf{v}_t + \eta\mathbf{g}(\mathbf{\theta}_t+\rho\mathbf{v}_t)\\
\mathbf{\theta}_{t+1} \leftarrow \mathbf{\theta}_t + \mathbf{v}_{t+1}
$$

### Adagrad

Adagrad is an algorithm for gradient-based optimization that adapts the learning rate to the parameters, performing smaller updates (i.e. low learning rates) for parameters associated with frequently occurring features, and larger updates (i.e. high learning rates) for parameters associated with infrequent features. For this reason, it is well-suited for dealing with sparse data.

$$\mathbf{\theta}_{i,t+1} = \mathbf{\theta}_{i,t} - \frac{\eta}{\epsilon+\sqrt{G_{t,ii} }} g_{i,t} = \mathbf{\theta}_{i,t} - \frac{\eta}{\epsilon+\sqrt{\sum_{\tau=1}^t g_{i,\tau}^2}} g_{i,t}$$

where $G_{t,ii}$ is the sum of the squares of the gradients w.r.t. $\mathbf{w}_i$ up to time step $t$ and $\epsilon$ is a smoothing term that avoids division by zero (usually on the order of $10^{-8}$). The learning rate $\eta$ is typically set to a small value, e.g. 0.01. The initial value of $G_{t,ii}$ is typically set to 1.0.

**Disadvantages**: The main weakness of Adagrad is its accumulation of the squared gradients in the denominator: Since every added term is positive, the accumulated sum keeps growing during training. This in turn **causes the learning rate to shrink and eventually become infinitesimally small**, at which point the algorithm is no longer able to acquire additional knowledge. The following algorithms aim to resolve this flaw.

### RMSProp (Root Mean Square Propagation)

RMSProp is an unpublished, adaptive learning rate method proposed by Geoff Hinton in Lecture 6e of his Coursera Class. RMSProp resolve Adagrad's radically diminishing learning rates, as it can **increase** or **decrease** the learning rate term.

$$
E[g^2]_{t+1} = \gamma E[g^2]_{t} + (1-\gamma) g^2_{t}\\
\theta_{t+1} = \theta_t - \frac{\eta}{\epsilon + \sqrt{E[g^2]_{t+1}}} g_t
$$

where $\gamma$ (discount parameter, $0\leq\gamma\leq 1$) is a decay rate that controls the size of the moving average. $\gamma$ controls how much the previous $E[g^2]_{t}$ is remembered. When a **large gradient** is encountered, $E[g^2]_{t}$ is modefied such that the learning rate is **scared down**. When a **small gradient** is encountered, $E[g^2]_{t}$ is modefied such that the learning rate is **scared up**. Typical values are 0.9, 0.99, 0.999. The parameter $\epsilon$ is a smoothing term that avoids division by zero (usually on the order of $10^{-8}$).

### Adadelta

Adadelta is an extension of Adagrad that seeks to reduce its aggressive, monotonically decreasing learning rate. Instead of accumulating all past squared gradients, Adadelta restricts the window of accumulated past gradients to some fixed size $w$.

$$
E[g^2]_t = \gamma E[g^2]_{t-1} + (1-\gamma) g^2_t\\
\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{E[g^2]_t + \epsilon}} g_t
$$

where $\gamma$ (discount parameter, $0\leq\gamma\leq 1$) is a decay rate that controls the size of the moving average. $\gamma$ controls how much the previous $E[g^2]_{t}$ is remembered. When a **large gradient** is encountered, $E[g^2]_{t}$ is modefied such that the learning rate is **scared down**. When a **small gradient** is encountered, $E[g^2]_{t}$ is modefied such that the learning rate is **scared up**. Typical values are 0.9, 0.99, 0.999. The parameter $\epsilon$ is a smoothing term that avoids division by zero (usually on the order of $10^{-8}$).

### Adam

For a normal gradient descent with a fix step size, it has the following undesirable property: it makes **large** adjustments to params associated with **large gradients** (where perhaps we should be more cautious) and **small** adjustments to params associate with **small gradients** (which perhaps we should explore further). When gradient of the loss surface is much steeper in one direction than another, it is difficualt to choose a learning rate that **(i)** makes good progress in both directions and **(ii)** is stable.

The update rule in Adam includes bias corrections to the estimates of both the first-order moment (the mean) and the second raw moment (the uncentered variance) to account for their initialization at the origin. Adam is known for its **efficiency** and **relatively low memory requirements**.

$$
m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t = \beta_1 m_{t-1} + (1-\beta_1) \sum_{i\in\mathcal{B_t}} \frac{\partial l_i[\phi]}{\partial \phi}\\
v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2 = \beta_2 v_{t-1} + (1-\beta_2) \sum_{i\in\mathcal{B_t}} \left(\frac{\partial l_i[\phi]}{\partial \phi}\right)^2\\
\hat{m}_t = \frac{m_t}{1-\beta_1^t}\\
\hat{v}_t = \frac{v_t}{1-\beta_2^t}
$$

$$
\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t
$$

where $\beta_1$ and $\beta_2$ are the momentum coefficient / decay rate, $0\leq\beta_1,\beta_2\leq 1$. The parameter $\epsilon$ is a smoothing term that avoids division by zero (usually on the order of $10^{-8}$). Note Adam is usually used in a stochastic setting where the gradients and their squares are computed from mini-batches.

### AdamW

AdamW is a variant of Adam proposed by researchers at fast.ai. The main difference between Adam and AdamW is in the way weight decay is handled. In standard Adam, weight decay is included in the calculation of the running averages of the gradients. In AdamW, weight decay is separated from the gradient update step, which makes the decay rate more predictable and controllable. In practice, this often leads to better performance and faster convergence.

$$
\theta_{t+1} = \theta_t - \frac{\eta}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t - \eta \lambda \theta_t
$$

where $\lambda$ is the weight decay coefficient.
