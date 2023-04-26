---
title: "MAT292 Review Notes"
---

## Intro to ODE

- **Order** of DE: $y''+y'+y=0$ order = 2
- **Linear ODE**: do not have $y'*y$ or $(y')^2$
- **Homogeneous** if $g(t)=0$, **Nonhomogeneous** otherwise
- **Autonomous**: no $t$ involved
- **Separable**: $\frac{dy}{dx}=f(t,y)=p(t)q(y)$
- **Stable** Equilibrium: Both inward EQ
- **Unstable** Equilibrium: Both outward EQ
- **Semistable**: one inward, one outward
- Plot: phase plot ($y-y'$), direction field

### Integrating Factor

- Standard form: $u'+p(t)u=g(t)$
- **Integrating Factor**: $\mu(t)=exp\left[\int p(t)dt\right]$
- General Soln: $u=\frac{1}{\mu(t)}\left[\int^{t}_{t_0}\mu(s)g(s)ds+C\right]$

### Existence and Uniqueness: Linear

- $y'+p(t)y=g(t), y(t_0)=y_0$
- $\vec{x}'=P(t)\vec{x}+\vec{g}(t), \vec{x}(t_0)=\vec{y_0}$
- $y''+p(t)y'+g(t)y=0$assume p and g are continuous on an open interval $t_0\in(\alpha, \beta)$, there **exists** a **unique** **solution** in the interval $(\alpha, \beta)$.

### Existence and Uniqueness: Nonlinear

$y'=f(t,y), y(t_0)=y_0$, assume $f$ and $\frac{df}{dy}$ are continuous in some rectangle $(t_0, y_0)\in(\alpha, \beta)\times(\gamma, \delta)$, there **exists** a **unique** solution in some interval $(t_0-h, t_0+h)\subset(\alpha, \beta)\times(\gamma, \delta)$

### Growth

- Exponential growth: $\frac{dy}{dt}=ry$
- Logistic growth: $\frac{dy}{dt}=r(r-\frac{y}{K})y$
- Growth with a threshold: $\frac{dy}{dt}=-r(r-\frac{y}{T})y$
- Logistic growth with a threshold ($T<K$): $\frac{dy}{dt}=-r(r-\frac{y}{T})(1-\frac{y}{K})y$

### Wronskian

- Assume $\lambda_1\neq\lambda_2$
- $\vec{x_1}(t)=e^{\lambda_1t}\vec{v_1},\ \vec{x_2}(t)=e^{\lambda_2t}\vec{v_2}$
- $W[\vec{x_1}, \vec{x_2}](t)=\begin{vmatrix}
v_{11}e^{\lambda_1t}&v_{12}e^{\lambda_2t}\\
v_{21}e^{\lambda_1t}&v_{22}e^{\lambda_2t}
\end{vmatrix}\neq 0$
- $W\neq 0$ so $\{\vec{x_1}, \vec{x_2}\}$ is a **fundamental set**

## ODE behaviour

det(A)=$\lambda_1\times\lambda_2$, tr(A)=$\lambda_1+\lambda_2$

<p align="center">
<img src="https://media.discordapp.net/attachments/1094676554652602419/1100810912874643556/6398dd7854755a5fc72c72f8.png?width=1986&height=1130" alt="diagram" width="400"/>
</p>

### real diff lambda

- $\vec{x}'(t)=\textbf{A}\vec{x}(t),\ \lambda_1\neq\lambda_2$
- $\vec{x}(t)=c_1e^{\lambda_1t}\vec{v_1}+c_2e^{\lambda_2t}\vec{v_2}$

### Imaginary lambda

- $\lambda = \mu \pm i\beta$, $\vec{v}=\vec{a}+i\vec{b}$
- $\vec{x}(t)=c_1e^{\mu t}(a\cos(\beta t)-b\sin(\beta t))+i*c_2e^{\mu t}(a\cos(\beta t)+b\sin(\beta t))$

## Same lambda

- If diff eigenvectors, same as above
- If same eigenvector ($\vec{v}$), as following
- Generalized Eigenvector: $\left(\textbf{A}+\lambda \textbf{I}\right)\vec{w}=\vec{v}$
- $\vec{x}(t)=c_1e^{\lambda_1t}\vec{v}+c_2(te^{\lambda_1t}\vec{v}+e^{\lambda_1t}\vec{w})$

## Local truncation error

$$|e_n|\leq \frac{Mh^2}{2}$$

## Global truncation error

- Error due to many steps
- n of steps =$\frac{T-t_0}{h}$, GTE =$\frac{(T-t_0)Mh}{2}$, $|\phi''(t)|\leq M$

### Eular

Local: $h^2$, Global: $h$  
$f(t_{n+1}, y_{n+1})=y_n+hf(t_n, y_n),\ y'=f(t_n, y_n)$

## Improved Eular

Local: $h^3$, Global: $h^2$  
$y_{n+1}=y_n+\frac{h}{2}\left[f(t_n, y_n)+f(t_{n+1}, y_{n+1})\right]$

## Runge-Kutta

- Local: $h^5$, Global: $h^4$
- $y_{n+1}=y_n+\frac{h}{6}\left[S_{n1}+S_{n2}+S_{n3}+S_{n4}\right]$
- $S_{n1}=f(t_n, y_n)$
- $S_{n2}=f(t_n+\frac{1}{2}h, y_n+\frac{1}{2}hS_{n1})$
- $S_{n3}=f(t_n+\frac{1}{2}h, y_n+\frac{1}{2}hS_{n2})$
- $S_{n4}=f(t_n+h, y_n+hS_{n3})$

## Principle of Superposition

$\vec{x}'=P(t)\vec{x}$, it has solutions $\vec{x_1},...\vec{x_n}$ which creates a vector space $\vec{x}=c_1\vec{x_1}+...+c_n\vec{x_n}$.

## Check linearly independence

<p align="center">
<img src="https://cdn.discordapp.com/attachments/1094676554652602419/1100811287325319290/639931d041d53fda305fb3d7.png" alt="diagram" width="400"/>
</p>

## Second Order ODE

For: $$y''+p(t)y'+q(t)y=g(t), \vec{x}=\begin{bmatrix}
y\\
y'
\end{bmatrix}$$

$$
\vec{x}'=\begin{bmatrix}
0&1\\
-q(t)&-p(t)
\end{bmatrix}\vec{x}+\begin{bmatrix}
0\\
g(t)
\end{bmatrix}
$$

$$
\vec{x}(t_0)=\begin{bmatrix}
y(t_0)\\
y'(t_0)
\end{bmatrix}
$$

### 2nd order homogeneous

1. Diff $\lambda$: $y=c_1e^{\lambda_1t}+c_2e^{\lambda_2t}$
2. Imaginary: $\lambda=\mu\pm\beta, \ y=c_1e^{\mu t}\cos(\beta t)+c_2e^{\mu t}\sin(\beta t)$
3. Same $\lambda$ and only 1 $\vec{v}$: $y=c_1e^{\lambda t}+t*c_2e^{\lambda t}$

### 2nd order nonhomogeneous

$$
A=\begin{bmatrix}
    0&1\\
    -q(t)&-p(t)
\end{bmatrix}, \vec{v}=\begin{bmatrix}
    1\\ \lambda
\end{bmatrix}
$$

1. $ay''+by'+cy=g(t)$
2. $y_g=y_h+y_p$$
3. - $g(t) = \alpha e^{rt} \Rightarrow y=Ae^{rt}$
   - $g(t) = \alpha \sin(\omega t) \text{ or } \alpha \cos(\omega t)\Rightarrow y=A\sin(\omega t)+B\cos(\omega t)$
   - $g(t) = \text{Degree \(n\) polynomial} \Rightarrow y=B_0+B_1t+\dots+B_nt^n$

## Laplace Transform

$$\mathcal{L}\{f\}(s)=F(s)=\int^{\infty}_0e^{-st}f(t)dt$$

### Existance of Laplace Transform

The laplace transform $\mathcal{L}\{f\}(s)$ exists for $s>a$ if:

1. $f$ is piecewise continuous on $0\leq t\leq A \forall A > 0$
2. $f$ is of exponential order so it is bounded by exponential $Ke^{at}$

### Property of Laplace Transform

- If $\mathcal{L}\{f(t)\}=F(s), s>a$, then $\mathcal{L}\{e^{ct}f(t)\}=F(s-c), s>a+c$
- Linearity: $\mathcal{L}\{af(t)+bg(t)\}=aF(s)+bG(s)$
- 1st Deri: $\mathcal{L}\{f'(t)\}=s\mathcal{L}\{f(t)\}-f(0)$
- 2nd Deri: $\mathcal{L}\{f''(t)\}=s^2\mathcal{L}\{f(t)\}-sf(0)-f'(0)$
- n degree: $\mathcal{L}\{f^{(n)}(t)\}=s^n\mathcal{L}\{f(t)\}-s^{n-1}f(0)-...-f^{(n-1)}(0)$
- Convolution: $\mathcal{L}\{(f*g)(t)\}=F\times G$

### Inverse Laplace Transform

$F(s)=\frac{P(s)}{Q(s)}$, partial fraction. If $Q=(s-b)^k$ then $\frac{P(s)}{Q(s)}=\frac{a_1}{(s-b)}+...+\frac{a_k}{(s-b)^k}$
Linearity, $\mathcal{L}^{-1}\{aF+bG\}=a\mathcal{L}^{-1}\{F\}+b\mathcal{L}^{-1}\{G\}$

## Laplace Transform on ODE

- ODE: $ay''+by'+cy=g(t)$
- LT: $(as^2+bs+c)Y(s)-(as+b)y(0)-ay'(0)=G(s)$
- Transfer Function: $H(s)=\frac{1}{as^2+bs+c}$
- $Y(s)=H(s)[(as+b)y_0+ay_1]+H(s)G(s)$

### Step Function

- $\mathcal{L}\{u_{cd}(t)\}=\frac{e^{-ds}}{s}-\frac{e^{-cs}}{s}, d\geq c$
- $\mathcal{L}\{u_{c}(t)f(t-c)\}=e^{-cs}F(s)$

### Laplace Transform on Periodic Function

if $f$ is periodic with period T and piecewise continuous, then $\mathcal{L}\{f(t)\}=\frac{F_T(s)}{1-e^{-sT}}, F_T(s)=F(t){1-e^{-sT}}$

### Dirac Delta Function

- $\delta(t-t_0)$: Value at $t_0$ is 1, else where 0
- $\int_a^bf(t)\delta(t-t_0)dt=f(t_0)$
- $\mathcal{L}\{\delta(t)\}=1$
- $\mathcal{L}\{\delta(t-t_0)\}=e^{-st_0}$

### Convolution

- $(f*g)=\int_0^\infty f(t-\tau)g(\tau)d\tau$
- $(f*g)=(g*f)$
- $f*(g+h)=f*g+f*h$
- $(f*0)=0$
- $f*g=\mathcal{L}^{-1}\{\mathcal{L}\{f\}\mathcal{L}\{g\}\}$

### PDE

<p align="center">
<img src="https://media.discordapp.net/attachments/1094676554652602419/1100811660236689448/6399dc0d85c7bc3bd6de409c.png?width=1493&height=1130" alt="diagram" width="400"/>
</p>
