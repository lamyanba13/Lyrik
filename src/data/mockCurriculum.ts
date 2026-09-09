import { CourseLesson, DoubtNotification, Quiz, UserProgress } from "../types";

export const FALLBACK_CURRICULUM: CourseLesson[] = [
  // CLASS 9 MATHEMATICS
  {
    id: "c9_math_ch1",
    class_level: 9,
    subject: "Math",
    chapter_number: 1,
    chapter_title: "Number Systems & Irrational Numbers",
    topic: "Real Numbers, Decimal Expansions, and Surds",
    duration: "18 mins",
    duration_seconds: 1080,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    transcript: "Welcome to Class 9 Number Systems. Today we explore rational versus irrational numbers. A number s is called irrational if it cannot be written in the form p/q, where p and q are integers and q is not zero. Decimal representations of irrational numbers are non-terminating and non-recurring, such as the square root of 2 and pi. Next, we will visualize how to represent root 2 and root 3 on a real number line using the Pythagorean spiral. Finally, we examine the laws of exponents applied to real powers.",
    notes: [
      { timestamp: 35, timestampFormatted: "00:35", label: "Definition of Real Numbers", text: "Real numbers encompass all rational (p/q, q ≠ 0) and irrational non-terminating, non-repeating numbers." },
      { timestamp: 210, timestampFormatted: "03:30", label: "Plotting √2 on Number Line", text: "Construct right triangle with unit legs: hypotenuse = √(1² + 1²) = √2. Swing arc with compass onto x-axis." },
      { timestamp: 480, timestampFormatted: "08:00", label: "Rationalizing Denominators", text: "Multiply numerator and denominator by conjugate pair: 1/(a + √b) * (a - √b)/(a - √b) = (a - √b)/(a² - b)." },
      { timestamp: 720, timestampFormatted: "12:00", label: "Laws of Exponents for Radicals", text: "a^(p/q) = (q-th root of a)^p. Power of powers multiply: (a^p)^q = a^(pq)." }
    ],
    summary: [
      "Every real number is represented by a unique point on the number line.",
      "The sum or difference of a rational and irrational number is always irrational.",
      "Rationalization clears radicals from denominators using difference-of-squares conjugates."
    ],
    key_formulas: [
      "1 / (√a + √b) = (√a - √b) / (a - b)",
      "(a^m) · (a^n) = a^(m + n)",
      "(a^m)^n = a^(m · n)",
      "a^(1/n) = ⁿ√a"
    ]
  },
  {
    id: "c9_math_ch2",
    class_level: 9,
    subject: "Math",
    chapter_number: 2,
    chapter_title: "Polynomials & Factorization",
    topic: "Factor Theorem, Remainder Theorem & Algebraic Identities",
    duration: "22 mins",
    duration_seconds: 1320,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    transcript: "In this lesson on Polynomials, we cover degrees of polynomials, zeroes of a polynomial p(x), and the pivotal Remainder Theorem. When a polynomial p(x) is divided by (x - a), the remainder is p(a). Factor theorem states that (x - a) is a factor of p(x) if and only if p(a) = 0. We then practice middle-term splitting for quadratics ax² + bx + c and cubic polynomial factorizations using trial roots.",
    notes: [
      { timestamp: 40, timestampFormatted: "00:40", label: "Zeroes of a Polynomial", text: "A real number c is a zero of p(x) if p(c) = 0. Linear polynomials have at most 1 zero, quadratics at most 2." },
      { timestamp: 310, timestampFormatted: "05:10", label: "Remainder Theorem Proof", text: "p(x) = (x - a)·q(x) + r. Substituting x = a yields p(a) = 0 + r, so r = p(a)." },
      { timestamp: 620, timestampFormatted: "10:20", label: "Middle Term Splitting", text: "For ax² + bx + c, find factors of (a*c) whose sum equals b." },
      { timestamp: 940, timestampFormatted: "15:40", label: "Three-Variable Identity", text: "x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)." }
    ],
    summary: [
      "Degree of polynomial determines max possible real roots.",
      "Factor Theorem allows easy test for divisors without performing long polynomial division.",
      "If x + y + z = 0, then x³ + y³ + z³ = 3xyz."
    ],
    key_formulas: [
      "(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx",
      "x³ + y³ = (x + y)(x² - xy + y²)",
      "x³ - y³ = (x - y)(x² + xy + y²)",
      "If x + y + z = 0, then x³ + y³ + z³ = 3xyz"
    ]
  },
  {
    id: "c9_math_ch3",
    class_level: 9,
    subject: "Math",
    chapter_number: 3,
    chapter_title: "Linear Equations in Two Variables",
    topic: "General Form ax + by + c = 0 and Graphical Solutions",
    duration: "15 mins",
    duration_seconds: 900,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    transcript: "Every linear equation in two variables has infinitely many solutions and geometrically represents a straight line. In this chapter we learn to find tabular solutions, plot ordered pairs (x, y) on the Cartesian plane, and interpret lines parallel to the coordinate axes like x = a and y = b.",
    notes: [
      { timestamp: 30, timestampFormatted: "00:30", label: "Standard Form", text: "ax + by + c = 0 where a, b, c are real numbers and a, b are not both zero." },
      { timestamp: 240, timestampFormatted: "04:00", label: "Finding Solutions", text: "Assign arbitrary values to x and calculate corresponding y." },
      { timestamp: 500, timestampFormatted: "08:20", label: "Lines Parallel to Axes", text: "x = k is a vertical line parallel to y-axis; y = k is horizontal parallel to x-axis." }
    ],
    summary: [
      "A linear equation in two variables always forms a straight line on the Cartesian plane.",
      "Any point lying on the line satisfies the equation.",
      "The equation of the x-axis is y = 0, and the equation of the y-axis is x = 0."
    ],
    key_formulas: [
      "Standard form: ax + by + c = 0",
      "Slope-intercept: y = mx + c",
      "x-intercept when y = 0: x = -c/a"
    ]
  },

  // CLASS 9 SCIENCE
  {
    id: "c9_sci_ch1",
    class_level: 9,
    subject: "Science",
    chapter_number: 1,
    chapter_title: "Matter in Our Surroundings",
    topic: "States of Matter, Latent Heat, and Evaporation",
    duration: "20 mins",
    duration_seconds: 1200,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    transcript: "Matter is anything that occupies space and has mass. The particulate nature of matter tells us particles have spaces between them, attract each other, and are in continuous motion. We observe how kinetic energy increases with temperature. Then we analyze change of state: melting point, boiling point, latent heat of fusion (heat required to convert 1kg solid to liquid at atmospheric pressure), latent heat of vaporization, and sublimation like dry ice and camphor.",
    notes: [
      { timestamp: 50, timestampFormatted: "00:50", label: "Characteristics of Particles", text: "Small, have spaces between them, continuous kinetic motion, intermolecular attraction." },
      { timestamp: 360, timestampFormatted: "06:00", label: "Latent Heat of Fusion", text: "Temperature remains constant during phase change because heat is used to break intermolecular bonds." },
      { timestamp: 680, timestampFormatted: "11:20", label: "Sublimation vs Deposition", text: "Direct solid-to-gas transition without liquid phase (e.g. Ammonium chloride, solid CO₂)." },
      { timestamp: 950, timestampFormatted: "15:50", label: "Factors Affecting Evaporation", text: "Surface area (+), temperature (+), humidity (-), wind speed (+)." }
    ],
    summary: [
      "During state transitions, temperature remains constant due to latent heat.",
      "Evaporation causes cooling because high-energy particles leave the surface.",
      "Pressure and temperature jointly decide state of matter (triple point concept)."
    ],
    key_formulas: [
      "Kelvin to Celsius: K = °C + 273.15",
      "Heat Energy: Q = m · L (where L is latent heat)",
      "Density = Mass / Volume (ρ = m/V)"
    ]
  },
  {
    id: "c9_sci_ch2",
    class_level: 9,
    subject: "Science",
    chapter_number: 2,
    chapter_title: "Motion & Laws of Motion",
    topic: "Velocity, Acceleration, and Newton's Three Laws",
    duration: "25 mins",
    duration_seconds: 1500,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    transcript: "Motion is described through distance, displacement, speed, and velocity. When velocity changes over time, an object undergoes acceleration. We derive the three equations of uniformly accelerated motion: v = u + at, s = ut + 0.5at², and v² = u² + 2as. Moving to Newton's laws: First Law gives inertia, Second Law defines Force as rate of change of momentum (F = ma), and Third Law establishes equal and opposite action-reaction pairs.",
    notes: [
      { timestamp: 60, timestampFormatted: "01:00", label: "Scalar vs Vector in Motion", text: "Distance is scalar; displacement is vector with magnitude and direction from origin." },
      { timestamp: 420, timestampFormatted: "07:00", label: "Deriving v = u + at", text: "From definition: a = (v - u)/t => v - u = at => v = u + at." },
      { timestamp: 780, timestampFormatted: "13:00", label: "Newton's 2nd Law & Momentum", text: "Momentum p = mv. Force = dp/dt = m(v - u)/t = ma." },
      { timestamp: 1100, timestampFormatted: "18:20", label: "Conservation of Momentum", text: "In an isolated system, total momentum before collision = total momentum after collision: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂." }
    ],
    summary: [
      "Uniform circular motion involves constant speed but continuous acceleration towards center.",
      "Inertia depends directly on the mass of an object.",
      "Action and reaction forces always act on two different bodies simultaneously."
    ],
    key_formulas: [
      "v = u + at",
      "s = ut + ½ at²",
      "v² = u² + 2as",
      "F = ma = m(v - u)/t",
      "p = mv (Momentum)"
    ]
  },

  // CLASS 10 MATHEMATICS
  {
    id: "c10_math_ch1",
    class_level: 10,
    subject: "Math",
    chapter_number: 1,
    chapter_title: "Quadratic Equations & Roots",
    topic: "Discriminant, Nature of Roots, and Quadratic Formula",
    duration: "24 mins",
    duration_seconds: 1440,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    transcript: "Quadratic equations of the form ax² + bx + c = 0 are foundational to high school algebra. We explore the quadratic formula derived via completing the square: x = (-b ± √(b² - 4ac)) / (2a). The discriminant D = b² - 4ac dictates the nature of the roots: real and distinct when D > 0, real and equal when D = 0, and non-real imaginary roots when D < 0.",
    notes: [
      { timestamp: 45, timestampFormatted: "00:45", label: "Standard Quadratic Form", text: "ax² + bx + c = 0 where a ≠ 0." },
      { timestamp: 360, timestampFormatted: "06:00", label: "The Quadratic Formula", text: "x = (-b ± √D) / 2a where D = b² - 4ac." },
      { timestamp: 720, timestampFormatted: "12:00", label: "Discriminant Analysis", text: "D > 0 (2 distinct roots), D = 0 (2 equal roots), D < 0 (no real roots)." }
    ],
    summary: [
      "Sum of roots α + β = -b/a, product of roots α·β = c/a.",
      "Completing the square gives geometric insight into the parabolic vertex.",
      "Roots are real only when discriminant is non-negative."
    ],
    key_formulas: [
      "D = b² - 4ac",
      "x = (-b ± √(b² - 4ac)) / (2a)",
      "α + β = -b/a",
      "α · β = c/a"
    ]
  },
  {
    id: "c10_math_ch2",
    class_level: 10,
    subject: "Math",
    chapter_number: 2,
    chapter_title: "Trigonometry & Heights and Distances",
    topic: "Trig Ratios, Standard Angles (0-90°), and Pythagorean Identities",
    duration: "26 mins",
    duration_seconds: 1560,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    transcript: "Trigonometry connects angle measures to side length ratios in right triangles. We define sin, cos, tan, cosec, sec, and cot. We memorize exact values for 0°, 30°, 45°, 60°, and 90°. Then we prove the core identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, and 1 + cot²θ = cosec²θ. We conclude with practical angle of elevation and angle of depression problems.",
    notes: [
      { timestamp: 60, timestampFormatted: "01:00", label: "Ratios in Right Triangle", text: "sin θ = Opposite/Hypotenuse, cos θ = Adjacent/Hypotenuse, tan θ = Opposite/Adjacent." },
      { timestamp: 480, timestampFormatted: "08:00", label: "Standard Angles Table", text: "sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2. tan 45° = 1." },
      { timestamp: 920, timestampFormatted: "15:20", label: "Fundamental Identities", text: "sin²θ + cos²θ = 1. Dividing by cos²θ gives tan²θ + 1 = sec²θ." }
    ],
    summary: [
      "Values of sin θ increase from 0 to 1 as θ goes from 0° to 90°.",
      "Angle of elevation is measured upward from horizontal line of sight.",
      "Trigonometric identities hold true for all valid angle values."
    ],
    key_formulas: [
      "sin² θ + cos² θ = 1",
      "1 + tan² θ = sec² θ",
      "1 + cot² θ = cosec² θ",
      "tan θ = sin θ / cos θ"
    ]
  },

  // CLASS 10 SCIENCE
  {
    id: "c10_sci_ch1",
    class_level: 10,
    subject: "Science",
    chapter_number: 1,
    chapter_title: "Chemical Reactions & Equations",
    topic: "Balancing Equations, Types of Reactions, Redox & Corrosion",
    duration: "21 mins",
    duration_seconds: 1260,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    transcript: "Chemical reactions transform substances through bond breaking and bond formation. A balanced equation adheres to the Law of Conservation of Mass. We categorize reactions: Combination (CaO + H₂O -> Ca(OH)₂), Decomposition (Thermal, Electrolytic, Photolytic), Displacement (Fe + CuSO₄ -> FeSO₄ + Cu), Double Displacement (Precipitation), and Redox reactions involving oxidation (loss of e⁻ or gain of O) and reduction.",
    notes: [
      { timestamp: 40, timestampFormatted: "00:40", label: "Balancing Equations", text: "Total mass of elements present in products must equal reactants. Count atoms on each side." },
      { timestamp: 350, timestampFormatted: "05:50", label: "Decomposition Types", text: "Thermal (heat), Electrolysis of water (electricity), AgCl in sunlight (photochemical)." },
      { timestamp: 700, timestampFormatted: "11:40", label: "Redox Concept", text: "Oxidation is gain of oxygen or loss of hydrogen. Reduction is gain of hydrogen or loss of oxygen." }
    ],
    summary: [
      "Exothermic reactions release energy; endothermic reactions absorb heat.",
      "Precipitation reactions yield insoluble ionic salts.",
      "Antioxidants and nitrogen flushing prevent rancidity of fats."
    ],
    key_formulas: [
      "Combination: A + B → AB",
      "Decomposition: AB → A + B",
      "Displacement: A + BC → AC + B",
      "Double Displacement: AB + CD → AD + CB"
    ]
  },
  {
    id: "c10_sci_ch2",
    class_level: 10,
    subject: "Science",
    chapter_number: 2,
    chapter_title: "Electricity & Ohm's Law",
    topic: "Electric Current, Potential Difference, Resistance & Joule's Heating",
    duration: "23 mins",
    duration_seconds: 1380,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    transcript: "Current I is the rate of flow of electric charges: I = Q/t. Potential difference V between two points is work done per unit charge: V = W/Q. Ohm's Law states that at constant temperature, current through a conductor is directly proportional to potential difference: V = IR. We compute equivalent resistance for series (R = R₁ + R₂) and parallel circuits (1/R = 1/R₁ + 1/R₂), ending with Joule's Heating Law H = I²Rt.",
    notes: [
      { timestamp: 55, timestampFormatted: "00:55", label: "Current & Potential", text: "1 Ampere = 1 Coulomb/second. 1 Volt = 1 Joule/Coulomb." },
      { timestamp: 400, timestampFormatted: "06:40", label: "Ohm's Law Verification", text: "V/I = Constant = R (Resistance in Ohms Ω). Dependent on length, area, resistivity." },
      { timestamp: 800, timestampFormatted: "13:20", label: "Series vs Parallel", text: "Series: current is same, voltage splits. Parallel: voltage is same across branches, currents add." }
    ],
    summary: [
      "Resistivity ρ depends solely on the material and temperature, not dimensions.",
      "Parallel connection reduces overall equivalent resistance.",
      "Electric power P = VI = I²R = V²/R."
    ],
    key_formulas: [
      "I = Q / t",
      "V = W / Q",
      "Ohm's Law: V = I · R",
      "Resistance: R = ρ · (l / A)",
      "Heating Effect: H = I² · R · t"
    ]
  },

  // CLASS 8 MATHEMATICS
  {
    id: "c8_math_ch1",
    class_level: 8,
    subject: "Math",
    chapter_number: 1,
    chapter_title: "Rational Numbers & Operations",
    topic: "Closure, Commutativity, Associativity, and Distributive Property",
    duration: "16 mins",
    duration_seconds: 960,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    transcript: "Welcome Class 8 mathematicians! Rational numbers are numbers expressed as p/q where p and q are integers and q ≠ 0. We inspect algebraic properties across addition, subtraction, multiplication, and division. We identify 0 as the additive identity, 1 as the multiplicative identity, and learn how to find rational numbers between any two given rationals by equalizing denominators or taking midpoints.",
    notes: [
      { timestamp: 30, timestampFormatted: "00:30", label: "Definition of Rationals", text: "Numbers of form p/q with integers p, q and q ≠ 0." },
      { timestamp: 280, timestampFormatted: "04:40", label: "Distributive Property", text: "a(b + c) = ab + ac over addition; a(b - c) = ab - ac over subtraction." },
      { timestamp: 540, timestampFormatted: "09:00", label: "Finding Numbers Between Rationals", text: "There are infinitely many rational numbers between any two rational numbers." }
    ],
    summary: [
      "Rational numbers are closed under addition, subtraction, and multiplication (not division by zero).",
      "Additive inverse of a/b is -a/b; multiplicative inverse (reciprocal) is b/a.",
      "Use mean method (a + b)/2 to find intermediate values."
    ],
    key_formulas: [
      "Additive Inverse: a/b + (-a/b) = 0",
      "Multiplicative Inverse: (a/b) · (b/a) = 1",
      "Distributive Law: a(b + c) = ab + ac"
    ]
  },
  {
    id: "c8_math_ch2",
    class_level: 8,
    subject: "Math",
    chapter_number: 2,
    chapter_title: "Linear Equations in One Variable",
    topic: "Solving Equations with Variables on Both Sides",
    duration: "18 mins",
    duration_seconds: 1080,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    transcript: "An algebraic equation is an equality involving variables. In Class 8, we master linear equations in one variable where highest power is 1. We solve real-world word problems involving ages, perimeter of shapes, currency notes, and consecutive numbers using balance operations and cross-multiplication.",
    notes: [
      { timestamp: 40, timestampFormatted: "00:40", label: "Balancing Equations", text: "Whatever operation is performed on LHS must equally be applied to RHS." },
      { timestamp: 350, timestampFormatted: "05:50", label: "Transposition Method", text: "Transferring terms changes their sign: + becomes -, × becomes ÷." },
      { timestamp: 650, timestampFormatted: "10:50", label: "Cross Multiplication", text: "(ax + b)/(cx + d) = m/n => n(ax + b) = m(cx + d)." }
    ],
    summary: [
      "A linear equation in one variable always has a unique solution.",
      "Parentheses must be expanded first before grouping like terms.",
      "Check solutions by substituting back into original expression."
    ],
    key_formulas: [
      "General linear form: ax + b = 0 (x = -b/a)",
      "Cross multiplication: (a/b) = (c/d) => ad = bc"
    ]
  },

  // CLASS 8 SCIENCE
  {
    id: "c8_sci_ch1",
    class_level: 8,
    subject: "Science",
    chapter_number: 1,
    chapter_title: "Crop Production & Management",
    topic: "Agricultural Practices, Irrigation, Fertilizers, and Harvesting",
    duration: "19 mins",
    duration_seconds: 1140,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    transcript: "To provide food for our expanding population, regular crop production, proper management and distribution is essential. We categorize crops into Kharif (monsoon crops like paddy and maize) and Rabi (winter crops like wheat, gram, mustard). We study the sequential stages: Preparation of soil, Sowing, Adding manure and fertilizers, Modern irrigation (Sprinkler and Drip systems), Protection from weeds, Harvesting, and Safe storage in silos.",
    notes: [
      { timestamp: 30, timestampFormatted: "00:30", label: "Kharif vs Rabi Crops", text: "Kharif: June to September (rainy season). Rabi: October to March (winter season)." },
      { timestamp: 320, timestampFormatted: "05:20", label: "Soil Preparation & Tilling", text: "Loosening soil promotes earthworms and microbes, helps roots breathe easily." },
      { timestamp: 620, timestampFormatted: "10:20", label: "Modern Irrigation", text: "Drip irrigation drops water directly at roots, saving up to 60% water in drought-prone regions." }
    ],
    summary: [
      "Manure is organic and improves soil texture; fertilizers are inorganic mineral salts.",
      "Drip system is the best technique for watering fruit plants and gardens.",
      "Crop rotation replenishes nitrogen naturally with leguminous plants."
    ],
    key_formulas: [
      "Kharif = Rainy season (Paddy, Cotton)",
      "Rabi = Winter season (Wheat, Mustard)",
      "NPK = Nitrogen, Phosphorus, Potassium fertilizers"
    ]
  },
  {
    id: "c8_sci_ch2",
    class_level: 8,
    subject: "Science",
    chapter_number: 2,
    chapter_title: "Force & Pressure",
    topic: "Contact & Non-Contact Forces, Atmospheric Pressure",
    duration: "17 mins",
    duration_seconds: 1020,
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    transcript: "A push or pull on an object is called a force. Forces can change state of motion, speed, direction, or shape of an object. We classify forces into Contact (Muscular, Friction) and Non-Contact (Magnetic, Electrostatic, Gravitational). Then we study Pressure: the force acting on a unit area (P = F/A). Liquids exert pressure on container walls equally in all directions at the same depth, and atmospheric pressure surrounds us.",
    notes: [
      { timestamp: 45, timestampFormatted: "00:45", label: "Effects of Force", text: "Can move stationary object, alter speed, change direction of travel, or deform shape." },
      { timestamp: 340, timestampFormatted: "05:40", label: "Pressure Formula", text: "Pressure = Force / Area. Smaller contact area creates much higher pressure (e.g. sharp needle vs blunt stick)." },
      { timestamp: 680, timestampFormatted: "11:20", label: "Atmospheric Pressure", text: "Weight of air column above us. Decreases as altitude increases." }
    ],
    summary: [
      "Pressure is inversely proportional to area: P = F / A.",
      "Electrostatic force is the force exerted by a charged body on another charged or uncharged body.",
      "Fluids exert pressure equally in all directions at a given depth."
    ],
    key_formulas: [
      "Pressure = Force / Area (P = F / A)",
      "SI unit of Force: Newton (N)",
      "SI unit of Pressure: Pascal (Pa = N/m²)"
    ]
  }
];

