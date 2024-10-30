import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksGuard } from './tasks/tasks.guard';
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @UseGuards(AuthGuard)
    @Get('')
    async listTasks() {
        return this.tasksService.listTasks();
    }

    @UseGuards(AuthGuard, TasksGuard)
    @Get('/:id')
    async getTask(@Param('id') id: string) {
        return this.tasksService.getTask(id);
    }

    @UseGuards(AuthGuard, TasksGuard)
    @Post('/edit')
    async editTask(@Body() body) {
        return this.tasksService.editTask(body);
    }
}
