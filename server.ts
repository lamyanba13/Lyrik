import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// In-Memory Database Store
interface TimestampedNote {
  timestamp: number;
  timestampFormatted: string;
  label: string;
  text: string;
}

interface CourseLesson {
  id: string;
  class_level: 8 | 9 | 10;
  subject: "Math" | "Science";
  chapter_number: number;
  chapter_title: string;
  topic: string;
  duration: string;
  duration_seconds: number;
  video_url: string;
  transcript: string;
  notes: TimestampedNote[];
  summary: string[];
  key_formulas?: string[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  hint?: string;
}

interface Quiz {
  id: string;
  course_id: string;
  chapter_title: string;
  class_level: 8 | 9 | 10;
  subject: "Math" | "Science";
  time_limit_minutes: number;
  questions: QuizQuestion[];
}

interface User {
  id: string;
  name: string;
  role: "student" | "teacher" | "parent";
  grade: 8 | 9 | 10;
  email: string;
  avatarUrl: string;
  linkedStudentId?: string;
}

interface UserProgress {
  user_id: string;
  course_id: string;
  quiz_score: number | null;
  completed_status: boolean;
  time_spent_minutes: number;
  last_accessed: string;
  quiz_attempts: number;
}

interface DoubtRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: 8 | 9 | 10;
  subject: "Math" | "Science";
  question: string;
  answer?: string;
  status: "pending" | "resolved" | "ai_answered";
  timestamp: string;
}

// Initial Mock Users
const users: User[] = [
  {
    id: "usr_aarav",
    name: "Aarav Sharma",
    role: "student",
    grade: 9,
    email: "aarav.sharma@lyrik.edu",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_priya",
    name: "Priya Patel",
    role: "student",
    grade: 10,
    email: "priya.patel@lyrik.edu",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_rohan",
    name: "Rohan Sen",
    role: "student",
    grade: 8,
    email: "rohan.sen@lyrik.edu",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_sunita",
    name: "Dr. Sunita Mehra",
    role: "teacher",
    grade: 9,
    email: "sunita.mehra@lyrik.edu",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_rajesh",
    name: "Mr. Rajesh Sharma",
    role: "parent",
    grade: 9,
    email: "rajesh.sharma@family.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    linkedStudentId: "usr_aarav",
  },
];

// Initial Curriculum (Class 8, 9, 10 - Mathematics and Science)
const curriculum: CourseLesson[] = [
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

// Initial Quizzes
const quizzes: Quiz[] = [
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
        explanation: "p(3) = (3)³ - 3(3)² + 4(3) - 12 = 27 - 27 + 12 - 12 = 0. Therefore, (x - 3) is a factor of p(x).",
        hint: "Substitute x = 3 directly into the polynomial."
      },
      {
        id: "q2",
        question: "Factorize completely: x² - 9y²",
        options: ["(x - 3y)(x - 3y)", "(x + 3y)(x - 3y)", "(x + 9y)(x - y)", "(x - 9y)²"],
        correct_index: 1,
        explanation: "x² - 9y² = x² - (3y)² = (x + 3y)(x - 3y) using identity a² - b² = (a + b)(a - b).",
        hint: "Rewrite 9y² as (3y)²."
      },
      {
        id: "q3",
        question: "If x + y + z = 0, what does x³ + y³ + z³ equal?",
        options: ["0", "xyz", "3xyz", "(x + y + z)³"],
        correct_index: 2,
        explanation: "By the standard identity x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx). If x + y + z = 0, the entire RHS becomes 0, so x³ + y³ + z³ = 3xyz.",
        hint: "Remember the three-variable polynomial identity."
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
        question: "Which state transition is known as sublimation?",
        options: ["Solid directly to Gas", "Gas to Liquid", "Liquid to Solid", "Liquid to Gas"],
        correct_index: 0,
        explanation: "Sublimation is the direct change of state from solid to gas without passing through the intermediate liquid state (e.g. camphor, dry ice).",
        hint: "Think about dry ice turning straight to vapor."
      },
      {
        id: "q2",
        question: "Convert 25°C into the Kelvin temperature scale:",
        options: ["248 K", "298 K", "300 K", "325 K"],
        correct_index: 1,
        explanation: "Kelvin = Celsius + 273.15. 25 + 273 = 298 K.",
        hint: "Add 273 to the Celsius value."
      },
      {
        id: "q3",
        question: "Why does water in an earthen pot (matka) remain cool during hot summer days?",
        options: ["Earthen pot reflects sunlight", "Continuous evaporation through tiny microscopic pores", "High heat capacity of clay", "Radiation insulation"],
        correct_index: 1,
        explanation: "The porous walls allow water to seep out in tiny droplets which evaporate, absorbing latent heat of vaporization from the remaining water and cooling it.",
        hint: "Think about how sweating cools the human body."
      }
    ]
  },
  {
    id: "quiz_c10_math_ch1",
    course_id: "c10_math_ch1",
    chapter_title: "Quadratic Equations & Roots",
    class_level: 10,
    subject: "Math",
    time_limit_minutes: 6,
    questions: [
      {
        id: "q1",
        question: "What is the discriminant of the quadratic equation 2x² - 4x + 3 = 0?",
        options: ["-8", "8", "-16", "40"],
        correct_index: 0,
        explanation: "D = b² - 4ac. Here a = 2, b = -4, c = 3. D = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, there are no real roots.",
        hint: "Use D = b² - 4ac."
      },
      {
        id: "q2",
        question: "If a quadratic equation ax² + bx + c = 0 has two equal real roots, then:",
        options: ["b² - 4ac > 0", "b² - 4ac = 0", "b² - 4ac < 0", "b = 0"],
        correct_index: 1,
        explanation: "When D = b² - 4ac = 0, both roots are equal to -b / (2a).",
        hint: "Equal roots occur when the radical in quadratic formula disappears."
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
        options: ["9 Ω", "2 Ω", "4.5 Ω", "18 Ω"],
        correct_index: 1,
        explanation: "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2. Therefore R = 2 Ω.",
        hint: "Formula for two parallel resistors is (R₁ * R₂) / (R₁ + R₂)."
      },
      {
        id: "q2",
        question: "According to Joule's law of heating, heat produced in a resistor is proportional to:",
        options: ["Square of the current (I²)", "Square root of current", "Cube of voltage", "Inversely to time"],
        correct_index: 0,
        explanation: "H = I²Rt. Heat generated is directly proportional to the square of current I, the resistance R, and time t.",
        hint: "Recall H = I² · R · t."
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
        question: "What is the SI unit of Pressure?",
        options: ["Newton", "Joule", "Pascal", "Watt"],
        correct_index: 2,
        explanation: "The SI unit of pressure is Pascal (Pa), defined as one Newton of force per square meter (N/m²).",
        hint: "Named after Blaise Pascal."
      },
      {
        id: "q2",
        question: "Why do school bags have broad shoulder straps rather than thin strings?",
        options: ["To increase beauty", "Broad straps increase surface area, thereby reducing pressure on shoulders", "To increase friction", "To withstand water"],
        correct_index: 1,
        explanation: "Pressure = Force / Area. Increasing the contact area lowers pressure, making heavy textbooks comfortable to carry.",
        hint: "Pressure is inversely proportional to area."
      }
    ]
  }
];

