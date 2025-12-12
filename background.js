// ============================================
// OPTIMIZED LIGHTWEIGHT BACKGROUND
// Reduced effects for better performance
// ============================================

class OptimizedBackground {
    constructor() {
        this.canvas = document.getElementById('backgroundCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        
        // Reduced visual elements
        this.particles = [];
        this.orbs = [];
        this.stars = [];
        
        // Animation State
        this.time = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createVisualElements();
        this.animate();
        
        // Optimized resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.createVisualElements();
            }, 250);
        });
    }
    
    createVisualElements() {
        this.createStars();
        this.createParticles();
        this.createOrbs();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // ==================== STARS (Reduced) ====================
    createStars() {
        this.stars = [];
        const count = 80; // Reduced from 150
        
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.2 + 0.3,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    drawStars() {
        this.stars.forEach(star => {
            star.phase += star.twinkleSpeed;
            const twinkle = (Math.sin(star.phase) + 1) * 0.5;
            const currentOpacity = star.opacity * twinkle;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    // ==================== PARTICLES (Reduced) ====================
    createParticles() {
        this.particles = [];
        const count = 40; // Reduced from 80
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                baseOpacity: Math.random() * 0.5 + 0.2,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.015 + 0.008,
                drift: {
                    x: (Math.random() - 0.5) * 0.3,
                    y: (Math.random() - 0.5) * 0.3
                }
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach((particle, i) => {
            particle.x += particle.drift.x;
            particle.y += particle.drift.y;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            particle.phase += particle.speed;
            const pulse = (Math.sin(particle.phase) + 1) * 0.5;
            const opacity = particle.baseOpacity * (0.7 + pulse * 0.3);
            
            const hue = 260 + (particle.y / this.canvas.height) * 40;
            
            // Simple particle without heavy glow
            this.ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Simplified connections (only nearby particles)
            for (let j = i + 1; j < Math.min(i + 5, this.particles.length); j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const lineOpacity = (1 - distance / 100) * 0.15;
                    this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${lineOpacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        });
    }
    
    // ==================== ORBS (Simplified) ====================
    createOrbs() {
        this.orbs = [];
        const positions = [
            { x: 0.2, y: 0.3 },
            { x: 0.8, y: 0.7 }
        ]; // Reduced from 4 to 2
        
        positions.forEach((pos, i) => {
            this.orbs.push({
                x: this.canvas.width * pos.x,
                y: this.canvas.height * pos.y,
                size: 180 + i * 20,
                speed: {
                    x: (Math.random() - 0.5) * 0.1,
                    y: (Math.random() - 0.5) * 0.1
                },
                hue: 260 + i * 20,
                phase: Math.random() * Math.PI * 2,
                intensity: 0.08 + i * 0.02
            });
        });
    }
    
    drawOrbs() {
        this.orbs.forEach(orb => {
            orb.x += orb.speed.x;
            orb.y += orb.speed.y;
            
            const margin = 150;
            if (orb.x < margin || orb.x > this.canvas.width - margin) orb.speed.x *= -1;
            if (orb.y < margin || orb.y > this.canvas.height - margin) orb.speed.y *= -1;
            
            orb.phase += 0.008;
            const breathe = Math.sin(orb.phase) * 0.15 + 1;
            const size = orb.size * breathe;
            
            // Single layer instead of 3
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, size
            );
            
            gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 50%, ${orb.intensity})`);
            gradient.addColorStop(0.5, `hsla(${orb.hue}, 65%, 45%, ${orb.intensity * 0.5})`);
            gradient.addColorStop(1, `hsla(${orb.hue}, 60%, 40%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    // ==================== ANIMATION ====================
    animate() {
        this.time++;
        
        // Clear with slight fade
        this.ctx.fillStyle = 'rgba(13, 13, 13, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render only essential layers
        this.drawStars();
        this.drawOrbs();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Cleanup method
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize
function initBackground() {
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        new OptimizedBackground();
        console.log('✨ Optimized Background Active');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
} else {
    initBackground();
}

export { OptimizedBackground };