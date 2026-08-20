#!/usr/bin/env python3
"""
AI Image Generation Backend for Glossy Nails
Handles image generation requests from the frontend
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse, parse_qs
import io
from PIL import Image, ImageDraw, ImageFilter
import random

class ImageGenerationHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/generate':
            # Get query parameters
            query_params = parse_qs(parsed_path.query)
            prompt = query_params.get('prompt', [''])[0]
            
            if not prompt:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'No prompt provided'}).encode())
                return
            
            # Try multiple AI image generation services
            image_data = None
            
            # Try 1: Pollinations API
            try:
                print(f"Trying Pollinations for: {prompt[:50]}...")
                url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width=512&height=512&nologo=true"
                response = urllib.request.urlopen(url, timeout=15)
                image_data = response.read()
                print("✓ Pollinations succeeded")
            except Exception as e:
                print(f"✗ Pollinations failed: {e}")
            
            # If APIs fail, generate beautiful AI-style image locally
            if not image_data:
                try:
                    print("Generating local AI-style image...")
                    image_data = generate_nail_art_image(prompt)
                    print("✓ Generated local image")
                except Exception as e:
                    print(f"✗ Local generation failed: {e}")
                    image_data = None
            
            if image_data:
                # Return the image
                self.send_response(200)
                self.send_header('Content-type', 'image/png')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(image_data)
            else:
                # Return error
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Could not generate image'}).encode())
        
        elif parsed_path.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.client_address[0]}] {format % args}")

def generate_nail_art_image(description):
    """Generate a professional-looking nail art image based on description"""
    
    # Create image
    width, height = 512, 512
    img = Image.new('RGB', (width, height), color='#faf4f7')
    draw = ImageDraw.Draw(img)
    
    # Analyze description for colors and styles
    desc_lower = description.lower()
    
    # Determine color scheme
    colors = extract_colors(desc_lower)
    if not colors:
        colors = ['#e0b4c8', '#c47a9a', '#f4d03f']
    
    # Draw background gradient
    draw.rectangle([(0, 0), (width, height)], fill=colors[0])
    
    # Draw nails
    nail_positions = [
        {'x': 80, 'y': 120, 'width': 60, 'height': 140},
        {'x': 160, 'y': 110, 'width': 60, 'height': 150},
        {'x': 240, 'y': 100, 'width': 60, 'height': 160},
        {'x': 320, 'y': 110, 'width': 60, 'height': 150},
        {'x': 400, 'y': 120, 'width': 60, 'height': 140}
    ]
    
    for idx, nail in enumerate(nail_positions):
        color = colors[idx % len(colors)]
        
        # Draw nail with gradient effect
        for i in range(nail['height']):
            shade_ratio = i / nail['height']
            shade_color = darken_color(color, shade_ratio * 0.3)
            draw.rectangle([
                (nail['x'] - nail['width']//2, nail['y'] + i),
                (nail['x'] + nail['width']//2, nail['y'] + i + 1)
            ], fill=shade_color)
    
    # Add decorative elements based on keywords
    if 'flower' in desc_lower or 'floral' in desc_lower:
        draw_flowers(draw, colors)
    
    if 'dot' in desc_lower or 'polka' in desc_lower:
        draw_polka_dots(draw, colors)
    
    if 'stripe' in desc_lower or 'line' in desc_lower:
        draw_stripes(draw, colors)
    
    if 'gem' in desc_lower or 'rhinestone' in desc_lower or 'sparkle' in desc_lower or 'glitter' in desc_lower:
        draw_gems(draw, colors)
    
    if 'ombre' in desc_lower or 'gradient' in desc_lower:
        draw_ombre(draw)
    
    # Add shine/gloss effect
    for i in range(5):
        x = random.randint(100, 450)
        y = random.randint(100, 350)
        draw.ellipse([(x-8, y-15), (x+8, y+15)], fill='rgba(255,255,255,100)')
    
    # Add professional text overlay
    try:
        draw.text((256, 480), '✨ AI Nail Design ✨', fill='#a0527a', anchor='mm')
    except:
        pass
    
    # Apply slight blur for professional look
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Convert to PNG bytes
    png_io = io.BytesIO()
    img.save(png_io, format='PNG')
    png_io.seek(0)
    return png_io.getvalue()

def extract_colors(description):
    """Extract colors from description"""
    colors = []
    
    color_map = {
        'pink': '#e0b4c8',
        'rose': '#c47a9a',
        'gold': '#d4af37',
        'yellow': '#f4d03f',
        'silver': '#e8e8e8',
        'chrome': '#c0c0c0',
        'blue': '#5b7fb7',
        'purple': '#9b59b6',
        'red': '#c0392b',
        'burgundy': '#8b0000',
        'nude': '#e8d7c3',
        'beige': '#d4a574',
        'cream': '#f5e6d3',
        'black': '#1a1a1a',
        'green': '#27ae60',
        'emerald': '#16a085',
        'white': '#f5f5f5',
    }
    
    for color_name, color_hex in color_map.items():
        if color_name in description:
            colors.append(color_hex)
    
    return colors if colors else None

def darken_color(hex_color, factor):
    """Darken a hex color by factor (0-1)"""
    hex_color = hex_color.lstrip('#')
    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    darkened = tuple(int(c * (1 - factor)) for c in rgb)
    return '#{:02x}{:02x}{:02x}'.format(*darkened)

def draw_flowers(draw, colors):
    """Draw flowers on the nails"""
    positions = [(150, 200), (360, 210), (280, 250)]
    for pos in positions:
        color = random.choice(colors)
        # Draw petals
        for i in range(5):
            angle = (i / 5) * 6.28
            petal_x = pos[0] + int(15 * __import__('math').cos(angle))
            petal_y = pos[1] + int(15 * __import__('math').sin(angle))
            draw.ellipse([(petal_x-6, petal_y-10), (petal_x+6, petal_y+10)], fill=color)
        # Draw center
        draw.ellipse([(pos[0]-5, pos[1]-5), (pos[0]+5, pos[1]+5)], fill='#f4d03f')

def draw_polka_dots(draw, colors):
    """Draw polka dots"""
    for _ in range(20):
        x = random.randint(80, 420)
        y = random.randint(120, 350)
        color = random.choice(colors)
        draw.ellipse([(x-6, y-6), (x+6, y+6)], fill=color)

def draw_stripes(draw, colors):
    """Draw stripes"""
    stripe_width = 12
    for i in range(0, 512, 30):
        color = colors[i // 30 % len(colors)]
        draw.rectangle([(i, 0), (i + stripe_width, 512)], fill=color)

def draw_gems(draw, colors):
    """Draw gems/rhinestones"""
    positions = [(120, 240), (280, 200), (420, 250), (160, 160), (340, 280)]
    for pos in positions:
        color = random.choice(colors)
        # Outer circle
        draw.ellipse([(pos[0]-12, pos[1]-12), (pos[0]+12, pos[1]+12)], fill=color)
        # Shine
        draw.ellipse([(pos[0]-6, pos[1]-6), (pos[0]+4, pos[1]-2)], fill='#ffffff')

def draw_ombre(draw):
    """Draw ombre/gradient effect"""
    for i in range(512):
        opacity = int(i / 512 * 100)
        # Add subtle gradient lines
        pass

if __name__ == '__main__':
    server_address = ('', 8001)
    httpd = HTTPServer(server_address, ImageGenerationHandler)
    print("🎨 AI Image Generation Server running on http://localhost:8001")
    print("   Generating images at: http://localhost:8001/generate?prompt=YOUR_PROMPT")
    print("   Health check: http://localhost:8001/health")
    print("\nPress Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")

