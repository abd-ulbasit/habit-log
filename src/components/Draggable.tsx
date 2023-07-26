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
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - startPosX;
                const deltaY = e.clientY - startPosY;
                setCurrentPosX(currentPosX + deltaX);
                setCurrentPosY(currentPosY + deltaY);
                setStartPosX(e.clientX);
                setStartPosY(e.clientY);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
        };

        if (isDragging) {
            document.body.style.cursor = 'grabbing';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, currentPosX, currentPosY, startPosX, startPosY]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartPosX(e.clientX);
        setStartPosY(e.clientY);
    };

    useEffect(() => {
        // Update the positions when the initial position prop changes
        setCurrentPosX(initialPosition.x);
        setCurrentPosY(initialPosition.y);
    }, [initialPosition]);

    return (
        <div
            className="relative transition-transform duration-300"
            onMouseDown={handleMouseDown}
            style={{ transform: `translate(${currentPosX}px, ${currentPosY}px)` }}
        >
            {children}
        </div>
    );
};

export default Draggable;
