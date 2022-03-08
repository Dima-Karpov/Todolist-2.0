import {useEffect, useState} from "react";
import {timeProgress} from "../consts";

export const useProgress = () => {
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, timeProgress);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return {progress}
}