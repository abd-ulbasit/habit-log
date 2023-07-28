import React, { useState, useEffect } from 'react';

interface DraggableProps {
    children: React.ReactNode;
    initialPosition: { x: number; y: number };
    resetPositions: () => void;
}

const Draggable: React.FC<DraggableProps> = ({ children, initialPosition, resetPositions }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startPosX, setStartPosX] = useState(0);
    const [startPosY, setStartPosY] = useState(0);
    const [currentPosX, setCurrentPosX] = useState(initialPosition.x);
    const [currentPosY, setCurrentPosY] = useState(initialPosition.y);

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
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0]!.clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]!.clientY : e.clientY;
        setStartPosX(clientX);
        setStartPosY(clientY);
    };

    useEffect(() => {
        // Update the positions when the initial position prop changes
        setCurrentPosX(initialPosition.x);
        setCurrentPosY(initialPosition.y);
    }, [initialPosition]);

    return (
        <div
            className="relative transition-transform duration-300"
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            style={{ transform: `translate(${currentPosX}px, ${currentPosY}px)` }}
        >
            {children}
        </div>
    );
};

export default Draggable;