export const FALLBACK_QUIZZES: Quiz[] = [
  {
    id: "quiz_c9_math_ch1",
    course_id: "c9_math_ch1",
    chapter_title: "Number Systems & Irrational Numbers",
    class_level: 9,
    subject: "Math",
    time_limit_minutes: 5,
    questions: [
      {
        id: "q1",
        question: "Which of the following numbers is an irrational number?",
        options: ["√4", "√9", "√7", "0.3333... (3/9)"],
        correct_index: 2,
        explanation: "√7 has a non-terminating and non-recurring decimal expansion, whereas √4 = 2 and √9 = 3 are integers, and 0.3333... is rational (1/3).",
        hint: "Check whether the square root evaluates to an exact whole integer."
      },
      {
        id: "q2",
        question: "What is the result when rationalizing the denominator of 1 / (√5 + √2)?",
        options: ["(√5 - √2) / 3", "(√5 + √2) / 3", "(√5 - √2) / 7", "√3 / 5"],
        correct_index: 0,
        explanation: "Multiply numerator and denominator by conjugate (√5 - √2): (1 * (√5 - √2)) / ((√5)² - (√2)²) = (√5 - √2) / (5 - 2) = (√5 - √2) / 3.",
        hint: "Recall the difference of squares identity: (a + b)(a - b) = a² - b²."
      },
      {
        id: "q3",
        question: "Evaluate the expression: (64)^(1/3) * (16)^(1/2)",
        options: ["8", "16", "32", "64"],
        correct_index: 1,
        explanation: "64^(1/3) is the cube root of 64, which is 4. 16^(1/2) is the square root of 16, which is 4. 4 * 4 = 16.",
        hint: "Express 64 as 4³ and 16 as 4²."
      }
    ]
  },
  {
    id: "quiz_c9_math_ch2",
    course_id: "c9_math_ch2",
    chapter_title: "Polynomials & Factorization",
    class_level: 9,
    subject: "Math",
    time_limit_minutes: 5,
    questions: [
      {
        id: "q1",
        question: "If p(x) = x³ - 3x² + 4x - 12, what is the value of p(3)?",
        options: ["0", "6", "-12", "12"],
        correct_index: 0,
        explanation: "p(3) = 3³ - 3(3)² + 4(3) - 12 = 27 - 27 + 12 - 12 = 0. Hence (x - 3) is a factor.",
        hint: "Substitute x = 3 directly into the expression."
      },
      {
        id: "q2",
        question: "Factorize the quadratic expression: x² - 7x + 12",
        options: ["(x - 3)(x - 4)", "(x + 3)(x + 4)", "(x - 2)(x - 6)", "(x - 1)(x - 12)"],
        correct_index: 0,
        explanation: "We look for two numbers whose product is 12 and sum is -7. These are -3 and -4. So (x - 3)(x - 4).",
        hint: "Find factors of +12 that add up to -7."
      },
      {
        id: "q3",
        question: "If x + y + z = 0, what does x³ + y³ + z³ equal?",
        options: ["0", "3xyz", "-3xyz", "(x+y+z)³"],
        correct_index: 1,
        explanation: "By the algebraic identity: x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx). When x + y + z = 0, the RHS becomes 0, so x³ + y³ + z³ = 3xyz.",
        hint: "Recall the 3-variable cubic factorization identity."
      }
    ]
  },
  {
    id: "quiz_c9_sci_ch1",
    course_id: "c9_sci_ch1",
    chapter_title: "Matter in Our Surroundings",
    class_level: 9,
    subject: "Science",
    time_limit_minutes: 5,
    questions: [
      {
        id: "q1",
        question: "Why does the temperature remain constant during the melting of ice into water?",
        options: [
          "Heat is reflected by the ice",
          "Latent heat of fusion is absorbed to overcome intermolecular forces",
          "Thermometers stop working at 0°C",
          "Air surrounding the ice cools it down"
        ],
        correct_index: 1,
        explanation: "The supplied heat is consumed as Latent Heat of Fusion to overcome the attractive forces between solid particles without increasing kinetic energy.",
        hint: "Think about latent (hidden) heat."
      },
      {
        id: "q2",
        question: "Which process involves the direct transformation of a solid into gas without passing through liquid?",
        options: ["Evaporation", "Condensation", "Sublimation", "Transpiration"],
        correct_index: 2,
        explanation: "Sublimation is the direct change of state from solid to gas without becoming a liquid (e.g. Camphor, dry ice).",
        hint: "Dry ice undergoes this process at room temperature."
      },
      {
        id: "q3",
        question: "Convert 300 Kelvin into degrees Celsius (°C):",
        options: ["27°C", "573°C", "26.85°C", "37°C"],
        correct_index: 0,
        explanation: "°C = K - 273.15 ≈ 300 - 273 = 27°C.",
        hint: "Subtract 273 from the Kelvin temperature."
      }
    ]
  },
  {
    id: "quiz_c10_math_ch1",
    course_id: "c10_math_ch1",
    chapter_title: "Quadratic Equations & Roots",
    class_level: 10,
    subject: "Math",
    time_limit_minutes: 5,
    questions: [
      {
        id: "q1",
        question: "For the quadratic equation 2x² - 4x + 3 = 0, what is the nature of the roots?",
        options: ["Two distinct real roots", "Two equal real roots", "No real roots (imaginary)", "Infinite roots"],
        correct_index: 2,
        explanation: "D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, there are no real roots.",
        hint: "Compute the discriminant D = b² - 4ac."
      },
      {
        id: "q2",
        question: "If one root of the quadratic equation 3x² + kx - 6 = 0 is 2, find the value of k:",
        options: ["-3", "3", "-1", "1"],
        correct_index: 0,
        explanation: "Substitute x = 2: 3(2)² + k(2) - 6 = 0 => 12 + 2k - 6 = 0 => 6 + 2k = 0 => k = -3.",
        hint: "Substitute the root value 2 in place of x."
      },
      {
        id: "q3",
        question: "If α and β are roots of x² - 5x + 6 = 0, what is (α² + β²)?",
        options: ["13", "25", "19", "12"],
        correct_index: 0,
        explanation: "α + β = 5, αβ = 6. α² + β² = (α + β)² - 2αβ = 5² - 2(6) = 25 - 12 = 13.",
        hint: "Use identity: α² + β² = (α + β)² - 2αβ."
      }
    ]
  },
  {
    id: "quiz_c10_sci_ch2",
    course_id: "c10_sci_ch2",
    chapter_title: "Electricity & Ohm's Law",
    class_level: 10,
    subject: "Science",
    time_limit_minutes: 5,
    questions: [
      {
        id: "q1",
        question: "Two resistors of 6 Ω and 3 Ω are connected in parallel. What is the equivalent resistance?",
        options: ["9 Ω", "2 Ω", "18 Ω", "0.5 Ω"],
        correct_index: 1,
        explanation: "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2. Therefore R = 2 Ω.",
        hint: "Use the formula: 1/R = 1/R₁ + 1/R₂."
      },
      {
        id: "q2",
        question: "If current I is doubled while resistance R remains constant, the heat generated in time t will:",
        options: ["Double", "Halve", "Quadruple (increase by 4 times)", "Remain unchanged"],
        correct_index: 2,
        explanation: "By Joule's law of heating, H = I²Rt. If I becomes 2I, H' = (2I)²Rt = 4I²Rt.",
        hint: "Look at the power of I in H = I²Rt."
      }
    ]
  },
  {
    id: "quiz_c8_sci_ch2",
    course_id: "c8_sci_ch2",
    chapter_title: "Force & Pressure",
    class_level: 8,
    subject: "Science",
    time_limit_minutes: 5,
    questions: [
      {
        id: "q1",
        question: "Why is a sharp knife more effective at cutting vegetables than a blunt knife?",
        options: [
          "It has more mass",
          "It exerts higher pressure due to smaller contact area for the same force",
          "It reduces friction to zero",
          "It uses electrostatic force"
        ],
        correct_index: 1,
        explanation: "Pressure = Force / Area. A sharper blade has a smaller surface area, producing much higher pressure with the same muscular force.",
        hint: "Think about P = F / A."
      },
      {
        id: "q2",
        question: "Which of the following is an example of a non-contact force?",
        options: ["Muscular force", "Frictional force", "Gravitational force", "Tension force"],
        correct_index: 2,
        explanation: "Gravity acts between masses across empty space without direct physical touch.",
        hint: "Objects don't need to touch each other for this force to act."
      }
    ]
  }
];

