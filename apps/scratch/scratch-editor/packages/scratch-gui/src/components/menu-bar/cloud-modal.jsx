import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ModalComponent from '../modal/modal.jsx';
import Button from '../button/button.jsx';

import styles from './cloud-modal.css';

const CloudModal = props => {
    const { mode, isOpen, onClose, onSave, onLoad, defaultName } = props;
    const [projects, setProjects] = useState([]);
    const [inputName, setInputName] = useState(defaultName || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const apiUrl = `${window.location.protocol}//${window.location.hostname}:8012/api/projects`;
            fetch(apiUrl)
                .then(res => res.json())
                .then(data => {
                    setProjects(data.projects || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load projects list', err);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!inputName.trim()) return;
        if (mode === 'save') {
             onSave(inputName.trim());
        } else {
             onLoad(inputName.trim());
        }
    };

    const handleSelectProject = (name) => {
        setInputName(name);
    };

    if (!isOpen) return null;

    const title = mode === 'save' ? 'Save Project to Cloud' : 'Load Project from Cloud';

    return (
        <ModalComponent
            contentLabel={title}
            onRequestClose={onClose}
            className={styles.modalContent}
            headerClassName={styles.header}
        >
            <div className={styles.body}>
                <div className={styles.listContainer}>
                    <div className={styles.listHeader}>Available Projects in Cloud</div>
                    {loading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        <ul className={styles.projectList}>
                            {projects.length === 0 ? (
                                <li className={styles.emptyItem}>No projects found</li>
                            ) : (
                                projects.map(p => (
                                    <li 
                                        key={p} 
                                        className={classNames(styles.projectItem, {
                                            [styles.selectedItem]: p === inputName
                                        })}
                                        onClick={() => handleSelectProject(p)}
                                    >
                                        {p}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>
                        {mode === 'save' ? 'Project Name:' : 'Selected Project:'}
                    </label>
                    <input 
                        type="text" 
                        value={inputName} 
                        onChange={e => setInputName(e.target.value)}
                        className={styles.nameInput}
                        placeholder="Enter project name..."
                    />
                </div>

                <div className={styles.actionContainer}>
                    <Button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.confirmButton}
                        onClick={handleConfirm}
                        disabled={!inputName.trim()}
                    >
                        {mode === 'save' ? 'Save' : 'Load'}
                    </Button>
                </div>
            </div>
        </ModalComponent>
    );
};

CloudModal.propTypes = {
    mode: PropTypes.oneOf(['save', 'load']).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onLoad: PropTypes.func,
    defaultName: PropTypes.string
};

export default CloudModal;
