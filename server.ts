import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse json bodies
app.use(express.json());

// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please add it via the Secrets panel in AI Studio UI.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Procedural fallback ideas generator
function getFallbackIdeas(category: string, keywords: string, teamSize: number) {
  const cleanCategory = category || "Interactive websites";
  const customId = () => `CS-${Math.floor(1000 + Math.random() * 9000)}`;

  const pool: Record<string, Array<{
    title: string;
    description: string;
    features: string[];
    techStack: string[];
    roadmap: string[];
    aliveEnhancements: string[];
  }>> = {
    "AI-powered web utilities": [
      {
        title: "MindWave AI Agent Sandbox",
        description: `A live graphical workspace where decentralized AI models interact within a simulated micro-gravity physical grid. Users drag, scale, and connect functional nodes that synthesize complex logic.`,
        features: [
          "Interactive drag-and-drop neural node connections with spring physics",
          "Real-time visual node status feedback utilizing SVG glow animations",
          "Procedural soundscapes that adapt dynamically based on model routing logic"
        ],
        techStack: ["motion", "Tailwind CSS", "Web Audio API", "D3.js", "lucide-react"],
        roadmap: [
          "Phase 1: Build the physical grid canvas with spring-based node components",
          "Phase 2: Integrate interactive connection cables and Web Audio synthesis",
          "Phase 3: Standardize the state layout and add live telemetry diagnostics"
        ],
        aliveEnhancements: [
          "Nodes softly pulsate and trigger an auditory click upon connection",
          "Dynamic pointer vector tracks trace mouse velocity with particle ripples"
        ]
      },
      {
        title: "AuraScript Intelligent Refactorer",
        description: `An elegant developer portal utilizing abstract visualization of code complexity. As you paste scripts, standard metrics are rendered into high-fidelity fluid blobs and sound waves representing quality.`,
        features: [
          "Dynamic visual mapping of syntax trees into fluid physics blobs",
          "Real-time audio sonification of code health and error concentration",
          "One-click smart refactoring with visual layout reorganization"
        ],
        techStack: ["motion", "HTML5 Canvas", "Web Audio Synthesizers", "lucide-react", "Tailwind CSS"],
        roadmap: [
          "Phase 1: Implement abstract syntax tree parser and visual representation",
          "Phase 2: Code metrics sonification engine using multiple oscillator nodes",
          "Phase 3: Add smooth side-by-side transition layouts for comparative diffing"
        ],
        aliveEnhancements: [
          "Syntax quality directly alters the viscosity and color of the focal blob",
          "Interactive lines of code part gracefully around the cursor pointer"
        ]
      },
      {
        title: "NovaDocs AI MindMapper",
        description: `A responsive spatial canvas for collaborative brainstorms. The system automatically populates context-aware sub-branches with gorgeous custom-animated connections as you type.`,
        features: [
          "Slick auto-organizing mindmap layouts utilizing lightweight layout physics",
          "Dynamic real-time markdown blocks with inline code preview panels",
          "Smart visual cluster recommendation highlighting key conceptual nodes"
        ],
        techStack: ["motion", "Tailwind CSS", "Recharts", "Lucide Icons", "Web Audio API"],
        roadmap: [
          "Phase 1: Establish layout grid canvas and interactive coordinate systems",
          "Phase 2: Dynamic input block rendering with smooth spring scaling",
          "Phase 3: Polish typography pairing and add acoustic keyboard feedback"
        ],
        aliveEnhancements: [
          "New branches organically grow out of selected parent nodes with a spring animation",
          "A high-contrast grid pattern in the background drifts subtly during panning"
        ]
      }
    ],
    "Interactive websites": [
      {
        title: "Synesthesia Audio-Visual Explorer",
        description: `A gorgeous immersive playground exploring color-to-frequency mappings. Touch and drag across highly-responsive holographic glass cards to play real-time synthesizer chords.`,
        features: [
          "Holographic card grid that responds with premium 3D tilt effects",
          "Custom Web Audio synthesizers offering variable waveforms and delay units",
          "Fluid canvas backgrounds mapping color values directly to frequencies"
        ],
        techStack: ["motion", "HTML5 Canvas", "Web Audio API", "Lucide Icons", "Tailwind CSS"],
        roadmap: [
          "Phase 1: Design responsive glass grid layouts with realistic shadow cards",
          "Phase 2: Configure multiple oscillator synths and mouse/touch sensors",
          "Phase 3: Optimize paint cycles for the background fluid visualization"
        ],
        aliveEnhancements: [
          "Hovering over elements reveals a custom multi-stop radial gradient border",
          "Audio frequency peaks cause the active card to scale up dynamically"
        ]
      },
      {
        title: "Chronos Cosmic Clockwork",
        description: `A state-of-the-art interactive clock mapping absolute real-time events, celestial coordinates, and active local user metrics onto a beautifully layered golden spiral.`,
        features: [
          "Dynamic spiral SVG hands that trace time and user activity rates",
          "Ambient ambient-frequency background drone mapping hour-to-key structures",
          "Micro-interactive hover zones tracking precise coordinate telemetry"
        ],
        techStack: ["motion", "Tailwind CSS", "Lucide Icons", "Web Audio API", "D3.js"],
        roadmap: [
          "Phase 1: Map exact UTC and localized dates onto spiral vector coordinates",
          "Phase 2: Establish base ambient drone layers using lowpass filter nodes",
          "Phase 3: Create beautiful responsive lists showing past sensor triggers"
        ],
        aliveEnhancements: [
          "The backdrop displays soft starry particles drifting relative to pointer angles",
          "Subtle tick sounds play with dynamic high-frequency stereo panning"
        ]
      },
      {
        title: "NeonGrid Interactive Portfolio",
        description: `An immersive portfolio concept where your experience and projects are mapped into a responsive neon terminal. Select projects to run custom sandbox physics widgets.`,
        features: [
          "Immersive retro-futuristic navigation terminals with glowing grid backdrops",
          "Custom canvas physics sandbox embedded inside modular panel views",
          "Interactive telemetry panel showcasing live user interaction speed"
        ],
        techStack: ["motion", "Tailwind CSS", "HTML5 Canvas", "Lucide Icons", "Recharts"],
        roadmap: [
          "Phase 1: Build robust desktop and mobile grid terminal shell frames",
          "Phase 2: Build canvas particle engine that reacts to drag-and-swipe vectors",
          "Phase 3: Polish micro-transitions and add keyboard sensory click feedback"
        ],
        aliveEnhancements: [
          "Grid cells illuminate and dissipate heat values as the mouse sweeps past",
          "Active view changes prompt a dramatic holographic sweep-in effect"
        ]
      }
    ],
    "Productivity applications": [
      {
        title: "Zenith Task Orchestra",
        description: `A beautiful spatial canvas organizer replacing checklists with beautiful musical notes. Arranging tasks forms custom ambient sequences that enhance focus.`,
        features: [
          "Spatial dynamic canvas where tasks are represented as vibrant chords",
          "Interactive calendar tracker with custom micro-interactive checkouts",
          "Focus dashboard with a real-time breathing visualizer and soundscapes"
        ],
        techStack: ["motion", "Tailwind CSS", "Web Audio API", "Lucide Icons", "Recharts"],
        roadmap: [
          "Phase 1: Scaffold task organizer board with draggable canvas elements",
          "Phase 2: Synthesize unique custom notes for priority levels and durations",
          "Phase 3: Implement beautiful statistics panels tracking weekly consistency"
        ],
        aliveEnhancements: [
          "Completing a task plays a crisp crystal chime and dissolves into sparkles",
          "The focus timer expands and pulses gently, simulating rhythmic breathing"
        ]
      },
      {
        title: "Flux Markdown Journal",
        description: `A minimalist editor with intelligent layout shifting. Lines dynamically separate and expand around your cursor, highlighting active sections with frosted glass accents.`,
        features: [
          "Fluid text blocks with smooth layout transitions during focus changes",
          "Real-time visual outline with active reading speed and word counts",
          "Clean distraction-free interface optimized for spacious focus"
        ],
        techStack: ["motion", "Tailwind CSS", "Lucide Icons", "Local Storage", "Canvas"],
        roadmap: [
          "Phase 1: Establish high-performance markdown parser and custom styling",
          "Phase 2: Dynamic state tracking for paragraph positions and line gaps",
          "Phase 3: Refine typewriter feedback sound options and document export"
        ],
        aliveEnhancements: [
          "Paragraph spacing expands organically when a line is actively edited",
          "Typing triggers subtle light emission points along the editor margin"
        ]
      },
      {
        title: "Aura Scrum Board",
        description: `A professional bento-grid sprint planner. Column cards drift dynamically with authentic weight as columns are scaled, creating an incredibly satisfying physical space.`,
        features: [
          "Bento-grid styled column board with real elastic card-drag feedback",
          "Live team matching dashboard showing active online avatar placeholders",
          "Dynamic burndown chart detailing productivity vectors over time"
        ],
        techStack: ["motion", "Tailwind CSS", "Recharts", "Lucide Icons", "Web Audio API"],
        roadmap: [
          "Phase 1: Code resilient column drag states utilizing spring animations",
          "Phase 2: Configure progress charts with reactive scale animations",
          "Phase 3: Polish typography margins and integrate audio-visual success alerts"
        ],
        aliveEnhancements: [
          "Moving a card displays a slight tilt matching the speed and direction of motion",
          "Dropping cards into a target area triggers a satisfying bass thump"
        ]
      }
    ],
    "Browser-based games": [
      {
        title: "Quantum Drifter",
        description: `A beautiful procedural browser-based speed drifter. Navigate a neon spacecraft through a dynamically generating infinite tunnel of light and sound.`,
        features: [
          "Procedural coordinate generation keeping obstacles refreshing infinitely",
          "Responsive touch & mouse steering tracking vector movement smoothly",
          "Dynamic audio synthesizer scaling frequency and pitch with speed"
        ],
        techStack: ["motion", "HTML5 Canvas", "Web Audio API", "Lucide Icons", "Tailwind CSS"],
        roadmap: [
          "Phase 1: Build core canvas rendering loop with ship steering physics",
          "Phase 2: Implement infinite tunnel generator with high-contrast obstacles",
          "Phase 3: Integrate speed synthesizer effects and score counting systems"
        ],
        aliveEnhancements: [
          "Sparks scatter dynamically off the hull when steering close to borders",
          "Crashing triggers an elegant screen distortion and slow-motion fade"
        ]
      },
      {
        title: "Grid Wars: Cyber Arena",
        description: `A real-time strategy combat game played on a grid of cells. Claim territory by firing light pulses that trigger vibrant cell capture chain reactions.`,
        features: [
          "Interactive cell grid mapping player power status and ownership",
          "Chain reaction logic triggering high-fidelity sound waves and glows",
          "Offline simulation intelligence acting as automated enemy players"
        ],
        techStack: ["motion", "HTML5 Canvas", "Web Audio Synthesizers", "Lucide Icons", "Tailwind CSS"],
        roadmap: [
          "Phase 1: Program base tile layout grid and mouse click coordinate triggers",
          "Phase 2: Implement chain-reaction capture algorithm with particle explosions",
          "Phase 3: Scaffold computer AI bots with varying aggression levels"
        ],
        aliveEnhancements: [
          "Capturing cells initiates a glowing neon pulse that travels through adjacent tiles",
          "Low-frequency audio swells accompany successful chain-combos"
        ]
      },
      {
        title: "Vector Void Maze",
        description: `A satisfying tactical puzzle. Control an orb of light that must reach targets by sliding across absolute frictionless pathways.`,
        features: [
          "Frictionless vector sliding movement matching keyboard/touch swipes",
          "Elegant maze layouts utilizing customizable glass wall panels",
          "Interactive time trials with high-score tracking tables in local storage"
        ],
        techStack: ["motion", "Tailwind CSS", "Lucide Icons", "Web Audio API", "Recharts"],
        roadmap: [
          "Phase 1: Design grid level generator and basic sliding physics engine",
          "Phase 2: Code wall collisions and sound effects for solid surface impacts",
          "Phase 3: Implement a custom level creation board with preview modes"
        ],
        aliveEnhancements: [
          "The target orb shines with a gentle flare, leaving a beautiful light trail",
          "Hitting walls produces a localized visual bounce and deep organic knock"
        ]
      }
    ]
  };

  let matchedPool = pool[cleanCategory];
  if (!matchedPool) {
    if (cleanCategory.toLowerCase().includes("game")) {
      matchedPool = pool["Browser-based games"];
    } else if (cleanCategory.toLowerCase().includes("productivity") || cleanCategory.toLowerCase().includes("utility")) {
      matchedPool = pool["Productivity applications"];
    } else if (cleanCategory.toLowerCase().includes("ai") || cleanCategory.toLowerCase().includes("intelligence")) {
      matchedPool = pool["AI-powered web utilities"];
    } else {
      matchedPool = pool["Interactive websites"];
    }
  }

  const customized = matchedPool.map((idea, index) => {
    let finalTitle = idea.title;
    let finalDesc = idea.description;

    if (keywords && keywords.trim().length > 0) {
      const words = keywords.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      if (index === 0) {
        finalTitle = `${words.join(" ")} ${idea.title.split(" ").slice(-1)}`;
        finalDesc = `${idea.description} Tailored to match your request for "${keywords}".`;
      } else if (index === 1) {
        finalDesc = `Incorporating "${keywords}" concept. ${idea.description}`;
      }
    }

    return {
      id: `${customId()}-${index}`,
      title: finalTitle,
      description: finalDesc,
      category: cleanCategory,
      features: idea.features,
      techStack: idea.techStack,
      roadmap: idea.roadmap,
      aliveEnhancements: idea.aliveEnhancements
    };
  });

  return customized;
}

