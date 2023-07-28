import React, { useState, useEffect } from 'react';

interface DraggableProps {
    children: React.ReactNode;
    initialPosition: { x: number; y: number };
    resetPositions: () => void;
    isDraggable: boolean; // New prop to indicate whether the element is draggable or not
}

const DRAG_DELAY_MS = 300; // Adjust the delay as needed

const Draggable: React.FC<DraggableProps> = ({ children, initialPosition, resetPositions, isDraggable }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPosX, setStartPosX] = useState(0);
    const [startPosY, setStartPosY] = useState(0);
    const [currentPosX, setCurrentPosX] = useState(initialPosition.x);
    const [currentPosY, setCurrentPosY] = useState(initialPosition.y);
    const [isTouchHold, setIsTouchHold] = useState(false);
    const [touchDelayTimer, setTouchDelayTimer] = useState<number | null>(null);

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging) {
                const clientX = 'touches' in e ? e.touches[0]!.clientX : e.clientX;
                const clientY = 'touches' in e ? e.touches[0]!.clientY : e.clientY;
                const deltaX = clientX - startPosX;
                const deltaY = clientY - startPosY;
                setCurrentPosX(currentPosX + deltaX);
                setCurrentPosY(currentPosY + deltaY);
                setStartPosX(clientX);
                setStartPosY(clientY);
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
            setIsTouchHold(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            document.body.style.cursor = 'grabbing';
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('touchmove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, currentPosX, currentPosY, startPosX, startPosY]);

    const handleStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!isDraggable) return; // If not draggable, do nothing

        if (isTouchHold) {
            // Touch delay timer already started, prevent default behavior
            e.preventDefault();
            return;
        }

        if ('touches' in e) {
            // Touch event
            setTouchDelayTimer(window.setTimeout(() => {
                setIsDragging(true);
                setIsTouchHold(true);
                const clientX = e.touches[0]!.clientX;
                const clientY = e.touches[0]!.clientY;
                setStartPosX(clientX);
                setStartPosY(clientY);
            }, DRAG_DELAY_MS));
        } else {
            // Mouse event
            setIsDragging(true);
            setStartPosX(e.clientX);
            setStartPosY(e.clientY);
        }
    };

    const handleCancel = () => {
        if (touchDelayTimer !== null) {
            clearTimeout(touchDelayTimer);
            setTouchDelayTimer(null); // Reset the timer
        }
        setIsDragging(false);
        setIsTouchHold(false);
    };

    useEffect(() => {
        // Update the positions when the initial position prop changes
        setCurrentPosX(initialPosition.x);
        setCurrentPosY(initialPosition.y);
    }, [initialPosition]);

    return (
        <div
            className={`relative transition-transform duration-300 ${isTouchHold ? 'border-2 border-blue-500' : ''}`}
            onMouseDown={isDraggable ? handleStart : undefined}
            onTouchStart={isDraggable ? handleStart : undefined}
            onTouchCancel={isDraggable ? handleCancel : undefined}
            onTouchEnd={isDraggable ? handleCancel : undefined}
            style={{ transform: `translate(${currentPosX}px, ${currentPosY}px)` }}
        >
            {children}
        </div>
    );
};

export default Draggable;
