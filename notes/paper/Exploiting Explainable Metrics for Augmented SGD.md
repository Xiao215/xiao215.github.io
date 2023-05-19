### Contribution

1. **New Explainability Metrics**: The researchers introduced new metrics—_stable rank, condition number, and a quality measure_—that can be used to understand how well each layer of a neural network is learning from training data. These metrics are robust, meaning they are not overly sensitive to the randomness of initialization.
2. **Insights into Training Mechanisms**: The researchers used these new metrics to gain insights into how neural networks learn from various optimizers and datasets. They were able to predict how well these networks would generalize—that is, how well they would perform on new, unseen data.
3. **New Optimizer (RMSGD)**: The researchers used these metrics to improve the training process of deep neural networks. They introduced a new optimizer called RMSGD (presumably, this stands for Robust Metric Stochastic Gradient Descent) that offers performance improvements with minimal additional computational cost. This new optimizer also generalizes well across different experimental setups.

### Main draw back of the current method

1. **Lack of Layer-specific Probing**: The first drawback is that many of these measures are defined in terms of the entire network's performance. This means that they can't be used to evaluate the performance of individual layers within a deep network.

2. **Sensitivity to Weight Noise**: The second drawback is that these measures can be sensitive to small changes or "noise" in the weights of the network. This is problematic because weights in a network can fluctuate as the network learns.

### Low-Rank Factorization

1. **Low-Rank Factorization**: It's beneficial to decompose, or break down, the weight matrices of a neural network using low-rank factorization. This method helps to identify the important information that the network is learning during training.
2. **Two Types of Weight Matrices**: The weight matrices to be decomposed could be of two types: from a convolution layer (which has four dimensions) or from a simple linear layer (which can be treated as a 2D tensor). The convolution layer weights are unfolded into a 2D matrix while the linear layer weights are directly used.
3. **Low-Rank Structure**: Once the weight matrix is ready, it is decomposed into a low-rank matrix plus some "noise." The low-rank matrix contains the most crucial information that the network has learned, while the noise represents less important or random information.
4. **Variational Bayesian Matrix Factorization (VBMF)**: They use a specific method called VBMF to perform the low-rank factorization. This method is computationally efficient and can be applied to layers of any size. It provides a robust analysis that isn't overly affected by the randomness of how the weights are initially set up.
5. **Learning Over Time**: At the beginning of training, the weight matrix is full of random information, so the low-rank part doesn't contain much. However, as training progresses, the low-rank part starts to fill up with meaningful information, while the noise fades away. This demonstrates how the network is learning important patterns from the data, improving its ability to encode information over time.

### Probing Metrics

The authors introduce two metrics to evaluate how well a network layer is encoding and propagating information. These metrics are based on the low-rank factorized weight matrices discussed earlier.

1. **Stable Rank**: This metric measures the energy of the singular values of a given matrix. In simple terms, it evaluates how well the layer is representing information. A higher stable rank value means better encoding and stronger information flow through the layer's weight matrix. The authors modify the stable rank definition to be normalized, ensuring that the resulting stable rank values are within the range of 0 to 1.
2. **Condition Number**: This metric measures the ratio between the highest and lowest singular values of a matrix. It indicates the sensitivity of the weight matrix's mapping with respect to input noise perturbations. A lower condition number means higher robustness to noise and better input-output mapping. The authors modify the condition number definition, so the values are within the range of 0 to 1.

### Meaning of probing metrics

1. **Stable Rank**: If the stable rank of a network approaches $s(\mathbf{\hat{W}}_l)\to 1$, it means that most of the singular values are non-zero, which indicates that there is a lot of meaningful information in the weight matrix. This is desirable because it means the network has learned well.
2. **Condition Number**: If the condition number approaches $\kappa(\mathbf{\hat{W}}_l)\to 0$, it suggests that the network is less sensitive to minor changes in input. This is also desirable as it makes the network more robust to noise. If the condition number is high, it means the weight matrix can be significantly affected by small perturbations, which could lead to a poor learning outcome.

### Quality Measure on Learned Network

The authors propose a new quality measure for learned networks. This quality measure is a combination of the **stable rank** and **condition number** metrics.

A quality measure is proposed to be:

$$q(\mathbf{\hat{W}}_l) = \arctan s(\mathbf{\hat{W}}_l) / \kappa(\mathbf{\hat{W}}_l), \text{ where }l\in[L]$$

Due to the arctan function, the quality measure is bounded between 0 and $\pi/2$. The measure is maximized when the stable rank approaches 1 and the condition number approaches 0. The higher the quality measure, the better the network has learned.

The authors also define an overall quality measure for the entire network, $Q$, by aggregating the quality measures of all layers using an L2-norm (Euclidean distance, the distance of the vector coordinate from the origin of the vector space):

$$
Q = \frac{1}{\sqrt{L}}\lVert \mathbf{q}\rVert^2_2=\frac{1}{\sqrt{L}}\sum_{l=1}^L q(\mathbf{\hat{W}}_l)^2\\
\mathbf{q} = [q(\mathbf{\hat{W}}_1), q(\mathbf{\hat{W}}_2), \dots, q(\mathbf{\hat{W}}_L)]
$$

The term $\frac{1}{\sqrt{L}}$ is used to normalize the quality measure so that it is not overly affected by the number of layers in the network. The authors found that this normalization method behaved better than simply taking the mean of the quality measures.

This measure can

- predict a network's generalization ability to unseen data
- quantify the contribution and strength of each layer in the network
- is unaffected by random initialization due to low-rank factorization
