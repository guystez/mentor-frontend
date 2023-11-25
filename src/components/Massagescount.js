// MassagesCount.js
import React from 'react';

function MassagesCount({ massages, currentUser }) {
    const filteredMessages = massages.filter(
        massage => massage.manager && !massage.read_by_users.includes(currentUser)
    );

    return (
        <span className={filteredMessages.length > 0 ? "task-count" : ""}>
            {filteredMessages.length > 0 ? `${filteredMessages.length}` : ""}
        </span>
    );
}

export default MassagesCount;
