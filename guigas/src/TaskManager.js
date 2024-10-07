import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../src/css/TaskManager.css';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Pendente Cabaço' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Erro ao buscar tarefas.');
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const addTask = async () => {
    if (newTask.title.trim() === '' || newTask.description.trim() === '') {
      alert('Título e descrição são obrigatórios.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'Pendente Cabaço' });
      setSuccessMessage('Tarefa adicionada com sucesso!');
      setError('');
    } catch (error) {
      setError('Erro ao adicionar tarefa.');
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const updateTask = async (id) => {
    const taskToUpdate = tasks.find(task => task.ID_Note === id);
    
    if (!taskToUpdate) {
      setError('Tarefa não encontrada.');
      return;
    }
  
    const updatedStatus = taskToUpdate.Statuss === 'Pendente Cabaço' ? 'Concluido Cabaço' : 'Pendente Cabaço';
    
    const updatedTask = { 
      title: taskToUpdate.Titulo, // Ajustado para o nome correto
      description: taskToUpdate.Descricao, // Ajustado para o nome correto
      status: updatedStatus // Ajustado para o nome correto
    };
  
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      setError('Erro ao atualizar tarefa: ' + error.response?.data?.message || error.message || 'Erro desconhecido');
      console.error('Erro ao atualizar tarefa:', error);
    }
  };
  
  const deleteTask = async (id) => {
    if (window.confirm('Você realmente deseja excluir esta tarefa?')) {
      try {
        await axios.delete(`http://localhost:3001/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        setError('Erro ao excluir tarefa.');
        console.error('Erro ao excluir tarefa:', error);
      }
    }
  };

  return (
    <div className="task-manager">
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <input
        type="text"
        placeholder="Título"
        value={newTask.title}
        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
      />
      <textarea
        placeholder="Descrição"
        value={newTask.description}
        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
      />
      <button onClick={addTask} disabled={!newTask.title || !newTask.description}>Adicionar Tarefa</button>
      <ul>
        {tasks.map(task => (
          <li key={task.ID_Note} className="task-item">
            <strong>ID: {task.ID_Note}</strong> - <strong>{task.Titulo}</strong> - {task.Descricao} - {task.Statuss}
            <div className="task-actions">
              <button onClick={() => updateTask(task.ID_Note)}>Alterar Status</button>
              <button onClick={() => deleteTask(task.ID_Note)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
