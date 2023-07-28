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
    const [breakMin, setBreakMin] = useState<number>(5)
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
        setSessionType(SessionType.WORK)
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
                return breakMin * 60
            }
        })
        setIsRunning(true)
    };
    const MINIMUN_BREAK = 2
    const MINIMUM_WORK = 5
    return (
        <div className='p-8 flex relative flex-col gap-4 border rounded-3xl shadow-lg sm:scale-110 w-4/5 self-center sm:w-auto'>

            <p className='text-center uppercase inline'>{sessionType == SessionType.Break ? "Break" : "Work"}</p>
            <div className='fixed right-6 top-6' >
                <AlertDialog >
                    <AlertDialogTrigger ><Settings></Settings></AlertDialogTrigger>
                    <AlertDialogContent>
                        <form onSubmit={e => e.preventDefault()}>

                            <AlertDialogHeader>
                                <AlertDialogTitle>Change Pomodoro Timings</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <h2 className='py-3 font-bold'>Change Work Duration</h2>
                                    <div className='flex gap-2'>
                                        <Button onClick={() => setWorkMin((prev) => prev > MINIMUM_WORK ? prev - 1 : prev)}><Minus></Minus></Button>
                                        <Input type={'number'} value={workMin} onChange={(e) => setWorkMin(e.currentTarget.valueAsNumber)} min={MINIMUM_WORK}></Input>
                                        <Button onClick={() => setWorkMin((prev) => prev + 1)}><Plus></Plus></Button>
                                    </div>
                                    <h2 className='py-3 font-bold'>Change Break Duration</h2>
                                    <div className='flex gap-2 pb-4'>
                                        <Button onClick={() => setBreakMin((prev) => prev > MINIMUN_BREAK ? prev - 1 : prev)}><Minus></Minus></Button>
                                        <Input type={'number'} value={breakMin} onChange={(e) => setBreakMin(e.currentTarget.valueAsNumber)} min={MINIMUN_BREAK}></Input>
                                        <Button onClick={() => setBreakMin((prev) => prev + 1)}><Plus></Plus></Button>
                                    </div>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction type='submit' disabled={breakMin < MINIMUN_BREAK || workMin < MINIMUM_WORK || isNaN(breakMin) || isNaN(workMin)} >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <p className=' text-7xl md:text-9xl font-extrabold text-center'>{`${Math.floor(timeRemaining / 60)}:${('0' + (timeRemaining % 60)).slice(-2)}`}</p>
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
