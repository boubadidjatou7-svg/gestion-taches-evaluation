import api from './axios';

export async function getTasks() {
  const { data } = await api.get('/tasks');
  return data;
}

export async function createTask({ title, description }) {
  const { data } = await api.post('/tasks', { title, description });
  return data;
}

export async function updateTask(id, { title, description, status }) {
  const { data } = await api.put(`/tasks/${id}`, { title, description, status });
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}
