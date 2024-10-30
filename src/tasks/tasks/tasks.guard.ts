import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { th } from '@faker-js/faker/.';

/**
 * This guard checks if the user owns the task they are trying to access
 */

@Injectable()
export class TasksGuard implements CanActivate {
    constructor(private tasksService: TasksService) {}
    logger = new Logger(TasksGuard.name);
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request['user']?.id;
        const taskId = request.params.id || request.body.id;

        if (!userId) {
            this.logger.error('User not authenticated');
            throw new ForbiddenException('User not authenticated');
        }

        if (!taskId) {
            this.logger.error('Task ID not provided');
            throw new NotFoundException('Task ID not provided');
        }

        try {
            const task = await this.tasksService.getFullTask(taskId);
            if (!task) {
                this.logger.error('Task not found');
                throw new NotFoundException('Task not found');
            }

            //* Check if the user owns the task
            if (task.owner.id !== userId) {
                this.logger.error('The user does not own this task');
                throw new ForbiddenException('You do not own this task');
            }
            this.logger.log('User owns this task');
            return true;
        } catch (error) {
            throw error;
        }
    }
}