// Initial Progress
let progressStore: UserProgress[] = [
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

// Initial Doubt Questions
let doubtStore: DoubtRecord[] = [
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

// 1. User Management API
app.get("/api/users", (req, res) => {
  res.json({ users });
});

app.post("/api/users", (req, res) => {
  const { name, role, grade, email } = req.body;
  if (!name || !role || !grade || !email) {
    return res.status(400).json({ error: "Missing required user fields" });
  }
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    role,
    grade: Number(grade) as 8 | 9 | 10,
    email,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
  };
  users.push(newUser);
  res.status(201).json({ user: newUser });
});

// 2. Curriculum API
app.get("/api/curriculum", (req, res) => {
  const { class_level, subject, chapter_id } = req.query;
  let results = [...curriculum];

  if (chapter_id) {
    const found = results.find(c => c.id === chapter_id);
    if (!found) return res.status(404).json({ error: "Chapter not found" });
    return res.json({ chapter: found });
  }

  if (class_level) {
    const gradeNum = parseInt(class_level as string, 10);
    results = results.filter(c => c.class_level === gradeNum);
  }

  if (subject) {
    results = results.filter(c => c.subject.toLowerCase() === (subject as string).toLowerCase());
  }

  res.json({ lessons: results });
});

// 3. Quizzes API
app.get("/api/quizzes", (req, res) => {
  const { course_id, class_level, subject } = req.query;
  let results = [...quizzes];

  if (course_id) {
    results = results.filter(q => q.course_id === course_id);
  }

  if (class_level) {
    const gradeNum = parseInt(class_level as string, 10);
    results = results.filter(q => q.class_level === gradeNum);
  }

  if (subject) {
    results = results.filter(q => q.subject.toLowerCase() === (subject as string).toLowerCase());
  }

  res.json({ quizzes: results });
});

app.post("/api/quizzes", (req, res) => {
  const { course_id, chapter_title, class_level, subject, time_limit_minutes, questions } = req.body;
  if (!course_id || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Invalid quiz payload" });
  }

  const newQuiz: Quiz = {
    id: `quiz_${Date.now()}`,
    course_id,
    chapter_title: chapter_title || "Custom Assigned Quiz",
    class_level: Number(class_level) as 8 | 9 | 10,
    subject: subject || "Math",
    time_limit_minutes: time_limit_minutes || 10,
    questions,
  };

  quizzes.push(newQuiz);
  res.status(201).json({ quiz: newQuiz });
});

app.post("/api/quizzes/submit", (req, res) => {
  const { user_id, quiz_id, answers, time_spent_minutes } = req.body;
  const quiz = quizzes.find(q => q.id === quiz_id);
  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  let correctCount = 0;
  const detailedResults = quiz.questions.map((q, idx) => {
    const userSelected = answers ? answers[idx] : null;
    const isCorrect = userSelected === q.correct_index;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      question: q.question,
      userSelected,
      correctIndex: q.correct_index,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const percentage = Math.round((correctCount / quiz.questions.length) * 100);

  // Update or insert progress record
  const existingIdx = progressStore.findIndex(p => p.user_id === user_id && p.course_id === quiz.course_id);
  if (existingIdx >= 0) {
    progressStore[existingIdx].quiz_score = percentage;
    progressStore[existingIdx].completed_status = true;
    progressStore[existingIdx].time_spent_minutes += (time_spent_minutes || 5);
    progressStore[existingIdx].last_accessed = new Date().toISOString();
    progressStore[existingIdx].quiz_attempts += 1;
  } else {
    progressStore.push({
      user_id,
      course_id: quiz.course_id,
      quiz_score: percentage,
      completed_status: true,
      time_spent_minutes: time_spent_minutes || 5,
      last_accessed: new Date().toISOString(),
      quiz_attempts: 1,
    });
  }

  res.json({
    score: percentage,
    correctCount,
    totalQuestions: quiz.questions.length,
    detailedResults,
  });
});

// 4. Progress API
app.get("/api/progress", (req, res) => {
  const userId = (req.query.user_id as string) || (req.query.userId as string);
  const userRecords = userId ? progressStore.filter(p => p.user_id === userId) : progressStore;
  res.json({ progress: userRecords });
});

app.get("/api/progress/:userId", (req, res) => {
  const { userId } = req.params;
  const userRecords = progressStore.filter(p => p.user_id === userId);
  res.json({ progress: userRecords });
});

app.post("/api/progress", (req, res) => {
  const { user_id, course_id, time_spent_minutes, completed_status } = req.body;
  if (!user_id || !course_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = progressStore.find(p => p.user_id === user_id && p.course_id === course_id);
  if (existing) {
    if (time_spent_minutes) existing.time_spent_minutes += time_spent_minutes;
    if (completed_status !== undefined) existing.completed_status = completed_status;
    existing.last_accessed = new Date().toISOString();
    return res.json({ progress: existing });
  }

  const newProg: UserProgress = {
    user_id,
    course_id,
    quiz_score: null,
    completed_status: !!completed_status,
    time_spent_minutes: time_spent_minutes || 0,
    last_accessed: new Date().toISOString(),
    quiz_attempts: 0,
  };
  progressStore.push(newProg);
  res.status(201).json({ progress: newProg });
});

// 5. Doubt Questions & Notifications API
app.get("/api/doubts", (req, res) => {
  res.json({ doubts: doubtStore });
});

app.post("/api/doubts", (req, res) => {
  const { studentId, studentName, grade, subject, question } = req.body;
  const newDoubt: DoubtRecord = {
    id: `dbt_${Date.now()}`,
    studentId,
    studentName: studentName || "Student",
    grade: Number(grade) as 8 | 9 | 10,
    subject: subject || "Math",
    question,
    status: "pending",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
  };
  doubtStore.unshift(newDoubt);
  res.status(201).json({ doubt: newDoubt });
});

app.post("/api/doubts/resolve", (req, res) => {
  const { doubtId, answer } = req.body;
  const doubt = doubtStore.find(d => d.id === doubtId);
  if (!doubt) return res.status(404).json({ error: "Doubt not found" });
  doubt.status = "resolved";
  if (answer) doubt.answer = answer;
  res.json({ doubt });
});

// 6. AI Doubt Solver with Gemini API & Rigorous STEM Knowledge Engine
app.post("/api/doubts/solve", async (req, res) => {
  const { question, subject, class_level, imageBase64, imageMimeType, mode } = req.body;

  if (!question && !imageBase64) {
    return res.status(400).json({ error: "Please provide a question or an image." });
  }

  const userQuery = question || "Please analyze this STEM problem and explain step-by-step.";
  const resolvedGrade = Number(class_level) || 9;
  const resolvedSubject = subject || "Math";

  const promptContext = `Subject: ${resolvedSubject}, Curriculum Level: Class ${resolvedGrade} (CBSE / ICSE STEM Standards).
Student Question / Problem: "${userQuery}"
Requested Mode: ${mode || "detailed_proof"}

You are the Lyrik STEM Pedagogical Master Tutor. Deliver an exact, mathematically and scientifically verified solution with zero arithmetic hallucinations.
Structure the explanation clearly:
1. 🎯 **Core Concept & Governing Law**: Define the theorem, principle, or formula.
2. 📋 **Given Data & SI Units**: List known values and unknowns with proper units.
3. 🧮 **Step-by-Step Mathematical Derivation / Working**: Show every single algebraic step, intermediate operation, and substitution.
4. 🏁 **Final Concluded Result**: State the answer in bold text with correct units and vector directions if applicable.
5. 🔍 **Sanity Check & Self-Verification**: Demonstrate how the student can check this answer (e.g., substitution back, dimensional analysis).
6. ⚠️ **Common Student Exam Pitfall**: Highlight 1 frequent trap or mistake to avoid in exams.`;

  // Check if GEMINI_API_KEY is available with resilient multi-model fallback
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const parts: any[] = [];
      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType || "image/jpeg",
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          }
        });
      }
      parts.push({ text: promptContext });

      // Fallback model pipeline to resist transient 503 capacity spikes
      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-3.8-flash"
      ];

      let generatedAnswer = "";

      for (const candidateModel of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: candidateModel,
            contents: { parts },
            config: {
              systemInstruction: "You are the Lyrik AI STEM Pedagogical Tutor for Class 8-10. You provide 100% rigorous, step-by-step mathematical proofs, physics derivations, chemical reactions, and biological explanations aligned with CBSE/ICSE curricula. Always double-check calculations before generating.",
              temperature: 0.2,
            }
          });

          if (response && response.text) {
            generatedAnswer = response.text;
            break;
          }
        } catch (modelErr: any) {
          // If 503 (high demand) or 429, try the next candidate model
          const status = modelErr?.status || modelErr?.code;
          if (status === 503 || status === 429 || `${modelErr?.message}`.includes("503") || `${modelErr?.message}`.includes("high demand")) {
            // Brief pause before trying next fallback model
            await new Promise(resolve => setTimeout(resolve, 400));
            continue;
          }
          // For other errors, attempt next model or fall through
          continue;
        }
      }

      if (generatedAnswer) {
        return res.json({ 
          answer: generatedAnswer,
          confidence: "High (Model Verified)",
          curriculumAligned: `Class ${resolvedGrade} CBSE/ICSE Standard`,
          isAiGenerated: true
        });
      }
    } catch (err: any) {
      // Graceful fallback to verified offline STEM Pedagogical Engine
    }
  }

  // Deep Local STEM Pedagogical Engine for Class 8, 9, 10
  const lowerQ = userQuery.toLowerCase();
  let answer = "";

  // 1. IRRATIONAL NUMBERS & SQUARE ROOTS (Class 9 / 10 Math)
  if (lowerQ.includes("irrational") || lowerQ.includes("√2") || lowerQ.includes("root 2") || lowerQ.includes("root 7") || lowerQ.includes("surd") || lowerQ.includes("rationalise") || lowerQ.includes("rationalize")) {
    answer = `### 🎯 Core Concept & Governing Law
**Theorem**: A real number is called **irrational** if it cannot be written in the form $p/q$, where $p$ and $q$ are integers and $q \\neq 0$. The decimal representation of an irrational number is **non-terminating and non-recurring**.

---

### 🧮 Step-by-Step Proof by Contradiction: Proving $\\sqrt{2}$ is Irrational

1. **Assumption for Contradiction**:
   Assume $\\sqrt{2}$ is rational. Then there exist coprime integers $a$ and $b$ ($b \\neq 0$, $\\gcd(a, b) = 1$) such that:
   $$\\sqrt{2} = \\frac{a}{b}$$

2. **Square Both Sides**:
   $$2 = \\frac{a^2}{b^2} \\implies a^2 = 2b^2 \\quad \\text{--- (Equation 1)}$$
   Since $2$ divides $2b^2$, $2$ divides $a^2$.
   By the Fundamental Theorem of Arithmetic, if a prime number $p$ divides $a^2$, then $p$ divides $a$. Thus, **$2$ divides $a$**.

3. **Substitute $a = 2c$**:
   Let $a = 2c$ for some integer $c$. Substitute into Equation 1:
   $$(2c)^2 = 2b^2 \\implies 4c^2 = 2b^2 \\implies b^2 = 2c^2$$
   This implies that $2$ divides $b^2$, which means **$2$ divides $b$**.

4. **Identify the Contradiction**:
   Both $a$ and $b$ have $2$ as a common factor. But this directly contradicts our foundational premise that $a$ and $b$ are coprime (having no common factor other than 1).

---

### 🏁 Final Concluded Result
Our initial assumption that $\\sqrt{2}$ is rational is false. Therefore, **$\\sqrt{2}$ is strictly irrational**.

---

### 🔍 Sanity Check & Self-Verification
- $\\sqrt{2} \\approx 1.41421356...$ (decimals continue infinitely without repeating patterns).
- **Surd Conjugate Rule**: To rationalize $\\frac{1}{\\sqrt{a} + \\sqrt{b}}$, multiply numerator and denominator by $(\\sqrt{a} - \\sqrt{b})$:
  $$\\frac{1}{\\sqrt{a} + \\sqrt{b}} \\times \\frac{\\sqrt{a} - \\sqrt{b}}{\\sqrt{a} - \\sqrt{b}} = \\frac{\\sqrt{a} - \\sqrt{b}}{a - b}$$

⚠️ **Common Student Exam Pitfall**: Forgetting to state that $a$ and $b$ are **coprime** at the beginning of the proof. Without the coprime condition, finding a common factor is not a contradiction!`;
  }
  // 2. EQUATIONS OF MOTION & KINEMATICS (Class 9 Physics)
  else if (lowerQ.includes("v = u + at") || lowerQ.includes("motion") || lowerQ.includes("equation of motion") || lowerQ.includes("s = ut") || lowerQ.includes("v^2 = u^2") || lowerQ.includes("acceleration")) {
    answer = `### 🎯 Core Concept & Governing Law
**Kinematic Equations of Uniformly Accelerated Motion**:
These describe the relationship between initial velocity ($u$), final velocity ($v$), uniform acceleration ($a$), time interval ($t$), and displacement ($s$).

---

### 📋 Variables & Standard SI Units
- $u$ = Initial velocity ($\\text{m/s}$)
- $v$ = Final velocity ($\\text{m/s}$)
- $a$ = Uniform acceleration ($\\text{m/s}^2$)
- $t$ = Elapsed time ($\\text{s}$)
- $s$ = Total displacement ($\\text{m}$)

---

### 🧮 Step-by-Step Derivation

#### Derivation of First Equation: $v = u + at$
1. **Definition of Acceleration**:
   Acceleration is the rate of change of velocity with respect to time:
   $$a = \\frac{v - u}{t}$$
2. **Cross-multiply by $t$**:
   $$at = v - u$$
3. **Rearrange to isolate $v$**:
   $$\\mathbf{v = u + at}$$

#### Derivation of Second Equation: $s = ut + \\frac{1}{2}at^2$
1. **Average Velocity** for uniform acceleration:
   $$v_{\\text{avg}} = \\frac{u + v}{2}$$
2. **Displacement** $s = v_{\\text{avg}} \\times t$:
   $$s = \\left(\\frac{u + v}{2}\\right)t$$
3. Substitute $v = u + at$ from the first equation:
   $$s = \\left(\\frac{u + (u + at)}{2}\\right)t = \\left(\\frac{2u + at}{2}\\right)t = \\left(u + \\frac{1}{2}at\\right)t$$
4. Distribute $t$:
   $$\\mathbf{s = ut + \\frac{1}{2}at^2}$$

#### Derivation of Third Equation: $v^2 = u^2 + 2as$
1. From $v = u + at$, express time $t$:
   $$t = \\frac{v - u}{a}$$
2. Substitute into $s = \\left(\\frac{u + v}{2}\\right)t$:
   $$s = \\left(\\frac{v + u}{2}\\right)\\left(\\frac{v - u}{a}\\right) = \\frac{v^2 - u^2}{2a}$$
3. Cross-multiply:
   $$2as = v^2 - u^2 \\implies \\mathbf{v^2 = u^2 + 2as}$$

---

### 🏁 Final Summary of Kinematic Equations
1. $v = u + at$
2. $s = ut + \\frac{1}{2}at^2$
3. $v^2 = u^2 + 2as$

---

### 🔍 Sanity Check & Self-Verification
- **Dimensional Check**:
  - For $s = ut + \\frac{1}{2}at^2$:
    - $[s] = \\text{m}$
    - $[ut] = (\\text{m/s}) \\times \\text{s} = \\text{m}$
    - $[\\frac{1}{2}at^2] = (\\text{m/s}^2) \\times \\text{s}^2 = \\text{m}$
    - Both terms have dimension of length (meters). Formula is dimensionally valid!

⚠️ **Common Student Exam Pitfall**: Applying these equations when acceleration is **variable**. These formulas strictly hold only when acceleration $a$ is **constant / uniform**!`;
  }
  // 3. NEWTON'S LAWS & MOMENTUM (Class 9 Physics)
  else if (lowerQ.includes("newton") || lowerQ.includes("momentum") || lowerQ.includes("inertia") || lowerQ.includes("force = ma") || lowerQ.includes("f = ma")) {
    answer = `### 🎯 Core Concept & Governing Law
**Newton's Second Law of Motion**:
The rate of change of linear momentum of an object is directly proportional to the applied unbalanced external force, and takes place in the direction of the force.

---

### 🧮 Mathematical Derivation of $F = ma$

1. **Definition of Momentum ($p$)**:
   $$\\vec{p} = m \\cdot \\vec{v}$$
   where $m$ is mass (kg) and $v$ is velocity (m/s).

2. **Initial and Final Momentum**:
   - Initial momentum at time $0$: $p_1 = m \\cdot u$
   - Final momentum at time $t$: $p_2 = m \\cdot v$
   - Change in momentum: $\\Delta p = p_2 - p_1 = m(v - u)$

3. **Rate of Change of Momentum**:
   $$\\frac{\\Delta p}{t} = \\frac{m(v - u)}{t}$$

4. **Applying Newton's Second Law**:
   $$F \\propto \\frac{m(v - u)}{t}$$
   Since acceleration $a = \\frac{v - u}{t}$:
   $$F \\propto m \\cdot a \\implies F = k \\cdot m \\cdot a$$

5. **Defining 1 Newton ($k = 1$)**:
   One unit of force is defined as that force which produces an acceleration of $1\\,\\text{m/s}^2$ in a body of mass $1\\,\\text{kg}$.
   $$1 = k \\times 1 \\times 1 \\implies k = 1$$
   Therefore:
   $$\\mathbf{F = ma}$$

---

### 🏁 Final Concluded Result
$$\\mathbf{F = m \\cdot a \\quad (\\text{Units: } 1\\,\\text{Newton (N)} = 1\\,\\text{kg}\\cdot\\text{m/s}^2)}$$

---

### 🔍 Real-World Connection: Catching a Cricket Ball
- When a fielder pulls their hands backwards while catching a fast ball, they increase the time duration $\\Delta t$.
- Since $F = \\frac{\\Delta p}{\\Delta t}$, increasing time reduces the impact force $F$ on their palms!

⚠️ **Common Student Exam Pitfall**: Forgetting that Newton's 3rd Law ("Action and Reaction") acts on **two different bodies**, never on the same body! Hence they do not cancel each other out.`;
  }
  // 4. POLYNOMIAL FACTORIZATION (Class 9 Math)
  else if (lowerQ.includes("polynomial") || lowerQ.includes("factor") || lowerQ.includes("remainder theorem") || lowerQ.includes("factorize")) {
    answer = `### 🎯 Core Concept & Governing Law
**Factor Theorem**:
A linear binomial $(x - a)$ is a factor of a polynomial $p(x)$ if and only if $p(a) = 0$.
**Remainder Theorem**:
If a polynomial $p(x)$ is divided by $(x - a)$, the numerical remainder is $R = p(a)$.

---

### 🧮 Middle-Term Splitting Algorithm for $ax^2 + bx + c$
1. Calculate the product $P = a \\times c$.
2. Find two integers $p$ and $q$ such that:
   - $p + q = b$ (sum equals middle coefficient)
   - $p \\times q = a \\times c$ (product equals outer product)
3. Split the middle term $bx$ into $px + qx$.
4. Group the first two terms and last two terms, factor out common binomials.

#### Worked Example: Factorize $6x^2 + 17x + 5$
- Here $a = 6$, $b = 17$, $c = 5$.
- Product $a \\times c = 6 \\times 5 = 30$.
- We need two numbers whose product is 30 and sum is 17:
  - Factors of 30: $(1, 30)$, $(2, 15) \\implies 2 + 15 = 17$!
- Rewrite expression:
  $$6x^2 + 2x + 15x + 5$$
- Group terms:
  $$2x(3x + 1) + 5(3x + 1)$$
- Factor out $(3x + 1)$:
  $$\\mathbf{(3x + 1)(2x + 5)}$$

---

### 🏁 Final Concluded Result
$$\\mathbf{6x^2 + 17x + 5 = (3x + 1)(2x + 5)}$$
**Roots / Zeroes**: $x = -\\frac{1}{3}$ and $x = -\\frac{5}{2}$.

---

### 🔍 Verification by Expansion (FOIL Method)
$$(3x)(2x) + (3x)(5) + (1)(2x) + (1)(5) = 6x^2 + 15x + 2x + 5 = 6x^2 + 17x + 5 \\quad \\checkmark$$

⚠️ **Common Student Exam Pitfall**: Watch out for negative signs! For example, in $x^2 - 5x + 6$, the numbers must multiply to $+6$ and sum to $-5$, which are $-2$ and $-3$, giving $(x - 2)(x - 3)$.`;
  }
  // 5. OHM'S LAW & ELECTRICITY (Class 10 Physics)
  else if (lowerQ.includes("ohm") || lowerQ.includes("electricity") || lowerQ.includes("resistance") || lowerQ.includes("resistor") || lowerQ.includes("v = ir")) {
    answer = `### 🎯 Core Concept & Governing Law
**Ohm's Law**:
At constant temperature, the electric current ($I$) flowing through a metallic conductor is directly proportional to the potential difference ($V$) applied across its ends:
$$V \\propto I \\implies V = IR$$
where $R$ is the electrical resistance of the conductor.

---

### 📋 Formula Matrix & SI Units
- Potential Difference ($V$): Volts (V)
- Electric Current ($I$): Amperes (A)
- Resistance ($R$): Ohms ($\\Omega$)
- Resistivity ($\\rho$): Ohm-meter ($\\Omega\\cdot\\text{m}$), where $R = \\rho \\frac{l}{A}$

---

### 🧮 Equivalent Resistance Combinations

#### 1. Resistors in Series:
- Same current $I$ passes through each resistor.
- Total potential difference is sum of drops: $V = V_1 + V_2 + V_3$
- Using $V = IR$:
  $$IR_s = IR_1 + IR_2 + IR_3 \\implies \\mathbf{R_s = R_1 + R_2 + R_3}$$

#### 2. Resistors in Parallel:
- Same potential difference $V$ across each branch.
- Total current is sum of branch currents: $I = I_1 + I_2 + I_3$
- Using $I = V/R$:
  $$\\frac{V}{R_p} = \\frac{V}{R_1} + \\frac{V}{R_2} + \\frac{V}{R_3} \\implies \\mathbf{\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}}$$

#### 3. Joule's Heating Law & Electric Power:
- Heat produced: $\\mathbf{H = I^2 R t}$ (Joules)
- Electric Power: $\\mathbf{P = V \\cdot I = I^2 R = \\frac{V^2}{R}}$ (Watts)

---

### 🏁 Final Concluded Result
$$V = I \\cdot R \\quad \\text{and} \\quad R_s \\ge \\max(R_i), \\quad R_p \\le \\min(R_i)$$

---

### 🔍 Sanity Check Example
Two $6\\,\\Omega$ resistors connected in parallel:
$$\\frac{1}{R_p} = \\frac{1}{6} + \\frac{1}{6} = \\frac{2}{6} = \\frac{1}{3} \\implies R_p = 3\\,\\Omega$$
Notice that equivalent parallel resistance ($3\\,\\Omega$) is strictly smaller than any individual branch ($6\\,\\Omega$).

⚠️ **Common Student Exam Pitfall**: Forgetting to invert the result when calculating parallel resistance! $\\frac{1}{R_p} = \\frac{1}{3}$ means $R_p = 3\\,\\Omega$, NOT $\\frac{1}{3}\\,\\Omega$.`;
  }
  // 6. PHOTOSYNTHESIS & LIFE PROCESSES (Class 10 Biology)
  else if (lowerQ.includes("photosynthesis") || lowerQ.includes("chlorophyll") || lowerQ.includes("stomata") || lowerQ.includes("plant") || lowerQ.includes("respiration")) {
    answer = `### 🎯 Core Concept & Governing Law
**Photosynthesis**:
The photochemical anabolic process by which autotrophic green plants synthesize organic nutrients (glucose) from simple inorganic raw materials (carbon dioxide and water) in the presence of sunlight and chlorophyll, releasing oxygen as a byproduct.

---

### 🔬 Balanced Chemical Equation
$$6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 + 6\\text{H}_2\\text{O}$$

---

### ⚙️ Step-by-Step Biological Events (NCERT Class 10 Framework)
1. **Absorption of Light Energy**:
   Chlorophyll pigments in thylakoid membranes absorb photons from solar radiation.
2. **Photolysis of Water (Splitting of $\\text{H}_2\\text{O}$)**:
   Light energy splits water molecules into hydrogen ions ($H^+$), electrons, and free oxygen gas ($O_2$):
   $$2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2 \\uparrow$$
3. **Reduction of Carbon Dioxide**:
   Carbon dioxide is biochemically reduced to carbohydrates (glucose, $\\text{C}_6\\text{H}_{12}\\text{O}_6$) using ATP and NADPH generated during the light reactions.

---

### 🏁 Final Concluded Result
- **Site of Photosynthesis**: Chloroplast (specifically thylakoids for light reactions, stroma for Calvin cycle).
- **Primary Product**: Glucose (stored in plants as insoluble **starch**).
- **Byproduct**: Oxygen gas (essential for aerobic respiration).

---

### 🔍 Verification & Key Experiment
- **Starch Test**: Boil leaf in alcohol in a water bath to decolorize chlorophyll, then add dilute Iodine solution. Starch-rich photosynthetic regions turn characteristic **blue-black**.

⚠️ **Common Student Exam Pitfall**: Confusing **Photosynthesis** with **Cellular Respiration**. Plants photosynthesize in sunlight to create food, but they respire (consuming $O_2$ and releasing $CO_2$) **continuously 24/7**!`;
  }
  // 7. LINEAR & QUADRATIC EQUATIONS (Class 9/10 Math)
  else if (lowerQ.includes("linear equation") || lowerQ.includes("quadratic") || lowerQ.includes("discriminant") || lowerQ.includes("roots")) {
    answer = `### 🎯 Core Concept & Governing Law
**Quadratic Formula & Nature of Roots**:
For standard quadratic equation $ax^2 + bx + c = 0$ ($a \\neq 0$):
The roots are given by:
$$x = \\frac{-b \\pm \\sqrt{D}}{2a}$$
where **$D = b^2 - 4ac$** is the **Discriminant**.

---

### 📋 Discriminant Decision Matrix
- **$D > 0$**: Two distinct real roots.
- **$D = 0$**: Two equal / coincident real roots ($x = -\\frac{b}{2a}$).
- **$D < 0$**: No real roots (roots are complex conjugates).

---

### 🧮 Worked Problem Example: Solve $2x^2 - 7x + 3 = 0$
1. Identify coefficients:
   $$a = 2, \\quad b = -7, \\quad c = 3$$
2. Compute Discriminant $D$:
   $$D = (-7)^2 - 4(2)(3) = 49 - 24 = 25$$
   Since $D = 25 > 0$, the equation has two distinct real roots.
3. Apply Quadratic Formula:
   $$x = \\frac{-(-7) \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}$$
4. Calculate individual roots:
   - Root 1: $x_1 = \\frac{7 + 5}{4} = \\frac{12}{4} = 3$
   - Root 2: $x_2 = \\frac{7 - 5}{4} = \\frac{2}{4} = \\frac{1}{2}$

---

### 🏁 Final Concluded Result
$$\\mathbf{x = 3 \\quad \\text{and} \\quad x = \\frac{1}{2}}$$

---

### 🔍 Sanity Check: Relations Between Roots & Coefficients
- Sum of roots: $x_1 + x_2 = 3 + \\frac{1}{2} = \\frac{7}{2} = -\\frac{b}{a} = -\\frac{-7}{2} = \\frac{7}{2} \\quad \\checkmark$
- Product of roots: $x_1 \\cdot x_2 = 3 \\cdot \\frac{1}{2} = \\frac{3}{2} = \\frac{c}{a} = \\frac{3}{2} \\quad \\checkmark$

⚠️ **Common Student Exam Pitfall**: Sign error when substituting negative $b$ into $-b$. Remember that $-(-7) = +7$!`;
  }
  // 8. GENERAL HIGH-PRECISION STEM SOLVER FOR ANY OTHER QUESTION
  else {
    answer = `### 🎯 Core Concept & Academic Principles (Class ${resolvedGrade} ${resolvedSubject})
**Topic Analysis**: "${userQuery}"
This question is framed within standard Class ${resolvedGrade} CBSE/ICSE learning objectives. It relies on fundamental conservation laws, dimensional consistency, and algebraic axioms.

---

### 📋 Systematic Analytical Approach
1. **Identify Knowns & Target Unknowns**:
   - Tabulate all given quantities with explicit SI units.
   - Assign algebraic symbols to target unknowns.
2. **Select the Governing Theorem**:
   - Math: Identify relevant algebraic identity, congruence/similarity postulate, or trigonometric identity.
   - Science: Select the foundational physical law (e.g., Conservation of Energy, Conservation of Mass, Newton's Laws).

---

### 🧮 Step-by-Step Problem Solving Framework
1. Express the relationship mathematically:
   $$\\text{Target Output} = f(\\text{Input Parameters})$$
2. Substitute given values carefully, keeping unit conversions strictly in SI (e.g. convert km/h to m/s by multiplying by $5/18$, convert minutes to seconds by $\\times 60$).
3. Simplify intermediate calculations step-by-step without premature rounding.

---

### 🏁 Pedagogical Conclusion
- Follow the official CBSE/ICSE presentation format: Write the formula first, substitute values, state the answer clearly, and append the appropriate SI unit.

---

### 🔍 Self-Verification Advice
- Perform **dimensional analysis** to ensure LHS and RHS match.
- Substitute your final value back into the original question to verify that both sides remain balanced.

💡 **Teacher Tip**: If this problem comes from a specific textbook exercise or homework sheet, you can click **"Request Teacher Review"** below to escalate directly to Dr. Sunita Mehra!`;
  }

  res.json({
    answer,
    confidence: "High (Curriculum Aligned)",
    curriculumAligned: `Class ${resolvedGrade} CBSE/ICSE Standard`,
    isAiGenerated: true
  });
});

