// ============================================
// NEXT-LEVEL PREMIUM BACKGROUND
// Advanced Visual Effects - Optimized & Stunning
// ============================================

class PremiumBackground {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.orbs = [];
        this.waves = [];
        this.stars = [];
        this.nebula = [];
        this.energyFields = [];
        this.time = 0;
        this.mouse = { x: 0, y: 0, active: false };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createStars();
        this.createNebula();
        this.createParticles();
        this.createOrbs();
        this.createWaves();
        this.createEnergyFields();
        this.setupMouseTracking();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createStars();
            this.createNebula();
            this.createParticles();
            this.createOrbs();
            this.createWaves();
            this.createEnergyFields();
        });
    }
    
    setupMouseTracking() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Nebula clouds dengan dynamic color shifting
    createNebula() {
        this.nebula = [];
        const count = 8;
        
        for (let i = 0; i < count; i++) {
            this.nebula.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 200 + Math.random() * 300,
                speedX: (Math.random() - 0.5) * 0.1,
                speedY: (Math.random() - 0.5) * 0.1,
                hue: 260 + i * 10,
                opacity: 0.08 + Math.random() * 0.05,
                phase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.005 + Math.random() * 0.003
            });
        }
    }
    
    // Energy fields - aurora-like flowing effects
    createEnergyFields() {
        this.energyFields = [];
        
        for (let i = 0; i < 4; i++) {
            this.energyFields.push({
                points: [],
                segments: 30,
                amplitude: 50 + i * 20,
                frequency: 0.003 + i * 0.0005,
                speed: 0.001 + i * 0.0003,
                offset: Math.random() * Math.PI * 2,
                yBase: (i + 1) * (this.canvas.height / 5),
                hue: 270 + i * 15,
                opacity: 0.15 - i * 0.02
            });
        }
    }
    
    // Enhanced stars dengan shooting stars
    createStars() {
        this.stars = [];
        const count = 200;
        
        for (let i = 0; i < count; i++) {
            const isShooting = Math.random() < 0.03;
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: isShooting ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.6 + 0.4,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
                isShooting,
                shootingSpeed: isShooting ? 3 + Math.random() * 2 : 0,
                shootingAngle: Math.random() * Math.PI / 4 + Math.PI / 6,
                trailLength: isShooting ? 50 + Math.random() * 50 : 0
            });
        }
    }
    
    // Advanced particles dengan magnetic field effect
    createParticles() {
        this.particles = [];
        const count = 100;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                baseOpacity: Math.random() * 0.7 + 0.3,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01,
                drift: {
                    x: (Math.random() - 0.5) * 0.4,
                    y: (Math.random() - 0.5) * 0.4
                },
                glowIntensity: Math.random() * 0.4 + 0.6,
                connectRadius: 120,
                magneticPull: 0.02
            });
        }
    }
    
    // Orbs yang besar dan eye-catching dengan enhanced effects
    createOrbs() {
        this.orbs = [];
        const positions = [
            { x: 0.2, y: 0.3 },
            { x: 0.8, y: 0.25 },
            { x: 0.15, y: 0.7 },
            { x: 0.85, y: 0.65 }
        ];
        
        positions.forEach((pos, i) => {
            this.orbs.push({
                x: this.canvas.width * pos.x,
                y: this.canvas.height * pos.y,
                targetX: this.canvas.width * pos.x,
                targetY: this.canvas.height * pos.y,
                size: 250 + i * 30,
                speed: {
                    x: (Math.random() - 0.5) * 0.15,
                    y: (Math.random() - 0.5) * 0.15
                },
                hue: 260 + i * 15,
                phase: Math.random() * Math.PI * 2,
                intensity: 0.15 + i * 0.03
            });
        });
    }
    
    // Flowing waves dengan enhanced gradients
    createWaves() {
        this.waves = [];
        for (let i = 0; i < 3; i++) {
            this.waves.push({
                amplitude: 40 + i * 15,
                frequency: 0.002 - i * 0.0003,
                speed: 0.0008 + i * 0.0002,
                offset: Math.random() * Math.PI * 2,
                yPos: 0.3 + i * 0.15,
                opacity: 0.12 - i * 0.03,
                hue: 270 + i * 10
            });
        }
    }
    
    // Draw nebula clouds
    drawNebula() {
        this.nebula.forEach(cloud => {
            cloud.x += cloud.speedX;
            cloud.y += cloud.speedY;
            cloud.phase += cloud.pulseSpeed;
            
            // Wrap around
            if (cloud.x < -cloud.size) cloud.x = this.canvas.width + cloud.size;
            if (cloud.x > this.canvas.width + cloud.size) cloud.x = -cloud.size;
            if (cloud.y < -cloud.size) cloud.y = this.canvas.height + cloud.size;
            if (cloud.y > this.canvas.height + cloud.size) cloud.y = -cloud.size;
            
            const pulse = Math.sin(cloud.phase) * 0.3 + 1;
            const size = cloud.size * pulse;
            
            const gradient = this.ctx.createRadialGradient(
                cloud.x, cloud.y, 0,
                cloud.x, cloud.y, size
            );
            
            const hueShift = Math.sin(this.time * 0.001) * 20;
            
            gradient.addColorStop(0, `hsla(${cloud.hue + hueShift}, 70%, 50%, ${cloud.opacity * pulse})`);
            gradient.addColorStop(0.4, `hsla(${cloud.hue + hueShift + 10}, 65%, 45%, ${cloud.opacity * 0.6})`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    // Draw energy fields (aurora effect)
    drawEnergyFields() {
        this.energyFields.forEach(field => {
            field.offset += field.speed;
            
            this.ctx.beginPath();
            
            for (let i = 0; i <= field.segments; i++) {
                const x = (this.canvas.width / field.segments) * i;
                const wave1 = Math.sin(x * field.frequency + field.offset) * field.amplitude;
                const wave2 = Math.sin(x * field.frequency * 2 + field.offset * 1.5) * (field.amplitude * 0.5);
                const y = field.yBase + wave1 + wave2;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            const gradient = this.ctx.createLinearGradient(
                0, field.yBase - field.amplitude * 2,
                0, field.yBase + field.amplitude * 2
            );
            
            const hueShift = Math.sin(this.time * 0.002) * 15;
            
            gradient.addColorStop(0, `hsla(${field.hue + hueShift}, 80%, 60%, 0)`);
            gradient.addColorStop(0.5, `hsla(${field.hue + hueShift}, 80%, 60%, ${field.opacity})`);
            gradient.addColorStop(1, `hsla(${field.hue + hueShift}, 80%, 60%, 0)`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 40;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            
            // Add shimmer effect
            this.ctx.globalCompositeOperation = 'lighter';
            this.ctx.lineWidth = 2;
            const shimmer = Math.sin(this.time * 0.005 + field.offset) * 0.5 + 0.5;
            this.ctx.strokeStyle = `hsla(${field.hue + hueShift + 30}, 90%, 70%, ${shimmer * 0.4})`;
            this.ctx.stroke();
            this.ctx.globalCompositeOperation = 'source-over';
        });
    }
    
    // Enhanced stars dengan shooting stars
    drawStars() {
        this.stars.forEach((star, index) => {
            if (star.isShooting) {
                star.x += Math.cos(star.shootingAngle) * star.shootingSpeed;
                star.y += Math.sin(star.shootingAngle) * star.shootingSpeed;
                
                if (star.x < -100 || star.x > this.canvas.width + 100 || 
                    star.y < -100 || star.y > this.canvas.height + 100) {
                    star.x = Math.random() * this.canvas.width;
                    star.y = -50;
                    star.shootingAngle = Math.random() * Math.PI / 4 + Math.PI / 6;
                }
                
                // Draw trail
                const gradient = this.ctx.createLinearGradient(
                    star.x, star.y,
                    star.x - Math.cos(star.shootingAngle) * star.trailLength,
                    star.y - Math.sin(star.shootingAngle) * star.trailLength
                );
                
                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(0.5, `rgba(200, 180, 255, ${star.opacity * 0.5})`);
                gradient.addColorStop(1, 'rgba(200, 180, 255, 0)');
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = star.size;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(star.x, star.y);
                this.ctx.lineTo(
                    star.x - Math.cos(star.shootingAngle) * star.trailLength,
                    star.y - Math.sin(star.shootingAngle) * star.trailLength
                );
                this.ctx.stroke();
            } else {
                star.phase += star.twinkleSpeed;
                const twinkle = (Math.sin(star.phase) + 1) * 0.5;
                const currentOpacity = star.opacity * twinkle;
                
                this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                if (twinkle > 0.8) {
                    const glow = this.ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, star.size * 4
                    );
                    glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.6})`);
                    glow.addColorStop(1, 'rgba(200, 180, 255, 0)');
                    
                    this.ctx.fillStyle = glow;
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        });
    }
    
    // Draw flowing waves
    drawWaves() {
        this.waves.forEach(wave => {
            wave.offset += wave.speed;
            
            this.ctx.beginPath();
            
            for (let x = 0; x <= this.canvas.width; x += 5) {
                const y1 = this.canvas.height * wave.yPos + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
                const y2 = y1 + Math.sin(x * wave.frequency * 2 + wave.offset * 1.3) * (wave.amplitude * 0.5);
                
                if (x === 0) {
                    this.ctx.moveTo(x, y2);
                } else {
                    this.ctx.lineTo(x, y2);
                }
            }
            
            const gradient = this.ctx.createLinearGradient(
                0, this.canvas.height * wave.yPos - wave.amplitude * 2,
                0, this.canvas.height * wave.yPos + wave.amplitude * 2
            );
            
            gradient.addColorStop(0, `hsla(${wave.hue}, 70%, 60%, 0)`);
            gradient.addColorStop(0.5, `hsla(${wave.hue}, 70%, 60%, ${wave.opacity})`);
            gradient.addColorStop(1, `hsla(${wave.hue}, 70%, 60%, 0)`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 50;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        });
    }
    
    // Draw massive orbs dengan intense glow
    drawOrbs() {
        this.orbs.forEach((orb, index) => {
            // Smooth floating movement
            orb.x += orb.speed.x;
            orb.y += orb.speed.y;
            
            // Gentle bounce
            const margin = 150;
            if (orb.x < margin || orb.x > this.canvas.width - margin) orb.speed.x *= -1;
            if (orb.y < margin || orb.y > this.canvas.height - margin) orb.speed.y *= -1;
            
            // Breathing effect
            orb.phase += 0.01;
            const breathe = Math.sin(orb.phase) * 0.2 + 1;
            const size = orb.size * breathe;
            
            // Multi-layer intense glow
            for (let layer = 0; layer < 4; layer++) {
                const layerSize = size * (1.2 - layer * 0.2);
                const layerOpacity = orb.intensity * (1 - layer * 0.2);
                
                const gradient = this.ctx.createRadialGradient(
                    orb.x, orb.y, 0,
                    orb.x, orb.y, layerSize
                );
                
                const brightness = 60 + Math.sin(this.time * 0.002 + index) * 15;
                
                gradient.addColorStop(0, `hsla(${orb.hue}, 80%, ${brightness}%, ${layerOpacity})`);
                gradient.addColorStop(0.3, `hsla(${orb.hue}, 75%, ${brightness - 10}%, ${layerOpacity * 0.7})`);
                gradient.addColorStop(0.6, `hsla(${orb.hue}, 70%, ${brightness - 20}%, ${layerOpacity * 0.4})`);
                gradient.addColorStop(1, `hsla(${orb.hue}, 65%, ${brightness - 30}%, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(orb.x, orb.y, layerSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    // Advanced particles dengan connection lines & magnetic effect
    drawParticles() {
        // Mouse interaction effect
        if (this.mouse.active) {
            this.particles.forEach(particle => {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200;
                    particle.x += dx * force * particle.magneticPull;
                    particle.y += dy * force * particle.magneticPull;
                }
            });
        }
        
        // Draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.drift.x;
            particle.y += particle.drift.y;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            particle.phase += particle.speed;
            const pulse = (Math.sin(particle.phase) + 1) * 0.5;
            const opacity = particle.baseOpacity * (0.7 + pulse * 0.3);
            
            const hue = 260 + (particle.y / this.canvas.height) * 40;
            const brightness = 70 + pulse * 20;
            
            // Particle core
            this.ctx.fillStyle = `hsla(${hue}, 90%, ${brightness}%, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Intense glow
            const glowSize = particle.size * 10 * particle.glowIntensity;
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glowSize
            );
            
            gradient.addColorStop(0, `hsla(${hue}, 95%, ${brightness}%, ${opacity})`);
            gradient.addColorStop(0.3, `hsla(${hue}, 90%, ${brightness - 5}%, ${opacity * 0.6})`);
            gradient.addColorStop(0.7, `hsla(${hue}, 85%, ${brightness - 10}%, ${opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Connection lines (optimized - only check nearby particles)
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particle.connectRadius) {
                    const lineOpacity = (1 - distance / particle.connectRadius) * 0.3;
                    const gradient = this.ctx.createLinearGradient(
                        particle.x, particle.y,
                        other.x, other.y
                    );
                    
                    gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${lineOpacity})`);
                    gradient.addColorStop(1, `hsla(${hue + 20}, 80%, 60%, ${lineOpacity})`);
                    
                    this.ctx.strokeStyle = gradient;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
    }
    
    // Ambient gradient overlay
    drawAmbient() {
        const gradient1 = this.ctx.createRadialGradient(
            this.canvas.width * 0.3, this.canvas.height * 0.4, 0,
            this.canvas.width * 0.3, this.canvas.height * 0.4, this.canvas.width * 0.6
        );
        gradient1.addColorStop(0, 'rgba(138, 43, 226, 0.08)');
        gradient1.addColorStop(1, 'rgba(138, 43, 226, 0)');
        
        this.ctx.fillStyle = gradient1;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const gradient2 = this.ctx.createRadialGradient(
            this.canvas.width * 0.7, this.canvas.height * 0.6, 0,
            this.canvas.width * 0.7, this.canvas.height * 0.6, this.canvas.width * 0.5
        );
        gradient2.addColorStop(0, 'rgba(168, 85, 247, 0.06)');
        gradient2.addColorStop(1, 'rgba(168, 85, 247, 0)');
        
        this.ctx.fillStyle = gradient2;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        this.time++;
        
        // Optimized fade trail
        this.ctx.fillStyle = 'rgba(13, 13, 13, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render layers untuk depth effect
        this.drawAmbient();
        this.drawNebula();
        this.drawStars();
        this.drawEnergyFields();
        this.drawWaves();
        this.drawOrbs();
        this.drawParticles();
        
        // Frame rate optimization - 60fps target
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// INITIALIZE
// ============================================
console.log('✨ Loading Next-Level Premium Background...');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
} else {
    initBackground();
}

function initBackground() {
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        new PremiumBackground();
        console.log('🎨 Next-Level Premium Background Active!');
    } else {
        console.error('❌ Canvas not found!');
    }
}

export { PremiumBackground };