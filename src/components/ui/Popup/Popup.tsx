'use client';
import React, { useEffect } from 'react';

export enum PopupSize
{
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

interface PopupProps
{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    size?: PopupSize;
    closeOnOverlayClick?: boolean;
}

const Popup: React.FC<PopupProps> = ({
    isOpen,
    onClose,
    children,
    className = '',
    size = PopupSize.MEDIUM,
    closeOnOverlayClick = true,
}) =>
{
    // Lock body scroll when popup is open
    useEffect(() =>
    {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () =>
        {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on ESC key
    useEffect(() =>
    {
        const handleKeyDown = (e: KeyboardEvent) =>
        {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Size configuration
    const getSizeClass = () =>
    {
        switch (size)
        {
            case PopupSize.SMALL:
                return 'max-w-sm w-[90%]';
            case PopupSize.LARGE:
                return 'max-w-3xl w-[95%]';
            default:
                return 'max-w-lg w-[90%]';
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'
                }`}
        >
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Popup content */}
            <div
                className={`
          relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          max-h-[90vh] overflow-y-auto
          ${getSizeClass()}
          ${className}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Close popup"
                >
                    ×
                </button>

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

export default Popup;
