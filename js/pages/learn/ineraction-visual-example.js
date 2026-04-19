export class VisualExample {
    constructor() {
        this.currentCategory = 'photography';
        this.currentExample = 0;
        this.viewMode = 'side-by-side';
        this.selectedCaseStudy = 'photography';

        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadGalleryData();
        this.loadCaseStudyData();
    }

    cacheElements() {
        // Gallery elements
        this.galleryCategory = document.getElementById('gallery-category');
        this.viewModeSelect = document.getElementById('view-mode');
        this.comparisonContainer = document.getElementById('comparison-container');
        this.prevBtn = document.getElementById('prev-example');
        this.nextBtn = document.getElementById('next-example');
        this.exampleCounter = document.querySelector('.example-counter');

        // Explanation panel
        this.problemDesc = document.getElementById('problem-desc');
        this.solutionDesc = document.getElementById('solution-desc');
        this.technicalDetails = document.getElementById('technical-details');
        this.bestPractices = document.getElementById('best-practices');

        // Gamut examples
        this.vizTypeSelect = document.getElementById('viz-type');
        this.sampleImageSelect = document.getElementById('sample-image');
        this.gamutCanvas = document.getElementById('gamut-comparison-canvas');
        this.showHideGamutBtn = document.getElementById('show-hide-gamut');
        this.highlightOogBtn = document.getElementById('highlight-oog');
        this.renderingIntentSelect = document.getElementById('rendering-intent');

        // Case studies
        this.caseStudySelect = document.getElementById('case-study-select');
        this.caseContent = document.getElementById('case-content');
        this.scenarioText = document.getElementById('scenario-text');
        this.investigationChecklist = document.getElementById('investigation-checklist');
        this.solutionSteps = document.getElementById('solution-steps');
    }

    bindEvents() {
        // Gallery controls
        if (this.galleryCategory) {
            this.galleryCategory.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.currentExample = 0;
                this.updateGallery();
            });
        }

        if (this.viewModeSelect) {
            this.viewModeSelect.addEventListener('change', (e) => {
                this.viewMode = e.target.value;
                this.updateViewMode();
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousExample());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextExample());
        }

        // Gamut visualization
        if (this.vizTypeSelect) {
            this.vizTypeSelect.addEventListener('change', () => this.drawGamutVisualization());
        }

        if (this.sampleImageSelect) {
            this.sampleImageSelect.addEventListener('change', () => this.drawGamutVisualization());
        }

        if (this.showHideGamutBtn) {
            this.showHideGamutBtn.addEventListener('click', () => this.toggleGamutDisplay());
        }

        if (this.highlightOogBtn) {
            this.highlightOogBtn.addEventListener('click', () => this.highlightOutOfGamut());
        }

        if (this.renderingIntentSelect) {
            this.renderingIntentSelect.addEventListener('change', () => this.updateRenderingIntent());
        }

        // Color space toggles
        document.querySelectorAll('.space-toggle input').forEach(toggle => {
            toggle.addEventListener('change', () => this.drawGamutVisualization());
        });

        // Case study selector
        if (this.caseStudySelect) {
            this.caseStudySelect.addEventListener('change', (e) => {
                this.selectedCaseStudy = e.target.value;
                this.loadCaseStudyData();
            });
        }

        // Investigation checklist
        if (this.investigationChecklist) {
            this.investigationChecklist.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.checkInvestigationProgress();
                }
            });
        }
    }

    loadGalleryData() {
        this.galleryData = {
            photography: [
                {
                    title: 'Monitor Calibration Impact',
                    before: { color: '#ff6b6b', desc: 'Uncalibrated monitor, colors appear too warm' },
                    after: { color: '#4ecdc4', desc: 'Calibrated to D65, accurate color representation' },
                    problem: 'Monitor not calibrated for 6+ months, white point shifted to 7500K',
                    solution: 'Hardware calibration using X-Rite i1Display Pro, set to D65/2.2 gamma',
                    technical: [
                        'White point corrected from 7500K to 6500K',
                        'Gamma adjusted from 2.4 to 2.2',
                        'Brightness set to 120 cd/m²',
                        'sRGB gamut verified'
                    ],
                    practices: [
                        'Calibrate monitors monthly',
                        'Use hardware calibrators for accuracy',
                        'Document calibration settings',
                        'Verify with test images'
                    ]
                },
                {
                    title: 'RAW to sRGB Conversion',
                    before: { color: '#95e1d3', desc: 'Wide gamut ProPhoto RGB, vibrant but inaccurate on web' },
                    after: { color: '#fce38a', desc: 'Converted to sRGB, consistent across devices' },
                    problem: 'Photos looked oversaturated on client screens without color management',
                    solution: 'Proper conversion from ProPhoto RGB to sRGB with perceptual rendering',
                    technical: [
                        'Source: ProPhoto RGB 16-bit',
                        'Destination: sRGB 8-bit',
                        'Rendering intent: Perceptual',
                        'Black point compensation enabled'
                    ],
                    practices: [
                        'Edit in wide gamut, export in sRGB for web',
                        'Always convert with proper rendering intent',
                        'Soft proof before exporting',
                        'Keep master files in original color space'
                    ]
                },
                {
                    title: 'Print vs Screen Comparison',
                    before: { color: '#a8e6cf', desc: 'Screen display in RGB, bright and saturated' },
                    after: { color: '#fdcb6e', desc: 'Print output in CMYK, more muted tones' },
                    problem: 'Printed colors appeared dull compared to screen preview',
                    solution: 'Implemented soft proofing and printer profiling workflow',
                    technical: [
                        'Created custom ICC profile for printer/paper combination',
                        'Used soft proofing in Photoshop',
                        'Adjusted saturation for print limitations',
                        'Test prints validated results'
                    ],
                    practices: [
                        'Always soft proof before printing',
                        'Create custom printer profiles',
                        'Understand CMYK limitations',
                        'Keep reference prints for comparison'
                    ]
                }
            ],
            design: [
                {
                    title: 'Logo Color Consistency',
                    before: { color: '#6c5ce7', desc: 'Logo appears different on web, print, and mobile' },
                    after: { color: '#fd79a8', desc: 'Consistent brand color across all media' },
                    problem: 'Brand logo showed significant color variation across different platforms',
                    solution: 'Established brand color guidelines with specific color values for each medium',
                    technical: [
                        'Web: sRGB #6C5CE7',
                        'Print: Pantone 2685C, CMYK 60,70,0,0',
                        'Mobile: Display P3 optimized',
                        'Created brand style guide with color specs'
                    ],
                    practices: [
                        'Define brand colors in multiple color spaces',
                        'Provide hex, RGB, CMYK, and Pantone values',
                        'Test on actual devices and materials',
                        'Update guidelines as technology evolves'
                    ]
                }
            ],
            video: [
                {
                    title: 'SDR vs HDR Comparison',
                    before: { color: '#636e72', desc: 'Standard Dynamic Range, limited brightness range' },
                    after: { color: '#ffeaa7', desc: 'HDR10, expanded brightness and color gamut' },
                    problem: 'HDR content looked flat when viewed on SDR displays without proper tone mapping',
                    solution: 'Implemented HDR10 workflow with metadata and fallback SDR grade',
                    technical: [
                        'Mastered in Rec.2020 color space',
                        'HDR10 with static metadata',
                        'Peak brightness: 1000 nits',
                        'Separate SDR grade for compatibility'
                    ],
                    practices: [
                        'Grade for both HDR and SDR',
                        'Use proper HDR monitoring equipment',
                        'Include metadata in deliverables',
                        'Test on multiple display types'
                    ]
                }
            ],
            problems: [
                {
                    title: 'Missing Profile Problem',
                    before: { color: '#dfe6e9', desc: 'Image without embedded profile, interpreted incorrectly' },
                    after: { color: '#74b9ff', desc: 'Profile embedded, colors display correctly' },
                    problem: 'Images opened with wrong color assumptions, causing color shifts',
                    solution: 'Always embed ICC profiles and set proper working color space',
                    technical: [
                        'Untagged images assumed sRGB by default',
                        'Actual color space was Adobe RGB',
                        'Color shift of ΔE 15.3 observed',
                        'Profile embedding resolved issue'
                    ],
                    practices: [
                        'Always embed color profiles',
                        'Set up color management policies',
                        'Warn users about untagged images',
                        'Use batch tools to add missing profiles'
                    ]
                }
            ]
        };

        this.updateGallery();
    }

    updateGallery() {
        const category = this.galleryData[this.currentCategory];
        if (!category || category.length === 0) return;

        const example = category[this.currentExample];

        // Update counter
        if (this.exampleCounter) {
            this.exampleCounter.textContent = `Example ${this.currentExample + 1} of ${category.length}`;
        }

        // Update images (using SVG placeholders with different colors)
        const beforeImg = this.comparisonContainer?.querySelector('.before img');
        const afterImg = this.comparisonContainer?.querySelector('.after img');

        if (beforeImg) {
            beforeImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='${encodeURIComponent(example.before.color)}' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3EBEFORE%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12'%3E${encodeURIComponent(example.before.desc)}%3C/text%3E%3C/svg%3E`;
        }

        if (afterImg) {
            afterImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='${encodeURIComponent(example.after.color)}' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18' font-weight='bold'%3EAFTER%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='12'%3E${encodeURIComponent(example.after.desc)}%3C/text%3E%3C/svg%3E`;
        }

        // Update descriptions
        if (this.problemDesc) this.problemDesc.textContent = example.problem;
        if (this.solutionDesc) this.solutionDesc.textContent = example.solution;

        // Update technical details
        if (this.technicalDetails) {
            this.technicalDetails.innerHTML = example.technical.map(item => `<li>${item}</li>`).join('');
        }

        // Update best practices
        if (this.bestPractices) {
            this.bestPractices.innerHTML = example.practices.map(item => `<li>${item}</li>`).join('');
        }

        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentExample === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentExample === category.length - 1;
        }
    }

    previousExample() {
        if (this.currentExample > 0) {
            this.currentExample--;
            this.updateGallery();
        }
    }

    nextExample() {
        const category = this.galleryData[this.currentCategory];
        if (category && this.currentExample < category.length - 1) {
            this.currentExample++;
            this.updateGallery();
        }
    }

    updateViewMode() {
        if (!this.comparisonContainer) return;

        this.comparisonContainer.className = `comparison-container view-${this.viewMode}`;

        if (this.viewMode === 'slider') {
            this.setupSliderComparison();
        } else {
            this.removeSliderComparison();
        }
    }

    setupSliderComparison() {
        // Add slider functionality
        let isDragging = false;
        const divider = document.getElementById('comparison-divider');

        if (!divider) return;

        const handleSlide = (e) => {
            if (!isDragging) return;

            const rect = this.comparisonContainer.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

            divider.style.left = `${percentage}%`;

            const beforeImg = this.comparisonContainer.querySelector('.before');
            if (beforeImg) {
                beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            }
        };

        divider.addEventListener('mousedown', () => { isDragging = true; });
        divider.addEventListener('touchstart', () => { isDragging = true; });

        window.addEventListener('mousemove', handleSlide);
        window.addEventListener('touchmove', handleSlide);

        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
    }

    removeSliderComparison() {
        const divider = document.getElementById('comparison-divider');
        const beforeImg = this.comparisonContainer?.querySelector('.before');

        if (divider) divider.style.left = '50%';
        if (beforeImg) beforeImg.style.clipPath = 'none';
    }

    drawGamutVisualization() {
        if (!this.gamutCanvas) return;

        const ctx = this.gamutCanvas.getContext('2d');
        const width = this.gamutCanvas.width;
        const height = this.gamutCanvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);

        const vizType = this.vizTypeSelect?.value || 'triangle';

        if (vizType === 'triangle') {
            this.drawGamutTriangles(ctx, width, height);
        } else if (vizType === 'volume') {
            this.drawColorVolume(ctx, width, height);
        } else if (vizType === 'mapping') {
            this.drawGamutMapping(ctx, width, height);
        }
    }

    drawGamutTriangles(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = Math.min(width, height) * 0.35;

        const spaces = {
            'srgb': { color: '#FF0000', primaries: this.getPrimaries('srgb') },
            'adobe-rgb': { color: '#00FF00', primaries: this.getPrimaries('adobe-rgb') },
            'dci-p3': { color: '#0000FF', primaries: this.getPrimaries('dci-p3') },
            'prophoto': { color: '#00FFFF', primaries: this.getPrimaries('prophoto') }
        };

        Object.entries(spaces).forEach(([name, data]) => {
            const toggle = document.querySelector(`[data-space="${name}"]`);
            if (!toggle || !toggle.checked) return;

            const { red, green, blue } = data.primaries;

            ctx.strokeStyle = data.color;
            ctx.lineWidth = 3;
            ctx.fillStyle = data.color + '22';

            ctx.beginPath();
            ctx.moveTo(centerX + red.x * scale, centerY - red.y * scale);
            ctx.lineTo(centerX + green.x * scale, centerY - green.y * scale);
            ctx.lineTo(centerX + blue.x * scale, centerY - blue.y * scale);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = data.color;
            ctx.font = 'bold 12px Arial';
            ctx.fillText(name.toUpperCase(), centerX + 10, centerY - scale + 15);
        });
    }

    drawColorVolume(ctx, width, height) {
        // Simplified 3D volume representation
        const layers = 5;
        const baseSize = Math.min(width, height) * 0.3;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < layers; i++) {
            const size = baseSize * (1 - i * 0.15);
            const lightness = 20 + i * 15;

            ctx.fillStyle = `hsl(0, 0%, ${lightness}%)`;
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.arc(centerX, centerY, size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.fillText(`L* ${Math.round(lightness)}`, centerX + size + 5, centerY);
        }
    }

    drawGamutMapping(ctx, width, height) {
        // Show image with out-of-gamut areas highlighted
        ctx.fillStyle = '#ddd';
        ctx.fillRect(50, 50, width - 100, height - 100);

        // Simulate out-of-gamut areas
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(100, 100, 150, 100);
        ctx.fillRect(300, 150, 100, 80);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Out-of-Gamut Areas Highlighted', 50, 30);

        ctx.font = '12px Arial';
        ctx.fillText('Red areas exceed destination gamut', 50, height - 20);
    }

    getPrimaries(space) {
        const primaries = {
            'srgb': {
                red: { x: 0.64, y: 0.33 },
                green: { x: 0.30, y: 0.60 },
                blue: { x: 0.15, y: 0.06 }
            },
            'adobe-rgb': {
                red: { x: 0.64, y: 0.33 },
                green: { x: 0.21, y: 0.71 },
                blue: { x: 0.15, y: 0.06 }
            },
            'dci-p3': {
                red: { x: 0.68, y: 0.32 },
                green: { x: 0.265, y: 0.69 },
                blue: { x: 0.15, y: 0.06 }
            },
            'prophoto': {
                red: { x: 0.7347, y: 0.2653 },
                green: { x: 0.1596, y: 0.8404 },
                blue: { x: 0.0366, y: 0.0001 }
            }
        };

        return primaries[space] || primaries['srgb'];
    }

    toggleGamutDisplay() {
        this.drawGamutVisualization();
    }

    highlightOutOfGamut() {
        alert('Out-of-gamut areas would be highlighted in the visualization');
        this.drawGamutVisualization();
    }

    updateRenderingIntent() {
        const intent = this.renderingIntentSelect?.value;
        console.log('Rendering intent changed to:', intent);
    }

    loadCaseStudyData() {
        this.caseStudies = {
            photography: {
                scenario: 'A professional photographer delivers prints to a client, but the client complains that the printed colors look completely different from what they saw on the photographer\'s monitor during the editing session.',
                steps: [
                    'Calibrate monitor using X-Rite i1Display Pro',
                    'Convert all working files to Adobe RGB (1998)',
                    'Embed ICC profiles in all exported files',
                    'Create custom printer profile for print shop',
                    'Implement soft proofing in editing workflow',
                    'Establish regular calibration schedule'
                ]
            },
            brand: {
                scenario: 'A company\'s logo appears in different shades of blue across their website, business cards, packaging, and storefront signage, damaging brand consistency and professionalism.',
                steps: [
                    'Audit all brand materials for color variations',
                    'Define official brand colors in multiple color spaces',
                    'Create comprehensive brand style guide',
                    'Provide color specifications for each medium',
                    'Train designers and vendors on color standards',
                    'Implement quality control checks'
                ]
            },
            video: {
                scenario: 'An HDR video production looks perfect in the grading suite but appears washed out and incorrect when viewed on the client\'s home TV, leading to rejection of the final deliverable.',
                steps: [
                    'Grade with proper HDR monitoring (1000+ nits)',
                    'Include HDR10 metadata in deliverables',
                    'Create separate SDR grade for compatibility',
                    'Test on multiple consumer displays',
                    'Provide viewing environment guidelines',
                    'Document technical specifications clearly'
                ]
            },
            ecommerce: {
                scenario: 'An online retailer receives numerous customer complaints and returns because product colors don\'t match what customers see on their screens, resulting in lost revenue and damaged reputation.',
                steps: [
                    'Calibrate product photography setup',
                    'Use standardized lighting (D50/D65)',
                    'Shoot in RAW and convert to sRGB',
                    'Include color reference charts in shots',
                    'Display products on calibrated monitors',
                    'Add disclaimer about screen variations'
                ]
            }
        };

        const caseStudy = this.caseStudies[this.selectedCaseStudy];
        if (!caseStudy) return;

        // Update scenario
        if (this.scenarioText) {
            this.scenarioText.textContent = caseStudy.scenario;
        }

        // Update solution steps
        if (this.solutionSteps) {
            this.solutionSteps.innerHTML = caseStudy.steps.map(step => `<li>${step}</li>`).join('');
        }

        // Reset checklist
        if (this.investigationChecklist) {
            this.investigationChecklist.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
        }
    }

    checkInvestigationProgress() {
        const checkboxes = this.investigationChecklist?.querySelectorAll('input[type="checkbox"]');
        if (!checkboxes) return;

        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const total = checkboxes.length;

        if (checked === total) {
            // All items checked - could show completion message
            console.log('Investigation complete!');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('visual-gallery')) {
            window.visualExample = new VisualExample();
        }
    });
} else {
    if (document.getElementById('visual-gallery')) {
        window.visualExample = new VisualExample();
    }
}
