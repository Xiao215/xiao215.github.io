---
title: "Second law of Thermal Dynamics"
---

### Two State System

- **Microstate ($\Omega$)**: each individual outcome
- **Macrostate**: overall properties of the system
- **Multiplicity $\Omega$**: number of microstates corresponding to a given macrostate
  $$\text{Probability of n heads} = \frac{\Omega(n)}{\Omega(\text{all})}$$

### Quantum Harmonic Oscillator

Potential Energy $U = (\frac{1}{2}+n)hf$, where n is the quantum number, and the size of energy unit is $hf$.

<p align="center">
<img src="https://phys.libretexts.org/@api/deki/files/9864/CNX_UPhysics_40_05_states.jpg?revision=1" alt="diagram" width="auto"/>
</p>

### Einstein Solid

- In a three-dimension solid, each atom can oscillate in three different direction. If there are $N$ oscillators, there are only $N/3$ atoms.
- With $N$ oscillation and $q$ energy units,
  $$
  \Omega(N,q)=\begin{pmatrix}
  N+q-1\\
  q
  \end{pmatrix}
  $$
- The following sequence represents a solid with 4 oscillators and 8 energy units, with dot represent energy units and vertical line representing the partition between two oscillation.
<p align="center">
<img src="https://media.discordapp.net/attachments/1094676554652602419/1100945899183669268/image.png?width=2191&height=352" alt="diagram" width="auto"/>
</p>

### Stirling's Approximation

$$
N! \approx N^Ne^{-N}\sqrt{2\pi N}\qquad(N\gg1)\\
\Omega(N,q)\approx\left(\frac{eq}{N}\right)^N
$$

### Entropy

$S$ is the entropy and $\mu$ is the chemical potential.

$$
S\equiv k \text{ln}(\Omega)\\
dS = \frac{1}{T}dU+\frac{P}{T}dV-\frac{\mu}{N}dN
$$
