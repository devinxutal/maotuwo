import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import Modal from '../../containers/modal.jsx';
import {listCloudProjects, deleteProjectFromCloud} from '../../lib/cloud-storage.js';
import styles from './cloud-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: '保存到云端',
        description: 'Title for save to cloud modal',
        id: 'gui.cloudModal.saveTitle'
    },
    filenameLabel: {
        defaultMessage: '项目名称',
        description: 'Label for filename input',
        id: 'gui.cloudModal.filenameLabel'
    },
    existingFilesLabel: {
        defaultMessage: '已存在的项目（点击覆盖）：',
        description: 'Label for existing files list',
        id: 'gui.cloudModal.existingFilesLabel'
    },
    saveButton: {
        defaultMessage: '保存',
        description: 'Save button text',
        id: 'gui.cloudModal.saveButton'
    },
    cancelButton: {
        defaultMessage: '取消',
        description: 'Cancel button text',
        id: 'gui.cloudModal.cancelButton'
    },
    saving: {
        defaultMessage: '保存中...',
        description: 'Saving in progress text',
        id: 'gui.cloudModal.saving'
    },
    success: {
        defaultMessage: '保存成功！',
        description: 'Save success message',
        id: 'gui.cloudModal.success'
    },
    error: {
        defaultMessage: '保存失败，请重试。',
        description: 'Save error message',
        id: 'gui.cloudModal.error'
    },
    confirmOverwrite: {
        defaultMessage: '"{filename}" 已存在，是否覆盖？',
        description: 'Confirm overwrite message',
        id: 'gui.cloudModal.confirmOverwrite'
    },
    confirmOverwriteYes: {
        defaultMessage: '覆盖',
        description: 'Confirm overwrite yes button',
        id: 'gui.cloudModal.confirmOverwriteYes'
    },
    confirmOverwriteNo: {
        defaultMessage: '取消',
        description: 'Confirm overwrite no button',
        id: 'gui.cloudModal.confirmOverwriteNo'
    },
    deleteButton: {
        defaultMessage: '删除',
        description: 'Delete button text',
        id: 'gui.cloudModal.deleteButton'
    }
});

class SaveCloudModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            filename: props.defaultFilename || '',
            projects: [],
            status: 'idle', // idle, saving, success, error
            overwriteConfirm: null, // null or filename
            isLoading: true
        };
    }

    componentDidMount () {
        this.loadProjects();
    }

    loadProjects = async () => {
        try {
            const projects = await listCloudProjects();
            this.setState({ projects, isLoading: false });
        } catch (error) {
            this.setState({ isLoading: false });
        }
    };

    handleFilenameChange = (e) => {
        this.setState({ filename: e.target.value, overwriteConfirm: null });
    };

    handleSelectExisting = (project) => {
        this.setState({
            filename: project.filename.replace('.sb3', ''),
            overwriteConfirm: project.filename
        });
    };

    handleSave = async () => {
        const { filename } = this.state;
        if (!filename.trim()) return;

        const fullFilename = filename.trim();
        const existingProject = this.state.projects.find(
            p => p.filename === `${fullFilename}.sb3`
        );

        if (existingProject && !this.state.overwriteConfirm) {
            // Show overwrite confirmation
            this.setState({ overwriteConfirm: existingProject.filename });
            return;
        }

        this.setState({ status: 'saving', overwriteConfirm: null });

        try {
            await this.props.onSave(fullFilename);
            this.setState({ status: 'success' });
            // Refresh project list
            await this.loadProjects();
            setTimeout(() => {
                this.props.onClose();
            }, 1000);
        } catch (error) {
            this.setState({ status: 'error' });
        }
    };

    handleDelete = async (filename, e) => {
        e.stopPropagation();
        if (!confirm(`确定要删除 "${filename}" 吗？`)) return;

        try {
            await deleteProjectFromCloud(filename);
            // Refresh list
            await this.loadProjects();
            // Clear filename if it matches the deleted file
            if (this.state.filename === filename.replace('.sb3', '')) {
                this.setState({ filename: '', overwriteConfirm: null });
            }
        } catch (error) {
            alert('删除失败：' + error.message);
        }
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSave();
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
        const { filename, projects, status, overwriteConfirm, isLoading } = this.state;
        const trimmedFilename = filename.trim();

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
                    <label className={styles.label}>
                        <FormattedMessage {...messages.filenameLabel} />
                    </label>
                    <input
                        className={styles.input}
                        type="text"
                        value={filename}
                        onChange={this.handleFilenameChange}
                        onKeyDown={this.handleKeyDown}
                        placeholder="输入项目名称"
                        disabled={status === 'saving'}
                        autoFocus
                    />
                    
                    {overwriteConfirm && (
                        <div className={styles.confirmOverwrite}>
                            <div className={styles.confirmOverwriteText}>
                                <FormattedMessage
                                    {...messages.confirmOverwrite}
                                    values={{ filename: overwriteConfirm }}
                                />
                            </div>
                            <div className={styles.confirmButtons}>
                                <button
                                    className={styles.cancelOverwriteButton}
                                    onClick={() => this.setState({ overwriteConfirm: null })}
                                >
                                    <FormattedMessage {...messages.confirmOverwriteNo} />
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={this.handleSave}
                                >
                                    <FormattedMessage {...messages.confirmOverwriteYes} />
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className={styles.successMessage}>
                            <FormattedMessage {...messages.success} />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className={styles.errorMessage}>
                            <FormattedMessage {...messages.error} />
                        </div>
                    )}
                    
                    <label className={styles.existingFilesLabel}>
                        <FormattedMessage {...messages.existingFilesLabel} />
                    </label>
                    
                    {isLoading ? (
                        <div className={styles.loadingMessage}>加载中...</div>
                    ) : projects.length === 0 ? (
                        <div className={styles.emptyMessage}>暂无保存的项目</div>
                    ) : (
                        <ul className={styles.projectList}>
                            {projects.map(project => (
                                <li
                                    key={project.filename}
                                    className={`${styles.projectItem} ${
                                        trimmedFilename && 
                                        `${trimmedFilename}.sb3` === project.filename 
                                            ? styles.selected : ''
                                    }`}
                                    onClick={() => this.handleSelectExisting(project)}
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
                                            onClick={(e) => this.handleDelete(project.filename, e)}
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
                        disabled={status === 'saving'}
                    >
                        <FormattedMessage {...messages.cancelButton} />
                    </Button>
                    <Button
                        className={styles.saveButton}
                        onClick={this.handleSave}
                        disabled={!trimmedFilename || status === 'saving'}
                    >
                        {status === 'saving' ? (
                            <FormattedMessage {...messages.saving} />
                        ) : (
                            <FormattedMessage {...messages.saveButton} />
                        )}
                    </Button>
                </Box>
            </Modal>
        );
    }
}

SaveCloudModal.propTypes = {
    defaultFilename: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default injectIntl(SaveCloudModal);
