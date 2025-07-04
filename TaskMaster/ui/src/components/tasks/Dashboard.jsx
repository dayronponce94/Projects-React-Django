import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Spinner, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTasks, completeTask, deleteTask, incompleteTask } from '../../services/taskService';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskEditForm from './TaskEditForm';
import Pagination from '../common/Pagination';
import { Modal } from 'react-bootstrap';

function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        const pageParam = searchParams.get('page');
        if (pageParam) {
            const page = parseInt(pageParam);
            if (!isNaN(page)) {
                setPagination(prev => ({
                    ...prev,
                    currentPage: page
                }));
            }
        }
    }, []);

    const fetchTasks = async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            const filters = {};
            if (activeTab === 'completed') filters.completed = 'true';
            if (activeTab === 'pending') filters.completed = 'false';

            const data = await getTasks(
                currentUser.token,
                filters,
                pagination.currentPage
            );

            setTasks(data.results);

            setPagination({
                currentPage: data.current_page || 1,
                totalPages: data.total_pages || 1,
                totalTasks: data.count || 0
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        fetchTasks();
    }, [currentUser, activeTab, pagination.currentPage]);

    useEffect(() => {
        if (pagination.currentPage > 1) {
            searchParams.set('page', pagination.currentPage);
        } else {
            searchParams.delete('page');
        }
        setSearchParams(searchParams);
    }, [pagination.currentPage]);


    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;

        window.scrollTo(0, 0);

        setPagination(prev => ({
            ...prev,
            currentPage: newPage
        }));
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            if (task.completed) {
                await incompleteTask(taskId, currentUser.token);
            } else {
                await completeTask(taskId, currentUser.token);
            }
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            setError(`Error: ${error.message}`);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId, currentUser.token);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            setError(`Error: ${error.message}`);
        } finally {
            setShowDeleteModal(false);
        }
    };

    const requestDeleteConfirmation = (taskId) => {
        setTaskToDelete(taskId);
        setShowDeleteModal(true);
    };

    const handleTaskCreated = () => {
        setShowForm(false);
        fetchTasks();
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowEditForm(true);
    };

    const handleTaskUpdated = () => {
        fetchTasks();
    };

    if (!currentUser) return null;

    return (
        <Container>
            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                </Alert>
            )}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 className="fw-bold text-primary">Task Dashboard</h1>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={() => setShowForm(true)}
                        className="shadow-sm"
                    >
                        <i className="bi bi-plus-lg me-2"></i> New Task
                    </Button>
                </Col>
            </Row>

            <TaskForm
                show={showForm}
                onHide={() => setShowForm(false)}
                onTaskCreated={handleTaskCreated}
            />

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="all" title="All Tasks" />
                <Tab eventKey="pending" title="Pending" />
                <Tab eventKey="completed" title="Completed" />
            </Tabs>

            <TaskEditForm
                show={showEditForm}
                task={editingTask}
                onHide={() => setShowEditForm(false)}
                onTaskUpdated={handleTaskUpdated}
            />

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Loading tasks...</p>
                </div>
            ) : (
                <>
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="lead">Are you sure you want to delete this task?</p>
                            <p className="text-muted">This action cannot be undone.</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleDeleteTask(taskToDelete)}
                            >
                                Delete Task
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <TaskList
                        tasks={tasks}
                        onComplete={handleCompleteTask}
                        onDelete={requestDeleteConfirmation}
                        onEdit={handleEditTask}
                    />

                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalTasks={pagination.totalTasks}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </Container>
    );
}

export default Dashboard;