import React from 'react';
import { Eye, GlobeIcon, Pencil, Trash2 } from 'lucide-react';

interface RowActionsProps
{
    /** Called when View button is clicked */
    onView?: () => void;

    /** Called when Edit button is clicked */
    onEdit?: () => void;

    /** Called when Delete button is clicked */
    onDelete?: () => void;

    onAddChild?: () => void;

    /** Whether to show the buttons */
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    showAddChild?: boolean;

    /** Custom titles for tooltips */
    viewTitle?: string;
    editTitle?: string;
    deleteTitle?: string;
    addTitle?: string;

    /** Custom className for wrapper */
    className?: string;
}

/**
 * A reusable row action button group component.
 */
const RowActions: React.FC<RowActionsProps> = ({
    onView,
    onEdit,
    onDelete,
    onAddChild,
    showView = true,
    showEdit = true,
    showDelete = true,
    showAddChild = true,
    viewTitle = 'View Details',
    editTitle = 'Edit',
    deleteTitle = 'Delete',
    addTitle = "Add",
    className = '',
}) =>
{
    return (
        <div className={`flex justify-center gap-2 ${className}`}>
            {showView && (
                <button
                    onClick={onView}
                    className="p-1.5 rounded-md hover:bg-info/30 text-info transition-colors"
                    title={viewTitle}
                >
                    <Eye size={16} />
                </button>
            )}
            {showEdit && (
                <button
                    onClick={onEdit}
                    className="p-1.5 rounded-md hover:bg-warning/30 text-warning transition-colors"
                    title={editTitle}
                >
                    <Pencil size={16} />
                </button>
            )}
            {showDelete && (
                <button
                    onClick={onDelete}
                    className="p-1.5 rounded-md hover:bg-error/30 text-error transition-colors"
                    title={deleteTitle}
                >
                    <Trash2 size={16} />
                </button>
            )}
            {showAddChild && (
                <button
                    onClick={onAddChild}
                    className="p-1.5 rounded-md hover:bg-warning/30 text-warning transition-colors"
                    title={addTitle}
                >
                    <GlobeIcon size={16} />
                </button>
            )}
        </div>
    );
};

export default RowActions;