export const FALLBACK_PROGRESS: UserProgress[] = [
  {
    user_id: "usr_aarav",
    course_id: "c9_math_ch1",
    quiz_score: 100,
    completed_status: true,
    time_spent_minutes: 38,
    last_accessed: new Date(Date.now() - 3600000 * 4).toISOString(),
    quiz_attempts: 1,
  },
  {
    user_id: "usr_aarav",
    course_id: "c9_math_ch2",
    quiz_score: 66,
    completed_status: true,
    time_spent_minutes: 42,
    last_accessed: new Date(Date.now() - 3600000 * 20).toISOString(),
    quiz_attempts: 1,
  },
  {
    user_id: "usr_aarav",
    course_id: "c9_sci_ch1",
    quiz_score: 100,
    completed_status: true,
    time_spent_minutes: 29,
    last_accessed: new Date(Date.now() - 3600000 * 30).toISOString(),
    quiz_attempts: 1,
  },
  {
    user_id: "usr_priya",
    course_id: "c10_math_ch1",
    quiz_score: 100,
    completed_status: true,
    time_spent_minutes: 48,
    last_accessed: new Date(Date.now() - 3600000 * 12).toISOString(),
    quiz_attempts: 1,
  },
  {
    user_id: "usr_rohan",
    course_id: "c8_sci_ch2",
    quiz_score: 100,
    completed_status: true,
    time_spent_minutes: 25,
    last_accessed: new Date(Date.now() - 3600000 * 48).toISOString(),
    quiz_attempts: 1,
  }
];

