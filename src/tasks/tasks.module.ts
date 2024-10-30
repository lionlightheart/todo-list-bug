import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { TasksGuard } from './tasks/tasks.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), AuthModule],
    controllers: [TasksController],
    providers: [TasksService, AuthGuard, TasksGuard],
})
export class TasksModule {}