// AI ideas generation endpoint
app.post("/api/generate-ideas", async (req, res) => {
  const { category, keywords, teamSize } = req.body;
  try {
    const client = getGeminiClient();
    
    const prompt = `Generate 3 innovative, high-potential hackathon project ideas for "CodeStorm 2026 Month 2: Next-Generation Web Experiences".
Focus Category: ${category || "General / Full-Stack"}
Keywords or constraints specified by the user: ${keywords || "None"}
Target Team Size: ${teamSize || 2} members.

Guidelines:
1. Ensure the projects align perfectly with "Create Websites That Feel Alive".
2. Include explicit "Alive Enhancements" (like dynamic physics, Web Audio synthesizers, scroll-bound canvas, shaders, spring layout animations, or micro-interactive loops).
3. Specify a structured, logical 3-step timeline/roadmap for the hackathon.
4. Each concept must feel cutting-edge, realistic but highly impressive.
5. Provide the output strictly matching the requested JSON structure.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite hackathon mentor and principal creative tech lead at CodeStorm. You guide developers to build interactive, state-of-the-art frontend experiences that are extremely polished, fast, and feature high-fidelity animations, audio-visual feedback, or intelligent agents.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "An array of 3 unique, extremely high-quality project ideas.",
          items: {
            type: Type.OBJECT,
            required: ["id", "title", "description", "category", "features", "techStack", "roadmap", "aliveEnhancements"],
            properties: {
              id: { type: Type.STRING, description: "A unique short alphanumeric ID." },
              title: { type: Type.STRING, description: "A catchy, futuristic project name." },
              description: { type: Type.STRING, description: "A highly compelling 2-3 sentence overview of what this project is and why it stands out." },
              category: { type: Type.STRING, description: "The specific subcategory of next-gen web experience." },
              features: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 key user-facing features."
              },
              techStack: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "4-5 recommended modern web libraries or APIs (e.g. motion, Tailwind, Three.js, Web Audio API, Canvas, Recharts, Lucide)."
              },
              roadmap: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A 3-step rapid prototyping plan (Phase 1: Core Engine, Phase 2: Interactivity, Phase 3: Polishing)."
              },
              aliveEnhancements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 precise recommendations on how to make this website 'feel alive' via sensory or motion feedback."
              }
            }
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated from Gemini.");
    }

    const ideas = JSON.parse(responseText.trim());
    res.json({ success: true, ideas });
  } catch (error: any) {
    console.error("Gemini Generation Error, utilizing premium fallback engine:", error);

    const errorStr = String(error.message || error.status || "");
    const isLeakedOrInvalid = 
      errorStr.includes("leaked") || 
      errorStr.includes("PERMISSION_DENIED") || 
      errorStr.includes("403") || 
      errorStr.includes("API_KEY_INVALID") || 
      errorStr.includes("not valid") || 
      errorStr.includes("INVALID_ARGUMENT") || 
      errorStr.includes("400");
    
    const warningMsg = isLeakedOrInvalid
      ? "Your AI Studio API key has been flagged as leaked, invalid, or is currently denied. To protect your security and unlock personalized live AI mentoring, please replace or rotate your GEMINI_API_KEY in the Secrets panel. CodeStorm's dynamic blueprint engine is serving pre-compiled high-fidelity fallback templates."
      : "Gemini API consultation is temporarily unavailable. CodeStorm's dynamic blueprint engine is serving pre-compiled high-fidelity fallback templates.";

    try {
      const fallbackIdeas = getFallbackIdeas(category, keywords, teamSize);
      res.json({
        success: true,
        ideas: fallbackIdeas,
        fallback: true,
        warning: warningMsg
      });
    } catch (fallbackError: any) {
      res.status(500).json({
        success: false,
        error: `Failed to load ideation engine or fallbacks: ${error.message}`
      });
    }
  }
});

// Setup dev server or static server
async function setupServer() {
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
