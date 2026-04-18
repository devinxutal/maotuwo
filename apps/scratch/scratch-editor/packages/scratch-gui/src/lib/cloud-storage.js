/**
 * Cloud Storage API client for Scratch project save/load
 * 
 * Development: Calls localhost:8012 directly
 * Production: Uses relative paths for Nginx proxy
 */

// Detect if we're in development mode (running on localhost:8011)
const isDevelopment = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    const port = window.location.port;
    // Development: localhost or 127.0.0.1 on port 8011
    return (hostname === 'localhost' || hostname === '127.0.0.1') && port === '8011';
};

// API base URL: development uses direct backend URL, production uses relative path
const getApiBase = () => {
    if (isDevelopment()) {
        return 'http://localhost:8012/api';
    }
    // Production: use relative path, Nginx will proxy /api to backend
    return '/api';
};

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
    
    const response = await fetch(`${getApiBase()}/projects/${encodeURIComponent(filename)}`, {
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
    const response = await fetch(`${getApiBase()}/projects/list`);

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
    const response = await fetch(`${getApiBase()}/projects/load/${encodeURIComponent(filename)}`);

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
    const response = await fetch(`${getApiBase()}/projects/delete/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
    }

    return response.json();
};
