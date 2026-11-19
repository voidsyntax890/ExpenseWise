const DeleteConfirmation = ({
    transaction,
    onCancel,
    onConfirm,
    deleting
}) => {
    if (!transaction) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <section
                className="confirmation-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
            >
                <div className="confirmation-icon">
                    !
                </div>

                <h2 id="delete-dialog-title">
                    Delete transaction?
                </h2>

                <p>
                    Are you sure you want to delete
                    <strong> {transaction.title}</strong>?
                    This action cannot be undone.
                </p>

                <div className="confirmation-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="danger-button"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete transaction"}
                    </button>

                </div>
            </section>
        </div>
    );
};

export default DeleteConfirmation;