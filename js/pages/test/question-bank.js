(function () {
  "use strict";

  window.CLWTestQuestionBank = {
    basics: {
      units: {
        "unit-1": {
          label: "Overview & Core Concepts",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Colour encoding definition",
                prompt: "What does colour encoding mainly refer to?",
                options: [
                  "Representing and storing colour information numerically",
                  "Decorating pages with bright colours only",
                  "Printing every image in CMYK",
                  "Naming colours in different languages"
                ],
                correct: "Representing and storing colour information numerically",
                reviewTopic: "Definition of colour encoding",
                explanation: "Colour encoding is about describing, storing, and transmitting colour as data.",
                hint: "Look for the answer about measurable colour data, not styling."
              },
              {
                type: "mcq",
                topic: "Why colour encoding matters",
                prompt: "Why is colour encoding important in digital media?",
                options: [
                  "It keeps colour handling more consistent across devices",
                  "It removes the need for displays",
                  "It guarantees every screen has the same brightness",
                  "It makes all files smaller no matter what"
                ],
                correct: "It keeps colour handling more consistent across devices",
                reviewTopic: "Cross-device consistency",
                explanation: "A core job of colour encoding is helping colour stay predictable from one device to another.",
                hint: "Pick the option about consistency, not absolute sameness."
              },
              {
                type: "true-false",
                topic: "Numerical colour data",
                prompt: "In digital systems, colours can be described with numerical values.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Numerical representation",
                explanation: "Digital colour relies on numbers, whether those numbers are RGB values, Lab values, or something else.",
                hint: "Think about how software stores colour values."
              },
              {
                type: "mcq",
                topic: "Enhanced visual experience",
                prompt: "Which technology is most directly linked to improving brightness, contrast, and realism in modern visual media?",
                options: [
                  "HDR",
                  "Monochrome scanning",
                  "Text compression",
                  "Keyboard remapping"
                ],
                correct: "HDR",
                reviewTopic: "Enhanced visual experience",
                explanation: "HDR is directly associated with higher dynamic range, stronger contrast, and a more realistic viewing experience.",
                hint: "Choose the option tied to display realism and dynamic range."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Cross-device consistency",
                prompt: "Which is the best description of cross-device colour consistency?",
                options: [
                  "A colour looks similar when moved between devices",
                  "Every device has the same hardware",
                  "All colours must be printed before viewing",
                  "Screens and printers use the same colour model"
                ],
                correct: "A colour looks similar when moved between devices",
                reviewTopic: "Cross-device consistency",
                explanation: "Consistency means aiming for predictable colour appearance across devices, not identical hardware.",
                hint: "Look for the outcome users care about."
              },
              {
                type: "mcq",
                topic: "Workflow value",
                prompt: "Which problem does colour encoding help solve most directly?",
                options: [
                  "Unclear colour reproduction between capture, edit, and display",
                  "Slow typing speed",
                  "Weak internet signal",
                  "Broken speakers"
                ],
                correct: "Unclear colour reproduction between capture, edit, and display",
                reviewTopic: "Workflow consistency",
                explanation: "Colour encoding underpins a predictable workflow from source to output.",
                hint: "Stay inside the colour workflow."
              },
              {
                type: "true-false",
                topic: "Efficiency",
                prompt: "Efficient colour encoding can help reduce storage and transmission cost.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Storage and transmission efficiency",
                explanation: "Colour encoding choices affect how much data is stored and transmitted.",
                hint: "This topic is not only about appearance."
              },
              {
                type: "mcq",
                topic: "Efficient storage",
                prompt: "Which statement best explains how colour encoding supports storage and transmission efficiency?",
                options: [
                  "It can organize colour data in ways that reduce file size and support smoother delivery",
                  "It removes the need for any image compression",
                  "It guarantees every file will be the same size",
                  "It turns all images into vector graphics"
                ],
                correct: "It can organize colour data in ways that reduce file size and support smoother delivery",
                reviewTopic: "Storage and transmission efficiency",
                explanation: "A good colour encoding approach can improve storage and transmission efficiency, especially in digital imaging and video workflows.",
                hint: "Look for the answer about data efficiency, not eliminating all compression."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Technical foundation",
                prompt: "Which statement best explains why colour encoding is a core technical foundation?",
                options: [
                  "It provides a measurable way to define, store, and reproduce colour",
                  "It turns all visual decisions into subjective taste",
                  "It replaces all colour management workflows",
                  "It works only for printed books"
                ],
                correct: "It provides a measurable way to define, store, and reproduce colour",
                reviewTopic: "Why colour encoding is foundational",
                explanation: "Colour encoding matters because it makes colour operational as data across systems.",
                hint: "Choose the option about measurable control."
              },
              {
                type: "mcq",
                topic: "Professional workflow",
                prompt: "A professional workflow depends on colour encoding mainly because it:",
                options: [
                  "supports predictable colour handling from capture to output",
                  "avoids all file compression",
                  "guarantees artistic quality automatically",
                  "removes the need for calibration"
                ],
                correct: "supports predictable colour handling from capture to output",
                reviewTopic: "Professional workflow assurance",
                explanation: "Professionals rely on colour encoding because it helps keep work predictable across capture, editing, display, and output.",
                hint: "Look for the answer about reliability across the workflow."
              },
              {
                type: "true-false",
                topic: "Data efficiency role",
                prompt: "Colour encoding is only about visual appearance and has nothing to do with data efficiency.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Data efficiency role",
                explanation: "Colour encoding affects both visual reproduction and storage or transmission efficiency.",
                hint: "Remember the overview talks about file size and transmission too."
              },
              {
                type: "mcq",
                topic: "Applied workflow outcome",
                prompt: "Which ability best shows that someone understands the practical value of colour encoding?",
                options: [
                  "Analyzing and solving colour consistency issues",
                  "Eliminating all device differences forever",
                  "Avoiding all colour conversions",
                  "Replacing interactive tools with guesswork"
                ],
                correct: "Analyzing and solving colour consistency issues",
                reviewTopic: "Practical application of colour encoding",
                explanation: "Understanding colour encoding should help someone diagnose and solve consistency problems in real workflows.",
                hint: "Pick the practical outcome, not the impossible promise."
              }
            ]
          }
        },
        "unit-2": {
          label: "Color Models",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Screen model",
                prompt: "Which colour model is used most directly by digital screens?",
                options: ["RGB", "CMYK", "Lab", "Grayscale only"],
                correct: "RGB",
                reviewTopic: "RGB model",
                explanation: "Digital displays emit light, so RGB is the most direct model.",
                hint: "Think about emitted light."
              },
              {
                type: "mcq",
                topic: "Print model",
                prompt: "Which colour model is most associated with print production?",
                options: ["RGB", "HSV", "CMYK", "Lab"],
                correct: "CMYK",
                reviewTopic: "CMYK model",
                explanation: "CMYK is the familiar subtractive model used in print workflows.",
                hint: "Choose the ink-oriented model."
              },
              {
                type: "true-false",
                topic: "Additive colour",
                prompt: "RGB is an additive colour model.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Additive colour model",
                explanation: "RGB creates colour by adding emitted red, green, and blue light.",
                hint: "Screens emit light instead of absorbing it."
              },
              {
                type: "mcq",
                topic: "HSL and HSV",
                prompt: "Which model is often easier for beginners when adjusting hue and saturation directly?",
                options: ["HSV/HSL", "CMYK", "Binary colour", "Pantone only"],
                correct: "HSV/HSL",
                reviewTopic: "HSV and HSL basics",
                explanation: "HSV and HSL are useful when thinking in terms of hue, saturation, and lightness or value.",
                hint: "Pick the model that names hue and saturation directly."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Model purpose",
                prompt: "Why do colour models exist in digital workflows?",
                options: [
                  "To provide structured numerical ways to describe and transform colour",
                  "To replace every hardware limitation",
                  "To stop colours from ever changing",
                  "To remove the need for communication between systems"
                ],
                correct: "To provide structured numerical ways to describe and transform colour",
                reviewTopic: "Why colour models exist",
                explanation: "Colour models are mathematical frameworks that make colour description and conversion workable.",
                hint: "Choose the answer about structure and numbers."
              },
              {
                type: "mcq",
                topic: "Lab",
                prompt: "Which statement about Lab is most accurate?",
                options: [
                  "It is designed to be more device-independent",
                  "It is mainly an ink model for printers",
                  "It can only describe black and white",
                  "It replaces all colour spaces automatically"
                ],
                correct: "It is designed to be more device-independent",
                reviewTopic: "Lab model",
                explanation: "Lab is valued because it is less tied to one device's output behaviour.",
                hint: "Look for the answer about device independence."
              },
              {
                type: "true-false",
                topic: "Subtractive model",
                prompt: "Subtractive colour models create colour by adding emitted light together.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Subtractive colour model",
                explanation: "Subtractive models work by absorbing or subtracting wavelengths, not emitting light.",
                hint: "Printing behaves differently from screens."
              },
              {
                type: "mcq",
                topic: "Model choice",
                prompt: "A designer wants to explore hue families quickly before final export. Which model is most practical for that stage?",
                options: [
                  "HSV/HSL",
                  "CMYK only",
                  "Raw binary",
                  "A printer profile"
                ],
                correct: "HSV/HSL",
                reviewTopic: "Model choice for exploration",
                explanation: "HSV and HSL are practical for early visual exploration because their controls map closely to perception.",
                hint: "Choose the model built for intuitive adjustment."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Cross-media planning",
                prompt: "A designer is preparing visuals for both an app and a printed brochure. Which choice shows the strongest model awareness?",
                options: [
                  "Use RGB-aware assets for screens and CMYK-aware output for print",
                  "Use CMYK for everything without review",
                  "Use only HSL for final print delivery",
                  "Ignore the output medium and keep one unchecked file"
                ],
                correct: "Use RGB-aware assets for screens and CMYK-aware output for print",
                reviewTopic: "Model-aware planning",
                explanation: "Different outputs call for model-aware handling rather than one unchecked workflow.",
                hint: "Think about screen and print as different destinations."
              },
              {
                type: "mcq",
                topic: "Model comparison",
                prompt: "Which statement best distinguishes a colour model from a casual colour description?",
                options: [
                  "A colour model is a defined numerical framework for representing colour",
                  "A colour model is any artistic opinion about a palette",
                  "A colour model is always a physical display device",
                  "A colour model only matters after printing"
                ],
                correct: "A colour model is a defined numerical framework for representing colour",
                reviewTopic: "Definition of a colour model",
                explanation: "The learn content defines a colour model as an abstract mathematical framework.",
                hint: "Choose the answer tied to numbers and structure."
              },
              {
                type: "true-false",
                topic: "Device independence",
                prompt: "Lab is often valued because it is less tied to a single device's way of producing colour.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Lab device independence",
                explanation: "That is one of the main reasons Lab is important in advanced workflows.",
                hint: "This is the key idea behind Lab."
              },
              {
                type: "mcq",
                topic: "Production decisions",
                prompt: "Which choice best reflects responsible model selection in a production workflow?",
                options: [
                  "Choose a model based on output context and conversion needs",
                  "Use the same model everywhere and assume no review is needed",
                  "Select the most complicated model even when it adds no value",
                  "Avoid model conversion because numbers are not important"
                ],
                correct: "Choose a model based on output context and conversion needs",
                reviewTopic: "Responsible model selection",
                explanation: "Model choice should follow task, output, and conversion requirements.",
                hint: "Pick the answer that treats model selection as a contextual decision."
              }
            ]
          }
        },
        "unit-3": {
          label: "Color Spaces",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Web colour space",
                prompt: "Which colour space is most common for standard web content?",
                options: ["sRGB", "Rec.2020", "ProPhoto RGB", "NTSC 1953"],
                correct: "sRGB",
                reviewTopic: "sRGB",
                explanation: "sRGB remains the common default for typical web delivery.",
                hint: "Pick the safest mainstream web choice."
              },
              {
                type: "mcq",
                topic: "Colour space meaning",
                prompt: "A colour space is best understood as:",
                options: [
                  "a specific implementation range within a colour model",
                  "a random list of named colours",
                  "a monitor cable standard",
                  "a printer driver"
                ],
                correct: "a specific implementation range within a colour model",
                reviewTopic: "What a colour space is",
                explanation: "A colour space is a specific implementation of a model with a defined range and behaviour.",
                hint: "Look for the answer connecting model and real usage."
              },
              {
                type: "true-false",
                topic: "Gamut differences",
                prompt: "Different colour spaces can cover different ranges of colours.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Gamut differences",
                explanation: "That difference in range is one reason colour-space choice matters.",
                hint: "Think about gamut coverage."
              },
              {
                type: "mcq",
                topic: "Wider gamut example",
                prompt: "Which of these is commonly known as a wider-gamut RGB colour space than sRGB?",
                options: ["Adobe RGB", "ASCII", "CMYK", "HSL"],
                correct: "Adobe RGB",
                reviewTopic: "Common RGB colour spaces",
                explanation: "Adobe RGB covers a wider gamut than sRGB in many regions.",
                hint: "Choose the RGB colour space name."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Adobe RGB choice",
                prompt: "Why might a designer choose Adobe RGB over sRGB in some workflows?",
                options: [
                  "Adobe RGB can represent a wider range of colours in some regions",
                  "Adobe RGB always loads faster online",
                  "Adobe RGB removes the need for export settings",
                  "Adobe RGB is only for black-and-white images"
                ],
                correct: "Adobe RGB can represent a wider range of colours in some regions",
                reviewTopic: "Adobe RGB use cases",
                explanation: "Adobe RGB is sometimes chosen for its broader gamut, especially in certain imaging workflows.",
                hint: "Pick the answer about gamut, not speed."
              },
              {
                type: "mcq",
                topic: "Modern display space",
                prompt: "Which colour space is commonly mentioned for modern display and media workflows with wider gamut support?",
                options: ["DCI-P3", "ASCII", "CMYK", "HSL"],
                correct: "DCI-P3",
                reviewTopic: "DCI-P3",
                explanation: "DCI-P3 is a widely referenced colour space in modern display workflows.",
                hint: "Choose the display-oriented RGB space."
              },
              {
                type: "true-false",
                topic: "Model vs space",
                prompt: "Colour model and colour space mean exactly the same thing.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Model versus space",
                explanation: "A colour model is the abstract framework; a colour space is a specific implementation.",
                hint: "Treat the colour model as the abstract system and the colour space as its specific implementation."
              },
              {
                type: "mcq",
                topic: "Workflow selection",
                prompt: "Which is the most sensible first step before choosing a colour space?",
                options: [
                  "Identify the target output or device context",
                  "Export immediately",
                  "Ignore the destination",
                  "Increase saturation on every asset"
                ],
                correct: "Identify the target output or device context",
                reviewTopic: "Colour space selection workflow",
                explanation: "Colour-space choice should follow the destination and workflow context.",
                hint: "Think destination first."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Responsible selection",
                prompt: "Which statement best reflects responsible colour-space selection?",
                options: [
                  "Match the colour space to the content, tools, and delivery target",
                  "Always use the largest gamut regardless of destination",
                  "Use sRGB only because all other spaces are incorrect",
                  "Avoid conversion because colour spaces do not matter"
                ],
                correct: "Match the colour space to the content, tools, and delivery target",
                reviewTopic: "Responsible colour-space selection",
                explanation: "The best colour space depends on practical workflow needs, not a one-size-fits-all rule.",
                hint: "Choose the context-aware answer."
              },
              {
                type: "mcq",
                topic: "Web delivery",
                prompt: "If a project is intended mainly for the web, the safest default is often:",
                options: [
                  "sRGB-aligned delivery",
                  "ProPhoto RGB without conversion",
                  "CMYK-only export",
                  "Lab screenshots"
                ],
                correct: "sRGB-aligned delivery",
                reviewTopic: "sRGB web delivery",
                explanation: "For general web delivery, sRGB remains the safest common target.",
                hint: "Pick the most broadly compatible choice."
              },
              {
                type: "true-false",
                topic: "Wider gamut assumption",
                prompt: "Using a wider-gamut colour space automatically guarantees better visible results on every device.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Wider gamut limits",
                explanation: "Wider gamut only helps when the full workflow and destination can support it properly.",
                hint: "More range does not mean universal improvement."
              },
              {
                type: "mcq",
                topic: "Conversion risk",
                prompt: "When a colour-space conversion is handled poorly, what is the main risk?",
                options: [
                  "Unexpected shifts between intended and delivered colour appearance",
                  "Audio distortion",
                  "The file becomes a vector graphic",
                  "The monitor changes refresh rate"
                ],
                correct: "Unexpected shifts between intended and delivered colour appearance",
                reviewTopic: "Colour space conversion",
                explanation: "Poor conversion handling can break the intended appearance between edit and output.",
                hint: "Stay focused on colour appearance."
              }
            ]
          }
        },
        "unit-4": {
          label: "Attributes & Perception",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Hue",
                prompt: "Which attribute describes the basic colour family, such as red, blue, or green?",
                options: ["Hue", "Contrast", "Resolution", "Format"],
                correct: "Hue",
                reviewTopic: "Hue",
                explanation: "Hue is the name-like family of the colour.",
                hint: "Think colour family."
              },
              {
                type: "image",
                topic: "Contrast spotting",
                prompt: "Which preview shows the clearest text contrast for easy reading?",
                options: [
                  {
                    id: "a",
                    label: "Dark navy text on pale yellow",
                    preview: {
                      type: "text-on-bg",
                      background: "#fef3c7",
                      color: "#0f172a",
                      text: "Dark navy text",
                      subtext: "Pale yellow surface"
                    }
                  },
                  {
                    id: "b",
                    label: "Light gray text on white",
                    preview: {
                      type: "text-on-bg",
                      background: "#ffffff",
                      color: "#d1d5db",
                      text: "Light gray text",
                      subtext: "White surface"
                    }
                  },
                  {
                    id: "c",
                    label: "Pink text on orange",
                    preview: {
                      type: "text-on-bg",
                      background: "#fdba74",
                      color: "#fb7185",
                      text: "Pink text",
                      subtext: "Orange surface"
                    }
                  }
                ],
                correct: "a",
                reviewTopic: "Contrast and readability",
                explanation: "Dark navy text on pale yellow creates the clearest readable contrast among these three previews.",
                hint: "Look for the pair with the strongest light-dark separation."
              },
              {
                type: "true-false",
                topic: "Contrast readability",
                prompt: "Higher contrast usually helps text readability.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Contrast and readability",
                explanation: "In general, clearer contrast improves readability.",
                hint: "This is a core accessibility idea."
              },
              {
                type: "sort",
                topic: "Value order",
                prompt: "Arrange these from lightest to darkest.",
                options: ["Pale yellow", "Soft orange", "Brick orange", "Deep brown"],
                correct: ["Pale yellow", "Soft orange", "Brick orange", "Deep brown"],
                reviewTopic: "Value order",
                explanation: "This sequence moves steadily from lighter value to darker value.",
                hint: "Think of visual brightness, not hue name."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Reducing intensity",
                prompt: "Which change most directly makes a colour look less intense?",
                options: [
                  "Lower its saturation",
                  "Raise its file size",
                  "Convert it to CMYK only",
                  "Rename the swatch"
                ],
                correct: "Lower its saturation",
                reviewTopic: "Saturation control",
                explanation: "Lower saturation makes a colour appear more muted.",
                hint: "Choose the direct visual control."
              },
              {
                type: "image",
                topic: "Readable interface contrast",
                prompt: "Which preview is the strongest choice for readable body text in an interface card?",
                options: [
                  {
                    id: "a",
                    label: "Deep slate text on a soft sky card",
                    preview: {
                      type: "text-on-bg",
                      background: "#dbeafe",
                      color: "#1e293b",
                      text: "Body text sample",
                      subtext: "Soft sky card"
                    }
                  },
                  {
                    id: "b",
                    label: "Yellow text on a white card",
                    preview: {
                      type: "text-on-bg",
                      background: "#ffffff",
                      color: "#fde047",
                      text: "Body text sample",
                      subtext: "White card"
                    }
                  },
                  {
                    id: "c",
                    label: "Medium gray text on a medium blue-gray card",
                    preview: {
                      type: "text-on-bg",
                      background: "#94a3b8",
                      color: "#64748b",
                      text: "Body text sample",
                      subtext: "Blue-gray card"
                    }
                  }
                ],
                correct: "a",
                reviewTopic: "Readability factors",
                explanation: "The deep slate text on the light sky background gives the clearest readable contrast for body text.",
                hint: "Choose the option where the text stands out immediately."
              },
              {
                type: "true-false",
                topic: "Colour temperature",
                prompt: "Color temperature is often used to describe colours as warmer or cooler in appearance.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Color temperature",
                explanation: "Warm and cool appearance is one way colour temperature is discussed in design and perception.",
                hint: "Think about warm orange versus cool blue impressions."
              },
              {
                type: "sort",
                topic: "Cool to warm order",
                prompt: "Arrange these from cooler feeling to warmer feeling.",
                options: ["Blue", "Cyan", "Yellow", "Orange"],
                correct: ["Blue", "Cyan", "Yellow", "Orange"],
                reviewTopic: "Warm and cool progression",
                explanation: "This sequence moves from cooler hues toward warmer ones.",
                hint: "Start at the coolest hue."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Hierarchy",
                prompt: "A designer wants a calm layout with one strong call-to-action. Which adjustment is usually most effective?",
                options: [
                  "Keep most colours restrained and raise contrast on the key action",
                  "Make every element equally saturated",
                  "Lower all contrast for softness",
                  "Use random hue shifts everywhere"
                ],
                correct: "Keep most colours restrained and raise contrast on the key action",
                reviewTopic: "Hierarchy and emphasis",
                explanation: "A restrained base plus one stronger focal element is a reliable hierarchy strategy.",
                hint: "Think emphasis, not equal intensity."
              },
              {
                type: "mcq",
                topic: "Perceptual thinking",
                prompt: "Which statement best reflects perceptual thinking in colour design?",
                options: [
                  "Saturation, lightness, and contrast all influence how users prioritize information",
                  "Only hue matters to users",
                  "Contrast matters only in print",
                  "Color temperature is unrelated to interpretation"
                ],
                correct: "Saturation, lightness, and contrast all influence how users prioritize information",
                reviewTopic: "Perceptual decision-making",
                explanation: "People read colour through several interacting attributes, not hue alone.",
                hint: "Choose the answer that reflects multiple perceptual cues."
              },
              {
                type: "true-false",
                topic: "Harmony versus readability",
                prompt: "A visually harmonious palette is acceptable even if important text lacks enough contrast.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Readability over harmony",
                explanation: "Readable communication should beat decorative harmony when they conflict.",
                hint: "Accessibility wins here."
              },
              {
                type: "sort",
                topic: "Readability repair workflow",
                prompt: "Arrange this readability improvement process in a sensible order.",
                options: [
                  "Identify the weak text/background pair",
                  "Increase contrast or adjust value",
                  "Recheck readability",
                  "Approve the improved version"
                ],
                correct: [
                  "Identify the weak text/background pair",
                  "Increase contrast or adjust value",
                  "Recheck readability",
                  "Approve the improved version"
                ],
                reviewTopic: "Readability repair workflow",
                explanation: "Good correction starts with diagnosis, then adjustment, then verification, then approval.",
                hint: "Fixes should be tested before sign-off."
              }
            ]
          }
        }
      }
    },
    models: {
      units: {
        "unit-1": {
          label: "Bit Depth Basics",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Bit depth meaning",
                prompt: "What does bit depth mainly describe in digital colour?",
                options: [
                  "How many tonal or colour steps can be represented",
                  "How large the screen is",
                  "How many devices are connected",
                  "How fast a file downloads"
                ],
                correct: "How many tonal or colour steps can be represented",
                reviewTopic: "Bit depth basics",
                explanation: "Bit depth describes the precision available for storing colour or tone values.",
                hint: "Think about smoothness and precision, not screen size."
              },
              {
                type: "mcq",
                topic: "Higher precision",
                prompt: "Why is a higher bit depth often useful for images with smooth gradients?",
                options: [
                  "It reduces the risk of visible banding",
                  "It guarantees smaller file size",
                  "It removes the need for colour profiles",
                  "It makes all colours more saturated"
                ],
                correct: "It reduces the risk of visible banding",
                reviewTopic: "Banding prevention",
                explanation: "More available steps usually means smoother transitions and less visible banding.",
                hint: "Choose the option about smoother transitions."
              },
              {
                type: "true-false",
                topic: "Higher bit depth",
                prompt: "Higher bit depth usually allows smoother colour transitions.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Smoother transitions",
                explanation: "With more precision, gradients are more likely to look smooth.",
                hint: "This is one of the main reasons higher bit depth matters."
              },
              {
                type: "mcq",
                topic: "Common beginner choice",
                prompt: "Which bit depth is most commonly associated with standard everyday image display workflows?",
                options: ["8-bit", "1-bit", "64-bit", "256-bit"],
                correct: "8-bit",
                reviewTopic: "Common bit depths",
                explanation: "8-bit is a common baseline in everyday display and image workflows.",
                hint: "Pick the familiar standard option."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Editing latitude",
                prompt: "Which option usually gives more editing flexibility before visible quality issues appear?",
                options: ["16-bit workflow", "1-bit workflow", "Lower screen brightness", "JPEG filename editing"],
                correct: "16-bit workflow",
                reviewTopic: "Editing flexibility",
                explanation: "Higher bit-depth workflows provide more room for adjustment before artifacts become obvious.",
                hint: "Look for the option with more colour precision."
              },
              {
                type: "image",
                topic: "Bit depth comparison",
                prompt: "Which sample shows the lowest bit depth?",
                options: [
                  {
                    id: "8-bit",
                    label: "",
                    hideLabel: true,
                    preview: {
                      type: "image",
                      src: "assets/images/test/8-bit.png",
                      alt: "8-bit gradient sample"
                    }
                  },
                  {
                    id: "10-bit",
                    label: "",
                    hideLabel: true,
                    preview: {
                      type: "image",
                      src: "assets/images/test/10-bit.png",
                      alt: "10-bit gradient sample"
                    }
                  },
                  {
                    id: "12-bit",
                    label: "",
                    hideLabel: true,
                    preview: {
                      type: "image",
                      src: "assets/images/test/12-bit.png",
                      alt: "12-bit gradient sample"
                    }
                  }
                ],
                correct: "8-bit",
                reviewTopic: "Bit depth comparison",
                explanation: "The lowest bit depth tends to show the most obvious stepping and the least smooth tonal transition.",
                hint: "Choose the image with the roughest-looking gradient."
              },
              {
                type: "true-false",
                topic: "File size trade-off",
                prompt: "Higher bit depth always produces smaller files.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Bit depth and file size",
                explanation: "Higher bit depth usually increases data requirements rather than reducing them.",
                hint: "More precision typically means more data."
              },
              {
                type: "mcq",
                topic: "Practical choice",
                prompt: "When is a higher bit depth most justified?",
                options: [
                  "When smooth tonal editing and precision matter",
                  "When you want to ignore gradients",
                  "When colour management is disabled",
                  "When only file names need changing"
                ],
                correct: "When smooth tonal editing and precision matter",
                reviewTopic: "Choosing higher bit depth",
                explanation: "Higher bit depth is most useful when tonal smoothness and edit tolerance matter.",
                hint: "Choose the scenario where precision has real value."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Production choice",
                prompt: "A photographer expects heavy tonal adjustment on a sky gradient. Which starting choice is strongest?",
                options: [
                  "Use a higher bit-depth workflow to preserve smoother tonal steps",
                  "Force the image into fewer tonal steps first",
                  "Disable colour management entirely",
                  "Lower the monitor resolution"
                ],
                correct: "Use a higher bit-depth workflow to preserve smoother tonal steps",
                reviewTopic: "Higher bit-depth workflow",
                explanation: "Large tonal edits are exactly where higher bit depth helps protect smooth transitions.",
                hint: "Think about protecting gradients before editing."
              },
              {
                type: "mcq",
                topic: "Banding diagnosis",
                prompt: "If a gradient begins to show obvious steps after editing, what is the most likely concept involved?",
                options: [
                  "Insufficient tonal precision leading to banding",
                  "A keyboard shortcut conflict",
                  "Correct ICC profile embedding",
                  "An audio export issue"
                ],
                correct: "Insufficient tonal precision leading to banding",
                reviewTopic: "Banding diagnosis",
                explanation: "Visible stepping in gradients usually points back to limited tonal precision or destructive processing.",
                hint: "Stay focused on the gradient artifact."
              },
              {
                type: "true-false",
                topic: "Precision and smoothness",
                prompt: "Bit depth has no meaningful connection to how smooth a colour gradient appears.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Precision and gradient smoothness",
                explanation: "Bit depth is directly related to how many tonal steps are available.",
                hint: "This is one of the core ideas of the chapter."
              },
              {
                type: "mcq",
                topic: "Trade-off reasoning",
                prompt: "Which statement best balances quality and storage when choosing bit depth?",
                options: [
                  "Use more bit depth when the workflow benefits from the extra precision",
                  "Always use the lowest bit depth possible",
                  "Always use the highest bit depth even when it adds no value",
                  "Bit depth should be chosen randomly"
                ],
                correct: "Use more bit depth when the workflow benefits from the extra precision",
                reviewTopic: "Bit depth trade-offs",
                explanation: "Bit depth should be chosen according to the quality benefit and workflow need.",
                hint: "Look for the context-aware choice."
              }
            ]
          }
        },
        "unit-2": {
          label: "ICC Profiles",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "ICC purpose",
                prompt: "What is the main purpose of an ICC profile?",
                options: [
                  "To describe how a device represents colour",
                  "To increase internet speed",
                  "To replace image editing software",
                  "To add extra pixels to a photo"
                ],
                correct: "To describe how a device represents colour",
                reviewTopic: "ICC profile purpose",
                explanation: "ICC profiles characterize device colour behaviour so colour can be managed more consistently.",
                hint: "Choose the answer about device colour description."
              },
              {
                type: "mcq",
                topic: "Consistency support",
                prompt: "Why are ICC profiles useful in a colour-managed workflow?",
                options: [
                  "They help different devices interpret colour more consistently",
                  "They make every file black and white",
                  "They remove the need for output checks",
                  "They guarantee all monitors are physically identical"
                ],
                correct: "They help different devices interpret colour more consistently",
                reviewTopic: "Cross-device consistency",
                explanation: "Profiles are a core tool for improving colour consistency across devices.",
                hint: "Look for the answer about consistency, not hardware sameness."
              },
              {
                type: "true-false",
                topic: "Profile usefulness",
                prompt: "ICC profiles can help improve colour consistency between devices.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Profile usefulness",
                explanation: "That is one of their main reasons for existing.",
                hint: "This is a basic colour-management principle."
              },
              {
                type: "mcq",
                topic: "Display example",
                prompt: "Which device is commonly associated with using a display ICC profile?",
                options: ["Monitor", "Keyboard", "Mouse pad", "USB cable"],
                correct: "Monitor",
                reviewTopic: "Display profiles",
                explanation: "Monitors commonly use display profiles in calibrated workflows.",
                hint: "Choose the device that actually shows colour."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Device characterization",
                prompt: "What does device characterization mean in colour management?",
                options: [
                  "Describing how a specific device reproduces colour",
                  "Giving the device a marketing name",
                  "Making every device use the same backlight",
                  "Replacing gamma with resolution"
                ],
                correct: "Describing how a specific device reproduces colour",
                reviewTopic: "Device characterization",
                explanation: "Profiles characterize the colour behaviour of a particular device.",
                hint: "Think measurement and description."
              },
              {
                type: "mcq",
                topic: "Embedded profile",
                prompt: "Why is embedding the correct profile in a file useful?",
                options: [
                  "It tells other systems how the colour data should be interpreted",
                  "It guarantees the file will be tiny",
                  "It removes the need for rendering choices",
                  "It forces all screens to the same brightness"
                ],
                correct: "It tells other systems how the colour data should be interpreted",
                reviewTopic: "Embedded profiles",
                explanation: "An embedded profile gives downstream software context for interpreting the colour data.",
                hint: "Choose the answer about interpretation."
              },
              {
                type: "true-false",
                topic: "Single universal profile",
                prompt: "One ICC profile is always equally correct for every device and output condition.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Device-specific profiles",
                explanation: "Profiles are specific to device behaviour and use context.",
                hint: "Different devices behave differently."
              },
              {
                type: "mcq",
                topic: "Mismatch problem",
                prompt: "If the wrong profile is assigned to an image, what is the most likely result?",
                options: [
                  "The colours may look incorrect or shifted",
                  "The file becomes a 3D model",
                  "The screen turns off",
                  "The image loses all metadata automatically"
                ],
                correct: "The colours may look incorrect or shifted",
                reviewTopic: "Profile mismatch",
                explanation: "Wrong profile assignment often causes visible colour shifts.",
                hint: "Think about interpretation going wrong."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Workflow responsibility",
                prompt: "A screen image looks good on one monitor but prints badly. Which step is most responsible to check first?",
                options: [
                  "Whether the correct profiles and conversions are being used",
                  "Whether the filename is short enough",
                  "Whether the browser window is maximized",
                  "Whether the image has enough sharpening"
                ],
                correct: "Whether the correct profiles and conversions are being used",
                reviewTopic: "Profile workflow checks",
                explanation: "When output changes badly across media, profiles and conversions are one of the first things to inspect.",
                hint: "Stay inside colour-management workflow causes."
              },
              {
                type: "mcq",
                topic: "Practical profile use",
                prompt: "Which action best reflects proper ICC profile handling?",
                options: [
                  "Keep profiles matched to the device or file context and verify conversions",
                  "Assign random profiles until the image looks brighter",
                  "Remove all profiles from every file by default",
                  "Ignore output device differences completely"
                ],
                correct: "Keep profiles matched to the device or file context and verify conversions",
                reviewTopic: "Proper ICC handling",
                explanation: "Good profile use is contextual, deliberate, and verified.",
                hint: "Choose the disciplined workflow answer."
              },
              {
                type: "true-false",
                topic: "Profile checking",
                prompt: "Ignoring profile mismatches can lead to visible colour inconsistency across devices.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Profile mismatch risk",
                explanation: "Profile mismatches are a common source of output inconsistency.",
                hint: "This is exactly what colour management tries to reduce."
              },
              {
                type: "mcq",
                topic: "Output decision",
                prompt: "Which message to a teammate shows strong colour-management judgment?",
                options: [
                  "Let's verify the profile path and output assumptions before approving the file",
                  "The colours looked fine once, so profiles do not matter",
                  "We should remove every profile to simplify things",
                  "If one screen looks good, every output will match"
                ],
                correct: "Let's verify the profile path and output assumptions before approving the file",
                reviewTopic: "Colour-management judgment",
                explanation: "Profile-aware verification is part of responsible output approval.",
                hint: "Pick the answer that checks assumptions instead of ignoring them."
              }
            ]
          }
        },
        "unit-3": {
          label: "Gamma Correction",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Gamma purpose",
                prompt: "What is gamma correction mainly used for?",
                options: [
                  "Managing non-linear brightness reproduction",
                  "Increasing monitor size",
                  "Changing a file from image to video",
                  "Replacing ICC profiles"
                ],
                correct: "Managing non-linear brightness reproduction",
                reviewTopic: "Gamma correction purpose",
                explanation: "Gamma correction helps digital systems handle brightness in a way that better fits display behaviour and perception.",
                hint: "Choose the answer about brightness handling."
              },
              {
                type: "mcq",
                topic: "Visual effect",
                prompt: "Which part of an image is most obviously affected when gamma is handled incorrectly?",
                options: [
                  "Midtones and overall brightness appearance",
                  "File name spelling",
                  "Keyboard response",
                  "Image resolution count only"
                ],
                correct: "Midtones and overall brightness appearance",
                reviewTopic: "Gamma visual effect",
                explanation: "Gamma strongly affects how midtones and overall brightness relationships are perceived.",
                hint: "Think about how light or dark the image feels."
              },
              {
                type: "true-false",
                topic: "Gamma linearity",
                prompt: "Gamma correction deals with non-linear behaviour in brightness reproduction.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Gamma and non-linearity",
                explanation: "That non-linearity is central to why gamma exists in imaging workflows.",
                hint: "This is the core concept."
              },
              {
                type: "mcq",
                topic: "Common display context",
                prompt: "Gamma correction is most closely tied to which aspect of imaging?",
                options: [
                  "Tone and brightness behaviour",
                  "Audio volume",
                  "Network latency",
                  "Keyboard shortcuts"
                ],
                correct: "Tone and brightness behaviour",
                reviewTopic: "Tone reproduction",
                explanation: "Gamma is about tone and brightness reproduction, not unrelated system settings.",
                hint: "Choose the option about tone."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Perception link",
                prompt: "Why is gamma often discussed together with human visual perception?",
                options: [
                  "Because human perception of brightness is not purely linear",
                  "Because humans can only see RGB",
                  "Because profiles are unnecessary",
                  "Because gamma changes resolution"
                ],
                correct: "Because human perception of brightness is not purely linear",
                reviewTopic: "Gamma and perception",
                explanation: "Gamma is closely connected to how humans perceive differences in brightness.",
                hint: "Think about perception not being perfectly linear."
              },
              {
                type: "sort",
                topic: "Gamma appearance order",
                prompt: "Arrange these gamma examples from too dark to correct to washed out.",
                options: [
                  {
                    id: "too-dark",
                    label: "A",
                    preview: {
                      type: "image",
                      src: "assets/images/test/too_dark.png",
                      alt: "Too dark gamma example"
                    }
                  },
                  {
                    id: "correct",
                    label: "B",
                    preview: {
                      type: "image",
                      src: "assets/images/test/normal.png",
                      alt: "Correct gamma example"
                    }
                  },
                  {
                    id: "washed-out",
                    label: "C",
                    preview: {
                      type: "image",
                      src: "assets/images/test/washed_out.png",
                      alt: "Washed out gamma example"
                    }
                  }
                ],
                correct: ["too-dark", "correct", "washed-out"],
                reviewTopic: "Gamma mismatch symptoms",
                explanation: "Gamma mismatch often shows up through images appearing too dark or too washed out compared with a correct presentation.",
                hint: "Gamma mainly affects tone and midtone brightness, so compare how shadow and midtone detail are being reproduced."
              },
              {
                type: "true-false",
                topic: "Common values",
                prompt: "Different workflows can use different gamma assumptions such as 2.2 or 2.4.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Gamma assumptions",
                explanation: "Different display and delivery contexts may use different gamma conventions.",
                hint: "This is why workflow context matters."
              },
              {
                type: "mcq",
                topic: "Practical check",
                prompt: "What is the most sensible response if an exported image looks much darker than expected?",
                options: [
                  "Check the gamma assumptions and viewing context",
                  "Delete all colour profiles immediately",
                  "Rename the file",
                  "Ignore it if the resolution is high"
                ],
                correct: "Check the gamma assumptions and viewing context",
                reviewTopic: "Gamma troubleshooting",
                explanation: "When brightness appearance is wrong, gamma assumptions are a key thing to inspect.",
                hint: "Stay focused on tone-management causes."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Workflow diagnosis",
                prompt: "A video looks correct in one app but washed out in another. Which concept is most likely involved?",
                options: [
                  "Different gamma or tone-mapping assumptions",
                  "A broken USB cable label",
                  "The file having too many chapters",
                  "The image using too much sharpening"
                ],
                correct: "Different gamma or tone-mapping assumptions",
                reviewTopic: "Gamma workflow diagnosis",
                explanation: "Cross-application brightness differences often point to gamma or tone-handling assumptions.",
                hint: "Think about tone interpretation between systems."
              },
              {
                type: "mcq",
                topic: "Responsible action",
                prompt: "Which workflow decision shows the strongest understanding of gamma correction?",
                options: [
                  "Verify viewing assumptions before judging whether the file is too dark or too bright",
                  "Assume every app uses identical gamma handling",
                  "Ignore all brightness differences if colours look saturated",
                  "Change file names instead of checking tone behaviour"
                ],
                correct: "Verify viewing assumptions before judging whether the file is too dark or too bright",
                reviewTopic: "Gamma-aware workflow",
                explanation: "Good gamma handling requires checking the viewing and output assumptions before making judgments.",
                hint: "Choose the answer that verifies context."
              },
              {
                type: "true-false",
                topic: "Mismatch impact",
                prompt: "A gamma mismatch can change the perceived brightness relationships in an image.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Gamma mismatch impact",
                explanation: "Gamma mismatch changes how tones are reproduced and perceived.",
                hint: "This is exactly why gamma matters."
              },
              {
                type: "mcq",
                topic: "Best practice",
                prompt: "Which statement best reflects good gamma practice in a production workflow?",
                options: [
                  "Treat gamma as part of tone-management decisions, not as an isolated afterthought",
                  "Assume gamma never affects approval decisions",
                  "Use random gamma assumptions for each export",
                  "Replace gamma checks with file compression"
                ],
                correct: "Treat gamma as part of tone-management decisions, not as an isolated afterthought",
                reviewTopic: "Gamma best practice",
                explanation: "Gamma should be treated as part of the overall tone and output workflow.",
                hint: "Choose the answer that integrates gamma into the workflow."
              }
            ]
          }
        },
        "unit-4": {
          label: "Encoding Decisions",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Simple web choice",
                prompt: "For a normal web image, which decision is usually the safest starting point?",
                options: [
                  "Use a common display-friendly workflow with correct colour interpretation",
                  "Ignore profiles and gamma completely",
                  "Choose settings randomly",
                  "Assume print and web always behave the same"
                ],
                correct: "Use a common display-friendly workflow with correct colour interpretation",
                reviewTopic: "Basic encoding decisions",
                explanation: "For common web delivery, a standard display-oriented workflow and correct interpretation are the safest baseline.",
                hint: "Pick the controlled, compatible workflow."
              },
              {
                type: "mcq",
                topic: "Print versus screen",
                prompt: "Which statement is most accurate for encoding decisions across screen and print?",
                options: [
                  "Output context affects which settings make sense",
                  "Exactly the same settings are always best for every output",
                  "Profiles only matter for audio files",
                  "Bit depth never affects workflow choices"
                ],
                correct: "Output context affects which settings make sense",
                reviewTopic: "Output-aware decisions",
                explanation: "Encoding decisions should follow the actual output context.",
                hint: "Choose the answer that depends on destination."
              },
              {
                type: "true-false",
                topic: "Context matters",
                prompt: "Good encoding choices depend on where and how the content will be used.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Context-aware decisions",
                explanation: "Encoding choices are contextual, not universal.",
                hint: "This idea ties the whole chapter together."
              },
              {
                type: "mcq",
                topic: "Workflow check",
                prompt: "Before approving a final export, what is the most responsible step?",
                options: [
                  "Check whether the file matches the intended viewing or output context",
                  "Assume it is correct because it opened once",
                  "Skip all visual checks",
                  "Delete all metadata first"
                ],
                correct: "Check whether the file matches the intended viewing or output context",
                reviewTopic: "Final export checks",
                explanation: "Approval should be based on whether the file matches its intended use context.",
                hint: "Choose the answer about verification."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Balanced decision",
                prompt: "Which choice best reflects a balanced encoding decision?",
                options: [
                  "Match bit depth, profile handling, and tone assumptions to the workflow need",
                  "Use the most extreme settings in every case",
                  "Ignore output conditions and hope for the best",
                  "Choose settings based only on file name"
                ],
                correct: "Match bit depth, profile handling, and tone assumptions to the workflow need",
                reviewTopic: "Balanced encoding decisions",
                explanation: "Strong decisions align the whole encoding setup with the actual workflow.",
                hint: "Look for the context-aware combination."
              },
              {
                type: "mcq",
                topic: "Troubleshooting logic",
                prompt: "An exported image shifts in tone and colour on another device. What should be checked first?",
                options: [
                  "Profile interpretation and tone-handling assumptions",
                  "Whether the file has a longer name",
                  "Whether the monitor stand is adjusted",
                  "Whether the image uses enough sharpening"
                ],
                correct: "Profile interpretation and tone-handling assumptions",
                reviewTopic: "Cross-device troubleshooting",
                explanation: "When a file shifts between systems, profile and tone assumptions are a primary place to look.",
                hint: "Stay on colour-management causes."
              },
              {
                type: "true-false",
                topic: "One-size-fits-all myth",
                prompt: "A single fixed encoding setup is always optimal for every kind of output.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "One-size-fits-all myth",
                explanation: "Encoding settings should be chosen according to the output need.",
                hint: "There is no universal best preset."
              },
              {
                type: "mcq",
                topic: "Scenario choice",
                prompt: "Which team decision shows better encoding judgment for a mixed workflow?",
                options: [
                  "Define the destination first, then choose precision and colour-management settings to fit",
                  "Lock one unchecked preset for every job forever",
                  "Remove every profile to simplify delivery",
                  "Judge the file only by whether it looks bright"
                ],
                correct: "Define the destination first, then choose precision and colour-management settings to fit",
                reviewTopic: "Encoding judgment",
                explanation: "Destination-first planning leads to stronger encoding decisions than blindly reusing a preset.",
                hint: "Choose the answer that starts with intended output."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Production approval",
                prompt: "Which statement best captures good encoding judgment before sign-off?",
                options: [
                  "Approve only after precision, profile path, and tone assumptions all make sense for the target output",
                  "Approve once one screen looks acceptable",
                  "Ignore workflow context if the file is sharp",
                  "Use the highest settings without checking necessity"
                ],
                correct: "Approve only after precision, profile path, and tone assumptions all make sense for the target output",
                reviewTopic: "Encoding approval judgment",
                explanation: "Responsible sign-off checks the whole encoding chain against the real delivery target.",
                hint: "Pick the answer that verifies the full chain."
              },
              {
                type: "mcq",
                topic: "Workflow reasoning",
                prompt: "What is the strongest reason to treat bit depth, profiles, and gamma together instead of separately?",
                options: [
                  "They work together to shape final colour and tone behaviour",
                  "They are all just file-naming systems",
                  "They only matter for printed books",
                  "They remove the need for output review"
                ],
                correct: "They work together to shape final colour and tone behaviour",
                reviewTopic: "Integrated encoding workflow",
                explanation: "These settings interact and collectively shape how the final file behaves across outputs.",
                hint: "Choose the answer about the system working together."
              },
              {
                type: "true-false",
                topic: "Integrated workflow",
                prompt: "Bit depth, ICC profiles, and gamma should be treated as connected parts of one encoding workflow.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Integrated encoding workflow",
                explanation: "They are best understood as connected choices within a single workflow.",
                hint: "This is the main point of the unit."
              },
              {
                type: "mcq",
                topic: "Team communication",
                prompt: "Which message to a teammate shows the strongest encoding awareness?",
                options: [
                  "Let's verify tonal precision, profile interpretation, and viewing assumptions before delivery",
                  "If the file opened, it is ready",
                  "Profiles and gamma are details we can ignore at the end",
                  "Use one export preset and never question it"
                ],
                correct: "Let's verify tonal precision, profile interpretation, and viewing assumptions before delivery",
                reviewTopic: "Encoding-aware communication",
                explanation: "Strong workflow communication names the key checks instead of assuming success.",
                hint: "Choose the answer that explicitly verifies the encoding chain."
              }
            ]
          }
        }
      }
    },
    meaning: {
      units: {
        "unit-1": {
          label: "HDR Fundamentals",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "HDR definition",
                prompt: "What does HDR mainly expand compared with standard dynamic range imaging?",
                options: [
                  "Brightness and contrast range",
                  "Keyboard response speed",
                  "File naming options",
                  "The number of audio channels"
                ],
                correct: "Brightness and contrast range",
                reviewTopic: "HDR basics",
                explanation: "HDR is fundamentally about wider dynamic range, especially in brightness and contrast reproduction.",
                hint: "Think about light range rather than screen size."
              },
              {
                type: "image",
                topic: "HDR compared with SDR",
                prompt: "Which preview is more likely to represent HDR output for the same scene?",
                options: [
                  {
                    id: "a",
                    label: "A",
                    preview: {
                      type: "image",
                      src: "assets/images/test/SDR.png",
                      alt: "SDR example for the same scene"
                    }
                  },
                  {
                    id: "b",
                    label: "B",
                    preview: {
                      type: "image",
                      src: "assets/images/test/HDR.png",
                      alt: "HDR example for the same scene"
                    }
                  }
                ],
                correct: "b",
                reviewTopic: "HDR experience",
                explanation: "HDR output is more likely to preserve stronger highlight detail and clearer separation between bright and dark areas in the same scene.",
                hint: "Look for the version with stronger highlight and shadow separation, not just the brighter-looking image."
              },
              {
                type: "true-false",
                topic: "HDR versus resolution",
                prompt: "HDR and high resolution are the same concept.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "HDR versus resolution",
                explanation: "HDR concerns luminance and contrast range, while resolution concerns detail count.",
                hint: "One is about light range, the other about pixel count."
              },
              {
                type: "mcq",
                topic: "SDR comparison",
                prompt: "Which statement best compares HDR with SDR?",
                options: [
                  "HDR can represent a wider luminance range than SDR",
                  "HDR is only another name for grayscale",
                  "SDR always uses wider gamut than HDR",
                  "HDR removes all display limitations"
                ],
                correct: "HDR can represent a wider luminance range than SDR",
                reviewTopic: "HDR versus SDR",
                explanation: "HDR is designed to carry and display a wider range of brightness information than SDR.",
                hint: "Look for the luminance-range comparison."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Highlight detail",
                prompt: "Which visual improvement is most strongly associated with HDR content?",
                options: [
                  "Brighter highlights with more visible detail",
                  "Automatic profile replacement",
                  "Lower resolution but sharper text",
                  "Monochrome shadows only"
                ],
                correct: "Brighter highlights with more visible detail",
                reviewTopic: "HDR visual characteristics",
                explanation: "HDR is commonly associated with brighter highlights that still retain detail.",
                hint: "Think about highlight handling."
              },
              {
                type: "mcq",
                topic: "Dynamic range concept",
                prompt: "What does dynamic range describe in this context?",
                options: [
                  "The span between darker and brighter reproducible values",
                  "The number of menus in the software",
                  "The amount of physical screen curvature",
                  "The total count of colour models in a workflow"
                ],
                correct: "The span between darker and brighter reproducible values",
                reviewTopic: "Dynamic range concept",
                explanation: "Dynamic range is about the spread between dark and bright values a system can meaningfully represent.",
                hint: "Choose the answer about tonal span."
              },
              {
                type: "true-false",
                topic: "HDR meaning",
                prompt: "HDR is mainly about tone and luminance handling rather than resolution alone.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "HDR meaning",
                explanation: "HDR is centered on luminance and tonal range, not simple resolution increases.",
                hint: "This is a core HDR distinction."
              },
              {
                type: "mcq",
                topic: "Workflow expectation",
                prompt: "If a scene has bright specular highlights and deep shadows, which display approach is more likely to preserve both extremes?",
                options: [
                  "HDR-aware display handling",
                  "Random file renaming",
                  "Reducing everything to a single midtone",
                  "Ignoring tone mapping completely"
                ],
                correct: "HDR-aware display handling",
                reviewTopic: "HDR workflow value",
                explanation: "HDR workflows are better suited to preserving strong highlights and deep shadow relationships together.",
                hint: "Choose the option designed for wider tonal range."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Production judgment",
                prompt: "A team claims a deliverable is 'HDR' only because it is 4K. What is the strongest response?",
                options: [
                  "HDR depends on luminance and tone handling, not resolution alone",
                  "4K resolution automatically guarantees HDR",
                  "Any bright screen is HDR by definition",
                  "HDR only matters for printers"
                ],
                correct: "HDR depends on luminance and tone handling, not resolution alone",
                reviewTopic: "HDR production judgment",
                explanation: "Resolution and HDR are different technical dimensions and should not be confused.",
                hint: "Separate detail count from dynamic range."
              },
              {
                type: "mcq",
                topic: "Perceived realism",
                prompt: "Why can HDR content feel more realistic when displayed well?",
                options: [
                  "Because it can preserve more believable brightness relationships across a scene",
                  "Because it removes all gamut limits",
                  "Because it turns every screen into OLED",
                  "Because it replaces colour management"
                ],
                correct: "Because it can preserve more believable brightness relationships across a scene",
                reviewTopic: "Perceived realism in HDR",
                explanation: "Better preservation of brightness relationships is a major reason HDR can feel more lifelike.",
                hint: "Choose the answer about scene brightness relationships."
              },
              {
                type: "true-false",
                topic: "Display dependence",
                prompt: "Whether HDR looks convincing depends in part on the capabilities of the target display.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "HDR display dependence",
                explanation: "HDR presentation depends on the target display's actual capabilities and handling.",
                hint: "Content and display both matter."
              },
              {
                type: "mcq",
                topic: "Approval logic",
                prompt: "Which approval comment shows stronger HDR understanding?",
                options: [
                  "Let's verify highlight detail, shadow separation, and display capability before sign-off",
                  "It is bright enough, so nothing else matters",
                  "If the file is large, it must be HDR",
                  "Resolution is the only HDR requirement"
                ],
                correct: "Let's verify highlight detail, shadow separation, and display capability before sign-off",
                reviewTopic: "HDR approval logic",
                explanation: "Good HDR review checks detail retention and real display behaviour instead of relying on labels.",
                hint: "Choose the answer that verifies actual HDR behaviour."
              }
            ]
          }
        },
        "unit-2": {
          label: "HDR Standards",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "HDR formats",
                prompt: "Which of these is an HDR format or standard family?",
                options: ["HDR10", "ASCII", "CMYK", "Delta-E only"],
                correct: "HDR10",
                reviewTopic: "HDR formats",
                explanation: "HDR10 is one of the common HDR standards learners are expected to recognize.",
                hint: "Choose the actual HDR name."
              },
              {
                type: "mcq",
                topic: "Metadata idea",
                prompt: "What is metadata in HDR workflows mainly used for?",
                options: [
                  "Carrying information that helps guide how HDR content should be interpreted or displayed",
                  "Adding keyboard shortcuts into image files",
                  "Replacing the need for luminance information",
                  "Increasing bit depth by itself"
                ],
                correct: "Carrying information that helps guide how HDR content should be interpreted or displayed",
                reviewTopic: "HDR metadata",
                explanation: "HDR metadata helps communicate how content should be handled in playback or mapping.",
                hint: "Think of metadata as supporting instructions."
              },
              {
                type: "true-false",
                topic: "Standard differences",
                prompt: "All HDR standards behave in exactly the same way.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Differences between HDR standards",
                explanation: "Different HDR standards can differ in workflow details and metadata handling.",
                hint: "The standards are related, not identical."
              },
              {
                type: "mcq",
                topic: "Recognition",
                prompt: "Which option below belongs with HDR delivery standards rather than colour models?",
                options: ["Dolby Vision", "RGB", "CMYK", "Lab"],
                correct: "Dolby Vision",
                reviewTopic: "HDR standard recognition",
                explanation: "Dolby Vision is part of HDR delivery and display workflows, unlike RGB or CMYK colour models.",
                hint: "Pick the HDR-delivery term."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Dynamic metadata",
                prompt: "Which statement best describes dynamic metadata in HDR workflows?",
                options: [
                  "It can vary scene by scene or shot by shot instead of staying fixed for the whole program",
                  "It means the file changes colour models every second",
                  "It is only another word for resolution",
                  "It disables tone mapping"
                ],
                correct: "It can vary scene by scene or shot by shot instead of staying fixed for the whole program",
                reviewTopic: "Dynamic metadata",
                explanation: "Dynamic metadata is associated with metadata that can change across content rather than staying static.",
                hint: "Think per-scene guidance."
              },
              {
                type: "mcq",
                topic: "Static versus dynamic",
                prompt: "Why might dynamic metadata be useful in HDR delivery?",
                options: [
                  "Because different scenes may need different guidance for display mapping",
                  "Because it makes every screen identical",
                  "Because it removes the need for brightness information",
                  "Because it converts SDR into print output"
                ],
                correct: "Because different scenes may need different guidance for display mapping",
                reviewTopic: "Static versus dynamic metadata",
                explanation: "Dynamic metadata can be useful when different scenes have different tone-mapping needs.",
                hint: "Choose the answer about scene-specific guidance."
              },
              {
                type: "true-false",
                topic: "Metadata role",
                prompt: "Metadata can be an important part of how HDR content is delivered and interpreted.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Metadata role in HDR",
                explanation: "Metadata is one of the key supporting ideas in HDR delivery.",
                hint: "This is one reason standards differ."
              },
              {
                type: "mcq",
                topic: "Standards awareness",
                prompt: "Which answer shows stronger awareness of HDR standards?",
                options: [
                  "Different HDR standards can vary in metadata handling and workflow expectations",
                  "Every HDR standard is interchangeable in every situation",
                  "HDR standards only matter for cameras, never displays",
                  "Metadata is unrelated to standards"
                ],
                correct: "Different HDR standards can vary in metadata handling and workflow expectations",
                reviewTopic: "HDR standards awareness",
                explanation: "A good working understanding of HDR standards includes recognizing that their workflows can differ.",
                hint: "Choose the answer that allows meaningful differences."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Approval judgment",
                prompt: "Which team statement shows better judgment when discussing HDR10 and Dolby Vision delivery?",
                options: [
                  "We should confirm the metadata expectations and target playback environment before approving the package",
                  "All HDR labels mean the same thing, so no review is needed",
                  "If the highlights are bright, the format choice does not matter",
                  "Standards only matter after printing"
                ],
                correct: "We should confirm the metadata expectations and target playback environment before approving the package",
                reviewTopic: "HDR standards approval judgment",
                explanation: "Different HDR standards carry different workflow expectations, so approval should verify those assumptions.",
                hint: "Choose the answer that verifies delivery assumptions."
              },
              {
                type: "mcq",
                topic: "Static metadata logic",
                prompt: "What is the key limitation of using only one set of metadata for very different scenes?",
                options: [
                  "It may not describe every scene equally well",
                  "It removes all brightness from the file",
                  "It turns HDR into grayscale",
                  "It automatically widens gamut"
                ],
                correct: "It may not describe every scene equally well",
                reviewTopic: "Static metadata limitation",
                explanation: "A single metadata description can be less suitable when scenes vary widely.",
                hint: "Think about scene-to-scene differences."
              },
              {
                type: "true-false",
                topic: "Workflow dependence",
                prompt: "Understanding HDR standards is partly about understanding how delivery assumptions affect playback results.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "HDR standards and playback assumptions",
                explanation: "HDR standards matter because they influence how content is interpreted in real playback contexts.",
                hint: "Standards are not just labels."
              },
              {
                type: "mcq",
                topic: "Engineering communication",
                prompt: "Which message reflects stronger HDR engineering awareness?",
                options: [
                  "Let's check the target standard, metadata behavior, and display assumptions before we sign off",
                  "If the file says HDR, it must be correct",
                  "Metadata is optional because brightness is visible anyway",
                  "Any HDR file will behave the same on all devices"
                ],
                correct: "Let's check the target standard, metadata behavior, and display assumptions before we sign off",
                reviewTopic: "HDR engineering awareness",
                explanation: "Strong workflow communication names the variables that actually affect HDR behaviour.",
                hint: "Choose the answer that verifies the chain, not the label."
              }
            ]
          }
        },
        "unit-3": {
          label: "Wide Color Gamut",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "WCG meaning",
                prompt: "What does wide color gamut mainly describe?",
                options: [
                  "A larger range of reproducible colours",
                  "A sharper font on screen",
                  "A faster network connection",
                  "A smaller file size"
                ],
                correct: "A larger range of reproducible colours",
                reviewTopic: "WCG basics",
                explanation: "Wide color gamut is about the range of colours a workflow or display can reproduce.",
                hint: "Think colour range, not speed."
              },
              {
                type: "mcq",
                topic: "Common spaces",
                prompt: "Which colour space is often discussed in wide-gamut display workflows?",
                options: ["DCI-P3", "ASCII", "CMYK", "Gamma 2.2"],
                correct: "DCI-P3",
                reviewTopic: "Common wide-gamut spaces",
                explanation: "DCI-P3 is a familiar wide-gamut colour space in display workflows.",
                hint: "Choose the display-oriented colour space."
              },
              {
                type: "true-false",
                topic: "WCG focus",
                prompt: "Wide color gamut is mainly about the range of colours, not the range of brightness values.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "WCG focus",
                explanation: "WCG and HDR are related but focus on different dimensions of image reproduction.",
                hint: "One is about colour range, the other about luminance range."
              },
              {
                type: "mcq",
                topic: "WCG versus HDR",
                prompt: "Which statement best separates wide gamut from HDR?",
                options: [
                  "Wide gamut is about colour range, while HDR is about luminance and contrast range",
                  "Wide gamut and HDR are exactly the same thing",
                  "Wide gamut only applies to printers",
                  "HDR only changes file names"
                ],
                correct: "Wide gamut is about colour range, while HDR is about luminance and contrast range",
                reviewTopic: "WCG versus HDR",
                explanation: "The two concepts are related but not identical: gamut and luminance range are different dimensions.",
                hint: "Choose the answer that assigns each concept a different role."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Gamut comparison",
                prompt: "Why might a wider gamut be useful in display workflows?",
                options: [
                  "It can represent more saturated or hard-to-reach colours than a narrower gamut",
                  "It automatically fixes all profile problems",
                  "It removes the need for gamma handling",
                  "It guarantees smaller exports"
                ],
                correct: "It can represent more saturated or hard-to-reach colours than a narrower gamut",
                reviewTopic: "Why wider gamut matters",
                explanation: "Wider gamut can preserve colours that narrower spaces might clip or compress.",
                hint: "Think about retaining more colour range."
              },
              {
                type: "mcq",
                topic: "Space awareness",
                prompt: "Which set below moves in the direction of narrower to wider common gamut coverage?",
                options: [
                  "sRGB -> DCI-P3 -> Rec.2020",
                  "Rec.2020 -> sRGB -> DCI-P3",
                  "CMYK -> RGB -> Lab",
                  "Gamma 2.2 -> Gamma 2.4 -> HDR10"
                ],
                correct: "sRGB -> DCI-P3 -> Rec.2020",
                reviewTopic: "Common gamut ordering",
                explanation: "A basic working understanding includes recognizing that sRGB is narrower than DCI-P3, which is narrower than Rec.2020.",
                hint: "Start with the most common narrow web space."
              },
              {
                type: "sort",
                topic: "Common gamut order",
                prompt: "Arrange these colour spaces from narrower to wider gamut coverage.",
                options: ["sRGB", "DCI-P3", "Rec.2020"],
                correct: ["sRGB", "DCI-P3", "Rec.2020"],
                reviewTopic: "Common gamut order",
                explanation: "This order follows the familiar progression from narrower to wider gamut coverage in common discussion.",
                hint: "Begin with the standard web-oriented space."
              },
              {
                type: "true-false",
                topic: "Wider gamut myth",
                prompt: "A wider-gamut space automatically looks better on every display even if the workflow does not support it properly.",
                options: ["True", "False"],
                correct: "False",
                reviewTopic: "Wider gamut workflow limits",
                explanation: "Wider gamut only helps when the workflow and destination can handle it correctly.",
                hint: "Capability without support is not enough."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Production reasoning",
                prompt: "A colour looks vibrant in a wide-gamut working space but dull on a limited display. What is the strongest explanation?",
                options: [
                  "The target display may not reproduce the full gamut of the working colour space",
                  "Wide gamut only affects file names",
                  "Gamma has converted the file into grayscale",
                  "The file has lost all metadata"
                ],
                correct: "The target display may not reproduce the full gamut of the working colour space",
                reviewTopic: "Display gamut limits",
                explanation: "A limited display cannot necessarily reproduce everything available in a wider working gamut.",
                hint: "Think display capability versus working space capability."
              },
              {
                type: "mcq",
                topic: "Workflow caution",
                prompt: "Which statement shows stronger WCG workflow judgment?",
                options: [
                  "Use wider gamut when the content, tools, and target outputs can actually benefit from it",
                  "Always choose the widest gamut even if the destination cannot use it",
                  "Wider gamut removes the need for conversion review",
                  "A gamut label guarantees the same visual result on every device"
                ],
                correct: "Use wider gamut when the content, tools, and target outputs can actually benefit from it",
                reviewTopic: "WCG workflow judgment",
                explanation: "Wider gamut should be chosen when it brings a real workflow benefit and can be supported end to end.",
                hint: "Choose the context-aware answer."
              },
              {
                type: "true-false",
                topic: "Workflow support",
                prompt: "Wider gamut is only useful when the rest of the workflow can preserve and display it properly.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "WCG workflow support",
                explanation: "End-to-end workflow support determines whether wider gamut pays off in practice.",
                hint: "The whole chain matters."
              },
              {
                type: "mcq",
                topic: "Team communication",
                prompt: "Which comment reflects stronger wide-gamut awareness?",
                options: [
                  "Let's confirm the target displays and gamut mapping expectations before approval",
                  "If the space is wider, the result is automatically better everywhere",
                  "Wider gamut means HDR is no longer relevant",
                  "Display capability does not matter once export is finished"
                ],
                correct: "Let's confirm the target displays and gamut mapping expectations before approval",
                reviewTopic: "Wide-gamut communication",
                explanation: "Good workflow communication checks the actual display context and how gamut will be handled.",
                hint: "Choose the answer that verifies target capability."
              }
            ]
          }
        },
        "unit-4": {
          label: "HDR & WCG in Practice",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Concept pairing",
                prompt: "Which statement best describes how HDR and wide gamut can work together?",
                options: [
                  "HDR can expand luminance range while WCG can expand colour range",
                  "HDR and WCG are two names for the same setting",
                  "HDR replaces colour spaces completely",
                  "WCG only affects audio playback"
                ],
                correct: "HDR can expand luminance range while WCG can expand colour range",
                reviewTopic: "HDR and WCG together",
                explanation: "HDR and WCG complement each other because they improve different aspects of reproduction.",
                hint: "One is about brightness range, the other about colour range."
              },
              {
                type: "mcq",
                topic: "Target device",
                prompt: "Why should target display capability be checked in HDR and WCG workflows?",
                options: [
                  "Because the final result depends on what the target device can actually reproduce",
                  "Because display capability only matters for audio projects",
                  "Because checking capability removes the need for standards",
                  "Because every display reproduces the same output"
                ],
                correct: "Because the final result depends on what the target device can actually reproduce",
                reviewTopic: "Target display capability",
                explanation: "The display is part of the final system, so its limits matter.",
                hint: "Choose the answer about actual device reproduction."
              },
              {
                type: "true-false",
                topic: "Combined workflow",
                prompt: "A strong HDR and WCG workflow still needs attention to the final viewing device.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Combined workflow",
                explanation: "Even strong source content depends on display capability and interpretation at the end.",
                hint: "The device is part of the chain."
              },
              {
                type: "mcq",
                topic: "Basic practice",
                prompt: "Which is the safest beginner mindset for HDR and WCG delivery?",
                options: [
                  "Match the content and workflow to the displays you actually expect people to use",
                  "Assume every display supports the same HDR and gamut behavior",
                  "Ignore compatibility because labels are enough",
                  "Treat WCG and HDR as unrelated to approval"
                ],
                correct: "Match the content and workflow to the displays you actually expect people to use",
                reviewTopic: "HDR and WCG delivery mindset",
                explanation: "Good delivery starts from the actual target devices and conditions.",
                hint: "Choose the answer that starts with the real destination."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Workflow review",
                prompt: "Which review question is most useful before approving HDR and WCG content?",
                options: [
                  "Do the target displays support the expected luminance and gamut behavior?",
                  "Is the filename long enough to look professional?",
                  "Did we remove every profile from the file?",
                  "Did we lower the bit depth as much as possible?"
                ],
                correct: "Do the target displays support the expected luminance and gamut behavior?",
                reviewTopic: "HDR and WCG review",
                explanation: "A meaningful review question checks whether the targets can reproduce what the content expects.",
                hint: "Choose the answer about actual support."
              },
              {
                type: "mcq",
                topic: "Misconception",
                prompt: "What is the main mistake in saying 'this file is HDR, so the display result will always be impressive'?",
                options: [
                  "The display result still depends on device capability and handling",
                  "HDR means the file no longer needs tone information",
                  "Impressive results depend only on resolution",
                  "HDR and WCG are impossible to combine"
                ],
                correct: "The display result still depends on device capability and handling",
                reviewTopic: "HDR delivery misconception",
                explanation: "A label alone does not guarantee the final playback result.",
                hint: "The target device still matters."
              },
              {
                type: "true-false",
                topic: "End-to-end support",
                prompt: "HDR and WCG benefits depend on end-to-end workflow support rather than file labels alone.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "End-to-end support",
                explanation: "The whole chain determines whether those benefits survive to final playback.",
                hint: "This is an end-to-end workflow topic."
              },
              {
                type: "mcq",
                topic: "Practical decision",
                prompt: "Which team decision shows stronger practical judgment?",
                options: [
                  "Test on the target displays and confirm both tone and gamut behavior before release",
                  "Approve because one high-end monitor looked good once",
                  "Assume wide gamut automatically solves tone issues",
                  "Ignore fallback behavior on limited displays"
                ],
                correct: "Test on the target displays and confirm both tone and gamut behavior before release",
                reviewTopic: "Practical HDR and WCG judgment",
                explanation: "Practical judgment checks the actual displays and both dimensions of behaviour.",
                hint: "Choose the answer that tests the real destination."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Engineering sign-off",
                prompt: "Which sign-off statement best reflects mature HDR and WCG workflow thinking?",
                options: [
                  "Let's verify standards, tone behavior, gamut behavior, and target-device support before we release",
                  "If the source file is premium, playback will be premium everywhere",
                  "Wider gamut means gamma no longer matters",
                  "HDR labels are enough evidence for delivery approval"
                ],
                correct: "Let's verify standards, tone behavior, gamut behavior, and target-device support before we release",
                reviewTopic: "HDR and WCG sign-off",
                explanation: "Mature workflow thinking checks the full delivery chain and target environment before release.",
                hint: "Choose the answer that verifies the entire chain."
              },
              {
                type: "mcq",
                topic: "Failure mode",
                prompt: "What is the strongest explanation when HDR content with wide gamut still looks disappointing on a user's device?",
                options: [
                  "The target device or playback path may not support the intended tone and gamut behavior",
                  "HDR always fails on images with shadows",
                  "Wide gamut removes all need for standards",
                  "The file probably needed a longer filename"
                ],
                correct: "The target device or playback path may not support the intended tone and gamut behavior",
                reviewTopic: "Playback-path limitation",
                explanation: "Playback quality depends on whether the viewing chain actually supports the intended behaviour.",
                hint: "Think playback path and device limits."
              },
              {
                type: "true-false",
                topic: "Integrated review",
                prompt: "In advanced display workflows, HDR and WCG should be reviewed together with the target playback environment.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Integrated display review",
                explanation: "Reviewing them in isolation misses the real playback context.",
                hint: "Context is part of the technology."
              },
              {
                type: "mcq",
                topic: "Team guidance",
                prompt: "Which message to a teammate shows the strongest advanced-display understanding?",
                options: [
                  "We need to check actual target-device support and fallback behavior, not just the source-file labels",
                  "If one mastering monitor looked good, all users will see it the same way",
                  "HDR and WCG cancel each other out",
                  "Display capability is irrelevant once export is complete"
                ],
                correct: "We need to check actual target-device support and fallback behavior, not just the source-file labels",
                reviewTopic: "Advanced-display team guidance",
                explanation: "Strong workflow guidance checks support and fallback behaviour instead of trusting labels alone.",
                hint: "Choose the answer about real playback conditions."
              }
            ]
          }
        }
      }
    },
    workflow: {
      units: {
        "unit-1": {
          label: "Introduction to Color Management",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Color management goal",
                prompt: "What is the main goal of color management in a workflow?",
                options: [
                  "To keep colour behaviour more consistent from one device or stage to another",
                  "To replace every image with grayscale",
                  "To remove the need for output review",
                  "To guarantee identical hardware everywhere"
                ],
                correct: "To keep colour behaviour more consistent from one device or stage to another",
                reviewTopic: "Color management goal",
                explanation: "Color management exists to improve consistency and predictability across the workflow.",
                hint: "Think consistency across stages."
              },
              {
                type: "mcq",
                topic: "Why workflow matters",
                prompt: "Why is color management especially important in workflows that move across multiple devices?",
                options: [
                  "Because devices do not all reproduce colour in exactly the same way",
                  "Because every device already behaves identically",
                  "Because it removes all need for profiles",
                  "Because it replaces bit depth decisions"
                ],
                correct: "Because devices do not all reproduce colour in exactly the same way",
                reviewTopic: "Why color management matters",
                explanation: "Multiple devices introduce interpretation differences that color management tries to control.",
                hint: "Choose the answer about device differences."
              },
              {
                type: "true-false",
                topic: "Consistency objective",
                prompt: "Color management is largely about predictability and consistency across the workflow.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Consistency objective",
                explanation: "Predictable output is one of the main reasons color management exists.",
                hint: "This is the core principle."
              },
              {
                type: "mcq",
                topic: "Workflow thinking",
                prompt: "Which mindset best fits basic color-management practice?",
                options: [
                  "Check how capture, editing, display, and output relate to each other",
                  "Judge everything only from one unverified screen",
                  "Ignore device differences if the file opens",
                  "Treat print and display as automatically identical"
                ],
                correct: "Check how capture, editing, display, and output relate to each other",
                reviewTopic: "Workflow thinking",
                explanation: "Color management is about the chain, not one isolated screen.",
                hint: "Choose the answer that thinks in stages."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Input to output chain",
                prompt: "Which statement best describes a color-managed chain?",
                options: [
                  "Input, editing, display, and output are linked through controlled interpretation of colour data",
                  "Only the final export matters; everything before that can be ignored",
                  "Colour management only matters for printers",
                  "Color management removes all need for review"
                ],
                correct: "Input, editing, display, and output are linked through controlled interpretation of colour data",
                reviewTopic: "Input to output chain",
                explanation: "The workflow is a connected chain of interpretation and conversion decisions.",
                hint: "Look for the end-to-end answer."
              },
              {
                type: "mcq",
                topic: "Real-world reason",
                prompt: "What is the strongest reason to think about color management before final export rather than after?",
                options: [
                  "Because mismatches introduced earlier can carry through the whole workflow",
                  "Because filenames are harder to change later",
                  "Because profiles only work at the end",
                  "Because tone and colour never change during editing"
                ],
                correct: "Because mismatches introduced earlier can carry through the whole workflow",
                reviewTopic: "Early workflow control",
                explanation: "Early workflow choices can create problems that remain visible later in the chain.",
                hint: "Think about errors propagating forward."
              },
              {
                type: "true-false",
                topic: "Workflow scope",
                prompt: "A color-management decision made early in the workflow can affect later stages.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Workflow scope",
                explanation: "Workflow choices often carry forward into later interpretation and output.",
                hint: "The stages are connected."
              },
              {
                type: "mcq",
                topic: "Practical judgment",
                prompt: "Which comment shows better practical color-management judgment?",
                options: [
                  "Let's check the whole path from source through display to final output",
                  "If one preview looked fine once, the chain is proven",
                  "Profiles matter only for archived files",
                  "Output should be approved before display review"
                ],
                correct: "Let's check the whole path from source through display to final output",
                reviewTopic: "Practical color-management judgment",
                explanation: "Good judgment checks the whole chain rather than trusting one isolated result.",
                hint: "Choose the full-workflow answer."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "System thinking",
                prompt: "What is the strongest reason experienced teams treat color management as a system problem rather than a one-step fix?",
                options: [
                  "Because colour interpretation is shaped by multiple connected stages and assumptions",
                  "Because a single export preset solves every device issue",
                  "Because only the camera determines final output",
                  "Because calibration eliminates the need for review"
                ],
                correct: "Because colour interpretation is shaped by multiple connected stages and assumptions",
                reviewTopic: "System thinking",
                explanation: "Strong workflows recognize that color behaviour emerges from a chain of related assumptions and conversions.",
                hint: "Look for the answer about connected stages."
              },
              {
                type: "mcq",
                topic: "Approval mindset",
                prompt: "Which approval mindset best reflects mature color-management practice?",
                options: [
                  "Verify the whole workflow context before assuming the output is correct",
                  "Assume a good-looking preview proves every destination",
                  "Ignore profile and intent assumptions if contrast looks fine",
                  "Treat color management as unrelated to delivery context"
                ],
                correct: "Verify the whole workflow context before assuming the output is correct",
                reviewTopic: "Approval mindset",
                explanation: "Mature color-management practice verifies the workflow rather than trusting a single appearance check.",
                hint: "Choose the answer that verifies context."
              },
              {
                type: "true-false",
                topic: "System dependency",
                prompt: "Color management should be reviewed as part of the broader production system, not as an isolated checkbox.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "System dependency",
                explanation: "The workflow context determines how color-management decisions behave in practice.",
                hint: "This is a systems topic."
              },
              {
                type: "mcq",
                topic: "Team communication",
                prompt: "Which message shows stronger workflow awareness?",
                options: [
                  "Let's confirm the source assumptions, display path, and output target before sign-off",
                  "If the colors are pleasing, workflow assumptions do not matter",
                  "Color management is only a print department issue",
                  "A single bright screen is enough for approval"
                ],
                correct: "Let's confirm the source assumptions, display path, and output target before sign-off",
                reviewTopic: "Workflow-aware communication",
                explanation: "Strong workflow communication names the parts of the chain that need verification.",
                hint: "Pick the answer that checks the chain."
              }
            ]
          }
        },
        "unit-2": {
          label: "CMS Architecture",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "CMS meaning",
                prompt: "What does a colour management system mainly help do?",
                options: [
                  "Translate colour information between different devices and contexts",
                  "Increase screen refresh rate",
                  "Change file type into audio",
                  "Replace every colour profile"
                ],
                correct: "Translate colour information between different devices and contexts",
                reviewTopic: "CMS meaning",
                explanation: "A CMS helps manage how colour data moves and is interpreted across devices and stages.",
                hint: "Think translation and coordination."
              },
              {
                type: "mcq",
                topic: "Architecture idea",
                prompt: "Why is CMS architecture useful in a workflow?",
                options: [
                  "Because it provides a structured way to manage colour transformations",
                  "Because it removes all need for standards",
                  "Because it only affects file names",
                  "Because it guarantees every display is identical"
                ],
                correct: "Because it provides a structured way to manage colour transformations",
                reviewTopic: "CMS architecture idea",
                explanation: "A structured system helps make colour transformations more controlled and repeatable.",
                hint: "Choose the answer about structure."
              },
              {
                type: "true-false",
                topic: "CMS role",
                prompt: "A CMS helps coordinate colour interpretation between devices rather than leaving each device to guess.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "CMS role",
                explanation: "That coordination role is central to a CMS.",
                hint: "This is one of the main reasons a CMS exists."
              },
              {
                type: "mcq",
                topic: "Workflow component",
                prompt: "Which of these is most closely related to CMS architecture rather than display resolution?",
                options: [
                  "Controlled colour transformation logic",
                  "More pixels on the screen",
                  "Keyboard layout",
                  "Audio gain staging"
                ],
                correct: "Controlled colour transformation logic",
                reviewTopic: "CMS component",
                explanation: "CMS architecture is about colour-handling logic, not unrelated hardware settings.",
                hint: "Pick the workflow-logic answer."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Intermediate reference idea",
                prompt: "Why do colour-management systems often rely on an intermediate reference approach instead of direct random conversions everywhere?",
                options: [
                  "Because a structured reference path makes transformations more consistent and manageable",
                  "Because it increases screen size",
                  "Because it removes the need for profiles",
                  "Because it only works for grayscale images"
                ],
                correct: "Because a structured reference path makes transformations more consistent and manageable",
                reviewTopic: "Structured conversion path",
                explanation: "A structured conversion path helps keep transformations more controlled and predictable.",
                hint: "Choose the answer about controlled transformation."
              },
              {
                type: "mcq",
                topic: "Transformation logic",
                prompt: "What is the strongest reason to understand CMS architecture when debugging colour shifts?",
                options: [
                  "Because shifts can come from where and how transformations are being interpreted",
                  "Because architecture changes the physical monitor size",
                  "Because color shifts are unrelated to workflow structure",
                  "Because all devices use identical transformation logic"
                ],
                correct: "Because shifts can come from where and how transformations are being interpreted",
                reviewTopic: "Debugging transformation logic",
                explanation: "Understanding the transformation path helps explain where colour shifts may be introduced.",
                hint: "Think about where shifts enter the chain."
              },
              {
                type: "true-false",
                topic: "Structured path",
                prompt: "A structured colour-management architecture can make transformations easier to reason about than ad hoc conversions.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Structured path",
                explanation: "Structure makes systems easier to understand, verify, and debug.",
                hint: "This is a workflow architecture question."
              },
              {
                type: "mcq",
                topic: "Practical reasoning",
                prompt: "Which workflow comment shows better CMS understanding?",
                options: [
                  "Let's inspect the transformation path and where interpretation assumptions may be changing",
                  "If the image shifted, architecture cannot be involved",
                  "The CMS only matters after printing",
                  "Profiles and CMS never interact"
                ],
                correct: "Let's inspect the transformation path and where interpretation assumptions may be changing",
                reviewTopic: "Practical CMS reasoning",
                explanation: "Good reasoning looks at the structured transformation path when behaviour changes unexpectedly.",
                hint: "Pick the answer that inspects the path."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Architecture-aware debugging",
                prompt: "Which statement best reflects advanced debugging judgment in a CMS-based workflow?",
                options: [
                  "Colour issues should be traced through the transformation path and interpretation assumptions step by step",
                  "A colour shift can only be caused by low resolution",
                  "CMS architecture is irrelevant once export begins",
                  "A good-looking thumbnail proves the whole chain"
                ],
                correct: "Colour issues should be traced through the transformation path and interpretation assumptions step by step",
                reviewTopic: "Architecture-aware debugging",
                explanation: "Advanced debugging follows the chain rather than guessing at one isolated cause.",
                hint: "Choose the answer about tracing the path."
              },
              {
                type: "mcq",
                topic: "Why architecture matters",
                prompt: "Why does CMS architecture matter for professional consistency?",
                options: [
                  "Because professional consistency depends on predictable transformations, not accidental ones",
                  "Because architecture makes every screen physically identical",
                  "Because it removes all need for rendering intents",
                  "Because it replaces workflow review with automation"
                ],
                correct: "Because professional consistency depends on predictable transformations, not accidental ones",
                reviewTopic: "Why CMS architecture matters",
                explanation: "Professional workflows rely on predictable transformation behaviour, which architecture helps support.",
                hint: "Choose the answer about predictable transformations."
              },
              {
                type: "true-false",
                topic: "Professional consistency",
                prompt: "A CMS architecture is valuable partly because it helps make colour transformations predictable rather than arbitrary.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Professional consistency",
                explanation: "Predictability is one of the main reasons architecture matters in professional workflows.",
                hint: "This is a predictability question."
              },
              {
                type: "mcq",
                topic: "Team message",
                prompt: "Which message to a teammate reflects stronger CMS awareness?",
                options: [
                  "Let's check the transformation path and the assumptions at each stage before we blame the output",
                  "If one export looked strange, CMS architecture cannot matter",
                  "Architecture is only for software engineers, not color workflows",
                  "The path does not matter as long as the file opens"
                ],
                correct: "Let's check the transformation path and the assumptions at each stage before we blame the output",
                reviewTopic: "CMS-aware team communication",
                explanation: "Strong communication in colour workflows points the team back to the transformation path and assumptions.",
                hint: "Pick the answer that traces the path."
              }
            ]
          }
        },
        "unit-3": {
          label: "Rendering Intents",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Intent idea",
                prompt: "What is a rendering intent mainly about in color management?",
                options: [
                  "How colours are handled when moving between different gamuts or output conditions",
                  "How many pixels an image contains",
                  "How bright a room light is",
                  "How fast a file opens"
                ],
                correct: "How colours are handled when moving between different gamuts or output conditions",
                reviewTopic: "Rendering intent idea",
                explanation: "Rendering intents guide how colours are mapped when output conditions differ.",
                hint: "Think about colour handling during conversion."
              },
              {
                type: "mcq",
                topic: "Why intent matters",
                prompt: "Why might different rendering intents produce different visible results?",
                options: [
                  "Because they prioritize colour handling in different ways during conversion",
                  "Because they change the file extension",
                  "Because they increase resolution",
                  "Because they physically recalibrate the monitor"
                ],
                correct: "Because they prioritize colour handling in different ways during conversion",
                reviewTopic: "Why rendering intent matters",
                explanation: "Different intents make different trade-offs in how out-of-gamut colours are handled.",
                hint: "Choose the answer about different priorities."
              },
              {
                type: "true-false",
                topic: "Conversion difference",
                prompt: "Different rendering intents can change the visual result of a conversion.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Conversion difference",
                explanation: "That is why intent selection matters in colour-managed workflows.",
                hint: "This is a core rendering-intent point."
              },
              {
                type: "mcq",
                topic: "Decision awareness",
                prompt: "Which answer best reflects the role of rendering intent?",
                options: [
                  "It is part of deciding how to preserve colour relationships under new output limits",
                  "It only controls file naming",
                  "It replaces the need for profiles",
                  "It only matters for keyboard backlights"
                ],
                correct: "It is part of deciding how to preserve colour relationships under new output limits",
                reviewTopic: "Rendering intent decision awareness",
                explanation: "Rendering intent is part of choosing how colours should behave when output constraints change.",
                hint: "Choose the answer about preserving colour relationships."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Perceptual use",
                prompt: "Which rendering-intent idea is most associated with preserving overall visual relationships when many colours cannot be reproduced exactly?",
                options: [
                  "A perceptual-style approach",
                  "Ignoring gamut limits completely",
                  "Raising resolution only",
                  "Removing all profiles"
                ],
                correct: "A perceptual-style approach",
                reviewTopic: "Perceptual intent use",
                explanation: "Perceptual intent is commonly discussed in terms of preserving overall visual relationships.",
                hint: "Choose the approach about preserving the overall impression."
              },
              {
                type: "mcq",
                topic: "Intent trade-off",
                prompt: "What is the strongest reason to choose one rendering intent over another?",
                options: [
                  "Different outputs and goals may require different colour-mapping priorities",
                  "One intent is always correct for every job",
                  "Rendering intents are unrelated to output conditions",
                  "Intent choice only matters if the image is grayscale"
                ],
                correct: "Different outputs and goals may require different colour-mapping priorities",
                reviewTopic: "Intent trade-off",
                explanation: "Intent choice depends on the output condition and what visual behaviour matters most.",
                hint: "Choose the context-dependent answer."
              },
              {
                type: "true-false",
                topic: "No universal intent",
                prompt: "There is no single rendering intent that is automatically best for every situation.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "No universal intent",
                explanation: "Intent choice is contextual rather than universal.",
                hint: "This is a trade-off question."
              },
              {
                type: "mcq",
                topic: "Workflow comment",
                prompt: "Which workflow comment shows better rendering-intent understanding?",
                options: [
                  "Let's choose the intent based on what colour relationships matter most in this output",
                  "All intents produce the same result, so the setting is irrelevant",
                  "Intent matters only before the image is edited",
                  "If the file is wide gamut, intent no longer matters"
                ],
                correct: "Let's choose the intent based on what colour relationships matter most in this output",
                reviewTopic: "Rendering-intent workflow comment",
                explanation: "Strong intent choice starts with identifying the output goal and the relationships worth preserving.",
                hint: "Pick the answer that ties intent to the visual goal."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Advanced decision",
                prompt: "What is the strongest reason experienced teams review rendering intents carefully before approving output?",
                options: [
                  "Because intent choice affects what visual compromises are made during conversion",
                  "Because intent changes monitor hardware",
                  "Because intent only matters for file compression",
                  "Because all conversions preserve colours identically anyway"
                ],
                correct: "Because intent choice affects what visual compromises are made during conversion",
                reviewTopic: "Advanced rendering-intent decision",
                explanation: "Intent selection is about choosing how to manage unavoidable visual compromises under output limits.",
                hint: "Choose the answer about conversion trade-offs."
              },
              {
                type: "mcq",
                topic: "Sign-off logic",
                prompt: "Which sign-off comment best reflects strong rendering-intent reasoning?",
                options: [
                  "Let's verify whether this intent preserves the relationships we care about for the target output",
                  "Any intent is fine as long as the file is exported",
                  "Rendering intent only affects metadata, not appearance",
                  "Intent no longer matters after the first preview"
                ],
                correct: "Let's verify whether this intent preserves the relationships we care about for the target output",
                reviewTopic: "Rendering-intent sign-off logic",
                explanation: "Strong reasoning checks whether the chosen intent matches the visual goal of the output.",
                hint: "Choose the answer that verifies the intended visual result."
              },
              {
                type: "true-false",
                topic: "Visual compromise",
                prompt: "Rendering intents are partly about deciding how to manage visual compromise when output conditions differ.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Visual compromise",
                explanation: "That is one of the main reasons rendering intents exist.",
                hint: "This is about trade-offs under constraints."
              },
              {
                type: "mcq",
                topic: "Team guidance",
                prompt: "Which message shows stronger advanced colour-management guidance?",
                options: [
                  "Let's compare intents against the target output goal instead of assuming one preset always works",
                  "Rendering intent is a cosmetic setting we can ignore",
                  "One intent is always safest no matter the job",
                  "If the preview is bright, the intent is correct"
                ],
                correct: "Let's compare intents against the target output goal instead of assuming one preset always works",
                reviewTopic: "Advanced rendering-intent guidance",
                explanation: "Good guidance compares intent choices against the real output objective instead of relying on habit.",
                hint: "Pick the answer that checks the visual goal."
              }
            ]
          }
        },
        "unit-4": {
          label: "Practical Workflow",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "First practical step",
                prompt: "Which is a sensible practical step before approving a final colour output?",
                options: [
                  "Check the output in the intended context or on the intended device type",
                  "Skip review if the file opened without errors",
                  "Assume one screen preview proves every destination",
                  "Ignore the profile path completely"
                ],
                correct: "Check the output in the intended context or on the intended device type",
                reviewTopic: "Practical output review",
                explanation: "Practical review should look at the intended destination rather than an arbitrary preview.",
                hint: "Choose the destination-aware step."
              },
              {
                type: "mcq",
                topic: "Workflow order",
                prompt: "Which action fits best near the end of a practical color-management workflow?",
                options: [
                  "Verifying the output against the intended result",
                  "Ignoring the display path",
                  "Removing all metadata at random",
                  "Treating every device as identical"
                ],
                correct: "Verifying the output against the intended result",
                reviewTopic: "Workflow order",
                explanation: "Verification is a natural late-stage step in a practical workflow.",
                hint: "Choose the answer about final verification."
              },
              {
                type: "true-false",
                topic: "Soft review value",
                prompt: "Checking the likely output result before final delivery can help catch colour problems earlier.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Early problem detection",
                explanation: "Early review helps catch problems before final delivery.",
                hint: "This is a practical workflow principle."
              },
              {
                type: "mcq",
                topic: "Workflow behavior",
                prompt: "Which comment shows stronger practical workflow thinking?",
                options: [
                  "Let's verify before delivery instead of assuming the previous stage was correct",
                  "If the preview was acceptable once, no more checks are needed",
                  "Practical review slows things down and has no value",
                  "Only the file extension matters in final output"
                ],
                correct: "Let's verify before delivery instead of assuming the previous stage was correct",
                reviewTopic: "Practical workflow behavior",
                explanation: "Good workflows verify rather than assume.",
                hint: "Choose the answer about verification."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Workflow sequence",
                prompt: "Which sequence best fits a practical color-managed workflow?",
                options: [
                  "Prepare -> manage interpretation -> review -> approve output",
                  "Approve first -> inspect later -> guess corrections",
                  "Export repeatedly without checking assumptions",
                  "Ignore display context -> trust file labels"
                ],
                correct: "Prepare -> manage interpretation -> review -> approve output",
                reviewTopic: "Workflow sequence",
                explanation: "A practical workflow prepares, manages interpretation, reviews, and then approves.",
                hint: "Choose the sequence with verification before sign-off."
              },
              {
                type: "mcq",
                topic: "Verification logic",
                prompt: "Why is output verification important even when the file looked fine during editing?",
                options: [
                  "Because the final destination may behave differently from the editing environment",
                  "Because verification only checks file size",
                  "Because editing previews are physically identical to all output devices",
                  "Because approval makes color management unnecessary"
                ],
                correct: "Because the final destination may behave differently from the editing environment",
                reviewTopic: "Verification logic",
                explanation: "Editing and final output environments can differ, which is why verification matters.",
                hint: "Choose the answer about destination differences."
              },
              {
                type: "true-false",
                topic: "Destination review",
                prompt: "A practical workflow should consider the target destination before final approval.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Destination review",
                explanation: "Final approval should be based on the actual destination, not an abstract assumption.",
                hint: "This is a destination-aware workflow question."
              },
              {
                type: "mcq",
                topic: "Team process",
                prompt: "Which team process shows better practical color-management discipline?",
                options: [
                  "Review likely output behaviour before release and adjust if needed",
                  "Release immediately because previews are close enough",
                  "Ignore print or display context after export",
                  "Assume the largest gamut solves all workflow issues"
                ],
                correct: "Review likely output behaviour before release and adjust if needed",
                reviewTopic: "Practical workflow discipline",
                explanation: "Discipline means checking likely output behaviour before release.",
                hint: "Choose the answer with review and adjustment."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Production readiness",
                prompt: "Which statement best reflects production-ready color-management workflow thinking?",
                options: [
                  "Approval should come after checking assumptions, transformations, and likely target output behavior",
                  "A good-looking edit preview proves the job is done",
                  "Workflow review can be skipped if the file is high resolution",
                  "Profiles and intents are irrelevant after export"
                ],
                correct: "Approval should come after checking assumptions, transformations, and likely target output behavior",
                reviewTopic: "Production readiness",
                explanation: "Production readiness depends on verifying the whole path to the target output.",
                hint: "Choose the answer that verifies the whole path."
              },
              {
                type: "mcq",
                topic: "Practical sign-off",
                prompt: "What is the strongest reason to include final destination review in sign-off?",
                options: [
                  "Because sign-off should reflect the real output experience, not just the edit environment",
                  "Because sign-off is mostly about file naming",
                  "Because the destination can never influence colour behaviour",
                  "Because review is only useful for HDR"
                ],
                correct: "Because sign-off should reflect the real output experience, not just the edit environment",
                reviewTopic: "Practical sign-off",
                explanation: "Sign-off should be based on the real destination experience whenever possible.",
                hint: "Choose the answer about the real output experience."
              },
              {
                type: "true-false",
                topic: "Real destination principle",
                prompt: "The closer final review is to the real destination context, the more trustworthy the sign-off can be.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Real destination principle",
                explanation: "Review closer to real output context usually gives more trustworthy approval.",
                hint: "This is a practical sign-off principle."
              },
              {
                type: "mcq",
                topic: "Workflow leadership",
                prompt: "Which message shows stronger workflow leadership before release?",
                options: [
                  "Let's confirm the target behavior and verify the final output path before we approve this",
                  "The source looked clean, so release is automatic",
                  "Workflow review is unnecessary if the colors are vivid",
                  "Only one preview matters no matter the destination"
                ],
                correct: "Let's confirm the target behavior and verify the final output path before we approve this",
                reviewTopic: "Workflow leadership",
                explanation: "Strong workflow leadership verifies the output path instead of assuming success.",
                hint: "Choose the answer that verifies before approval."
              }
            ]
          }
        }
      }
    },
    practice: {
      units: {
        "unit-1": {
          label: "Color Picker",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Picker purpose",
                prompt: "What is a color picker mainly used for?",
                options: [
                  "Selecting and inspecting colour values directly",
                  "Increasing monitor refresh rate",
                  "Replacing ICC profiles",
                  "Printing without review"
                ],
                correct: "Selecting and inspecting colour values directly",
                reviewTopic: "Color picker purpose",
                explanation: "A color picker is used to choose colours and inspect their values in different representations.",
                hint: "Think selection and inspection."
              },
              {
                type: "mcq",
                topic: "Common output",
                prompt: "Which format is commonly shown by a color picker for web-style colour use?",
                options: ["HEX", "MP3", "ZIP", "DOCX"],
                correct: "HEX",
                reviewTopic: "Common picker output",
                explanation: "HEX is a common colour representation shown in pickers for digital and web workflows.",
                hint: "Pick the colour-code format."
              },
              {
                type: "true-false",
                topic: "Picker values",
                prompt: "A color picker can help you inspect colour values rather than guessing them visually.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Picker values",
                explanation: "That is one of the most practical uses of a picker tool.",
                hint: "This is about measurable values, not guessing."
              },
              {
                type: "mcq",
                topic: "Workflow role",
                prompt: "Why is a color picker useful early in a workflow?",
                options: [
                  "It gives direct feedback while exploring colour choices",
                  "It removes the need for final review",
                  "It replaces rendering intents",
                  "It automatically makes colours accessible"
                ],
                correct: "It gives direct feedback while exploring colour choices",
                reviewTopic: "Picker workflow role",
                explanation: "Pickers are useful because they allow fast testing and inspection while decisions are being made.",
                hint: "Choose the answer about immediate feedback."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Picker interpretation",
                prompt: "What is the strongest reason to use a color picker instead of relying only on visual guessing?",
                options: [
                  "It provides explicit colour values that can be repeated and shared",
                  "It makes every colour look more saturated",
                  "It removes the need for profiles and gamma",
                  "It guarantees that every colour choice is correct"
                ],
                correct: "It provides explicit colour values that can be repeated and shared",
                reviewTopic: "Picker interpretation",
                explanation: "Explicit values make colour decisions easier to repeat, compare, and communicate.",
                hint: "Choose the answer about repeatable values."
              },
              {
                type: "mcq",
                topic: "Tool awareness",
                prompt: "Why is it useful when a color picker shows more than one representation, such as HEX and RGB?",
                options: [
                  "It helps connect the same colour choice to different workflow contexts",
                  "It changes the display hardware",
                  "It guarantees print accuracy by itself",
                  "It removes the need for contrast checking"
                ],
                correct: "It helps connect the same colour choice to different workflow contexts",
                reviewTopic: "Multiple representations",
                explanation: "Different representations are useful in different parts of a workflow.",
                hint: "Choose the answer about connecting contexts."
              },
              {
                type: "true-false",
                topic: "Repeatability",
                prompt: "A color picker can support repeatability because it exposes exact colour values.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Repeatability",
                explanation: "Exact values make it easier to reproduce the same choice later.",
                hint: "This is a precision question."
              },
              {
                type: "mcq",
                topic: "Practical decision",
                prompt: "Which comment shows stronger color-picker understanding?",
                options: [
                  "Let's inspect the exact values before we reuse this colour elsewhere",
                  "The picker is unnecessary because colour names are enough",
                  "If a colour looks fine once, its value never matters",
                  "Pickers only matter after final export"
                ],
                correct: "Let's inspect the exact values before we reuse this colour elsewhere",
                reviewTopic: "Practical picker decision",
                explanation: "Strong picker use turns visual choice into a repeatable value.",
                hint: "Choose the answer about inspecting exact values."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Applied precision",
                prompt: "Why does a color picker matter in more advanced workflows, not just beginner exploration?",
                options: [
                  "Because precise values help maintain control across tools and handoffs",
                  "Because it replaces output verification",
                  "Because it fixes all colour-management issues automatically",
                  "Because it removes the need for accessibility review"
                ],
                correct: "Because precise values help maintain control across tools and handoffs",
                reviewTopic: "Applied precision",
                explanation: "Advanced workflows still depend on precise, transferable colour values.",
                hint: "Pick the answer about control across tools."
              },
              {
                type: "mcq",
                topic: "Workflow discipline",
                prompt: "Which team comment reflects stronger color-picker discipline?",
                options: [
                  "Let's capture the actual value now so the decision stays consistent across the workflow",
                  "We'll just remember the colour by eye later",
                  "Precise values are only useful for printers",
                  "If the screenshot looks similar, exact values do not matter"
                ],
                correct: "Let's capture the actual value now so the decision stays consistent across the workflow",
                reviewTopic: "Workflow discipline",
                explanation: "Strong discipline turns a visual choice into a trackable value before it gets lost.",
                hint: "Choose the answer about preserving the exact decision."
              },
              {
                type: "true-false",
                topic: "Cross-tool control",
                prompt: "Exact colour values from a picker can help maintain control when a design moves between tools.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Cross-tool control",
                explanation: "Exact values make transitions between tools easier to manage consistently.",
                hint: "This is a handoff-control question."
              },
              {
                type: "mcq",
                topic: "Advanced judgment",
                prompt: "Which statement best reflects advanced color-picker judgment?",
                options: [
                  "A picker is useful because it turns a subjective visual impression into a usable workflow value",
                  "A picker only matters if the colour is very bright",
                  "Pickers are decorative tools rather than practical ones",
                  "Pickers remove the need for context in colour decisions"
                ],
                correct: "A picker is useful because it turns a subjective visual impression into a usable workflow value",
                reviewTopic: "Advanced picker judgment",
                explanation: "The picker's value is in converting appearance into something operational.",
                hint: "Choose the answer about operational value."
              }
            ]
          }
        },
        "unit-2": {
          label: "Visual Examples",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Why examples help",
                prompt: "Why are visual examples useful when learning colour workflows?",
                options: [
                  "They make abstract concepts easier to recognize in practice",
                  "They replace all theory permanently",
                  "They only matter for print",
                  "They remove the need for tools"
                ],
                correct: "They make abstract concepts easier to recognize in practice",
                reviewTopic: "Why visual examples help",
                explanation: "Visual examples help learners connect theory to visible outcomes.",
                hint: "Choose the answer about making ideas visible."
              },
              {
                type: "mcq",
                topic: "Before and after",
                prompt: "What is the main value of a before-and-after comparison in this topic?",
                options: [
                  "It helps show how a workflow choice changes the visible result",
                  "It guarantees the after version is always correct",
                  "It increases bit depth automatically",
                  "It removes the need for explanation"
                ],
                correct: "It helps show how a workflow choice changes the visible result",
                reviewTopic: "Before and after comparisons",
                explanation: "A before-and-after comparison helps connect a workflow choice to a visible outcome.",
                hint: "Think visible cause and effect."
              },
              {
                type: "true-false",
                topic: "Concrete learning",
                prompt: "Visual examples can help make workflow concepts easier to remember.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Concrete learning",
                explanation: "Concrete examples often improve understanding and recall.",
                hint: "Examples make theory easier to hold onto."
              },
              {
                type: "mcq",
                topic: "Learning benefit",
                prompt: "Which statement best explains the role of visual examples?",
                options: [
                  "They help learners connect theory with visible results and comparisons",
                  "They make standards unnecessary",
                  "They replace every practical tool",
                  "They only show decorative variation"
                ],
                correct: "They help learners connect theory with visible results and comparisons",
                reviewTopic: "Role of visual examples",
                explanation: "Their role is to make abstract workflow outcomes easier to perceive and compare.",
                hint: "Choose the theory-to-result answer."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Comparison skill",
                prompt: "What skill do visual case studies most directly support?",
                options: [
                  "Recognizing how workflow choices affect visible outcomes",
                  "Changing hardware settings blindly",
                  "Ignoring destination differences",
                  "Memorizing file names"
                ],
                correct: "Recognizing how workflow choices affect visible outcomes",
                reviewTopic: "Comparison skill",
                explanation: "Case studies train the eye to connect workflow decisions with what happens on screen or in output.",
                hint: "Choose the answer about visible workflow effects."
              },
              {
                type: "mcq",
                topic: "Gallery logic",
                prompt: "Why might a visual gallery be more useful than one isolated sample?",
                options: [
                  "Because multiple examples make patterns and differences easier to compare",
                  "Because one example can never teach anything",
                  "Because galleries remove the need for captions",
                  "Because more images always means higher accuracy"
                ],
                correct: "Because multiple examples make patterns and differences easier to compare",
                reviewTopic: "Gallery comparison logic",
                explanation: "A gallery helps learners compare several related outcomes instead of over-reading one case.",
                hint: "Choose the answer about comparison across examples."
              },
              {
                type: "true-false",
                topic: "Pattern recognition",
                prompt: "A set of visual examples can help learners recognize recurring workflow patterns.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Pattern recognition",
                explanation: "Patterns become clearer when multiple examples are viewed together.",
                hint: "This is a pattern-recognition idea."
              },
              {
                type: "mcq",
                topic: "Practical use",
                prompt: "Which workflow comment shows stronger use of visual examples?",
                options: [
                  "Let's compare several examples so we can spot the pattern rather than rely on one isolated case",
                  "One example is enough to explain every workflow problem",
                  "Examples matter only if the colors are vivid",
                  "Visual comparisons are less useful than guessing"
                ],
                correct: "Let's compare several examples so we can spot the pattern rather than rely on one isolated case",
                reviewTopic: "Practical use of examples",
                explanation: "Comparing several examples usually gives a stronger basis for interpretation.",
                hint: "Choose the answer that compares patterns."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Interpretation discipline",
                prompt: "What is the strongest reason to use visual examples in an advanced workflow discussion?",
                options: [
                  "They provide concrete evidence for how technical choices affect visible results",
                  "They eliminate the need for technical explanation",
                  "They prove the first visible result is always correct",
                  "They only matter for beginner audiences"
                ],
                correct: "They provide concrete evidence for how technical choices affect visible results",
                reviewTopic: "Interpretation discipline",
                explanation: "Examples support technical discussion by grounding it in visible evidence.",
                hint: "Choose the evidence-based answer."
              },
              {
                type: "mcq",
                topic: "Case-study value",
                prompt: "Why are case studies especially useful in advanced review discussions?",
                options: [
                  "Because they connect technical choices to practical outcomes in realistic scenarios",
                  "Because they remove all ambiguity from every workflow",
                  "Because they replace final verification",
                  "Because they only show success cases"
                ],
                correct: "Because they connect technical choices to practical outcomes in realistic scenarios",
                reviewTopic: "Case-study value",
                explanation: "Case studies help people reason about real scenarios instead of abstract rules alone.",
                hint: "Choose the realistic-scenario answer."
              },
              {
                type: "true-false",
                topic: "Evidence in review",
                prompt: "Visual examples can strengthen a workflow review by adding visible evidence to the discussion.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Evidence in review",
                explanation: "Visible evidence often improves the quality of workflow discussion and approval.",
                hint: "This is an evidence question."
              },
              {
                type: "mcq",
                topic: "Leadership use",
                prompt: "Which message reflects stronger leadership when using visual examples in a review?",
                options: [
                  "Let's compare the examples against the workflow goal instead of reacting to one image emotionally",
                  "The most vivid example is always the best one",
                  "Examples are too subjective to be useful",
                  "We can skip explanation if the gallery looks interesting"
                ],
                correct: "Let's compare the examples against the workflow goal instead of reacting to one image emotionally",
                reviewTopic: "Leadership use of examples",
                explanation: "Strong review leadership uses examples in relation to the workflow goal, not as spectacle.",
                hint: "Choose the answer that ties examples back to the goal."
              }
            ]
          }
        },
        "unit-3": {
          label: "Interactive Tools",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Tool matching",
                prompt: "Which tool is most directly associated with checking whether text and background colours are readable enough together?",
                options: [
                  "Accessibility checker",
                  "Audio mixer",
                  "File archiver",
                  "Printer driver list"
                ],
                correct: "Accessibility checker",
                reviewTopic: "Accessibility checker",
                explanation: "An accessibility checker is the tool most directly associated with evaluating readable colour combinations.",
                hint: "Pick the readability-checking tool."
              },
              {
                type: "mcq",
                topic: "Colour difference",
                prompt: "Which tool is most directly associated with measuring how different two colours are?",
                options: [
                  "Delta-E calculator",
                  "Bookmark manager",
                  "Password vault",
                  "Refresh-rate monitor"
                ],
                correct: "Delta-E calculator",
                reviewTopic: "Delta-E calculator",
                explanation: "A Delta-E calculator is used to quantify colour difference.",
                hint: "Choose the colour-difference tool."
              },
              {
                type: "true-false",
                topic: "Tool selection",
                prompt: "Different interactive tools are useful for different colour problems rather than all doing the same job.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Tool selection",
                explanation: "Each tool supports a different kind of workflow question.",
                hint: "This is about choosing the right tool."
              },
              {
                type: "mcq",
                topic: "Converter role",
                prompt: "What is a colour converter most useful for?",
                options: [
                  "Moving a colour between different representations such as HEX and RGB",
                  "Checking keyboard latency",
                  "Embedding HDR metadata",
                  "Replacing all profiles"
                ],
                correct: "Moving a colour between different representations such as HEX and RGB",
                reviewTopic: "Color converter",
                explanation: "A color converter helps translate a colour between formats or representations.",
                hint: "Pick the representation-conversion answer."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Problem-tool fit",
                prompt: "Why is it important to match the tool to the problem in a colour workflow?",
                options: [
                  "Because different tools answer different workflow questions",
                  "Because one tool can solve every colour problem equally well",
                  "Because tools only matter after final export",
                  "Because tool choice is unrelated to accuracy"
                ],
                correct: "Because different tools answer different workflow questions",
                reviewTopic: "Problem-tool fit",
                explanation: "Tool selection matters because each tool is designed for different kinds of analysis or action.",
                hint: "Choose the answer about tool specialization."
              },
              {
                type: "mcq",
                topic: "Workflow support",
                prompt: "Which is the strongest reason to use an interactive tool rather than relying only on visual intuition?",
                options: [
                  "It can provide measurable feedback for a specific decision",
                  "It guarantees the output is perfect without review",
                  "It makes profiles unnecessary",
                  "It replaces all workflow context"
                ],
                correct: "It can provide measurable feedback for a specific decision",
                reviewTopic: "Workflow support",
                explanation: "Interactive tools add measurable feedback where intuition alone may be unreliable.",
                hint: "Choose the answer about measurable feedback."
              },
              {
                type: "true-false",
                topic: "Tool evidence",
                prompt: "Interactive tools can improve a decision by adding evidence instead of relying only on guesswork.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Tool evidence",
                explanation: "That is one of the main practical benefits of interactive tools.",
                hint: "This is an evidence-versus-guessing question."
              },
              {
                type: "mcq",
                topic: "Practical comment",
                prompt: "Which comment shows stronger interactive-tool judgment?",
                options: [
                  "Let's pick the tool that directly measures the problem we're trying to solve",
                  "Every tool is interchangeable, so the choice does not matter",
                  "Visual guesswork is always enough",
                  "Tools should only be used after approval"
                ],
                correct: "Let's pick the tool that directly measures the problem we're trying to solve",
                reviewTopic: "Interactive-tool judgment",
                explanation: "Strong tool use starts by matching the tool to the actual workflow question.",
                hint: "Choose the answer about fit between tool and problem."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Decision quality",
                prompt: "What is the strongest reason advanced teams still rely on interactive tools even with strong visual experience?",
                options: [
                  "Because tools provide measurable checks that strengthen judgment and communication",
                  "Because visual expertise becomes useless without tools",
                  "Because tools remove all need for interpretation",
                  "Because one tool can replace the whole workflow"
                ],
                correct: "Because tools provide measurable checks that strengthen judgment and communication",
                reviewTopic: "Decision quality",
                explanation: "Strong teams use tools to support judgment with evidence, not to replace expertise.",
                hint: "Choose the answer about measurable support."
              },
              {
                type: "mcq",
                topic: "Workflow discipline",
                prompt: "Which statement best reflects mature interactive-tool use?",
                options: [
                  "Use the tool that best answers the current workflow question, then interpret the result in context",
                  "Use every tool on every problem whether relevant or not",
                  "If a tool returns a number, context no longer matters",
                  "Avoid tools once the design looks appealing"
                ],
                correct: "Use the tool that best answers the current workflow question, then interpret the result in context",
                reviewTopic: "Workflow discipline",
                explanation: "Mature tool use combines the right measurement with contextual interpretation.",
                hint: "Choose the answer that includes both measurement and context."
              },
              {
                type: "true-false",
                topic: "Context plus evidence",
                prompt: "Interactive-tool output is most useful when combined with workflow context rather than treated as isolated data.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Context plus evidence",
                explanation: "Tool output becomes most meaningful when interpreted in context.",
                hint: "Evidence still needs interpretation."
              },
              {
                type: "mcq",
                topic: "Team guidance",
                prompt: "Which message reflects stronger advanced workflow guidance?",
                options: [
                  "Let's choose the right tool, gather evidence, and then judge it against the output goal",
                  "A tool result is always correct even if it conflicts with the workflow goal",
                  "The most complex tool is always the best choice",
                  "Tool choice does not matter if the colors look vivid"
                ],
                correct: "Let's choose the right tool, gather evidence, and then judge it against the output goal",
                reviewTopic: "Advanced workflow guidance",
                explanation: "Strong guidance combines tool choice, evidence gathering, and goal-based interpretation.",
                hint: "Choose the answer that keeps the output goal in view."
              }
            ]
          }
        },
        "unit-4": {
          label: "Applied Decision Making",
          levels: {
            easy: [
              {
                type: "mcq",
                topic: "Choosing a next step",
                prompt: "When a colour issue is visible, what is the most useful first move in an applied workflow?",
                options: [
                  "Identify what kind of problem it is before choosing a tool or fix",
                  "Change settings randomly until it looks different",
                  "Assume the destination does not matter",
                  "Skip directly to final approval"
                ],
                correct: "Identify what kind of problem it is before choosing a tool or fix",
                reviewTopic: "Choosing a next step",
                explanation: "Applied decisions start with identifying the problem clearly rather than changing things blindly.",
                hint: "Choose diagnosis before reaction."
              },
              {
                type: "mcq",
                topic: "Practical workflow",
                prompt: "Which action best fits applied decision making after spotting a readability issue?",
                options: [
                  "Check contrast with a suitable tool and then adjust the colours if needed",
                  "Ignore the issue if the palette is attractive",
                  "Assume the issue will disappear on other devices",
                  "Rename the file and export again"
                ],
                correct: "Check contrast with a suitable tool and then adjust the colours if needed",
                reviewTopic: "Practical workflow",
                explanation: "A good applied workflow measures the issue and then makes a deliberate adjustment.",
                hint: "Choose the measure-then-adjust answer."
              },
              {
                type: "true-false",
                topic: "Diagnosis before action",
                prompt: "Applied colour decisions are usually stronger when the problem is identified before the tool is chosen.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Diagnosis before action",
                explanation: "The right tool depends on understanding the problem first.",
                hint: "This is a diagnosis question."
              },
              {
                type: "mcq",
                topic: "Goal awareness",
                prompt: "Which comment shows better applied decision making?",
                options: [
                  "Let's define the goal and problem first, then choose the right check or tool",
                  "Any tool will do as long as we use one",
                  "The workflow goal does not matter after design begins",
                  "If the colors are vivid, the decision is automatically correct"
                ],
                correct: "Let's define the goal and problem first, then choose the right check or tool",
                reviewTopic: "Goal awareness",
                explanation: "Applied decisions should be grounded in the actual goal and problem.",
                hint: "Choose the answer that starts with the goal."
              }
            ],
            medium: [
              {
                type: "mcq",
                topic: "Integrated choice",
                prompt: "Which statement best reflects integrated decision making in a colour workflow?",
                options: [
                  "Match the tool, measurement, and adjustment to the actual problem and destination",
                  "Use one repeated fix for every colour issue",
                  "Assume the first acceptable preview is final",
                  "Ignore the destination once a palette is chosen"
                ],
                correct: "Match the tool, measurement, and adjustment to the actual problem and destination",
                reviewTopic: "Integrated choice",
                explanation: "Integrated decision making fits the response to the actual problem and the target context.",
                hint: "Choose the context-aware workflow answer."
              },
              {
                type: "mcq",
                topic: "Decision sequence",
                prompt: "Which sequence is strongest in applied colour problem solving?",
                options: [
                  "Identify the issue -> choose the right check -> interpret the result -> adjust deliberately",
                  "Adjust randomly -> approve quickly -> inspect later -> explain afterward",
                  "Pick the most complex tool -> export immediately -> skip review",
                  "Choose a palette first -> ignore feedback -> finalize"
                ],
                correct: "Identify the issue -> choose the right check -> interpret the result -> adjust deliberately",
                reviewTopic: "Decision sequence",
                explanation: "A strong applied workflow moves from diagnosis to measurement to interpretation to controlled adjustment.",
                hint: "Choose the sequence with diagnosis first."
              },
              {
                type: "true-false",
                topic: "Integrated reasoning",
                prompt: "Applied colour decisions should combine tools, visible outcomes, and destination context rather than relying on one factor alone.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Integrated reasoning",
                explanation: "Strong decisions combine evidence, context, and visible outcomes.",
                hint: "This is an integration question."
              },
              {
                type: "mcq",
                topic: "Review mindset",
                prompt: "Which team comment reflects better applied review practice?",
                options: [
                  "Let's verify that the change solves the real problem in the real context before we approve it",
                  "If one metric improved, approval is automatic",
                  "Context only slows down decision making",
                  "The first fix is usually the final fix"
                ],
                correct: "Let's verify that the change solves the real problem in the real context before we approve it",
                reviewTopic: "Review mindset",
                explanation: "A strong review mindset checks whether the fix solves the real problem in context.",
                hint: "Choose the answer about verifying the real outcome."
              }
            ],
            hard: [
              {
                type: "mcq",
                topic: "Workflow maturity",
                prompt: "What best distinguishes mature applied colour decision making from guesswork?",
                options: [
                  "It links diagnosis, measurement, interpretation, adjustment, and final-context review",
                  "It changes many settings quickly and hopes for the best",
                  "It treats every visible issue as the same kind of problem",
                  "It assumes one successful preview proves every destination"
                ],
                correct: "It links diagnosis, measurement, interpretation, adjustment, and final-context review",
                reviewTopic: "Workflow maturity",
                explanation: "Mature decisions connect the whole chain from diagnosis through final-context review.",
                hint: "Choose the full-chain answer."
              },
              {
                type: "mcq",
                topic: "Leadership judgment",
                prompt: "Which statement best reflects advanced applied decision making?",
                options: [
                  "A good fix is one that solves the measured problem and still fits the destination and user goal",
                  "A vivid fix is always better than a measured one",
                  "One metric can replace all workflow judgment",
                  "If the tool gives a number, review is unnecessary"
                ],
                correct: "A good fix is one that solves the measured problem and still fits the destination and user goal",
                reviewTopic: "Leadership judgment",
                explanation: "Advanced applied decisions still have to serve the real destination and user goal.",
                hint: "Choose the answer that balances evidence and context."
              },
              {
                type: "true-false",
                topic: "Context-aware final check",
                prompt: "A strong applied decision should still be checked against the final context before sign-off.",
                options: ["True", "False"],
                correct: "True",
                reviewTopic: "Context-aware final check",
                explanation: "Final-context review is what separates a plausible fix from a trustworthy one.",
                hint: "This is a sign-off discipline point."
              },
              {
                type: "mcq",
                topic: "Team guidance",
                prompt: "Which message shows the strongest applied workflow guidance?",
                options: [
                  "Let's confirm that the chosen fix solves the measured issue and still works for the target users and destination",
                  "The tool result alone decides everything",
                  "If the palette feels modern, the fix is done",
                  "The destination can be checked after release"
                ],
                correct: "Let's confirm that the chosen fix solves the measured issue and still works for the target users and destination",
                reviewTopic: "Applied workflow guidance",
                explanation: "Strong guidance asks whether the fix solves the measured issue and remains fit for the real target context.",
                hint: "Choose the answer that verifies both evidence and destination fit."
              }
            ]
          }
        }
      }
    }
  };
})();
