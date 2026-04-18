import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import Modal from '../../containers/modal.jsx';
import {deleteProjectFromCloud} from '../../lib/cloud-storage.js';
import styles from './cloud-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: '从云端加载',
        description: 'Title for load from cloud modal',
        id: 'gui.cloudModal.loadTitle'
    },
    emptyMessage: {
        defaultMessage: '暂无保存的项目。',
        description: 'Message when no projects exist',
        id: 'gui.cloudModal.emptyMessage'
    },
    loadButton: {
        defaultMessage: '加载',
        description: 'Load button text',
        id: 'gui.cloudModal.loadButton'
    },
    cancelButton: {
        defaultMessage: '取消',
        description: 'Cancel button text',
        id: 'gui.cloudModal.cancelButton'
    },
    loading: {
        defaultMessage: '加载中...',
        description: 'Loading in progress text',
        id: 'gui.cloudModal.loading'
    },
    error: {
        defaultMessage: '加载项目失败。',
        description: 'Load error message',
        id: 'gui.cloudModal.loadError'
    },
    deleteButton: {
        defaultMessage: '删除',
        description: 'Delete button text',
        id: 'gui.cloudModal.deleteButton'
    },
    deleteConfirm: {
        defaultMessage: '确定要删除 "{filename}" 吗？',
        description: 'Delete confirmation message',
        id: 'gui.cloudModal.deleteConfirm'
    }
});

class LoadCloudModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            projects: [],
            selectedProject: null,
            status: 'loading', // loading, idle, error
            errorMessage: ''
        };
    }

    componentDidMount () {
        this.loadProjectList();
    }

    loadProjectList = async () => {
        try {
            const projects = await this.props.onListProjects();
            this.setState({ projects, status: 'idle' });
        } catch (error) {
            this.setState({ status: 'error', errorMessage: error.message });
        }
    };

    handleSelectProject = (project) => {
        this.setState({ selectedProject: project });
    };

    handleLoad = async () => {
        const { selectedProject } = this.state;
        if (!selectedProject) return;

        this.setState({ status: 'loading' });

        try {
            await this.props.onLoad(selectedProject.filename);
            this.props.onClose();
        } catch (error) {
            this.setState({ status: 'error', errorMessage: error.message });
        }
    };

    handleDelete = async (project, e) => {
        e.stopPropagation();
        const filename = project.filename;
        
        if (!window.confirm(`确定要删除 "${filename}" 吗？`)) return;

        try {
            await deleteProjectFromCloud(filename);
            // Refresh list
            await this.loadProjectList();
            // Clear selection if it matches the deleted file
            if (this.state.selectedProject?.filename === filename) {
                this.setState({ selectedProject: null });
            }
        } catch (error) {
            alert('删除失败：' + error.message);
        }
    };

    formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    render () {
        const { intl, onClose } = this.props;
        const { projects, selectedProject, status } = this.state;

        return (
            <Modal
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
                contentLabel={intl.formatMessage(messages.title)}
                onRequestClose={onClose}
            >
                <Box className={styles.header}>
                    <FormattedMessage {...messages.title} />
                </Box>
                
                <Box className={styles.body}>
                    {status === 'loading' && (
                        <div className={styles.loadingMessage}>
                            <FormattedMessage {...messages.loading} />
                        </div>
                    )}
                    
                    {status === 'error' && (
                        <div className={styles.errorMessage}>
                            <FormattedMessage {...messages.error} />
                        </div>
                    )}
                    
                    {status === 'idle' && projects.length === 0 && (
                        <div className={styles.emptyMessage}>
                            <FormattedMessage {...messages.emptyMessage} />
                        </div>
                    )}
                    
                    {status === 'idle' && projects.length > 0 && (
                        <ul className={styles.projectList}>
                            {projects.map(project => (
                                <li
                                    key={project.filename}
                                    className={`${styles.projectItem} ${
                                        selectedProject?.filename === project.filename ? styles.selected : ''
                                    }`}
                                    onClick={() => this.handleSelectProject(project)}
                                >
                                    <div className={styles.projectInfo}>
                                        <div className={styles.projectName}>
                                            {project.filename.replace('.sb3', '')}
                                        </div>
                                        <div className={styles.projectMeta}>
                                            {this.formatDate(project.savedAt)} · {this.formatSize(project.size)}
                                        </div>
                                    </div>
                                    <div className={styles.projectActions}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={(e) => this.handleDelete(project, e)}
                                        >
                                            <FormattedMessage {...messages.deleteButton} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>

                <Box className={styles.footer}>
                    <Button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={status === 'loading'}
                    >
                        <FormattedMessage {...messages.cancelButton} />
                    </Button>
                    <Button
                        className={styles.loadButton}
                        onClick={this.handleLoad}
                        disabled={!selectedProject || status === 'loading'}
                    >
                        {status === 'loading' ? (
                            <FormattedMessage {...messages.loading} />
                        ) : (
                            <FormattedMessage {...messages.loadButton} />
                        )}
                    </Button>
                </Box>
            </Modal>
        );
    }
}

LoadCloudModal.propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onListProjects: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired
};

export default injectIntl(LoadCloudModal);
