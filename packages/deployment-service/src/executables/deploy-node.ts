import { PipelineEntity } from './../entities/pipeline.entity'
import { TaskEntity } from './../entities/task.entity'
import { ExecutableType } from './executable'

export const deployNode: ExecutableType = (task: TaskEntity, pipeline: PipelineEntity): Promise<boolean> => {
  console.log('executable', task, pipeline)

  return Promise.resolve(true)
}
