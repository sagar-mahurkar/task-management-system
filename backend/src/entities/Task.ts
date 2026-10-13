import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

@Entity({ name: "tasks" })
@Check(
  "CHK_tasks_status",
  `"status" IN ('pending', 'in_progress', 'completed')`,
)
@Check(
  "CHK_tasks_priority",
  `"priority" IN ('low', 'medium', 'high')`,
)
@Index("IDX_tasks_user_id", ["user"])
@Index("IDX_tasks_user_status", ["user", "status"])
@Index("IDX_tasks_user_priority", ["user", "priority"])
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "varchar",
    length: 20,
    default: "pending",
  })
  status!: TaskStatus;

  @Column({
    type: "varchar",
    length: 10,
    default: "medium",
  })
  priority!: TaskPriority;

  @Column({
    name: "due_date",
    type: "date",
    nullable: true,
  })
  dueDate!: string | null;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}