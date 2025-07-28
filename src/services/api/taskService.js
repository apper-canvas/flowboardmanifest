import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async getByProjectId(projectId) {
    await delay(250);
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

async create(taskData) {
    await delay(400);
    const maxId = Math.max(...tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      assignee: taskData.assignee || "",
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

async update(id, updates) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const updatedTask = { 
        ...tasks[index], 
        ...updates,
        assignee: updates.assignee !== undefined ? updates.assignee : tasks[index].assignee
      };
      
      // Handle completion timestamp
      if (updates.status === "done" && tasks[index].status !== "done") {
        updatedTask.completedAt = new Date().toISOString();
      } else if (updates.status !== "done") {
        updatedTask.completedAt = null;
      }
      
      tasks[index] = updatedTask;
      return { ...updatedTask };
    }
    return null;
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async updateStatus(id, status) {
    await delay(300);
    return this.update(id, { status });
  },

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return tasks
      .filter(task => 
        task.title.toLowerCase().includes(lowercaseQuery) ||
        task.description.toLowerCase().includes(lowercaseQuery)
      )
      .map(t => ({ ...t }));
  }
};