export const FALLBACK_DOUBTS: DoubtNotification[] = [
  {
    id: "dbt_1",
    studentId: "usr_aarav",
    studentName: "Aarav Sharma",
    grade: 9,
    subject: "Math",
    question: "How do we prove whether 2 + √3 is irrational using contradiction?",
    answer: "Assume 2 + √3 is rational = p/q (integers p, q ≠ 0). Then √3 = p/q - 2 = (p - 2q)/q. Since p and q are integers, (p - 2q)/q must be rational, which implies √3 is rational. But this contradicts the established fact that √3 is irrational. Hence our assumption was false, proving 2 + √3 is irrational.",
    status: "ai_answered",
    timestamp: "2026-09-08 14:20"
  },
  {
    id: "dbt_2",
    studentId: "usr_priya",
    studentName: "Priya Patel",
    grade: 10,
    subject: "Science",
    question: "Why doesn't the filament of an electric bulb burn out quickly even at high heat?",
    answer: "The filament is made of Tungsten with an exceptionally high melting point (~3422°C). Furthermore, the bulb is filled with chemically inactive gases like Argon and Nitrogen, which prevents oxidation of the filament at glowing temperatures.",
    status: "ai_answered",
    timestamp: "2026-09-08 17:10"
  },
  {
    id: "dbt_3",
    studentId: "usr_rohan",
    studentName: "Rohan Sen",
    grade: 8,
    subject: "Science",
    question: "Why do dams have thicker bases at the bottom than at the top?",
    status: "pending",
    timestamp: "2026-09-08 19:45"
  }
];
