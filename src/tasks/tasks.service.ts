import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}
    logger = new Logger(TasksService.name);
    async listTasks() {
        const tasks = await this.tasksRepository.find();

        return tasks;
    }

    async getTask(id: string) {
        this.logger.log(`Getting task with ID: ${id}`);
        try {
            const task = await this.tasksRepository
                .createQueryBuilder('task')
                .where(`task.id = "${id}"`)
                .getOne();

            return task;
        } catch (e) {
            this.logger.error(`Error getting task with ID: ${id}`);
            throw e;
        }
    }

    async getFullTask(id: string) {
        this.logger.log(`Getting full task with ID: ${id}`);
        try {
            const task = await this.tasksRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.owner', 'owner')
                .where(`task.id = "${id}"`)
                .getOne();
            return task;
        } catch (e) {
            this.logger.error(`Error getting full task with ID: ${id}`);
            throw e;
        }
    }

    async editTask(body: any) {
        try {
            this.logger.log(`Editing task with ID: ${body.id}`);
            await this.tasksRepository.update(body.id, body);

            const editedTask = await this.getTask(body.id);

            return editedTask;
        } catch (e) {
            this.logger.error(`Error editing task with ID: ${body.id}`);
            throw e;
        }
    }
}
