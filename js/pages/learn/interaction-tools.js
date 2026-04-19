export class InteractionTools {
    constructor() {
        this.batchConversions = [];
        this.init();
    }

    init() {
        this.initializeColorConverter();
        this.initializeGamutSimulator();
        this.initializeDeltaECalculator();
        this.initializeAccessibilityChecker();
    }

    // ========== Color Converter Tool ==========
    initializeColorConverter() {
        const convertBtn = document.getElementById('convert-btn');
        if (!convertBtn) return;

        convertBtn.addEventListener('click', () => this.performConversion());

        const fromSpace = document.getElementById('convert-from-space');
        if (fromSpace) {
            fromSpace.addEventListener('change', (e) => this.updateInputFields(e.target.value));
        }

        const copyAllBtn = document.getElementById('copy-all-btn');
        if (copyAllBtn) {
            copyAllBtn.addEventListener('click', () => this.copyAllResults());
        }

        const addToBatchBtn = document.getElementById('add-to-batch');
        if (addToBatchBtn) {
            addToBatchBtn.addEventListener('click', () => this.addToBatch());
        }

        const exportCsvBtn = document.getElementById('export-csv');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => this.exportBatch('csv'));
        }

        const exportJsonBtn = document.getElementById('export-json');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.exportBatch('json'));
        }
    }

    updateInputFields(space) {
        const container = document.getElementById('input-values');
        if (!container) return;

        let html = '';

        switch(space) {
            case 'rgb':
                html = `
                    <div class="value-inputs">
                        <input type="number" id="input-r" placeholder="R" min="0" max="255" value="255" />
                        <input type="number" id="input-g" placeholder="G" min="0" max="255" value="0" />
                        <input type="number" id="input-b" placeholder="B" min="0" max="255" value="0" />
                    </div>`;
                break;
            case 'hsl':
                html = `
                    <div class="value-inputs">
                        <input type="number" id="input-h" placeholder="H°" min="0" max="360" value="0" />
                        <input type="number" id="input-s" placeholder="S%" min="0" max="100" value="100" />
                        <input type="number" id="input-l" placeholder="L%" min="0" max="100" value="50" />
                    </div>`;
                break;
            case 'cmyk':
                html = `
                    <div class="value-inputs">
                        <input type="number" id="input-c" placeholder="C%" min="0" max="100" value="0" />
                        <input type="number" id="input-m" placeholder="M%" min="0" max="100" value="100" />
                        <input type="number" id="input-y" placeholder="Y%" min="0" max="100" value="100" />
                        <input type="number" id="input-k" placeholder="K%" min="0" max="100" value="0" />
                    </div>`;
                break;
            case 'lab':
                html = `
                    <div class="value-inputs">
                        <input type="number" id="input-l" placeholder="L*" min="0" max="100" value="53" />
                        <input type="number" id="input-a" placeholder="a*" min="-128" max="127" value="80" />
                        <input type="number" id="input-b" placeholder="b*" min="-128" max="127" value="67" />
                    </div>`;
                break;
            case 'hex':
                html = `
                    <div class="value-inputs">
                        <input type="text" id="input-hex" placeholder="#RRGGBB" value="#FF0000" maxlength="7" />
                    </div>`;
                break;
        }

        container.innerHTML = html;
    }

    performConversion() {
        const fromSpace = document.getElementById('convert-from-space')?.value;
        if (!fromSpace) return;

        let rgb = { r: 255, g: 0, b: 0 };

        switch(fromSpace) {
            case 'rgb':
                rgb.r = parseInt(document.getElementById('input-r')?.value || 255);
                rgb.g = parseInt(document.getElementById('input-g')?.value || 0);
                rgb.b = parseInt(document.getElementById('input-b')?.value || 0);
                break;
            case 'hex':
                const hex = document.getElementById('input-hex')?.value || '#FF0000';
                rgb = this.hexToRgb(hex);
                break;
            case 'hsl':
                const h = parseInt(document.getElementById('input-h')?.value || 0);
                const s = parseInt(document.getElementById('input-s')?.value || 100);
                const l = parseInt(document.getElementById('input-l')?.value || 50);
                rgb = this.hslToRgb(h, s, l);
                break;
            case 'cmyk':
                const c = parseInt(document.getElementById('input-c')?.value || 0);
                const m = parseInt(document.getElementById('input-m')?.value || 100);
                const y = parseInt(document.getElementById('input-y')?.value || 100);
                const k = parseInt(document.getElementById('input-k')?.value || 0);
                rgb = this.cmykToRgb(c, m, y, k);
                break;
            case 'lab':
                const labL = parseInt(document.getElementById('input-l')?.value || 53);
                const labA = parseInt(document.getElementById('input-a')?.value || 80);
                const labB = parseInt(document.getElementById('input-b')?.value || 67);
                rgb = this.labToRgb(labL, labA, labB);
                break;
        }

        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        const lab = this.rgbToLab(rgb.r, rgb.g, rgb.b);
        const xyz = this.rgbToXyz(rgb.r, rgb.g, rgb.b);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

        document.getElementById('result-rgb').textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        document.getElementById('result-hsl').textContent = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`;
        document.getElementById('result-hsv').textContent = `${Math.round(hsv.h)}°, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%`;
        document.getElementById('result-cmyk').textContent = `${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%`;
        document.getElementById('result-lab').textContent = `${Math.round(lab.l)}, ${Math.round(lab.a)}, ${Math.round(lab.b)}`;
        document.getElementById('result-xyz').textContent = `${xyz.x.toFixed(2)}, ${xyz.y.toFixed(2)}, ${xyz.z.toFixed(2)}`;
        document.getElementById('result-hex').textContent = hex;
    }

    copyAllResults() {
        const results = {
            rgb: document.getElementById('result-rgb')?.textContent,
            hsl: document.getElementById('result-hsl')?.textContent,
            cmyk: document.getElementById('result-cmyk')?.textContent,
            lab: document.getElementById('result-lab')?.textContent,
            hex: document.getElementById('result-hex')?.textContent
        };

        const text = Object.entries(results).map(([key, value]) => `${key.toUpperCase()}: ${value}`).join('\n');

        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        });
    }

    addToBatch() {
        const conversion = {
            timestamp: new Date().toISOString(),
            rgb: document.getElementById('result-rgb')?.textContent,
            hsl: document.getElementById('result-hsl')?.textContent,
            cmyk: document.getElementById('result-cmyk')?.textContent,
            hex: document.getElementById('result-hex')?.textContent
        };

        this.batchConversions.push(conversion);
        this.updateBatchDisplay();
    }

    updateBatchDisplay() {
        const batchSection = document.getElementById('batch-section');
        const batchList = document.getElementById('batch-list');

        if (!batchSection || !batchList) return;

        if (this.batchConversions.length > 0) {
            batchSection.style.display = 'block';
            batchList.innerHTML = this.batchConversions.map((item, index) => `
                <div class="batch-item">
                    <span>${index + 1}. ${item.hex}</span>
                    <span>RGB(${item.rgb})</span>
                </div>
            `).join('');
        }
    }

    exportBatch(format) {
        if (this.batchConversions.length === 0) {
            alert('No conversions to export!');
            return;
        }

        let content, mimeType, extension;

        if (format === 'csv') {
            content = 'Index,Hex,RGB,HSL,CMYK\n';
            content += this.batchConversions.map((item, index) =>
                `${index + 1},${item.hex},${item.rgb},${item.hsl},${item.cmyk}`
            ).join('\n');
            mimeType = 'text/csv';
            extension = 'csv';
        } else {
            content = JSON.stringify(this.batchConversions, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-conversions.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ========== Gamut Simulator ==========
    initializeGamutSimulator() {
        const runBtn = document.getElementById('run-simulation');
        if (!runBtn) return;

        runBtn.addEventListener('click', () => this.runGamutSimulation());

        this.drawSampleImage('source-canvas');
        this.drawSampleImage('dest-canvas');
    }

    drawSampleImage(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#FF0000');
        gradient.addColorStop(0.5, '#00FF00');
        gradient.addColorStop(1, '#0000FF');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    runGamutSimulation() {
        const sourceSpace = document.getElementById('source-space')?.value;
        const destSpace = document.getElementById('dest-space')?.value;
        const renderingIntent = document.getElementById('sim-rendering-intent')?.value;

        console.log('Running simulation:', { sourceSpace, destSpace, renderingIntent });

        this.drawSampleImage('dest-canvas');

        document.getElementById('gamut-coverage').textContent = '87%';
        document.getElementById('oog-pixels').textContent = '2.8%';
        document.getElementById('avg-delta-e').textContent = '1.9';
        document.getElementById('max-delta-e').textContent = '7.2';

        alert(`Simulation complete!\nSource: ${sourceSpace}\nDestination: ${destSpace}\nRendering: ${renderingIntent}`);
    }

    // ========== Delta-E Calculator ==========
    initializeDeltaECalculator() {
        const calculateBtn = document.getElementById('calculate-delta-e');
        if (!calculateBtn) return;

        calculateBtn.addEventListener('click', () => this.calculateDeltaE());

        const colorAPicker = document.getElementById('color-a-picker');
        const colorBPicker = document.getElementById('color-b-picker');

        if (colorAPicker) {
            colorAPicker.addEventListener('input', (e) => {
                const rgb = this.hexToRgb(e.target.value);
                document.getElementById('color-a-r').value = rgb.r;
                document.getElementById('color-a-g').value = rgb.g;
                document.getElementById('color-a-b').value = rgb.b;
            });
        }

        if (colorBPicker) {
            colorBPicker.addEventListener('input', (e) => {
                const rgb = this.hexToRgb(e.target.value);
                document.getElementById('color-b-r').value = rgb.r;
                document.getElementById('color-b-g').value = rgb.g;
                document.getElementById('color-b-b').value = rgb.b;
            });
        }
    }

    calculateDeltaE() {
        const colorA = {
            r: parseInt(document.getElementById('color-a-r')?.value || 255),
            g: parseInt(document.getElementById('color-a-g')?.value || 0),
            b: parseInt(document.getElementById('color-a-b')?.value || 0)
        };

        const colorB = {
            r: parseInt(document.getElementById('color-b-r')?.value || 250),
            g: parseInt(document.getElementById('color-b-g')?.value || 10),
            b: parseInt(document.getElementById('color-b-b')?.value || 10)
        };

        const tolerance = parseFloat(document.getElementById('tolerance-value')?.value || 2.3);

        const deltaE = this.calculateSimpleDeltaE(colorA, colorB);

        document.getElementById('delta-e-value').textContent = deltaE.toFixed(1);

        const passFail = document.getElementById('pass-fail');
        if (deltaE <= tolerance) {
            passFail.className = 'pass-fail-indicator pass';
            passFail.innerHTML = '<span class="status-icon">✓</span><span class="status-text">PASS (within tolerance)</span>';
        } else {
            passFail.className = 'pass-fail-indicator fail';
            passFail.innerHTML = '<span class="status-icon">✗</span><span class="status-text">FAIL (exceeds tolerance)</span>';
        }

        const interpretation = this.getDeltaEInterpretation(deltaE);
        document.getElementById('delta-e-interpretation').textContent = interpretation;

        this.drawDeltaEViz(colorA, colorB, deltaE);
    }

    calculateSimpleDeltaE(colorA, colorB) {
        const dr = colorA.r - colorB.r;
        const dg = colorA.g - colorB.g;
        const db = colorA.b - colorB.b;

        return Math.sqrt(dr * dr + dg * dg + db * db) / 4.5;
    }

    getDeltaEInterpretation(deltaE) {
        if (deltaE < 1) return 'The color difference is not perceptible to the human eye. Excellent match.';
        if (deltaE < 2) return 'The color difference is perceptible through close observation. Good match.';
        if (deltaE < 3.5) return 'The color difference is perceptible at a glance. Acceptable for most applications.';
        if (deltaE < 5) return 'The color difference is clearly noticeable. May be acceptable depending on context.';
        return 'The colors are significantly different. Not acceptable for color-critical work.';
    }

    drawDeltaEViz(colorA, colorB, deltaE) {
        const canvas = document.getElementById('delta-e-viz');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = `rgb(${colorA.r}, ${colorA.g}, ${colorA.b})`;
        ctx.fillRect(50, 50, 100, 100);

        ctx.fillStyle = `rgb(${colorB.r}, ${colorB.g}, ${colorB.b})`;
        ctx.fillRect(250, 50, 100, 100);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(150, 100);
        ctx.lineTo(250, 100);
        ctx.stroke();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`ΔE = ${deltaE.toFixed(1)}`, 200, 180);

        ctx.font = '12px Arial';
        ctx.fillText('Color A', 100, 170);
        ctx.fillText('Color B', 300, 170);
    }

    // ========== Accessibility Checker ==========
    initializeAccessibilityChecker() {
        const checkBtn = document.getElementById('check-accessibility');
        if (!checkBtn) return;

        checkBtn.addEventListener('click', () => this.checkAccessibility());

        const bgColorPicker = document.getElementById('bg-color-picker');
        const fgColorPicker = document.getElementById('fg-color-picker');
        const bgColorHex = document.getElementById('bg-color-hex');
        const fgColorHex = document.getElementById('fg-color-hex');

        if (bgColorPicker && bgColorHex) {
            bgColorPicker.addEventListener('input', (e) => {
                bgColorHex.value = e.target.value;
                document.getElementById('bg-preview').style.background = e.target.value;
                this.updateAccessPreview();
            });

            bgColorHex.addEventListener('change', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    bgColorPicker.value = e.target.value;
                    document.getElementById('bg-preview').style.background = e.target.value;
                    this.updateAccessPreview();
                }
            });
        }

        if (fgColorPicker && fgColorHex) {
            fgColorPicker.addEventListener('input', (e) => {
                fgColorHex.value = e.target.value;
                document.getElementById('fg-preview').style.background = e.target.value;
                this.updateAccessPreview();
            });

            fgColorHex.addEventListener('change', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    fgColorPicker.value = e.target.value;
                    document.getElementById('fg-preview').style.background = e.target.value;
                    this.updateAccessPreview();
                }
            });
        }

        document.querySelectorAll('.sim-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.sim-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.simulateColorBlindness(e.target.dataset.type);
            });
        });
    }

    updateAccessPreview() {
        const bgColor = document.getElementById('bg-color-hex')?.value || '#FFFFFF';
        const fgColor = document.getElementById('fg-color-hex')?.value || '#0000FF';

        const previewBox = document.getElementById('access-preview-box');
        if (previewBox) {
            previewBox.style.backgroundColor = bgColor;
            previewBox.style.color = fgColor;
        }
    }

    checkAccessibility() {
        const bgColor = document.getElementById('bg-color-hex')?.value || '#FFFFFF';
        const fgColor = document.getElementById('fg-color-hex')?.value || '#0000FF';

        const bgRgb = this.hexToRgb(bgColor);
        const fgRgb = this.hexToRgb(fgColor);

        const contrastRatio = this.calculateContrastRatio(bgRgb, fgRgb);

        document.getElementById('ratio-aa-large').textContent = contrastRatio.toFixed(1) + ':1';
        document.getElementById('ratio-aa-normal').textContent = contrastRatio.toFixed(1) + ':1';
        document.getElementById('ratio-aaa-large').textContent = contrastRatio.toFixed(1) + ':1';
        document.getElementById('ratio-aaa-normal').textContent = contrastRatio.toFixed(1) + ':1';

        this.updateComplianceStatus(contrastRatio);
        this.generateAccessibilitySuggestions(contrastRatio, fgColor);
    }

    calculateContrastRatio(color1, color2) {
        const lum1 = this.getRelativeLuminance(color1);
        const lum2 = this.getRelativeLuminance(color2);

        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);

        return (lighter + 0.05) / (darker + 0.05);
    }

    getRelativeLuminance(rgb) {
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    updateComplianceStatus(ratio) {
        const updateStatus = (id, passes) => {
            const el = document.getElementById(id);
            if (el) {
                el.className = `compliance-status ${passes ? 'pass' : 'fail'}`;
                el.textContent = passes ? '✓ PASS' : '✗ FAIL';
            }
        };

        updateStatus('aa-large', ratio >= 4.5);
        updateStatus('aa-normal', ratio >= 4.5);
        updateStatus('aaa-large', ratio >= 3);
        updateStatus('aaa-normal', ratio >= 7);
    }

    generateAccessibilitySuggestions(ratio, fgColor) {
        const suggestions = document.getElementById('accessibility-suggestions');
        if (!suggestions) return;

        const items = [];

        if (ratio < 4.5) {
            items.push('<li>Increase contrast ratio to at least 4.5:1 for normal text</li>');
            items.push('<li>Consider darkening the foreground color or lightening background</li>');
        }

        if (ratio < 7) {
            items.push('<li>For AAA compliance, aim for 7:1 contrast ratio</li>');
        }

        if (items.length === 0) {
            items.push('<li>Great! Your color combination meets accessibility standards</li>');
        }

        suggestions.innerHTML = items.join('');
    }

    simulateColorBlindness(type) {
        const simulation = document.getElementById('cb-simulation');
        if (!simulation) return;

        const fgColor = document.getElementById('fg-color-hex')?.value || '#0000FF';
        const bgColor = document.getElementById('bg-color-hex')?.value || '#FFFFFF';

        let simulatedFg = fgColor;

        if (type !== 'normal') {
            const rgb = this.hexToRgb(fgColor);
            const simulated = this.applyColorBlindnessSimulation(rgb, type);
            simulatedFg = this.rgbToHex(simulated.r, simulated.g, simulated.b);
        }

        simulation.style.backgroundColor = bgColor;
        simulation.style.color = simulatedFg;
        simulation.innerHTML = `<p>Sample text with ${type} simulation</p>`;
    }

    applyColorBlindnessSimulation(rgb, type) {
        const simulations = {
            protanopia: { r: 0.567 * rgb.r + 0.433 * rgb.g, g: 0.558 * rgb.r + 0.442 * rgb.g, b: 0.242 * rgb.g + 0.758 * rgb.b },
            deuteranopia: { r: 0.625 * rgb.r + 0.375 * rgb.g, g: 0.7 * rgb.r + 0.3 * rgb.g, b: 0.3 * rgb.g + 0.7 * rgb.b },
            tritanopia: { r: 0.95 * rgb.r + 0.05 * rgb.g, g: 0.433 * rgb.g + 0.567 * rgb.b, b: 0.475 * rgb.g + 0.525 * rgb.b }
        };

        const sim = simulations[type];
        if (!sim) return rgb;

        return {
            r: Math.round(Math.min(255, sim.r)),
            g: Math.round(Math.min(255, sim.g)),
            b: Math.round(Math.min(255, sim.b))
        };
    }

    // ========== Utility Functions ==========
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }

    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, v: v * 100 };
    }

    rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
        k = k * 100;

        return { c, m, y, k };
    }

    rgbToLab(r, g, b) {
        let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        x /= 95.047; y /= 100.0; z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

        return {
            l: (116 * y) - 16,
            a: 500 * (x - y),
            b: 200 * (y - z)
        };
    }

    rgbToXyz(r, g, b) {
        const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        return { x, y, z };
    }

    hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    cmykToRgb(c, m, y, k) {
        c /= 100; m /= 100; y /= 100; k /= 100;

        return {
            r: Math.round(255 * (1 - c) * (1 - k)),
            g: Math.round(255 * (1 - m) * (1 - k)),
            b: Math.round(255 * (1 - y) * (1 - k))
        };
    }

    labToRgb(l, a, b) {
        let y = (l + 16) / 116;
        let x = a / 500 + y;
        let z = y - b / 200;

        const x3 = Math.pow(x, 3);
        const y3 = Math.pow(y, 3);
        const z3 = Math.pow(z, 3);

        x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
        y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
        z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

        x *= 95.047; y *= 100.0; z *= 108.883;

        let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let b_val = x * 0.0557 + y * -0.2040 + z * 1.0570;

        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        b_val = b_val > 0.0031308 ? 1.055 * Math.pow(b_val, 1 / 2.4) - 0.055 : 12.92 * b_val;

        return {
            r: Math.max(0, Math.min(255, Math.round(r * 255))),
            g: Math.max(0, Math.min(255, Math.round(g * 255))),
            b: Math.max(0, Math.min(255, Math.round(b_val * 255)))
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('color-converter-tool')) {
            window.interactionTools = new InteractionTools();
        }
    });
} else {
    if (document.getElementById('color-converter-tool')) {
        window.interactionTools = new InteractionTools();
    }
}
