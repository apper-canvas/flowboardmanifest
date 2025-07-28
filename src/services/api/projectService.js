import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id));
    return project ? { ...project } : null;
  },

  async create(projectData) {
    await delay(400);
    const maxId = Math.max(...projects.map(p => p.Id), 0);
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      archived: false
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updates) {
    await delay(350);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      return { ...projects[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const deleted = projects.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async archive(id) {
    await delay(300);
    return this.update(id, { archived: true });
  },

  async unarchive(id) {
    await delay(300);
    return this.update(id, { archived: false });
  }
};