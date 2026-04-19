export class ColorPicker {
    constructor() {
        this.currentColor = {
            rgb: { r: 255, g: 255, b: 255 },
            hsl: { h: 0, s: 0, l: 100 },
            cmyk: { c: 0, m: 0, y: 0, k: 0 },
            lab: { l: 100, a: 0, b: 0 },
            hex: '#FFFFFF'
        };

        this.colorHistory = [];
        this.selectedGamutSpace = 'srgb';
        this.isUpdating = false;

        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        
        // Ensure canvas is ready before drawing
        setTimeout(() => {
            this.drawColorWheel();
            this.drawCIEDiagram();
            this.updateAllDisplays();
        }, 0);
    }

    cacheElements() {
        // Preview elements
        this.colorPreview = document.getElementById('color-preview');
        this.hexInput = document.getElementById('hex-input');
        this.rgbText = document.getElementById('rgb-text');

        // RGB sliders
        this.rSlider = document.getElementById('r-slider');
        this.gSlider = document.getElementById('g-slider');
        this.bSlider = document.getElementById('b-slider');
        this.rValue = document.getElementById('r-value');
        this.gValue = document.getElementById('g-value');
        this.bValue = document.getElementById('b-value');

        // HSL sliders
        this.hSlider = document.getElementById('h-slider');
        this.sSlider = document.getElementById('s-slider');
        this.lSlider = document.getElementById('l-slider');
        this.hValue = document.getElementById('h-value');
        this.sValue = document.getElementById('s-value');
        this.lValue = document.getElementById('l-value');

        // CMYK sliders
        this.cSlider = document.getElementById('c-slider');
        this.mSlider = document.getElementById('m-slider');
        this.ySlider = document.getElementById('y-slider');
        this.kSlider = document.getElementById('k-slider');
        this.cValue = document.getElementById('c-value');
        this.mValue = document.getElementById('m-value');
        this.yValue = document.getElementById('y-value');
        this.kValue = document.getElementById('k-value');

        // Lab sliders
        this.labLSlider = document.getElementById('lab-l-slider');
        this.labASlider = document.getElementById('lab-a-slider');
        this.labBSlider = document.getElementById('lab-b-slider');
        this.labLValue = document.getElementById('lab-l-value');
        this.labAValue = document.getElementById('lab-a-value');
        this.labBValue = document.getElementById('lab-b-value');

        // Action buttons
        this.eyedropperBtn = document.getElementById('eyedropper-btn');
        this.randomBtn = document.getElementById('random-color-btn');
        this.resetBtn = document.getElementById('reset-color-btn');

        // Gamut visualization
        this.gamutSelect = document.getElementById('gamut-space-select');
        this.showGamutBoundary = document.getElementById('show-gamut-boundary');
        this.gamutStatus = document.getElementById('gamut-status');
        this.boundaryDistance = document.getElementById('boundary-distance');

        // Canvas elements
        this.colorWheelCanvas = document.getElementById('color-wheel');
        this.cieDiagramCanvas = document.getElementById('cie-diagram');

        // History
        this.colorHistoryGrid = document.getElementById('color-history');
        this.clearHistoryBtn = document.getElementById('clear-history');
        this.exportColorsBtn = document.getElementById('export-colors');
    }

    bindEvents() {
        // RGB sliders
        this.rSlider.addEventListener('input', (e) => this.handleRGBChange('r', parseInt(e.target.value)));
        this.gSlider.addEventListener('input', (e) => this.handleRGBChange('g', parseInt(e.target.value)));
        this.bSlider.addEventListener('input', (e) => this.handleRGBChange('b', parseInt(e.target.value)));

        // HSL sliders
        this.hSlider.addEventListener('input', (e) => this.handleHSLChange('h', parseInt(e.target.value)));
        this.sSlider.addEventListener('input', (e) => this.handleHSLChange('s', parseInt(e.target.value)));
        this.lSlider.addEventListener('input', (e) => this.handleHSLChange('l', parseInt(e.target.value)));

        // CMYK sliders
        this.cSlider.addEventListener('input', (e) => this.handleCMYKChange('c', parseInt(e.target.value)));
        this.mSlider.addEventListener('input', (e) => this.handleCMYKChange('m', parseInt(e.target.value)));
        this.ySlider.addEventListener('input', (e) => this.handleCMYKChange('y', parseInt(e.target.value)));
        this.kSlider.addEventListener('input', (e) => this.handleCMYKChange('k', parseInt(e.target.value)));

        // Lab sliders
        this.labLSlider.addEventListener('input', (e) => this.handleLabChange('l', parseInt(e.target.value)));
        this.labASlider.addEventListener('input', (e) => this.handleLabChange('a', parseInt(e.target.value)));
        this.labBSlider.addEventListener('input', (e) => this.handleLabChange('b', parseInt(e.target.value)));

        // Hex input
        this.hexInput.addEventListener('change', (e) => this.handleHexChange(e.target.value));

        // Action buttons
        this.eyedropperBtn?.addEventListener('click', () => this.useEyedropper());
        this.randomBtn.addEventListener('click', () => this.generateRandomColor());
        this.resetBtn.addEventListener('click', () => this.resetToWhite());

        // Gamut controls
        this.gamutSelect.addEventListener('change', (e) => {
            this.selectedGamutSpace = e.target.value;
            this.drawCIEDiagram();
            this.checkGamutStatus();
        });

        this.showGamutBoundary.addEventListener('change', () => {
            this.drawCIEDiagram();
        });

        // Color preview click to save
        this.colorPreview.addEventListener('click', () => this.addToHistory());

        // History actions
        this.clearHistoryBtn?.addEventListener('click', () => this.clearHistory());
        this.exportColorsBtn?.addEventListener('click', () => this.exportColors());

        // Color wheel interaction
        this.setupColorWheelInteraction();
    }

    handleRGBChange(channel, value) {
        if (this.isUpdating) return;
        this.isUpdating = true;

        this.currentColor.rgb[channel] = value;
        this.convertFromRGB();
        this.updateAllDisplays();

        this.isUpdating = false;
    }

    handleHSLChange(channel, value) {
        if (this.isUpdating) return;
        this.isUpdating = true;

        this.currentColor.hsl[channel] = value;
        this.convertFromHSL();
        this.updateAllDisplays();

        this.isUpdating = false;
    }

    handleCMYKChange(channel, value) {
        if (this.isUpdating) return;
        this.isUpdating = true;

        this.currentColor.cmyk[channel] = value;
        this.convertFromCMYK();
        this.updateAllDisplays();

        this.isUpdating = false;
    }

    handleLabChange(channel, value) {
        if (this.isUpdating) return;
        this.isUpdating = true;

        this.currentColor.lab[channel] = value;
        this.convertFromLab();
        this.updateAllDisplays();

        this.isUpdating = false;
    }

    handleHexChange(hex) {
        if (this.isUpdating) return;
        if (!/^#[0-9A-F]{6}$/i.test(hex)) return;

        this.isUpdating = true;

        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);

        this.currentColor.rgb = { r, g, b };
        this.convertFromRGB();
        this.updateAllDisplays();

        this.isUpdating = false;
    }

    convertFromRGB() {
        const { r, g, b } = this.currentColor.rgb;

        // RGB to Hex
        this.currentColor.hex = this.rgbToHex(r, g, b);

        // RGB to HSL
        this.currentColor.hsl = this.rgbToHsl(r, g, b);

        // RGB to CMYK
        this.currentColor.cmyk = this.rgbToCmyk(r, g, b);

        // RGB to Lab (via XYZ)
        this.currentColor.lab = this.rgbToLab(r, g, b);
    }

    convertFromHSL() {
        const { h, s, l } = this.currentColor.hsl;

        // HSL to RGB
        const rgb = this.hslToRgb(h, s, l);
        this.currentColor.rgb = rgb;

        // Update other formats
        this.currentColor.hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        this.currentColor.cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        this.currentColor.lab = this.rgbToLab(rgb.r, rgb.g, rgb.b);
    }

    convertFromCMYK() {
        const { c, m, y, k } = this.currentColor.cmyk;

        // CMYK to RGB
        const rgb = this.cmykToRgb(c, m, y, k);
        this.currentColor.rgb = rgb;

        // Update other formats
        this.currentColor.hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        this.currentColor.hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.currentColor.lab = this.rgbToLab(rgb.r, rgb.g, rgb.b);
    }

    convertFromLab() {
        const { l, a, b } = this.currentColor.lab;

        // Lab to RGB (via XYZ)
        const rgb = this.labToRgb(l, a, b);
        this.currentColor.rgb = rgb;

        // Update other formats
        this.currentColor.hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        this.currentColor.hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.currentColor.cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
    }

    updateAllDisplays() {
        const { rgb, hsl, cmyk, lab, hex } = this.currentColor;

        // Update preview
        this.colorPreview.style.backgroundColor = hex;

        // Update hex input
        this.hexInput.value = hex;

        // Update RGB display
        this.rgbText.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        // Update RGB sliders
        this.rSlider.value = rgb.r;
        this.gSlider.value = rgb.g;
        this.bSlider.value = rgb.b;
        this.rValue.textContent = rgb.r;
        this.gValue.textContent = rgb.g;
        this.bValue.textContent = rgb.b;

        // Update HSL sliders
        this.hSlider.value = Math.round(hsl.h);
        this.sSlider.value = Math.round(hsl.s);
        this.lSlider.value = Math.round(hsl.l);
        this.hValue.textContent = Math.round(hsl.h);
        this.sValue.textContent = Math.round(hsl.s);
        this.lValue.textContent = Math.round(hsl.l);

        // Update CMYK sliders
        this.cSlider.value = Math.round(cmyk.c);
        this.mSlider.value = Math.round(cmyk.m);
        this.ySlider.value = Math.round(cmyk.y);
        this.kSlider.value = Math.round(cmyk.k);
        this.cValue.textContent = Math.round(cmyk.c);
        this.mValue.textContent = Math.round(cmyk.m);
        this.yValue.textContent = Math.round(cmyk.y);
        this.kValue.textContent = Math.round(cmyk.k);

        // Update Lab sliders
        this.labLSlider.value = Math.round(lab.l);
        this.labASlider.value = Math.round(lab.a);
        this.labBSlider.value = Math.round(lab.b);
        this.labLValue.textContent = Math.round(lab.l);
        this.labAValue.textContent = Math.round(lab.a);
        this.labBValue.textContent = Math.round(lab.b);

        // Update gamut visualization
        this.drawCIEDiagram();
        this.checkGamutStatus();
    }

    // Color conversion utilities
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, m, y);

        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }

        c = ((c - k) / (1 - k)) * 100;
        m = ((m - k) / (1 - k)) * 100;
        y = ((y - k) / (1 - k)) * 100;
        k = k * 100;

        return {
            c: Math.round(c),
            m: Math.round(m),
            y: Math.round(y),
            k: Math.round(k)
        };
    }

    rgbToLab(r, g, b) {
        // RGB to XYZ
        let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

        // Normalize for D65 white point
        x /= 95.047;
        y /= 100.0;
        z /= 108.883;

        // XYZ to Lab
        x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

        return {
            l: Math.round((116 * y) - 16),
            a: Math.round(500 * (x - y)),
            b: Math.round(200 * (y - z))
        };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

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
        c /= 100;
        m /= 100;
        y /= 100;
        k /= 100;

        const r = 255 * (1 - c) * (1 - k);
        const g = 255 * (1 - m) * (1 - k);
        const b = 255 * (1 - y) * (1 - k);

        return {
            r: Math.round(r),
            g: Math.round(g),
            b: Math.round(b)
        };
    }

    labToRgb(l, a, b) {
        // Lab to XYZ
        let y = (l + 16) / 116;
        let x = a / 500 + y;
        let z = y - b / 200;

        const x3 = Math.pow(x, 3);
        const y3 = Math.pow(y, 3);
        const z3 = Math.pow(z, 3);

        x = x3 > 0.008856 ? x3 : (x - 16 / 116) / 7.787;
        y = y3 > 0.008856 ? y3 : (y - 16 / 116) / 7.787;
        z = z3 > 0.008856 ? z3 : (z - 16 / 116) / 7.787;

        x *= 95.047;
        y *= 100.0;
        z *= 108.883;

        // XYZ to RGB
        let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let b_val = x * 0.0557 + y * -0.2040 + z * 1.0570;

        // Apply gamma correction
        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        b_val = b_val > 0.0031308 ? 1.055 * Math.pow(b_val, 1 / 2.4) - 0.055 : 12.92 * b_val;

        return {
            r: Math.max(0, Math.min(255, Math.round(r * 255))),
            g: Math.max(0, Math.min(255, Math.round(g * 255))),
            b: Math.max(0, Math.min(255, Math.round(b_val * 255)))
        };
    }

    // Canvas drawing functions
    drawColorWheel() {
        const canvas = this.colorWheelCanvas;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Draw hue wheel
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 1) * Math.PI / 180;
            const endAngle = angle * Math.PI / 180;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    drawCIEDiagram() {
        const canvas = this.cieDiagramCanvas;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw simplified CIE chromaticity diagram background
        this.drawCIEBackground(ctx, width, height);

        // Draw gamut triangle for selected space
        if (this.showGamutBoundary.checked) {
            this.drawGamutTriangle(ctx, width, height, this.selectedGamutSpace);
        }

        // Draw current color position
        this.drawCurrentColorPosition(ctx, width, height);
    }

    drawCIEBackground(ctx, width, height) {
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Define CIE diagram bounds (x: 0-0.8, y: 0-0.9)
        const cieXMin = 0.0;
        const cieXMax = 0.8;
        const cieYMin = 0.0;
        const cieYMax = 0.9;
        
        const padding = 40;
        const drawWidth = width - padding * 2;
        const drawHeight = height - padding * 2;
        
        // Store mapping for later use
        this.cieMapping = {
            offsetX: padding,
            offsetY: height - padding,
            scaleX: drawWidth / (cieXMax - cieXMin),
            scaleY: drawHeight / (cieYMax - cieYMin)
        };

        // Draw horseshoe shape (spectral locus)
        ctx.fillStyle = '#e8e8e8';
        ctx.beginPath();
        
        const spectralPoints = this.getSpectralLocusPoints();
        if (spectralPoints.length > 0) {
            const startPixel = this.cieToPixel(spectralPoints[0].x, spectralPoints[0].y);
            ctx.moveTo(startPixel.x, startPixel.y);
            
            for (let i = 1; i < spectralPoints.length; i++) {
                const pixel = this.cieToPixel(spectralPoints[i].x, spectralPoints[i].y);
                ctx.lineTo(pixel.x, pixel.y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw grid lines
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        
        for (let x = 0.1; x <= 0.7; x += 0.1) {
            const px1 = this.cieToPixel(x, 0);
            const px2 = this.cieToPixel(x, 0.9);
            ctx.beginPath();
            ctx.moveTo(px1.x, px1.y);
            ctx.lineTo(px2.x, px2.y);
            ctx.stroke();
        }
        
        for (let y = 0.1; y <= 0.8; y += 0.1) {
            const px1 = this.cieToPixel(0, y);
            const px2 = this.cieToPixel(0.8, y);
            ctx.beginPath();
            ctx.moveTo(px1.x, px1.y);
            ctx.lineTo(px2.x, px2.y);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);

        // Add axis labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        for (let x = 0.1; x <= 0.7; x += 0.1) {
            const px = this.cieToPixel(x, -0.02);
            ctx.fillText(x.toFixed(1), px.x, px.y);
        }
        
        ctx.textAlign = 'right';
        for (let y = 0.1; y <= 0.8; y += 0.1) {
            const px = this.cieToPixel(-0.02, y);
            ctx.fillText(y.toFixed(1), px.x, px.y);
        }
    }
    
    cieToPixel(cieX, cieY) {
        if (!this.cieMapping) return { x: 0, y: 0 };
        
        return {
            x: this.cieMapping.offsetX + cieX * this.cieMapping.scaleX,
            y: this.cieMapping.offsetY - cieY * this.cieMapping.scaleY
        };
    }

    getSpectralLocusPoints() {
        // Accurate CIE 1931 spectral locus points
        return [
            { x: 0.1741, y: 0.0050 }, // 380nm
            { x: 0.1740, y: 0.0050 },
            { x: 0.1738, y: 0.0049 },
            { x: 0.1736, y: 0.0049 },
            { x: 0.1733, y: 0.0048 },
            { x: 0.1730, y: 0.0048 },
            { x: 0.1726, y: 0.0048 },
            { x: 0.1721, y: 0.0048 },
            { x: 0.1714, y: 0.0051 },
            { x: 0.1703, y: 0.0057 },
            { x: 0.1689, y: 0.0069 },
            { x: 0.1669, y: 0.0086 },
            { x: 0.1644, y: 0.0109 },
            { x: 0.1611, y: 0.0138 },
            { x: 0.1566, y: 0.0177 },
            { x: 0.1510, y: 0.0227 },
            { x: 0.1440, y: 0.0297 },
            { x: 0.1355, y: 0.0399 },
            { x: 0.1241, y: 0.0578 },
            { x: 0.1096, y: 0.0868 },
            { x: 0.0913, y: 0.1327 },
            { x: 0.0687, y: 0.2007 },
            { x: 0.0454, y: 0.2950 },
            { x: 0.0235, y: 0.4127 },
            { x: 0.0082, y: 0.5384 },
            { x: 0.0039, y: 0.6548 },
            { x: 0.0139, y: 0.7502 },
            { x: 0.0389, y: 0.8120 },
            { x: 0.0743, y: 0.8338 },
            { x: 0.1141, y: 0.8262 },
            { x: 0.1547, y: 0.8059 },
            { x: 0.1929, y: 0.7816 },
            { x: 0.2296, y: 0.7543 },
            { x: 0.2658, y: 0.7243 },
            { x: 0.3016, y: 0.6923 },
            { x: 0.3373, y: 0.6589 },
            { x: 0.3731, y: 0.6245 },
            { x: 0.4082, y: 0.5896 },
            { x: 0.4441, y: 0.5547 },
            { x: 0.4806, y: 0.5202 },
            { x: 0.5168, y: 0.4866 },
            { x: 0.5521, y: 0.4544 },
            { x: 0.5864, y: 0.4242 },
            { x: 0.6194, y: 0.3965 },
            { x: 0.6510, y: 0.3717 },
            { x: 0.6810, y: 0.3498 },
            { x: 0.7090, y: 0.3306 },
            { x: 0.7347, y: 0.2653 }, // 700nm
            { x: 0.7180, y: 0.2820 },
            { x: 0.6790, y: 0.3210 },
            { x: 0.6300, y: 0.3700 },
            { x: 0.5750, y: 0.4250 },
            { x: 0.5200, y: 0.4800 },
            { x: 0.4600, y: 0.5400 },
            { x: 0.4000, y: 0.6000 },
            { x: 0.3300, y: 0.6700 },
            { x: 0.2500, y: 0.7500 },
            { x: 0.1741, y: 0.0050 } // Close the loop
        ];
    }

    drawGamutTriangle(ctx, width, height, space) {
        const primaries = this.getGamutPrimaries(space);
        
        // Convert CIE coordinates to pixel coordinates
        const redPixel = this.cieToPixel(primaries.red.x, primaries.red.y);
        const greenPixel = this.cieToPixel(primaries.green.x, primaries.green.y);
        const bluePixel = this.cieToPixel(primaries.blue.x, primaries.blue.y);

        ctx.strokeStyle = this.getGamutColor(space);
        ctx.lineWidth = 3;
        ctx.fillStyle = this.getGamutColor(space) + '22';

        ctx.beginPath();
        ctx.moveTo(redPixel.x, redPixel.y);
        ctx.lineTo(greenPixel.x, greenPixel.y);
        ctx.lineTo(bluePixel.x, bluePixel.y);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // Draw primary points
        const points = [
            { pixel: redPixel, label: 'R' },
            { pixel: greenPixel, label: 'G' },
            { pixel: bluePixel, label: 'B' }
        ];
        
        points.forEach(point => {
            ctx.fillStyle = this.getGamutColor(space);
            ctx.beginPath();
            ctx.arc(point.pixel.x, point.pixel.y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(point.label, point.pixel.x + 8, point.pixel.y - 8);
        });

        // Label
        ctx.fillStyle = this.getGamutColor(space);
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(space.toUpperCase(), 50, 30);
    }

    getGamutPrimaries(space) {
        const gamuts = {
            'srgb': {
                red: { x: 0.6400, y: 0.3300 },
                green: { x: 0.3000, y: 0.6000 },
                blue: { x: 0.1500, y: 0.0600 }
            },
            'adobe-rgb': {
                red: { x: 0.6400, y: 0.3300 },
                green: { x: 0.2100, y: 0.7100 },
                blue: { x: 0.1500, y: 0.0600 }
            },
            'dci-p3': {
                red: { x: 0.6800, y: 0.3200 },
                green: { x: 0.2650, y: 0.6900 },
                blue: { x: 0.1500, y: 0.0600 }
            },
            'display-p3': {
                red: { x: 0.6800, y: 0.3200 },
                green: { x: 0.2650, y: 0.6900 },
                blue: { x: 0.1500, y: 0.0600 }
            },
            'rec2020': {
                red: { x: 0.7080, y: 0.2920 },
                green: { x: 0.1700, y: 0.7970 },
                blue: { x: 0.1310, y: 0.0460 }
            },
            'prophoto': {
                red: { x: 0.7347, y: 0.2653 },
                green: { x: 0.1596, y: 0.8404 },
                blue: { x: 0.0366, y: 0.0001 }
            }
        };

        return gamuts[space] || gamuts['srgb'];
    }

    getGamutColor(space) {
        const colors = {
            'srgb': '#FF0000',
            'adobe-rgb': '#00FF00',
            'dci-p3': '#0000FF',
            'display-p3': '#FF00FF',
            'rec2020': '#FFFF00',
            'prophoto': '#00FFFF'
        };

        return colors[space] || '#000000';
    }

    drawCurrentColorPosition(ctx, width, height) {
        const { r, g, b } = this.currentColor.rgb;
        const xy = this.rgbToXY(r, g, b);

        // Convert to pixel coordinates using mapping
        const pixel = this.cieToPixel(xy.x, xy.y);

        // Draw cursor
        ctx.fillStyle = this.currentColor.hex;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Outer ring
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
    }

    rgbToXY(r, g, b) {
        // Convert RGB to CIE xy
        // Normalize RGB values first
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        
        // Convert to linear RGB
        const rLinear = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
        const gLinear = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
        const bLinear = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;
        
        // Convert to XYZ (D65 illuminant)
        const X = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375;
        const Y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750;
        const Z = rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041;

        const sum = X + Y + Z;
        if (sum === 0) return { x: 0.3127, y: 0.3290 }; // D65 white point

        return {
            x: X / sum,
            y: Y / sum
        };
    }

    checkGamutStatus() {
        const { r, g, b } = this.currentColor.rgb;
        const isInGamut = this.isColorInGamut(r, g, b, this.selectedGamutSpace);
        const distance = this.calculateDistanceToBoundary(r, g, b, this.selectedGamutSpace);

        const statusDot = this.gamutStatus.querySelector('.status-dot');
        const statusText = this.gamutStatus.querySelector('.status-text');

        if (isInGamut) {
            this.gamutStatus.className = 'status-indicator in-gamut';
            statusText.textContent = 'In Gamut';
        } else {
            this.gamutStatus.className = 'status-indicator out-of-gamut';
            statusText.textContent = 'Out of Gamut';
        }

        this.boundaryDistance.textContent = `${Math.round(distance)}%`;
    }

    isColorInGamut(r, g, b, space) {
        const xy = this.rgbToXY(r, g, b);
        const primaries = this.getGamutPrimaries(space);

        // Use proper point-in-triangle test
        return this.isPointInTriangle(xy, primaries.red, primaries.green, primaries.blue);
    }

    isPointInTriangle(point, v1, v2, v3) {
        // Barycentric coordinate method
        const denom = (v2.y - v3.y) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.y - v3.y);
        
        if (Math.abs(denom) < 0.0001) return false;
        
        const a = ((v2.y - v3.y) * (point.x - v3.x) + (v3.x - v2.x) * (point.y - v3.y)) / denom;
        const b = ((v3.y - v1.y) * (point.x - v3.x) + (v1.x - v3.x) * (point.y - v3.y)) / denom;
        const c = 1 - a - b;

        // Add small tolerance for floating point errors
        const tolerance = 0.001;
        return a >= -tolerance && a <= (1 + tolerance) && 
               b >= -tolerance && b <= (1 + tolerance) && 
               c >= -tolerance && c <= (1 + tolerance);
    }

    calculateDistanceToBoundary(r, g, b, space) {
        const xy = this.rgbToXY(r, g, b);
        const primaries = this.getGamutPrimaries(space);
        
        // Calculate distance to each edge of the triangle
        const edges = [
            [primaries.red, primaries.green],
            [primaries.green, primaries.blue],
            [primaries.blue, primaries.red]
        ];
        
        let minDistance = Infinity;
        
        edges.forEach(([p1, p2]) => {
            const dist = this.pointToLineDistance(xy, p1, p2);
            minDistance = Math.min(minDistance, dist);
        });
        
        // Convert to percentage (approximate)
        return Math.max(0, Math.min(100, minDistance * 100));
    }
    
    pointToLineDistance(point, lineStart, lineEnd) {
        const dx = lineEnd.x - lineStart.x;
        const dy = lineEnd.y - lineStart.y;
        
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
        
        const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (length * length)));
        
        const projectionX = lineStart.x + t * dx;
        const projectionY = lineStart.y + t * dy;
        
        return Math.sqrt((point.x - projectionX) ** 2 + (point.y - projectionY) ** 2);
    }

    setupColorWheelInteraction() {
        const canvas = this.colorWheelCanvas;
        if (!canvas) return;
        
        let isDragging = false;

        const handleInteraction = (e) => {
            e.preventDefault();
            
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
            
            if (!clientX || !clientY) return;

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const dx = x - centerX;
            const dy = y - centerY;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxRadius = Math.min(centerX, centerY) - 10;

            if (distance <= maxRadius) {
                // Calculate hue (0-360 degrees)
                let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                if (angle < 0) angle += 360;

                // Calculate saturation (0-100%)
                const saturation = Math.min(100, Math.round((distance / maxRadius) * 100));

                // Keep current lightness, only update hue and saturation
                const currentLightness = this.currentColor.hsl.l;
                
                // Update HSL values
                this.currentColor.hsl.h = Math.round(angle);
                this.currentColor.hsl.s = saturation;
                
                // Convert to RGB and update all displays
                const rgb = this.hslToRgb(this.currentColor.hsl.h, this.currentColor.hsl.s, currentLightness);
                this.currentColor.rgb = rgb;
                this.convertFromRGB();
                this.updateAllDisplays();
            }
        };

        // Mouse events
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            handleInteraction(e);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) handleInteraction(e);
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            handleInteraction(e);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            if (isDragging) handleInteraction(e);
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        // Also allow click without dragging
        canvas.addEventListener('click', (e) => {
            if (!isDragging) {
                handleInteraction(e);
            }
        });
    }

    async useEyedropper() {
        if (!window.EyeDropper) {
            alert('Eyedropper tool is not supported in your browser. Try Chrome or Edge.');
            return;
        }

        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            this.handleHexChange(result.sRGBHex);
        } catch (error) {
            console.log('Eyedropper cancelled');
        }
    }

    generateRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        this.currentColor.rgb = { r, g, b };
        this.convertFromRGB();
        this.updateAllDisplays();
    }

    resetToWhite() {
        this.currentColor.rgb = { r: 255, g: 255, b: 255 };
        this.convertFromRGB();
        this.updateAllDisplays();
    }

    addToHistory() {
        const colorEntry = {
            ...this.currentColor,
            timestamp: new Date().toISOString()
        };

        this.colorHistory.unshift(colorEntry);
        if (this.colorHistory.length > 20) {
            this.colorHistory.pop();
        }

        this.renderColorHistory();
        
        // Show feedback
        this.showSaveFeedback();
    }
    
    showSaveFeedback() {
        // Add visual feedback when color is saved
        const preview = this.colorPreview;
        if (!preview) return;
        
        // Flash animation
        preview.style.transform = 'scale(1.1)';
        preview.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.6)';
        
        setTimeout(() => {
            preview.style.transform = 'scale(1)';
            preview.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }, 300);
        
        // Show tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = '✓ Color Saved!';
        tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: #4caf50;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            z-index: 1000;
            animation: fadeInOut 2s ease;
        `;
        
        preview.style.position = 'relative';
        preview.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }

    renderColorHistory() {
        if (this.colorHistory.length === 0) {
            this.colorHistoryGrid.innerHTML = '<p class="history-placeholder">Selected colors will appear here</p>';
            return;
        }

        this.colorHistoryGrid.innerHTML = this.colorHistory.map((color, index) => `
            <div class="color-history-item" data-index="${index}" style="background-color: ${color.hex}">
                <div class="color-history-tooltip">
                    <div>${color.hex}</div>
                    <div>RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})</div>
                </div>
            </div>
        `).join('');

        // Add click handlers to history items
        this.colorHistoryGrid.querySelectorAll('.color-history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                const color = this.colorHistory[index];
                this.currentColor.rgb = { ...color.rgb };
                this.convertFromRGB();
                this.updateAllDisplays();
            });
        });
    }

    clearHistory() {
        this.colorHistory = [];
        this.renderColorHistory();
    }

    exportColors() {
        if (this.colorHistory.length === 0) {
            alert('No colors to export!');
            return;
        }

        const data = JSON.stringify(this.colorHistory, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.json';
        a.click();

        URL.revokeObjectURL(url);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('color-picker-container')) {
            window.colorPicker = new ColorPicker();
        }
    });
} else {
    if (document.getElementById('color-picker-container')) {
        window.colorPicker = new ColorPicker();
    }
}
