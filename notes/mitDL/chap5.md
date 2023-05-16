---
title: "Chapter 5: Loss function"
---

When we train these models, we seek the parameters that produce the best possible mapping from input to output for the task we are considering. This chapter defines what is meant by the “best possible” mapping.

### Loss function / Cost function

A _loss function_ $L[\phi]$ returns a single number that describes the mismatch between the model prediction $f\mathbf{[x_i, \phi]}$ and their corresponding ground-truth outputs $\mathbf{y_i}$.
