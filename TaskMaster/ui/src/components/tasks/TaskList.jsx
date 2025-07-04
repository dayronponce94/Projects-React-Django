import React from 'react';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';

function TaskList({ tasks, onComplete, onDelete, onEdit }) {
    const getPriorityBadge = (priority) => {
        const variants = {
            high: 'danger',
            medium: 'warning',
            low: 'success'
        };
        return <Badge bg={variants[priority]} className="ms-2">{priority}</Badge>;
    };

    const getDueDateStyle = (dueDate) => {
        if (!dueDate) return {};

        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        if (due < today) {
            return { color: 'red', fontWeight: 'bold' };
        }
        return {};
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="task-list">
            {tasks.length === 0 ? (
                <Card className="text-center p-4 border-dashed">
                    <Card.Body>
                        <i className="bi bi-check2-circle display-4 text-muted mb-3"></i>
                        <h5>No tasks found</h5>
                        <p className="text-muted">Create your first task to get started!</p>
                    </Card.Body>
                </Card>
            ) : (
                <ListGroup>
                    {tasks.map(task => (
                        <ListGroup.Item
                            key={task.id}
                            className={`d-flex justify-content-between align-items-center py-3 task-${task.priority}`}
                        >
                            <div className="d-flex align-items-center">
                                <Button
                                    variant={task.completed ? "success" : "outline-secondary"}
                                    size="sm"
                                    className="me-3"
                                    onClick={() => onComplete(task.id)}
                                    style={{ minWidth: '32px' }}
                                >
                                    {task.completed ? "✓" : ""}
                                </Button>

                                <div>
                                    <h5 className="mb-1">
                                        {task.title}
                                        {!task.completed && getPriorityBadge(task.priority)}
                                        {task.completed && (
                                            <Badge bg="success" className="ms-2">Completed</Badge>
                                        )}
                                    </h5>
                                    <p className="mb-1 text-muted">{task.description}</p>
                                    <small style={getDueDateStyle(task.due_date)}>
                                        <i className="bi bi-calendar me-1"></i>
                                        {formatDate(task.due_date)}
                                    </small>
                                </div>
                            </div>

                            <div>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(task)}
                                >
                                    <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onDelete(task.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}

export default TaskList;