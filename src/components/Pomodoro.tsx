import React, { useState, useEffect } from 'react';
// import axios from 'axios';

interface PomodoroProps {
    initialTime: number; // Initial time in seconds
}
enum SessionType {
    "WORK",
    "Break"
}

const Pomodoro: React.FC<PomodoroProps> = ({ initialTime }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [sessionType, setSessionType] = useState<SessionType>(SessionType.WORK); // Work session or break
    const [timeRemaining, setTimeRemaining] = useState(initialTime);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isRunning && timeRemaining > 0) {
            timer = setTimeout(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (timeRemaining === 0) {
            handleCycleComplete();
        }

        return () => clearTimeout(timer);
    }, [isRunning, timeRemaining]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeRemaining(initialTime); // Reset to the initial time
    };

    const handleCycleComplete = () => {
        setIsRunning(false);
        if (sessionType == SessionType.WORK) {
            //Store Session in db
        }
        // Send a request to the backend to mark the cycle as completed in the database
        // const cycleType = sessionType ? 'work' : 'break';
        // axios.post('/api/cycles', { type: cycleType });
        setSessionType((prev) => { return prev == SessionType.Break ? SessionType.WORK : SessionType.Break })
        setTimeRemaining(() => {
            if (sessionType === SessionType.Break) {
                return initialTime
            } else {
                return 5
            }
        })
        setIsRunning(true)
    };

    return (
        <div>
            <div>{sessionType == SessionType.Break ? "Break" : "Work"}</div>
            <div>{`${Math.floor(timeRemaining / 60)}:${('0' + (timeRemaining % 60)).slice(-2)}`}</div>
            {isRunning ? (
                <button onClick={handlePause}>Pause</button>
            ) : (
                <button onClick={handleStart}>Start</button>
            )}
            <button onClick={handleReset}>Reset</button>
        </div>
    );
};

export default Pomodoro;
