import React from 'react';

function TaskCount({ tasks }) {
    return tasks.length > 0 ? (
      <span className="task-count">{tasks.length}</span>
    ) : null;
}

export default TaskCount;
