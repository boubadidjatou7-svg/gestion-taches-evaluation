const {
  getTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../models/taskModel');

const VALID_STATUSES = ['En attente', 'En cours', 'Terminé'];

async function getTasks(req, res) {
  try {
    const tasks = await getTasksByUser(req.userId);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function addTask(req, res) {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const taskId = await createTask(title, description, status, req.userId);
    res.status(201).json({ message: 'Tâche créée avec succès', taskId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function editTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ message: 'Titre et statut requis' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const existingTask = await getTaskById(id, req.userId);
    if (!existingTask) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    await updateTask(id, req.userId, { title, description, status });
    res.json({ message: 'Tâche mise à jour avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function removeTask(req, res) {
  try {
    const { id } = req.params;

    const existingTask = await getTaskById(id, req.userId);
    if (!existingTask) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    await deleteTask(id, req.userId);
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = { getTasks, addTask, editTask, removeTask };
