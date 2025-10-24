import { Server as SocketServer } from 'socket.io';
import { MultiAIOrchestrator } from './multi-ai-orchestrator';

interface CollaborationSession {
  projectId: string;
  users: Map<string, UserPresence>;
  edits: Edit[];
}

interface UserPresence {
  userId: string;
  name: string;
  cursor: { x: number; y: number };
  currentFile: string;
  color: string;
}

interface Edit {
  userId: string;
  timestamp: Date;
  file: string;
  changes: any;
}

export class CollaborationManager {
  private sessions = new Map<string, CollaborationSession>();
  private orchestrator = new MultiAIOrchestrator();

  constructor(private io: SocketServer) {
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join-project', ({ projectId, userId, userName }) => {
        this.handleUserJoin(socket, projectId, userId, userName);
      });

      socket.on('cursor-move', ({ projectId, x, y }) => {
        this.handleCursorMove(socket, projectId, x, y);
      });

      socket.on('file-edit', async ({ projectId, file, changes }) => {
        await this.handleFileEdit(socket, projectId, file, changes);
      });

      socket.on('disconnect', () => {
        this.handleUserLeave(socket);
      });
    });
  }

  private handleUserJoin(socket: any, projectId: string, userId: string, userName: string) {
    if (!this.sessions.has(projectId)) {
      this.sessions.set(projectId, {
        projectId,
        users: new Map(),
        edits: []
      });
    }

    const session = this.sessions.get(projectId)!;
    session.users.set(userId, {
      userId,
      name: userName,
      cursor: { x: 0, y: 0 },
      currentFile: '',
      color: this.generateUserColor()
    });

    socket.join(projectId);

    // Notify others
    socket.to(projectId).emit('user-joined', {
      userId,
      userName,
      color: session.users.get(userId)!.color
    });

    // Send current users to new user
    socket.emit('current-users', Array.from(session.users.values()));
  }

  private handleCursorMove(socket: any, projectId: string, x: number, y: number) {
    const session = this.sessions.get(projectId);
    if (!session) return;

    const userId = this.getUserIdFromSocket(socket);
    const user = session.users.get(userId);
    if (user) {
      user.cursor = { x, y };
      socket.to(projectId).emit('cursor-update', { userId, x, y });
    }
  }

  private async handleFileEdit(socket: any, projectId: string, file: string, changes: any) {
    const session = this.sessions.get(projectId);
    if (!session) return;

    const userId = this.getUserIdFromSocket(socket);

    // Check for conflicts
    const recentEdits = session.edits.filter(
      e => e.file === file && Date.now() - e.timestamp.getTime() < 5000
    );

    if (recentEdits.length > 1) {
      // Multiple users editing same file - AI conflict resolution
      const resolved = await this.resolveConflict(file, recentEdits, changes);
      
      // Broadcast resolved version
      this.io.to(projectId).emit('conflict-resolved', {
        file,
        resolution: resolved,
        message: 'AI resolved conflicting edits'
      });
    } else {
      // No conflict, broadcast edit
      socket.to(projectId).emit('file-updated', { file, changes, userId });
    }

    // Record edit
    session.edits.push({
      userId,
      timestamp: new Date(),
      file,
      changes
    });

    // Keep only recent edits
    session.edits = session.edits.filter(
      e => Date.now() - e.timestamp.getTime() < 60000
    );
  }

  private async resolveConflict(
    file: string,
    edits: Edit[],
    newChanges: any
  ): Promise<string> {
    const result = await this.orchestrator.execute(
      `Resolve this merge conflict:

FILE: ${file}
EDIT 1: ${JSON.stringify(edits[0].changes)}
EDIT 2: ${JSON.stringify(newChanges)}

Merge these changes intelligently, keeping the best from both.
Return the resolved code.`,
      'architecture'
    );

    return result.response;
  }

  private handleUserLeave(socket: any) {
    // Implementation to handle user leaving
  }

  private getUserIdFromSocket(socket: any): string {
    // Implementation to get user ID from socket
    return '';
  }

  private generateUserColor(): string {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
