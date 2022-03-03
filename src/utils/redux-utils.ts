import {useDispatch} from "react-redux";
import {AppDispatchType} from "../state/types";

export const useAppDispatch = () => useDispatch<AppDispatchType>();