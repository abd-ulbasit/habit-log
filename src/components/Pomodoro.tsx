import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
// import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PomodoroProps {
    // initialTime: number; // Initial time in seconds
}
enum SessionType {
    "WORK",
    "Break"
}

const Pomodoro: React.FC<PomodoroProps> = ({ }) => {
    const initialTime = 30;
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
            //Store Session in db if logged in !
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
        <div className='p-8 flex flex-col gap-4 border rounded-3xl shadow-lg scale-110'>
            <p className='text-center uppercase '>{sessionType == SessionType.Break ? "Break" : "Work"}</p>
            <p className='text-9xl font-extrabold text-center'>{`${Math.floor(timeRemaining / 60)}:${('0' + (timeRemaining % 60)).slice(-2)}`}</p>
            <div className='self-center scale-125 gap-2   '>

                {isRunning ? (
                    <Button onClick={handlePause}>Pause</Button>
                ) : (
                    <Button onClick={handleStart}>Start</Button>
                )}
                <Button onClick={handleReset} variant={'ghost'}>Reset</Button>
            </div>
        </div>
    );
};

export default Pomodoro;
