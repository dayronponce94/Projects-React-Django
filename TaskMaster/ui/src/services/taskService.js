const API_URL = 'http://localhost:8000/api/tasks';

export const createTask = async (taskData, token) => {
    const response = await fetch(`${API_URL}/create/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return await response.json();
};

export const getTasks = async (token, filters = {}, page = 1) => {

    const params = { ...filters, page };
    const queryParams = new URLSearchParams(params).toString();

    const response = await fetch(`${API_URL}/list/?${queryParams}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return await response.json();
};

export const updateTask = async (id, taskData, token) => {
    const response = await fetch(`${API_URL}/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return await response.json();
};

export const deleteTask = async (id, token) => {
    const response = await fetch(`${API_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }

    return true;
};


export const completeTask = async (id, token) => {
    const response = await fetch(`${API_URL}/${id}/complete/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to complete task');
    }

    return await response.json();
};

export const incompleteTask = async (id, token) => {
    const response = await fetch(`${API_URL}/${id}/incomplete/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to mark task as incomplete');
    }

    return await response.json();
};