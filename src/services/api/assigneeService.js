const mockAssignees = [
  { Id: 1, name: "John Doe", email: "john.doe@company.com", role: "Developer", avatar: "👨‍💻" },
  { Id: 2, name: "Jane Smith", email: "jane.smith@company.com", role: "Designer", avatar: "👩‍🎨" },
  { Id: 3, name: "Mike Johnson", email: "mike.johnson@company.com", role: "Manager", avatar: "👨‍💼" },
  { Id: 4, name: "Sarah Wilson", email: "sarah.wilson@company.com", role: "Tester", avatar: "👩‍🔬" },
  { Id: 5, name: "David Brown", email: "david.brown@company.com", role: "DevOps", avatar: "👨‍🚀" }
];

let assignees = [...mockAssignees];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assigneeService = {
  async getAll() {
    await delay(200);
    return [...assignees];
  },

  async getById(id) {
    await delay(150);
    const assignee = assignees.find(a => a.Id === parseInt(id));
    return assignee ? { ...assignee } : null;
  },

  async create(assigneeData) {
    await delay(300);
    
    // Validate required fields
    if (!assigneeData.name || !assigneeData.email) {
      throw new Error('Name and email are required');
    }

    // Check for duplicate email
    const existingAssignee = assignees.find(a => 
      a.email.toLowerCase() === assigneeData.email.toLowerCase()
    );
    if (existingAssignee) {
      throw new Error('An assignee with this email already exists');
    }

    const maxId = Math.max(...assignees.map(a => a.Id), 0);
    const newAssignee = {
      Id: maxId + 1,
      name: assigneeData.name.trim(),
      email: assigneeData.email.trim().toLowerCase(),
      role: assigneeData.role || 'Member',
      avatar: assigneeData.avatar || '👤',
      createdAt: new Date().toISOString()
    };
    
    assignees.push(newAssignee);
    return { ...newAssignee };
  },

  async update(id, updates) {
    await delay(250);
    const index = assignees.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignees[index] = { ...assignees[index], ...updates };
      return { ...assignees[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(200);
    const index = assignees.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = assignees.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};