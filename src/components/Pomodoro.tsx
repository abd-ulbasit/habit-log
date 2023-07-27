import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { api } from '~/utils/api';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Minus, Plus, Settings } from 'lucide-react';
import { Input } from './ui/input';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PomodoroProps {
    // initialTime: number; // Initial time in seconds
}
enum SessionType {
    "WORK",
    "Break"
}

const Pomodoro: React.FC<PomodoroProps> = ({ }) => {
    const addpomodoro = api.habit.addPomodoroSession.useMutation();
    const [workMin, setWorkMin] = useState<number>(20)
    const [isRunning, setIsRunning] = useState(false);
    const [sessionType, setSessionType] = useState<SessionType>(SessionType.WORK); // Work session or break
    const [timeRemaining, setTimeRemaining] = useState(workMin * 60);

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
    useEffect(() => {
        setTimeRemaining(workMin * 60)
    }, [workMin])
    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeRemaining(workMin * 60); // Reset to the initial time
    };

    const handleCycleComplete = () => {
        setIsRunning(false);
        if (sessionType == SessionType.WORK) {
            console.log("add to db");
            addpomodoro.mutate()
            //Store Session in db if logged in !
        }
        // Send a request to the backend to mark the cycle as completed in the database
        // const cycleType = sessionType ? 'work' : 'break';
        // axios.post('/api/cycles', { type: cycleType });
        setSessionType((prev) => { return prev == SessionType.Break ? SessionType.WORK : SessionType.Break })
        setTimeRemaining(() => {
            if (sessionType === SessionType.Break) {
                return workMin * 60
            } else {
                return 5 * 60
            }
        })
        setIsRunning(true)
    };

    return (
        <div className='p-8 flex relative flex-col gap-4 border rounded-3xl shadow-lg scale-110'>

            <p className='text-center uppercase inline'>{sessionType == SessionType.Break ? "Break" : "Work"}</p>
            <div className='fixed right-6 top-6' >
                <AlertDialog >
                    <AlertDialogTrigger ><Settings></Settings></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Change Pomodoro Timings</AlertDialogTitle>
                            <AlertDialogDescription>
                                <h2 className='text-lg font-bold'>Change Work Duration</h2>
                                <div className='flex gap-2'>
                                    <Button onClick={() => setWorkMin((prev) => prev - 1)}><Minus></Minus></Button>
                                    <Input type={'number'} value={workMin} onChange={(e) => setWorkMin(e.currentTarget.valueAsNumber)}></Input>
                                    <Button onClick={() => setWorkMin((prev) => prev + 1)}><Plus></Plus></Button>
                                </div>
                                {/* <input type='number'> </input> */}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <p className='text-9xl font-extrabold text-center'>{`${Math.floor(timeRemaining / 60)}:${('0' + (timeRemaining % 60)).slice(-2)}`}</p>
            <div className='self-center scale-125 gap-2   '>

                {isRunning ? (
                    <Button onClick={handlePause}>Pause</Button>
                ) : (
                    <Button onClick={handleStart}>Start</Button>
                )}
                <Button onClick={handleReset} variant={'ghost'}>Reset</Button>
            </div>
        </div >
    );
};

export default Pomodoro;
