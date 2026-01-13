import peerService from './peer-service.js';

class Whiteboard {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.currentColor = '#000000';
    this.lineWidth = 2;
    this.tool = 'pen'; // pen, eraser
    
    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    // Adapter la taille du canvas
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    // Style par défaut
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  setupEventListeners() {
    // Événements souris
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Événements tactiles (pour mobile)
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDrawing(e.touches[0]);
    });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.draw(e.touches[0]);
    });
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  startDrawing(e) {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
  }

  draw(e) {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Dessiner localement
    this.drawLine(this.lastX, this.lastY, x, y, this.currentColor, this.lineWidth, this.tool);

    // Envoyer les données au pair distant
    peerService.sendWhiteboardData({
      action: 'draw',
      startX: this.lastX,
      startY: this.lastY,
      endX: x,
      endY: y,
      color: this.currentColor,
      width: this.lineWidth,
      tool: this.tool
    });

    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  drawLine(x1, y1, x2, y2, color, width, tool) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    this.ctx.lineWidth = tool === 'eraser' ? width * 3 : width;
    this.ctx.stroke();
  }

  // Recevoir et dessiner les données distantes
  drawRemote(data) {
    this.drawLine(data.startX, data.startY, data.endX, data.endY, data.color, data.width, data.tool);
  }

  // Changer de couleur
  setColor(color) {
    this.currentColor = color;
    this.tool = 'pen';
  }

  // Changer l'épaisseur du trait
  setLineWidth(width) {
    this.lineWidth = width;
  }

  // Activer la gomme
  setEraser() {
    this.tool = 'eraser';
  }

  // Effacer tout le tableau
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Envoyer l'action de nettoyage
    peerService.sendWhiteboardData({
      action: 'clear'
    });
  }
}

export default Whiteboard;