import {ActionCreatorsMapObject, bindActionCreators} from "@reduxjs/toolkit"
import {useMemo} from "react";
import {useAppDispatch} from "../store";


export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
  const dispath = useAppDispatch();

  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispath)
  }, [actions, dispath]);

  return boundActions;
};