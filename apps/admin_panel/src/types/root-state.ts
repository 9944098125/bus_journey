import { GlobalState } from 'app/slice/types';

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  globalApi: any;
  global?: GlobalState;
}