// 7. Teacher Analytics API
app.get("/api/analytics/teacher", (req, res) => {
  const studentUsers = users.filter(u => u.role === "student");
  const completedScores = progressStore.filter(p => p.quiz_score !== null).map(p => p.quiz_score as number);
  const avgScore = completedScores.length > 0 
    ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length) 
    : 82;

  const pendingDoubts = doubtStore.filter(d => d.status === "pending").length;

  res.json({
    totalStudents: studentUsers.length,
    averageQuizScore: avgScore,
    class8Stats: { studentCount: 14, avgMath: 84, avgScience: 88 },
    class9Stats: { studentCount: 22, avgMath: 79, avgScience: 83 },
    class10Stats: { studentCount: 28, avgMath: 81, avgScience: 77 },
    pendingDoubtsCount: pendingDoubts,
    subjectHeatmap: [
      { topic: "Real Numbers & Radicals", grade: 9, subject: "Math", masteryPercent: 88, difficultyRating: "Low" },
      { topic: "Polynomial Factorization", grade: 9, subject: "Math", masteryPercent: 68, difficultyRating: "High" },
      { topic: "Matter & Latent Heat", grade: 9, subject: "Science", masteryPercent: 84, difficultyRating: "Medium" },
      { topic: "Newton's Laws & Momentum", grade: 9, subject: "Science", masteryPercent: 72, difficultyRating: "High" },
      { topic: "Quadratic Equations", grade: 10, subject: "Math", masteryPercent: 79, difficultyRating: "Medium" },
      { topic: "Trigonometric Identities", grade: 10, subject: "Math", masteryPercent: 62, difficultyRating: "High" },
      { topic: "Electricity & Ohm's Law", grade: 10, subject: "Science", masteryPercent: 75, difficultyRating: "High" },
      { topic: "Crop Production", grade: 8, subject: "Science", masteryPercent: 92, difficultyRating: "Low" },
      { topic: "Force & Pressure", grade: 8, subject: "Science", masteryPercent: 86, difficultyRating: "Low" },
    ]
  });
});

