# Startup Survival Simulator - Video Script & M&S Concepts

This document provides a structured video script for explaining the project and a detailed breakdown of the Modeling and Simulation (M&S) concepts implemented.

---

## Part 1: Video Script (The Pitch)

**[Scene: Opening shot of a glowing browser window showing the Neobrutalist UI of the app]**

**Narrator:** "9 out of 10 startups fail. But why? Is it just bad luck, or could it have been predicted?"

**[Scene: Zoom into the 'Run Simulation' button and the Capital Chart filling up with lines]**

**Narrator:** "Welcome to the **Startup Survival Simulator**. This isn't just a calculator—it's a powerful Modeling & Simulation tool designed to stress-test a business's future before the first dollar is even spent."

**[Scene: Screen recording showing the user adjusting sliders for Revenue Mean and Variance]**

**Narrator:** "The project is built on the core concept of **Monte Carlo Simulation**. Instead of guessing one single outcome, we run thousands of 'what-if' scenarios simultaneously. We model reality as a **Stochastic Process**, where revenue isn't just a fixed number, but a variable influenced by market noise and random volatility."

**[Scene: Showing the 'Survival Gauge' and 'Outcome Histogram' updating]**

**Narrator:** "By simulating these thousands of possible futures, we can calculate a precise **Survival Probability**. We use Gaussian distributions for revenue, Bernoulli trials for unexpected cost spikes, and Uniform distributions for funding rounds."

**[Scene: Transition to the 'Animated Run' mode]**

**Narrator:** "From India-specific presets like D2C and Fintech to detailed output analysis, this tool turns abstract risk into actionable data. Whether you're a founder planning your runway or a student studying M&S, the Startup Survival Simulator brings the math of survival to life."

**[Scene: Closing shot with the GitHub link and 'Made with ❤️ by Ritesh']**

**Narrator:** "Predict the unpredictable. Test your survival today."

---

## Part 2: M&S Concepts Used

The project is a practical implementation of various Modeling & Simulation modules. Below are the key concepts used:

### 1. Core Simulation Methodology
*   **Monte Carlo Simulation**: The engine runs 100–5000+ iterations to approximate the probability distribution of a startup's final capital and lifespan.
*   **Terminating Simulation**: Each simulation run has a clear end point—either the startup hits the maximum duration (e.g., 60 months) or it goes bankrupt (capital < 0).
*   **Fixed-Increment Time Advance**: The simulation clock moves forward in discrete monthly steps ($Δt = 1 \text{ month}$).

### 2. Probability & Stochastic Modeling
*   **Stochastic Processes**: The system state (Capital) evolves over time based on random variables, representing a non-deterministic system.
*   **Gaussian (Normal) Distribution**: Used to model monthly revenue and market volatility via the **Box-Muller Transform**, allowing for realistic "noise" in income.
*   **Bernoulli Trials**: Used to model discrete events like "Cost Spikes" or "Funding Success" where there is a fixed probability of an event occurring each month.
*   **Uniform Distribution**: Used to sample the magnitude of random events (e.g., a cost spike might be anywhere between $\$5k$ and $\$20k$ with equal probability).

### 3. Input Modeling & Variate Generation
*   **Random Variate Generation**: The app converts standard uniform random numbers ($Math.random()$) into specific distributions (Normal, Uniform) to simulate real-world data.
*   **Parameter Estimation**: Users act as analysts by providing input parameters like Mean, Variance, and Probability which define the behavior of the model.

### 4. Output Analysis & Verification
*   **Empirical Distributions**: The **Outcome Histogram** visualizes the frequency of different results, turning raw data into a probability density function.
*   **Statistical Measures**: The results panel computes **Mean, Median, Standard Deviation**, and **Percentiles (P10, P90)** to provide a comprehensive risk profile.
*   **Model Verification**: The "Animated Run" mode allows users to track a single simulation step-by-step, ensuring the logic correctly reflects the mathematical model.
