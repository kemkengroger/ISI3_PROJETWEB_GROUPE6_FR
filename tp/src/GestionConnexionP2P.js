import Peer from 'peerjs';

class PeerService {
  constructor() {
    this.peer = null;
    this.currentCall = null;
    this.localStream = null;
    this.dataConnection = null;
  }

  // Initialiser le peer avec un ID unique
  async initializePeer(userId) {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(userId, {
        host: 'peerjs-server.com', // Ou votre propre serveur PeerJS
        port: 443,
        path: '/',
        secure: true
      });

      this.peer.on('open', (id) => {
        console.log('Mon Peer ID:', id);
        resolve(id);
      });

      this.peer.on('error', (error) => {
        console.error('Erreur Peer:', error);
        reject(error);
      });

      // Recevoir un appel entrant
      this.peer.on('call', (call) => {
        this.handleIncomingCall(call);
      });

      // Écouter les connexions de données entrantes
      this.listenForDataConnections();
    });
  }

  // Démarrer la caméra et le micro
  async getLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return this.localStream;
    } catch (error) {
      console.error('Erreur accès média:', error);
      throw error;
    }
  }

  // Appeler un tuteur
  async callTutor(tutorPeerId) {
    if (!this.localStream) {
      await this.getLocalStream();
    }

    this.currentCall = this.peer.call(tutorPeerId, this.localStream);

    return new Promise((resolve, reject) => {
      this.currentCall.on('stream', (remoteStream) => {
        console.log('Stream distant reçu');
        resolve(remoteStream);
      });

      this.currentCall.on('error', (error) => {
        console.error('Erreur appel:', error);
        reject(error);
      });
    });
  }

  // Gérer un appel entrant
  async handleIncomingCall(call) {
    if (!this.localStream) {
      await this.getLocalStream();
    }

    // Répondre à l'appel avec notre stream
    call.answer(this.localStream);
    this.currentCall = call;

    call.on('stream', (remoteStream) => {
      // Afficher le stream distant
      const event = new CustomEvent('remoteStreamReceived', {
        detail: { stream: remoteStream }
      });
      window.dispatchEvent(event);
    });
  }

  // Établir une connexion de données pour le chat
  connectForChat(remotePeerId) {
    this.dataConnection = this.peer.connect(remotePeerId);

    this.dataConnection.on('open', () => {
      console.log('Connexion de données établie');
    });

    this.dataConnection.on('data', (data) => {
      // Recevoir un message
      const event = new CustomEvent('messageReceived', {
        detail: { message: data }
      });
      window.dispatchEvent(event);
    });

    return this.dataConnection;
  }

  // Écouter les connexions de données entrantes
  listenForDataConnections() {
    this.peer.on('connection', (conn) => {
      this.dataConnection = conn;

      conn.on('data', (data) => {
        const event = new CustomEvent('messageReceived', {
          detail: { message: data }
        });
        window.dispatchEvent(event);
      });

      conn.on('open', () => {
        console.log('Connexion de données entrante établie');
      });
    });
  }

  // Envoyer un message texte
  sendMessage(message) {
    if (this.dataConnection && this.dataConnection.open) {
      this.dataConnection.send({
        type: 'chat',
        text: message,
        timestamp: new Date().toISOString(),
        sender: this.peer.id
      });
      return true;
    }
    return false;
  }

  // Envoyer des données du tableau blanc
  sendWhiteboardData(drawingData) {
    if (this.dataConnection && this.dataConnection.open) {
      this.dataConnection.send({
        type: 'whiteboard',
        data: drawingData
      });
    }
  }

  // Terminer l'appel
  endCall() {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  // Détruire la connexion peer
  destroy() {
    this.endCall();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export default new PeerService();