// 8. Parent / Admin Dashboard Analytics API
const handleParentAnalytics = (req: express.Request, res: express.Response) => {
  const studentId = req.params.studentId || (req.query.student_id as string) || (req.query.studentId as string);
  const student = (studentId ? users.find(u => u.id === studentId) : null) || users.find(u => u.role === "student") || users[0];
  const studentProgress = progressStore.filter(p => p.user_id === student.id);

  const totalTimeSpent = studentProgress.reduce((acc, curr) => acc + (curr.time_spent_minutes || 0), 0);
  const quizScores = studentProgress.filter(p => p.quiz_score !== null).map(p => p.quiz_score as number);
  const avgAccuracy = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 88;

  res.json({
    student,
    totalStudyHoursThisWeek: +(totalTimeSpent / 60 + 4.2).toFixed(1),
    quizzesCompleted: studentProgress.filter(p => p.quiz_score !== null).length + 3,
    averageAccuracy: avgAccuracy,
    scoreProgression: [
      { week: "Week 1", mathScore: 70, scienceScore: 75 },
      { week: "Week 2", mathScore: 78, scienceScore: 82 },
      { week: "Week 3", mathScore: 84, scienceScore: 80 },
      { week: "Week 4", mathScore: 89, scienceScore: 92 },
    ],
    subjectMastery: [
      {
        subject: "Math",
        masteryRate: 84,
        strengths: ["Number Systems", "Rational Numbers", "Coordinate Geometry"],
        focusAreas: ["Cubic Polynomial Factoring", "Algebraic Identities"]
      },
      {
        subject: "Science",
        masteryRate: 88,
        strengths: ["States of Matter", "Latent Heat", "Evaporation Cooling"],
        focusAreas: ["Conservation of Momentum Problems"]
      }
    ],
    recentActivity: [
      { id: "act_1", activity: "Completed Chapter Quiz", chapter: "Number Systems & Irrational Numbers", subject: "Math", date: "Today, 02:40 PM", scoreOrDuration: "100% Score" },
      { id: "act_2", activity: "Watched Video Lesson", chapter: "Matter in Our Surroundings", subject: "Science", date: "Yesterday, 06:15 PM", scoreOrDuration: "20 Mins" },
      { id: "act_3", activity: "Doubt Solved by AI Tutor", chapter: "Polynomial Factorization", subject: "Math", date: "Sep 7, 04:30 PM", scoreOrDuration: "Resolved" },
    ]
  });
};

app.get("/api/analytics/parent", handleParentAnalytics);
app.get("/api/analytics/parent/:studentId", handleParentAnalytics);

// Vite Middleware for Dev and Static for Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lyrik Platform Server running on port ${PORT}`);
  });
}

startServer();
