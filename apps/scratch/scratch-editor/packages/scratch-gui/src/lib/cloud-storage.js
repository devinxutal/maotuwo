/**
 * Cloud Storage API client for Scratch project save/load
 */

// Use environment-specific API URL
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'http://8.130.44.101:8012' 
  : 'http://localhost:8012';

/**
 * Save project to cloud
 * @param {string} filename - Project name
 * @param {Blob} projectBlob - Scratch project Blob from vm.saveProjectSb3()
 * @returns {Promise<object>} Save result
 */
export const saveProjectToCloud = async (filename, projectBlob) => {
    // Create form data to send the blob
    const formData = new FormData();
    formData.append('project', projectBlob, `${filename}.sb3`);
    
    const response = await fetch(`${API_BASE}/api/projects/${encodeURIComponent(filename)}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save project');
    }

    return response.json();
};

/**
 * List all saved projects
 * @returns {Promise<Array>} List of projects
 */
export const listCloudProjects = async () => {
    const response = await fetch(`${API_BASE}/api/projects/list`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to list projects');
    }

    const data = await response.json();
    return data.projects;
};

/**
 * Load project from cloud
 * @param {string} filename - Project filename
 * @returns {Promise<Blob>} Project data as Blob
 */
export const loadProjectFromCloud = async (filename) => {
    const response = await fetch(`${API_BASE}/api/projects/load/${encodeURIComponent(filename)}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load project');
    }

    // Return as Blob for the VM to load
    return response.blob();
};

/**
 * Delete project from cloud
 * @param {string} filename - Project filename
 * @returns {Promise<object>} Delete result
 */
export const deleteProjectFromCloud = async (filename) => {
    const response = await fetch(`${API_BASE}/api/projects/delete/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
    }

    return response.json();
};
