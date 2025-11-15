/**
 * Task interface/model
 * TypeScript interface defining the structure of a Task object
 * Used for type checking and data transfer
 */
export interface Task {
  /** Unique identifier for the task */
  id: number;
  /** Title/name of the task */
  title: string;
  /** Whether the task is completed or not */
  completed: boolean;
}
